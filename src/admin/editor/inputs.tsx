import { ReactNode, useEffect, useState } from 'react';
import { L } from '../../forms/types';

// 편집기 속성 칸에서 쓰는 작은 입력들

const LANG_NAMES: [keyof L, string][] = [['ko', '한국어'], ['en', 'English'], ['zh', '中文'], ['ja', '日本語'], ['vi', 'Tiếng Việt']];

export function Row({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) {
  return (
    <label className="block">
      <span className="block text-[11px] font-bold text-sub mb-0.5">{label}</span>
      {children}
      {hint && <span className="block text-[11px] text-hint mt-0.5">{hint}</span>}
    </label>
  );
}

export function Text({ value, onChange, placeholder, mono }: { value: string; onChange: (v: string) => void; placeholder?: string; mono?: boolean }) {
  return <input className={`admin-input-sm ${mono ? 'font-mono' : ''}`} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />;
}

/** 숫자 — 입력 중에는 글자 그대로 두고, 숫자일 때만 올린다 */
export function Num({ value, onChange, min }: { value: number | undefined; onChange: (v: number | undefined) => void; min?: number }) {
  const [text, setText] = useState(value === undefined ? '' : String(value));
  useEffect(() => setText(value === undefined ? '' : String(value)), [value]);
  return (
    <input
      className="admin-input-sm tabular-nums"
      inputMode="numeric"
      value={text}
      onChange={(e) => {
        setText(e.target.value);
        if (e.target.value.trim() === '') return onChange(undefined);
        const n = Number(e.target.value);
        if (Number.isFinite(n) && (min === undefined || n >= min)) onChange(n);
      }}
    />
  );
}

export function Check({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label className="inline-flex items-center gap-1.5 text-[12px] font-semibold">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} /> {label}
    </label>
  );
}

/** 5개 국어 — 빈 언어는 노랗게 */
export function LEditor({ label, value, onChange, multiline }: { label: string; value: L | undefined; onChange: (v: L) => void; multiline?: boolean }) {
  const v = value ?? { ko: '', en: '', zh: '', ja: '', vi: '' };
  const missing = LANG_NAMES.filter(([k]) => !v[k]?.trim()).length;
  return (
    <fieldset className="space-y-1">
      <legend className="text-[11px] font-bold text-sub mb-0.5">
        {label} {missing > 0 && <span className="text-amber-700">· {missing}개 언어 비어 있음</span>}
      </legend>
      {LANG_NAMES.map(([k, name]) => {
        const cls = `admin-input-sm ${v[k]?.trim() ? '' : 'bg-amber-50 border-amber-300'}`;
        const set = (s: string) => onChange({ ...v, [k]: s });
        return (
          <div key={k} className="flex gap-1.5 items-start">
            <span className="w-16 shrink-0 text-[11px] text-hint pt-1.5">{name}</span>
            {multiline ? (
              <textarea className={`${cls} min-h-[52px]`} value={v[k] ?? ''} onChange={(e) => set(e.target.value)} />
            ) : (
              <input className={cls} value={v[k] ?? ''} onChange={(e) => set(e.target.value)} />
            )}
          </div>
        );
      })}
    </fieldset>
  );
}

/** JSON으로 직접 고치기 (드문 속성용) */
export function JsonEditor<T>({ value, onApply, label }: { value: T; onApply: (v: T) => string | null; label: string }) {
  const [text, setText] = useState(() => JSON.stringify(value, null, 2));
  const [error, setError] = useState('');
  useEffect(() => {
    setText(JSON.stringify(value, null, 2));
    setError('');
  }, [value]);
  return (
    <details className="text-[12px]">
      <summary className="cursor-pointer font-bold text-sub">{label}</summary>
      <textarea className="admin-input-sm font-mono text-[11px] min-h-[220px] mt-1" value={text} onChange={(e) => setText(e.target.value)} spellCheck={false} />
      {error && <p className="text-red-600 font-semibold">{error}</p>}
      <button
        type="button"
        className="mt-1 h-7 px-2 rounded-md bg-gray-900 text-white font-bold"
        onClick={() => {
          try {
            const problem = onApply(JSON.parse(text) as T);
            setError(problem ?? '');
          } catch {
            setError('JSON 형식이 틀렸습니다.');
          }
        }}
      >
        적용
      </button>
    </details>
  );
}
