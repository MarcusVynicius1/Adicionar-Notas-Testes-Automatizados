import { Nota } from "../domain/entities/Nota";

export class NotasService {
  private readonly baseUrl = "/api";

  async listarNotas(alunoId?: string): Promise<Nota[]> {
    const url = alunoId 
      ? `${this.baseUrl}/notas?alunoId=${alunoId}`
      : `${this.baseUrl}/notas`;
    
    const response = await fetch(url);
    return await response.json();
  }

  async criarNota(nota: Omit<Nota, "id">): Promise<Nota> {
    const response = await fetch(`${this.baseUrl}/notas`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nota),
    });
    return await response.json();
  }
}