import {
  addressField, birthDateField, bonField, dateField, EDU_HELP, eduOptions, hanjaSplitField, idField, nameField,
  nameSplitField, opt, originField, otherNotesField, phoneField, reportDateField, submitterIdField, submitterNameField,
  Who,
} from './common';
import { Box, ChoiceOption, FieldDef, FormDef, L } from './types';

// ─────────────────────────────────────────────────────────────
// 혼인신고서 [양식 제10호] — v1 서식 10번
// 좌표는 public/forms/marriage-report_ko.png (1190×1682) 기준.
// 안내 문구는 뒷면 「작성 방법」(v1 guides_ko_10)을 바탕으로 작성.
// 작성 방법: ①·②·⑤·⑦란은 신고인 모두가 기재 → 그 칸들을 필수로 둔다.
// ─────────────────────────────────────────────────────────────

const HUSBAND: Who = { ko: '남편', en: 'the husband', zh: '丈夫', ja: '夫', vi: 'chồng' };
const WIFE: Who = { ko: '아내', en: 'the wife', zh: '妻子', ja: '妻', vi: 'vợ' };
const HF: Who = { ko: '남편의 아버지', en: "the husband's father", zh: '丈夫的父亲', ja: '夫の父', vi: 'bố của chồng' };
const HM: Who = { ko: '남편의 어머니', en: "the husband's mother", zh: '丈夫的母亲', ja: '夫の母', vi: 'mẹ của chồng' };
const WF: Who = { ko: '아내의 아버지', en: "the wife's father", zh: '妻子的父亲', ja: '妻の父', vi: 'bố của vợ' };
const WM: Who = { ko: '아내의 어머니', en: "the wife's mother", zh: '妻子的母亲', ja: '妻の母', vi: 'mẹ của vợ' };
const WITNESS1: Who = { ko: '증인 1', en: 'witness 1', zh: '证人1', ja: '証人1', vi: 'người làm chứng 1' };
const WITNESS2: Who = { ko: '증인 2', en: 'witness 2', zh: '证人2', ja: '証人2', vi: 'người làm chứng 2' };
const GUARDIAN1: Who = { ko: '동의하는 후견인 1', en: 'consenting guardian 1', zh: '表示同意的监护人1', ja: '同意する後見人1', vi: 'người giám hộ đồng ý 1' };
const GUARDIAN2: Who = { ko: '동의하는 후견인 2', en: 'consenting guardian 2', zh: '表示同意的监护人2', ja: '同意する後見人2', vi: 'người giám hộ đồng ý 2' };

const ADDRESS_HELP = (who: Who): L => ({
  ko: `${who.ko}의 주소를 한국어로 적어요. 주민등록 전입신고는 이 신고와 따로 해야 해요.`,
  en: `Address of ${who.en}, in Korean. Note: the move-in report for resident registration must be filed separately from this report.`,
  zh: `用韩文填写${who.zh}的地址。居民登记迁入申报须与本申报另行办理。`,
  ja: `${who.ja}の住所を韓国語で書きます。住民登録の転入届はこの届出とは別に行う必要があります。`,
  vi: `Địa chỉ của ${who.vi}, ghi bằng tiếng Hàn. Lưu ý: khai báo chuyển đến (đăng ký cư trú) phải làm riêng với tờ khai này.`,
});

const PARENT_HELP = (who: Who): L => ({
  ko: `${who.ko} 이름을 한글로 적어요. 혼인하는 사람이 양자라면 양부모를 적어요.`,
  en: `Name of ${who.en} in Korean letters. If the person marrying is an adopted child, write the adoptive parents.`,
  zh: `用韩文填写${who.zh}的姓名。结婚当事人为养子女时，填写养父母。`,
  ja: `${who.ja}の氏名をハングルで書きます。婚姻当事者が養子の場合は養父母を書きます。`,
  vi: `Họ tên ${who.vi} bằng chữ Hàn. Nếu người kết hôn là con nuôi, ghi cha mẹ nuôi.`,
});

const SIGN_NOTE: L = {
  ko: ' 서명이나 도장은 출력한 종이에 직접 해요.',
  en: ' Sign or stamp by hand on the printed paper.',
  zh: '签名或盖章请在打印出的纸上亲自完成。',
  ja: '署名・押印は印刷した紙に直接します。',
  vi: ' Ký tên hoặc đóng dấu trực tiếp trên giấy đã in.',
};

interface Side {
  key: 'husband' | 'wife';
  who: Who;
  /** 이 사람 칸의 왼쪽·오른쪽 끝 (한글·한자 줄 제외) */
  x0: number;
  x1: number;
  nameArea: Box;
  surname: Box;
  given: Box;
  hanjaSurname: Box;
  hanjaGiven: Box;
  bon: { area: Box; box: Box };
  phone: { area: Box; box: Box };
  /** 주민등록번호 가운데 「-」의 x */
  dash: [number, number];
  father: Who;
  mother: Who;
}

