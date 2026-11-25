import { useCallback, useEffect, useState } from 'react';
import { LoaderCircle, LogOut } from 'lucide-react';
import { adminApi, ApiError, Me } from './api';
import EditorPage from './editor/EditorPage';
import FormListPage from './FormListPage';
import LoginPage from './LoginPage';

// ─────────────────────────────────────────────────────────────
// 서식 관리 화면 (gusring-server가 /admin/forms/에서 제공)
// 주소: #/ 서식 목록 · #/forms/:id 편집기
// 로그인은 서버의 관리자 로그인(쿠키)을 그대로 쓴다.
// ─────────────────────────────────────────────────────────────

type Route = { name: 'list' } | { name: 'edit'; id: string };

const parseRoute = (hash: string): Route => {
  const m = hash.replace(/^#/, '').match(/^\/forms\/([^/]+)$/);
  return m ? { name: 'edit', id: decodeURIComponent(m[1]) } : { name: 'list' };
};

export default function AdminApp() {
  const [me, setMe] = useState<Me | null | undefined>(undefined);
  const [route, setRoute] = useState<Route>(() => parseRoute(location.hash));

  useEffect(() => {
    const onHash = () => setRoute(parseRoute(location.hash));
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const refreshMe = useCallback(() => {
    adminApi.me().then(setMe, (e) => setMe(e instanceof ApiError && e.status === 401 ? null : null));
  }, []);
  useEffect(refreshMe, [refreshMe]);

  /** 일하던 중 로그인이 끝나면 로그인 화면으로 */
  const onAuthLost = useCallback(() => setMe(null), []);

  if (me === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sub">
        <LoaderCircle className="animate-spin" />
      </div>
    );
  }
  if (me === null) return <LoginPage onLoggedIn={refreshMe} />;

  const logout = async () => {
    await adminApi.logout().catch(() => undefined);
    setMe(null);
  };

  return (
    // 화면 높이에 고정하고 안에서 스크롤 (편집기의 칸 목록·검사 칸이 화면 안에 머물게)
    <div className="h-screen bg-gray-50 text-gray-900 flex flex-col overflow-hidden">
      <header className="h-12 shrink-0 bg-white border-b border-gray-200 px-4 flex items-center gap-3">
        <a href="#/" className="font-black text-[15px]">구스링 서식 관리</a>
        <a href="/admin/" className="text-[13px] text-sub hover:text-gray-900">통계·의견 관리 화면</a>
        <span className="ml-auto text-[13px] text-sub">
          {me.username} · {me.role === 'manager' ? '계정 관리자' : '일반 관리자'}
        </span>
        <button onClick={() => void logout()} className="h-8 px-2 rounded-lg text-sub hover:bg-gray-100 flex items-center gap-1 text-[13px]">
          <LogOut size={14} /> 로그아웃
        </button>
      </header>
      {route.name === 'list' ? (
        <FormListPage me={me} onAuthLost={onAuthLost} />
      ) : (
        <EditorPage key={route.id} id={route.id} me={me} onAuthLost={onAuthLost} />
      )}
    </div>
  );
}
