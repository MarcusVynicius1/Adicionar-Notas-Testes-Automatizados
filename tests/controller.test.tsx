import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import NotasController from "../src/infra/controllers/NotasController"; // Corrigido o nome da importação

// Mock global fetch
global.fetch = jest.fn();

const mockFetch = fetch as jest.Mock;

describe("NotasController", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("deve exibir 'Carregando...' inicialmente", () => {
    render(<NotasController />);
    expect(screen.getByText("Carregando...")).toBeInTheDocument();
  });

  it("deve exibir notas corretamente após o fetch", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [
        { id: "1", valor: 8.5 },
        { id: "2", valor: 9.0 },
      ],
    });

    render(<NotasController alunoId="123" />);

    expect(screen.getByText("Carregando...")).toBeInTheDocument();

    await waitFor(() => {
        expect(screen.getByText("Notas")).toBeInTheDocument();
        expect(screen.getByText("Nota: 8.5")).toBeInTheDocument();
        expect(screen.getByText("Nota: 9")).toBeInTheDocument(); // <-- aqui
      });
      

    expect(fetch).toHaveBeenCalledWith("/api/notas?alunoId=123");
  });

  it("deve exibir erro se o fetch falhar", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
    });

    render(<NotasController />);

    await waitFor(() => {
      expect(screen.getByText(/Erro:/)).toBeInTheDocument();
    });
  });

  it("deve exibir erro em caso de exceção no fetch", async () => {
    mockFetch.mockRejectedValueOnce(new Error("Falha na conexão"));

    render(<NotasController />);

    await waitFor(() => {
      expect(screen.getByText("Erro: Falha na conexão")).toBeInTheDocument();
    });
  });
});
