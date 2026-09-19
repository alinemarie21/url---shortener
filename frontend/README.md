# UrlShortener — Encurtador de Links (frontend)

Frontend em React + Vite, integrado ao backend (`../backend`) via `src/api/api.js`.

## Rodando

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # gera ./dist
npm run preview  # serve o build
```

## Estrutura

```
src/
├── main.jsx                  # entrada; <BrowserRouter> + <AuthProvider>
├── App.jsx                   # rotas: /login, / e /stats/:shortCode
├── index.css                 # estilos (responsivo, com tema escuro automático)
├── context/AuthContext.jsx   # sessão (useContext) em localStorage; 401 -> logout
├── api/api.js                # ÚNICO ponto de integração com o backend
├── services/mockApi.js       # legado (simulação); não é mais usado
├── utils/validators.js       # validação do formulário e da URL
└── components/
    ├── LoginForm.jsx         # login / cadastro + validação
    ├── ProtectedLayout.jsx   # guard (sem token -> /login) + cabeçalho compartilhado
    ├── ShortenerPage.jsx     # input, botão "Encurtar", resultado e lista dos seus links
    ├── StatsPage.jsx         # estatísticas de um link (total, hoje, semana, mês)
    ├── LinkList.jsx          # lista de links do usuário (vinda do backend)
    ├── LinkItem.jsx          # original, curto e botão "Estatísticas"
    └── CopyButton.jsx        # Clipboard API + feedback "Copiado!"
```

## Rotas

| Rota                 | Página          | Acesso                           |
| -------------------- | --------------- | -------------------------------- |
| `/login`             | `LoginForm`     | pública (com sessão, vai para `/`) |
| `/`                  | `ShortenerPage` | exige token, senão vai para `/login` |
| `/stats/:shortCode`  | `StatsPage`     | exige token, senão vai para `/login` |

## Integração com o backend

Toda a comunicação passa por `src/api/api.js`. A URL da API vem de `VITE_API_URL`
(padrão `http://localhost:3000`).

| Função                | Endpoint                          | Token? |
| --------------------- | --------------------------------- | ------ |
| `login(credentials)`  | `POST /auth/login`                | não    |
| `register(data)`      | `POST /users`                     | não    |
| `getUrl(code)`        | `GET /urls/:shortCode`            | não    |
| `shorten(url)`        | `POST /urls`                      | **sim** |
| `listUrls()`          | `GET /urls`                       | **sim** |
| `getStats(code)`      | `GET /urls/:shortCode/stats`      | **sim** |

Autenticação:

- O token é enviado como `Authorization: Bearer <token>` nas rotas autenticadas.
- O frontend **não** conhece a `JWT_SECRET` e **não** valida nem decodifica o JWT; só o
  backend valida. Se uma rota autenticada responder `401` (ou não houver token), a sessão é
  encerrada e o usuário volta para o login.
- `401` no login/cadastro (ex.: senha errada) só mostra a mensagem de erro.

## Observações

- A senha **não** é armazenada; só `token` e `user` (email e, no cadastro, nome) ficam no `localStorage`.
- A lista de links vem do backend (`GET /urls`), então persiste entre visitas.
- Clicar num link curto abre o link do backend (`GET /:shortCode`), que registra o clique e redireciona. Os números ficam na página de estatísticas (`getStats`).
