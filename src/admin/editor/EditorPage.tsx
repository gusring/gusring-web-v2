import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertTriangle, ArrowDown, ArrowUp, Eye, EyeOff, FileDown, History, ListChecks, Minus, MousePointer2, Plus, Redo2, Save, Send, Smartphone, SquarePlus, Undo2,
} from 'lucide-react';
import { toFormDef } from '../../forms/definition';
import { Box, FieldDef, FormDefinition, Lang, pageIndex } from '../../forms/types';
import { Problem, validateDefinition } from '../../forms/validate';
import FormFillView from '../../pages/FormFillView';
import { adminApi, AdminForm, ApiError, errorText, FormVersion, imageUrl, Me } from '../api';
import Canvas, { Tool } from './Canvas';
import FieldPanel from './FieldPanel';
import FormPanel from './FormPanel';
import { moveTarget, newField, Target, uniqueId } from './geometry';
import { useHistory } from './useHistory';
import { badgePoint } from '../../components/FormSvg';

// ─────────────────────────────────────────────────────────────
// 서식 편집기: 왼쪽 칸 목록·검사, 가운데 서식(드래그), 오른쪽 속성
// 저장하면 초안, 계정 관리자가 「게시」해야 이용자에게 보인다.
// ─────────────────────────────────────────────────────────────

interface Doc {
  key: string;
  formNo: number;
  def: FormDefinition;
}

const docOf = (f: AdminForm): Doc => ({ key: f.key, formNo: f.formNo, def: f.draft });
const isTyping = (el: EventTarget | null) => el instanceof HTMLElement && (el.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(el.tagName));
const KIND_NAMES: Record<string, string> = { text: '글자', date: '날짜', datetime: '날짜·시각', choice: '선택', country: '국가', idnum: '번호' };

