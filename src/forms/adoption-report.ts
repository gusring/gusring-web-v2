import {
  addressField, birthDateField, bonField, contactField, dateField, hanjaSplitField, idField, nameField, nameSplitField,
  opt, originField, otherNotesField, reportDateField, reporterNameField, sexField, submitterIdField, submitterNameField,
  textField, Who, WHO,
} from './common';
import { Box, FieldDef, FormDef, L } from './types';

// ─────────────────────────────────────────────────────────────
// 입양신고서 [양식 제4호] — v1 서식 8번
// 좌표는 public/forms/adoption-report_ko.png (1190×1682) 기준.
// 안내 문구는 뒷면 「작성 방법」(v1 guides_ko_8)을 바탕으로 작성.
// ─────────────────────────────────────────────────────────────

const AF = WHO.adoptiveFather;
const AM = WHO.adoptiveMother;
const AD: Who = { ko: '양자', en: 'the person being adopted', zh: '被收养人', ja: '養子となる者', vi: 'người được nhận nuôi' };
const REP_FATHER: Who = { ko: '법정대리인(부)', en: 'the legal representative (father)', zh: '法定代理人（父）', ja: '法定代理人（父）', vi: 'người đại diện theo pháp luật (bố)' };
const REP_MOTHER: Who = { ko: '법정대리인(모)', en: 'the legal representative (mother)', zh: '法定代理人（母）', ja: '法定代理人（母）', vi: 'người đại diện theo pháp luật (mẹ)' };
const REP_GUARDIAN: Who = { ko: '법정대리인(후견인)', en: 'the legal representative (guardian)', zh: '法定代理人（监护人）', ja: '法定代理人（後見人）', vi: 'người đại diện theo pháp luật (người giám hộ)' };
const SPOUSE: Who = { ko: '양자의 배우자', en: "the adoptee's spouse", zh: '被收养人的配偶', ja: '養子となる者の配偶者', vi: 'vợ / chồng của người được nhận nuôi' };

const UNDER13: L = {
  ko: '양자가 될 사람이 13세 미만이면 양자 칸은 비워 두고, 법정대리인이 아래 법정대리인 칸에 적고 서명(도장)해요.',
  en: 'If the person being adopted is under 13, leave the adoptee row blank; the legal representative fills in the legal representative rows below and signs (or stamps).',
  zh: '被收养人未满13岁时，养子女栏留空，由法定代理人在下方法定代理人栏填写并签名（盖章）。',
  ja: '養子となる者が13歳未満の場合、養子欄は空欄にし、法定代理人が下の法定代理人欄に書いて署名（押印）します。',
  vi: 'Nếu người được nhận nuôi dưới 13 tuổi, để trống dòng con nuôi; người đại diện theo pháp luật ghi vào các dòng người đại diện bên dưới và ký tên (đóng dấu).',
};

const PARENT_CONSENT_HELP: L = {
  ko: '양자가 될 사람이 성인이면 그 부모의 동의를 받아야 해요. 동의한 부모의 이름을 적고, 서명(도장)은 출력한 종이에 직접 해요. 가정법원의 입양허가를 받은 경우에는 동의자 칸을 적지 않아요.',
  en: "If the person being adopted is an adult, their parents' consent is required. Write the consenting parent's name; they sign (or stamp) by hand on the printed paper. If the family court has permitted the adoption, leave the consent rows blank.",
  zh: '被收养人已成年时，须取得其父母的同意。填写表示同意的父母姓名，签名（盖章）请在打印出的纸上亲自完成。已获得家庭法院收养许可的，不填写同意人栏。',
  ja: '養子となる者が成年の場合、その父母の同意が必要です。同意した父母の氏名を書き、署名（押印）は印刷した紙に直接します。家庭法院の養子縁組許可を受けた場合は、同意者欄は書きません。',
  vi: 'Nếu người được nhận nuôi đã thành niên, cần có sự đồng ý của bố mẹ người đó. Ghi tên bố / mẹ đồng ý; người đó ký tên (đóng dấu) trực tiếp trên giấy đã in. Nếu đã có quyết định cho phép nhận nuôi của tòa gia đình thì không ghi các dòng người đồng ý.',
};

