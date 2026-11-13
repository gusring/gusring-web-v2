import {
  addressField, birthDateField, bonField, courtNameField, dateField, emailField, hanjaSplitField, idField, nameField,
  nameSplitField, opt, originField, otherNotesField, OTHER_DETAIL, phoneField, reportDateField, reporterNameField,
  submitterIdField, submitterNameField, Who, WHO,
} from './common';
import { Box, FieldDef, FormDef, L } from './types';

// ─────────────────────────────────────────────────────────────
// 친양자파양신고서 [양식 제7호] — v1 서식 9번
// 좌표는 public/forms/full-adoption-dissolution-report_ko.png (1190×1682) 기준.
// 안내 문구는 서식 아래 「작성 방법」을 바탕으로 작성.
// ─────────────────────────────────────────────────────────────

const AF = WHO.adoptiveFather;
const AM = WHO.adoptiveMother;
const CHILD: Who = { ko: '친양자', en: 'the fully adopted child', zh: '亲养子女', ja: '特別養子', vi: 'con nuôi đặc biệt' };
const RF: Who = { ko: '부활되는 (양)부', en: 'the (adoptive) father being restored', zh: '恢复关系的（养）父', ja: '復活する（養）父', vi: '(cha nuôi) được khôi phục' };
const RM: Who = { ko: '부활되는 (양)모', en: 'the (adoptive) mother being restored', zh: '恢复关系的（养）母', ja: '復活する（養）母', vi: '(mẹ nuôi) được khôi phục' };

const REVIVE_HELP: L = {
  ko: '친양자로 입양되기 전에 일반 입양 관계가 있었다면, 친양자 파양으로 그 전의 양부모 관계가 되살아나요. 그런 경우에만 그 양부모를 적어요.',
  en: 'If there was an ordinary adoption before the full adoption, that earlier adoptive-parent relationship is restored when the full adoption is dissolved. Only in that case, fill in those adoptive parents.',
  zh: '如在亲养子收养之前已形成一般收养关系，则亲养子罢养时原来的养父母关系会恢复。仅在这种情况下填写该养父母。',
  ja: '特別養子縁組の前に普通養子縁組の関係があった場合、特別養子の離縁によってその前の養親関係が復活します。その場合のみ、その養親を書きます。',
  vi: 'Nếu trước khi nhận nuôi đặc biệt đã có quan hệ nhận nuôi thông thường, thì khi chấm dứt nhận nuôi đặc biệt, quan hệ cha mẹ nuôi trước đó được khôi phục. Chỉ ghi cha mẹ nuôi đó trong trường hợp này.',
};