export default function EditorPage({ id, me, onAuthLost }: { id: string; me: Me; onAuthLost: () => void }) {
  const [loaded, setLoaded] = useState<AdminForm | null>(null);
  const [loadError, setLoadError] = useState('');
  const hist = useHistory<Doc | null>(null);
  const doc = hist.value;
  const [savedJson, setSavedJson] = useState('');
  const [base, setBase] = useState('');
  const [status, setStatus] = useState<{ kind: 'ok' | 'error'; text: string } | null>(null);
  const [conflict, setConflict] = useState<{ draftUpdatedAt?: string; draftUpdatedBy?: string } | null>(null);
  const [serverProblems, setServerProblems] = useState<Problem[] | null>(null);
  const [busy, setBusy] = useState(false);

  const [page, setPage] = useState(0);
  const [zoom, setZoom] = useState(0.7);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [target, setTarget] = useState<Target | null>(null);
  const [tool, setTool] = useState<Tool>({ type: 'select' });
  const [preview, setPreview] = useState(false);
  const [panel, setPanel] = useState<'problems' | 'versions' | null>('problems');
  const [userPreview, setUserPreview] = useState<Lang | null>(null);
  const [importOpen, setImportOpen] = useState(false);
  const canvasBox = useRef<HTMLDivElement>(null);

  const handle = useCallback((e: unknown) => {
    if (e instanceof ApiError && e.status === 401) return onAuthLost();
    setStatus({ kind: 'error', text: errorText(e) });
  }, [onAuthLost]);

  const applyLoaded = useCallback((f: AdminForm) => {
    setLoaded(f);
    hist.reset(docOf(f));
    setSavedJson(JSON.stringify(docOf(f)));
    setBase(f.draftUpdatedAt);
    setConflict(null);
  }, [hist.reset]);

  const load = useCallback(() => adminApi.get(id).then(applyLoaded, (e) => {
    if (e instanceof ApiError && e.status === 401) return onAuthLost();
    setLoadError(errorText(e));
  }), [id, applyLoaded, onAuthLost]);
  useEffect(() => { void load(); }, [load]);

  const dirty = !!doc && JSON.stringify(doc) !== savedJson;
  const def = doc?.def;

  // 저장하지 않은 수정이 있으면 창을 닫을 때 묻는다
  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  // 쪽 폭을 화면에 맞춘다
  const fit = useCallback(() => {
    const pg = def?.pages[page];
    const w = canvasBox.current?.clientWidth;
    if (pg && w) setZoom(Math.max(0.2, Math.min(3, +((w - 48) / pg.width).toFixed(2))));
  }, [def?.pages, page]);
  useEffect(() => { fit(); }, [page, !!def?.pages.length]); // eslint-disable-line react-hooks/exhaustive-deps

  const problems = useMemo(() => (def ? validateDefinition(def) : []), [def]);

  // ── 바꾸기 ──
  const setDef = useCallback((update: (d: FormDefinition) => FormDefinition, coalesce?: string) => {
    hist.set((d) => (d ? { ...d, def: update(d.def) } : d), coalesce);
  }, [hist.set]);

  const setField = useCallback((fid: string, update: (f: FieldDef) => FieldDef, coalesce?: string) => {
    setDef((d) => ({ ...d, fields: d.fields.map((f) => (f.id === fid ? update(f) : f)) }), coalesce);
  }, [setDef]);

  const select = useCallback((fid: string | null, t?: Target) => {
    setSelectedId(fid);
    setTarget(fid ? t ?? { kind: 'area' } : null);
    if (fid && def) {
      const f = def.fields.find((x) => x.id === fid);
      if (f && pageIndex(f) !== page) setPage(pageIndex(f));
    }
  }, [def, page]);

  /** 목록에서 고르면 그 칸이 보이게 스크롤 */
  const reveal = (f: FieldDef) => {
    select(f.id);
    requestAnimationFrame(() => {
      const el = canvasBox.current;
      if (!el) return;
      el.scrollTo({ top: Math.max(0, f.area.y * zoom - 120), left: Math.max(0, f.area.x * zoom - 80), behavior: 'smooth' });
    });
  };

  const createField = (area: Box) => {
    if (!def) return;
    const fid = uniqueId('field', new Set(def.fields.map((f) => f.id)));
    const f = newField(fid, def.sections[0]?.id ?? 'main', area, page + 1);
    setDef((d) => {
      // 번호는 쪽 순서 → 그 쪽의 맨 뒤
      const at = d.fields.reduce((last, x, i) => (pageIndex(x) <= page ? i + 1 : last), 0);
      return { ...d, fields: [...d.fields.slice(0, at), f, ...d.fields.slice(at)] };
    });
    select(fid, { kind: 'area' });
  };

  const deleteField = (fid: string) => {
    const f = def?.fields.find((x) => x.id === fid);
    if (!f || !window.confirm(`「${f.koLabel || f.id}」 칸을 지울까요? (되돌리기로 살릴 수 있음)`)) return;
    setDef((d) => ({ ...d, fields: d.fields.filter((x) => x.id !== fid) }));
    select(null);
  };

  const duplicateField = (fid: string) => {
    if (!def) return;
    const i = def.fields.findIndex((x) => x.id === fid);
    const src = def.fields[i];
    const nid = uniqueId(`${src.id}Copy`, new Set(def.fields.map((f) => f.id)));
    const copy = moveTarget({ ...structuredClone(src), id: nid }, { kind: 'area' }, 0, src.area.h + 4, badgePoint(src, { image: '', ...def.pages[pageIndex(src)] }));
    setDef((d) => ({ ...d, fields: [...d.fields.slice(0, i + 1), copy, ...d.fields.slice(i + 1)] }));
    select(nid);
  };

  const renameField = (oldId: string, newId: string) => {
    if (!def) return;
    if (def.fields.some((f) => f.id === newId)) return window.alert('이미 있는 칸 id입니다.');
    setDef((d) => {
      const preset = d.preset && Object.fromEntries(Object.entries(d.preset).map(([k, v]) => [k === oldId ? newId : k, v]));
      return {
        ...d,
        ...(preset && { preset }),
        fields: d.fields.map((f) => ({
          ...(f.id === oldId ? { ...f, id: newId } : f),
          ...(f.copyFrom && { copyFrom: f.copyFrom.map((c) => (c.field === oldId ? { ...c, field: newId } : c)) }),
        })),
      };
    });
    setSelectedId(newId);
  };

  /** 같은 쪽 안에서 번호 순서 바꾸기 */
  const moveOrder = (fid: string, d: number) => {
    setDef((x) => {
      const i = x.fields.findIndex((f) => f.id === fid);
      const j = i + d;
      if (j < 0 || j >= x.fields.length || pageIndex(x.fields[i]) !== pageIndex(x.fields[j])) return x;
      const fields = [...x.fields];
      [fields[i], fields[j]] = [fields[j], fields[i]];
      return { ...x, fields };
    });
  };

  // ── 저장·게시 ──
  const save = useCallback(async (overrideBase?: string): Promise<boolean> => {
    if (!doc) return false;
    setBusy(true);
    try {
      const r = await adminApi.save(id, { definition: doc.def, key: doc.key, formNo: doc.formNo, baseUpdatedAt: overrideBase ?? base });
      setLoaded(r);
      setBase(r.draftUpdatedAt);
      setSavedJson(JSON.stringify(doc));
      setConflict(null);
      setStatus({ kind: 'ok', text: '초안을 저장했습니다.' });
      return true;
    } catch (e) {
      if (e instanceof ApiError && e.code === 'FORM_CONFLICT') {
        setConflict((e.details as { draftUpdatedAt?: string; draftUpdatedBy?: string }) ?? {});
        return false;
      }
      handle(e);
      return false;
    } finally {
      setBusy(false);
    }
  }, [doc, id, base, handle]);

  const overwrite = async () => {
    try {
      const latest = await adminApi.get(id);
      await save(latest.draftUpdatedAt);
    } catch (e) {
      handle(e);
    }
  };

  const publish = async () => {
    if (!doc || !loaded) return;
    if (problems.length && !window.confirm(`검사 문제 ${problems.length}건이 있습니다. 서버 검사에서 막힐 수 있습니다. 그래도 게시할까요?`)) return;
    if (!window.confirm(`「${doc.def.title.ko}」을 게시할까요? 이용자 화면에 바로 반영됩니다.`)) return;
    if (dirty && !(await save())) return;
    setBusy(true);
    setServerProblems(null);
    try {
      const { version } = await adminApi.publish(id);
      setLoaded({ ...loaded, publishedVersion: version });
      setStatus({ kind: 'ok', text: `${version}번 버전을 게시했습니다. 이용자 화면에 반영됐습니다.` });
    } catch (e) {
      if (e instanceof ApiError && e.code === 'FORM_INVALID') {
        setServerProblems(Array.isArray(e.details) ? (e.details as Problem[]) : []);
        setPanel('problems');
        setStatus({ kind: 'error', text: '서버 검사를 통과하지 못해 게시하지 않았습니다.' });
      } else handle(e);
    } finally {
      setBusy(false);
    }
  };

  // ── 키보드 ──
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey;
      if (mod && e.key.toLowerCase() === 's') {
        e.preventDefault();
        void save();
        return;
      }
      if (isTyping(e.target)) return;
      if (mod && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (e.shiftKey) hist.redo(); else hist.undo();
        return;
      }
      if (mod && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        hist.redo();
        return;
      }
      if (e.key === 'Escape') {
        if (tool.type !== 'select') setTool({ type: 'select' });
        else select(null);
        return;
      }
      if (e.key === 'n' && !mod) {
        setTool({ type: 'newField' });
        return;
      }
      if (!selectedId || !def) return;
      if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault();
        deleteField(selectedId);
        return;
      }
      const step = e.shiftKey ? 10 : 1;
      const d = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] }[e.key];
      if (d && target) {
        e.preventDefault();
        const f = def.fields.find((x) => x.id === selectedId);
        if (!f) return;
        const pg = def.pages[pageIndex(f)];
        setField(selectedId, (x) => moveTarget(x, target, d[0], d[1], badgePoint(x, { image: '', ...pg })), `nudge-${selectedId}-${JSON.stringify(target)}`);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  if (loadError) return <p className="p-6 text-red-600 font-semibold">{loadError} <a href="#/" className="underline">목록으로</a></p>;
  if (!doc || !def || !loaded) return <p className="p-6 text-sub">불러오는 중…</p>;

  const selected = def.fields.find((f) => f.id === selectedId) ?? null;
  const pageFields = def.fields.map((f, idx) => ({ f, idx }));
  const problemCount = (fid: string) => problems.filter((p) => p.fieldId === fid).length;
  const toolHint =
    tool.type === 'newField' ? '서식 위를 끌어 새 칸의 영역을 그리세요 (Esc 취소)'
      : tool.type === 'drawSlot' ? `「${tool.slot === 'area' ? '칸 영역' : tool.slot}」 상자를 서식 위에 끌어 그리세요 (Esc 취소)`
        : tool.type === 'placeMark' ? `선택지 「${tool.option}」의 ○·✓ 위치를 서식 위에서 누르세요 (Esc 취소)` : '';

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* 도구 줄 */}
      <div className="shrink-0 bg-white border-b border-gray-200 px-3 h-12 flex items-center gap-1.5 text-[13px]">
        <a href="#/" className="text-sub hover:text-gray-900 mr-1">← 목록</a>
        <strong className="truncate max-w-[220px]">{def.title.ko || doc.key}</strong>
        <span className="text-[11px] text-hint">{doc.formNo}번 · {loaded.publishedVersion ? `게시 v${loaded.publishedVersion}` : '게시 전'}</span>
        <span className={`text-[11px] font-bold ${dirty ? 'text-amber-700' : 'text-green-700'}`}>{dirty ? '저장 안 됨' : '저장됨'}</span>

        <div className="mx-2 h-6 w-px bg-gray-200" />
        <button title="고르기 (Esc)" onClick={() => setTool({ type: 'select' })} className={`admin-tool ${tool.type === 'select' ? 'on' : ''}`}><MousePointer2 size={15} /></button>
        <button title="새 칸 그리기 (N)" onClick={() => setTool({ type: 'newField' })} className={`admin-tool ${tool.type === 'newField' ? 'on' : ''}`} disabled={!def.pages.length}><SquarePlus size={15} /> 새 칸</button>
        <button title="되돌리기 (⌘Z)" onClick={hist.undo} disabled={!hist.canUndo} className="admin-tool"><Undo2 size={15} /></button>
        <button title="다시하기 (⇧⌘Z)" onClick={hist.redo} disabled={!hist.canRedo} className="admin-tool"><Redo2 size={15} /></button>
        <div className="mx-2 h-6 w-px bg-gray-200" />
        <button title="축소" onClick={() => setZoom((z) => Math.max(0.2, +(z / 1.2).toFixed(2)))} className="admin-tool"><Minus size={15} /></button>
        <button title="쪽 폭에 맞추기" onClick={fit} className="admin-tool tabular-nums w-14">{Math.round(zoom * 100)}%</button>
        <button title="확대" onClick={() => setZoom((z) => Math.min(4, +(z * 1.2).toFixed(2)))} className="admin-tool"><Plus size={15} /></button>
        <button title="가짜 값으로 글자 크기 미리보기" onClick={() => setPreview((p) => !p)} className={`admin-tool ${preview ? 'on' : ''}`}>{preview ? <Eye size={15} /> : <EyeOff size={15} />} 값 미리보기</button>

        <div className="ml-auto flex items-center gap-1.5">
          <button onClick={() => setImportOpen(true)} className="admin-tool" title="다른 서식의 칸 가져오기"><FileDown size={15} /> 칸 가져오기</button>
          <button onClick={() => setUserPreview('ko')} className="admin-tool" title="이용자 화면으로 입력해 보기"><Smartphone size={15} /> 이용자 화면</button>
          <button onClick={() => setPanel(panel === 'versions' ? 'problems' : 'versions')} className={`admin-tool ${panel === 'versions' ? 'on' : ''}`}><History size={15} /> 이력</button>
          <button onClick={() => void save()} disabled={busy || !dirty} className="h-8 px-3 rounded-lg bg-gray-900 text-white font-bold inline-flex items-center gap-1 disabled:opacity-40"><Save size={14} /> 저장</button>
          {me.role === 'manager' && (
            <button onClick={() => void publish()} disabled={busy} className="h-8 px-3 rounded-lg bg-brand text-brand-950 font-black inline-flex items-center gap-1 disabled:opacity-40"><Send size={14} /> 게시</button>
          )}
        </div>
      </div>

      {/* 안내 줄은 늘 같은 높이 — 도구를 켜고 끌 때 서식이 위아래로 움직이지 않게 */}
      {(
        <div className="shrink-0 h-8 px-3 text-[12px] font-semibold flex items-center gap-3 bg-white border-b border-gray-200 overflow-hidden whitespace-nowrap">
          {toolHint && <span className="text-blue-700">{toolHint}</span>}
          {conflict && (
            <span className="text-red-700 flex items-center gap-2">
              <AlertTriangle size={14} /> {conflict.draftUpdatedBy ?? '다른 사람'}이(가) 먼저 저장했습니다.
              <button onClick={() => !dirty || window.confirm('내 수정을 버리고 서버 것을 불러올까요?') ? void load() : undefined} className="underline">서버 것 불러오기</button>
              <button onClick={() => window.confirm('다른 사람의 수정을 덮어쓸까요?') && void overwrite()} className="underline">내 것으로 덮어쓰기</button>
            </span>
          )}
          {status && !conflict && <span className={status.kind === 'ok' ? 'text-green-700' : 'text-red-700'}>{status.text}</span>}
          {status && <button onClick={() => setStatus(null)} className="ml-auto text-hint">닫기</button>}
        </div>
      )}

      <div className="flex-1 min-h-0 flex">
        {/* 왼쪽: 쪽·칸 목록·검사 */}
        <aside className="w-64 shrink-0 bg-white border-r border-gray-200 flex flex-col min-h-0">
          <div className="p-2 flex gap-1 flex-wrap border-b border-gray-100">
            {def.pages.map((_, i) => (
              <button key={i} onClick={() => setPage(i)} className={`h-7 px-2 rounded-md text-[12px] font-bold ${i === page ? 'bg-gray-900 text-white' : 'bg-gray-100'}`}>{i + 1}쪽</button>
            ))}
            {!def.pages.length && <span className="text-[12px] text-amber-700 font-semibold">오른쪽에서 쪽 이미지를 먼저 올리세요</span>}
          </div>
          <ol className="flex-1 overflow-auto text-[12px]">
            {pageFields.map(({ f, idx }) => {
              const sel = f.id === selectedId;
              const n = problemCount(f.id);
              return (
                <li key={f.id} className={`group flex items-center gap-1.5 px-2 py-1 border-b border-gray-50 cursor-pointer ${sel ? 'bg-brand-soft' : 'hover:bg-gray-50'} ${pageIndex(f) !== page ? 'opacity-50' : ''}`} onClick={() => reveal(f)}>
                  <span className={`w-6 h-6 shrink-0 rounded-full flex items-center justify-center text-[11px] font-black ${f.required ? 'bg-brand' : 'bg-gray-100'}`}>{idx + 1}</span>
                  <span className="flex-1 min-w-0">
                    <span className="block truncate font-semibold">{f.koLabel || f.label.ko || f.id}</span>
                    <span className="block text-[10px] text-hint">{KIND_NAMES[f.input.kind]} · {f.id}{def.pages.length > 1 ? ` · ${(f.page ?? 1)}쪽` : ''}</span>
                  </span>
                  {n > 0 && <span className="text-[10px] font-black text-white bg-red-500 rounded-full px-1.5" title="검사 문제">{n}</span>}
                  <span className="hidden group-hover:flex flex-col">
                    <button title="앞 번호로" onClick={(e) => { e.stopPropagation(); moveOrder(f.id, -1); }}><ArrowUp size={11} /></button>
                    <button title="뒤 번호로" onClick={(e) => { e.stopPropagation(); moveOrder(f.id, 1); }}><ArrowDown size={11} /></button>
                  </span>
                </li>
              );
            })}
          </ol>
          <div className="border-t border-gray-200 max-h-[40%] overflow-auto">
            {panel === 'versions' ? (
              <VersionsPanel id={id} dirty={dirty} onRestored={applyLoaded} onError={handle} />
            ) : (
              <ProblemsPanel problems={serverProblems ?? problems} fromServer={!!serverProblems} fields={def.fields} onPick={(fid) => { const f = def.fields.find((x) => x.id === fid); if (f) reveal(f); }} />
            )}
          </div>
        </aside>

        {/* 가운데: 서식 */}
        <div ref={canvasBox} className="flex-1 min-w-0 overflow-auto bg-gray-200 p-6">
          {def.pages[page] ? (
            <Canvas
              def={def}
              page={page}
              imageHref={imageUrl(def.pages[page].imageId)}
              zoom={zoom}
              selectedId={selectedId}
              target={target}
              tool={tool}
              preview={preview}
              onSelect={select}
              onField={setField}
              onCreateField={createField}
              onToolDone={() => setTool({ type: 'select' })}
            />
          ) : (
            <p className="text-sub">쪽 이미지가 없습니다.</p>
          )}
        </div>

        {/* 오른쪽: 속성 */}
        <aside className="w-[380px] shrink-0 bg-white border-l border-gray-200 overflow-auto p-4">
          {selected ? (
            <FieldPanel
              key={selected.id}
              def={def}
              field={selected}
              index={def.fields.indexOf(selected)}
              onChange={(u, c) => setField(selected.id, u, c)}
              onRename={(nid) => renameField(selected.id, nid)}
              onTool={setTool}
              onDuplicate={() => duplicateField(selected.id)}
              onDelete={() => deleteField(selected.id)}
              onClose={() => select(null)}
            />
          ) : (
            <FormPanel
              def={def}
              meta={{ key: doc.key, formNo: doc.formNo }}
              onMeta={(m) => hist.set((d) => (d ? { ...d, ...m } : d), 'meta')}
              onDef={setDef}
              onShowPage={setPage}
            />
          )}
        </aside>
      </div>

      {userPreview && def.pages.length > 0 && (
        <UserPreview doc={doc} lang={userPreview} onLang={setUserPreview} onClose={() => setUserPreview(null)} />
      )}
      {importOpen && (
        <ImportFields
          selfId={id}
          currentPage={page}
          def={def}
          onImport={(fields, sections) => {
            setDef((d) => {
              const at = d.fields.reduce((last, x, i) => (pageIndex(x) <= page ? i + 1 : last), 0);
              return { ...d, sections: [...d.sections, ...sections], fields: [...d.fields.slice(0, at), ...fields, ...d.fields.slice(at)] };
            });
            setImportOpen(false);
            setStatus({ kind: 'ok', text: `칸 ${fields.length}개를 가져왔습니다. 좌표는 원래 서식 기준이니 끌어서 맞추세요.` });
          }}
          onClose={() => setImportOpen(false)}
          onError={handle}
        />
      )}
    </div>
  );
}

