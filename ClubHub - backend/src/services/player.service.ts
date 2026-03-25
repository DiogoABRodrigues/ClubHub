import Player from "../models/Player";
import Squad from "../models/Squad";

export default class PlayerService {
  async getAll() {
    return Player.findAll();
  }

  async getBySeasonId(seasonId: number) {
    const squad = await Squad.findAll({ where: { seasonId } });
    const externalIds = squad.map(s => s.playerExternalId);
    return Player.findAll({ where: { externalId: externalIds } });
  }

  async getByCurrentSeasonId() {
    const squad = await Squad.findAll({ order: [["seasonId", "DESC"]], limit: 1 });
    if (!squad.length) return [];
    const seasonId = squad[0].seasonId;
    return this.getBySeasonId(seasonId);
  }
}