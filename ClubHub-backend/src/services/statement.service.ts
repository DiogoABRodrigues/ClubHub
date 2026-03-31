// backend/services/statement.service.ts
import Statement from "../models/Statement";
import { Op } from "sequelize";

class StatementService {
  async createStatement(data: Partial<Statement>) {
    const now = new Date();

    // Expirar todos os statements ativos
    await Statement.update(
      { dateToExpire: now },
      {
        where: {
          [Op.or]: [
            { dateToExpire: { [Op.gt]: now } },
            { dateToExpire: null },
          ],
        },
      }
    );

    // Criar novo statement
    const statement = await Statement.create(data);

    return statement;
  }

  async updateStatement(id: number, data: Partial<Statement>) {
    const statement = await Statement.findByPk(id);
    if (!statement) throw new Error("Statement not found");
    return await statement.update(data);
  }

  async getStatementById(id: number) {
    return await Statement.findByPk(id);
  }

  async getActiveStatements() {
    const now = new Date();
    return await Statement.findAll({
      where: {
        [Op.or]: [
          { dateToExpire: { [Op.gt]: now } },
          { dateToExpire: null },
        ],
      },
    });
  }
}

export default new StatementService();