const parentCol = (who: Who, key: 'Father' | 'Mother', x: number, x2: number, xBon: number, wName: number, wBon: number, id: { area: Box; front: Box; back: Box }, xRow: number, wRow: number): FieldDef[] => {
  const ko = key === 'Father' ? '양부' : '양모';
  return [
    nameSplitField({
      id: `adoptive${key}Name`, section: 'parents', koLabel: `① ${ko} 성명 (한글)`, who,
      area: { x, y: 241, w: wName, h: 61 },
      surname: { x: x2, y: 250, w: 58, h: 44, align: 'center' },
      given: { x: x2 + 70, y: 250, w: x + wName - x2 - 72, h: 44, align: 'center' },
    }),
    bonField({
      id: `adoptive${key}Bon`, section: 'parents', koLabel: `① ${ko} 본(한자)`, who,
      area: { x: xBon, y: 241, w: wBon, h: 61 },
      box: { x: xBon + 35, y: 250, w: wBon - 37, h: 44, align: 'center' },
    }),
    hanjaSplitField({
      id: `adoptive${key}Hanja`, section: 'parents', koLabel: `① ${ko} 성명 (한자)`, who,
      area: { x, y: 303, w: wName, h: 64 },
      surname: { x: x2, y: 312, w: 58, h: 46, align: 'center' },
      given: { x: x2 + 70, y: 312, w: x + wName - x2 - 72, h: 46, align: 'center' },
    }),
    birthDateField({
      id: `adoptive${key}Birth`, section: 'parents', koLabel: `① ${ko} 출생연월일`, who,
      area: { x: xBon, y: 303, w: wBon, h: 64 },
      box: { x: xBon + 35, y: 308, w: wBon - 37, h: 54, align: 'center' },
    }),
    idField({ id: `adoptive${key}Id`, section: 'parents', koLabel: `① ${ko} 주민등록번호`, who, ...id }),
    originField({
      id: `adoptive${key}Origin`, section: 'parents', koLabel: `① ${ko} 등록기준지`, who,
      area: { x: xRow, y: 405, w: wRow, h: 44 },
      box: { x: xRow + 36, y: 407, w: wRow - 40, h: 40, align: 'center' },
    }),
    addressField({
      id: `adoptive${key}Address`, section: 'parents', koLabel: `① ${ko} 주소`, who,
      area: { x: xRow, y: 451, w: wRow, h: 37 },
      box: { x: xRow + 36, y: 452, w: wRow - 40, h: 35, align: 'center' },
      copyFrom: key === 'Mother' ? [{ field: 'adoptiveFatherAddress', label: { ko: '양부 주소와 같아요', en: 'Same as the adoptive father', zh: '与养父地址相同', ja: '養父の住所と同じ', vi: 'Giống địa chỉ cha nuôi' }, map: { address: 'address' } }] : undefined,
    }),
  ];
};

/** 신고인 한 줄: 이름(서명) + 연락처 */
const reporterRow = (idBase: string, ko: string, who: Who, y: number, h: number, nameX: number, extra?: L): FieldDef[] => [
  reporterNameField({
    id: `${idBase}Name`, section: 'reporter', koLabel: `⑦ 신고인 ${ko}`, who, extra,
    area: { x: nameX, y, w: 743 - nameX, h },
    box: { x: nameX + 36, y: y + (h - 38) / 2, w: 210, h: 38, align: 'center' },
  }),
  contactField({
    id: `${idBase}Contact`, section: 'reporter', koLabel: `⑦ ${ko} 전화·이메일`, who,
    area: { x: 832, y, w: 213, h },
    phone: { x: 868, y: y + 1, w: 175, h: 25, align: 'center' },
    email: { x: 868, y: y + 28, w: 175, h: h - 29, align: 'center' },
  }),
];

