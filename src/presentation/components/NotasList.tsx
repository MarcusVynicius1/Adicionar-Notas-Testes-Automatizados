import { useState, useEffect } from 'react';
import { Nota } from '../../domain/entities/Nota';

interface NotasListProps {
  tipoUsuario: 'aluno' | 'professor';
  usuarioId?: string;
}

export default function NotasList({ tipoUsuario, usuarioId }: NotasListProps) {
  const [notas, setNotas] = useState<Nota[]>([]);
  const [editando, setEditando] = useState<Partial<Nota> | null>(null);
  const [novaNota, setNovaNota] = useState(false);
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

  const handleSalvarEdicao = async () => {
    if (!editando?.id) return;
    
    try {
      setErro('');
      const response = await fetch(`/api/notas/${editando.id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          alunoId: editando.alunoId,
          disciplina: editando.disciplina,
          professor: editando.professor,
          nota: editando.nota
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${await response.text()}`);
      }
  
      const notaAtualizada = await response.json();
      
      if (!notaAtualizada?.id) {
        throw new Error('Resposta inválida da API');
      }
  
      setNotas(notas.map(n => n.id === notaAtualizada.id ? notaAtualizada : n));
      setEditando(null);
    } catch (error) {
      console.error('Erro ao atualizar nota:', error);
      setErro(error instanceof Error ? error.message : 'Erro ao atualizar nota');
    }
  };

  const handleAdicionarNota = async () => {
    if (!editando) return;
    
    try {
      setErro('');
      const response = await fetch('/api/notas', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          alunoId: editando.alunoId,
          disciplina: editando.disciplina,
          professor: editando.professor || 'Professor Padrão',
          nota: editando.nota
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${await response.text()}`);
      }

      const novaNotaCriada = await response.json();
      setNotas([...notas, novaNotaCriada]);
      setNovaNota(false);
      setEditando(null);
    } catch (error) {
      console.error('Erro ao adicionar nota:', error);
      setErro(error instanceof Error ? error.message : 'Erro ao adicionar nota');
    }
  };

  if (carregando) {
    return (
      <div className="p-4 text-center">
        <div className="animate-pulse">Carregando notas...</div>
      </div>
    );
  }

  if (erro) {
    return (
      <div className="p-4 text-center">
        <div className="text-red-500 bg-red-50 p-3 rounded-md">
          {erro.includes('404') ? 'Nenhuma nota encontrada' : erro}
          <button 
            onClick={() => window.location.reload()}
            className="ml-2 text-blue-500 hover:text-blue-700"
          >
            Tentar novamente
          </button>
        </div>
        {tipoUsuario === 'professor' && !erro.includes('404') && (
          <button 
            onClick={() => setNovaNota(true)}
            className="mt-4 bg-green-500 text-white px-4 py-2 rounded"
          >
            Adicionar Nota
          </button>
        )}
      </div>
    );
  }

  if (!notas.length && !novaNota) {
    return (
      <div className="p-4 text-center text-gray-500">
        Nenhuma nota encontrada
        {tipoUsuario === 'professor' && (
          <button 
            onClick={() => {
              setNovaNota(true);
              setEditando({
                alunoId: '',
                disciplina: '',
                nota: 0,
                professor: 'Professora Ana'
              });
            }}
            className="ml-2 text-green-500 hover:text-green-700"
          >
            Adicionar nova nota
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {tipoUsuario === 'professor' && (
        <button 
          onClick={() => {
            setNovaNota(true);
            setEditando({
              alunoId: '',
              disciplina: '',
              nota: 0,
              professor: 'Professora Ana'
            });
          }}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition-colors"
        >
          Adicionar Nova Nota
        </button>
      )}

      {novaNota && editando && (
        <div className="p-4 border border-gray-200 rounded-lg shadow-sm bg-white">
          <h3 className="font-bold text-lg mb-3">Nova Nota</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Aluno ID</label>
              <input
                type="text"
                value={editando.alunoId || ''}
                onChange={(e) => setEditando({ ...editando, alunoId: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ex: 101"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Disciplina</label>
              <input
                type="text"
                value={editando.disciplina || ''}
                onChange={(e) => setEditando({ ...editando, disciplina: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ex: Matemática"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Nota</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="10"
                value={editando.nota || 0}
                onChange={(e) => setEditando({ 
                  ...editando, 
                  nota: parseFloat(e.target.value) || 0 
                })}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <button 
              onClick={() => {
                setNovaNota(false);
                setEditando(null);
              }}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-1 rounded-md transition-colors"
            >
              Cancelar
            </button>
            <button 
              onClick={handleAdicionarNota}
              disabled={!editando.alunoId || !editando.disciplina}
              className={`px-4 py-1 rounded-md transition-colors ${
                !editando.alunoId || !editando.disciplina
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              Salvar Nota
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {notas.map((nota) => (
          <div key={nota.id} className="p-4 border border-gray-200 rounded-lg shadow-sm bg-white">
            {editando?.id === nota.id ? (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-bold text-lg mb-3">Editando Nota</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Aluno ID</label>
                    <input
                      type="text"
                      value={editando.alunoId || ''}
                      onChange={(e) => setEditando({ ...editando, alunoId: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Disciplina</label>
                    <input
                      type="text"
                      value={editando.disciplina || ''}
                      onChange={(e) => setEditando({ ...editando, disciplina: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nota</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="10"
                      value={editando.nota || 0}
                      onChange={(e) => setEditando({ 
                        ...editando, 
                        nota: parseFloat(e.target.value) || 0 
                      })}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>
                <div className="flex gap-2 justify-end">
                  <button 
                    onClick={() => setEditando(null)}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-1 rounded-md transition-colors"
                  >
                    Cancelar
                  </button>
                  <button 
                    onClick={handleSalvarEdicao}
                    disabled={!editando.alunoId || !editando.disciplina}
                    className={`px-4 py-1 rounded-md transition-colors ${
                      !editando.alunoId || !editando.disciplina
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                    }`}
                  >
                    Salvar Alterações
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-4 mb-2">
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
                {tipoUsuario === 'professor' && (
                  <div className="flex justify-end gap-2 mt-3">
                    <button
                      onClick={() => setEditando(nota)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-md text-sm transition-colors"
                    >
                      Editar
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}