const HUSBAND_SIDE: Side = {
  key: 'husband', who: HUSBAND, x0: 337, x1: 684,
  nameArea: { x: 251, y: 212, w: 311, h: 38 },
  surname: { x: 375, y: 214, w: 43, h: 34, align: 'center' },
  given: { x: 448, y: 214, w: 112, h: 34, align: 'center' },
  hanjaSurname: { x: 360, y: 252, w: 42, h: 35, align: 'center' },
  hanjaGiven: { x: 433, y: 252, w: 127, h: 35, align: 'center' },
  bon: { area: { x: 337, y: 290, w: 107, h: 32 }, box: { x: 373, y: 292, w: 69, h: 28, align: 'center' } },
  phone: { area: { x: 445, y: 290, w: 239, h: 32 }, box: { x: 498, y: 292, w: 184, h: 28, align: 'center' } },
  dash: [506, 515],
  father: HF,
  mother: HM,
};

const WIFE_SIDE: Side = {
  key: 'wife', who: WIFE, x0: 685, x1: 1055,
  nameArea: { x: 685, y: 212, w: 239, h: 38 },
  surname: { x: 729, y: 214, w: 53, h: 34, align: 'center' },
  given: { x: 812, y: 214, w: 110, h: 34, align: 'center' },
  hanjaSurname: { x: 709, y: 252, w: 52, h: 35, align: 'center' },
  hanjaGiven: { x: 791, y: 252, w: 131, h: 35, align: 'center' },
  bon: { area: { x: 774, y: 290, w: 86, h: 32 }, box: { x: 808, y: 292, w: 50, h: 28, align: 'center' } },
  phone: { area: { x: 861, y: 290, w: 194, h: 32 }, box: { x: 914, y: 292, w: 139, h: 28, align: 'center' } },
  dash: [866, 875],
  father: WF,
  mother: WM,
};

const row = (s: Side, y: number, h: number): Box => ({ x: s.x0, y, w: s.x1 - s.x0, h });
const inBox = (s: Side, y: number, h: number): Box => ({ x: s.x0 + 36, y: y + 2, w: s.x1 - s.x0 - 40, h: h - 4, align: 'center' });
const idBoxes = (s: Side, y: number, h: number) => ({
  front: { x: s.x0 + 36, y: y + 2, w: s.dash[0] - s.x0 - 40, h: h - 4, align: 'center' as const },
  back: { x: s.dash[1] + 4, y: y + 2, w: s.x1 - s.dash[1] - 6, h: h - 4, align: 'center' as const },
});

/** ① 혼인당사자 한 사람 */
const partyFields = (s: Side): FieldDef[] => {
  const p = s.key;
  return [
    nameSplitField({
      id: `${p}Name`, section: 'party', required: true, koLabel: `① ${s.who.ko} 성명 (한글)`, who: s.who,
      help: {
        ko: `${s.who.ko}의 이름을 한글로 적어요. 외국인이면 여권·외국인등록증의 이름을 한글로 옮겨 적어요.` + SIGN_NOTE.ko,
        en: `Name of ${s.who.en} in Korean letters (Hangul). For a foreign national, transcribe the passport / residence card name into Hangul.` + SIGN_NOTE.en,
        zh: `用韩文填写${s.who.zh}的姓名。外国人请将护照/外国人登录证上的姓名按发音写成韩文。` + SIGN_NOTE.zh,
        ja: `${s.who.ja}の氏名をハングルで書きます。外国人の場合、パスポート・外国人登録証の氏名をハングル表記で書きます。` + SIGN_NOTE.ja,
        vi: `Họ tên ${s.who.vi} bằng chữ Hàn (Hangul). Nếu là người nước ngoài, phiên âm tên trên hộ chiếu / thẻ người nước ngoài sang Hangul.` + SIGN_NOTE.vi,
      },
      area: s.nameArea, surname: s.surname, given: s.given,
    }),
    hanjaSplitField({
      id: `${p}Hanja`, section: 'party', koLabel: `① ${s.who.ko} 성명 (한자)`, who: s.who,
      area: { ...s.nameArea, y: 251, h: 38 }, surname: s.hanjaSurname, given: s.hanjaGiven,
    }),
    bonField({ id: `${p}Bon`, section: 'party', koLabel: `① ${s.who.ko} 본(한자)`, who: s.who, area: s.bon.area, box: s.bon.box }),
    phoneField({ id: `${p}Phone`, section: 'party', koLabel: `① ${s.who.ko} 전화`, who: s.who, area: s.phone.area, box: s.phone.box }),
    birthDateField({ id: `${p}Birth`, section: 'party', required: true, koLabel: `① ${s.who.ko} 출생연월일`, who: s.who, area: row(s, 323, 32), box: inBox(s, 323, 32) }),
    idField({ id: `${p}Id`, section: 'party', required: true, koLabel: `① ${s.who.ko} 주민등록번호`, who: s.who, area: row(s, 356, 32), ...idBoxes(s, 356, 32) }),
    originField({ id: `${p}Origin`, section: 'party', required: true, koLabel: `① ${s.who.ko} 등록기준지`, who: s.who, area: row(s, 389, 38), box: inBox(s, 389, 38) }),
    addressField({ id: `${p}Address`, section: 'party', required: true, koLabel: `① ${s.who.ko} 주소`, who: s.who, help: ADDRESS_HELP(s.who), area: row(s, 428, 48), box: inBox(s, 428, 48) }),
  ];
};

