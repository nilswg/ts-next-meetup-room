## Deploy

部署到正式環境時，可以自行添加以下環境變數

```bash
export DENO_ENV=production
export DENO_BASE_URL=[YOUR_WEBSITE_URL]
```

<br>

## Development
請使用 http://localhost:3000 作為來開發，避免 CORS 問題。

```bash
# run Socket.io Server on http://localhost:4000
deno run --allow-read --allow-env --allow-net socketioServer.ts

# run Peer Server on http://localhost:4001
deno run --allow-read --allow-env --allow-net peerServer.ts
```

<br>

## Dependencies
peer: 1.4.7
express: 4.18.2
