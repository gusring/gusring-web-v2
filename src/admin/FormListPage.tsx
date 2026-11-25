import { FormEvent, useEffect, useState } from 'react';
import { CircleCheck, CircleDashed, Copy, FilePlus2, Pencil, Trash2 } from 'lucide-react';
import { categories } from '../forms/categories';
import { emptyDefinition } from '../forms/definition';
import { adminApi, AdminFormSummary, ApiError, errorText, Me } from './api';

// 서식 목록 — 상태(게시·초안), 새로 만들기·복제·지우기

const fmt = (iso: string | null) => (iso ? new Date(iso).toLocaleString('ko-KR', { dateStyle: 'short', timeStyle: 'short' }) : '');

export default function FormListPage({ me, onAuthLost }: { me: Me; onAuthLost: () => void }) {
  const [forms, setForms] = useState<AdminFormSummary[] | null>(null);
  const [error, setError] = useState('');
  const [creating, setCreating] = useState<{ copyFrom?: AdminFormSummary } | null>(null);

  const handle = (e: unknown) => {
    if (e instanceof ApiError && e.status === 401) return onAuthLost();
    setError(errorText(e));
  };

  const load = () => adminApi.list().then(setForms, handle);
  useEffect(() => { void load(); }, []);

  const remove = async (f: AdminFormSummary) => {
    if (!window.confirm(`「${f.title.ko || f.key}」(${f.formNo}번)을 지울까요?\n이용자 목록에서 바로 사라집니다. 게시 이력은 서버에 남습니다.`)) return;
    try {
      await adminApi.remove(f.id);
      await load();
    } catch (e) {
      handle(e);
    }
  };

  return (
    <main className="flex-1 min-h-0 overflow-auto">
      <div className="p-6 max-w-6xl w-full mx-auto space-y-4">
      <div className="flex items-center gap-3">
        <h1 className="font-black text-xl">서식 {forms ? `(${forms.length})` : ''}</h1>
        <button onClick={() => setCreating({})} className="ml-auto h-9 px-3 rounded-lg bg-brand text-brand-950 font-bold text-[13px] flex items-center gap-1.5">
          <FilePlus2 size={15} /> 새 서식
        </button>
      </div>
      {error && <p role="alert" className="text-[13px] font-semibold text-red-600">{error}</p>}

      <div className="bg-white rounded-xl shadow-card overflow-hidden">
        <table className="w-full text-[13px]">
          <thead className="bg-gray-50 text-sub text-left">
            <tr>
              <th className="px-3 py-2 w-14">번호</th>
              <th className="px-3 py-2">서식</th>
              <th className="px-3 py-2 w-24">분류</th>
              <th className="px-3 py-2 w-48">상태</th>
              <th className="px-3 py-2 w-48">마지막 수정</th>
              <th className="px-3 py-2 w-28" />
            </tr>
          </thead>
          <tbody>
            {forms?.map((f) => (
              <tr key={f.id} className="border-t border-gray-100 hover:bg-gray-50">
                <td className="px-3 py-2 tabular-nums">{f.formNo}</td>
                <td className="px-3 py-2">
                  <a href={`#/forms/${f.id}`} className="font-bold hover:underline">{f.title.ko || '(제목 없음)'}</a>
                  <div className="text-[11px] text-hint">{f.key}</div>
                </td>
                <td className="px-3 py-2">{categories[f.category]?.ko}</td>
                <td className="px-3 py-2">
                  {f.publishedVersion ? (
                    <span className="inline-flex items-center gap-1 text-green-700"><CircleCheck size={14} /> 게시됨 v{f.publishedVersion}</span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-sub"><CircleDashed size={14} /> 게시 전</span>
                  )}
                  {f.publishedVersion && f.hasUnpublishedChanges && <div className="text-[11px] text-amber-700">게시하지 않은 수정 있음</div>}
                </td>
                <td className="px-3 py-2 text-sub">{fmt(f.draftUpdatedAt)} · {f.draftUpdatedBy}</td>
                <td className="px-3 py-2">
                  <div className="flex gap-1 justify-end">
                    <a href={`#/forms/${f.id}`} title="편집" className="admin-icon-btn"><Pencil size={14} /></a>
                    <button title="복제" onClick={() => setCreating({ copyFrom: f })} className="admin-icon-btn"><Copy size={14} /></button>
                    {me.role === 'manager' && (
                      <button title="지우기" onClick={() => void remove(f)} className="admin-icon-btn text-red-600"><Trash2 size={14} /></button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!forms && !error && <p className="p-6 text-center text-sub">불러오는 중…</p>}
      </div>

      {creating && (
        <CreateDialog
          copyFrom={creating.copyFrom}
          nextNo={Math.max(0, ...(forms ?? []).map((f) => f.formNo)) + 1}
          onClose={() => setCreating(null)}
          onAuthLost={onAuthLost}
        />
      )}
      </div>
    </main>
  );
}

function CreateDialog({ copyFrom, nextNo, onClose, onAuthLost }: { copyFrom?: AdminFormSummary; nextNo: number; onClose: () => void; onAuthLost: () => void }) {
  const [key, setKey] = useState(copyFrom ? `${copyFrom.key}-copy` : '');
  const [formNo, setFormNo] = useState(String(nextNo));
  const [error, setError] = useState('');

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const no = Number(formNo);
      const created = await adminApi.create(copyFrom ? { key, formNo: no, copyFrom: copyFrom.id } : { key, formNo: no, definition: emptyDefinition() });
      location.hash = `#/forms/${created.id}`;
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) return onAuthLost();
      setError(errorText(err));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={onClose}>
      <form onClick={(e) => e.stopPropagation()} onSubmit={(e) => void submit(e)} className="bg-white rounded-2xl p-6 w-full max-w-md space-y-4 shadow-card-lg">
        <h2 className="font-black text-lg">{copyFrom ? `「${copyFrom.title.ko}」 복제` : '새 서식'}</h2>
        <label className="block">
          <span className="block text-[12px] font-bold text-sub mb-1">주소 이름 (영어 소문자·숫자·-, 예: birth-report)</span>
          <input className="admin-input" value={key} onChange={(e) => setKey(e.target.value.trim())} autoFocus pattern="[a-z0-9][a-z0-9-]*" required />
        </label>
        <label className="block">
          <span className="block text-[12px] font-bold text-sub mb-1">서식 번호 (v1 번호, 통계에 쓰임)</span>
          <input className="admin-input" type="number" min={1} max={999} value={formNo} onChange={(e) => setFormNo(e.target.value)} required />
        </label>
        {error && <p role="alert" className="text-[13px] font-semibold text-red-600">{error}</p>}
        <div className="flex gap-2 justify-end">
          <button type="button" onClick={onClose} className="h-10 px-4 rounded-lg bg-gray-100 font-bold text-[13px]">취소</button>
          <button className="h-10 px-4 rounded-lg bg-brand text-brand-950 font-black text-[13px]">만들기</button>
        </div>
      </form>
    </div>
  );
}
