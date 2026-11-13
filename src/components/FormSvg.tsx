import { FORM_FONT, FORM_FONT_WEIGHT, INK, lineY, marksFor } from '../forms/render';
import { Box, FieldDef, FieldValue, FormDef, FormPage, Mark, pageIndex, Point, Values } from '../forms/types';

// ─────────────────────────────────────────────────────────────
// 한국어 원본 서식 이미지 + 입력값(Mark) + 번호 토글(가이드)
// 여러 쪽 서식은 한 번에 한 쪽만 그린다 (page = 0부터).
// ─────────────────────────────────────────────────────────────

const BADGE_R = 16;

/** 칸이 있는 쪽 */
export const pageOf = (form: FormDef, field: FieldDef): FormPage => form.pages[pageIndex(field)] ?? form.pages[0];

/** 칸 안에 번호를 넣으면 선택지와 겹치는 항목은 표 오른쪽 여백에 표시 */
const marginX = (page: FormPage) => page.marginX ?? page.width - 118;

export function badgePoint(field: FieldDef, page: FormPage): Point {
  const a = field.area;
  const cy = a.h > 50 ? a.y + BADGE_R + 2 : a.y + a.h / 2;
  if (field.badge === 'margin') return { x: marginX(page), y: a.y + a.h / 2 };
  return { x: a.x + BADGE_R + 2, y: cy };
}

/** 선택형 칸은 선택지(와 보이는 추가 입력칸)까지만 잘라 더 크게 보여준다 */
function contentArea(field: FieldDef, value?: FieldValue): Box {
  const input = field.input;
  if (input.kind !== 'choice') return field.area;
  const xs = input.options.map((o) => o.mark.x);
  const x0 = Math.min(...xs) - 24;
  // 마지막 선택지 번호 뒤의 글자(예: 「기타(자격:」)까지 보이도록 여유를 둔다
  let x1 = Math.min(field.area.x + field.area.w, Math.max(...xs) + 110);
  const extra = input.extra;
  if (extra && (!extra.when || (value?.choice && extra.when.includes(value.choice)))) x1 = Math.max(x1, extra.box.x + extra.box.w);
  return { ...field.area, x: x0, w: x1 - x0 };
}

/** 칸을 확대해 보여줄 영역: 칸 + (좁은 칸이면) 왼쪽의 한국어 라벨 */
export function fieldCrop(field: FieldDef, form: FormDef, value?: FieldValue): Box {
  const { width } = pageOf(form, field);
  const a = contentArea(field, value);
  const left = a.w < 420 ? 120 : 16;
  const right = field.badge === 'margin' ? 0 : 16;
  let x = Math.max(0, a.x - left);
  let w = Math.min(width, a.x + a.w + right) - x;
  const h = a.h + 20;
  // 세로로 긴 칸은 너무 크게 확대되지 않도록 가로 폭을 넓힌다
  if (w < h * 3) {
    const grow = h * 3 - w;
    x = Math.max(0, Math.min(width - h * 3, x - grow / 2));
    w = h * 3;
  }
  return { x, y: a.y - 10, w, h };
}