/** ② 부모(양부모) — 한 사람 쪽 */
const parentFields = (s: Side): FieldDef[] => {
  const p = s.key;
  const ys = { fName: 477, fId: 511, fOrigin: 544, mName: 577, mId: 610, mOrigin: 644 };
  return [
    nameField({ id: `${p}FatherName`, section: 'parents', required: true, koLabel: `② ${s.who.ko} 부 성명`, who: s.father, help: PARENT_HELP(s.father), area: row(s, ys.fName, 33), box: inBox(s, ys.fName, 33) }),
    idField({ id: `${p}FatherId`, section: 'parents', required: true, koLabel: `② ${s.who.ko} 부 주민등록번호`, who: s.father, area: row(s, ys.fId, 32), ...idBoxes(s, ys.fId, 32) }),
    originField({ id: `${p}FatherOrigin`, section: 'parents', required: true, koLabel: `② ${s.who.ko} 부 등록기준지`, who: s.father, area: row(s, ys.fOrigin, 32), box: inBox(s, ys.fOrigin, 32) }),
    nameField({ id: `${p}MotherName`, section: 'parents', required: true, koLabel: `② ${s.who.ko} 모 성명`, who: s.mother, help: PARENT_HELP(s.mother), area: row(s, ys.mName, 32), box: inBox(s, ys.mName, 32) }),
    idField({ id: `${p}MotherId`, section: 'parents', required: true, koLabel: `② ${s.who.ko} 모 주민등록번호`, who: s.mother, area: row(s, ys.mId, 32), ...idBoxes(s, ys.mId, 32) }),
    originField({ id: `${p}MotherOrigin`, section: 'parents', required: true, koLabel: `② ${s.who.ko} 모 등록기준지`, who: s.mother, area: row(s, ys.mOrigin, 32), box: inBox(s, ys.mOrigin, 32) }),
  ];
};

const yesNo = (yes: [number, number], no: [number, number]): ChoiceOption[] => [
  opt('yes', '예', { ko: '예', en: 'Yes', zh: '是', ja: 'はい', vi: 'Có' }, yes[0], yes[1]),
  opt('no', '아니요', { ko: '아니요', en: 'No', zh: '否', ja: 'いいえ', vi: 'Không' }, no[0], no[1]),
];

const witness = (n: 1 | 2, who: Who, y: number): FieldDef[] => [
  nameField({
    id: `witness${n}Name`, section: 'witness', required: true, koLabel: `⑦ 증인 성명 (${n})`, who,
    help: {
      ko: '혼인신고에는 성인 증인 2명이 필요해요. 증인의 이름을 한글로 적고, 서명이나 도장은 증인이 출력한 종이에 직접 해요.',
      en: 'A marriage report needs 2 adult witnesses. Write the witness’s name in Korean letters; the witness signs or stamps by hand on the printed paper.',
      zh: '结婚申报需要2名成年证人。用韩文填写证人姓名，签名或盖章由证人在打印出的纸上亲自完成。',
      ja: '婚姻届には成年の証人2人が必要です。証人の氏名をハングルで書き、署名・押印は証人が印刷した紙に直接します。',
      vi: 'Đăng ký kết hôn cần 2 người làm chứng đã thành niên. Ghi tên người làm chứng bằng chữ Hàn; người làm chứng tự ký tên hoặc đóng dấu trên giấy đã in.',
    },
    area: { x: 337, y, w: 298, h: 33 },
    box: { x: 373, y: y + 2, w: 148, h: 29, align: 'center' },
  }),
  idField({ id: `witness${n}Id`, section: 'witness', required: true, koLabel: `⑦ 증인 주민등록번호 (${n})`, who, area: { x: 779, y, w: 276, h: 33 }, front: { x: 815, y: y + 2, w: 94, h: 29, align: 'center' }, back: { x: 926, y: y + 2, w: 127, h: 29, align: 'center' } }),
  addressField({ id: `witness${n}Address`, section: 'witness', required: true, koLabel: `⑦ 증인 주소 (${n})`, who, area: { x: 337, y: y + 34, w: 718, h: 32 }, box: { x: 373, y: y + 36, w: 678, h: 28, align: 'center' } }),
];

