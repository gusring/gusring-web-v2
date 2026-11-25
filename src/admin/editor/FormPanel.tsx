import { useRef, useState } from 'react';
import { ArrowDown, ArrowUp, ImagePlus, Plus, RefreshCw, Trash2 } from 'lucide-react';
import { categories } from '../../forms/categories';
import { CATEGORY_KEYS, CategoryKey, DefinitionPage, FieldDef, FormDefinition } from '../../forms/types';
import { adminApi, errorText } from '../api';
import { emptyL, uniqueId } from './geometry';
import { JsonEditor, LEditor, Num, Row } from './inputs';

/** 칸의 쪽 번호 바꾸기 (1쪽이면 page를 뺀다) */
const withPage = (f: FieldDef, page: number): FieldDef => {
  const { page: _old, ...rest } = f;
  void _old;
  return page > 1 ? { ...rest, page } : rest;
};

// 칸을 고르지 않았을 때 — 서식 전체 정보(주소 이름·번호·제목·설명·분류·섹션·쪽 이미지)

interface Props {
  def: FormDefinition;
  meta: { key: string; formNo: number };
  onMeta: (m: { key: string; formNo: number }) => void;
  onDef: (update: (d: FormDefinition) => FormDefinition, coalesce?: string) => void;
  /** 쪽 이미지를 바꿨을 때 그 쪽을 보여 준다 */
  onShowPage: (page: number) => void;
}

