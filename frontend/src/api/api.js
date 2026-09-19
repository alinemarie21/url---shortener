/**
 * ============================================================================
 *  api.js — ÚNICO lugar que "fala" com o backend.
 * ============================================================================
 *  Rotas do backend e se exigem token (Authorization: Bearer <access_token>):
 *
 *    POST /auth/login             pública      -> login()
 *    POST /users                  pública      -> register()
 *    GET  /urls/:shortCode        pública      -> getUrl()
 *    POST /urls                   AUTENTICADA  -> shorten()
 *    GET  /urls                   AUTENTICADA  -> listUrls()
 *    GET  /urls/:shortCode/stats  AUTENTICADA  -> getStats()
 *    GET  /:shortCode             pública      -> redirect 302; o navegador segue
 *                                                 o link curto, não passa por aqui
 *
 *  Regras de segurança:
 *  - O frontend NUNCA conhece a JWT_SECRET e NUNCA valida/decodifica o JWT
 *    (nem para checar expiração). Só o backend valida o token.
 *  - Se uma rota autenticada responder 401 (token ausente, inválido ou
 *    expirado), chamamos `onUnauthorized`, que limpa a sessão e leva ao login.
 *  - 401 nas rotas públicas (ex.: senha errada no login) NÃO derruba a sessão.
 * ============================================================================
 */

// Configure com VITE_API_URL no arquivo .env (ex.: VITE_API_URL=http://localhost:3000)
const API_BASE_URL = (import.meta.env.VITE_API_URL ?? 'http://localhost:3000').replace(
  /\/+$/,
  '',
);

/** Erro de API. `status` 0 = falha de rede; `message` vem do backend ({ error }). */
export class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

let getToken = () => null;
let onUnauthorized = () => {};

/**
 * Liga a API à sessão do app (feito pelo AuthProvider), mantendo este arquivo
 * independente de React.
 * @param {{ getToken: () => string | null, onUnauthorized: () => void }} handlers
 */
export function configureApi(handlers) {
  getToken = handlers.getToken;
  onUnauthorized = handlers.onUnauthorized;
}

async function request(path, { method = 'GET', body, auth = false } = {}) {
  const headers = {};
  if (body !== undefined) headers['Content-Type'] = 'application/json';

  if (auth) {
    const token = getToken();
    if (!token) {
      // Rota autenticada sem token: nem chama o backend, vai direto ao login.
      onUnauthorized();
      throw new ApiError(401, 'Sessão não encontrada.');
    }
    headers.Authorization = `Bearer ${token}`;
  }

  let res;
  try {
    res = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new ApiError(0, 'Não foi possível conectar ao servidor.');
  }

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    // Quem valida o token é o backend: se ele recusou, a sessão acabou.
    if (auth && res.status === 401) onUnauthorized();
    throw new ApiError(res.status, data?.error ?? 'Erro inesperado no servidor.');
  }

  return data;
}

// Backend (snake_case) -> formato usado pelos componentes.
function toLink(url) {
  return {
    code: url.short_code,
    originalUrl: url.original_url,
    shortUrl: url.short_url,
    createdAt: url.created_at,
  };
}

// ----------------------------------------------------------------------------
// Autenticação (públicas)
// ----------------------------------------------------------------------------

/** POST /auth/login @returns {Promise<{ token: string }>} */
export async function login({ email, password }) {
  const data = await request('/auth/login', { method: 'POST', body: { email, password } });
  return { token: data.access_token };
}

/**
 * POST /users — cria a conta e já devolve um token.
 * @returns {Promise<{ token: string, user: { name: string, email: string } }>}
 */
export async function register({ name, email, password }) {
  const data = await request('/users', { method: 'POST', body: { name, email, password } });
  return {
    token: data.access_token,
    user: { name: data.user.name, email: data.user.email },
  };
}

// ----------------------------------------------------------------------------
// URLs
// ----------------------------------------------------------------------------

/** GET /urls/:shortCode (pública) */
export async function getUrl(code) {
  return toLink(await request(`/urls/${encodeURIComponent(code)}`));
}

/**
 * POST /urls (AUTENTICADA)
 * @param {string} originalUrl URL já validada/normalizada.
 * @returns {Promise<{ code: string, originalUrl: string, shortUrl: string, createdAt: string }>}
 */
export async function shorten(originalUrl) {
  const data = await request('/urls', {
    method: 'POST',
    body: { original_url: originalUrl },
    auth: true,
  });
  return toLink(data);
}

/** GET /urls (AUTENTICADA) — todos os links do usuário logado, do mais novo ao mais antigo. */
export async function listUrls() {
  const data = await request('/urls', { auth: true });
  return data.map(toLink);
}

/**
 * GET /urls/:shortCode/stats (AUTENTICADA; só o dono do link)
 * @returns {Promise<{ code: string, clicks: number, today: number, week: number, month: number }>}
 */
export async function getStats(code) {
  const data = await request(`/urls/${encodeURIComponent(code)}/stats`, { auth: true });
  return {
    code: data.short_code,
    clicks: data.total_clicks,
    today: data.clicks_today,
    week: data.clicks_this_week,
    month: data.clicks_this_month,
  };
}
