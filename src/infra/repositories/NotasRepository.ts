// NotasRepository.ts
import { INotasRepository } from "../../domain/repositories/INotasRepository";
import { Nota } from "../../domain/entities/Nota";
import { InMemoryDatabase } from "../database/InMemoryDatabase";

export class NotasRepository implements INotasRepository {
  async criar(notaData: Omit<Nota, 'id'>): Promise<Nota> {
    const novaNota = new Nota(
      Date.now().toString(),
      notaData.alunoId,
      notaData.disciplina,
      notaData.professor,
      notaData.nota
    );
    return InMemoryDatabase.adicionarNota(novaNota);
  }
  
    async buscarPorId(id: string): Promise<Nota | null> {
      return InMemoryDatabase.buscarNotaPorId(id);
    }
  
    async buscarPorAluno(alunoId: string): Promise<Nota[]> {
      return InMemoryDatabase.buscarNotasPorAluno(alunoId);
    }
  
    async listar(): Promise<Nota[]> {
      return InMemoryDatabase.listarTodasNotas();
    }
  
    async deletar(id: string): Promise<boolean> {
      return InMemoryDatabase.removerNota(id);
    }

    async atualizar(id: string, notaData: Partial<Nota>): Promise<Nota | null> {
      return InMemoryDatabase.atualizarNota(id, notaData);
    }
    
}