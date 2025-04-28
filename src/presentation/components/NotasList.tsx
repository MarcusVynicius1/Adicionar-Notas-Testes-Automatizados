import { useState, useEffect } from 'react';
import { Nota } from '../../domain/entities/Nota';

interface NotasListProps {
  tipoUsuario: 'aluno' | 'professor';
  usuarioId?: string;
}

export default function NotasList({ tipoUsuario, usuarioId }: NotasListProps) {
  const [notas, setNotas] = useState<Nota[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    const carregarNotas = async () => {
      try {
        setCarregando(true);
        setErro('');

        if (tipoUsuario === 'aluno' && !usuarioId) {
          throw new Error('ID do aluno não fornecido');
        }

        const endpoint = tipoUsuario === 'aluno'
          ? `/api/notas/${usuarioId}`
          : '/api/notas';

        const response = await fetch(endpoint);

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Nenhuma nota encontrada');
          }
          throw new Error(`Erro ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        setNotas(Array.isArray(data) ? data : [data]);
      } catch (error) {
        console.error('Erro ao carregar notas:', error);
        setErro(error instanceof Error ? error.message : 'Erro ao carregar notas');
      } finally {
        setCarregando(false);
      }
    };

    carregarNotas();
  }, [tipoUsuario, usuarioId]);

  if (carregando) {
    return (
      <div className="p-4 text-center">
        <div className="animate-pulse text-lg font-semibold text-gray-600">
          Carregando notas...
        </div>
      </div>
    );
  }

  if (erro) {
    return (
      <div className="p-4 text-center">
        <div className="text-red-500 bg-red-50 p-4 rounded-md shadow-md">
          {erro.includes('404') ? 'Nenhuma nota encontrada' : erro}
          <button
            onClick={() => window.location.reload()}
            className="ml-4 text-blue-500 hover:text-blue-700 underline"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  if (!notas.length) {
    return (
      <div className="p-4 text-center text-gray-500 text-lg">
        Nenhuma nota encontrada
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
        Lista de Notas
      </h2>
      <div className="space-y-4">
        {notas.map((nota) => (
          <div
            key={nota.id}
            className="p-4 border border-gray-300 rounded-lg shadow-sm bg-white hover:shadow-md transition-shadow"
          >
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold text-gray-700">Aluno ID:</h3>
                <p className="text-gray-900">{nota.alunoId}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700">Disciplina:</h3>
                <p className="text-gray-900">{nota.disciplina}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700">Professor:</h3>
                <p className="text-gray-900">{nota.professor}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700">Nota:</h3>
                <p className="text-gray-900">{nota.nota}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}