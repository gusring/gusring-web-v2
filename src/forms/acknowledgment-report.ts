import {
  addressField, bonField, birthDateField, COURT_NAME_LABEL, dateField, emailField, hanjaSplitField, idField, nameField,
  nameSplitField, opt, originField, otherNotesField, OTHER_DETAIL, phoneField, reportDateField, reporterNameField,
  sexField, submitterIdField, submitterNameField, textField, Who, WHO,
} from './common';
import { Box, ChoiceOption, FieldDef, FormDef, L } from './types';

// ─────────────────────────────────────────────────────────────
// 인지(친권자지정)신고서 [양식 제2호] — v1 서식 3번
// 좌표는 public/forms/acknowledgment-report_ko.png (1190×1682) 기준.
// 안내 문구는 뒷면 「작성 방법」(v1 guides_ko_3)을 바탕으로 작성.
// ─────────────────────────────────────────────────────────────

const CHILD: Who = { ko: '인지되는 자녀', en: 'the child being acknowledged', zh: '被认领子女', ja: '被認知者', vi: 'người con được nhận' };
const ACK: Who = { ko: '인지하는 사람', en: 'the person acknowledging', zh: '认领人', ja: '認知者', vi: 'người nhận con' };
const CUSTODIAN: Who = { ko: '친권자', en: 'the person with parental authority', zh: '亲权人', ja: '親権者', vi: 'người có thân quyền' };
const CONSENTER: Who = { ko: '동의하는 성년후견인', en: 'the consenting adult guardian', zh: '表示同意的成年监护人', ja: '同意する成年後見人', vi: 'người giám hộ người thành niên đồng ý' };

const CHILD_NAME_HELP: L = {
  ko: '인지되는 자녀의 이름을 한글로 적어요. 외국인이면 여권·외국인등록증의 이름을 한글로 옮겨 적어요. 아직 태어나지 않은 아기(태아)를 인지할 때는 "임신 ○개월 중의 태아"라고 적고, 이름이 있으면 이름도 적어요.',
  en: 'Name of the child in Korean letters (Hangul). For a foreign national, transcribe the passport / residence card name into Hangul. To acknowledge an unborn child, write "임신 ○개월 중의 태아" (fetus in the ○th month of pregnancy), and the name too if there is one.',
  zh: '用韩文填写被认领子女的姓名。外国人请将护照/外国人登录证上的姓名按发音写成韩文。认领尚未出生的胎儿时，写“임신 ○개월 중의 태아”（怀孕○个月的胎儿），如有姓名也一并填写。',
  ja: '被認知者の氏名をハングルで書きます。外国人の場合、パスポート・外国人登録証の氏名をハングル表記で書きます。まだ生まれていない子（胎児）を認知する場合は「妊娠○か月の胎児」という意味の韓国語を書き、氏名があれば氏名も書きます。',
  vi: 'Họ tên người con bằng chữ Hàn (Hangul). Nếu là người nước ngoài, phiên âm tên trên hộ chiếu / thẻ người nước ngoài sang Hangul. Nếu nhận thai nhi chưa sinh, ghi "임신 ○개월 중의 태아" (thai nhi ○ tháng), và ghi cả tên nếu đã có.',
};

const MOTHER_ONLY_IF_FATHER: L = {
  ko: ' 아버지가 인지하는 경우에만 적어요.',
  en: ' Fill in only when the father is the one acknowledging.',
  zh: '仅在由父亲认领时填写。',
  ja: '父が認知する場合のみ書きます。',
  vi: ' Chỉ ghi khi người nhận con là bố.',
};

const COURT_CAUSE = (y1: number, y2: number, courtBox: Box): { options: ChoiceOption[]; extra: NonNullable<Extract<FieldDef['input'], { kind: 'choice' }>['extra']> } => ({
  options: [
    opt('agreement', '협의', { ko: '협의', en: 'Agreement', zh: '协议', ja: '協議', vi: 'Thỏa thuận' }, 719, y1),
    opt('court', '법원의 재판', { ko: '법원의 재판', en: 'Court judgment', zh: '法院判决', ja: '裁判所の裁判', vi: 'Phán quyết của tòa án' }, 719, y2),
  ],
  extra: {
    key: 'court',
    when: ['court'],
    box: courtBox,
    korean: true,
    label: { ...COURT_NAME_LABEL, ko: '재판한 법원 이름' },
    placeholder: '예) 서울가정',
  },
});

