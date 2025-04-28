import { Nota } from "../../domain/entities/Nota";
import { Usuario } from "../../domain/entities/Usuario";

export class InMemoryDatabase {
  private static notas: Nota[] = [
    new Nota("1", "101", "Matemática", "Prof. Silva", 8.5),
    new Nota("2", "102", "Física", "Prof. Souza", 7.0)
  ];

  static async adicionarNota(nota: Nota): Promise<Nota> {
    this.notas.push(nota);
    return nota;
  }

  static async buscarNotaPorId(id: string): Promise<Nota | null> {
    return this.notas.find(n => n.id === id) || null;
  }

  static async buscarNotasPorAluno(alunoId: string): Promise<Nota[]> {
    return this.notas.filter(n => n.alunoId === alunoId);
  }

  static async listarTodasNotas(): Promise<Nota[]> {
    return [...this.notas];
  }

  static async removerNota(id: string): Promise<boolean> {
    const initialLength = this.notas.length;
    this.notas = this.notas.filter(n => n.id !== id);
    return this.notas.length !== initialLength;
  }

  static async atualizarNota(id: string, updates: Partial<Nota>): Promise<Nota | null> {
    const index = this.notas.findIndex(n => n.id === id);
    if (index === -1) return null;
    
    this.notas[index] = { 
      ...this.notas[index], 
      ...updates,
      id: this.notas[index].id 
    };
    
    return this.notas[index];
  }

  private static usuarios: Usuario[] = [
    new Usuario("101", "Aluno João", "aluno", "1234"),
    new Usuario("201", "Professora Ana", "professor", "abcd")
  ];

  static async adicionarUsuario(usuario: Usuario): Promise<Usuario> {
    this.usuarios.push(usuario);
    return usuario;
  }

  static async atualizarUsuario(id: string, usuarioAtualizado: Partial<Usuario>): Promise<Usuario | null> {
    const index = this.usuarios.findIndex(u => u.id === id);
    if (index === -1) return null;
    
    this.usuarios[index] = {
      ...this.usuarios[index],
      ...usuarioAtualizado
    };
    
    return this.usuarios[index];
  }

  static async buscarUsuarioPorId(id: string): Promise<Usuario | null> {
    return this.usuarios.find(u => u.id === id) || null;
  }

  static async buscarUsuarioPorCredenciais(id: string, senha: string): Promise<Usuario | null> {
    return this.usuarios.find(u => u.id === id && u.senha === senha) || null;
  }

  static async listarTodosUsuarios(): Promise<Usuario[]> {
    return [...this.usuarios];
  }

  static async removerUsuario(id: string): Promise<boolean> {
    const initialLength = this.usuarios.length;
    this.usuarios = this.usuarios.filter(u => u.id !== id);
    return this.usuarios.length !== initialLength;
  }

}