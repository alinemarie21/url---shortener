import { MousePointerClick } from 'lucide-react';
import CopyButton from './CopyButton.jsx';

export default function LinkItem({ link, onClick }) {
  const { code, originalUrl, shortUrl, clicks } = link;

  return (
    <li className="link-item">
      <div className="link-info">
        <a
          className="link-short"
          href={originalUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => onClick(code)}
        >
          {shortUrl}
        </a>
        <span className="link-original" title={originalUrl}>
          {originalUrl}
        </span>
      </div>
      <div className="link-meta">
        <span className="clicks" title="Cliques simulados">
          <MousePointerClick size={16} aria-hidden="true" />
          <strong>{clicks}</strong> {clicks === 1 ? 'clique' : 'cliques'}
        </span>
        <CopyButton text={shortUrl} variant="secondary" />
      </div>
    </li>
  );
}
