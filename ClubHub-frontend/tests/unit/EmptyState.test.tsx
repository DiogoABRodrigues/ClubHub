import React from "react";
import { fireEvent, render } from "@testing-library/react-native";
import { EmptyState } from "../../src/components/EmptyState";

describe("EmptyState", () => {
  it("mostra título e mensagem", () => {
    const view = render(
      <EmptyState title="Sem dados" message="Tenta novamente mais tarde." />,
    );

    expect(view.getByText("Sem dados")).toBeTruthy();
    expect(view.getByText("Tenta novamente mais tarde.")).toBeTruthy();
    expect(view.queryByText("Tentar novamente")).toBeNull();
  });

  it("executa a ação de repetição", () => {
    const onRetry = jest.fn();
    const view = render(
      <EmptyState title="Falhou" onRetry={onRetry} retryLabel="Atualizar" />,
    );

    fireEvent.press(view.getByText("Atualizar"));

    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});
