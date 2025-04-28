// src/infra/repositories/UsuarioRepository.ts
import { IUsuarioRepository } from "../../domain/repositories/IUsuarioRepository";
import { Usuario } from "../../domain/entities/Usuario";
import { InMemoryDatabase } from "../database/InMemoryDatabase";

export class UsuarioRepository implements IUsuarioRepository {
  async criar(usuario: Usuario): Promise<Usuario> {
    return InMemoryDatabase.adicionarUsuario(usuario);
  }

  async atualizar(id: string, usuarioAtualizado: Partial<Usuario>): Promise<Usuario | null> {
    return InMemoryDatabase.atualizarUsuario(id, usuarioAtualizado);
  }

  async buscarPorId(id: string): Promise<Usuario | null> {
    return InMemoryDatabase.buscarUsuarioPorId(id);
  }

  async buscarPorCredenciais(id: string, senha: string): Promise<Usuario | null> {
    return InMemoryDatabase.buscarUsuarioPorCredenciais(id, senha);
  }

  async listar(): Promise<Usuario[]> {
    return InMemoryDatabase.listarTodosUsuarios();
  }

  async deletar(id: string): Promise<boolean> {
    return InMemoryDatabase.removerUsuario(id);
  }
}