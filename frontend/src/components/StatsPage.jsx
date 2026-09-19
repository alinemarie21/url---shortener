import { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link, useParams } from 'react-router';
import { getStats, getUrl } from '../api/api.js';

const PERIODS = [
  { key: 'clicks', label: 'Total' },
  { key: 'today', label: 'Hoje' },
  { key: 'week', label: 'Semana' },
  { key: 'month', label: 'Mês' },
];

const ERROR_MESSAGES = {
  0: 'Não foi possível conectar ao servidor. Tente novamente.',
  403: 'Você não tem acesso às estatísticas deste link.',
  404: 'Link não encontrado.',
};

export default function StatsPage() {
  const { shortCode } = useParams();
  // result = { shortCode, link, stats } | { shortCode, error } — o `shortCode` guardado
  // permite saber se o resultado ainda pertence ao link da URL atual.
  const [result, setResult] = useState(null);

  useEffect(() => {
    let cancelled = false;

    // 401 é tratado pela API (sessão encerrada -> login).
    Promise.all([getUrl(shortCode), getStats(shortCode)])
      .then(([link, stats]) => {
        if (!cancelled) setResult({ shortCode, link, stats });
      })
      .catch((err) => {
        if (!cancelled) {
          setResult({
            shortCode,
            error: ERROR_MESSAGES[err.status] ?? 'Não foi possível carregar as estatísticas.',
          });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [shortCode]);

  const current = result?.shortCode === shortCode ? result : null;

  return (
    <main className="container">
      <Link to="/" className="back-link">
        <ArrowLeft size={16} aria-hidden="true" />
        Voltar
      </Link>

      <section className="card">
        {!current && <p className="empty">Carregando estatísticas…</p>}

        {current?.error && (
          <p className="alert" role="alert">
            {current.error}
          </p>
        )}

        {current?.stats && (
          <>
            <span className="result-label">Estatísticas do link</span>
            <a
              className="result-link stats-url"
              href={current.link.shortUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {current.link.shortUrl}
            </a>
            <p className="link-original" title={current.link.originalUrl}>
              {current.link.originalUrl}
            </p>

            <dl className="stats-grid">
              {PERIODS.map(({ key, label }) => (
                <div className="stat" key={key}>
                  <dt>{label}</dt>
                  <dd>{current.stats[key]}</dd>
                </div>
              ))}
            </dl>
          </>
        )}
      </section>
    </main>
  );
}
