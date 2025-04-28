import { IUseCase } from "../../../contracts/IUseCase";
import { INotasRepository } from "../../repositories/INotasRepository";
import { Nota } from "../../entities/Nota";

export class ConsultarNotas implements IUseCase<string, Nota[]> {
  constructor(private readonly repository: INotasRepository) {}

  async executar(alunoId?: string): Promise<Nota[]> {
    if (alunoId) {
      return this.repository.buscarPorAluno(alunoId);
    }
    return this.repository.listar();
  }
}