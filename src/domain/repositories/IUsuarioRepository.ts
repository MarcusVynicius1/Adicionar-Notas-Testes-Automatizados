import { Usuario } from "../entities/Usuario";
import { IRepository } from "../../contracts/IRepository";

export interface IUsuarioRepository extends IRepository<Usuario> {
  buscarPorCredenciais(id: string, senha: string): Promise<Usuario | null>;
}