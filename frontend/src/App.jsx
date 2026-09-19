import { useAuth } from './context/AuthContext.jsx';
import LoginForm from './components/LoginForm.jsx';
import ShortenerPage from './components/ShortenerPage.jsx';

// "Roteamento" simples: sem token -> login; com token -> encurtador.
// Só verificamos se o token existe; se o backend o recusar (401), a API encerra
// a sessão e este componente volta a exibir o login.
// Se o projeto crescer, troque por react-router e proteja a rota do encurtador.
export default function App() {
  const { session } = useAuth();
  return session?.token ? <ShortenerPage /> : <LoginForm />;
}
