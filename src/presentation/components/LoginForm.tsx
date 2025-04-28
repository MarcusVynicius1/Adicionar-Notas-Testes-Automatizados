import { useState } from 'react';
import { useRouter } from 'next/router';
import { AuthService } from '../../services/AuthService';

export default function LoginForm() {
  const [userId, setUserId] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setErro('');

  try {
    const response = await AuthService.login(userId, senha);
    
    localStorage.setItem('usuario', JSON.stringify(response));
    router.push('/dashboard');
  } catch (error) {
    let errorMessage = 'Erro ao fazer login';
    
    if (error instanceof Error) {
      if (error.message.includes('Unexpected token')) {
        errorMessage = 'Servidor retornou resposta inválida';
      } else {
        errorMessage = error.message;
      }
    }
    
    setErro(errorMessage);
  }
};

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto mt-10">
      {erro && <div className="text-red-500 mb-4">{erro}</div>}
      
      <div className="mb-4">
        <label className="block mb-2">ID do Usuário</label>
        <input
          type="text"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      
      <div className="mb-4">
        <label className="block mb-2">Senha</label>
        <input
          type="password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      
      <button
        type="submit"
        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
      >
        Entrar
      </button>
    </form>
  );
}