import { CategoryKey, L } from './types';

// 문서 선택 화면 분류 (gusring-web과 같음)
export const categories: Record<CategoryKey, L> = {
  FAMILY:    { ko: '가족관계',   en: 'Family',       zh: '家庭', ja: '家族', vi: 'Gia đình' },
  CERT:      { ko: '증명서',     en: 'Certificates', zh: '证明', ja: '証明', vi: 'Giấy chứng nhận' },
  RESIDENCE: { ko: '체류/주거',  en: 'Residence',    zh: '居住', ja: '居住', vi: 'Cư trú' },
  ID_SEAL:   { ko: '신분/인감',  en: 'ID/Seal',      zh: '身份', ja: '身分', vi: 'Căn cước/con dấu' },
  VEHICLE:   { ko: '차량/이륜차', en: 'Vehicle',     zh: '车辆', ja: '車両', vi: 'Xe cộ' },
};
