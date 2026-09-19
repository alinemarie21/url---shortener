# UrlShortener — Encurtador de Links (frontend)

Frontend em React + Vite. Todos os dados são simulados no navegador; não há chamadas reais de API.

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
├── App.jsx                   # sem sessão -> LoginForm, com sessão -> ShortenerPage
├── index.css                 # estilos (responsivo, com tema escuro automático)
├── context/AuthContext.jsx   # sessão (useContext) persistida em localStorage
├── services/mockApi.js       # ÚNICO ponto de integração com o backend
├── utils/validators.js       # validação do formulário e da URL
└── components/
    ├── LoginForm.jsx         # Nome, Email, Senha + validação
    ├── ShortenerPage.jsx     # input, botão "Encurtar", resultado, logout
    ├── LinkList.jsx          # histórico da sessão
    ├── LinkItem.jsx          # original, curto e cliques
    └── CopyButton.jsx        # Clipboard API + feedback "Copiado!"
```

## Integrando com o backend

Toda a comunicação passa por `src/services/mockApi.js`. Cada função traz, comentado, o
`fetch` equivalente:

| Função                 | Endpoint futuro    |
| ---------------------- | ------------------ |
| `login(credentials)`   | `POST /login`      |
| `shorten(url, token)`  | `POST /shorten`    |
| `getStats(code)`       | `GET /stats/:code` |

Defina a URL da API em um `.env`: `VITE_API_URL=http://localhost:3000`.

## Observações

- A senha **não** é armazenada; só `token` e `user` (nome/email) ficam no `localStorage`.
- O histórico vive em memória (estado do React) e some ao recarregar a página.
- Clicar num link curto abre a URL original em nova aba e incrementa o contador (simulado).