/** 종전·부활된 성(姓)/본(本) — 한글·한자 두 칸 */
const surnameOrBon = (id: string, koLabel: string, kind: 'surname' | 'bon', revived: boolean, area: Box, ko: Box, hanja: Box): FieldDef => {
  const what: L = kind === 'surname'
    ? { ko: '성', en: 'surname', zh: '姓', ja: '姓', vi: 'họ' }
    : { ko: '본', en: 'bon (family origin)', zh: '本贯', ja: '本', vi: 'bon (quê gốc dòng họ)' };
  const when: L = revived
    ? { ko: '부활된', en: 'restored', zh: '恢复的', ja: '復活した', vi: 'được khôi phục' }
    : { ko: '종전의', en: 'previous', zh: '原来的', ja: '従前の', vi: 'trước đây' };
  return {
    id,
    section: 'child',
    koLabel,
    label: { ko: `${when.ko} ${what.ko}`, en: `${when.en.charAt(0).toUpperCase() + when.en.slice(1)} ${what.en}`, zh: `${when.zh}${what.zh}`, ja: `${when.ja}${what.ja}`, vi: `${what.vi.charAt(0).toUpperCase() + what.vi.slice(1)} ${when.vi}` },
    help: {
      ko: `'종전의 ${what.ko}'에는 지금까지 쓰던 ${what.ko}을, '부활된 ${what.ko}'에는 파양으로 다시 쓰게 되는 ${what.ko}을 한글과 한자로 적어요. 법원의 재판서를 보고 적고, 잘 모르면 창구에 물어보세요.`,
      en: `"Previous ${what.en}": the one used until now. "Restored ${what.en}": the one used again after the dissolution. Write it in Hangul and Chinese characters, following the court judgment; ask at the counter if unsure.`,
      zh: `“原来的${what.zh}”填写至今使用的${what.zh}，“恢复的${what.zh}”填写因罢养而重新使用的${what.zh}，用韩文和汉字填写。请参照法院判决书填写，不清楚时请咨询窗口。`,
      ja: `「従前の${what.ja}」には今まで使っていた${what.ja}を、「復活した${what.ja}」には離縁によって再び使う${what.ja}を、ハングルと漢字で書きます。裁判所の裁判書を見て書き、分からない場合は窓口でお尋ねください。`,
      vi: `"${what.vi.charAt(0).toUpperCase() + what.vi.slice(1)} trước đây": loại đang dùng đến nay. "${what.vi.charAt(0).toUpperCase() + what.vi.slice(1)} được khôi phục": loại sẽ dùng lại sau khi chấm dứt nhận nuôi. Ghi bằng chữ Hàn và chữ Hán theo bản án của tòa; nếu chưa rõ hãy hỏi tại quầy.`,
    },
    area,
    input: {
      kind: 'text',
      parts: [
        { key: 'ko', box: ko, hangul: true, label: { ko: '한글', en: 'Hangul', zh: '韩文', ja: 'ハングル', vi: 'Hangul' }, placeholder: kind === 'surname' ? '예) 김' : '예) 김해' },
        { key: 'hanja', box: hanja, label: { ko: '한자', en: 'Chinese characters', zh: '汉字', ja: '漢字', vi: 'Chữ Hán' }, placeholder: kind === 'surname' ? '예) 金' : '예) 金海' },
      ],
    },
  };
};

/** 양부·양모 한 사람 칸 (위→아래) */
const parentCol = (who: Who, key: 'Father' | 'Mother', x: number, xName: number, xBon: number, xBonVal: number, xEnd: number, id: { area: Box; front: Box; back: Box }): FieldDef[] => {
  const ko = key === 'Father' ? '양부' : '양모';
  const wName = xBon - x;
  return [
    nameSplitField({
      id: `adoptive${key}Name`, section: 'parents', koLabel: `① ${ko} 성명 (한글)`, who,
      area: { x, y: 230, w: wName, h: 32 },
      surname: { x: xName, y: 232, w: 58, h: 28, align: 'center' },
      given: { x: xName + 70, y: 232, w: xBon - xName - 72, h: 28, align: 'center' },
    }),
    bonField({
      id: `adoptive${key}Bon`, section: 'parents', koLabel: `① ${ko} 본(한자)`, who,
      area: { x: xBonVal, y: 230, w: xEnd - xBonVal, h: 32 },
      box: { x: xBonVal + 35, y: 232, w: xEnd - xBonVal - 37, h: 28, align: 'center' },
    }),
    hanjaSplitField({
      id: `adoptive${key}Hanja`, section: 'parents', koLabel: `① ${ko} 성명 (한자)`, who,
      area: { x, y: 263, w: wName, h: 33 },
      surname: { x: xName, y: 265, w: 58, h: 29, align: 'center' },
      given: { x: xName + 70, y: 265, w: xBon - xName - 72, h: 29, align: 'center' },
    }),
    // 값 칸이 좁아 번호는 「출생연월일」 글자 위에 둔다
    birthDateField({
      id: `adoptive${key}Birth`, section: 'parents', koLabel: `① ${ko} 출생연월일`, who,
      area: { x: xBon + 1, y: 263, w: xEnd - xBon - 1, h: 33 },
      box: { x: xBonVal + 2, y: 265, w: xEnd - xBonVal - 4, h: 29, align: 'center' },
    }),
    idField({ id: `adoptive${key}Id`, section: 'parents', koLabel: `① ${ko} 주민등록번호`, who, ...id }),
  ];
};

