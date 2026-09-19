import { LogOut } from 'lucide-react';
import { Link, Navigate, Outlet } from 'react-router';
import { useAuth } from '../context/AuthContext.jsx';
import Brand from './Brand.jsx';

// Layout das páginas que exigem login: sem token -> /login; com token, mostra o
// cabeçalho e a página filha. Só verificamos se o token existe; se o backend o
// recusar (401), a API encerra a sessão e este guard leva ao login.
export default function ProtectedLayout() {
  const { session, logout } = useAuth();

  if (!session?.token) return <Navigate to="/login" replace />;

  // O login só devolve o token (sem nome); nesse caso usamos o começo do email.
  const firstName = (session.user.name ?? session.user.email.split('@')[0]).split(' ')[0];

  return (
    <div className="page screen">
      <header className="topbar">
        <Link to="/" className="brand-link" aria-label="Página inicial">
          <Brand />
        </Link>
        <div className="topbar-user">
          <span className="avatar" aria-hidden="true">
            {firstName.charAt(0).toUpperCase()}
          </span>
          <span className="user-name" title={session.user.email}>
            Olá, {firstName} 👋
          </span>
          <button type="button" className="btn btn-ghost" onClick={logout} aria-label="Sair">
            <LogOut size={16} aria-hidden="true" />
            <span className="btn-text">Sair</span>
          </button>
        </div>
      </header>

      <Outlet />
    </div>
  );
}
