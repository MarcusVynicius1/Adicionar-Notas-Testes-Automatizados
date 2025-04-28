import { useState, useEffect } from "react";

interface Nota {
  id: string;
  valor: number;
}

interface NotasContainerProps {
  alunoId?: string;
}

const NotasContainer: React.FC<NotasContainerProps> = ({ alunoId }) => {
  const [notas, setNotas] = useState<Nota[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNotas = async () => {
      try {
        const query = alunoId ? `?alunoId=${alunoId}` : "";
        const response = await fetch(`/api/notas${query}`);
        if (!response.ok) {
          throw new Error("Erro ao buscar notas");
        }
        const data = await response.json();
        setNotas(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Erro desconhecido");
        }
      }
    };

    fetchNotas();
  }, [alunoId]);

  if (error) {
    return <div>Erro: {error}</div>;
  }

  if (!notas) {
    return <div>Carregando...</div>;
  }

  return (
    <div>
      <h1>Notas</h1>
      <ul>
        {notas.map((nota) => (
          <li key={nota.id}>
            Nota: {nota.valor}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NotasContainer;