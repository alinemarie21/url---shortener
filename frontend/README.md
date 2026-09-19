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
├── main.jsx                  # entrada; envolve o app com <AuthProvider>
├── App.jsx                   # sem token -> LoginForm, com token -> ShortenerPage
├── index.css                 # estilos (responsivo, com tema escuro automático)
├── context/AuthContext.jsx   # sessão (useContext) em localStorage; 401 -> logout
├── api/api.js                # ÚNICO ponto de integração com o backend
├── services/mockApi.js       # legado (simulação); não é mais usado
├── utils/validators.js       # validação do formulário e da URL
└── components/
    ├── LoginForm.jsx         # Nome, Email, Senha + validação
    ├── ShortenerPage.jsx     # input, botão "Encurtar", resultado, logout
    ├── LinkList.jsx          # histórico da sessão
    ├── LinkItem.jsx          # original, curto e cliques
    └── CopyButton.jsx        # Clipboard API + feedback "Copiado!"
```

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
- O histórico vive em memória (estado do React) e some ao recarregar a página.
- Clicar num link curto abre o link do backend (`GET /:shortCode`), que registra o clique e redireciona; o contador é atualizado via `getStats`.
