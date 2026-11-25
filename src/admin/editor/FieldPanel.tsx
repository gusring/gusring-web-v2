import { Copy, Crosshair, Plus, SquareDashedMousePointer, Trash2, X } from 'lucide-react';
import { Align, ChoiceOption, FieldDef, FormDefinition, InputSpec, Part } from '../../forms/types';
import { Tool } from './Canvas';
import { defaultInput, INPUT_KINDS, InputKind, inner, sameL, setSlot, slotsOf, uniqueId } from './geometry';
import { Check, JsonEditor, LEditor, Row, Text } from './inputs';

// 고른 칸의 속성 — 좌표는 서식 위에서 끌어 바꾸고, 여기서는 이름·안내·입력 종류를 정한다

interface Props {
  def: FormDefinition;
  field: FieldDef;
  index: number;
  onChange: (update: (f: FieldDef) => FieldDef, coalesce?: string) => void;
  onRename: (newId: string) => void;
  onTool: (tool: Tool) => void;
  /** 칸 id·좌표·내부 key·번호 위치·JSON까지 보이기 */
  advanced: boolean;
  onDuplicate: () => void;
  onDelete: () => void;
  onClose: () => void;
}

const DrawBtn = ({ onClick, label = '다시 그리기' }: { onClick: () => void; label?: string }) => (
  <button type="button" onClick={onClick} className="h-7 px-2 rounded-md bg-blue-50 text-blue-700 text-[11px] font-bold inline-flex items-center gap-1 shrink-0">
    <SquareDashedMousePointer size={12} /> {label}
  </button>
);

