import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { configureGusringApi, startAutoFlush } from './lib/gusring-api';
import './index.css';

// 구스링 백엔드 이용 기록: 로컬 서버에 붙일 때만 VITE_GUSRING_API (기본 https://api.gusring.kro.kr)
if (import.meta.env.VITE_GUSRING_API) configureGusringApi({ baseUrl: import.meta.env.VITE_GUSRING_API });
startAutoFlush();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
