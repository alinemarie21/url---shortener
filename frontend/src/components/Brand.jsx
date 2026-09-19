import { Link2 } from 'lucide-react';

export default function Brand() {
  return (
    <div className="brand">
      <span className="brand-mark" aria-hidden="true">
        <Link2 size={20} strokeWidth={2.5} />
      </span>
      <span className="brand-name">UrlShortener</span>
    </div>
  );
}