export default function FieldPanel({ def, field: f, index, onChange, onRename, onTool, advanced, onDuplicate, onDelete, onClose }: Props) {
  const input = f.input;
  const setInput = (next: InputSpec) => onChange((x) => ({ ...x, input: next }));
  const set = <K extends keyof FieldDef>(k: K, v: FieldDef[K] | undefined, coalesce?: string) =>
    onChange((x) => {
      const out = { ...x, [k]: v };
      if (v === undefined || v === false) delete out[k];
      return out;
    }, coalesce);

  const changeKind = (kind: InputKind) => {
    if (kind === input.kind) return;
    if (!window.confirm('입력 종류를 바꾸면 값 상자·선택지를 새로 만듭니다. 바꿀까요?')) return;
    setInput(defaultInput(kind, f.area));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <span className="w-7 h-7 rounded-full bg-brand flex items-center justify-center text-[12px] font-black">{index + 1}</span>
        <h2 className="font-black text-[15px] truncate">{f.koLabel || f.id}</h2>
        <button onClick={onDuplicate} title="칸 복제" className="admin-icon-btn ml-auto"><Copy size={14} /></button>
        <button onClick={onDelete} title="칸 지우기 (Delete)" className="admin-icon-btn text-red-600"><Trash2 size={14} /></button>
        <button onClick={onClose} title="닫기 (Esc)" className="admin-icon-btn"><X size={14} /></button>
      </div>

      <section className="space-y-2">
        {advanced && (
          <Row label="칸 id (영문, 이용 기록에 쓰임 — 게시 후에는 되도록 바꾸지 않기)">
            <IdInput value={f.id} onCommit={onRename} />
          </Row>
        )}
        <Row label="한국어 칸 이름 (원본 서식에 인쇄된 그대로)">
          <Text value={f.koLabel} onChange={(v) => set('koLabel', v, `ko-${f.id}`)} />
        </Row>
        <div className="grid grid-cols-3 gap-2">
          <Row label="섹션">
            <select className="admin-input-sm" value={f.section} onChange={(e) => set('section', e.target.value)}>
              {!def.sections.some((s) => s.id === f.section) && <option value={f.section}>{f.section} (없음)</option>}
              {def.sections.map((s) => <option key={s.id} value={s.id}>{s.label.ko || s.id}</option>)}
            </select>
          </Row>
          <Row label="쪽">
            <select className="admin-input-sm" value={f.page ?? 1} onChange={(e) => set('page', Number(e.target.value) > 1 ? Number(e.target.value) : undefined)}>
              {def.pages.map((_, i) => <option key={i} value={i + 1}>{i + 1}쪽</option>)}
            </select>
          </Row>
          <div className="pt-4"><Check checked={!!f.required} onChange={(v) => set('required', v || undefined)} label="필수" /></div>
        </div>
      </section>

      <section className="space-y-2 border-t border-gray-100 pt-3">
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-[13px]">칸 영역</h3>
          {advanced && <span className="text-[11px] text-hint tabular-nums">{f.area.x}, {f.area.y} · {f.area.w}×{f.area.h}</span>}
          <span className="ml-auto"><DrawBtn onClick={() => onTool({ type: 'drawSlot', fieldId: f.id, slot: 'area' })} /></span>
        </div>
        <Row label="입력 종류">
          <select className="admin-input-sm" value={input.kind} onChange={(e) => changeKind(e.target.value as InputKind)}>
            {INPUT_KINDS.map((k) => <option key={k.kind} value={k.kind}>{k.label}</option>)}
          </select>
        </Row>
        <KindOptions field={f} setInput={setInput} onTool={onTool} advanced={advanced} />
        <SlotList field={f} setInput={setInput} onTool={onTool} advanced={advanced} />
        {advanced && <Row label="번호 위치">
          <select
            className="admin-input-sm"
            value={f.badgeAt ? 'custom' : f.badge === 'margin' ? 'margin' : 'auto'}
            onChange={(e) => onChange((x) => {
              const out = { ...x };
              delete out.badgeAt;
              delete out.badge;
              if (e.target.value === 'margin') out.badge = 'margin';
              if (e.target.value === 'custom') out.badgeAt = { x: x.area.x + x.area.w - 20, y: x.area.y + 18 };
              return out;
            })}
          >
            <option value="auto">자동 (칸 왼쪽 위)</option>
            <option value="margin">표 오른쪽 여백</option>
            <option value="custom">직접 (서식 위 번호를 끌어 옮기기)</option>
          </select>
        </Row>}
      </section>

      <section className="space-y-3 border-t border-gray-100 pt-3">
        <LEditor label="라벨 (이용자 화면의 칸 이름)" value={f.label} onChange={(v) => set('label', v, `label-${f.id}`)} />
        <LEditor label="안내 (칸의 뜻·작성법)" value={f.help} onChange={(v) => set('help', v, `help-${f.id}`)} multiline />
      </section>

      {advanced && <section className="border-t border-gray-100 pt-3">
        <JsonEditor
          label="고급: 이 칸을 JSON으로 고치기 (가져오기 버튼 copyFrom·선택 입력칸 options 등)"
          value={f}
          onApply={(v) => {
            if (!v || typeof v !== 'object' || typeof v.id !== 'string' || !v.area || !v.input) return 'id·area·input이 있어야 합니다.';
            onChange(() => v);
            return null;
          }}
        />
      </section>}
    </div>
  );
}

/** id는 입력을 마칠 때 바꾼다 (중간 글자로 다른 칸과 겹치지 않게) */
function IdInput({ value, onCommit }: { value: string; onCommit: (v: string) => void }) {
  return (
    <input
      key={value}
      className="admin-input-sm font-mono"
      defaultValue={value}
      onBlur={(e) => e.target.value.trim() && e.target.value.trim() !== value && onCommit(e.target.value.trim())}
      onKeyDown={(e) => e.key === 'Enter' && (e.target as HTMLInputElement).blur()}
    />
  );
}

