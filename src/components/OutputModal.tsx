import { useEffect, useState } from 'react';
import { AlertTriangle, Download, PenLine, Printer, RotateCw, ShieldCheck, UserCheck, X } from 'lucide-react';
import { FormDef, L, Lang, Values } from '../forms/types';
import { tr, UI } from '../i18n';
import { downloadDataUrl, joinPagePngs, renderPagePngs } from '../lib/exportImage';
import { track } from '../lib/gusring-api';

interface Props {
  form: FormDef;
  /** 화면·파일 이름에 쓰는 제목 (목록 항목 제목) */
  title: L;
  formNo: number;
  values: Values;
  lang: Lang;
  missingRequired: number;
  onClose: () => void;
  /** 쪽마다 한 장씩 인쇄 */
  onPrint: (pages: string[]) => void;
}

export default function OutputModal({ form, title, formNo, values, lang, missingRequired, onClose, onPrint }: Props) {
  /** 쪽마다 하나 */
  const [pngs, setPngs] = useState<string[] | null>(null);
  const [saving, setSaving] = useState(false);
  /** 서식 이미지를 못 불러왔거나(네트워크) 그리지 못했을 때(메모리 부족 등) */
  const [failed, setFailed] = useState(false);
  /** 다시 시도 버튼을 누를 때마다 1씩 — 바뀌면 다시 그린다 */
  const [attempt, setAttempt] = useState(0);
  const multi = form.pages.length > 1;

  useEffect(() => {
    let alive = true;
    setPngs(null);
    setFailed(false);
    renderPagePngs(form, values).then(
      (urls) => alive && setPngs(urls),
      () => alive && setFailed(true),
    );
    return () => { alive = false; };
  }, [form, values, attempt]);

  const save = async () => {
    if (!pngs || saving) return;
    setSaving(true);
    try {
      downloadDataUrl(await joinPagePngs(pngs), `${title.ko}.png`);
      track({ type: 'fill_png_save', lang, formKey: form.id, formNo });
    } catch {
      // 여러 쪽을 이어 붙이다 실패한 경우 (휴대폰 메모리 부족 등)
      window.alert(tr(UI.saveFailed, lang));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex flex-col animate-fade-in sm:max-w-md sm:mx-auto">
      <header className="flex items-center justify-between px-4 py-3 bg-white shrink-0">
        <h2 className="font-black text-[16px]">{tr(UI.outputTitle, lang)}</h2>
        <button onClick={onClose} className="w-9 h-9 rounded-full bg-line flex items-center justify-center text-sub" aria-label={tr(UI.close, lang)}>
          <X size={18} />
        </button>
      </header>

      <div className="flex-1 overflow-auto p-4 space-y-4">
        {failed && (
          <div role="alert" className="mx-auto w-full max-w-[720px] rounded-2xl bg-white p-4 space-y-3 text-center">
            <p className="flex items-center justify-center gap-2 text-[14px] font-bold text-gray-900">
              <AlertTriangle size={16} className="text-amber-600 shrink-0" /> {tr(UI.renderFailed, lang)}
            </p>
            <button
              onClick={() => setAttempt((a) => a + 1)}
              className="h-11 px-5 rounded-2xl bg-brand text-brand-950 font-black text-sm inline-flex items-center gap-2 active:scale-95 transition"
            >
              <RotateCw size={16} /> {tr(UI.retry, lang)}
            </button>
          </div>
        )}
        {!failed && form.pages.map((pg, i) => (
          <figure key={pg.image} className="mx-auto w-full max-w-[720px]">
            {multi && (
              <figcaption className="mb-1.5 text-[12px] font-black text-white/90">
                {tr(UI.pageOf, lang, { n: i + 1, total: form.pages.length })}
              </figcaption>
            )}
            {pngs ? (
              <img src={pngs[i]} alt={multi ? `${title.ko} ${i + 1}/${form.pages.length}` : title.ko} className="w-full bg-white shadow-xl" />
            ) : (
              <div className="w-full bg-white/80 animate-pulse" style={{ aspectRatio: `${pg.width} / ${pg.height}` }} />
            )}
          </figure>
        ))}
      </div>

      <footer className="shrink-0 bg-white px-4 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))] space-y-3 rounded-t-3xl">
        {missingRequired > 0 && (
          <p className="flex items-center gap-2 text-[13px] font-bold text-amber-700 bg-amber-50 rounded-xl px-3 py-2">
            <AlertTriangle size={15} /> {tr(UI.missingRequired, lang, { n: missingRequired })}
          </p>
        )}
        <ul className="space-y-1.5 text-[12.5px] text-gray-700 font-medium">
          <li className="flex gap-2"><PenLine size={14} className="shrink-0 mt-0.5 text-brand-700" /> {tr(UI.noteSign, lang)}</li>
          <li className="flex gap-2"><UserCheck size={14} className="shrink-0 mt-0.5 text-brand-700" /> {tr(UI.noteCheck, lang)}</li>
          <li className="flex gap-2"><ShieldCheck size={14} className="shrink-0 mt-0.5 text-brand-700" /> {tr(UI.notePrivacy, lang)}</li>
        </ul>
        <div className="flex gap-2">
          <button
            disabled={!pngs || saving}
            onClick={() => void save()}
            className="flex-1 h-12 rounded-2xl bg-line text-gray-900 font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Download size={16} /> {tr(UI.saveImage, lang)}
          </button>
          <button
            disabled={!pngs}
            onClick={() => {
              if (!pngs) return;
              onPrint(pngs);
              track({ type: 'fill_print', lang, formKey: form.id, formNo });
            }}
            className="flex-1 h-12 rounded-2xl bg-brand text-brand-950 font-black text-sm flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Printer size={16} /> {tr(UI.print, lang)}
          </button>
        </div>
      </footer>
    </div>
  );
}
