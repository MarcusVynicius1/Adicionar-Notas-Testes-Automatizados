import { Request, Response } from "express";
import { ConsultarNotas } from "../../domain/usecases/notas/ConsultarNotas";

export class NotasController {
  constructor(private readonly consultarNotas: ConsultarNotas) {}

  async listar(req: Request, res: Response) {
    try {
      const alunoId = req.query.alunoId as string | undefined;
      const notas = await this.consultarNotas.executar(alunoId);
      res.json(notas);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar notas" });
    }
  }
}