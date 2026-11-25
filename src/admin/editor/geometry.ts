// 편집기에서 칸의 좌표 조각(영역·값 상자·○✓ 위치·번호)을 다루는 함수들
// 좌표는 모두 원본 이미지 픽셀.

import { Box, ChoiceOption, FieldDef, InputSpec, L, Point } from '../../forms/types';

export const emptyL = (): L => ({ ko: '', en: '', zh: '', ja: '', vi: '' });
export const sameL = (s: string): L => ({ ko: s, en: s, zh: s, ja: s, vi: s });

/** 편집기에서 고를 수 있는 조각 */
export type Target =
  | { kind: 'area' }
  | { kind: 'slot'; slot: string }
  | { kind: 'mark'; option: string }
  | { kind: 'badge' };

export const sameTarget = (a?: Target | null, b?: Target | null) =>
  !!a && !!b && a.kind === b.kind && (a.kind !== 'slot' || a.slot === (b as { slot: string }).slot) && (a.kind !== 'mark' || a.option === (b as { option: string }).option);

/** 값 상자 하나 (이름표 + 상자) */
export interface Slot {
  id: string;
  label: string;
  box: Box;
}

const DATE_NAMES: Record<string, string> = { y: '년', m: '월', d: '일', h: '시', min: '분' };

export function slotsOf(input: InputSpec): Slot[] {
  switch (input.kind) {
    case 'text':
      return input.parts.map((p) => ({ id: `part:${p.key}`, label: p.label?.ko || p.key, box: p.box }));
    case 'date':
      return input.box ? [{ id: 'box', label: '날짜', box: input.box }] : (['y', 'm', 'd'] as const).map((k) => ({ id: k, label: DATE_NAMES[k], box: input.boxes[k] }));
    case 'datetime':
      return (['y', 'm', 'd', 'h', 'min'] as const).map((k) => ({ id: k, label: DATE_NAMES[k], box: input.boxes[k] }));
    case 'choice':
      return input.extra ? [{ id: 'extra', label: '추가 입력', box: input.extra.box }] : [];
    case 'country':
      return [{ id: 'box', label: '국가', box: input.box }];
    case 'idnum':
      return input.box ? [{ id: 'box', label: '번호', box: input.box }] : [{ id: 'front', label: '앞자리', box: input.front }, { id: 'back', label: '뒷자리', box: input.back }];
  }
}

export function setSlot(input: InputSpec, id: string, box: Box): InputSpec {
  const keep = (old: Box) => ({ ...box, ...(old.align && { align: old.align }) });
  switch (input.kind) {
    case 'text':
      return { ...input, parts: input.parts.map((p) => (`part:${p.key}` === id ? { ...p, box: keep(p.box) } : p)) };
    case 'date':
      if (input.box) return id === 'box' ? { ...input, box: keep(input.box) } : input;
      return { ...input, boxes: { ...input.boxes, [id]: keep(input.boxes[id as 'y']) } };
    case 'datetime':
      return { ...input, boxes: { ...input.boxes, [id]: keep(input.boxes[id as 'y']) } };
    case 'choice':
      return input.extra && id === 'extra' ? { ...input, extra: { ...input.extra, box: keep(input.extra.box) } } : input;
    case 'country':
      return { ...input, box: keep(input.box) };
    case 'idnum':
      if (input.box) return { ...input, box: keep(input.box) };
      return id === 'front' ? { ...input, front: keep(input.front) } : { ...input, back: keep(input.back) };
  }
}

export const marksOf = (input: InputSpec): ChoiceOption[] => (input.kind === 'choice' ? input.options : []);

export function setMark(input: InputSpec, option: string, at: Point): InputSpec {
  if (input.kind !== 'choice') return input;
  return { ...input, options: input.options.map((o) => (o.value === option ? { ...o, mark: at } : o)) };
}

const moveBox = (b: Box, dx: number, dy: number): Box => ({ ...b, x: b.x + dx, y: b.y + dy });
const movePt = (p: Point, dx: number, dy: number): Point => ({ x: p.x + dx, y: p.y + dy });

/** 칸 전체(영역·값 상자·○✓·번호)를 같이 옮긴다 */
export function moveField(f: FieldDef, dx: number, dy: number): FieldDef {
  let input = f.input;
  for (const s of slotsOf(input)) input = setSlot(input, s.id, moveBox(s.box, dx, dy));
  for (const o of marksOf(input)) input = setMark(input, o.value, movePt(o.mark, dx, dy));
  return { ...f, area: moveBox(f.area, dx, dy), input, ...(f.badgeAt && { badgeAt: movePt(f.badgeAt, dx, dy) }) };
}

