import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Eye, EyeOff, FileCheck2, Menu, Minus, Plus, RotateCcw, X } from 'lucide-react';
import FieldListSheet from '../components/FieldListSheet';
import FieldSheet from '../components/FieldSheet';
import FormSvg, { fieldCrop, pageOf } from '../components/FormSvg';
import OutputModal from '../components/OutputModal';
import { isFilled } from '../forms/render';
import { CatalogItem, entryKey, entryTitle } from '../forms/catalog';
import { Box, FieldValue, Lang, pageIndex, Values } from '../forms/types';
import { tr, UI } from '../i18n';
import { flush, track } from '../lib/gusring-api';
import { load, remove, save } from '../lib/storage';
import Header from './Header';

const TIP_KEY = 'gusring.tipClosed';

const MIN_ZOOM = 1;
const MAX_ZOOM = 4;

interface Props {
  /** 문서 선택 화면의 항목 (서식 + v1 서식 번호) */
  entry: CatalogItem;
  /** 언어 선택 화면에서 고른 언어. 안내·라벨이 모두 이 언어로 나온다. */
  lang: Lang;
  onBack: () => void;
  onLanding: () => void;
  onMap: () => void;
}

export default function FormFillView({ entry, lang, onBack, onLanding, onMap }: Props) {
  const form = entry.form;
  const title = entryTitle(entry);
  const VALUES_KEY = `gusring.${entryKey(entry)}.values`;
  const [values, setValues] = useState<Values>(() => load<Values>(VALUES_KEY, {}));
  const [activeId, setActiveId] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [showGuides, setShowGuides] = useState(true);
  const [listOpen, setListOpen] = useState(false);
  const [outputOpen, setOutputOpen] = useState(false);
  /** 인쇄할 쪽 이미지 (쪽마다 A4 한 장) */
  const [printPages, setPrintPages] = useState<string[] | null>(null);
  /** 보고 있는 쪽 (0부터) */
  const [page, setPage] = useState(0);
  const pg = form.pages[page] ?? form.pages[0];
  const multiPage = form.pages.length > 1;
  const [tipOpen, setTipOpen] = useState(() => !load<boolean>(TIP_KEY, false));
  const [, setFontTick] = useState(0);
  /** 열려 있는 바텀시트 높이 (px) */
  const [sheetH, setSheetH] = useState(0);
  /** 줌을 바꾼 뒤 이 영역(서식 픽셀 좌표)이 보이도록 스크롤 */
  const [scrollTick, setScrollTick] = useState(0);
  const pendingFocus = useRef<{ box: Box; visibleH: number } | null>(null);
  const lastActive = useRef<string | null>(null);
  /** 확대 영역 계산용 — 값이 바뀔 때마다 다시 확대하지 않도록 ref로 읽는다 */
  const valuesRef = useRef(values);
  valuesRef.current = values;

  const viewerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const zoomAnchor = useRef<{ x: number; y: number } | null>(null);

  // ── 이용 기록 (formKey = 서식 id, formNo = v1 서식 번호, 칸에 적은 값은 보내지 않는다) ──
  const formKey = form.id;
  const formNo = entry.formNo;
  /** 이 화면에서 처음 값을 바꿨는지 — fill_start는 화면에 들어올 때마다 한 번 */
  const fillStarted = useRef(false);
  useEffect(() => {
    track({ type: 'form_view', lang, formKey, formNo });
    let enteredAt = Date.now();
    let sent = false;
    const sendTime = () => {
      if (sent) return;
      sent = true;
      track({ type: 'detail_time', lang, formKey, formNo, durationSec: (Date.now() - enteredAt) / 1000 });
    };
    // 탭을 바로 닫으면 화면이 내려가지 않으므로 페이지를 떠날 때도 보낸다
    const onPageHide = () => {
      sendTime();
      void flush(true);
    };
    // 뒤로가기 캐시(bfcache)로 돌아오면 이 화면에 다시 들어온 것으로 잰다
    const onPageShow = (e: PageTransitionEvent) => {
      if (!e.persisted) return;
      enteredAt = Date.now();
      sent = false;
    };
    window.addEventListener('pagehide', onPageHide);
    window.addEventListener('pageshow', onPageShow);
    return () => {
      window.removeEventListener('pagehide', onPageHide);
      window.removeEventListener('pageshow', onPageShow);
      sendTime();
    };
  }, [formKey, formNo, lang]);

  // ── 저장 & 환경 ────────────────────────────────────────────
  useEffect(() => save(VALUES_KEY, values), [VALUES_KEY, values]);
  // 웹폰트가 늦게 로드되면 글자 폭 계산을 다시 한다
  useEffect(() => {
    document.fonts?.ready.then(() => setFontTick((t) => t + 1));
  }, []);

  // ── 진행 상태 ──────────────────────────────────────────────
  const filled = useMemo(
    () => new Set(form.fields.filter((f) => isFilled(f, values[f.id])).map((f) => f.id)),
    [form, values],
  );
  const required = form.fields.filter((f) => f.required);
  const requiredDone = required.filter((f) => filled.has(f.id)).length;
  const activeIndex = form.fields.findIndex((f) => f.id === activeId);
  const activeField = activeIndex >= 0 ? form.fields[activeIndex] : null;

  // ── 줌 (서식 전체 폭이 화면에 맞는 100%에서 시작) ─────────
  const changeZoom = (factor: number) => {
    const v = viewerRef.current;
    if (v) {
      // 화면 중앙이 같은 위치에 머물도록 비율을 기억
      zoomAnchor.current = {
        x: (v.scrollLeft + v.clientWidth / 2) / v.scrollWidth,
        y: (v.scrollTop + v.clientHeight / 2) / v.scrollHeight,
      };
    }
    setZoom((z) => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, +(z * factor).toFixed(2))));
  };

  useLayoutEffect(() => {
    const v = viewerRef.current;
    const c = canvasRef.current;
    if (!v || !c) return;

    const focus = pendingFocus.current;
    if (focus) {
      // 확대된 칸을 가로 가운데, 시트 위 남은 공간의 세로 가운데에 놓는다
      const scale = c.clientWidth / pg.width;
      const w = focus.box.w * scale;
      const h = focus.box.h * scale;
      v.scrollLeft = w <= v.clientWidth ? focus.box.x * scale - (v.clientWidth - w) / 2 : focus.box.x * scale - 12;
      v.scrollTop = focus.box.y * scale - Math.max(12, (focus.visibleH - h) / 2);
      pendingFocus.current = null;
      return;
    }

    const a = zoomAnchor.current;
    if (!a) return;
    v.scrollLeft = a.x * v.scrollWidth - v.clientWidth / 2;
    v.scrollTop = a.y * v.scrollHeight - v.clientHeight / 2;
    zoomAnchor.current = null;
  }, [zoom, scrollTick, pg]);

  /** 작성 중인 칸을 바텀시트 위 공간에 꽉 차게 확대 */
  const focusField = useCallback((id: string, sheetPx: number) => {
    const v = viewerRef.current;
    const f = form.fields.find((x) => x.id === id);
    if (!v || !f) return;
    const box = fieldCrop(f, form, valuesRef.current[id]);
    const { width } = pageOf(form, f);
    const vw = v.clientWidth;
    const visibleH = Math.max(100, window.innerHeight - sheetPx - v.getBoundingClientRect().top);
    const byWidth = ((vw - 24) / vw) * (width / box.w);
    const byHeight = (visibleH * 0.85) / ((box.h / width) * vw);
    pendingFocus.current = { box, visibleH };
    setZoom(+Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, Math.min(byWidth, byHeight))).toFixed(3));
    setScrollTick((t) => t + 1);
  }, [form]);

  // 시트가 열리거나 높이가 바뀌면 작성 중인 칸으로 확대
  useEffect(() => {
    if (activeId && sheetH) focusField(activeId, sheetH);
  }, [activeId, sheetH, focusField]);

  // 시트를 닫으면 100%로 돌아가며 방금 쓴 칸 근처를 보여준다
  useEffect(() => {
    if (activeId) {
      lastActive.current = activeId;
      return;
    }
    const f = form.fields.find((x) => x.id === lastActive.current);
    lastActive.current = null;
    setSheetH(0);
    if (!f || !viewerRef.current) return;
    pendingFocus.current = { box: { x: 0, y: f.area.y, w: pageOf(form, f).width, h: f.area.h }, visibleH: viewerRef.current.clientHeight };
    setZoom(1);
    setScrollTick((t) => t + 1);
  }, [activeId, form]);

  /** 마지막으로 작성한 칸 — 시트를 닫아도 이전/다음 이동의 기준이 된다 */
  const [cursor, setCursor] = useState(-1);

  const select = useCallback((id: string) => {
    const index = form.fields.findIndex((f) => f.id === id);
    if (index < 0) return;
    // 다른 쪽의 칸이면 그 쪽으로 넘긴다
    setPage(pageIndex(form.fields[index]));
    setActiveId(id);
    setCursor(index);
    setListOpen(false);
  }, [form]);

  /** 쪽 전환 버튼 — 새 쪽의 맨 위부터 100%로 */
  const showPage = (next: number) => {
    if (next < 0 || next >= form.pages.length) return;
    setPage(next);
    setZoom(1);
    if (viewerRef.current) viewerRef.current.scrollTo({ top: 0, left: 0 });
  };

  /** 서식 위 번호나 전체 항목에서 직접 고른 칸만 field_open으로 센다 (이전·다음으로 넘긴 칸은 세지 않음) */
  const openField = useCallback((id: string) => {
    track({ type: 'field_open', lang, formKey, formNo, fieldId: id });
    select(id);
  }, [select, lang, formKey, formNo]);

  const goto = (index: number) => {
    const f = form.fields[index];
    if (f) select(f.id);
  };

  const updateValue = (id: string, value: FieldValue) => {
    if (!fillStarted.current) {
      fillStarted.current = true;
      track({ type: 'fill_start', lang, formKey, formNo });
    }
    setValues((prev) => ({ ...prev, [id]: value }));
  };

  const reset = () => {
    if (!window.confirm(tr(UI.resetConfirm, lang))) return;
    track({ type: 'fill_reset', lang, formKey, formNo });
    fillStarted.current = false;
    setValues({});
    setActiveId(null);
    setCursor(-1);
    remove(VALUES_KEY);
  };

  // ── 인쇄 (쪽마다 A4 한 장) ────────────────────────────────
  useEffect(() => {
    if (!printPages) return;
    let alive = true;
    const after = () => setPrintPages(null);
    window.addEventListener('afterprint', after, { once: true });
    const loaded = printPages.map(
      (src) =>
        new Promise<void>((resolve) => {
          const img = new Image();
          img.onload = img.onerror = () => resolve();
          img.src = src;
        }),
    );
    Promise.all(loaded).then(() => alive && window.print());
    return () => {
      alive = false;
      window.removeEventListener('afterprint', after);
    };
  }, [printPages]);

  return (
    <>
      <div className="no-print h-[100dvh] flex flex-col bg-white">
        <Header
          lang={lang}
          onBack={onBack}
          onLanding={onLanding}
          onMap={onMap}
          feedbackContext={{ formKey, formNo, fieldId: activeId ?? undefined }}
        />

        {/* 전체 항목 · 서류 이름 · 이전 · 다음 */}
        <div className="relative shrink-0 h-12 px-3 flex items-center gap-1 bg-white border-b border-line">
          <div className="absolute left-1/2 -translate-x-1/2 max-w-[calc(100%-200px)] text-center pointer-events-none">
            <h1 className="font-black text-[15px] leading-tight truncate text-gusring-text">{tr(title, lang)}</h1>
            {lang !== 'ko' && <p className="text-[10px] font-bold leading-tight truncate text-hint">{title.ko}</p>}
          </div>
          <button onClick={() => setListOpen(true)} className="h-10 w-10 rounded-xl text-gusring-text flex items-center justify-center active:bg-line transition" aria-label={tr(UI.allFields, lang)}>
            <Menu size={20} />
          </button>
          <button
            onClick={() => goto(cursor - 1)}
            disabled={cursor <= 0}
            className="ml-auto h-9 w-9 rounded-xl bg-line text-gray-800 flex items-center justify-center active:scale-95 transition disabled:opacity-40"
            aria-label={tr(UI.prev, lang)}
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => goto(cursor + 1)}
            disabled={cursor >= form.fields.length - 1}
            className="h-9 w-9 rounded-xl bg-line text-gray-800 flex items-center justify-center active:scale-95 transition disabled:opacity-40"
            aria-label={tr(UI.next, lang)}
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {/* 서식 뷰어 */}
        <div className="relative flex-1 min-h-0">
          <div ref={viewerRef} className="absolute inset-0 overflow-auto bg-gray-100">
            <div
              ref={canvasRef}
              className="mx-auto bg-white shadow-sm"
              style={{ width: `${zoom * 100}%`, paddingBottom: activeField ? '70dvh' : 0 }}
            >
              <FormSvg
                form={form}
                page={page}
                values={values}
                className="block w-full h-auto select-none"
                guides={showGuides ? { activeId, filled, onSelect: openField } : undefined}
                highlightId={showGuides ? null : activeId}
              />
            </div>
          </div>

          {tipOpen && !activeField && (
            <div className="absolute top-3 inset-x-3 sm:left-1/2 sm:-translate-x-1/2 sm:w-[480px] flex gap-2 items-start p-3 rounded-2xl bg-gray-900/90 text-white shadow-lg animate-fade-in">
              <p className="flex-1 text-[13px] leading-relaxed font-medium">{tr(UI.intro, lang)}</p>
              <button
                onClick={() => { setTipOpen(false); save(TIP_KEY, true); }}
                className="w-7 h-7 rounded-full bg-white/15 flex items-center justify-center shrink-0"
                aria-label={tr(UI.close, lang)}
              >
                <X size={14} />
              </button>
            </div>
          )}

          {/* 쪽 전환 (여러 쪽 서식만) */}
          {multiPage && !activeField && (
            <div className="absolute left-3 bottom-3 h-10 rounded-full bg-white shadow-card border border-line flex items-center overflow-hidden">
              <button onClick={() => showPage(page - 1)} disabled={page === 0} className="w-10 h-10 flex items-center justify-center text-gray-700 disabled:opacity-30" aria-label={tr(UI.prevPage, lang)}>
                <ChevronLeft size={18} />
              </button>
              <span className="px-1 text-[12px] font-black text-gray-800 tabular-nums whitespace-nowrap" aria-live="polite">
                {tr(UI.pageOf, lang, { n: page + 1, total: form.pages.length })}
              </span>
              <button onClick={() => showPage(page + 1)} disabled={page === form.pages.length - 1} className="w-10 h-10 flex items-center justify-center text-gray-700 disabled:opacity-30" aria-label={tr(UI.nextPage, lang)}>
                <ChevronRight size={18} />
              </button>
            </div>
          )}

          {/* 줌 / 번호 표시 */}
          {!activeField && (
            <div className="absolute right-3 bottom-3 flex flex-col gap-2">
              <button onClick={() => setShowGuides((s) => !s)} className="w-10 h-10 rounded-full bg-white shadow-card border border-line flex items-center justify-center text-gray-700" aria-label={tr(UI.showGuides, lang)}>
                {showGuides ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
              <div className="rounded-full bg-white shadow-card border border-line flex flex-col overflow-hidden">
                <button onClick={() => changeZoom(1.25)} disabled={zoom >= MAX_ZOOM} className="w-10 h-10 flex items-center justify-center text-gray-700 disabled:opacity-30" aria-label={tr(UI.zoomIn, lang)}>
                  <Plus size={18} />
                </button>
                <button onClick={() => changeZoom(0.8)} disabled={zoom <= MIN_ZOOM} className="w-10 h-10 flex items-center justify-center text-gray-700 border-t border-line disabled:opacity-30" aria-label={tr(UI.zoomOut, lang)}>
                  <Minus size={18} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 하단 바 */}
        <nav className="shrink-0 border-t border-line bg-white pb-[env(safe-area-inset-bottom)]">
          <div className="px-4 py-2.5 flex gap-1">
            <button onClick={reset} className="h-12 w-12 rounded-2xl text-sub flex items-center justify-center active:bg-line transition" aria-label={tr(UI.reset, lang)}>
              <RotateCcw size={16} />
            </button>
            <button
              onClick={() => { setActiveId(null); setOutputOpen(true); track({ type: 'fill_preview', lang, formKey, formNo }); }}
              className="flex-1 h-12 rounded-2xl bg-brand text-brand-950 font-black text-[14px] flex items-center justify-center gap-1.5 shadow-[0_3px_12px_rgba(254,219,2,0.45)] active:scale-[0.97] transition"
            >
              <FileCheck2 size={17} /> {tr(UI.finish, lang)}
            </button>
          </div>
        </nav>

        {activeField && (
          <FieldSheet
            form={form}
            field={activeField}
            index={activeIndex}
            values={values}
            lang={lang}
            onChange={updateValue}
            onPrev={() => goto(activeIndex - 1)}
            onNext={() => goto(activeIndex + 1)}
            onClose={() => setActiveId(null)}
            onHeight={setSheetH}
          />
        )}

        {listOpen && <FieldListSheet form={form} values={values} lang={lang} onSelect={openField} onClose={() => setListOpen(false)} />}

        {outputOpen && (
          <OutputModal
            form={form}
            title={title}
            formNo={formNo}
            values={values}
            lang={lang}
            missingRequired={required.length - requiredDone}
            onClose={() => setOutputOpen(false)}
            onPrint={setPrintPages}
          />
        )}
      </div>

      {/* 인쇄 전용 — 완성된 한국어 서식만 쪽마다 A4 한 장으로 출력 */}
      {printPages?.map((src, i) => <img key={i} src={src} alt="" className="print-only print-page" />)}
    </>
  );
}
