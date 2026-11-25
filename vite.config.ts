import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// 이용자 사이트: npm run dev / npm run build (index.html)
// 관리 화면(서식 관리): 개발은 같은 dev 서버의 /admin.html, 빌드는 npm run build:admin
//   → dist-admin/ (서버가 /admin/forms/에서 제공, npm run admin:copy로 gusring-server에 넣음)
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  // 관리 화면은 서버와 같은 출처에서 /api/v1을 부른다 (로그인 쿠키 Path=/api/v1, SameSite=Strict).
  // 개발할 때는 이 프록시가 서버로 넘기고, 서버의 Origin 검사를 통과하도록 Origin도 서버 주소로 바꾼다.
  const api = env.VITE_ADMIN_API || env.VITE_GUSRING_API || 'http://localhost:4000';
  const admin = mode === 'admin';

  return {
    plugins: [react()],
    server: {
      host: true,
      proxy: {
        '/api': {
          target: api,
          changeOrigin: true,
          configure: (proxy) => {
            proxy.on('proxyReq', (req) => {
              if (req.getHeader('origin')) req.setHeader('origin', new URL(api).origin);
            });
          },
        },
      },
    },
    ...(admin && {
      base: '/admin/forms/',
      // 이용자 사이트의 public(서식 이미지 등)은 관리 화면에 필요 없다
      publicDir: false,
      build: { outDir: 'dist-admin', emptyOutDir: true, rollupOptions: { input: 'admin.html' } },
    }),
  };
});
