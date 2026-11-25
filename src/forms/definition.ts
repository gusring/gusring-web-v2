import type { FormDef, FormDefinition } from './types';

// 저장 형식(FormDefinition, 서버) ↔ 화면 형식(FormDef) 바꾸기

/** 서버 정의 → 화면에서 그리는 서식. key가 서식 id(이용 기록 formKey)가 된다 */
export function toFormDef(key: string, def: FormDefinition, imageUrl: (imageId: string) => string): FormDef {
  return {
    id: key,
    title: def.title,
    pages: def.pages.map((p) => ({ image: imageUrl(p.imageId), width: p.width, height: p.height, ...(p.marginX !== undefined && { marginX: p.marginX }) })),
    sections: def.sections,
    fields: def.fields,
  };
}

/** 빈 새 서식 (관리 화면 「새로 만들기」) */
export const emptyDefinition = (): FormDefinition => ({
  title: { ko: '', en: '', zh: '', ja: '', vi: '' },
  desc: { ko: '', en: '', zh: '', ja: '', vi: '' },
  category: 'FAMILY',
  pages: [],
  sections: [{ id: 'main', label: { ko: '기본', en: 'Main', zh: '基本', ja: '基本', vi: 'Cơ bản' } }],
  fields: [],
});
