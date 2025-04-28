import { NextApiRequest, NextApiResponse } from 'next';
import { NotasRepository } from '../../../infra/repositories/NotasRepository';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { alunoId } = req.query;
  const repository = new NotasRepository();

  try {
    if (req.method === 'GET') {
      const notas = await repository.buscarPorAluno(alunoId as string);
      
      if (!notas || notas.length === 0) {
        return res.status(404).json({ message: 'Nenhuma nota encontrada para este aluno' });
      }
      
      return res.status(200).json(notas);
    }

    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ message: 'Método não permitido' });
  } catch (error) {
    console.error('Erro na API de notas do aluno:', error);
    return res.status(500).json({ message: 'Erro interno no servidor' });
  }
}