function ProblemsPanel({ problems, fromServer, fields, onPick }: { problems: Problem[]; fromServer: boolean; fields: FieldDef[]; onPick: (fid: string) => void }) {
  const idx = (fid?: string) => (fid ? fields.findIndex((f) => f.id === fid) + 1 : 0);
  return (
    <div className="p-2 text-[12px]">
      <h3 className="font-bold flex items-center gap-1 mb-1"><ListChecks size={14} /> {fromServer ? '서버 검사' : '검사'} {problems.length ? <span className="text-red-600">{problems.length}건</span> : <span className="text-green-700">이상 없음</span>}</h3>
      <ul className="space-y-0.5">
        {problems.slice(0, 200).map((p, i) => (
          <li key={i}>
            <button className="text-left hover:underline" onClick={() => p.fieldId && onPick(p.fieldId)}>
              {p.fieldId ? <strong>{idx(p.fieldId) || '?'}번 </strong> : null}{p.message}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function VersionsPanel({ id, dirty, onRestored, onError }: { id: string; dirty: boolean; onRestored: (f: AdminForm) => void; onError: (e: unknown) => void }) {
  const [versions, setVersions] = useState<FormVersion[] | null>(null);
  useEffect(() => { adminApi.versions(id).then(setVersions, onError); }, [id, onError]);
  const restore = async (v: number) => {
    if (!window.confirm(`v${v}을 초안으로 가져올까요?${dirty ? ' 저장하지 않은 수정은 사라집니다.' : ''} (게시는 따로 해야 이용자에게 보입니다)`)) return;
    try {
      onRestored(await adminApi.restore(id, v));
    } catch (e) {
      onError(e);
    }
  };
  return (
    <div className="p-2 text-[12px]">
      <h3 className="font-bold flex items-center gap-1 mb-1"><History size={14} /> 게시 이력</h3>
      {!versions ? <p className="text-hint">불러오는 중…</p> : !versions.length ? <p className="text-hint">아직 게시하지 않았습니다.</p> : (
        <ul className="space-y-1">
          {versions.map((v) => (
            <li key={v.version} className="flex items-center gap-2">
              <strong>v{v.version}</strong>
              <span className="text-hint flex-1 truncate">{new Date(v.publishedAt).toLocaleString('ko-KR', { dateStyle: 'short', timeStyle: 'short' })} · {v.publishedBy}</span>
              <button className="underline" onClick={() => void restore(v.version)}>초안으로</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/** 지금 초안을 이용자 화면 그대로 열어 입력해 본다 (이용 기록은 보내지 않음) */
function UserPreview({ doc, lang, onLang, onClose }: { doc: Doc; lang: Lang; onLang: (l: Lang) => void; onClose: () => void }) {
  const form = useMemo(() => toFormDef(doc.key, doc.def, imageUrl), [doc]);
  const entry = { key: `preview-${doc.key}`, formNo: doc.formNo, title: doc.def.title, ...(doc.def.preset && { preset: doc.def.preset }) };
  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center gap-4 p-4">
      <div className="flex flex-col gap-2 text-white text-[13px]">
        <strong>이용자 화면 미리보기</strong>
        <span className="text-white/70">저장 전 초안 그대로입니다.<br />이용 기록은 보내지 않습니다.</span>
        <select className="admin-input-sm text-gray-900" value={lang} onChange={(e) => onLang(e.target.value as Lang)}>
          <option value="ko">한국어</option><option value="en">English</option><option value="zh">中文</option><option value="ja">日本語</option><option value="vi">Tiếng Việt</option>
        </select>
        <button onClick={onClose} className="h-9 rounded-lg bg-white text-gray-900 font-bold">닫기</button>
      </div>
      {/* transform이 있어 안의 fixed(바텀시트 등)가 이 틀 기준으로 붙는다 */}
      <div className="w-[400px] h-[min(860px,calc(100vh-2rem))] bg-white rounded-2xl overflow-hidden admin-phone">
        <FormFillView key={lang} entry={entry} form={form} lang={lang} onBack={onClose} onLanding={onClose} onMap={onClose} preview />
      </div>
    </div>
  );
}

function ImportFields({ selfId, currentPage, def, onImport, onClose, onError }: {
  selfId: string;
  currentPage: number;
  def: FormDefinition;
  onImport: (fields: FieldDef[], sections: FormDefinition['sections']) => void;
  onClose: () => void;
  onError: (e: unknown) => void;
}) {
  const [forms, setForms] = useState<{ id: string; title: string; formNo: number }[] | null>(null);
  const [source, setSource] = useState<AdminForm | null>(null);
  const [picked, setPicked] = useState<Set<string>>(new Set());
  useEffect(() => {
    adminApi.list().then((l) => setForms(l.filter((f) => f.id !== selfId).map((f) => ({ id: f.id, title: f.title.ko || f.key, formNo: f.formNo }))), onError);
  }, [selfId, onError]);

  const doImport = () => {
    if (!source) return;
    const taken = new Set(def.fields.map((f) => f.id));
    const sectionIds = new Set(def.sections.map((s) => s.id));
    const sections = source.draft.sections.filter((s) => !sectionIds.has(s.id) && source.draft.fields.some((f) => picked.has(f.id) && f.section === s.id));
    const fields = source.draft.fields.filter((f) => picked.has(f.id)).map((f) => {
      const id = uniqueId(f.id, taken);
      taken.add(id);
      const out: FieldDef = { ...structuredClone(f), id };
      delete out.copyFrom;
      if (currentPage > 0) out.page = currentPage + 1; else delete out.page;
      return out;
    });
    onImport(fields, sections);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center" onClick={onClose}>
      <div className="bg-white rounded-2xl p-5 w-full max-w-lg max-h-[80vh] flex flex-col gap-3 shadow-card-lg" onClick={(e) => e.stopPropagation()}>
        <h2 className="font-black text-lg">다른 서식에서 칸 가져오기</h2>
        <p className="text-[12px] text-sub">안내 문구·입력 종류를 그대로 가져옵니다. 좌표는 원래 서식 기준이라 가져온 뒤 끌어서 맞추세요. 지금 보는 쪽({currentPage + 1}쪽)에 들어갑니다.</p>
        <select className="admin-input-sm" value={source?.id ?? ''} onChange={(e) => { setPicked(new Set()); adminApi.get(e.target.value).then(setSource, onError); }}>
          <option value="">서식 고르기</option>
          {forms?.map((f) => <option key={f.id} value={f.id}>{f.formNo}. {f.title}</option>)}
        </select>
        {source && (
          <ul className="flex-1 overflow-auto text-[12px] border border-gray-100 rounded-lg">
            {source.draft.fields.map((f, i) => (
              <li key={f.id} className="px-2 py-1 border-b border-gray-50">
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={picked.has(f.id)} onChange={(e) => { const s = new Set(picked); if (e.target.checked) s.add(f.id); else s.delete(f.id); setPicked(s); }} />
                  <span className="text-hint w-6">{i + 1}</span>
                  <span className="truncate">{f.koLabel || f.id}</span>
                  <span className="ml-auto text-hint">{KIND_NAMES[f.input.kind]}</span>
                </label>
              </li>
            ))}
          </ul>
        )}
        <div className="flex gap-2 justify-end">
          <button onClick={onClose} className="h-9 px-4 rounded-lg bg-gray-100 font-bold text-[13px]">취소</button>
          <button onClick={doImport} disabled={!picked.size} className="h-9 px-4 rounded-lg bg-brand text-brand-950 font-black text-[13px] disabled:opacity-40">{picked.size}개 가져오기</button>
        </div>
      </div>
    </div>
  );
}
