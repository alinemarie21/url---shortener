import { useEffect, useRef, useState } from 'react';
import { Check, Clipboard, X } from 'lucide-react';

async function copyToClipboard(text) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }
  // Fallback para contextos sem Clipboard API (ex.: http fora de localhost).
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  const ok = document.execCommand('copy');
  document.body.removeChild(textarea);
  if (!ok) throw new Error('Falha ao copiar');
}

const VIEW = {
  idle: { label: 'Copiar', Icon: Clipboard },
  copied: { label: 'Copiado!', Icon: Check },
  error: { label: 'Erro ao copiar', Icon: X },
};

export default function CopyButton({ text, variant = 'primary' }) {
  // status: 'idle' | 'copied' | 'error'
  const [status, setStatus] = useState('idle');
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  async function handleClick() {
    try {
      await copyToClipboard(text);
      setStatus('copied');
    } catch {
      setStatus('error');
    }
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setStatus('idle'), 2000);
  }

  const { label, Icon } = VIEW[status];

  return (
    <button
      type="button"
      className={`btn btn-${variant} copy-btn ${status === 'copied' ? 'is-copied' : ''} ${
        status === 'error' ? 'is-error' : ''
      }`}
      onClick={handleClick}
      aria-live="polite"
    >
      <Icon size={16} aria-hidden="true" />
      <span>{label}</span>
    </button>
  );
}