const CONSENT_HELP: L = {
  ko: '미성년자가 혼인할 때 동의하는 부모의 이름을 적어요. 해당하지 않으면 비워 둬요.' + SIGN_NOTE.ko,
  en: 'If a minor is marrying, write the name of the consenting parent. Leave blank if not applicable.' + SIGN_NOTE.en,
  zh: '未成年人结婚时，填写表示同意的父母姓名。不适用则留空。' + SIGN_NOTE.zh,
  ja: '未成年者が婚姻する場合、同意する父母の氏名を書きます。該当しなければ空欄にします。' + SIGN_NOTE.ja,
  vi: 'Nếu người chưa thành niên kết hôn, ghi tên bố / mẹ đồng ý. Nếu không áp dụng thì để trống.' + SIGN_NOTE.vi,
};
const GUARDIAN_HELP: L = {
  ko: '피성년후견인이 혼인할 때 동의하는 성년후견인의 이름을 적어요. 해당하지 않으면 비워 둬요.' + SIGN_NOTE.ko,
  en: 'If a person under adult guardianship is marrying, write the name of the consenting adult guardian. Leave blank if not applicable.' + SIGN_NOTE.en,
  zh: '被成年监护人结婚时，填写表示同意的成年监护人姓名。不适用则留空。' + SIGN_NOTE.zh,
  ja: '被成年後見人が婚姻する場合、同意する成年後見人の氏名を書きます。該当しなければ空欄にします。' + SIGN_NOTE.ja,
  vi: 'Nếu người được giám hộ thành niên kết hôn, ghi tên người giám hộ đồng ý. Nếu không áp dụng thì để trống.' + SIGN_NOTE.vi,
};
const consentName = (id: string, koLabel: string, label: L, y: number, h: number): FieldDef =>
  nameField({ id, section: 'consent', koLabel, who: HUSBAND, label, help: CONSENT_HELP, area: { x: 347, y, w: 277, h }, box: { x: 383, y: y + 2, w: 130, h: h - 4, align: 'center' } });

// ── 인구동향조사 ─────────────────────────────────────────────

const KIND_LABELS: [string, string, L][] = [
  ['first', '초혼', { ko: '초혼', en: 'First marriage', zh: '初婚', ja: '初婚', vi: 'Kết hôn lần đầu' }],
  ['afterDeath', '사별 후 재혼', { ko: '사별 후 재혼', en: 'Remarriage after the spouse died', zh: '丧偶后再婚', ja: '死別後の再婚', vi: 'Tái hôn sau khi vợ / chồng mất' }],
  ['afterDivorce', '이혼 후 재혼', { ko: '이혼 후 재혼', en: 'Remarriage after divorce', zh: '离婚后再婚', ja: '離婚後の再婚', vi: 'Tái hôn sau ly hôn' }],
];

const JOB_LABELS: [string, string, L][] = [
  ['manager', '관리직', { ko: '관리직', en: 'Manager', zh: '管理职', ja: '管理職', vi: 'Quản lý' }],
  ['professional', '전문직', { ko: '전문직', en: 'Professional', zh: '专业技术职', ja: '専門職', vi: 'Chuyên môn' }],
  ['clerical', '사무직', { ko: '사무직', en: 'Office / clerical', zh: '事务职', ja: '事務職', vi: 'Văn phòng' }],
  ['service', '서비스직', { ko: '서비스직', en: 'Service', zh: '服务职', ja: 'サービス職', vi: 'Dịch vụ' }],
  ['sales', '판매직', { ko: '판매직', en: 'Sales', zh: '销售职', ja: '販売職', vi: 'Bán hàng' }],
  ['farming', '농림어업', { ko: '농림어업', en: 'Agriculture, forestry, fishery', zh: '农林渔业', ja: '農林漁業', vi: 'Nông, lâm, ngư nghiệp' }],
  ['craft', '기능직', { ko: '기능직', en: 'Craft / skilled trades', zh: '技能职', ja: '技能職', vi: 'Thợ có tay nghề' }],
  ['machine', '장치·기계 조작 및 조립', { ko: '장치·기계 조작 및 조립', en: 'Machine operation & assembly', zh: '装置·机械操作及装配', ja: '装置・機械の操作及び組立', vi: 'Vận hành & lắp ráp máy móc' }],
  ['labor', '단순노무직', { ko: '단순노무직', en: 'Simple labor', zh: '简单劳务职', ja: '単純労務職', vi: 'Lao động giản đơn' }],
  ['military', '군인', { ko: '군인', en: 'Military', zh: '军人', ja: '軍人', vi: 'Quân nhân' }],
  ['none', '학생·가사·무직', { ko: '학생·가사·무직', en: 'Student, homemaker or no job', zh: '学生·家务·无业', ja: '学生・家事・無職', vi: 'Học sinh, nội trợ, không có việc làm' }],
];
const JOB_ROWS = [1452, 1475, 1497, 1522, 1548, 1573];
const jobOptions = (col1: number, col2: number): ChoiceOption[] =>
  JOB_LABELS.map(([v, ko, l], i) => opt(v, ko, l, i % 2 === 0 ? col1 : col2, JOB_ROWS[Math.floor(i / 2)]));

