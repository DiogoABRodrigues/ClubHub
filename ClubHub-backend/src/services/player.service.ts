import { Op } from "sequelize";
import Player from "../models/Player";
import Squad from "../models/Squad";
import Stats from "../models/Stats";
import cache from "../services/cache.service";
import { CacheKeys } from "../cache/keys";
import SeasonService from "./season.service";
import Season from "../models/Season";

const adminCacheKey = (seasonId: number, category: string) =>
  `app:players:season:${seasonId}:${category}:admin`;

async function fetchPlayersWithSquad(
  seasonId: number,
  category: string,
  includeErrors: boolean,
): Promise<any[]> {
  const squadWhere: any = { seasonId, category };
  if (!includeErrors) {
    squadWhere.status = { [Op.ne]: "error" };
  }

  return Player.findAll({
    include: [
      {
        model: Squad,
        where: squadWhere,
        attributes: ["status", "position", "number", "isFieldPlayer"],
        required: true,
      },
      {
        model: Stats,
        where: { seasonId, category },
        required: false,
      },
    ],
  }).then((players) =>
    players.map((p: any) => {
      const plain = p.toJSON();
      const squad = plain.Squad ?? plain.Squads?.[0] ?? {};
      plain.squadStatus = squad.status ?? "active";
      plain.position = squad.position ?? null;
      plain.number = squad.number ?? null;
      plain.isFieldPlayer = squad.isFieldPlayer ?? false;
      delete plain.Squad;
      delete plain.Squads;
      return plain;
    }),
  );
}

export default class PlayerService {
  async getAll() {
    return Player.findAll();
  }

  /** Frontend público — exclui jogadores com status "error", com cache Redis */
  async getBySeasonId(seasonId: number, category: string = "over19") {
    const key = CacheKeys.players.bySeason(seasonId, category);

    const cached = await cache.get(key);
    if (cached) return cached;

    const enriched = await fetchPlayersWithSquad(seasonId, category, false);

    await cache.setPermanent(key, enriched);
    return enriched;
  }

  async getByCurrentSeasonId(category: string = "over19") {
    const season = (await new SeasonService().getCurrentSeason()) as Season;
    if (!season) return [];
    return this.getBySeasonId(season.id, category);
  }

  /** Admin — inclui jogadores com status "error", com cache Redis próprio */
  async getAllBySeasonId(seasonId: number, category: string = "over19") {
    const key = adminCacheKey(seasonId, category);

    const cached = await cache.get(key);
    if (cached) return cached;

    const enriched = await fetchPlayersWithSquad(seasonId, category, true);

    await cache.setPermanent(key, enriched);
    return enriched;
  }

  async getAllStatsByPlayerId(playerId: number) {
    const key = CacheKeys.players.allStatsByPlayer(playerId);

    const cached = await cache.get(key);
    if (cached) return cached;

    const player = await Player.findByPk(playerId, {
      include: [
        {
          model: Stats,
          separate: true,
          include: [
            {
              model: Season,
              attributes: ["id", "year"],
            },
          ],
          order: [[Season, "year", "DESC"]],
        },
      ],
    });

    if (!player) return null;

    await cache.setPermanent(key, player);

    return player;
  }

  async updatePlayer(playerId: number, updates: Partial<Player>) {
    const player = await Player.findByPk(playerId);
    if (!player) throw new Error("Player not found");
    await player.update(updates);

    // Invalida caches públicos e admin para todas as seasons/categories onde o
    // jogador possa aparecer (clearPattern cobre todos os suffixes)
    await cache.clearPattern(`app:players:*`);
    await cache.del(CacheKeys.players.allStatsByPlayer(playerId));

    return player;
  }

  async updateSquadStatus(
    playerExternalId: number,
    seasonId: number,
    status: "active" | "left" | "error",
    category: string = "over19",
  ) {
    const entry = await Squad.findOne({
      where: { playerExternalId, seasonId, category },
    });
    if (!entry) throw new Error("Squad entry not found");

    await entry.update({ status });

    // Invalida cache público, admin e squad
    await cache.del(CacheKeys.players.bySeason(seasonId, category));
    await cache.del(adminCacheKey(seasonId, category));
    await cache.del(CacheKeys.squad.bySeason(seasonId, category));

    return entry;
  }
}