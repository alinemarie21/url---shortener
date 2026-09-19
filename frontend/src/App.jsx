import { useAuth } from './context/AuthContext.jsx';
import LoginForm from './components/LoginForm.jsx';
import ShortenerPage from './components/ShortenerPage.jsx';

// "Roteamento" simples: sem sessão -> login; com sessão -> encurtador.
// Se o projeto crescer, troque por react-router e proteja a rota do encurtador.
export default function App() {
  const { session } = useAuth();
  return session ? <ShortenerPage /> : <LoginForm />;
}