const survey = (s: Side, kindX: number[], eduX: number[], jobX: [number, number], x0: number, w: number): FieldDef[] => [
  {
    id: `${s.key}MarriageKind`, section: 'survey', koLabel: `㉯ 혼인종류 (${s.who.ko})`,
    label: { ko: `${s.who.ko} 혼인 종류`, en: `Type of marriage for ${s.who.en}`, zh: `${s.who.zh}婚姻类型`, ja: `${s.who.ja}の婚姻の種類`, vi: `Loại hôn nhân của ${s.who.vi}` },
    help: { ko: '통계청 조사 항목이에요. 이번이 첫 혼인인지, 재혼인지 골라요.', en: "For Statistics Korea's survey. Choose whether this is a first marriage or a remarriage.", zh: '这是统计厅的调查项目。选择这是初婚还是再婚。', ja: '統計庁の調査項目です。今回が初婚か再婚かを選びます。', vi: 'Đây là mục khảo sát của Cục Thống kê. Chọn đây là kết hôn lần đầu hay tái hôn.' },
    area: { x: x0, y: 1364, w, h: 23 },
    badge: 'margin',
    input: { kind: 'choice', mark: 'circle', options: KIND_LABELS.map(([v, ko, l], i) => opt(v, ko, l, kindX[i], 1376)) },
  },
  {
    id: `${s.key}Education`, section: 'survey', koLabel: `㉰ 최종 졸업학교 (${s.who.ko})`,
    label: { ko: `${s.who.ko} 최종 학력`, en: `Highest education of ${s.who.en}`, zh: `${s.who.zh}最高学历`, ja: `${s.who.ja}の最終学歴`, vi: `Học vấn cao nhất của ${s.who.vi}` },
    help: EDU_HELP,
    area: { x: x0, y: 1388, w, h: 51 },
    badge: 'margin',
    input: {
      kind: 'choice', mark: 'circle',
      options: eduOptions([eduX[0], eduX[1], eduX[2]], 1400).slice(0, 3).concat(eduOptions([0, 0, 0, eduX[0], eduX[1], eduX[2]], 1423).slice(3)),
    },
  },
  {
    id: `${s.key}Job`, section: 'survey', koLabel: `㉱ 직업 (${s.who.ko})`,
    label: { ko: `${s.who.ko} 직업`, en: `Occupation of ${s.who.en}`, zh: `${s.who.zh}职业`, ja: `${s.who.ja}の職業`, vi: `Nghề nghiệp của ${s.who.vi}` },
    help: { ko: '통계청 조사 항목이에요. 결혼할 당시의 주된 직업을 기준으로 골라요.', en: "For Statistics Korea's survey. Choose based on the main occupation at the time of marriage.", zh: '这是统计厅的调查项目。以结婚时的主要职业为准选择。', ja: '統計庁の調査項目です。結婚当時の主な職業を基準に選びます。', vi: 'Đây là mục khảo sát của Cục Thống kê. Chọn theo nghề chính tại thời điểm kết hôn.' },
    area: { x: x0, y: 1440, w, h: 145 },
    badge: 'margin',
    input: { kind: 'choice', mark: 'circle', options: jobOptions(jobX[0], jobX[1]) },
  },
];