/** 값 상자 목록 — 상자마다 다시 그리기·정렬 */
function SlotList({ field: f, setInput, onTool, advanced }: { field: FieldDef; setInput: (i: InputSpec) => void; onTool: (t: Tool) => void; advanced: boolean }) {
  const slots = slotsOf(f.input);
  if (!slots.length) return null;
  const setAlign = (id: string, align: Align) => {
    const s = slots.find((x) => x.id === id)!;
    setInput(setSlot(f.input, id, { ...s.box, align }));
  };
  return (
    <div className="space-y-1">
      <span className="block text-[11px] font-bold text-sub">값 상자 (파랑 — 끌어 옮기기, 모서리로 크기)</span>
      {slots.map((s) => (
        <div key={s.id} className="flex items-center gap-1.5 text-[12px]">
          <span className="w-16 truncate font-semibold">{s.label}</span>
          <span className="text-[11px] text-hint tabular-nums flex-1">{advanced ? `${s.box.w}×${s.box.h}` : ''}</span>
          <select className="admin-input-sm !w-20" value={s.box.align ?? 'left'} onChange={(e) => setAlign(s.id, e.target.value as Align)}>
            <option value="left">왼쪽</option>
            <option value="center">가운데</option>
            <option value="right">오른쪽</option>
          </select>
          <DrawBtn onClick={() => onTool({ type: 'drawSlot', fieldId: f.id, slot: s.id })} />
        </div>
      ))}
    </div>
  );
}

/** 입력 종류별 설정 */
function KindOptions({ field: f, setInput, onTool, advanced }: { field: FieldDef; setInput: (i: InputSpec) => void; onTool: (t: Tool) => void; advanced: boolean }) {
  const input = f.input;
  switch (input.kind) {
    case 'text':
      return <PartsEditor field={f} parts={input.parts} onParts={(parts) => setInput({ ...input, parts })} advanced={advanced} />;
    case 'date':
      return (
        <Row label="날짜 칸 모양">
          <select
            className="admin-input-sm"
            value={input.box ? 'single' : 'split'}
            onChange={(e) => {
              if (e.target.value === 'single') setInput({ kind: 'date', box: inner(f.area) });
              else setInput(defaultInput('date', f.area));
            }}
          >
            <option value="split">「년 월 일」이 인쇄됨 — 숫자만 세 곳에</option>
            <option value="single">빈 칸 — 「1990년 1월 1일」 한 줄로</option>
          </select>
        </Row>
      );
    case 'idnum':
      return (
        <Row label="번호 칸 모양">
          <select
            className="admin-input-sm"
            value={input.box ? 'single' : 'split'}
            onChange={(e) => {
              if (e.target.value === 'single') setInput({ kind: 'idnum', box: inner(f.area) });
              else setInput(defaultInput('idnum', f.area));
            }}
          >
            <option value="split">가운데 「-」이 인쇄됨 — 앞·뒤 두 곳에</option>
            <option value="single">「-」 없음 — 한 줄로</option>
          </select>
        </Row>
      );
    case 'country':
      return (
        <Row label="한국을 고를 수 있나">
          <select
            className="admin-input-sm"
            value={input.allowKorea === 'name' ? 'name' : input.allowKorea ? 'address' : 'no'}
            onChange={(e) => {
              const { allowKorea: _drop, ...rest } = input;
              void _drop;
              setInput(e.target.value === 'no' ? rest : { ...rest, allowKorea: e.target.value === 'name' ? 'name' : true });
            }}
          >
            <option value="no">아니요 (외국만)</option>
            <option value="address">예 — 등록기준지 칸 (한국이면 주소를 받음)</option>
            <option value="name">예 — 국적 칸 (한국이면 「대한민국」)</option>
          </select>
        </Row>
      );
    case 'choice':
      return <ChoiceEditor field={f} input={input} setInput={setInput} onTool={onTool} advanced={advanced} />;
    default:
      return null;
  }
}

const INPUT_MODES = [['', '글자'], ['numeric', '숫자'], ['tel', '전화'], ['email', '이메일']] as const;

