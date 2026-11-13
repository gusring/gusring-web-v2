import { birthReport } from './birth-report';
import { FormDef, L } from './types';

// 문서 선택 화면에 보이는 서식 목록. 카테고리·제목·설명은 gusring-web과 동일.

export type CategoryKey = 'FAMILY' | 'CERT' | 'RESIDENCE' | 'ID_SEAL' | 'VEHICLE';

export const categories: Record<CategoryKey, L> = {
  FAMILY:    { ko: '가족관계',   en: 'Family',       zh: '家庭', ja: '家族', vi: 'Gia đình' },
  CERT:      { ko: '증명서',     en: 'Certificates', zh: '证明', ja: '証明', vi: 'Giấy chứng nhận' },
  RESIDENCE: { ko: '체류/주거',  en: 'Residence',    zh: '居住', ja: '居住', vi: 'Cư trú' },
  ID_SEAL:   { ko: '신분/인감',  en: 'ID/Seal',      zh: '身份', ja: '身分', vi: 'Căn cước/con dấu' },
  VEHICLE:   { ko: '차량/이륜차', en: 'Vehicle',     zh: '车辆', ja: '車両', vi: 'Xe cộ' },
};

export interface CatalogItem {
  /** gusring-web(v1) 서식 번호 (forms.ts의 id). 이용 기록·의견에 같이 보내 v1 통계와 잇는다 */
  formNo: number;
  cat: CategoryKey;
  desc: L;
  form: FormDef;
  /**
   * 주소(#/form/:key)와 입력값 저장 이름. 없으면 form.id.
   * 서식 하나를 목록의 여러 항목이 같이 쓸 때 항목마다 다르게 둔다.
   */
  key?: string;
  /** 목록·작성 화면 제목. 없으면 form.title */
  title?: L;
}

export const entryKey = (item: CatalogItem) => item.key ?? item.form.id;
export const entryTitle = (item: CatalogItem) => item.title ?? item.form.title;

export const catalog: CatalogItem[] = [
  {
    formNo: 4,
    cat: 'FAMILY',
    desc: {
      ko: '자녀가 태어난 후 법적 등록을 위해 작성하는 신고서입니다.',
      en: 'A report to legally register a child after birth.',
      zh: '孩子出生后为了法律登记而填写的申报书。',
      ja: '子供が生まれた後、法的登録のために作成する届出書です。',
      vi: 'Đơn đăng ký hợp pháp cho trẻ sau khi sinh.',
    },
    form: birthReport,
  },
];

export const findEntry = (key: string) => catalog.find((c) => entryKey(c) === key);