const fields: FieldDef[] = [
  reportDateField(
    { x: 150, y: 157, w: 395, h: 25 },
    { x: 226, y: 158, w: 64, h: 23, align: 'right' },
    { x: 313, y: 158, w: 53, h: 23, align: 'right' },
    { x: 389, y: 158, w: 55, h: 23, align: 'right' },
  ),

  // ── ① 혼인당사자(신고인) ─────────────────────────────────
  ...partyFields(HUSBAND_SIDE),
  ...partyFields(WIFE_SIDE),

  // ── ② 부모(양부모) ───────────────────────────────────────
  ...parentFields(HUSBAND_SIDE),
  ...parentFields(WIFE_SIDE),

  // ── ③ ~ ⑥ ────────────────────────────────────────────────
  dateField({
    id: 'foreignMarriageDate', section: 'etc', koLabel: '③ 외국방식에 의한 혼인성립일자',
    label: { ko: '외국 방식으로 혼인이 성립한 날', en: 'Date the marriage was concluded under foreign law', zh: '依外国方式婚姻成立日期', ja: '外国の方式による婚姻成立日', vi: 'Ngày kết hôn theo thủ tục nước ngoài' },
    help: {
      ko: '외국 방식으로 먼저 혼인하고 그 혼인증서 등본을 내는 경우에만, 혼인이 성립한 날을 적어요.',
      en: 'Only if you married first under a foreign country’s procedure and are submitting a certified copy of that marriage certificate: the date the marriage was concluded.',
      zh: '仅在先依外国方式结婚并提交该结婚证书副本时，填写婚姻成立日期。',
      ja: '外国の方式で先に婚姻し、その婚姻証書の謄本を提出する場合のみ、婚姻が成立した日を書きます。',
      vi: 'Chỉ khi đã kết hôn trước theo thủ tục nước ngoài và nộp bản sao giấy chứng nhận kết hôn đó: ghi ngày kết hôn có hiệu lực.',
    },
    area: { x: 485, y: 677, w: 570, h: 32 },
    y: { x: 530, y: 679, w: 88, h: 28, align: 'right' },
    m: { x: 650, y: 679, w: 78, h: 28, align: 'right' },
    d: { x: 760, y: 679, w: 78, h: 28, align: 'right' },
  }),
  {
    id: 'surnameAgreement', section: 'etc', koLabel: '④ 성·본의 협의',
    label: { ko: '자녀가 어머니 성·본을 따르기로 협의했는지', en: "Agreement that children take the mother's surname and bon", zh: '是否协议子女随母亲姓·本', ja: '子が母の姓・本に従う協議をしたか', vi: 'Thỏa thuận con theo họ và bon của mẹ' },
    help: {
      ko: '앞으로 태어날 자녀의 성·본을 어머니의 성·본으로 하기로 협의했다면 "예"를 골라요. 이 경우 협의서를 함께 내야 해요.',
      en: 'Choose "Yes" if you agreed that your future children will take the mother’s surname and bon. In that case, an agreement document must be submitted too.',
      zh: '如已协议将来子女随母亲的姓·本，请选择“是”。此时须一并提交协议书。',
      ja: '将来生まれる子の姓・本を母の姓・本にすると協議した場合は「はい」を選びます。その場合は協議書も提出します。',
      vi: 'Chọn "Có" nếu đã thỏa thuận con sinh ra sau này theo họ và bon của mẹ. Khi đó phải nộp kèm bản thỏa thuận.',
    },
    area: { x: 337, y: 710, w: 718, h: 32 },
    badge: 'margin',
    input: { kind: 'choice', mark: 'check', options: yesNo([948, 727], [1034, 727]) },
  },
  {
    id: 'closeRelative', section: 'etc', required: true, koLabel: '⑤ 근친혼 여부',
    label: { ko: '두 사람이 8촌 이내 혈족인지', en: 'Are the two blood relatives within the 8th degree?', zh: '两人是否为8亲等以内的血亲', ja: '2人は8親等以内の血族か', vi: 'Hai người có phải họ hàng huyết thống trong vòng 8 đời không' },
    help: {
      ko: '혼인하는 두 사람이 8촌 이내의 혈족(친양자로 입양되기 전의 혈족 포함)인지 골라요. 보통은 "아니요"예요.',
      en: 'Choose whether the two people marrying are blood relatives within the 8th degree (including blood relatives from before a full adoption). Usually "No".',
      zh: '选择结婚双方是否为8亲等以内的血亲（包括亲养子收养前的血亲）。通常为“否”。',
      ja: '婚姻する2人が8親等以内の血族（特別養子縁組前の血族を含む）かどうかを選びます。通常は「いいえ」です。',
      vi: 'Chọn xem hai người kết hôn có phải họ hàng huyết thống trong vòng 8 đời (kể cả họ hàng trước khi được nhận nuôi đặc biệt) không. Thường là "Không".',
    },
    area: { x: 337, y: 743, w: 718, h: 32 },
    badge: 'margin',
    input: { kind: 'choice', mark: 'check', options: yesNo([940, 760], [1028, 760]) },
  },
  otherNotesField({
    id: 'otherNotes', section: 'etc', koLabel: '⑥ 기타사항',
    extra: {
      ko: '예) 사실상 혼인관계 존재확인 재판으로 신고하는 경우 재판법원과 확정일자, 부모의 혼인으로 혼인 중의 자녀가 되는 자녀가 있으면 그 자녀의 이름과 등록기준지.',
      en: 'e.g., when reporting by a court judgment confirming a de facto marriage, the court and the date it became final; if a child gains the status of a child born in wedlock through this marriage, the child’s name and registration base.',
      zh: '例：依事实婚姻关系存在确认判决申报时，填写判决法院及确定日期；如有因父母结婚而取得婚生子女身份的子女，填写该子女的姓名和登记基准地。',
      ja: '例）事実上の婚姻関係存在確認の裁判による届出の場合は裁判所と確定日、父母の婚姻によって嫡出子の身分を取得する子がいる場合はその子の氏名と登録基準地。',
      vi: 'VD: nếu khai báo theo phán quyết xác nhận quan hệ hôn nhân thực tế, ghi tòa án và ngày có hiệu lực; nếu có con trở thành con trong giá thú nhờ cuộc hôn nhân này, ghi tên và nơi đăng ký gốc của con.',
    },
    area: { x: 337, y: 776, w: 718, h: 32 },
    box: { x: 373, y: 778, w: 678, h: 28 },
  }),

  // ── ⑦ 증인 ───────────────────────────────────────────────
  ...witness(1, WITNESS1, 809),
  ...witness(2, WITNESS2, 875),

  // ── ⑧ 동의자 ─────────────────────────────────────────────
  consentName('consentHusbandFather', '⑧ 동의자 남편 부 성명', { ko: '동의하는 남편의 아버지', en: "Husband's father (consenting)", zh: '表示同意的丈夫父亲', ja: '同意する夫の父', vi: 'Bố của chồng (đồng ý)' }, 942, 33),
  consentName('consentHusbandMother', '⑧ 동의자 남편 모 성명', { ko: '동의하는 남편의 어머니', en: "Husband's mother (consenting)", zh: '表示同意的丈夫母亲', ja: '同意する夫の母', vi: 'Mẹ của chồng (đồng ý)' }, 976, 32),
  consentName('consentWifeFather', '⑧ 동의자 아내 부 성명', { ko: '동의하는 아내의 아버지', en: "Wife's father (consenting)", zh: '表示同意的妻子父亲', ja: '同意する妻の父', vi: 'Bố của vợ (đồng ý)' }, 1009, 32),
  consentName('consentWifeMother', '⑧ 동의자 아내 모 성명', { ko: '동의하는 아내의 어머니', en: "Wife's mother (consenting)", zh: '表示同意的妻子母亲', ja: '同意する妻の母', vi: 'Mẹ của vợ (đồng ý)' }, 1042, 33),
  nameField({ id: 'guardian1Name', section: 'consent', koLabel: '⑧ 후견인 성명 (1)', who: GUARDIAN1, help: GUARDIAN_HELP, area: { x: 734, y: 942, w: 321, h: 33 }, box: { x: 770, y: 944, w: 170, h: 29, align: 'center' } }),
  idField({ id: 'guardian1Id', section: 'consent', koLabel: '⑧ 후견인 주민등록번호 (1)', who: GUARDIAN1, area: { x: 809, y: 976, w: 246, h: 32 }, box: { x: 845, y: 978, w: 206, h: 28, align: 'center' } }),
  nameField({ id: 'guardian2Name', section: 'consent', koLabel: '⑧ 후견인 성명 (2)', who: GUARDIAN2, help: GUARDIAN_HELP, area: { x: 734, y: 1009, w: 321, h: 32 }, box: { x: 770, y: 1011, w: 170, h: 28, align: 'center' } }),
  idField({ id: 'guardian2Id', section: 'consent', koLabel: '⑧ 후견인 주민등록번호 (2)', who: GUARDIAN2, area: { x: 809, y: 1042, w: 246, h: 33 }, box: { x: 845, y: 1044, w: 206, h: 29, align: 'center' } }),

  // ── ⑨ 신고인 출석여부 ────────────────────────────────────
  {
    id: 'attendance', section: 'attendance', koLabel: '⑨ 신고인 출석여부',
    label: { ko: '창구에 직접 나온 사람', en: 'Who is present at the counter', zh: '亲自到窗口的人', ja: '窓口に出頭した人', vi: 'Người có mặt tại quầy' },
    help: { ko: '창구에 직접 나와 신고하는 사람을 모두 골라요.', en: 'Choose everyone who comes to the counter in person.', zh: '选择所有亲自到窗口申报的人。', ja: '窓口に直接来て届け出る人をすべて選びます。', vi: 'Chọn tất cả những người trực tiếp đến quầy khai báo.' },
    area: { x: 337, y: 1076, w: 718, h: 32 },
    input: {
      kind: 'choice', mark: 'circle', multiple: true,
      options: [
        opt('husband', '남편(부)', { ko: '남편', en: 'Husband', zh: '丈夫', ja: '夫', vi: 'Chồng' }, 530, 1092),
        opt('wife', '아내(처)', { ko: '아내', en: 'Wife', zh: '妻子', ja: '妻', vi: 'Vợ' }, 778, 1092),
      ],
    },
  },

  // ── ⑩ 제출인 ─────────────────────────────────────────────
  submitterNameField({ id: 'submitterName', section: 'submitter', koLabel: '⑩ 제출인 성명', area: { x: 347, y: 1109, w: 277, h: 33 }, box: { x: 383, y: 1111, w: 237, h: 29, align: 'center' } }),
  submitterIdField({ id: 'submitterId', section: 'submitter', koLabel: '⑩ 제출인 주민등록번호', area: { x: 809, y: 1109, w: 246, h: 33 }, front: { x: 845, y: 1111, w: 79, h: 29, align: 'center' }, back: { x: 941, y: 1111, w: 112, h: 29, align: 'center' } }),

  // ── 인구동향조사 ─────────────────────────────────────────
  dateField({
    id: 'cohabitDate', section: 'survey', koLabel: '㉮ 실제 결혼 생활 시작일',
    label: { ko: '실제로 함께 살기 시작한 날', en: 'Date you actually began living together', zh: '实际开始共同生活的日期', ja: '実際に同居を始めた日', vi: 'Ngày thực sự bắt đầu chung sống' },
    help: { ko: '통계청 조사 항목이에요. 혼인신고 날짜와 상관없이 실제로 부부가 함께 살기 시작한 날을 적어요.', en: "For Statistics Korea's survey. The date you actually began living together as a couple, regardless of the marriage registration date.", zh: '这是统计厅的调查项目。与结婚登记日期无关，填写夫妻实际开始共同生活的日期。', ja: '統計庁の調査項目です。婚姻届の日付とは関係なく、夫婦が実際に同居を始めた日を書きます。', vi: 'Đây là mục khảo sát của Cục Thống kê. Ghi ngày vợ chồng thực sự bắt đầu chung sống, không phụ thuộc ngày đăng ký kết hôn.' },
    area: { x: 450, y: 1339, w: 604, h: 24 },
    badge: 'margin',
    y: { x: 520, y: 1340, w: 80, h: 22, align: 'right' },
    m: { x: 625, y: 1340, w: 48, h: 22, align: 'right' },
    d: { x: 697, y: 1340, w: 48, h: 22, align: 'right' },
  }),
  ...survey(HUSBAND_SIDE, [288, 356, 484], [297, 408, 528], [297, 446], 285, 350),
  ...survey(WIFE_SIDE, [698, 761, 896], [697, 824, 944], [697, 862], 687, 367),
];

