import { useEffect, useState } from 'react';
import { Globe, Link2, LoaderCircle } from 'lucide-react';
import { listUrls, shorten } from '../api/api.js';
import { normalizeUrl } from '../utils/validators.js';
import CopyButton from './CopyButton.jsx';
import LinkList from './LinkList.jsx';

export default function ShortenerPage() {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [latest, setLatest] = useState(null); // último link criado nesta visita
  // Links do usuário (mais recente primeiro), vindos do backend.
  const [list, setList] = useState({ status: 'loading', links: [] }); // status: 'loading' | 'ready' | 'error'

  useEffect(() => {
    let cancelled = false;

    listUrls()
      .then((links) => {
        if (!cancelled) setList({ status: 'ready', links });
      })
      .catch(() => {
        // 401 já é tratado pela API (sessão encerrada -> login); aqui só sinalizamos o erro.
        if (!cancelled) setList({ status: 'error', links: [] });
      });

    return () => {
      cancelled = true;
    };
  }, []);

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
      const link = await shorten(normalized);
      setLatest(link);
      setList((prev) => ({ ...prev, links: [link, ...prev.links] }));
      setUrl('');
    } catch {
      setError('Não foi possível encurtar o link. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  return (
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
                href={latest.shortUrl}
                target="_blank"
                rel="noopener noreferrer"
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
          <h2>Seus links</h2>
          {list.status === 'ready' && list.links.length > 0 && (
            <span className="badge">{list.links.length}</span>
          )}
        </div>

        {list.status === 'loading' && <p className="empty">Carregando seus links…</p>}
        {list.status === 'error' && (
          <p className="alert" role="alert">
            Não foi possível carregar seus links. Recarregue a página para tentar novamente.
          </p>
        )}
        {list.status === 'ready' && <LinkList links={list.links} />}
      </section>
    </main>
  );
}
