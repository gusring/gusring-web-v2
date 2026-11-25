import { useEffect, useState } from 'react';
import { AlertTriangle, LoaderCircle, RotateCw } from 'lucide-react';
import { CatalogItem } from '../forms/catalog';
import { FormDef, Lang } from '../forms/types';
import { tr, UI } from '../i18n';
import FormFillView from './FormFillView';
import Header from './Header';

// ─────────────────────────────────────────────────────────────
// 서식 정의는 서식마다 따로 나눠져 있어(코드 분할) 서식 화면을 열 때 받는다.
// 받는 동안은 불러오는 중, 실패하면(네트워크·배포 직후 옛 파일 등) 다시 시도를 보여 준다.
// ─────────────────────────────────────────────────────────────

interface Props {
  entry: CatalogItem;
  lang: Lang;
  onBack: () => void;
  onLanding: () => void;
  onMap: () => void;
}

export default function FormLoader({ entry, lang, onBack, onLanding, onMap }: Props) {
  const [form, setForm] = useState<FormDef | null>(null);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let alive = true;
    setFailed(false);
    entry.load().then(
      (f) => alive && setForm(f),
      () => alive && setFailed(true),
    );
    return () => { alive = false; };
  }, [entry, attempt]);

  if (form) return <FormFillView entry={entry} form={form} lang={lang} onBack={onBack} onLanding={onLanding} onMap={onMap} />;

  return (
    <div className="h-[100dvh] flex flex-col bg-white">
      <Header lang={lang} onBack={onBack} onLanding={onLanding} onMap={onMap} />
      <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6 text-center">
        {failed ? (
          <div role="alert" className="space-y-4">
            <p className="flex items-center justify-center gap-2 text-[14px] font-bold text-gray-900">
              <AlertTriangle size={16} className="text-amber-600 shrink-0" /> {tr(UI.formLoadFailed, lang)}
            </p>
            <button
              onClick={() => setAttempt((a) => a + 1)}
              className="h-11 px-5 rounded-2xl bg-brand text-brand-950 font-black text-sm inline-flex items-center gap-2 active:scale-95 transition"
            >
              <RotateCw size={16} /> {tr(UI.retry, lang)}
            </button>
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