export default function FormPanel({ def, meta, onMeta, onDef, onShowPage }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  /** 올린 이미지를 넣을 자리 (쪽 번호, 없으면 새 쪽) */
  const uploadTo = useRef<number | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const setPages = (pages: DefinitionPage[]) => onDef((d) => ({ ...d, pages }));

  const pickImage = (pageIndex: number | null) => {
    uploadTo.current = pageIndex;
    fileRef.current?.click();
  };

  const onFile = async (file: File | undefined) => {
    if (!file) return;
    if (file.type !== 'image/png') return setError('PNG 파일만 올릴 수 있습니다.');
    setUploading(true);
    setError('');
    try {
      const img = await adminApi.uploadImage(file);
      const page: DefinitionPage = { imageId: img.id, width: img.width, height: img.height };
      const at = uploadTo.current;
      if (at === null) {
        setPages([...def.pages, page]);
        onShowPage(def.pages.length);
      } else {
        const old = def.pages[at];
        if (old && (old.width !== img.width || old.height !== img.height) &&
          !window.confirm(`새 이미지 크기(${img.width}×${img.height})가 지금(${old.width}×${old.height})과 다릅니다. 칸 좌표가 어긋날 수 있습니다. 바꿀까요?`)) return;
        setPages(def.pages.map((p, i) => (i === at ? { ...page, ...(p.marginX !== undefined && { marginX: p.marginX }) } : p)));
        onShowPage(at);
      }
    } catch (e) {
      setError(errorText(e));
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const movePage = (i: number, d: number) => {
    const j = i + d;
    if (j < 0 || j >= def.pages.length) return;
    // 칸의 쪽 번호도 같이 바꾼다
    onDef((x) => {
      const pages = [...x.pages];
      [pages[i], pages[j]] = [pages[j], pages[i]];
      const swap = (p: number) => (p === i + 1 ? j + 1 : p === j + 1 ? i + 1 : p);
      const fields = x.fields.map((f) => withPage(f, swap(f.page ?? 1)));
      // 번호 순서는 쪽 순서를 따른다
      fields.sort((a, b) => (a.page ?? 1) - (b.page ?? 1));
      return { ...x, pages, fields };
    });
  };

  const removePage = (i: number) => {
    const n = def.fields.filter((f) => (f.page ?? 1) === i + 1).length;
    if (!window.confirm(`${i + 1}쪽을 지울까요?${n ? ` 이 쪽의 칸 ${n}개도 같이 지워집니다.` : ''}`)) return;
    onDef((x) => ({
      ...x,
      pages: x.pages.filter((_, j) => j !== i),
      fields: x.fields
        .filter((f) => (f.page ?? 1) !== i + 1)
        .map((f) => ((f.page ?? 1) <= i + 1 ? f : withPage(f, (f.page ?? 1) - 1))),
    }));
    onShowPage(0);
  };

  return (
    <div className="space-y-4">
      <h2 className="font-black text-[15px]">서식 정보</h2>
      <p className="text-[12px] text-sub">서식 위의 칸을 누르면 그 칸을 고칠 수 있어요. 「새 칸」을 누르고 서식 위를 끌면 칸이 생겨요.</p>

      <section className="grid grid-cols-2 gap-2">
        <Row label="주소 이름 (이용자 주소 #/form/…)" hint="바꾸면 이용자의 저장된 입력값·통계가 이어지지 않음">
          <input className="admin-input-sm font-mono" value={meta.key} onChange={(e) => onMeta({ ...meta, key: e.target.value.trim() })} />
        </Row>
        <Row label="서식 번호 (v1)">
          <Num value={meta.formNo} min={1} onChange={(v) => v !== undefined && onMeta({ ...meta, formNo: v })} />
        </Row>
        <Row label="분류">
          <select className="admin-input-sm" value={def.category} onChange={(e) => onDef((d) => ({ ...d, category: e.target.value as CategoryKey }))}>
            {CATEGORY_KEYS.map((k) => <option key={k} value={k}>{categories[k].ko}</option>)}
          </select>
        </Row>
      </section>

      <LEditor label="제목" value={def.title} onChange={(v) => onDef((d) => ({ ...d, title: v }), 'title')} />
      <LEditor label="설명 (문서 선택 화면)" value={def.desc} onChange={(v) => onDef((d) => ({ ...d, desc: v }), 'desc')} multiline />

      <section className="space-y-2 border-t border-gray-100 pt-3">
        <h3 className="font-bold text-[13px]">쪽 (원본 서식 PNG)</h3>
        {def.pages.map((p, i) => (
          <div key={i} className="rounded-lg border border-gray-200 p-2 space-y-1.5">
            <div className="flex items-center gap-1.5 text-[12px]">
              <button type="button" className="font-bold hover:underline" onClick={() => onShowPage(i)}>{i + 1}쪽</button>
              <span className="text-hint tabular-nums">{p.width}×{p.height}</span>
              <span className="ml-auto flex gap-1">
                <button type="button" title="앞으로" className="admin-icon-btn" onClick={() => movePage(i, -1)} disabled={i === 0}><ArrowUp size={13} /></button>
                <button type="button" title="뒤로" className="admin-icon-btn" onClick={() => movePage(i, 1)} disabled={i === def.pages.length - 1}><ArrowDown size={13} /></button>
                <button type="button" title="이미지 바꾸기" className="admin-icon-btn" onClick={() => pickImage(i)}><RefreshCw size={13} /></button>
                <button type="button" title="쪽 지우기" className="admin-icon-btn text-red-600" onClick={() => removePage(i)}><Trash2 size={13} /></button>
              </span>
            </div>
            <Row label="여백 번호 x (번호 위치 「표 오른쪽 여백」, 비우면 오른쪽 끝에서 118px)">
              <Num value={p.marginX} onChange={(v) => setPages(def.pages.map((x, j) => {
                if (j !== i) return x;
                const out = { ...x };
                if (v === undefined) delete out.marginX; else out.marginX = v;
                return out;
              }))} />
            </Row>
          </div>
        ))}
        <button type="button" disabled={uploading} onClick={() => pickImage(null)} className="h-8 px-3 rounded-lg bg-gray-900 text-white text-[12px] font-bold inline-flex items-center gap-1.5 disabled:opacity-50">
          <ImagePlus size={14} /> {uploading ? '올리는 중…' : '쪽 더하기 (PNG 올리기)'}
        </button>
        <input ref={fileRef} type="file" accept="image/png" className="hidden" onChange={(e) => void onFile(e.target.files?.[0])} />
        {error && <p role="alert" className="text-[12px] font-semibold text-red-600">{error}</p>}
      </section>

      <section className="space-y-2 border-t border-gray-100 pt-3">
        <h3 className="font-bold text-[13px]">섹션 (칸 묶음 — 이용자 화면 「전체 항목」의 제목)</h3>
        {def.sections.map((s, i) => (
          <div key={i} className="rounded-lg border border-gray-200 p-2 space-y-1.5">
            <div className="flex gap-1.5 items-center">
              <input
                className="admin-input-sm font-mono !w-32"
                defaultValue={s.id}
                key={s.id}
                onBlur={(e) => {
                  const id = e.target.value.trim();
                  if (!id || id === s.id) return;
                  if (def.sections.some((x) => x.id === id)) return window.alert('이미 있는 섹션 id입니다.');
                  onDef((d) => ({
                    ...d,
                    sections: d.sections.map((x, j) => (j === i ? { ...x, id } : x)),
                    fields: d.fields.map((f) => (f.section === s.id ? { ...f, section: id } : f)),
                  }));
                }}
              />
              <span className="text-[11px] text-hint">칸 {def.fields.filter((f) => f.section === s.id).length}개</span>
              <button
                type="button"
                className="admin-icon-btn text-red-600 ml-auto"
                disabled={def.sections.length === 1}
                onClick={() => {
                  if (def.fields.some((f) => f.section === s.id)) return window.alert('이 섹션을 쓰는 칸이 있어 지울 수 없습니다.');
                  onDef((d) => ({ ...d, sections: d.sections.filter((_, j) => j !== i) }));
                }}
              >
                <Trash2 size={13} />
              </button>
            </div>
            <LEditor label="" value={s.label} onChange={(l) => onDef((d) => ({ ...d, sections: d.sections.map((x, j) => (j === i ? { ...x, label: l } : x)) }), `sec-${s.id}`)} />
          </div>
        ))}
        <button
          type="button"
          className="h-7 px-2 rounded-md bg-gray-100 text-[11px] font-bold inline-flex items-center gap-1"
          onClick={() => onDef((d) => ({ ...d, sections: [...d.sections, { id: uniqueId('section', new Set(d.sections.map((s) => s.id))), label: emptyL() }] }))}
        >
          <Plus size={12} /> 섹션 더하기
        </button>
      </section>

      <section className="border-t border-gray-100 pt-3">
        <JsonEditor
          label="고급: 처음 열 때 미리 골라 둘 값 (preset, JSON)"
          value={def.preset ?? {}}
          onApply={(v) => {
            if (!v || typeof v !== 'object' || Array.isArray(v)) return '객체여야 합니다. 예: {"reportType": {"choice": "change"}}';
            onDef((d) => {
              const out = { ...d };
              if (Object.keys(v).length) out.preset = v;
              else delete out.preset;
              return out;
            });
            return null;
          }}
        />
      </section>
    </div>
  );
}