/** 고른 조각만 옮긴다 (영역이면 칸 전체) */
export function moveTarget(f: FieldDef, t: Target, dx: number, dy: number, badgeFallback: Point): FieldDef {
  switch (t.kind) {
    case 'area':
      return moveField(f, dx, dy);
    case 'slot': {
      const s = slotsOf(f.input).find((x) => x.id === t.slot);
      return s ? { ...f, input: setSlot(f.input, t.slot, moveBox(s.box, dx, dy)) } : f;
    }
    case 'mark': {
      const o = marksOf(f.input).find((x) => x.value === t.option);
      return o ? { ...f, input: setMark(f.input, t.option, movePt(o.mark, dx, dy)) } : f;
    }
    case 'badge':
      return { ...f, badgeAt: movePt(f.badgeAt ?? badgeFallback, dx, dy) };
  }
}

export const round = (b: Box): Box => ({ ...b, x: Math.round(b.x), y: Math.round(b.y), w: Math.round(b.w), h: Math.round(b.h) });
export const roundPt = (p: Point): Point => ({ x: Math.round(p.x), y: Math.round(p.y) });

/** 두 점으로 만든 상자 */
export const boxFrom = (a: Point, b: Point): Box => round({ x: Math.min(a.x, b.x), y: Math.min(a.y, b.y), w: Math.abs(a.x - b.x), h: Math.abs(a.y - b.y) });

/** 칸 안쪽 상자 — 왼쪽은 번호(지름 32px) 자리를 비운다 */
export const inner = (a: Box): Box => {
  const l = a.w > 80 ? 36 : 4;
  return round({ x: a.x + l, y: a.y + 3, w: Math.max(4, a.w - l - 6), h: Math.max(4, a.h - 6), align: 'center' });
};

/** 상자를 가로로 비율대로 나눈다 */
export const split = (b: Box, ratios: number[]): Box[] => {
  const total = ratios.reduce((s, r) => s + r, 0);
  let x = b.x;
  return ratios.map((r) => {
    const w = (b.w * r) / total;
    const out = round({ x, y: b.y, w: w - 2, h: b.h, align: 'center' });
    x += w;
    return out;
  });
};

export type InputKind = InputSpec['kind'];
export const INPUT_KINDS: { kind: InputKind; label: string }[] = [
  { kind: 'text', label: '글자' },
  { kind: 'date', label: '날짜' },
  { kind: 'datetime', label: '날짜·시각' },
  { kind: 'choice', label: '선택 (○·✓)' },
  { kind: 'country', label: '국가' },
  { kind: 'idnum', label: '주민·외국인등록번호' },
];

/** 입력 종류를 바꿀 때 칸 영역 안에 기본 상자를 만든다 */
export function defaultInput(kind: InputKind, area: Box): InputSpec {
  const box = inner(area);
  const midY = Math.round(area.y + area.h / 2);
  switch (kind) {
    case 'text':
      return { kind, parts: [{ key: 'value', box }] };
    case 'date': {
      const [y, m, d] = split(box, [4, 3, 3]);
      return { kind, boxes: { y, m, d } };
    }
    case 'datetime': {
      const [y, m, d, h, min] = split(box, [4, 3, 3, 3, 3]);
      return { kind, boxes: { y, m, d, h, min } };
    }
    case 'choice':
      return {
        kind,
        mark: 'circle',
        options: [
          { value: 'a', ko: '선택 1', label: sameL('선택 1'), mark: { x: Math.round(box.x + 20), y: midY } },
          { value: 'b', ko: '선택 2', label: sameL('선택 2'), mark: { x: Math.round(box.x + Math.min(box.w - 20, 140)), y: midY } },
        ],
      };
    case 'country':
      return { kind, box };
    case 'idnum': {
      const [front, back] = split(box, [6, 7]);
      return { kind, front, back };
    }
  }
}

/** body: 칸 틀이 만든 이름·안내·입력 (없으면 빈 글자 칸) */
export function newField(id: string, section: string, area: Box, page: number, body?: Pick<FieldDef, 'koLabel' | 'label' | 'help' | 'input'>): FieldDef {
  return {
    id,
    section,
    ...(body ?? { koLabel: '', label: emptyL(), help: emptyL(), input: defaultInput('text', area) }),
    area: round(area),
    ...(page > 1 && { page }),
  };
}

/** 겹치지 않는 새 id */
export function uniqueId(base: string, taken: Set<string>): string {
  if (!taken.has(base)) return base;
  for (let i = 2; ; i++) if (!taken.has(`${base}${i}`)) return `${base}${i}`;
}