/** 피인지자 성명 칸은 「(성) / (명)」이 검은 글씨로 인쇄돼 있어 그 아래 줄에 쓴다 */
const fields: FieldDef[] = [
  reportDateField(
    { x: 150, y: 170, w: 405, h: 30 },
    { x: 200, y: 172, w: 86, h: 26, align: 'right' },
    { x: 312, y: 172, w: 73, h: 26, align: 'right' },
    { x: 410, y: 172, w: 74, h: 26, align: 'right' },
  ),

  // ── ① 피인지자 ───────────────────────────────────────────
  nameSplitField({
    id: 'childName', section: 'child', koLabel: '① 피인지자 성명 (한글)', who: CHILD, help: CHILD_NAME_HELP,
    area: { x: 331, y: 206, w: 183, h: 85 },
    surname: { x: 333, y: 262, w: 68, h: 27, align: 'center' },
    given: { x: 405, y: 262, w: 107, h: 27, align: 'center' },
  }),
  hanjaSplitField({
    id: 'childHanja', section: 'child', koLabel: '① 피인지자 성명 (한자)', who: CHILD,
    area: { x: 331, y: 292, w: 183, h: 84 },
    surname: { x: 333, y: 347, w: 68, h: 27, align: 'center' },
    given: { x: 405, y: 347, w: 107, h: 27, align: 'center' },
  }),
  bonField({
    id: 'childBon', section: 'child', koLabel: '① 본(한자)', who: CHILD,
    area: { x: 584, y: 206, w: 104, h: 170 },
    box: { x: 588, y: 270, w: 98, h: 44, align: 'center' },
  }),
  sexField({
    id: 'childSex', section: 'child', koLabel: '① 성별', who: CHILD,
    area: { x: 816, y: 206, w: 229, h: 57 },
    male: { x: 881, y: 234 }, female: { x: 958, y: 234 },
  }),
  idField({
    id: 'childId', section: 'child', koLabel: '① 주민등록번호', who: CHILD,
    area: { x: 816, y: 264, w: 229, h: 55 },
    front: { x: 852, y: 267, w: 72, h: 49, align: 'center' },
    back: { x: 939, y: 267, w: 103, h: 49, align: 'center' },
  }),
  birthDateField({
    id: 'childBirth', section: 'child', koLabel: '① 출생연월일', who: CHILD,
    area: { x: 816, y: 320, w: 229, h: 56 },
    box: { x: 852, y: 323, w: 190, h: 50, align: 'center' },
  }),
  originField({
    id: 'childOrigin', section: 'child', koLabel: '① 등록기준지', who: CHILD,
    area: { x: 331, y: 377, w: 714, h: 55 },
    box: { x: 368, y: 380, w: 672, h: 49, align: 'center' },
  }),
  addressField({
    id: 'childAddress', section: 'child', koLabel: '① 주소', who: CHILD,
    area: { x: 331, y: 433, w: 714, h: 55 },
    box: { x: 368, y: 436, w: 672, h: 49, align: 'center' },
  }),
  nameField({
    id: 'motherName', section: 'child', koLabel: '① 모의 성명', who: WHO.mother,
    help: {
      ko: '인지되는 자녀의 어머니 이름을 한글로 적어요.' + MOTHER_ONLY_IF_FATHER.ko,
      en: 'Name of the child’s mother in Korean letters.' + MOTHER_ONLY_IF_FATHER.en,
      zh: '用韩文填写被认领子女母亲的姓名。' + MOTHER_ONLY_IF_FATHER.zh,
      ja: '被認知者の母の氏名をハングルで書きます。' + MOTHER_ONLY_IF_FATHER.ja,
      vi: 'Họ tên mẹ của người con, bằng chữ Hàn.' + MOTHER_ONLY_IF_FATHER.vi,
    },
    area: { x: 492, y: 489, w: 182, h: 48 },
    box: { x: 528, y: 492, w: 144, h: 42, align: 'center' },
  }),
  {
    ...idField({
      id: 'motherId', section: 'child', koLabel: '① 모의 주민등록번호', who: WHO.mother,
      area: { x: 816, y: 489, w: 229, h: 48 },
      front: { x: 852, y: 492, w: 72, h: 42, align: 'center' },
      back: { x: 939, y: 492, w: 103, h: 42, align: 'center' },
    }),
  },
  originField({
    id: 'motherOrigin', section: 'child', koLabel: '① 모의 등록기준지', who: WHO.mother,
    area: { x: 492, y: 538, w: 553, h: 47 },
    box: { x: 528, y: 541, w: 512, h: 41, align: 'center' },
  }),

  // ── ② 인지자 ─────────────────────────────────────────────
  nameSplitField({
    id: 'ackName', section: 'ack', koLabel: '② 인지자 성명 (한글)', who: ACK,
    area: { x: 331, y: 586, w: 321, h: 60 },
    surname: { x: 372, y: 595, w: 64, h: 42, align: 'center' },
    given: { x: 496, y: 595, w: 154, h: 42, align: 'center' },
  }),
  hanjaSplitField({
    id: 'ackHanja', section: 'ack', koLabel: '② 인지자 성명 (한자)', who: ACK,
    area: { x: 331, y: 647, w: 321, h: 63 },
    surname: { x: 372, y: 657, w: 64, h: 44, align: 'center' },
    given: { x: 496, y: 657, w: 154, h: 44, align: 'center' },
  }),
  idField({
    id: 'ackId', section: 'ack', koLabel: '② 인지자 주민등록번호', who: ACK,
    area: { x: 755, y: 586, w: 290, h: 124 },
    front: { x: 790, y: 627, w: 88, h: 42, align: 'center' },
    back: { x: 893, y: 627, w: 148, h: 42, align: 'center' },
  }),
  originField({
    id: 'ackOrigin', section: 'ack', koLabel: '② 인지자 등록기준지', who: ACK,
    area: { x: 331, y: 711, w: 714, h: 52 },
    box: { x: 368, y: 714, w: 672, h: 46, align: 'center' },
  }),

  // ── ③ 인지판결확정일자 ───────────────────────────────────
  textField({
    id: 'judgmentType', section: 'judgment', koLabel: '③ 인지판결확정일자 ( )',
    label: { ko: '조정·화해로 인지한 경우 그 종류', en: 'If by mediation / settlement: its type', zh: '经调解·和解认领时的种类', ja: '調停・和解による場合の種類', vi: 'Nếu qua hòa giải: loại hòa giải' },
    help: {
      ko: '조정이나 화해로 인지가 정해진 경우에만 골라요. 판결이 확정된 경우에는 비워 두세요.',
      en: 'Only if the acknowledgment was settled by mediation or reconciliation. Leave blank if it was by a final judgment.',
      zh: '仅在通过调解或和解确定认领时选择。判决确定的情况请留空。',
      ja: '調停や和解によって認知が決まった場合のみ選びます。判決が確定した場合は空欄にします。',
      vi: 'Chỉ chọn khi việc nhận con được quyết định qua hòa giải. Nếu là bản án có hiệu lực thì để trống.',
    },
    area: { x: 144, y: 764, w: 280, h: 67 },
    badge: 'margin',
    part: {
      box: { x: 178, y: 801, w: 219, h: 25, align: 'center' },
      options: [
        { value: '조정성립', label: { ko: '조정성립', en: 'Mediation concluded', zh: '调解成立', ja: '調停成立', vi: 'Hòa giải thành' } },
        { value: '조정에 갈음하는 결정확정', label: { ko: '조정에 갈음하는 결정확정', en: 'Decision in lieu of mediation became final', zh: '代替调解的决定确定', ja: '調停に代わる決定確定', vi: 'Quyết định thay hòa giải có hiệu lực' } },
        { value: '화해성립', label: { ko: '화해성립', en: 'Settlement concluded', zh: '和解成立', ja: '和解成立', vi: 'Hòa giải (thỏa thuận) thành' } },
        { value: '화해권고 결정확정', label: { ko: '화해권고 결정확정', en: 'Recommended-settlement decision became final', zh: '和解劝告决定确定', ja: '和解勧告決定確定', vi: 'Quyết định khuyến nghị hòa giải có hiệu lực' } },
      ],
    },
  }),
  dateField({
    id: 'judgmentDate', section: 'judgment', koLabel: '③ 인지판결확정일자',
    label: { ko: '판결 확정일 (또는 조정·화해 성립일)', en: 'Date the judgment became final (or mediation / settlement date)', zh: '判决确定日（或调解·和解成立日）', ja: '判決確定日（または調停・和解の成立日）', vi: 'Ngày bản án có hiệu lực (hoặc ngày hòa giải thành)' },
    help: {
      ko: '법원의 인지 재판이 확정되어 신고하는 경우에만 적어요. 조정·화해로 정해졌다면 그것이 성립(확정)된 날을 적어요.',
      en: 'Only when reporting because a court judgment of acknowledgment became final. If settled by mediation or reconciliation, write the date it was concluded (became final).',
      zh: '仅在因法院认领判决确定而申报时填写。如通过调解·和解确定，填写其成立（确定）日期。',
      ja: '裁判所の認知の裁判が確定して届け出る場合のみ書きます。調停・和解で決まった場合は、その成立（確定）日を書きます。',
      vi: 'Chỉ ghi khi khai báo vì bản án nhận con của tòa đã có hiệu lực. Nếu qua hòa giải, ghi ngày hòa giải thành (có hiệu lực).',
    },
    area: { x: 425, y: 764, w: 311, h: 67 },
    y: { x: 462, y: 776, w: 74, h: 42, align: 'right' },
    m: { x: 562, y: 776, w: 52, h: 42, align: 'right' },
    d: { x: 639, y: 776, w: 52, h: 42, align: 'right' },
  }),
  textField({
    id: 'judgmentCourt', section: 'judgment', koLabel: '③ 법원명',
    label: COURT_NAME_LABEL,
    help: {
      ko: '재판한 법원 이름을 적어요. 서식에 "법원"이 이미 인쇄돼 있어서 그 앞부분만 적으면 돼요. 예) 서울가정',
      en: 'Name of the court. "법원" (court) is already printed, so write only the part before it, e.g., 서울가정',
      zh: '填写作出判决的法院名称。表格上已印有“법원”（法院），只需填写前面部分。例：서울가정',
      ja: '裁判をした裁判所名を書きます。「法院（裁判所）」は印刷済みなので、その前の部分だけ韓国語で書きます。',
      vi: 'Tên tòa án đã xét xử. Chữ "법원" (tòa án) đã in sẵn nên chỉ ghi phần phía trước, VD: 서울가정',
    },
    area: { x: 824, y: 764, w: 221, h: 67 },
    part: { box: { x: 859, y: 776, w: 122, h: 42, align: 'center' }, korean: true, placeholder: '예) 서울가정' },
  }),

  // ── ④ 동의자 ─────────────────────────────────────────────
  nameField({
    id: 'consenterName', section: 'consent', koLabel: '④ 동의자(성년후견인) 성명', who: CONSENTER,
    help: {
      ko: '인지하는 사람이 피성년후견인일 때만 적어요. 동의하는 성년후견인의 이름을 적고, 서명이나 도장은 출력한 종이에 직접 해요.',
      en: 'Only if the person acknowledging is under adult guardianship. Write the consenting adult guardian’s name; they sign or stamp by hand on the printed paper.',
      zh: '仅在认领人为被成年监护人时填写。填写表示同意的成年监护人的姓名，签名或盖章请在打印出的纸上亲自完成。',
      ja: '認知者が被成年後見人の場合のみ書きます。同意する成年後見人の氏名を書き、署名・押印は印刷した紙に直接します。',
      vi: 'Chỉ ghi khi người nhận con là người được giám hộ thành niên. Ghi tên người giám hộ đồng ý; người đó ký tên hoặc đóng dấu trực tiếp trên giấy đã in.',
    },
    area: { x: 331, y: 832, w: 321, h: 74 },
    box: { x: 368, y: 849, w: 176, h: 40, align: 'center' },
  }),
  idField({
    id: 'consenterId', section: 'consent', koLabel: '④ 동의자 주민등록번호', who: CONSENTER,
    area: { x: 755, y: 832, w: 290, h: 74 },
    front: { x: 790, y: 849, w: 104, h: 40, align: 'center' },
    back: { x: 908, y: 849, w: 134, h: 40, align: 'center' },
  }),

  // ── ⑤ 친권자 ─────────────────────────────────────────────
  {
    id: 'custodianWho',
    section: 'custody',
    koLabel: '⑤ 친권자',
    label: { ko: '친권자', en: 'Who has parental authority', zh: '亲权人', ja: '親権者', vi: 'Người có thân quyền' },
    help: {
      ko: '인지되는 자녀의 친권자가 정해진 경우에만 적어요. 누가 친권자인지 골라요.',
      en: 'Only if the person with parental authority over the child has been decided. Choose who it is.',
      zh: '仅在已确定被认领子女的亲权人时填写。选择谁是亲权人。',
      ja: '被認知者の親権者が定められた場合のみ書きます。誰が親権者かを選びます。',
      vi: 'Chỉ ghi khi đã xác định người có thân quyền đối với người con. Chọn người đó.',
    },
    area: { x: 144, y: 907, w: 209, h: 111 },
    input: {
      kind: 'choice',
      mark: 'circle',
      options: [
        opt('father', '부', { ko: '부 (아버지)', en: 'Father', zh: '父亲', ja: '父', vi: 'Bố' }, 261, 948),
        opt('mother', '모', { ko: '모 (어머니)', en: 'Mother', zh: '母亲', ja: '母', vi: 'Mẹ' }, 318, 948),
        opt('both', '부모', { ko: '부모 (두 분 모두)', en: 'Both parents', zh: '父母双方', ja: '父母', vi: 'Cả bố và mẹ' }, 260, 977),
      ],
    },
  },
  nameField({
    id: 'custodian1Name', section: 'custody', koLabel: '⑤ 친권자 성명 (첫째 줄)', who: CUSTODIAN,
    area: { x: 428, y: 907, w: 224, h: 55 },
    box: { x: 464, y: 910, w: 185, h: 49, align: 'center' },
  }),
  idField({
    id: 'custodian1Id', section: 'custody', koLabel: '⑤ 친권자 주민등록번호 (첫째 줄)', who: CUSTODIAN,
    area: { x: 755, y: 907, w: 290, h: 55 },
    front: { x: 790, y: 912, w: 104, h: 45, align: 'center' },
    back: { x: 908, y: 912, w: 134, h: 45, align: 'center' },
  }),
  nameField({
    id: 'custodian2Name', section: 'custody', koLabel: '⑤ 친권자 성명 (둘째 줄)', who: CUSTODIAN,
    help: {
      ko: '부모 두 분이 모두 친권자일 때 두 번째 사람의 이름을 적어요.',
      en: 'If both parents have parental authority, the second person’s name.',
      zh: '父母双方均为亲权人时，填写第二个人的姓名。',
      ja: '父母の両方が親権者の場合、2人目の氏名を書きます。',
      vi: 'Nếu cả bố và mẹ cùng có thân quyền, ghi tên người thứ hai.',
    },
    area: { x: 428, y: 963, w: 224, h: 55 },
    box: { x: 464, y: 966, w: 185, h: 49, align: 'center' },
  }),
  idField({
    id: 'custodian2Id', section: 'custody', koLabel: '⑤ 친권자 주민등록번호 (둘째 줄)', who: CUSTODIAN,
    area: { x: 755, y: 963, w: 290, h: 55 },
    front: { x: 790, y: 968, w: 104, h: 45, align: 'center' },
    back: { x: 908, y: 968, w: 134, h: 45, align: 'center' },
  }),
  dateField({
    id: 'custodyDate', section: 'custody', koLabel: '⑤ 지정일자',
    label: { ko: '친권자 지정일', en: 'Date parental authority was designated', zh: '亲权人指定日期', ja: '親権者指定日', vi: 'Ngày xác định thân quyền' },
    help: {
      ko: '협의로 정했으면 협의한 날, 법원의 재판으로 정해졌으면 재판이 확정된 날을 적어요.',
      en: 'If decided by agreement, the date of the agreement; if by a court judgment, the date the judgment became final.',
      zh: '通过协议确定的，填写协议日期；通过法院判决确定的，填写判决确定日期。',
      ja: '協議で定めた場合は協議した日、裁判所の裁判で定まった場合は裁判が確定した日を書きます。',
      vi: 'Nếu do thỏa thuận, ghi ngày thỏa thuận; nếu do phán quyết của tòa, ghi ngày phán quyết có hiệu lực.',
    },
    area: { x: 331, y: 1019, w: 284, h: 63 },
    y: { x: 366, y: 1030, w: 70, h: 42, align: 'right' },
    m: { x: 462, y: 1030, w: 42, h: 42, align: 'right' },
    d: { x: 528, y: 1030, w: 42, h: 42, align: 'right' },
  }),
  {
    id: 'custodyCause',
    section: 'custody',
    koLabel: '⑤ 지정원인',
    label: { ko: '친권자를 정한 방법', en: 'How parental authority was designated', zh: '亲权人指定方式', ja: '親権者を定めた方法', vi: 'Cách xác định thân quyền' },
    help: {
      ko: '협의로 정했는지, 법원의 재판으로 정해졌는지 골라요. 법원의 재판이면 그 법원 이름을 적어요.',
      en: 'Choose whether it was decided by agreement or by a court judgment. If by a court, write the court’s name.',
      zh: '选择是通过协议还是法院判决确定的。如为法院判决，请填写该法院名称。',
      ja: '協議で定めたか、裁判所の裁判で定まったかを選びます。裁判の場合はその裁判所名を書きます。',
      vi: 'Chọn do thỏa thuận hay do phán quyết của tòa. Nếu do tòa, ghi tên tòa án.',
    },
    area: { x: 695, y: 1019, w: 350, h: 63 },
    badge: 'margin',
    input: { kind: 'choice', mark: 'circle', ...COURT_CAUSE(1036, 1066, { x: 750, y: 1057, w: 153, h: 20, align: 'center' }) },
  },

  // ── ⑥ 성·본 계속사용 ─────────────────────────────────────
  dateField({
    id: 'surnameDate', section: 'surname', koLabel: '⑥ 성·본 계속사용 원인일자',
    label: { ko: '성·본을 계속 쓰기로 정한 날', en: 'Date it was decided to keep the surname and bon', zh: '决定继续使用姓·本的日期', ja: '姓・本の継続使用を定めた日', vi: 'Ngày quyết định giữ nguyên họ và bon' },
    help: {
      ko: '혼인 외의 자녀가 인지되면 자녀의 성·본은 아버지의 성·본으로 바뀌어요. 다만 부모가 협의하거나 법원의 허가를 받으면 원래 성·본을 계속 쓸 수 있어요. 그렇게 정한 경우에만 그 날짜를 적어요.',
      en: 'When a child born outside marriage is acknowledged, the child’s surname and bon change to the father’s. However, with the parents’ agreement or the court’s permission, the child may keep the previous surname and bon. Only in that case, write the date it was decided.',
      zh: '非婚生子女被认领后，子女的姓·本会改为父亲的姓·本。但经父母协议或法院许可，可以继续使用原来的姓·本。仅在如此决定时填写该日期。',
      ja: '婚姻外の子が認知されると、子の姓・本は父の姓・本に変わります。ただし父母の協議または裁判所の許可を得れば、従前の姓・本を引き続き使えます。そう定めた場合のみ、その日付を書きます。',
      vi: 'Khi con ngoài hôn nhân được nhận, họ và bon của con đổi theo bố. Tuy nhiên, nếu bố mẹ thỏa thuận hoặc được tòa cho phép, con có thể giữ nguyên họ và bon cũ. Chỉ ghi ngày quyết định trong trường hợp đó.',
    },
    area: { x: 331, y: 1083, w: 284, h: 66 },
    y: { x: 366, y: 1095, w: 70, h: 42, align: 'right' },
    m: { x: 462, y: 1095, w: 42, h: 42, align: 'right' },
    d: { x: 528, y: 1095, w: 42, h: 42, align: 'right' },
  }),
  {
    id: 'surnameCause',
    section: 'surname',
    koLabel: '⑥ 성·본 계속사용 원인',
    label: { ko: '성·본을 계속 쓰기로 한 방법', en: 'How it was decided to keep the surname and bon', zh: '继续使用姓·本的决定方式', ja: '姓・本の継続使用を定めた方法', vi: 'Cách quyết định giữ nguyên họ và bon' },
    help: {
      ko: '부모가 협의했는지, 법원의 재판(허가)으로 정해졌는지 골라요. 법원이면 그 법원 이름을 적어요.',
      en: 'Choose whether the parents agreed or a court decided (permitted). If a court, write its name.',
      zh: '选择是父母协议，还是由法院判决（许可）确定。如为法院，请填写法院名称。',
      ja: '父母が協議したか、裁判所の裁判（許可）で定まったかを選びます。裁判所の場合はその名称を書きます。',
      vi: 'Chọn bố mẹ thỏa thuận hay tòa án quyết định (cho phép). Nếu là tòa án, ghi tên tòa.',
    },
    area: { x: 695, y: 1083, w: 350, h: 66 },
    badge: 'margin',
    input: { kind: 'choice', mark: 'circle', ...COURT_CAUSE(1100, 1131, { x: 750, y: 1122, w: 153, h: 20, align: 'center' }) },
  },

  // ── ⑦ 기타사항 ───────────────────────────────────────────
  otherNotesField({
    id: 'otherNotes', section: 'etc', koLabel: '⑦ 기타사항',
    extra: {
      ko: '예) 사망한 자녀를 인지하는 경우 그 사망연월일, 유언으로 인지하는 경우 그 취지와 유언집행자가 취임한 날 등.',
      en: 'e.g., when acknowledging a child who has died, the date of death; when acknowledging by will, its purport and the date the executor took office.',
      zh: '例：认领已死亡子女时的死亡日期；遗嘱认领时的遗嘱宗旨及遗嘱执行人就任日期等。',
      ja: '例）死亡した子を認知する場合はその死亡年月日、遺言による認知の場合はその趣旨と遺言執行者の就任年月日など。',
      vi: 'VD: khi nhận người con đã mất, ghi ngày mất; khi nhận con theo di chúc, ghi nội dung và ngày người thi hành di chúc nhận nhiệm vụ.',
    },
    area: { x: 331, y: 1150, w: 714, h: 73 },
    box: { x: 368, y: 1164, w: 672, h: 46 },
  }),

  // ── ⑧ 신고인 ─────────────────────────────────────────────
  reporterNameField({
    id: 'reporterName', section: 'reporter', koLabel: '⑧ 신고인 성명',
    area: { x: 331, y: 1224, w: 348, h: 65 },
    box: { x: 368, y: 1236, w: 196, h: 42, align: 'center' },
  }),
  idField({
    id: 'reporterId', section: 'reporter', koLabel: '⑧ 신고인 주민등록번호', who: WHO.reporter,
    area: { x: 837, y: 1224, w: 208, h: 65 },
    front: { x: 872, y: 1236, w: 63, h: 42, align: 'center' },
    back: { x: 948, y: 1236, w: 94, h: 42, align: 'center' },
  }),
  {
    id: 'reporterQualification',
    section: 'reporter',
    koLabel: '⑧ 신고인 자격',
    label: { ko: '신고인 자격', en: 'Capacity of the person reporting', zh: '申报人资格', ja: '届出人の資格', vi: 'Tư cách người khai báo' },
    help: {
      ko: '신고하는 사람의 자격을 골라요.',
      en: 'Choose the capacity of the person reporting.',
      zh: '选择申报人的资格。',
      ja: '届出人の資格を選びます。',
      vi: 'Chọn tư cách của người khai báo.',
    },
    area: { x: 331, y: 1290, w: 714, h: 84 },
    badge: 'margin',
    input: {
      kind: 'choice',
      mark: 'circle',
      options: [
        opt('father', '부', { ko: '부 (아버지)', en: 'Father', zh: '父亲', ja: '父', vi: 'Bố' }, 356, 1314),
        opt('mother', '모', { ko: '모 (어머니)', en: 'Mother', zh: '母亲', ja: '母', vi: 'Mẹ' }, 443, 1314),
        opt('executor', '유언집행자', { ko: '유언집행자', en: 'Executor of the will', zh: '遗嘱执行人', ja: '遺言執行者', vi: 'Người thi hành di chúc' }, 530, 1314),
        opt('plaintiff', '소 제기자', { ko: '소송을 낸 사람', en: 'Person who filed the lawsuit', zh: '提起诉讼者', ja: '訴えを提起した者', vi: 'Người khởi kiện' }, 706, 1314),
        opt('defendant', '소의 상대방', { ko: '소송의 상대방', en: 'Opposing party in the lawsuit', zh: '诉讼相对方', ja: '訴えの相手方', vi: 'Bên bị kiện' }, 872, 1314),
        opt('other', '기타', { ko: '기타', en: 'Other', zh: '其他', ja: 'その他', vi: 'Khác' }, 356, 1350),
      ],
      extra: { ...OTHER_DETAIL, when: ['other'], box: { x: 485, y: 1339, w: 290, h: 24, align: 'center' } },
    },
  },
  addressField({
    id: 'reporterAddress', section: 'reporter', koLabel: '⑧ 신고인 주소', who: WHO.reporter,
    area: { x: 331, y: 1375, w: 714, h: 64 },
    box: { x: 368, y: 1380, w: 672, h: 54, align: 'center' },
  }),
  phoneField({
    id: 'reporterPhone', section: 'reporter', koLabel: '⑧ 전화',
    area: { x: 331, y: 1440, w: 321, h: 57 },
    box: { x: 368, y: 1446, w: 280, h: 45, align: 'center' },
  }),
  emailField({
    id: 'reporterEmail', section: 'reporter', koLabel: '⑧ 이메일',
    area: { x: 795, y: 1440, w: 250, h: 57 },
    box: { x: 831, y: 1446, w: 211, h: 45, align: 'center' },
  }),

  // ── ⑨ 제출인 ─────────────────────────────────────────────
  submitterNameField({
    id: 'submitterName', section: 'submitter', koLabel: '⑨ 제출인 성명',
    area: { x: 431, y: 1500, w: 221, h: 51 },
    box: { x: 467, y: 1503, w: 182, h: 45, align: 'center' },
  }),
  submitterIdField({
    id: 'submitterId', section: 'submitter', koLabel: '⑨ 제출인 주민등록번호',
    area: { x: 795, y: 1500, w: 250, h: 51 },
    front: { x: 830, y: 1503, w: 84, h: 45, align: 'center' },
    back: { x: 928, y: 1503, w: 114, h: 45, align: 'center' },
  }),
];

