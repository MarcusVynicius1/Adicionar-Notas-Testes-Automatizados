import { Nota } from '../src/domain/entities/Nota';
import NotasList from '../src/presentation/components/NotasList';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';


global.fetch = jest.fn();

describe('NotasList Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render loading state initially', () => {
        render(<NotasList tipoUsuario="aluno" usuarioId="123" />);
        expect(screen.getByText(/Carregando notas.../i)).toBeInTheDocument();
    });

    it('should display error when no usuarioId is provided for aluno', async () => {
        render(<NotasList tipoUsuario="aluno" />);
        await waitFor(() => {
            expect(screen.getByText(/ID do aluno não fornecido/i)).toBeInTheDocument();
        });
    });

    it('should display error when API returns 404', async () => {
        (fetch as jest.Mock).mockResolvedValueOnce({
            ok: false,
            status: 404,
            statusText: 'Not Found',
        });

        render(<NotasList tipoUsuario="aluno" usuarioId="123" />);
        await waitFor(() => {
            expect(screen.getByText(/Nenhuma nota encontrada/i)).toBeInTheDocument();
        });
    });

    it('should display error when API returns a generic error', async () => {
        (fetch as jest.Mock).mockResolvedValueOnce({
            ok: false,
            status: 500,
            statusText: 'Internal Server Error',
        });

        render(<NotasList tipoUsuario="professor" />);
        await waitFor(() => {
            expect(screen.getByText(/Erro 500: Internal Server Error/i)).toBeInTheDocument();
        });
    });

    it('should display "Nenhuma nota encontrada" when API returns an empty array', async () => {
        (fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => [],
        });

        render(<NotasList tipoUsuario="professor" />);
        await waitFor(() => {
            expect(screen.getByText(/Nenhuma nota encontrada/i)).toBeInTheDocument();
        });
    });

    it('should render a list of notas when API returns data', async () => {
        const mockNotas: Nota[] = [
            {
                id: '1',
                alunoId: '123',
                disciplina: 'Matemática',
                professor: 'Prof. Silva',
                nota: 9.5,
                criadoEm: new Date('2023-01-01'),
            },
            {
                id: '2',
                alunoId: '124',
                disciplina: 'História',
                professor: 'Prof. Souza',
                nota: 8.0,
                criadoEm: new Date('2023-01-02'),
            },
        ];

        (fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => mockNotas,
        });

        render(<NotasList tipoUsuario="professor" />);
        await waitFor(() => {
            expect(screen.getByText(/Lista de Notas/i)).toBeInTheDocument();
            expect(screen.getByText(/Matemática/i)).toBeInTheDocument();
            expect(screen.getByText(/História/i)).toBeInTheDocument();
        });
    });
});