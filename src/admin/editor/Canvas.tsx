import { PointerEvent, useRef, useState } from 'react';
import { badgePoint, MarkView } from '../../components/FormSvg';
import { fakeValue } from '../../forms/fake';
import { markScale, marksFor } from '../../forms/render';
import { Box, FieldDef, FormDefinition, FormPage, pageIndex, Point } from '../../forms/types';
import { boxFrom, marksOf, moveTarget, round, roundPt, sameTarget, setMark, setSlot, slotsOf, Target } from './geometry';

// ─────────────────────────────────────────────────────────────
// 원본 서식 이미지 위에서 칸을 드래그로 지정하는 곳
// - 칸 영역(빨강)·값 상자(파랑)·○✓ 위치(초록)·번호(노랑)를 끌어 옮기고, 모서리로 크기를 바꾼다
// - 도구가 켜져 있으면 끌어서 새 칸·상자를 그리거나, 눌러서 ○✓ 위치를 찍는다
// ─────────────────────────────────────────────────────────────

export type Tool =
  | { type: 'select' }
  /** template: 칸 틀 key (templates.ts, 없으면 빈 글자 칸) */
  | { type: 'newField'; template?: string }
  | { type: 'drawSlot'; fieldId: string; slot: string }
  | { type: 'placeMark'; fieldId: string; option: string };

type Corner = 'nw' | 'ne' | 'sw' | 'se';

interface Drag {
  mode: 'move' | 'resize' | 'band';
  start: Point;
  key: string;
  fieldId?: string;
  target?: Target;
  corner?: Corner;
  orig?: FieldDef;
}

interface Props {
  def: FormDefinition;
  /** 보고 있는 쪽 (0부터) */
  page: number;
  imageHref: string;
  zoom: number;
  selectedId: string | null;
  target: Target | null;
  tool: Tool;
  /** 가짜 값으로 실제 글자 크기 미리보기 */
  preview: boolean;
  onSelect: (fieldId: string | null, target?: Target) => void;
  onField: (id: string, update: (f: FieldDef) => FieldDef, coalesce?: string) => void;
  onCreateField: (area: Box) => void;
  onToolDone: () => void;
}

const RED = '#dc2626';
const BLUE = '#2563eb';
const GREEN = '#16a34a';

let dragSeq = 0;

