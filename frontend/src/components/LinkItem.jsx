import { ChartColumn } from 'lucide-react';
import { Link } from 'react-router';
import CopyButton from './CopyButton.jsx';

export default function LinkItem({ link }) {
  const { code, originalUrl, shortUrl } = link;

  return (
    <li className="link-item">
      <div className="link-info">
        <a className="link-short" href={shortUrl} target="_blank" rel="noopener noreferrer">
          {shortUrl}
        </a>
        <span className="link-original" title={originalUrl}>
          {originalUrl}
        </span>
      </div>
      <div className="link-meta">
        <Link to={`/stats/${encodeURIComponent(code)}`} className="btn btn-secondary">
          <ChartColumn size={16} aria-hidden="true" />
          Estatísticas
        </Link>
        <CopyButton text={shortUrl} variant="secondary" />
      </div>
    </li>
  );
}
