import { useState } from 'react';
import { CheckCircle2, ShieldAlert, X } from 'lucide-react';
import { Lang } from '../forms/types';
import { tr, UI } from '../i18n';
import { sendFeedback, type FeedbackType } from '../lib/gusring-api';

// 의견 보내기 바텀시트 — 구스링 백엔드(POST /api/v1/feedbacks)로 저장한다.
// 서식 화면에서 열면 어느 서식·칸에 대한 의견인지 같이 보낸다 (칸에 적은 값은 보내지 않음).

const MAX_LEN = 2000;

const TYPES: { id: FeedbackType; label: keyof typeof UI }[] = [
  { id: 'general', label: 'feedbackGeneral' },
  { id: 'translation', label: 'feedbackTranslation' },
  { id: 'guide', label: 'feedbackGuide' },
  { id: 'bug', label: 'feedbackBug' },
];

export interface FeedbackContext {
  formKey?: string;
  fieldId?: string;
}

interface Props extends FeedbackContext {
  lang: Lang;
  onClose: () => void;
}

type Status = { kind: 'idle' } | { kind: 'sending' } | { kind: 'done' } | { kind: 'error'; message: keyof typeof UI };

export default function FeedbackSheet({ lang, formKey, fieldId, onClose }: Props) {
  const [type, setType] = useState<FeedbackType>(formKey ? 'guide' : 'general');
  const [message, setMessage] = useState('');
  /** 봇을 거르는 숨은 칸 — 사람은 볼 수 없어 비워 둔다 */
  const [website, setWebsite] = useState('');
  const [status, setStatus] = useState<Status>({ kind: 'idle' });

  const trimmed = message.trim();
  const canSend = trimmed.length > 0 && status.kind !== 'sending';

  const submit = async () => {
    if (!canSend) return;
    setStatus({ kind: 'sending' });
    const r = await sendFeedback({ lang, type, message: trimmed, formKey, fieldId, website });
    if (r.ok) setStatus({ kind: 'done' });
    else if (r.code === 'FEEDBACK_RATE_LIMITED' || r.code === 'COMMON_TOO_MANY_REQUESTS') setStatus({ kind: 'error', message: 'feedbackRateLimited' });
    else if (r.code === 'COMMON_INVALID_INPUT') setStatus({ kind: 'error', message: 'feedbackInvalid' });
    else setStatus({ kind: 'error', message: 'feedbackError' });
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end sm:items-center">
      <div className="absolute inset-0 bg-black/40 animate-fade-in" onClick={onClose} />
      <section
        className="relative w-full sm:max-w-md bg-white rounded-t-[28px] shadow-sheet animate-sheet-up max-h-[85dvh] flex flex-col"
        aria-label={tr(UI.feedback, lang)}
      >
        <header className="flex items-center justify-between px-5 py-4 border-b border-line shrink-0">
          <h2 className="font-black text-[17px]">{tr(UI.feedback, lang)}</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-line flex items-center justify-center text-sub" aria-label={tr(UI.close, lang)}>
            <X size={16} />
          </button>
        </header>

        {status.kind === 'done' ? (
          <div className="px-5 py-10 pb-[max(2.5rem,env(safe-area-inset-bottom))] flex flex-col items-center gap-3 text-center">
            <CheckCircle2 size={40} className="text-brand-700" />
            <p className="font-black text-[16px] text-gusring-text">{tr(UI.feedbackThanks, lang)}</p>
            <button onClick={onClose} className="mt-2 h-12 px-8 rounded-2xl bg-brand text-brand-950 font-black text-sm">
              {tr(UI.close, lang)}
            </button>
          </div>
        ) : (
          <form
            className="overflow-y-auto px-5 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))] space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              void submit();
            }}
          >
            <fieldset>
              <legend className="text-[13px] font-bold text-sub mb-2">{tr(UI.feedbackTypeLabel, lang)}</legend>
              <div className="flex flex-wrap gap-2">
                {TYPES.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setType(t.id)}
                    aria-pressed={type === t.id}
                    className={`toss-chip ${type === t.id ? 'active' : ''}`}
                  >
                    {tr(UI[t.label], lang)}
                  </button>
                ))}
              </div>
            </fieldset>

            <div>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                maxLength={MAX_LEN}
                rows={5}
                placeholder={tr(UI.feedbackPlaceholder, lang)}
                className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-[14px] leading-relaxed focus:outline-none focus:border-brand resize-none"
              />
              <p className="text-right text-[11px] text-hint font-medium">{message.length} / {MAX_LEN}</p>
            </div>

            {/* 봇만 채우는 숨은 칸 (화면·스크린리더에 보이지 않음) */}
            <input
              type="text"
              name="website"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="absolute -left-[9999px] w-px h-px opacity-0"
            />

            <p className="flex gap-2 text-[12.5px] text-gray-700 font-medium">
              <ShieldAlert size={14} className="shrink-0 mt-0.5 text-brand-700" /> {tr(UI.feedbackPrivacy, lang)}
            </p>

            {status.kind === 'error' && (
              <p role="alert" className="text-[13px] font-bold text-amber-700 bg-amber-50 rounded-xl px-3 py-2">
                {tr(UI[status.message], lang)}
              </p>
            )}

            <button
              type="submit"
              disabled={!canSend}
              className="w-full h-12 rounded-2xl bg-brand text-brand-950 font-black text-sm disabled:opacity-50"
            >
              {tr(status.kind === 'sending' ? UI.feedbackSending : UI.feedbackSend, lang)}
            </button>
          </form>
        )}
      </section>
    </div>
  );
}