export default function Canvas({ def, page, imageHref, zoom, selectedId, target, tool, preview, onSelect, onField, onCreateField, onToolDone }: Props) {
  const pg = def.pages[page];
  const svgRef = useRef<SVGSVGElement>(null);
  const drag = useRef<Drag | null>(null);
  const [band, setBand] = useState<Box | null>(null);

  if (!pg) return null;
  const formPage: FormPage = { image: imageHref, width: pg.width, height: pg.height, marginX: pg.marginX };
  const fields = def.fields.map((f, idx) => ({ f, idx })).filter(({ f }) => pageIndex(f) === page);
  const selected = fields.find(({ f }) => f.id === selectedId)?.f ?? null;
  const ms = markScale(pg.width);
  /** 화면에서 일정한 크기로 보이도록 (이미지 픽셀 → 화면 픽셀) */
  const px = (n: number) => n / zoom;

  const toPt = (e: PointerEvent): Point => {
    const svg = svgRef.current!;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const p = pt.matrixTransform(svg.getScreenCTM()!.inverse());
    return { x: Math.max(0, Math.min(pg.width, p.x)), y: Math.max(0, Math.min(pg.height, p.y)) };
  };

  const begin = (e: PointerEvent, d: Omit<Drag, 'start' | 'key'>) => {
    e.stopPropagation();
    svgRef.current?.setPointerCapture(e.pointerId);
    drag.current = { ...d, start: toPt(e), key: `drag${++dragSeq}` };
  };

  // 도구가 켜져 있을 때는 칸·상자 위를 눌러도 그리기·찍기가 된다 (그래서 그때는 각 요소가 이벤트를 넘긴다)
  const selecting = tool.type === 'select';

  const onBackgroundDown = (e: PointerEvent) => {
    if (e.button !== 0) return;
    const p = toPt(e);
    if (tool.type === 'placeMark') {
      onField(tool.fieldId, (f) => ({ ...f, input: setMark(f.input, tool.option, roundPt(p)) }));
      onSelect(tool.fieldId, { kind: 'mark', option: tool.option });
      onToolDone();
      return;
    }
    if (tool.type === 'newField' || tool.type === 'drawSlot') {
      svgRef.current?.setPointerCapture(e.pointerId);
      drag.current = { mode: 'band', start: p, key: `band${++dragSeq}` };
      setBand({ x: p.x, y: p.y, w: 0, h: 0 });
      return;
    }
    onSelect(null);
  };

  const onMove = (e: PointerEvent) => {
    const d = drag.current;
    if (!d) return;
    const p = toPt(e);
    if (d.mode === 'band') {
      setBand(boxFrom(d.start, p));
      return;
    }
    const dx = Math.round(p.x - d.start.x);
    const dy = Math.round(p.y - d.start.y);
    if (!d.orig || !d.fieldId || !d.target) return;
    const orig = d.orig;
    if (d.mode === 'move') {
      onField(d.fieldId, () => moveTarget(orig, d.target!, dx, dy, badgePoint(orig, formPage)), d.key);
      return;
    }
    // 모서리 끌기 — 반대쪽 모서리는 그대로
    const r = rectOf(orig, d.target);
    if (!r) return;
    let x1 = r.x, y1 = r.y, x2 = r.x + r.w, y2 = r.y + r.h;
    if (d.corner!.includes('w')) x1 += dx; else x2 += dx;
    if (d.corner!.includes('n')) y1 += dy; else y2 += dy;
    const next = round({ x: Math.min(x1, x2), y: Math.min(y1, y2), w: Math.max(4, Math.abs(x2 - x1)), h: Math.max(4, Math.abs(y2 - y1)) });
    onField(d.fieldId, () => withRect(orig, d.target!, next), d.key);
  };

  const onUp = () => {
    const d = drag.current;
    drag.current = null;
    if (d?.mode !== 'band') return;
    const b = band;
    setBand(null);
    if (!b || b.w < 6 || b.h < 6) return;
    if (tool.type === 'newField') onCreateField(b);
    if (tool.type === 'drawSlot') {
      onField(tool.fieldId, (f) => (tool.slot === 'area' ? { ...f, area: b } : { ...f, input: setSlot(f.input, tool.slot, b) }));
      onSelect(tool.fieldId, tool.slot === 'area' ? { kind: 'area' } : { kind: 'slot', slot: tool.slot });
    }
    onToolDone();
  };

  const handles = (f: FieldDef, t: Target) => {
    const r = rectOf(f, t);
    if (!r) return null;
    const corners: [Corner, number, number][] = [['nw', r.x, r.y], ['ne', r.x + r.w, r.y], ['sw', r.x, r.y + r.h], ['se', r.x + r.w, r.y + r.h]];
    return corners.map(([c, x, y]) => (
      <rect
        key={c}
        x={x - px(5)}
        y={y - px(5)}
        width={px(10)}
        height={px(10)}
        fill="#fff"
        stroke="#111827"
        strokeWidth={px(1.5)}
        className={c === 'nw' || c === 'se' ? 'cursor-nwse-resize' : 'cursor-nesw-resize'}
        onPointerDown={(e) => selecting && begin(e, { mode: 'resize', fieldId: f.id, target: t, corner: c, orig: f })}
      />
    ));
  };

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${pg.width} ${pg.height}`}
      width={pg.width * zoom}
      height={pg.height * zoom}
      className={`block select-none touch-none bg-white shadow ${selecting ? '' : 'cursor-crosshair'}`}
      onPointerDown={onBackgroundDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerCancel={onUp}
    >
      <image href={imageHref} x={0} y={0} width={pg.width} height={pg.height} />

      {/* 가짜 값으로 그린 모습 */}
      {preview && (
        <g pointerEvents="none">
          {fields.flatMap(({ f }) => marksFor(f, fakeValue(f)).map((m, i) => <MarkView key={`${f.id}-pv-${i}`} mark={m} scale={ms} />))}
        </g>
      )}

      {/* 칸 영역 */}
      {fields.map(({ f }) => {
        const sel = f.id === selectedId;
        return (
          <rect
            key={`area-${f.id}`}
            x={f.area.x}
            y={f.area.y}
            width={f.area.w}
            height={f.area.h}
            fill={sel ? 'rgba(220,38,38,0.06)' : 'rgba(220,38,38,0.02)'}
            stroke={RED}
            strokeOpacity={sel ? 1 : 0.55}
            strokeWidth={px(sel ? 2 : 1)}
            className={selecting ? 'cursor-move' : ''}
            onPointerDown={(e) => {
              if (!selecting || e.button !== 0) return;
              onSelect(f.id, { kind: 'area' });
              begin(e, { mode: 'move', fieldId: f.id, target: { kind: 'area' }, orig: f });
            }}
          />
        );
      })}

      {/* 번호 */}
      {fields.map(({ f, idx }) => {
        const p = badgePoint(f, formPage);
        const sel = f.id === selectedId;
        return (
          <g
            key={`badge-${f.id}`}
            className={selecting && sel ? 'cursor-move' : selecting ? 'cursor-pointer' : ''}
            onPointerDown={(e) => {
              if (!selecting || e.button !== 0) return;
              onSelect(f.id, { kind: 'badge' });
              if (sel) begin(e, { mode: 'move', fieldId: f.id, target: { kind: 'badge' }, orig: f });
              else e.stopPropagation();
            }}
          >
            <circle cx={p.x} cy={p.y} r={16} fill={sel ? '#fedb02' : 'rgba(254,219,2,0.85)'} stroke={sel && target?.kind === 'badge' ? '#111827' : '#a08800'} strokeWidth={px(sel ? 2 : 1)} />
            <text x={p.x} y={p.y + 0.5} fontSize={idx + 1 >= 10 ? 14 : 16} fontWeight={800} textAnchor="middle" dominantBaseline="central" pointerEvents="none">
              {idx + 1}
            </text>
          </g>
        );
      })}

      {/* 고른 칸의 값 상자·○✓ 위치 */}
      {selected && (
        <g>
          {slotsOf(selected.input).map((s) => {
            const t: Target = { kind: 'slot', slot: s.id };
            const on = sameTarget(target, t);
            return (
              <g key={`slot-${s.id}`}>
                <rect
                  x={s.box.x}
                  y={s.box.y}
                  width={s.box.w}
                  height={s.box.h}
                  fill={on ? 'rgba(37,99,235,0.14)' : 'rgba(37,99,235,0.06)'}
                  stroke={BLUE}
                  strokeWidth={px(on ? 2 : 1.2)}
                  className={selecting ? 'cursor-move' : ''}
                  onPointerDown={(e) => {
                    if (!selecting || e.button !== 0) return;
                    onSelect(selected.id, t);
                    begin(e, { mode: 'move', fieldId: selected.id, target: t, orig: selected });
                  }}
                />
                <text x={s.box.x + px(2)} y={s.box.y - px(3)} fontSize={px(11)} fill={BLUE} fontWeight={700} pointerEvents="none">
                  {s.label}
                </text>
              </g>
            );
          })}
          {marksOf(selected.input).map((o) => {
            const t: Target = { kind: 'mark', option: o.value };
            const on = sameTarget(target, t);
            return (
              <g
                key={`mark-${o.value}`}
                className={selecting ? 'cursor-move' : ''}
                onPointerDown={(e) => {
                  if (!selecting || e.button !== 0) return;
                  onSelect(selected.id, t);
                  begin(e, { mode: 'move', fieldId: selected.id, target: t, orig: selected });
                }}
              >
                <circle cx={o.mark.x} cy={o.mark.y} r={15 * ms} fill={on ? 'rgba(22,163,74,0.18)' : 'rgba(22,163,74,0.06)'} stroke={GREEN} strokeWidth={px(on ? 2.5 : 1.5)} />
                <text x={o.mark.x} y={o.mark.y - 15 * ms - px(3)} fontSize={px(11)} fill={GREEN} fontWeight={700} textAnchor="middle" pointerEvents="none">
                  {o.ko || o.value}
                </text>
              </g>
            );
          })}
          {target && (target.kind === 'area' || target.kind === 'slot') && handles(selected, target)}
        </g>
      )}

      {band && <rect x={band.x} y={band.y} width={band.w} height={band.h} fill="rgba(37,99,235,0.08)" stroke={BLUE} strokeDasharray={`${px(6)} ${px(4)}`} strokeWidth={px(1.5)} pointerEvents="none" />}
    </svg>
  );
}

/** 고른 조각의 상자 (영역 또는 값 상자) */
function rectOf(f: FieldDef, t: Target): Box | null {
  if (t.kind === 'area') return f.area;
  if (t.kind === 'slot') return slotsOf(f.input).find((s) => s.id === t.slot)?.box ?? null;
  return null;
}

function withRect(f: FieldDef, t: Target, r: Box): FieldDef {
  if (t.kind === 'area') return { ...f, area: r };
  if (t.kind === 'slot') return { ...f, input: setSlot(f.input, t.slot, r) };
  return f;
}
