import { Nota } from "../entities/Nota";
import { IRepository } from "../../contracts/IRepository";

export interface INotasRepository extends IRepository<Nota> {
  buscarPorAluno(alunoId: string): Promise<Nota[]>;
}