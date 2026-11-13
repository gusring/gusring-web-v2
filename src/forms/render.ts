import { findCountry, KOREA, OTHER_COUNTRY } from './countries';
import { Box, FieldDef, FieldValue, Mark, Part } from './types';

// ─────────────────────────────────────────────────────────────
// 입력값 → 서식 위 표시(Mark) 변환
// 화면(SVG)과 출력(Canvas)이 같은 Mark를 그리므로 결과가 일치한다.
// ─────────────────────────────────────────────────────────────

export const FORM_FONT = '"Pretendard Variable", Pretendard, "Apple SD Gothic Neo", "Noto Sans KR", sans-serif';
export const FORM_FONT_WEIGHT = 600;
export const INK = '#1d3c9c';

/** ○·✓ 크기는 1190px 폭 서식 기준 — 좁은 쪽(841px 등)에서는 그만큼 줄인다 */
export const markScale = (pageWidth: number) => Math.min(1, pageWidth / 1190);

const BASE_SIZE = 19;
const MIN_SIZE = 8;

let measureCtx: CanvasRenderingContext2D | null = null;
const measure = (text: string, size: number) => {
  if (!measureCtx) measureCtx = document.createElement('canvas').getContext('2d');
  if (!measureCtx) return text.length * size;
  measureCtx.font = `${FORM_FONT_WEIGHT} ${size}px ${FORM_FONT}`;
  return measureCtx.measureText(text).width;
};

/** 칸 너비에 맞게 글자 크기를 줄인다 */
export const fitSize = (text: string, box: Box) => {
  let size = Math.min(BASE_SIZE, box.h * 0.68);
  while (size > MIN_SIZE && measure(text, size) > box.w - 4) size -= 0.5;
  return size;
};

/** 여러 줄 글자의 i번째 줄 세로 가운데 */
export const lineY = (box: Box, size: number, count: number, i: number) =>
  box.y + box.h / 2 + (i - (count - 1) / 2) * size * 1.2;

/** 한 줄로 이보다 작아지면 두 줄로 나눠 본다 (두 줄이 더 클 때만) */
const WRAP_BELOW = 16;

/** 가운데에 가까운 띄어쓰기에서 둘로 나눈다 (띄어쓰기가 없으면 나누지 않음) */
const splitTwo = (v: string): string[] | null => {
  const mid = v.length / 2;
  let best = -1;
  for (let i = 0; i < v.length; i++) if (v[i] === ' ' && (best < 0 || Math.abs(i - mid) < Math.abs(best - mid))) best = i;
  if (best > 0) return [v.slice(0, best).trim(), v.slice(best + 1).trim()];
  // 띄어쓰기가 없는 이메일은 @ 앞에서 나눈다
  const at = v.indexOf('@');
  return at > 0 ? [v.slice(0, at), v.slice(at)] : null;
};

const text = (box: Box, value: string | undefined): Mark[] => {
  const v = value?.trim();
  if (!v) return [];
  const size = fitSize(v, box);
  const lines = size < WRAP_BELOW && box.h >= 30 ? splitTwo(v) : null;
  if (lines) {
    let two = Math.min(BASE_SIZE, box.h * 0.42);
    while (two > MIN_SIZE && Math.max(...lines.map((l) => measure(l, two))) > box.w - 4) two -= 0.5;
    if (two > size) return [{ kind: 'text', box, text: v, size: two, lines }];
  }
  return [{ kind: 'text', box, text: v, size }];
};

const splitDate = (date?: string) => {
  const [y, m, d] = (date ?? '').split('-');
  return { y, m: m && String(Number(m)), d: d && String(Number(d)) };
};

/** 고른 선택지들 (여러 개 고르기면 쉼표로 이어 저장) */
export const chosen = (choice?: string) => (choice ? choice.split(',').filter(Boolean) : []);

export const extraVisible = (extra: Part & { when?: string[] }, choice?: string) =>
  !extra.when || chosen(choice).some((c) => extra.when!.includes(c));

