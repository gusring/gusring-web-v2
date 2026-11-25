import { useEffect, useState } from 'react';
import { AlertTriangle, LoaderCircle, RotateCw } from 'lucide-react';
import { FormDef, Lang } from '../forms/types';
import { tr, UI } from '../i18n';
import { ApiError, fetchForm, FormEntry } from '../lib/forms-api';
import FormFillView from './FormFillView';
import Header from './Header';

// ─────────────────────────────────────────────────────────────
// 게시된 서식 정의를 서버에서 받아 서식 작성 화면을 연다.
// 받는 동안은 불러오는 중, 없는 서식이면 목록으로, 실패하면(네트워크 등) 다시 시도를 보여 준다.
// ─────────────────────────────────────────────────────────────

interface Props {
  formKey: string;
  lang: Lang;
  onBack: () => void;
  onLanding: () => void;
  onMap: () => void;
}

export default function FormLoader({ formKey, lang, onBack, onLanding, onMap }: Props) {
  const [loaded, setLoaded] = useState<{ entry: FormEntry; form: FormDef } | null>(null);
  const [error, setError] = useState<'notFound' | 'failed' | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let alive = true;
    setError(null);
    fetchForm(formKey).then(
      (r) => alive && setLoaded(r),
      (e) => alive && setError(e instanceof ApiError && e.status === 404 ? 'notFound' : 'failed'),
    );
    return () => { alive = false; };
  }, [formKey, attempt]);

  if (loaded) return <FormFillView entry={loaded.entry} form={loaded.form} lang={lang} onBack={onBack} onLanding={onLanding} onMap={onMap} />;

  return (
    <div className="h-[100dvh] flex flex-col bg-white">
      <Header lang={lang} onBack={onBack} onLanding={onLanding} onMap={onMap} />
      <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6 text-center">
        {error ? (
          <div role="alert" className="space-y-4">
            <p className="flex items-center justify-center gap-2 text-[14px] font-bold text-gray-900">
              <AlertTriangle size={16} className="text-amber-600 shrink-0" /> {tr(error === 'notFound' ? UI.formNotFound : UI.formLoadFailed, lang)}
            </p>
            {error === 'notFound' ? (
              <button onClick={onBack} className="h-11 px-5 rounded-2xl bg-brand text-brand-950 font-black text-sm inline-flex items-center gap-2 active:scale-95 transition">
                {tr(UI.toList, lang)}
              </button>
            ) : (
              <button
                onClick={() => setAttempt((a) => a + 1)}
                className="h-11 px-5 rounded-2xl bg-brand text-brand-950 font-black text-sm inline-flex items-center gap-2 active:scale-95 transition"
              >
                <RotateCw size={16} /> {tr(UI.retry, lang)}
              </button>
            )}
          </div>
        ) : (
          <p className="flex items-center gap-2 text-[14px] font-bold text-sub" aria-live="polite">
            <LoaderCircle size={18} className="animate-spin" /> {tr(UI.formLoading, lang)}
          </p>
        )}
      </div>
    </div>
  );
}
