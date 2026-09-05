import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// Plugin leve de middleware para resolver buscas do YouTube sem bloqueio de CORS
function youtubeSearchPlugin() {
  return {
    name: 'youtube-search-middleware',
    configureServer(server: any) {
      server.middlewares.use(async (req: any, res: any, next: any) => {
        if (req.url && req.url.startsWith('/api/yt-search')) {
          const urlObj = new URL(req.url, 'http://localhost:3000');
          const query = urlObj.searchParams.get('q');
          if (!query) {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Missing query parameter q' }));
            return;
          }

          try {
            const ytUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
            const response = await fetch(ytUrl, {
              headers: {
                'User-Agent':
                  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
                'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
              },
            });
            const html = await response.text();
            const matches = Array.from(html.matchAll(/"videoId":"([a-zA-Z0-9_-]{11})"/g)).map(
              (m) => m[1]
            );
            const uniqueIds = Array.from(new Set(matches)).filter((id) => id.length === 11);

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.end(
              JSON.stringify({
                videoIds: uniqueIds.slice(0, 5),
                primaryVideoId: uniqueIds[0] || null,
              })
            );
          } catch (err: any) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: err.message || 'Failed to search YouTube' }));
          }
          return;
        }
        next();
      });
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), youtubeSearchPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'react-native$': 'react-native-web',
    },
  },
  server: {
    port: 3000,
    open: true,
  },
  build: {
    sourcemap: false, // Desativa mapas de fonte em producao para evitar exposicao de codigo no navegador
  },
});
