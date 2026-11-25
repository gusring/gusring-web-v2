import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { disableAnalytics } from '../lib/analytics';
import AdminApp from './AdminApp';
import '../index.css';

// 관리 화면에서 여는 이용자 화면 미리보기는 실제 이용이 아니다 — 이용 기록을 보내지 않는다
disableAnalytics();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AdminApp />
  </StrictMode>,
);