export function MarkView({ mark }: { mark: Mark }) {
  switch (mark.kind) {
    case 'text': {
      const { box } = mark;
      const align = box.align ?? 'left';
      const x = align === 'left' ? box.x : align === 'center' ? box.x + box.w / 2 : box.x + box.w;
      const lines = mark.lines ?? [mark.text];
      return (
        <>
          {lines.map((line, i) => (
            <text
              key={i}
              x={x}
              y={lineY(box, mark.size, lines.length, i)}
              fontSize={mark.size}
              fontFamily={FORM_FONT}
              fontWeight={FORM_FONT_WEIGHT}
              fill={INK}
              dominantBaseline="central"
              textAnchor={align === 'left' ? 'start' : align === 'center' ? 'middle' : 'end'}
            >
              {line}
            </text>
          ))}
        </>
      );
    }
    case 'circle':
      return <circle cx={mark.at.x} cy={mark.at.y} r={15} fill="none" stroke={INK} strokeWidth={2.8} />;
    case 'check':
      return (
        <path
          d={`M${mark.at.x - 8} ${mark.at.y} L${mark.at.x - 2} ${mark.at.y + 7} L${mark.at.x + 10} ${mark.at.y - 10}`}
          fill="none"
          stroke={INK}
          strokeWidth={3.2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      );
  }
}

interface Guides {
  activeId: string | null;
  filled: Set<string>;
  onSelect: (id: string) => void;
}

interface Props {
  form: FormDef;
  /** 그릴 쪽 (0부터) */
  page?: number;
  values: Values;
  guides?: Guides;
  /** 번호를 숨긴 상태에서도 작성 중인 칸은 강조한다 */
  highlightId?: string | null;
  className?: string;
}

export default function FormSvg({ form, page = 0, values, guides, highlightId, className }: Props) {
  const pg = form.pages[page] ?? form.pages[0];
  /** 번호는 서식 전체에서 이어지므로 원래 순서(idx)를 같이 들고 다닌다 */
  const fields = form.fields.map((f, idx) => ({ f, idx })).filter(({ f }) => pageIndex(f) === page);
  return (
    <svg
      viewBox={`0 0 ${pg.width} ${pg.height}`}
      className={className}
      role="img"
      aria-label={form.pages.length > 1 ? `${form.title.ko} ${page + 1}/${form.pages.length}` : form.title.ko}
    >
      <image href={pg.image} x={0} y={0} width={pg.width} height={pg.height} />

      {/* 영역 하이라이트 */}
      {guides &&
        fields.map(({ f }) => {
          const active = guides.activeId === f.id;
          const filled = guides.filled.has(f.id);
          const fill = active
            ? 'rgba(254,219,2,0.32)'
            : filled
              ? 'rgba(22,163,74,0.06)'
              : f.required
                ? 'rgba(254,219,2,0.22)'
                : 'rgba(148,163,184,0.14)';
          return (
            <rect
              key={`area-${f.id}`}
              x={f.area.x + 1}
              y={f.area.y + 1}
              width={f.area.w - 2}
              height={f.area.h - 2}
              fill={fill}
              stroke={active ? '#d4b500' : 'none'}
              strokeWidth={active ? 4 : 0}
              rx={4}
              style={{ cursor: 'pointer' }}
              onClick={() => guides.onSelect(f.id)}
            />
          );
        })}

      {highlightId && (() => {
        const f = fields.find(({ f: x }) => x.id === highlightId)?.f;
        return f ? (
          <rect x={f.area.x} y={f.area.y} width={f.area.w} height={f.area.h} fill="rgba(254,219,2,0.18)" stroke="#d4b500" strokeWidth={3} rx={4} />
        ) : null;
      })()}

      {/* 입력값 */}
      <g pointerEvents="none">
        {fields.flatMap(({ f }) => marksFor(f, values[f.id]).map((m, i) => <MarkView key={`${f.id}-${i}`} mark={m} />))}
      </g>

      {/* 번호 토글 */}
      {guides &&
        fields.map(({ f, idx }) => {
          const p = badgePoint(f, pg);
          const active = guides.activeId === f.id;
          const filled = guides.filled.has(f.id);
          const bg = active ? '#111827' : filled ? '#16a34a' : f.required ? '#fedb02' : '#ffffff';
          const fg = active ? '#fedb02' : filled ? '#ffffff' : '#2e2800';
          return (
            <g
              key={`badge-${f.id}`}
              onClick={() => guides.onSelect(f.id)}
              style={{ cursor: 'pointer' }}
              role="button"
              aria-label={`${idx + 1}`}
            >
              <circle cx={p.x} cy={p.y} r={BADGE_R + (active ? 3 : 0)} fill={bg} stroke={filled || active ? 'none' : '#a08800'} strokeWidth={1.5} />
              <text
                x={p.x}
                y={p.y + 0.5}
                fontSize={idx + 1 >= 10 ? 15 : 17}
                fontWeight={800}
                fontFamily={FORM_FONT}
                fill={fg}
                textAnchor="middle"
                dominantBaseline="central"
              >
                {idx + 1}
              </text>
            </g>
          );
        })}
    </svg>
  );
}