export const marriageReport: FormDef = {
  id: 'marriage-report',
  title: { ko: '혼인신고서', en: 'Marriage Report', zh: '婚姻申报书', ja: '婚姻届', vi: 'Giấy đăng ký kết hôn' },
  pages: [{ image: '/forms/marriage-report_ko.png', width: 1190, height: 1682 }],
  sections: [
    { id: 'meta',       label: { ko: '신고일',                 en: 'Report date',             zh: '申报日期',     ja: '届出日',         vi: 'Ngày khai báo' } },
    { id: 'party',      label: { ko: '① 혼인당사자(신고인)',   en: '① The couple (reporters)', zh: '① 结婚当事人', ja: '① 婚姻当事者',   vi: '① Hai người kết hôn' } },
    { id: 'parents',    label: { ko: '② 부모(양부모)',         en: '② Parents',               zh: '② 父母',       ja: '② 父母',         vi: '② Bố mẹ' } },
    { id: 'etc',        label: { ko: '③~⑥',                    en: '③–⑥ Other items',         zh: '③~⑥ 其他',     ja: '③～⑥ その他',    vi: '③–⑥ Mục khác' } },
    { id: 'witness',    label: { ko: '⑦ 증인',                 en: '⑦ Witnesses',             zh: '⑦ 证人',       ja: '⑦ 証人',         vi: '⑦ Người làm chứng' } },
    { id: 'consent',    label: { ko: '⑧ 동의자',               en: '⑧ Consent',               zh: '⑧ 同意人',     ja: '⑧ 同意者',       vi: '⑧ Người đồng ý' } },
    { id: 'attendance', label: { ko: '⑨ 신고인 출석여부',      en: '⑨ Attendance',            zh: '⑨ 申报人出席', ja: '⑨ 届出人の出頭', vi: '⑨ Có mặt tại quầy' } },
    { id: 'submitter',  label: { ko: '⑩ 제출인',               en: '⑩ Submitter',             zh: '⑩ 提交人',     ja: '⑩ 提出人',       vi: '⑩ Người nộp thay' } },
    { id: 'survey',     label: { ko: '인구동향조사',           en: 'Population survey',       zh: '人口动向调查', ja: '人口動向調査',   vi: 'Khảo sát dân số' } },
  ],
  fields,
};
