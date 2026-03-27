import Player from "../models/Player";
import Squad from "../models/Squad";

export default class PlayerService {
  async getAll() {
    return Player.findAll();
  }

  async getBySeasonId(seasonId: number) {
    const squad = await Squad.findAll({ where: { seasonId } });
    const externalIds = squad.map((s) => s.playerExternalId);
    return Player.findAll({ where: { externalId: externalIds } });
  }

  async getByCurrentSeasonId() {
    const squad = await Squad.findAll({ order: [["seasonId", "DESC"]] });
    if (!squad.length) return [];

    const externalIds = squad.map((s) => s.playerExternalId);

    const players = await Player.findAll({
      where: { externalId: externalIds },
    });
    return players;
  }
}
