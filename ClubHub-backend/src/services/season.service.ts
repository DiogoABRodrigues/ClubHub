import Season from "../models/Season";

export default class SeasonService {
  async getAll() {
    return Season.findAll({ order: [["id", "ASC"]] });
  }

  async getById(id: number) {
    return Season.findByPk(id);
  }

  async getCurrentSeason() {
    return Season.findOne({ order: [["id", "DESC"]] });
  }
}
