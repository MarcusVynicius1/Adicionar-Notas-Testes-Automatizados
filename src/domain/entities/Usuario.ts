export class Usuario {
    constructor(
      public readonly id: string,
      public readonly nome: string,
      public readonly tipo: 'aluno' | 'professor',
      public readonly senha: string
    ) {}
  }