export function marksFor(field: FieldDef, value: FieldValue | undefined): Mark[] {
  if (!value) return [];
  const input = field.input;
  switch (input.kind) {
    case 'text':
      return input.parts.flatMap((p) => text(p.box, value[p.key]));
    case 'date': {
      const { y, m, d } = splitDate(value.date);
      if (input.box) return y ? text(input.box, `${y}년 ${m}월 ${d}일`) : [];
      return [...text(input.boxes.y, y), ...text(input.boxes.m, m), ...text(input.boxes.d, d)];
    }
    case 'datetime': {
      const { y, m, d } = splitDate(value.date);
      const [h, min] = (value.time ?? '').split(':');
      return [
        ...text(input.boxes.y, y), ...text(input.boxes.m, m), ...text(input.boxes.d, d),
        ...text(input.boxes.h, h), ...text(input.boxes.min, min),
      ];
    }
    case 'choice': {
      const picked = chosen(value.choice);
      const marks: Mark[] = input.options.filter((o) => picked.includes(o.value)).map((o) => ({ kind: input.mark, at: o.mark }));
      if (input.extra && extraVisible(input.extra, value.choice)) marks.push(...text(input.extra.box, value[input.extra.key]));
      return marks;
    }
    case 'country':
      return text(input.box, countryKo(value));
    case 'idnum':
      if (input.box) return text(input.box, [value.front, value.back].filter((v) => v?.trim()).join('-'));
      return [...text(input.front, value.front), ...text(input.back, value.back)];
  }
}

const countryKo = (value: FieldValue) => {
  if (value.country === KOREA || value.country === OTHER_COUNTRY) return value.text;
  return findCountry(value.country)?.ko;
};

export function isFilled(field: FieldDef, value: FieldValue | undefined): boolean {
  if (!value) return false;
  const has = (k: string) => !!value[k]?.trim();
  const input = field.input;
  switch (input.kind) {
    case 'text':
      return input.parts.some((p) => has(p.key));
    case 'date':
      return has('date');
    case 'datetime':
      return has('date') && has('time');
    case 'choice':
      return has('choice') && (!input.extra?.when || !extraVisible(input.extra, value.choice) || has(input.extra.key));
    case 'country':
      return has('country') && !!countryKo(value)?.trim();
    case 'idnum':
      return has('front');
  }
}

/** 목록에 보여줄 한국어 요약 (서식에 실제로 들어가는 내용) */
export function summaryKo(field: FieldDef, value: FieldValue | undefined): string {
  if (!value || !isFilled(field, value)) return '';
  const input = field.input;
  switch (input.kind) {
    case 'text':
      return input.parts.map((p) => value[p.key]?.trim()).filter(Boolean).join(' · ');
    case 'date': {
      const { y, m, d } = splitDate(value.date);
      return `${y}년 ${m}월 ${d}일`;
    }
    case 'datetime': {
      const { y, m, d } = splitDate(value.date);
      const [h, min] = value.time.split(':');
      return `${y}년 ${m}월 ${d}일 ${h}시 ${min}분`;
    }
    case 'choice': {
      const picked = chosen(value.choice);
      const kos = input.options.filter((o) => picked.includes(o.value)).map((o) => o.ko);
      const extra = input.extra && extraVisible(input.extra, value.choice) ? value[input.extra.key]?.trim() : '';
      return [...kos, extra].filter(Boolean).join(' · ');
    }
    case 'country':
      return countryKo(value) ?? '';
    case 'idnum':
      // 목록에서는 뒷자리를 가린다
      return `${value.front}-${'*'.repeat(value.back?.length ?? 0)}`;
  }
}

const HANGUL_ONLY = /^[\s가-힣ㄱ-ㅎㅏ-ㅣ]*$/;
const HAS_HANGUL = /[가-힣]/;
const HAS_LETTER = /\p{L}/u;

export type PartWarning = 'hangul' | 'korean';

export function partWarning(part: Part, v: string | undefined): PartWarning | null {
  const s = v?.trim();
  if (!s) return null;
  if (part.hangul && !HANGUL_ONLY.test(s)) return 'hangul';
  if (part.korean && HAS_LETTER.test(s) && !HAS_HANGUL.test(s)) return 'korean';
  return null;
}
