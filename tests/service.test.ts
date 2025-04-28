import { NotasService } from "../src/services/NotasService";
import { Nota } from "../src/domain/entities/Nota";

describe("NotasService", () => {
    let notasService: NotasService;
    const mockFetch = jest.fn();

    beforeEach(() => {
        notasService = new NotasService();
        global.fetch = mockFetch;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("listarNotas", () => {
        it("should fetch all notas when no alunoId is provided", async () => {
            const mockNotas: Nota[] = [
                new Nota("1", "123", "Matemática", "Professor A", 8.5, new Date("2023-01-01")),
                new Nota("2", "124", "História", "Professor B", 7.0, new Date("2023-01-02")),
            ];
            mockFetch.mockResolvedValueOnce({
                json: jest.fn().mockResolvedValueOnce(mockNotas),
            });

            const result = await notasService.listarNotas();

            expect(mockFetch).toHaveBeenCalledWith("/api/notas");
            expect(result).toEqual(mockNotas);
        });

        it("should fetch notas for a specific alunoId", async () => {
            const alunoId = "123";
            const mockNotas: Nota[] = [
                new Nota("1", alunoId, "Matemática", "Professor A", 8.5, new Date("2023-01-01")),
            ];
            mockFetch.mockResolvedValueOnce({
                json: jest.fn().mockResolvedValueOnce(mockNotas),
            });

            const result = await notasService.listarNotas(alunoId);

            expect(mockFetch).toHaveBeenCalledWith(`/api/notas?alunoId=${alunoId}`);
            expect(result).toEqual(mockNotas);
        });
    });

    describe("criarNota", () => {
        it("should create a new nota", async () => {
            const newNota = {
                alunoId: "123",
                disciplina: "Matemática",
                professor: "Professor A",
                nota: 9.0,
                criadoEm: new Date("2023-01-03"),
            };
            const createdNota: Nota = new Nota(
                "3",
                newNota.alunoId,
                newNota.disciplina,
                newNota.professor,
                newNota.nota,
                new Date("2023-01-03")
            );
            mockFetch.mockResolvedValueOnce({
                json: jest.fn().mockResolvedValueOnce(createdNota),
            });

            const result = await notasService.criarNota(newNota);

            expect(mockFetch).toHaveBeenCalledWith("/api/notas", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newNota),
            });
            expect(result).toEqual(createdNota);
        });
    });
});