const fields: FieldDef[] = [
  reportDateField(
    { x: 150, y: 171, w: 340, h: 28 },
    { x: 188, y: 173, w: 86, h: 24, align: 'right' },
    { x: 298, y: 173, w: 53, h: 24, align: 'right' },
    { x: 374, y: 173, w: 55, h: 24, align: 'right' },
  ),

  // ── ① 양친 ───────────────────────────────────────────────
  ...parentCol(AF, 'Father', 255, 299, 462, 549, 649,
    { area: { x: 385, y: 297, w: 264, h: 32 }, front: { x: 421, y: 299, w: 88, h: 28, align: 'center' }, back: { x: 527, y: 299, w: 120, h: 28, align: 'center' } }),
  originField({ id: 'adoptiveFatherOrigin', section: 'parents', koLabel: '① 양부 등록기준지', who: AF, area: { x: 255, y: 330, w: 394, h: 44 }, box: { x: 291, y: 332, w: 354, h: 40, align: 'center' } }),
  addressField({ id: 'adoptiveFatherAddress', section: 'parents', koLabel: '① 양부 주소', who: AF, area: { x: 255, y: 375, w: 394, h: 38 }, box: { x: 291, y: 376, w: 354, h: 36, align: 'center' } }),
  ...parentCol(AM, 'Mother', 650, 691, 842, 927, 1043,
    { area: { x: 780, y: 297, w: 263, h: 32 }, front: { x: 816, y: 299, w: 86, h: 28, align: 'center' }, back: { x: 920, y: 299, w: 121, h: 28, align: 'center' } }),
  originField({ id: 'adoptiveMotherOrigin', section: 'parents', koLabel: '① 양모 등록기준지', who: AM, area: { x: 650, y: 330, w: 393, h: 44 }, box: { x: 686, y: 332, w: 353, h: 40, align: 'center' } }),
  addressField({
    id: 'adoptiveMotherAddress', section: 'parents', koLabel: '① 양모 주소', who: AM, area: { x: 650, y: 375, w: 393, h: 38 }, box: { x: 686, y: 376, w: 353, h: 36, align: 'center' },
    copyFrom: [{ field: 'adoptiveFatherAddress', label: { ko: '양부 주소와 같아요', en: 'Same as the adoptive father', zh: '与养父地址相同', ja: '養父の住所と同じ', vi: 'Giống địa chỉ cha nuôi' }, map: { address: 'address' } }],
  }),

  // ── ② 친양자 ─────────────────────────────────────────────
  nameSplitField({
    id: 'childName', section: 'child', koLabel: '② 친양자 성명 (한글)', who: CHILD,
    area: { x: 255, y: 414, w: 276, h: 32 },
    surname: { x: 316, y: 416, w: 46, h: 28, align: 'center' },
    given: { x: 362, y: 416, w: 167, h: 28, align: 'center' },
  }),
  bonField({
    id: 'childBon', section: 'child', koLabel: '② 친양자 본(한자)', who: CHILD,
    area: { x: 650, y: 414, w: 140, h: 32 },
    box: { x: 686, y: 416, w: 102, h: 28, align: 'center' },
  }),
  hanjaSplitField({
    id: 'childHanja', section: 'child', koLabel: '② 친양자 성명 (한자)', who: CHILD,
    area: { x: 255, y: 447, w: 276, h: 33 },
    surname: { x: 316, y: 449, w: 46, h: 29, align: 'center' },
    given: { x: 362, y: 449, w: 167, h: 29, align: 'center' },
  }),
  birthDateField({
    id: 'childBirth', section: 'child', koLabel: '② 친양자 출생연월일', who: CHILD,
    area: { x: 650, y: 447, w: 140, h: 33 },
    box: { x: 686, y: 449, w: 102, h: 29, align: 'center' },
  }),
  idField({
    id: 'childId', section: 'child', koLabel: '② 친양자 주민등록번호', who: CHILD,
    area: { x: 791, y: 447, w: 252, h: 33 },
    front: { x: 827, y: 449, w: 82, h: 29, align: 'center' },
    back: { x: 924, y: 449, w: 117, h: 29, align: 'center' },
  }),
  originField({ id: 'childOrigin', section: 'child', koLabel: '② 친양자 등록기준지', who: CHILD, area: { x: 315, y: 481, w: 728, h: 32 }, box: { x: 351, y: 483, w: 688, h: 28, align: 'center' } }),
  addressField({ id: 'childAddress', section: 'child', koLabel: '② 친양자 주소', who: CHILD, area: { x: 315, y: 514, w: 728, h: 32 }, box: { x: 351, y: 516, w: 688, h: 28, align: 'center' } }),
  surnameOrBon('surnameBefore', '② 종전의 성(姓)', 'surname', false, { x: 344, y: 547, w: 258, h: 32 }, { x: 396, y: 548, w: 79, h: 30, align: 'center' }, { x: 533, y: 548, w: 67, h: 30, align: 'center' }),
  surnameOrBon('bonBefore', '② 종전의 본(本)', 'bon', false, { x: 751, y: 547, w: 292, h: 32 }, { x: 803, y: 548, w: 89, h: 30, align: 'center' }, { x: 965, y: 548, w: 76, h: 30, align: 'center' }),
  surnameOrBon('surnameRevived', '② 부활된 성(姓)', 'surname', true, { x: 344, y: 581, w: 258, h: 32 }, { x: 396, y: 582, w: 79, h: 30, align: 'center' }, { x: 533, y: 582, w: 67, h: 30, align: 'center' }),
  surnameOrBon('bonRevived', '② 부활된 본(本)', 'bon', true, { x: 751, y: 581, w: 292, h: 32 }, { x: 803, y: 582, w: 89, h: 30, align: 'center' }, { x: 965, y: 582, w: 76, h: 30, align: 'center' }),

  // ── ③ 부활되는 (양)부모 ──────────────────────────────────
  nameField({ id: 'revivedFatherName', section: 'revived', koLabel: '③ 부활되는 (양)부 성명', who: RF, help: REVIVE_HELP, area: { x: 391, y: 614, w: 128, h: 54 }, box: { x: 427, y: 630, w: 90, h: 34, align: 'center' } }),
  originField({ id: 'revivedFatherOrigin', section: 'revived', koLabel: '③ (양)부 등록기준지', who: RF, area: { x: 661, y: 614, w: 382, h: 27 }, box: { x: 697, y: 615, w: 342, h: 25, align: 'center' } }),
  idField({ id: 'revivedFatherId', section: 'revived', koLabel: '③ (양)부 주민등록번호', who: RF, area: { x: 661, y: 642, w: 382, h: 26 }, front: { x: 697, y: 643, w: 146, h: 24, align: 'center' }, back: { x: 860, y: 643, w: 181, h: 24, align: 'center' } }),
  nameField({ id: 'revivedMotherName', section: 'revived', koLabel: '③ 부활되는 (양)모 성명', who: RM, help: REVIVE_HELP, area: { x: 391, y: 669, w: 128, h: 54 }, box: { x: 427, y: 685, w: 90, h: 34, align: 'center' } }),
  originField({ id: 'revivedMotherOrigin', section: 'revived', koLabel: '③ (양)모 등록기준지', who: RM, area: { x: 661, y: 669, w: 382, h: 27 }, box: { x: 697, y: 670, w: 342, h: 25, align: 'center' } }),
  idField({ id: 'revivedMotherId', section: 'revived', koLabel: '③ (양)모 주민등록번호', who: RM, area: { x: 661, y: 697, w: 382, h: 26 }, front: { x: 697, y: 698, w: 146, h: 24, align: 'center' }, back: { x: 860, y: 698, w: 181, h: 24, align: 'center' } }),

  // ── ④ 기타사항 ───────────────────────────────────────────
  otherNotesField({ id: 'otherNotes', section: 'etc', koLabel: '④ 기타사항', area: { x: 298, y: 724, w: 745, h: 33 }, box: { x: 334, y: 726, w: 705, h: 29 } }),

  // ── ⑤ 재판확정일자 ───────────────────────────────────────
  dateField({
    id: 'courtDate', section: 'court', koLabel: '⑤ 재판확정일자',
    label: { ko: '친양자 파양 재판 확정일', en: 'Date the dissolution judgment became final', zh: '罢养判决确定日期', ja: '離縁の裁判確定日', vi: 'Ngày bản án chấm dứt nhận nuôi có hiệu lực' },
    help: {
      ko: '이 신고서는 법원의 친양자 파양 재판이 확정되었을 때 내요. 재판이 확정된 날을 적어요.',
      en: 'This report is filed once the court judgment dissolving the full adoption has become final. Write the date it became final.',
      zh: '本申报书在法院的亲养子罢养判决确定后提交。填写判决确定的日期。',
      ja: 'この届出は、裁判所の特別養子離縁の裁判が確定したときに出します。裁判が確定した日を書きます。',
      vi: 'Tờ khai này nộp khi phán quyết chấm dứt nhận nuôi đặc biệt của tòa đã có hiệu lực. Ghi ngày phán quyết có hiệu lực.',
    },
    area: { x: 331, y: 758, w: 341, h: 32 },
    badge: 'margin',
    y: { x: 340, y: 760, w: 104, h: 28, align: 'right' },
    m: { x: 466, y: 760, w: 55, h: 28, align: 'right' },
    d: { x: 543, y: 760, w: 55, h: 28, align: 'right' },
  }),
  courtNameField({
    id: 'courtName', section: 'court', koLabel: '⑤ 법원명',
    help: { ko: '파양 재판을 한 법원 이름을 적어요.', en: 'Name of the court that gave the dissolution judgment.', zh: '填写作出罢养判决的法院名称。', ja: '離縁の裁判をした裁判所名を書きます。', vi: 'Tên tòa án đã xét xử việc chấm dứt nhận nuôi.' },
    area: { x: 762, y: 758, w: 281, h: 32 },
    box: { x: 798, y: 760, w: 241, h: 28, align: 'center' },
  }),

  // ── ⑥ 신고인 ─────────────────────────────────────────────
  reporterNameField({ id: 'reporterName', section: 'reporter', koLabel: '⑥ 신고인 성명', area: { x: 391, y: 791, w: 281, h: 38 }, box: { x: 427, y: 793, w: 118, h: 34, align: 'center' } }),
  idField({ id: 'reporterId', section: 'reporter', koLabel: '⑥ 신고인 주민등록번호', who: WHO.reporter, area: { x: 820, y: 791, w: 223, h: 38 }, front: { x: 856, y: 793, w: 67, h: 34, align: 'center' }, back: { x: 940, y: 793, w: 101, h: 34, align: 'center' } }),
  {
    id: 'reporterQualification',
    section: 'reporter',
    koLabel: '⑥ 신고인 자격',
    label: { ko: '신고인 자격', en: 'Capacity of the person reporting', zh: '申报人资格', ja: '届出人の資格', vi: 'Tư cách người khai báo' },
    help: {
      ko: '친양자 파양 재판이 확정되면 소송을 낸 사람이나 그 상대방이 혼자 신고할 수 있어요. 해당하는 자격을 골라요.',
      en: 'Once the dissolution judgment is final, the person who filed the lawsuit or the opposing party may report alone. Choose the applicable capacity.',
      zh: '亲养子罢养判决确定后，起诉人或其相对方可以单独申报。选择相应的资格。',
      ja: '特別養子離縁の裁判が確定すると、訴えを提起した者またはその相手方が単独で届け出ることができます。該当する資格を選びます。',
      vi: 'Khi phán quyết chấm dứt nhận nuôi đặc biệt có hiệu lực, người khởi kiện hoặc bên bị kiện có thể tự khai báo. Chọn tư cách phù hợp.',
    },
    area: { x: 391, y: 830, w: 652, h: 26 },
    badge: 'margin',
    input: {
      kind: 'choice',
      mark: 'circle',
      options: [
        opt('plaintiff', '소 제기자', { ko: '소송을 낸 사람', en: 'Person who filed the lawsuit', zh: '提起诉讼者', ja: '訴えを提起した者', vi: 'Người khởi kiện' }, 404, 843),
        opt('defendant', '소의 상대방', { ko: '소송의 상대방', en: 'Opposing party in the lawsuit', zh: '诉讼相对方', ja: '訴えの相手方', vi: 'Bên bị kiện' }, 547, 843),
        opt('other', '기타', { ko: '기타', en: 'Other', zh: '其他', ja: 'その他', vi: 'Khác' }, 700, 843),
      ],
      extra: { ...OTHER_DETAIL, when: ['other'], box: { x: 829, y: 831, w: 184, h: 24, align: 'center' } },
    },
  },
  addressField({ id: 'reporterAddress', section: 'reporter', koLabel: '⑥ 신고인 주소', who: WHO.reporter, area: { x: 391, y: 857, w: 652, h: 32 }, box: { x: 427, y: 859, w: 612, h: 28, align: 'center' } }),
  phoneField({ id: 'reporterPhone', section: 'reporter', koLabel: '⑥ 전화', area: { x: 391, y: 890, w: 281, h: 32 }, box: { x: 427, y: 892, w: 241, h: 28, align: 'center' } }),
  emailField({ id: 'reporterEmail', section: 'reporter', koLabel: '⑥ 이메일', area: { x: 762, y: 890, w: 281, h: 32 }, box: { x: 798, y: 892, w: 241, h: 28, align: 'center' } }),

  // ── ⑦ 제출인 ─────────────────────────────────────────────
  submitterNameField({ id: 'submitterName', section: 'submitter', koLabel: '⑦ 제출인 성명', area: { x: 391, y: 925, w: 281, h: 35 }, box: { x: 427, y: 927, w: 241, h: 31, align: 'center' } }),
  submitterIdField({ id: 'submitterId', section: 'submitter', koLabel: '⑦ 제출인 주민등록번호', area: { x: 814, y: 925, w: 229, h: 35 }, front: { x: 850, y: 927, w: 69, h: 31, align: 'center' }, back: { x: 937, y: 927, w: 104, h: 31, align: 'center' } }),
];