const fields: FieldDef[] = [
  reportDateField(
    { x: 150, y: 171, w: 355, h: 28 },
    { x: 195, y: 173, w: 86, h: 24, align: 'right' },
    { x: 305, y: 173, w: 53, h: 24, align: 'right' },
    { x: 381, y: 173, w: 55, h: 24, align: 'right' },
  ),

  // ── ① 양친 ───────────────────────────────────────────────
  ...parentCol(AF, 'Father', 252, 294, 525, 192, 121,
    { area: { x: 399, y: 368, w: 247, h: 36 }, front: { x: 435, y: 370, w: 80, h: 32, align: 'center' }, back: { x: 531, y: 370, w: 113, h: 32, align: 'center' } },
    252, 394),
  ...parentCol(AM, 'Mother', 647, 691, 925, 195, 120,
    { area: { x: 790, y: 368, w: 255, h: 36 }, front: { x: 826, y: 370, w: 84, h: 32, align: 'center' }, back: { x: 925, y: 370, w: 118, h: 32, align: 'center' } },
    647, 398),

  // ── ② 양자 ───────────────────────────────────────────────
  nameSplitField({
    id: 'adopteeName', section: 'adoptee', koLabel: '② 양자 성명 (한글)', who: AD,
    area: { x: 252, y: 489, w: 266, h: 62 },
    surname: { x: 315, y: 498, w: 80, h: 44, align: 'center' },
    given: { x: 409, y: 498, w: 107, h: 44, align: 'center' },
  }),
  bonField({
    id: 'adopteeBon', section: 'adoptee', koLabel: '② 양자 본(한자)', who: AD,
    area: { x: 599, y: 489, w: 112, h: 62 },
    box: { x: 634, y: 498, w: 75, h: 44, align: 'center' },
  }),
  idField({
    id: 'adopteeId', section: 'adoptee', koLabel: '② 양자 주민등록번호', who: AD,
    area: { x: 855, y: 489, w: 190, h: 62 },
    front: { x: 889, y: 500, w: 55, h: 42, align: 'center' },
    back: { x: 958, y: 500, w: 85, h: 42, align: 'center' },
  }),
  hanjaSplitField({
    id: 'adopteeHanja', section: 'adoptee', koLabel: '② 양자 성명 (한자)', who: AD,
    area: { x: 252, y: 552, w: 266, h: 66 },
    surname: { x: 315, y: 563, w: 80, h: 44, align: 'center' },
    given: { x: 409, y: 563, w: 107, h: 44, align: 'center' },
  }),
  sexField({
    id: 'adopteeSex', section: 'adoptee', koLabel: '② 양자 성별', who: AD,
    area: { x: 599, y: 552, w: 112, h: 66 },
    badge: 'margin',
    male: { x: 616, y: 585 }, female: { x: 671, y: 585 },
  }),
  birthDateField({
    id: 'adopteeBirth', section: 'adoptee', koLabel: '② 양자 출생연월일', who: AD,
    area: { x: 855, y: 552, w: 190, h: 66 },
    box: { x: 890, y: 560, w: 153, h: 50, align: 'center' },
  }),
  originField({
    id: 'adopteeOrigin', section: 'adoptee', koLabel: '② 양자 등록기준지', who: AD,
    area: { x: 313, y: 619, w: 732, h: 38 },
    box: { x: 349, y: 620, w: 692, h: 36, align: 'center' },
  }),
  addressField({
    id: 'adopteeAddress', section: 'adoptee', koLabel: '② 양자 주소', who: AD,
    area: { x: 313, y: 658, w: 732, h: 38 },
    box: { x: 349, y: 659, w: 692, h: 36, align: 'center' },
  }),

  // ── ③ 양자의 친생부모 ────────────────────────────────────
  nameField({ id: 'birthFatherName', section: 'birthParents', koLabel: '③ 친생부 성명', who: WHO.birthFather, area: { x: 368, y: 697, w: 138, h: 77 }, box: { x: 404, y: 715, w: 100, h: 40, align: 'center' } }),
  originField({ id: 'birthFatherOrigin', section: 'birthParents', koLabel: '③ 친생부 등록기준지', who: WHO.birthFather, area: { x: 651, y: 697, w: 394, h: 38 }, box: { x: 687, y: 699, w: 354, h: 34, align: 'center' } }),
  idField({ id: 'birthFatherId', section: 'birthParents', koLabel: '③ 친생부 주민등록번호', who: WHO.birthFather, area: { x: 651, y: 736, w: 394, h: 38 }, front: { x: 687, y: 738, w: 152, h: 34, align: 'center' }, back: { x: 856, y: 738, w: 186, h: 34, align: 'center' } }),
  nameField({ id: 'birthMotherName', section: 'birthParents', koLabel: '③ 친생모 성명', who: WHO.birthMother, area: { x: 368, y: 775, w: 138, h: 77 }, box: { x: 404, y: 793, w: 100, h: 40, align: 'center' } }),
  originField({ id: 'birthMotherOrigin', section: 'birthParents', koLabel: '③ 친생모 등록기준지', who: WHO.birthMother, area: { x: 651, y: 775, w: 394, h: 38 }, box: { x: 687, y: 777, w: 354, h: 34, align: 'center' } }),
  idField({ id: 'birthMotherId', section: 'birthParents', koLabel: '③ 친생모 주민등록번호', who: WHO.birthMother, area: { x: 651, y: 814, w: 394, h: 38 }, front: { x: 687, y: 816, w: 152, h: 34, align: 'center' }, back: { x: 856, y: 816, w: 186, h: 34, align: 'center' } }),

  // ── ④ 기타사항 ───────────────────────────────────────────
  otherNotesField({
    id: 'otherNotes', section: 'etc', koLabel: '④ 기타사항',
    extra: {
      ko: '예) 양자가 될 사람이 13세 미만이라 법정대리인이 대신 입양을 승낙하고 신고하는 경우 그 사유, 가정법원이 법정대리인의 승낙 없이 입양을 허가한 경우 그 사유.',
      en: 'e.g., when the person being adopted is under 13 and the legal representative consents and reports in their place, the reason; when the family court permitted the adoption without the legal representative’s consent, the reason.',
      zh: '例：被收养人未满13岁、由法定代理人代为承诺收养并申报时的原因；家庭法院未经法定代理人承诺而许可收养时的原因。',
      ja: '例）養子となる者が13歳未満で法定代理人が代わって縁組を承諾し届け出る場合はその事由、家庭法院が法定代理人の承諾なしに縁組を許可した場合はその事由。',
      vi: 'VD: lý do khi người được nhận nuôi dưới 13 tuổi nên người đại diện theo pháp luật đồng ý thay và khai báo; lý do khi tòa gia đình cho phép nhận nuôi mà không có sự đồng ý của người đại diện theo pháp luật.',
    },
    area: { x: 313, y: 853, w: 732, h: 26 },
    box: { x: 349, y: 854, w: 692, h: 24 },
  }),

  // ── ⑤ 입양허가 ───────────────────────────────────────────
  textField({
    id: 'permitCourt', section: 'permit', koLabel: '⑤ 입양허가법원',
    label: { ko: '입양을 허가한 법원', en: 'Court that permitted the adoption', zh: '许可收养的法院', ja: '縁組を許可した裁判所', vi: 'Tòa án cho phép nhận nuôi' },
    help: {
      ko: '양자가 될 사람이 미성년자이거나, 피성년후견인이 입양을 하거나 양자가 되는 경우에는 가정법원의 허가를 받아야 해요. 그런 경우에만 허가한 법원 이름을 적어요.',
      en: 'If the person being adopted is a minor, or a person under adult guardianship adopts or is adopted, the family court’s permission is required. Only in that case, write the name of the court.',
      zh: '被收养人为未成年人，或被成年监护人收养或被收养时，须取得家庭法院的许可。仅在这种情况下填写许可的法院名称。',
      ja: '養子となる者が未成年者の場合、または被成年後見人が縁組をし、もしくは養子となる場合は、家庭法院の許可が必要です。その場合のみ許可した裁判所名を書きます。',
      vi: 'Nếu người được nhận nuôi là người chưa thành niên, hoặc người được giám hộ thành niên nhận nuôi hay được nhận nuôi, cần có sự cho phép của tòa gia đình. Chỉ trong trường hợp đó, ghi tên tòa án đã cho phép.',
    },
    area: { x: 313, y: 880, w: 354, h: 38 },
    part: { box: { x: 349, y: 882, w: 314, h: 34, align: 'center' }, korean: true, placeholder: '예) 서울가정법원' },
  }),
  dateField({
    id: 'permitDate', section: 'permit', koLabel: '⑤ 허가일자',
    label: { ko: '입양 허가일', en: 'Date the adoption was permitted', zh: '收养许可日期', ja: '縁組許可日', vi: 'Ngày cho phép nhận nuôi' },
    help: {
      ko: '가정법원이 입양을 허가한 날짜를 적어요.',
      en: 'The date the family court permitted the adoption.',
      zh: '填写家庭法院许可收养的日期。',
      ja: '家庭法院が縁組を許可した日付を書きます。',
      vi: 'Ngày tòa gia đình cho phép nhận nuôi.',
    },
    area: { x: 773, y: 880, w: 272, h: 38 },
    badge: 'margin',
    y: { x: 776, y: 882, w: 76, h: 34, align: 'right' },
    m: { x: 874, y: 882, w: 44, h: 34, align: 'right' },
    d: { x: 940, y: 882, w: 45, h: 34, align: 'right' },
  }),

  // ── ⑥ 동의자 ─────────────────────────────────────────────
  nameField({ id: 'consentFather', section: 'consent', koLabel: '⑥ 동의자 부 성명', who: WHO.father, label: { ko: '동의하는 아버지 이름', en: 'Name of the consenting father', zh: '表示同意的父亲姓名', ja: '同意する父の氏名', vi: 'Tên người bố đồng ý' }, help: PARENT_CONSENT_HELP, area: { x: 313, y: 919, w: 732, h: 42 }, box: { x: 349, y: 921, w: 300, h: 38, align: 'center' } }),
  nameField({ id: 'consentMother', section: 'consent', koLabel: '⑥ 동의자 모 성명', who: WHO.mother, label: { ko: '동의하는 어머니 이름', en: 'Name of the consenting mother', zh: '表示同意的母亲姓名', ja: '同意する母の氏名', vi: 'Tên người mẹ đồng ý' }, help: PARENT_CONSENT_HELP, area: { x: 313, y: 962, w: 732, h: 43 }, box: { x: 349, y: 964, w: 300, h: 39, align: 'center' } }),
  textField({
    id: 'consentCourt', section: 'consent', koLabel: '⑥ 부모 동의를 갈음하는 심판 법원',
    label: { ko: '부모 동의를 대신한 심판 법원', en: "Court whose ruling replaced the parents' consent", zh: '代替父母同意的审判法院', ja: '父母の同意に代わる審判をした裁判所', vi: 'Tòa án ra quyết định thay cho sự đồng ý của bố mẹ' },
    help: {
      ko: '부모가 정당한 이유 없이 동의를 거부해서 가정법원의 심판으로 동의를 대신한 경우에만, 그 법원 이름을 적어요.',
      en: "Only if the parents refused consent without a justifiable reason and a family court ruling replaced their consent: the name of that court.",
      zh: '仅在父母无正当理由拒绝同意、由家庭法院审判代替同意时，填写该法院名称。',
      ja: '父母が正当な理由なく同意を拒否し、家庭法院の審判で同意に代えた場合のみ、その裁判所名を書きます。',
      vi: 'Chỉ khi bố mẹ từ chối đồng ý mà không có lý do chính đáng và tòa gia đình ra quyết định thay cho sự đồng ý: ghi tên tòa án đó.',
    },
    area: { x: 560, y: 1006, w: 174, h: 36 },
    part: { box: { x: 596, y: 1008, w: 136, h: 32, align: 'center' }, korean: true, placeholder: '예) 서울가정법원' },
  }),
  dateField({
    id: 'consentCourtDate', section: 'consent', koLabel: '⑥ 심판일자',
    label: { ko: '심판일', en: 'Date of the ruling', zh: '审判日期', ja: '審判日', vi: 'Ngày ra quyết định' },
    help: {
      ko: '부모 동의를 대신한 가정법원 심판의 날짜를 적어요.',
      en: "The date of the family court ruling that replaced the parents' consent.",
      zh: '填写代替父母同意的家庭法院审判日期。',
      ja: '父母の同意に代わる家庭法院の審判の日付を書きます。',
      vi: 'Ngày tòa gia đình ra quyết định thay cho sự đồng ý của bố mẹ.',
    },
    area: { x: 837, y: 1006, w: 208, h: 36 },
    badge: 'margin',
    y: { x: 840, y: 1008, w: 66, h: 32, align: 'right' },
    m: { x: 928, y: 1008, w: 34, h: 32, align: 'right' },
    d: { x: 983, y: 1008, w: 34, h: 32, align: 'right' },
  }),
  textField({
    id: 'consentReason', section: 'consent', koLabel: '⑥ 부모의 동의를 받을 수 없는 사유',
    label: { ko: '부모의 동의를 받을 수 없는 이유', en: "Why the parents' consent cannot be obtained", zh: '无法取得父母同意的原因', ja: '父母の同意を得られない事由', vi: 'Lý do không thể có sự đồng ý của bố mẹ' },
    help: {
      ko: '부모가 어디 있는지 알 수 없는 등의 이유로 동의를 받을 수 없을 때, 그 이유를 한국어로 적어요.',
      en: "If consent cannot be obtained because, for example, the parents' whereabouts are unknown, write the reason in Korean.",
      zh: '因不知父母下落等原因无法取得同意时，用韩文填写原因。',
      ja: '父母の所在が分からないなどの理由で同意を得られない場合、その事由を韓国語で書きます。',
      vi: 'Nếu không thể có sự đồng ý vì lý do như không biết bố mẹ ở đâu, ghi lý do bằng tiếng Hàn.',
    },
    area: { x: 560, y: 1043, w: 485, h: 37 },
    part: { box: { x: 596, y: 1045, w: 445, h: 33, align: 'left' }, korean: true, placeholder: '예) 부모의 소재 불명' },
  }),
  nameField({
    id: 'spouseName', section: 'consent', koLabel: '⑥ 양자의 배우자 성명', who: SPOUSE,
    help: {
      ko: '배우자가 있는 사람이 양자가 될 때는 배우자의 동의를 받아야 해요. 그런 경우에만 배우자 이름을 적고, 서명(도장)은 출력한 종이에 직접 해요.',
      en: 'When a married person is adopted, their spouse must consent. Only in that case, write the spouse’s name; they sign (or stamp) by hand on the printed paper.',
      zh: '有配偶的人被收养时，须取得配偶的同意。仅在这种情况下填写配偶姓名，签名（盖章）请在打印出的纸上亲自完成。',
      ja: '配偶者のある者が養子となる場合は、配偶者の同意が必要です。その場合のみ配偶者の氏名を書き、署名（押印）は印刷した紙に直接します。',
      vi: 'Khi người đã kết hôn được nhận nuôi, cần có sự đồng ý của vợ / chồng. Chỉ trong trường hợp đó, ghi tên vợ / chồng; người đó ký tên (đóng dấu) trực tiếp trên giấy đã in.',
    },
    area: { x: 368, y: 1081, w: 278, h: 36 },
    box: { x: 404, y: 1083, w: 140, h: 32, align: 'center' },
  }),
  idField({
    id: 'spouseId', section: 'consent', koLabel: '⑥ 양자의 배우자 주민등록번호', who: SPOUSE,
    area: { x: 813, y: 1081, w: 232, h: 36 },
    front: { x: 849, y: 1083, w: 71, h: 32, align: 'center' },
    back: { x: 937, y: 1083, w: 106, h: 32, align: 'center' },
  }),

  // ── ⑦ 신고인 ─────────────────────────────────────────────
  ...reporterRow('reporterFather', '양부', AF, 1118, 54, 282),
  ...reporterRow('reporterMother', '양모', AM, 1174, 54, 282),
  ...reporterRow('reporterAdoptee', '양자', AD, 1229, 54, 282, UNDER13),
  {
    id: 'legalRepType',
    section: 'reporter',
    koLabel: '⑦ 법정대리인 (①부모 ②후견인)',
    label: { ko: '신고하는 법정대리인', en: 'Legal representative reporting', zh: '申报的法定代理人', ja: '届け出る法定代理人', vi: 'Người đại diện theo pháp luật khai báo' },
    help: {
      ko: '양자가 될 사람이 13세 미만이면 법정대리인이 대신 신고해요. 부모인지 후견인인지 골라요. 가정법원이 법정대리인의 승낙 없이 입양을 허가했다면 법정대리인 칸은 비워 둬요.',
      en: 'If the person being adopted is under 13, the legal representative reports instead. Choose whether it is the parents or a guardian. If the family court permitted the adoption without the legal representative’s consent, leave the legal representative rows blank.',
      zh: '被收养人未满13岁时由法定代理人代为申报。选择是父母还是监护人。如家庭法院未经法定代理人承诺而许可收养，则法定代理人栏留空。',
      ja: '養子となる者が13歳未満の場合は法定代理人が代わって届け出ます。父母か後見人かを選びます。家庭法院が法定代理人の承諾なしに縁組を許可した場合は、法定代理人欄は空欄にします。',
      vi: 'Nếu người được nhận nuôi dưới 13 tuổi, người đại diện theo pháp luật khai báo thay. Chọn là bố mẹ hay người giám hộ. Nếu tòa gia đình cho phép nhận nuôi mà không có sự đồng ý của người đại diện theo pháp luật, hãy để trống các dòng người đại diện.',
    },
    area: { x: 192, y: 1284, w: 158, h: 171 },
    input: {
      kind: 'choice',
      mark: 'circle',
      options: [
        opt('parents', '부모', { ko: '부모', en: 'Parents', zh: '父母', ja: '父母', vi: 'Bố mẹ' }, 315, 1325),
        opt('guardian', '후견인', { ko: '후견인', en: 'Guardian', zh: '监护人', ja: '後見人', vi: 'Người giám hộ' }, 318, 1425),
      ],
    },
  },
  ...reporterRow('legalRepFather', '법정대리인 부', REP_FATHER, 1284, 54, 422),
  ...reporterRow('legalRepMother', '법정대리인 모', REP_MOTHER, 1339, 54, 422),
  ...reporterRow('legalRepGuardian', '법정대리인 후견인', REP_GUARDIAN, 1394, 60, 422),

  // ── ⑧ 신고인 출석여부 ────────────────────────────────────
  {
    id: 'attendance',
    section: 'attendance',
    koLabel: '⑧ 신고인 출석여부',
    label: { ko: '창구에 직접 나온 신고인', en: 'Reporters present at the counter', zh: '亲自到窗口的申报人', ja: '窓口に出頭した届出人', vi: 'Người khai báo có mặt tại quầy' },
    help: {
      ko: '신고인 중 창구에 직접 나와 신고하는 사람을 모두 골라요. 법정대리인이 나왔다면 "법정대리인"과 함께 부·모·후견인 중 누구인지도 골라요.',
      en: 'Choose every reporter who comes to the counter in person. If a legal representative comes, choose "Legal representative" and also which one (father, mother or guardian).',
      zh: '选择所有亲自到窗口申报的申报人。如法定代理人到场，请选择“法定代理人”，并选择是父、母还是监护人。',
      ja: '届出人のうち窓口に直接来て届け出る人をすべて選びます。法定代理人が来た場合は「法定代理人」とあわせて、父・母・後見人のどれかも選びます。',
      vi: 'Chọn tất cả những người khai báo trực tiếp đến quầy. Nếu người đại diện theo pháp luật đến, chọn "Người đại diện theo pháp luật" và chọn thêm là bố, mẹ hay người giám hộ.',
    },
    area: { x: 422, y: 1456, w: 623, h: 43 },
    badge: 'margin',
    input: {
      kind: 'choice',
      mark: 'circle',
      multiple: true,
      options: [
        opt('adoptiveFather', '양부', { ko: '양부', en: 'Adoptive father', zh: '养父', ja: '養父', vi: 'Cha nuôi' }, 436, 1478),
        opt('adoptiveMother', '양모', { ko: '양모', en: 'Adoptive mother', zh: '养母', ja: '養母', vi: 'Mẹ nuôi' }, 524, 1478),
        opt('adoptee', '양자', { ko: '양자', en: 'Adopted person', zh: '被收养人', ja: '養子', vi: 'Người được nhận nuôi' }, 612, 1478),
        opt('legalRep', '법정대리인', { ko: '법정대리인', en: 'Legal representative', zh: '法定代理人', ja: '法定代理人', vi: 'Người đại diện theo pháp luật' }, 700, 1478),
        opt('repFather', '부', { ko: '└ 법정대리인 중 부', en: '└ of whom: father', zh: '└ 其中：父', ja: '└ うち父', vi: '└ trong đó: bố' }, 851, 1478),
        opt('repMother', '모', { ko: '└ 법정대리인 중 모', en: '└ of whom: mother', zh: '└ 其中：母', ja: '└ うち母', vi: '└ trong đó: mẹ' }, 903, 1478),
        opt('repGuardian', '후견인', { ko: '└ 법정대리인 중 후견인', en: '└ of whom: guardian', zh: '└ 其中：监护人', ja: '└ うち後見人', vi: '└ trong đó: người giám hộ' }, 957, 1478),
      ],
    },
  },

  // ── ⑨ 제출인 ─────────────────────────────────────────────
  submitterNameField({
    id: 'submitterName', section: 'submitter', koLabel: '⑨ 제출인 성명',
    area: { x: 422, y: 1500, w: 224, h: 44 },
    box: { x: 458, y: 1502, w: 185, h: 40, align: 'center' },
  }),
  submitterIdField({
    id: 'submitterId', section: 'submitter', koLabel: '⑨ 제출인 주민등록번호',
    area: { x: 813, y: 1500, w: 232, h: 44 },
    front: { x: 849, y: 1502, w: 71, h: 40, align: 'center' },
    back: { x: 937, y: 1502, w: 106, h: 40, align: 'center' },
  }),
];

