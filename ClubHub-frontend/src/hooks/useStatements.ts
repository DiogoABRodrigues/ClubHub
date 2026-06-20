import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { StatementService } from "../services/StatementService";
import { Statement } from "../models/Statement";

export const useStatements = () => {
  const queryClient = useQueryClient();

  // ─────────────────────────────
  // GET
  // ─────────────────────────────
  const statementsQuery = useQuery({
    queryKey: ["statements"],
    queryFn: StatementService.getActive,
    staleTime: Infinity,
  });

  // ─────────────────────────────
  // CREATE / UPDATE / DELETE
  // (tu não tens delete real, é update)
  // ─────────────────────────────
  const createStatement = useMutation({
    mutationFn: StatementService.create,
    onSuccess: (newStatement) => {
      queryClient.setQueryData(["statements"], newStatement);
    },
  });

  const updateStatement = useMutation({
    mutationFn: ({
      id,
      updates,
    }: {
      id: number;
      updates: Partial<Statement>;
    }) => StatementService.update(id, updates),

    onSuccess: (updated) => {
      queryClient.setQueryData(["statements"], updated);
    },
  });

  const deleteStatement = useMutation({
    mutationFn: ({
      id,
      updates,
    }: {
      id: number;
      updates: Partial<Statement>;
    }) => StatementService.update(id, updates),

    onSuccess: () => {
      queryClient.setQueryData(["statements"], null);
    },
  });

  return {
    statements: statementsQuery.data ? [statementsQuery.data] : [],
    loading: statementsQuery.isLoading,

    refreshStatements: () =>
      queryClient.invalidateQueries({ queryKey: ["statements"] }),

    createStatement: createStatement.mutateAsync,
    updateStatement: updateStatement.mutateAsync,
    deleteStatement: deleteStatement.mutateAsync,
  };
};
