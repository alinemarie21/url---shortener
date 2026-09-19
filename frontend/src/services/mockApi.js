/**
 * ============================================================================
 *  mockApi.js — ÚNICO lugar que "fala" com o backend.
 * ============================================================================
 *  Hoje tudo é simulado (delay artificial + dados em memória). Quando o backend
 *  existir, substitua o corpo de cada função pelo `fetch` indicado no bloco
 *  "BACKEND REAL" — a assinatura e o formato de retorno já são os esperados
 *  pelos componentes, então nada fora deste arquivo precisa mudar.
 * ============================================================================
 */

// Base da API real. Configure com VITE_API_URL no arquivo .env
// (ex.: VITE_API_URL=http://localhost:3000)
// eslint-disable-next-line no-unused-vars
const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

export const SHORT_BASE_URL = 'https://short.ly/';

const CODE_LENGTH = 6;
const CODE_ALPHABET =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

/** Simula latência de rede (500ms–1s por padrão). */
const delay = (min = 500, max = 1000) =>
  new Promise((resolve) => setTimeout(resolve, min + Math.random() * (max - min)));

function randomString(length, alphabet = CODE_ALPHABET) {
  let out = '';
  for (let i = 0; i < length; i += 1) {
    out += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return out;
}

// "Banco de dados" em memória: code -> { originalUrl, clicks, createdAt }.
// Deixa de existir quando o backend real assumir.
const linksDb = new Map();

// ----------------------------------------------------------------------------
// POST /login
// ----------------------------------------------------------------------------
/**
 * @param {{ name: string, email: string, password: string }} credentials
 * @returns {Promise<{ token: string, user: { name: string, email: string } }>}
 */
export async function login({ name, email, password }) {
  // --- BACKEND REAL --------------------------------------------------------
  // const res = await fetch(`${API_BASE_URL}/login`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ name, email, password }),
  // });
  // if (!res.ok) throw new Error('Falha na autenticação');
  // return res.json(); // { token, user: { name, email } }
  // --------------------------------------------------------------------------

  await delay();
  void password; // a senha nunca é guardada no frontend
  return {
    token: `mock-token-${randomString(16)}`,
    user: { name: name.trim(), email: email.trim().toLowerCase() },
  };
}

// ----------------------------------------------------------------------------
// POST /shorten
// ----------------------------------------------------------------------------
/**
 * @param {string} originalUrl URL já validada/normalizada.
 * @param {string} [token] Token de autenticação (Bearer).
 * @returns {Promise<{ code: string, originalUrl: string, shortUrl: string, clicks: number, createdAt: string }>}
 */
export async function shorten(originalUrl, token) {
  // --- BACKEND REAL --------------------------------------------------------
  // const res = await fetch(`${API_BASE_URL}/shorten`, {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //     Authorization: `Bearer ${token}`,
  //   },
  //   body: JSON.stringify({ url: originalUrl }),
  // });
  // if (!res.ok) throw new Error('Falha ao encurtar');
  // return res.json(); // { code, originalUrl, shortUrl, clicks, createdAt }
  // --------------------------------------------------------------------------

  await delay();
  void token;

  let code;
  do {
    code = randomString(CODE_LENGTH);
  } while (linksDb.has(code));

  const createdAt = new Date().toISOString();
  linksDb.set(code, { originalUrl, clicks: 0, createdAt });

  return { code, originalUrl, shortUrl: `${SHORT_BASE_URL}${code}`, clicks: 0, createdAt };
}

// ----------------------------------------------------------------------------
// GET /stats/:code
// ----------------------------------------------------------------------------
/**
 * @param {string} code
 * @returns {Promise<{ code: string, clicks: number }>}
 */
export async function getStats(code) {
  // --- BACKEND REAL --------------------------------------------------------
  // const res = await fetch(`${API_BASE_URL}/stats/${code}`);
  // if (!res.ok) throw new Error('Link não encontrado');
  // return res.json(); // { code, clicks }
  // --------------------------------------------------------------------------

  await delay(150, 300);
  const link = linksDb.get(code);
  if (!link) throw new Error('Link não encontrado');
  return { code, clicks: link.clicks };
}

// ----------------------------------------------------------------------------
// Clique simulado no link curto
// ----------------------------------------------------------------------------
/**
 * No backend real, o clique é contabilizado pelo próprio redirecionamento
 * (GET /:code -> 302 para a URL original). Aqui simulamos esse incremento e
 * devolvemos o novo total. Ao integrar, esta função pode virar apenas um
 * `getStats(code)` chamado depois do clique, ou ser removida.
 *
 * @param {string} code
 * @returns {Promise<{ code: string, clicks: number }>}
 */
export async function registerClick(code) {
  await delay(150, 300);
  const link = linksDb.get(code);
  if (!link) throw new Error('Link não encontrado');
  link.clicks += 1;
  return { code, clicks: link.clicks };
}
