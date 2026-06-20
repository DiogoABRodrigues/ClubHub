import Statement from "../models/Statement";
import { Op } from "sequelize";
import cache from "../services/cache.service";

const ACTIVE_STATEMENT_KEY = "app:statement:active";
const NO_ACTIVE_STATEMENT = "__none__";

class StatementService {
  async createStatement(data: Partial<Statement>) {
    const now = new Date();

    await Statement.update(
      { dateToExpire: now },
      {
        where: {
          [Op.or]: [{ dateToExpire: { [Op.gt]: now } }, { dateToExpire: null }],
        },
      },
    );

    try {
      const statement = await Statement.create(data);
      await cache.del(ACTIVE_STATEMENT_KEY);
      return statement;
    } catch (error: any) {
      console.error("CREATE Statement - erro:", error.message);
      throw error;
    }
  }

  async updateStatement(id: number, data: Partial<Statement>) {
    const statement = await Statement.findByPk(id);
    if (!statement) throw new Error("Statement not found");
    const updated = await statement.update(data);
    await cache.del(ACTIVE_STATEMENT_KEY);
    return updated;
  }

  async getStatementById(id: number) {
    return await Statement.findByPk(id);
  }

  async getActiveStatement() {
    const cached = await cache.get<Statement | string>(ACTIVE_STATEMENT_KEY);
    if (cached === NO_ACTIVE_STATEMENT) return null;
    if (cached) return cached;

    const now = new Date();
    const statement = await Statement.findOne({
      where: {
        [Op.or]: [{ dateToExpire: { [Op.gt]: now } }, { dateToExpire: null }],
      },
    });

    await cache.set(
      ACTIVE_STATEMENT_KEY,
      statement ?? NO_ACTIVE_STATEMENT,
      5 * 60,
    );

    return statement;
  }

  async deleteStatement(id: number) {
    const statement = await Statement.findByPk(id);
    if (!statement) throw new Error("Statement not found");
    await statement.destroy();
    await cache.del(ACTIVE_STATEMENT_KEY);
  }
}

export default new StatementService();
