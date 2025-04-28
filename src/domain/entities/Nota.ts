export class Nota {
  constructor(
    public readonly id: string,
    public readonly alunoId: string,
    public readonly disciplina: string,
    public readonly professor: string,
    public readonly nota: number,
    public readonly criadoEm: Date = new Date()
  ) {}
}