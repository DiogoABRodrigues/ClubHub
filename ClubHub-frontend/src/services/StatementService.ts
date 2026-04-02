import { api } from "./api";
import { Statement } from "../models/Statement";

export const StatementService = {
  create: async (statement: Partial<Statement>): Promise<Statement> => {
    const { data } = await api.post("/statements", statement);
    return data;
  },

  update: async (
    id: number,
    updates: Partial<Statement>,
  ): Promise<Statement> => {
    const { data } = await api.put(`/statements/${id}`, updates);
    return data;
  },

  getActive: async (): Promise<Statement> => {
    const { data } = await api.get("/statements/");
    return data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/statements/${id}`);
  },
};
