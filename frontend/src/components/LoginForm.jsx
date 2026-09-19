import { useState } from 'react';
import { Lock, LoaderCircle, LogIn, Mail, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { validateAuthForm } from '../utils/validators.js';
import Brand from './Brand.jsx';

const INITIAL_VALUES = { name: '', email: '', password: '' };

export default function LoginForm() {
  const { login } = useAuth();
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

  async function handleSubmit(e) {
    e.preventDefault();
    const found = validateAuthForm(values);
    setErrors(found);
    setSubmitError('');
    if (Object.keys(found).length > 0) return;

    setLoading(true);
    try {
      await login(values); // ao concluir, App troca para <ShortenerPage />
    } catch {
      setSubmitError('Não foi possível entrar. Tente novamente.');
      setLoading(false);
    }
  }

  return (
    <main className="auth-page screen">
      <div className="card auth-card">
        <Brand />
        <h1 className="auth-title">Entre ou crie sua conta</h1>
        <p className="muted">Encurte, copie e acompanhe seus links em um só lugar.</p>

        <form onSubmit={handleSubmit} noValidate className="form">
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
            autoComplete="current-password"
            placeholder="Mínimo de 6 caracteres"
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
                Entrando…
              </>
            ) : (
              <>
                <LogIn size={18} aria-hidden="true" />
                Entrar
              </>
            )}
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
