import React, { createContext, useState, useEffect, useContext } from "react";
import { Statement } from "../models/Statement";
import { StatementService } from "../services/StatementService";

interface StatementContextType {
  statements: Statement[];
  loading: boolean;
  refreshStatements: () => Promise<void>;
  createStatement: (statement: Partial<Statement>) => Promise<void>;
  updateStatement: (id: number, updates: Partial<Statement>) => Promise<void>;
  deleteStatement: (id: number, updates: Partial<Statement>) => Promise<void>;
}

const StatementContext = createContext<StatementContextType>({
  statements: [],
  loading: true,
  refreshStatements: async () => {},
  createStatement: async () => {},
  updateStatement: async () => {},
  deleteStatement: async () => {},
});

export const StatementsProvider = ({ children }: any) => {
  const [statements, setStatements] = useState<Statement[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStatements = async () => {
    setLoading(true);
    try {
      const dbStatement = await StatementService.getActive();
      setStatements([dbStatement]);
    } catch (err) {
      console.error("Erro a buscar statement:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatements();
  }, []);

  const createStatement = async (statement: Partial<Statement>) => {
    try {
      console.log("Criando statement:", statement);
      const newStatement = await StatementService.create(statement);
      setStatements([newStatement]);
    } catch (err) {
      console.error("Erro a criar statement:", statement, err);
    }
  };

  const updateStatement = async (id: number, updates: Partial<Statement>) => {
    try {
      const updatedStatement = await StatementService.update(id, updates);
      setStatements([updatedStatement]);
    } catch (err) {
      console.error("Erro a atualizar statement:", err);
    }
  };

  const deleteStatement = async (id: number, updates: Partial<Statement>) => {
    try {
      await StatementService.update(id, updates);
      setStatements([]);
    } catch (err) {
      console.error("Erro a eliminar statement:", err);
    }
  };

  return (
    <StatementContext.Provider
      value={{
        statements,
        loading,
        refreshStatements: fetchStatements,
        createStatement,
        updateStatement,
        deleteStatement,
      }}
    >
      {children}
    </StatementContext.Provider>
  );
};

export const useStatements = () => useContext(StatementContext);