export const adoptionReport: FormDef = {
  id: 'adoption-report',
  title: { ko: '입양신고서', en: 'Adoption Report', zh: '收养申报书', ja: '養子縁組届', vi: 'Giấy đăng ký nhận con nuôi' },
  pages: [{ image: '/forms/adoption-report_ko.png', width: 1190, height: 1682 }],
  sections: [
    { id: 'meta',         label: { ko: '신고일',              en: 'Report date',          zh: '申报日期',     ja: '届出日',         vi: 'Ngày khai báo' } },
    { id: 'parents',      label: { ko: '① 양친',              en: '① Adoptive parents',   zh: '① 养父母',     ja: '① 養親',         vi: '① Cha mẹ nuôi' } },
    { id: 'adoptee',      label: { ko: '② 양자',              en: '② Person adopted',     zh: '② 被收养人',   ja: '② 養子',         vi: '② Người được nhận nuôi' } },
    { id: 'birthParents', label: { ko: '③ 양자의 친생부모',   en: '③ Birth parents',      zh: '③ 亲生父母',   ja: '③ 実父母',       vi: '③ Cha mẹ ruột' } },
    { id: 'etc',          label: { ko: '④ 기타사항',          en: '④ Other notes',        zh: '④ 其他事项',   ja: '④ その他事項',   vi: '④ Ghi chú khác' } },
    { id: 'permit',       label: { ko: '⑤ 입양허가',          en: '⑤ Court permission',   zh: '⑤ 收养许可',   ja: '⑤ 縁組許可',     vi: '⑤ Tòa cho phép' } },
    { id: 'consent',      label: { ko: '⑥ 동의자',            en: '⑥ Consent',            zh: '⑥ 同意人',     ja: '⑥ 同意者',       vi: '⑥ Sự đồng ý' } },
    { id: 'reporter',     label: { ko: '⑦ 신고인',            en: '⑦ Persons reporting',  zh: '⑦ 申报人',     ja: '⑦ 届出人',       vi: '⑦ Người khai báo' } },
    { id: 'attendance',   label: { ko: '⑧ 신고인 출석여부',   en: '⑧ Attendance',         zh: '⑧ 申报人出席', ja: '⑧ 届出人の出頭', vi: '⑧ Có mặt tại quầy' } },
    { id: 'submitter',    label: { ko: '⑨ 제출인',            en: '⑨ Submitter',          zh: '⑨ 提交人',     ja: '⑨ 提出人',       vi: '⑨ Người nộp thay' } },
  ],
  fields,
};
