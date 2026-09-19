const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const HAS_SCHEME = /^[a-z][a-z0-9+.-]*:\/\//i;

/** Retorna um objeto { campo: mensagem } — vazio quando tudo é válido. */
export function validateAuthForm({ name, email, password }) {
  const errors = {};

  if (!name.trim()) errors.name = 'Informe seu nome.';

  if (!email.trim()) errors.email = 'Informe seu email.';
  else if (!EMAIL_REGEX.test(email.trim())) errors.email = 'Email em formato inválido.';

  if (!password) errors.password = 'Informe sua senha.';
  else if (password.length < 6) errors.password = 'A senha deve ter no mínimo 6 caracteres.';

  return errors;
}

/**
 * Valida e normaliza a URL digitada. Aceita "exemplo.com/pagina" (assume https).
 * Retorna a URL pronta para uso ou `null` se for inválida.
 */
export function normalizeUrl(input) {
  const trimmed = input.trim();
  if (!trimmed || /\s/.test(trimmed)) return null;

  const candidate = HAS_SCHEME.test(trimmed) ? trimmed : `https://${trimmed}`;

  try {
    const { protocol, hostname } = new URL(candidate);
    const isHttp = protocol === 'http:' || protocol === 'https:';
    const looksLikeHost = hostname.includes('.') || hostname === 'localhost';
    return isHttp && looksLikeHost ? candidate : null;
  } catch {
    return null;
  }
}
