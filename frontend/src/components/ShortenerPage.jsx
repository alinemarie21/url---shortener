import { useState } from 'react';
import { Globe, Link2, LoaderCircle, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { registerClick, shorten } from '../services/mockApi.js';
import { normalizeUrl } from '../utils/validators.js';
import Brand from './Brand.jsx';
import CopyButton from './CopyButton.jsx';
import LinkList from './LinkList.jsx';

export default function ShortenerPage() {
  const { session, logout } = useAuth();
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [links, setLinks] = useState([]); // histórico da sessão (mais recente primeiro)

  const latest = links[0];
  const firstName = session.user.name.split(' ')[0];

  async function handleSubmit(e) {
    e.preventDefault();

    const normalized = normalizeUrl(url);
    if (!normalized) {
      setError('Digite uma URL válida, por exemplo: https://exemplo.com/pagina');
      return;
    }

    setError('');
    setLoading(true);
    try {
      const link = await shorten(normalized, session.token);
      setLinks((prev) => [link, ...prev]);
      setUrl('');
    } catch {
      setError('Não foi possível encurtar o link. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  async function handleClick(code) {
    try {
      const { clicks } = await registerClick(code);
      setLinks((prev) => prev.map((l) => (l.code === code ? { ...l, clicks } : l)));
    } catch {
      // Contador é apenas informativo; falha silenciosa não deve travar a UI.
    }
  }

  return (
    <div className="page screen">
      <header className="topbar">
        <Brand />
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

      <main className="container">
        <section className="card">
          <h1>Encurte seu link</h1>
          <p className="muted">Cole uma URL longa e receba um link curto para compartilhar.</p>

          <form onSubmit={handleSubmit} noValidate className="shorten-form">
            <div className="shorten-row">
              <div className="input-wrap">
                <Globe size={18} className="input-icon" aria-hidden="true" />
                <input
                  type="text"
                  inputMode="url"
                  className={error ? 'input has-error' : 'input'}
                  placeholder="https://exemplo.com/um/link/bem/longo"
                  aria-label="URL original"
                  aria-invalid={Boolean(error)}
                  aria-describedby={error ? 'url-error' : undefined}
                  value={url}
                  onChange={(e) => {
                    setUrl(e.target.value);
                    if (error) setError('');
                  }}
                />
              </div>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? (
                  <>
                    <LoaderCircle size={18} className="spin" aria-hidden="true" />
                    Encurtando…
                  </>
                ) : (
                  <>
                    <Link2 size={18} aria-hidden="true" />
                    Encurtar
                  </>
                )}
              </button>
            </div>
            {error && (
              <span id="url-error" className="field-error" role="alert">
                {error}
              </span>
            )}
          </form>

          {latest && (
            <div className="result" key={latest.code} aria-live="polite">
              <span className="result-label">Seu link curto</span>
              <div className="result-row">
                <a
                  className="result-link"
                  href={latest.originalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => handleClick(latest.code)}
                >
                  {latest.shortUrl}
                </a>
                <CopyButton text={latest.shortUrl} />
              </div>
            </div>
          )}
        </section>

        <section className="card">
          <div className="section-head">
            <h2>Histórico</h2>
            {links.length > 0 && <span className="badge">{links.length}</span>}
          </div>
          <LinkList links={links} onLinkClick={handleClick} />
        </section>
      </main>
    </div>
  );
}