export const acknowledgmentReport: FormDef = {
  id: 'acknowledgment-report',
  title: { ko: '인지(친권자 지정)신고서', en: 'Acknowledgment Report', zh: '认知申报书', ja: '認知届', vi: 'Đơn báo cáo nhận con' },
  pages: [{ image: '/forms/acknowledgment-report_ko.png', width: 1190, height: 1682 }],
  sections: [
    { id: 'meta',      label: { ko: '신고일',              en: 'Report date',               zh: '申报日期',       ja: '届出日',             vi: 'Ngày khai báo' } },
    { id: 'child',     label: { ko: '① 피인지자',          en: '① Child acknowledged',      zh: '① 被认领人',     ja: '① 被認知者',         vi: '① Người con được nhận' } },
    { id: 'ack',       label: { ko: '② 인지자',            en: '② Person acknowledging',    zh: '② 认领人',       ja: '② 認知者',           vi: '② Người nhận con' } },
    { id: 'judgment',  label: { ko: '③ 인지판결',          en: '③ Court judgment',          zh: '③ 认领判决',     ja: '③ 認知判決',         vi: '③ Bản án nhận con' } },
    { id: 'consent',   label: { ko: '④ 동의자',            en: '④ Consenting guardian',     zh: '④ 同意人',       ja: '④ 同意者',           vi: '④ Người đồng ý' } },
    { id: 'custody',   label: { ko: '⑤ 친권자',            en: '⑤ Parental authority',      zh: '⑤ 亲权人',       ja: '⑤ 親権者',           vi: '⑤ Thân quyền' } },
    { id: 'surname',   label: { ko: '⑥ 성·본 계속사용',    en: '⑥ Keeping surname & bon',   zh: '⑥ 继续使用姓·本', ja: '⑥ 姓・本の継続使用', vi: '⑥ Giữ nguyên họ & bon' } },
    { id: 'etc',       label: { ko: '⑦ 기타사항',          en: '⑦ Other notes',             zh: '⑦ 其他事项',     ja: '⑦ その他事項',       vi: '⑦ Ghi chú khác' } },
    { id: 'reporter',  label: { ko: '⑧ 신고인',            en: '⑧ Person reporting',        zh: '⑧ 申报人',       ja: '⑧ 届出人',           vi: '⑧ Người khai báo' } },
    { id: 'submitter', label: { ko: '⑨ 제출인',            en: '⑨ Submitter',               zh: '⑨ 提交人',       ja: '⑨ 提出人',           vi: '⑨ Người nộp thay' } },
  ],
  fields,
};
