import { NextApiRequest, NextApiResponse } from 'next';
import { NotasRepository } from '../../../infra/repositories/NotasRepository';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const repository = new NotasRepository();

  try {
    if (req.method === 'GET') {
      const notas = await repository.listar();
      return res.status(200).json(notas);
    }

    if (req.method === 'POST') {
      const novaNota = await repository.criar(req.body);
      return res.status(201).json(novaNota);
    }

    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).json({ message: `Método ${req.method} não permitido` });
  } catch (error) {
    console.error('Erro na API de notas:', error);
    return res.status(500).json({ message: 'Erro interno no servidor' });
  }
}