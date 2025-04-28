import { NextApiRequest, NextApiResponse } from 'next';
import { UsuarioRepository } from '../../infra/repositories/UsuarioRepository';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método não permitido' });
  }

  try {
    const { id, senha } = req.body;
    
    if (!id || !senha) {
      return res.status(400).json({ message: 'Credenciais inválidas' });
    }

    const repository = new UsuarioRepository();
    const usuario = await repository.buscarPorCredenciais(id, senha);

    if (!usuario) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    const { senha: _, ...usuarioSemSenha } = usuario;
    
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json(usuarioSemSenha);
    
  } catch (error) {
    console.error('Erro no login:', error);
    res.setHeader('Content-Type', 'application/json');
    return res.status(500).json({ message: 'Erro interno no servidor' });
  }
}