export const fullAdoptionDissolutionReport: FormDef = {
  id: 'full-adoption-dissolution-report',
  title: { ko: '친양자 파양신고서', en: 'Full Adoption Dissolution', zh: '亲养子罢养申报书', ja: '特別養子離縁届', vi: 'Đơn chấm dứt nhận nuôi đặc biệt' },
  pages: [{ image: '/forms/full-adoption-dissolution-report_ko.png', width: 1190, height: 1682 }],
  sections: [
    { id: 'meta',      label: { ko: '신고일',               en: 'Report date',              zh: '申报日期',        ja: '届出日',           vi: 'Ngày khai báo' } },
    { id: 'parents',   label: { ko: '① 양친',               en: '① Adoptive parents',       zh: '① 养父母',        ja: '① 養親',           vi: '① Cha mẹ nuôi' } },
    { id: 'child',     label: { ko: '② 친양자',             en: '② Fully adopted child',    zh: '② 亲养子女',      ja: '② 特別養子',       vi: '② Con nuôi đặc biệt' } },
    { id: 'revived',   label: { ko: '③ 부활되는 (양)부모',  en: '③ Restored (adoptive) parents', zh: '③ 恢复的（养）父母', ja: '③ 復活する（養）父母', vi: '③ Cha mẹ (nuôi) được khôi phục' } },
    { id: 'etc',       label: { ko: '④ 기타사항',           en: '④ Other notes',            zh: '④ 其他事项',      ja: '④ その他事項',     vi: '④ Ghi chú khác' } },
    { id: 'court',     label: { ko: '⑤ 재판확정일자',       en: '⑤ Court judgment',         zh: '⑤ 判决确定',      ja: '⑤ 裁判確定',       vi: '⑤ Phán quyết của tòa' } },
    { id: 'reporter',  label: { ko: '⑥ 신고인',             en: '⑥ Person reporting',       zh: '⑥ 申报人',        ja: '⑥ 届出人',         vi: '⑥ Người khai báo' } },
    { id: 'submitter', label: { ko: '⑦ 제출인',             en: '⑦ Submitter',              zh: '⑦ 提交人',        ja: '⑦ 提出人',         vi: '⑦ Người nộp thay' } },
  ],
  fields,
};
