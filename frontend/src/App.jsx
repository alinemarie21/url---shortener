import { Navigate, Route, Routes } from 'react-router';
import { useAuth } from './context/AuthContext.jsx';
import LoginForm from './components/LoginForm.jsx';
import ProtectedLayout from './components/ProtectedLayout.jsx';
import ShortenerPage from './components/ShortenerPage.jsx';
import StatsPage from './components/StatsPage.jsx';

// Quem já tem sessão não precisa ver o login.
function LoginRoute() {
  const { session } = useAuth();
  return session?.token ? <Navigate to="/" replace /> : <LoginForm />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginRoute />} />

      {/* Rotas protegidas: sem token, o ProtectedLayout redireciona para /login. */}
      <Route element={<ProtectedLayout />}>
        <Route index element={<ShortenerPage />} />
        <Route path="stats/:shortCode" element={<StatsPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
