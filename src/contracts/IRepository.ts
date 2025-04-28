export interface IRepository<T> {
    criar(item: T): Promise<T>;
    atualizar(id: string, item: Partial<T>): Promise<T | null>;
    buscarPorId(id: string): Promise<T | null>;
    listar(): Promise<T[]>;
    deletar(id: string): Promise<boolean>;
  }
  