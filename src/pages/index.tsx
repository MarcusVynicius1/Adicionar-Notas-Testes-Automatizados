import LoginForm from '../presentation/components/LoginForm';

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center mb-6">Sistema de Notas</h1>
        <LoginForm />
      </div>
    </div>
  );
}