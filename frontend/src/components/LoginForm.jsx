import { useState } from 'react';
import { Lock, LoaderCircle, LogIn, Mail, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { validateAuthForm } from '../utils/validators.js';
import Brand from './Brand.jsx';

const INITIAL_VALUES = { name: '', email: '', password: '' };

const SUBMIT_ERRORS = {
  0: 'Não foi possível conectar ao servidor. Tente novamente.',
  401: 'Email ou senha inválidos.',
  409: 'Este email já está cadastrado.',
};

export default function LoginForm() {
  const { login, register } = useAuth();
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [values, setValues] = useState(INITIAL_VALUES);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    // Limpa o erro do campo assim que o usuário volta a digitar.
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  function toggleMode() {
    setMode((prev) => (prev === 'login' ? 'register' : 'login'));
    setErrors({});
    setSubmitError('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const found = validateAuthForm(values, mode);
    setErrors(found);
    setSubmitError('');
    if (Object.keys(found).length > 0) return;

    setLoading(true);
    try {
      await (isRegister ? register(values) : login(values)); // ao concluir, App troca para <ShortenerPage />
    } catch (err) {
      setSubmitError(SUBMIT_ERRORS[err.status] ?? 'Não foi possível continuar. Tente novamente.');
      setLoading(false);
    }
  }

  const isRegister = mode === 'register';

  return (
    <main className="auth-page screen">
      <div className="card auth-card">
        <Brand />
        <h1 className="auth-title">{isRegister ? 'Crie sua conta' : 'Entre na sua conta'}</h1>
        <p className="muted">Encurte, copie e acompanhe seus links em um só lugar.</p>

        <form onSubmit={handleSubmit} noValidate className="form">
          {isRegister && (
            <Field
              label="Nome"
              name="name"
              type="text"
              icon={User}
              autoComplete="name"
              placeholder="Seu nome"
              value={values.name}
              error={errors.name}
              onChange={handleChange}
            />
          )}
          <Field
            label="Email"
            name="email"
            type="email"
            icon={Mail}
            autoComplete="email"
            placeholder="voce@exemplo.com"
            value={values.email}
            error={errors.email}
            onChange={handleChange}
          />
          <Field
            label="Senha"
            name="password"
            type="password"
            icon={Lock}
            autoComplete={isRegister ? 'new-password' : 'current-password'}
            placeholder={isRegister ? 'Mínimo de 6 caracteres' : 'Sua senha'}
            value={values.password}
            error={errors.password}
            onChange={handleChange}
          />

          {submitError && (
            <p className="alert" role="alert">
              {submitError}
            </p>
          )}

          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? (
              <>
                <LoaderCircle size={18} className="spin" aria-hidden="true" />
                {isRegister ? 'Criando conta…' : 'Entrando…'}
              </>
            ) : (
              <>
                <LogIn size={18} aria-hidden="true" />
                {isRegister ? 'Criar conta' : 'Entrar'}
              </>
            )}
          </button>

          <button
            type="button"
            className="btn btn-ghost btn-block"
            onClick={toggleMode}
            disabled={loading}
          >
            {isRegister ? 'Já tenho conta' : 'Criar uma conta'}
          </button>
        </form>
      </div>
    </main>
  );
}

function Field({ label, name, error, icon: Icon, ...inputProps }) {
  const errorId = `${name}-error`;
  return (
    <div className="field">
      <label htmlFor={name}>{label}</label>
      <div className="input-wrap">
        <Icon size={18} className="input-icon" aria-hidden="true" />
        <input
          id={name}
          name={name}
          className={error ? 'input has-error' : 'input'}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          {...inputProps}
        />
      </div>
      {error && (
        <span id={errorId} className="field-error">
          {error}
        </span>
      )}
    </div>
  );
}
