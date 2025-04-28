import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import NotasList from '../presentation/components/NotasList';

interface Usuario {
  id: string;
  nome: string;
  tipo: 'aluno' | 'professor';
}

export default function Dashboard() {
  const router = useRouter();
  const [usuario, setUsuario] = useState<Usuario | null>(null);

  useEffect(() => {
    const usuarioStorage = localStorage.getItem('usuario');
    
    if (!usuarioStorage) {
      router.push('/');
    } else {
      setUsuario(JSON.parse(usuarioStorage));
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('usuario');
    router.push('/');
  };

  if (!usuario) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">
            Bem-vindo, {usuario.nome}!
          </h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Sair
          </button>
        </div>

        <h2 className="text-xl font-semibold mb-4">Gestão de Notas</h2>
        <NotasList 
          tipoUsuario={usuario.tipo} 
          usuarioId={usuario.tipo === 'aluno' ? usuario.id : undefined} 
        />
      </div>
    </div>
  );
}