function PartFlags({ part, onPart }: { part: Part; onPart: (p: Part) => void }) {
  const toggle = (k: 'hangul' | 'korean', v: boolean) => {
    const out = { ...part };
    if (v) out[k] = true;
    else delete out[k];
    onPart(out);
  };
  return (
    <div className="flex flex-wrap gap-x-3 gap-y-1 items-center">
      <Check checked={!!part.hangul} onChange={(v) => toggle('hangul', v)} label="한글만 (이름)" />
      <Check checked={!!part.korean} onChange={(v) => toggle('korean', v)} label="한국어로 (주소)" />
      <select
        className="admin-input-sm !w-24"
        value={part.inputMode ?? ''}
        onChange={(e) => {
          const out = { ...part };
          if (e.target.value) out.inputMode = e.target.value as Part['inputMode'];
          else delete out.inputMode;
          onPart(out);
        }}
      >
        {INPUT_MODES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
      </select>
    </div>
  );
}

function PartsEditor({ field: f, parts, onParts, advanced }: { field: FieldDef; parts: Part[]; onParts: (p: Part[]) => void; advanced: boolean }) {
  const setPart = (i: number, p: Part) => onParts(parts.map((x, j) => (j === i ? p : x)));
  return (
    <div className="space-y-2">
      <span className="block text-[11px] font-bold text-sub">입력칸 (여럿이면 이용자 화면에 나란히 — 예: 성 / 이름)</span>
      {parts.map((p, i) => (
        <div key={i} className="rounded-lg border border-gray-200 p-2 space-y-1.5">
          <div className="flex gap-1.5 items-center">
            {advanced ? (
              <input className="admin-input-sm font-mono !w-28" value={p.key} onChange={(e) => setPart(i, { ...p, key: e.target.value })} title="입력칸 key" />
            ) : parts.length > 1 && (
              <span className="w-16 shrink-0 text-[12px] font-semibold truncate">{p.label?.ko || `${i + 1}번째`}</span>
            )}
            <input className="admin-input-sm" value={p.placeholder ?? ''} placeholder="예시 (placeholder)" onChange={(e) => setPart(i, { ...p, placeholder: e.target.value || undefined })} />
            {parts.length > 1 && (
              <button type="button" className="admin-icon-btn text-red-600" title="입력칸 지우기" onClick={() => onParts(parts.filter((_, j) => j !== i))}><Trash2 size={13} /></button>
            )}
          </div>
          <PartFlags part={p} onPart={(np) => setPart(i, np)} />
          {parts.length > 1 && (
            <details>
              <summary className="text-[11px] font-bold text-sub cursor-pointer">입력칸 라벨 (5개 국어)</summary>
              <LEditor label="" value={p.label} onChange={(l) => setPart(i, { ...p, label: l })} />
            </details>
          )}
        </div>
      ))}
      <button
        type="button"
        className="h-7 px-2 rounded-md bg-gray-100 text-[11px] font-bold inline-flex items-center gap-1"
        onClick={() => {
          const key = uniqueId('value', new Set(parts.map((p) => p.key)));
          const last = parts[parts.length - 1]?.box ?? inner(f.area);
          onParts([...parts, { key, label: sameL(key), box: { ...last, y: last.y } }]);
        }}
      >
        <Plus size={12} /> 입력칸 더하기 (그다음 「다시 그리기」로 자리 지정)
      </button>
    </div>
  );
}

function ChoiceEditor({ field: f, input, setInput, onTool, advanced }: { field: FieldDef; input: Extract<InputSpec, { kind: 'choice' }>; setInput: (i: InputSpec) => void; onTool: (t: Tool) => void; advanced: boolean }) {
  const setOpt = (i: number, o: ChoiceOption) => setInput({ ...input, options: input.options.map((x, j) => (j === i ? o : x)) });
  const extra = input.extra;
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-3 items-center">
        <select className="admin-input-sm !w-36" value={input.mark} onChange={(e) => setInput({ ...input, mark: e.target.value as 'circle' | 'check' })}>
          <option value="circle">번호에 ○</option>
          <option value="check">□에 ✓</option>
        </select>
        <Check checked={!!input.multiple} onChange={(v) => { const out = { ...input }; if (v) out.multiple = true; else delete out.multiple; setInput(out); }} label="여러 개 고르기" />
      </div>
      <span className="block text-[11px] font-bold text-sub">선택지 (초록 동그라미 — 끌어 옮기기)</span>
      {input.options.map((o, i) => (
        <div key={i} className="rounded-lg border border-gray-200 p-2 space-y-1.5">
          <div className="flex gap-1.5 items-center">
            {advanced && <input className="admin-input-sm font-mono !w-24" value={o.value} title="value (저장 값, 영문)" onChange={(e) => setOpt(i, { ...o, value: e.target.value })} />}
            <input className="admin-input-sm" value={o.ko} placeholder="서식의 한국어" onChange={(e) => setOpt(i, { ...o, ko: e.target.value })} />
            <button type="button" title="서식 위를 눌러 표시 위치 찍기" className="h-7 px-2 rounded-md bg-green-50 text-green-700 text-[11px] font-bold inline-flex items-center gap-1 shrink-0" onClick={() => onTool({ type: 'placeMark', fieldId: f.id, option: o.value })}>
              <Crosshair size={12} /> 위치
            </button>
            {input.options.length > 1 && (
              <button type="button" className="admin-icon-btn text-red-600" onClick={() => setInput({ ...input, options: input.options.filter((_, j) => j !== i) })}><Trash2 size={13} /></button>
            )}
          </div>
          <details>
            <summary className="text-[11px] font-bold text-sub cursor-pointer">선택지 이름 (5개 국어){o.label && Object.values(o.label).some((s) => !s.trim()) ? ' · 빈 언어 있음' : ''}</summary>
            <LEditor label="" value={o.label} onChange={(l) => setOpt(i, { ...o, label: l })} />
          </details>
        </div>
      ))}
      <button
        type="button"
        className="h-7 px-2 rounded-md bg-gray-100 text-[11px] font-bold inline-flex items-center gap-1"
        onClick={() => {
          const value = uniqueId('opt', new Set(input.options.map((o) => o.value)));
          const last = input.options[input.options.length - 1]?.mark ?? { x: f.area.x + 40, y: f.area.y + f.area.h / 2 };
          setInput({ ...input, options: [...input.options, { value, ko: '', label: sameL(''), mark: { x: last.x + 60, y: last.y } }] });
          onTool({ type: 'placeMark', fieldId: f.id, option: value });
        }}
      >
        <Plus size={12} /> 선택지 더하기 (그다음 서식 위를 눌러 위치 찍기)
      </button>

      <div className="rounded-lg bg-gray-50 p-2 space-y-1.5">
        <Check
          checked={!!extra}
          label="추가 입력칸 (예: 기타(  ) 칸)"
          onChange={(v) => {
            if (!v) { const { extra: _e, ...rest } = input; void _e; return setInput(rest); }
            setInput({ ...input, extra: { key: 'detail', box: inner(f.area), label: sameL('') } });
            onTool({ type: 'drawSlot', fieldId: f.id, slot: 'extra' });
          }}
        />
        {extra && (
          <>
            <div className="flex gap-1.5">
              {advanced && <input className="admin-input-sm font-mono !w-24" value={extra.key} onChange={(e) => setInput({ ...input, extra: { ...extra, key: e.target.value } })} />}
              <input className="admin-input-sm" value={extra.placeholder ?? ''} placeholder="예시 (placeholder)" onChange={(e) => setInput({ ...input, extra: { ...extra, placeholder: e.target.value || undefined } })} />
            </div>
            <div className="text-[11px] font-bold text-sub">보일 때 (아무것도 안 고르면 늘)</div>
            <div className="flex flex-wrap gap-x-3">
              {input.options.map((o) => (
                <Check
                  key={o.value}
                  label={o.ko || o.value}
                  checked={!!extra.when?.includes(o.value)}
                  onChange={(v) => {
                    const when = (extra.when ?? []).filter((w) => w !== o.value).concat(v ? [o.value] : []);
                    const { when: _old, ...rest } = extra;
                    void _old;
                    setInput({ ...input, extra: when.length ? { ...rest, when } : rest });
                  }}
                />
              ))}
            </div>
            <PartFlags part={extra} onPart={(p) => setInput({ ...input, extra: { ...extra, ...p } })} />
            <LEditor label="추가 입력칸 라벨" value={extra.label} onChange={(l) => setInput({ ...input, extra: { ...extra, label: l } })} />
          </>
        )}
      </div>
    </div>
  );
}

