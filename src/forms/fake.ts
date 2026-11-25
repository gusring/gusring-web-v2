// 가짜 입력값 — 관리 화면 미리보기(글자 크기·줄바꿈 확인)와 개발 확인(dev-check)에서 쓴다.
// 칸마다 가장 긴 쪽의 값을 넣어, 실제로 넘칠 수 있는지 보이게 한다.

import { FieldDef, FieldValue, FormDef, Part, Values } from './types';

const LONG_ADDRESS = '서울특별시 금천구 시흥대로73길 70 금천구청 별관 101동 1203호';

function partValue(p: Part): string {
  if (p.options) return p.options[p.options.length - 1].value;
  if (p.inputMode === 'tel') return '010-9876-5432';
  if (p.inputMode === 'numeric' && p.placeholder && /^\d+$/.test(p.placeholder)) return '12';
  if (p.inputMode === 'numeric' && p.placeholder && /^[\d-]+$/.test(p.placeholder)) return p.placeholder;
  if (p.inputMode === 'email') return 'nguyen.thi.thuy.trang@example.com';
  if (p.key === 'surname') return p.hangul ? '응우옌' : '阮';
  if (p.key === 'given') return p.hangul ? '티투이짱' : '氏垂莊';
  if (p.key === 'hanja') return '阮氏垂莊';
  if (p.key === 'bon') return '金海';
  if (p.hangul) return '응우옌티투이짱';
  if (p.key === 'address') return LONG_ADDRESS;
  // 짧은 칸은 안내 예시(placeholder) 중 가장 긴 값
  if (p.placeholder?.startsWith('예)')) return p.placeholder.replace('예)', '').split(',').map((x) => x.trim()).sort((a, b) => b.length - a.length)[0];
  if (p.korean) return LONG_ADDRESS;
  return '서울가정법원 가사합의부';
}

export function fakeValue(f: FieldDef): FieldValue {
  const i = f.input;
  switch (i.kind) {
    case 'text':
      return Object.fromEntries(i.parts.map((p) => [p.key, partValue(p)]));
    case 'date':
      return { date: '2025-12-31' };
    case 'datetime':
      return { date: '2025-12-31', time: '23:59' };
    case 'choice': {
      const o = i.options[i.options.length - 1];
      const v: FieldValue = { choice: i.multiple ? i.options.map((x) => x.value).join(',') : o.value };
      if (i.extra) v[i.extra.key] = i.extra.options ? i.extra.options[0].value : i.extra.inputMode === 'numeric' ? '12' : '보호시설장 겸 관리자';
      return v;
    }
    case 'country':
      return i.allowKorea === true ? { country: 'KR', text: '서울특별시 금천구 독산로93길 7' } : { country: 'UZ' };
    case 'idnum':
      return { front: '901231', back: '5123456' };
  }
}

export const fakeValues = (form: Pick<FormDef, 'fields'>): Values => Object.fromEntries(form.fields.map((f) => [f.id, fakeValue(f)]));
