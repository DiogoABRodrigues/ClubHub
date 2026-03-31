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

    try {
      const statement = await Statement.create(data);
      console.log("CREATE Statement - sucesso:", statement.toJSON());
      return statement;
    } catch (error: any) {
      console.error("CREATE Statement - erro:", error.message);
      throw error;
    }
  }

  async updateStatement(id: number, data: Partial<Statement>) {
    const statement = await Statement.findByPk(id);
    if (!statement) throw new Error("Statement not found");
    return await statement.update(data);
  }

  async getStatementById(id: number) {
    return await Statement.findByPk(id);
  }

  async getActiveStatement() {
    const now = new Date();
    return await Statement.findOne({
      where: {
        [Op.or]: [
          { dateToExpire: { [Op.gt]: now } },
          { dateToExpire: null },
        ],
      },
    });
  }

  async deleteStatement(id: number) {
    const statement = await Statement.findByPk(id);
    if (!statement) throw new Error("Statement not found");
    await statement.destroy();
  }
}

export default new StatementService();
