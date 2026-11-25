import { FormEvent, useState } from 'react';
import { adminApi, errorText } from './api';

// 관리자 로그인 — 계정은 서버 관리 화면(/admin)에서 계정 관리자가 만든다. 비밀번호 바꾸기도 거기서.

export default function LoginPage({ onLoggedIn }: { onLoggedIn: () => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await adminApi.login(username, password);
      onLoggedIn();
    } catch (err) {
      setError(errorText(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <form onSubmit={(e) => void submit(e)} className="w-full max-w-sm bg-white rounded-2xl shadow-card p-6 space-y-4">
        <h1 className="font-black text-lg">구스링 서식 관리</h1>
        <label className="block">
          <span className="block text-[12px] font-bold text-sub mb-1">아이디</span>
          <input className="admin-input" autoComplete="username" value={username} onChange={(e) => setUsername(e.target.value)} autoFocus />
        </label>
        <label className="block">
          <span className="block text-[12px] font-bold text-sub mb-1">비밀번호</span>
          <input className="admin-input" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        {error && <p role="alert" className="text-[13px] font-semibold text-red-600">{error}</p>}
        <button disabled={busy || !username || !password} className="w-full h-11 rounded-xl bg-brand text-brand-950 font-black disabled:opacity-50">
          로그인
        </button>
        <p className="text-[12px] text-sub">계정은 계정 관리자가 <a className="underline" href="/admin/">관리자 화면</a>에서 만들어 줍니다.</p>
      </form>
    </div>
  );
}
