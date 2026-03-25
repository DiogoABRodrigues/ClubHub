import Team from "../models/Team";

export default class TeamService {
  async getAll() {
    return Team.findAll();
  }

  async getByName(name: string) {
    return Team.findAll({ where: { name } });
  }

}