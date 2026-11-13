import {
  addressField, courtNameField, dateField, emailField, hanjaSplitField, idField, nameSplitField, opt, originField,
  otherNotesField, OTHER_DETAIL, phoneField, reportDateField, reporterNameField, submitterIdField, submitterNameField,
  textField, Who,
} from './common';
import { FieldDef, FormDef, L } from './types';

// ─────────────────────────────────────────────────────────────
// 등록부정정신청서 [양식 제30호] — v1 서식 11번 (2쪽: 별지)
// 좌표는 public/forms/register-correction_ko.png, _ko_2.png (841×1190) 기준.
// 안내 문구는 서식 아래 「작성 방법」을 바탕으로 작성.
// ─────────────────────────────────────────────────────────────

const SELF: Who = { ko: '사건본인', en: 'the person concerned', zh: '当事人', ja: '事件本人', vi: 'người đương sự' };
const APPLICANT: Who = { ko: '신청인', en: 'the applicant', zh: '申请人', ja: '申請人', vi: 'người nộp đơn' };

const CORRECTION_HELP: L = {
  ko: '고치려는 내용을 한국어로 적어요. 법원의 허가나 판결로 정정하는 경우에는 결정문·판결문의 「주문」에 나온 정정 사항을 적고, 적을 내용이 많으면 "별지 첨부 허가결정 또는 판결주문과 같음"이라고 적어요.',
  en: 'What you want corrected, in Korean. If the correction is by court permission or judgment, write the correction stated in the "order" (주문) of the decision; if it is long, write "별지 첨부 허가결정 또는 판결주문과 같음" (as in the attached decision / judgment order).',
  zh: '用韩文填写要更正的内容。依法院许可或判决更正时，填写决定书·判决书“主文”中的更正事项；内容较多时可写“별지 첨부 허가결정 또는 판결주문과 같음”（同附件许可决定或判决主文）。',
  ja: '訂正したい内容を韓国語で書きます。裁判所の許可または判決による訂正の場合は、決定書・判決書の「主文」に記載された訂正事項を書き、内容が多い場合は「別紙添付の許可決定または判決主文のとおり」という意味の韓国語を書きます。',
  vi: 'Nội dung muốn đính chính, ghi bằng tiếng Hàn. Nếu đính chính theo quyết định cho phép hoặc bản án của tòa, ghi nội dung đính chính trong phần "chủ văn" (주문); nếu dài, ghi "별지 첨부 허가결정 또는 판결주문과 같음" (như quyết định / chủ văn bản án đính kèm).',
};

const MANY_PEOPLE: L = {
  ko: ' 같은 일로 사건본인이 여러 명이면 이름 칸에 "별지와 같음"이라고 적고, 2쪽(별지)에 사건본인 모두와 정정 사항을 적어요.',
  en: ' If several people are concerned in the same matter, write "별지와 같음" (see annex) in the given-name box and list all of them with their corrections on page 2 (annex).',
  zh: '同一事项涉及多名当事人时，在名字栏写“별지와 같음”（同附件），并在第2页（附件）填写全部当事人及更正事项。',
  ja: '同じ件で事件本人が複数いる場合は、名の欄に「別紙のとおり」という意味の韓国語を書き、2ページ（別紙）に事件本人全員と訂正事項を書きます。',
  vi: ' Nếu cùng một việc có nhiều người đương sự, ghi "별지와 같음" (xem phụ lục) ở ô tên và ghi tất cả mọi người cùng nội dung đính chính ở trang 2 (phụ lục).',
};

/** 2쪽(별지) 한 사람 칸 — 줄 위치 [성명 위, 한글/한자 경계, 등록기준지, 주소, 정정사항, 끝], 「-」의 y */
const annex = (n: number, y: [number, number, number, number, number, number], dashY: number): FieldDef[] => {
  const who: Who = { ko: `별지 사건본인 ${n}`, en: `person ${n} on the annex`, zh: `附件当事人${n}`, ja: `別紙の事件本人${n}`, vi: `người đương sự ${n} (phụ lục)` };
  const s = `annex${n}`;
  const [top, mid, origin, address, correction, end] = y;
  return [
    nameSplitField({
      id: `${s}Name`, section: s, page: 2, koLabel: `별지 ${n} 성명 (한글)`, who,
      area: { x: 252, y: top + 1, w: 263, h: mid - top - 1 },
      surname: { x: 296, y: top + 3, w: 40, h: mid - top - 5, align: 'center' },
      given: { x: 358, y: top + 3, w: 155, h: mid - top - 5, align: 'center' },
    }),
    hanjaSplitField({
      id: `${s}Hanja`, section: s, page: 2, koLabel: `별지 ${n} 성명 (한자)`, who,
      area: { x: 252, y: mid + 1, w: 263, h: origin - mid - 1 },
      surname: { x: 296, y: mid + 3, w: 40, h: origin - mid - 5, align: 'center' },
      given: { x: 358, y: mid + 3, w: 155, h: origin - mid - 5, align: 'center' },
    }),
    idField({
      id: `${s}Id`, section: s, page: 2, koLabel: `별지 ${n} 주민등록번호`, who, badge: 'margin',
      area: { x: 592, y: top + 1, w: 148, h: origin - top - 1 },
      front: { x: 594, y: dashY - 15, w: 68, h: 30, align: 'center' },
      back: { x: 672, y: dashY - 15, w: 67, h: 30, align: 'center' },
    }),
    originField({ id: `${s}Origin`, section: s, page: 2, koLabel: `별지 ${n} 등록기준지`, who, area: { x: 252, y: origin + 1, w: 488, h: address - origin - 1 }, box: { x: 288, y: origin + 1, w: 448, h: address - origin - 1, align: 'center' } }),
    addressField({ id: `${s}Address`, section: s, page: 2, koLabel: `별지 ${n} 주소`, who, area: { x: 252, y: address + 1, w: 488, h: correction - address - 1 }, box: { x: 288, y: address + 1, w: 448, h: correction - address - 1, align: 'center' } }),
    textField({
      id: `${s}Correction`, section: s, page: 2, koLabel: `별지 ${n} 정정사항`,
      label: { ko: `${who.ko} 정정 사항`, en: `Corrections for ${who.en}`, zh: `${who.zh}更正事项`, ja: `${who.ja}の訂正事項`, vi: `Nội dung đính chính của ${who.vi}` },
      help: CORRECTION_HELP,
      area: { x: 252, y: correction + 1, w: 488, h: end - correction - 2 },
      part: { box: { x: 288, y: correction + 18, w: 448, h: end - correction - 36, align: 'left' }, korean: true },
    }),
  ];
};

const fields: FieldDef[] = [
  {
    ...reportDateField(
      { x: 104, y: 127, w: 332, h: 20 },
      { x: 162, y: 128, w: 60, h: 18, align: 'right' },
      { x: 241, y: 128, w: 51, h: 18, align: 'right' },
      { x: 310, y: 128, w: 52, h: 18, align: 'right' },
    ),
    koLabel: '신청일 ( 년 월 일)',
    label: { ko: '신청하는 날짜', en: 'Date of application', zh: '申请日期', ja: '申請日', vi: 'Ngày nộp đơn' },
    help: {
      ko: '이 신청서를 제출하는 날짜예요. 보통 오늘 날짜를 적어요.',
      en: "The date you submit this application. Usually today's date.",
      zh: '提交本申请书的日期，通常填写今天的日期。',
      ja: 'この申請書を提出する日付です。通常は今日の日付を書きます。',
      vi: 'Ngày bạn nộp đơn này. Thường là ngày hôm nay.',
    },
  },

  // ── ① 사건본인 ───────────────────────────────────────────
  nameSplitField({
    id: 'personName', section: 'person', koLabel: '① 사건본인 성명 (한글)', who: SELF,
    help: {
      ko: '정정을 신청하는 대상(사건본인)의 이름을 한글로 적어요.' + MANY_PEOPLE.ko,
      en: 'Name of the person whose record is to be corrected, in Korean letters.' + MANY_PEOPLE.en,
      zh: '用韩文填写申请更正的对象（当事人）的姓名。' + MANY_PEOPLE.zh,
      ja: '訂正の対象となる人（事件本人）の氏名をハングルで書きます。' + MANY_PEOPLE.ja,
      vi: 'Họ tên người cần đính chính hồ sơ (người đương sự), bằng chữ Hàn.' + MANY_PEOPLE.vi,
    },
    area: { x: 251, y: 159, w: 263, h: 31 },
    surname: { x: 296, y: 161, w: 38, h: 27, align: 'center' },
    given: { x: 362, y: 161, w: 150, h: 27, align: 'center' },
  }),
  hanjaSplitField({
    id: 'personHanja', section: 'person', koLabel: '① 사건본인 성명 (한자)', who: SELF,
    area: { x: 251, y: 191, w: 263, h: 35 },
    surname: { x: 296, y: 193, w: 38, h: 31, align: 'center' },
    given: { x: 362, y: 193, w: 150, h: 31, align: 'center' },
  }),
  idField({
    id: 'personId', section: 'person', koLabel: '① 사건본인 주민등록번호', who: SELF, badge: 'margin',
    area: { x: 591, y: 159, w: 149, h: 67 },
    front: { x: 593, y: 178, w: 67, h: 28, align: 'center' },
    back: { x: 671, y: 178, w: 67, h: 28, align: 'center' },
  }),
  originField({ id: 'personOrigin', section: 'person', koLabel: '① 등록기준지', who: SELF, area: { x: 251, y: 227, w: 489, h: 34 }, box: { x: 287, y: 229, w: 449, h: 30, align: 'center' } }),
  addressField({ id: 'personAddress', section: 'person', koLabel: '① 주소', who: SELF, area: { x: 251, y: 262, w: 489, h: 34 }, box: { x: 287, y: 264, w: 449, h: 30, align: 'center' } }),

  // ── ② 정정사항 ───────────────────────────────────────────
  textField({
    id: 'correction', section: 'correction', koLabel: '② 정정사항',
    label: { ko: '정정 사항', en: 'What to correct', zh: '更正事项', ja: '訂正事項', vi: 'Nội dung đính chính' },
    help: {
      ...CORRECTION_HELP,
      ko: CORRECTION_HELP.ko + ' 사건본인이 여러 명이면 2쪽(별지)의 정정사항 칸에 각각 적어요.',
      en: CORRECTION_HELP.en + ' If several people are concerned, write each one’s corrections on page 2 (annex).',
      zh: CORRECTION_HELP.zh + '当事人有多名时，分别填写在第2页（附件）的更正事项栏。',
      ja: CORRECTION_HELP.ja + '事件本人が複数の場合は、2ページ（別紙）の訂正事項欄にそれぞれ書きます。',
      vi: CORRECTION_HELP.vi + ' Nếu có nhiều người đương sự, ghi riêng ở ô đính chính của từng người tại trang 2 (phụ lục).',
    },
    area: { x: 251, y: 297, w: 489, h: 69 },
    part: { box: { x: 287, y: 311, w: 449, h: 42, align: 'left' }, korean: true },
  }),

  // ── ③ 허가 또는 재판확정일자 ─────────────────────────────
  dateField({
    id: 'courtDate', section: 'court', koLabel: '③ 허가 또는 재판확정일자',
    label: { ko: '허가일 또는 재판 확정일', en: 'Date of permission or final judgment', zh: '许可日期或判决确定日期', ja: '許可日または裁判確定日', vi: 'Ngày cho phép hoặc ngày bản án có hiệu lực' },
    help: {
      ko: '법원이 정정을 허가한 날, 또는 판결이 확정된 날을 적어요. 법원에서 받은 서류를 보고 적어요.',
      en: 'The date the court permitted the correction, or the date the judgment became final. Copy it from the court documents.',
      zh: '填写法院许可更正的日期，或判决确定的日期。请参照从法院收到的文件填写。',
      ja: '裁判所が訂正を許可した日、または判決が確定した日を書きます。裁判所から受け取った書類を見て書きます。',
      vi: 'Ngày tòa án cho phép đính chính, hoặc ngày bản án có hiệu lực. Hãy xem giấy tờ nhận từ tòa án.',
    },
    area: { x: 251, y: 367, w: 236, h: 40 },
    y: { x: 287, y: 370, w: 43, h: 34, align: 'right' },
    m: { x: 347, y: 370, w: 45, h: 34, align: 'right' },
    d: { x: 409, y: 370, w: 54, h: 34, align: 'right' },
  }),
  courtNameField({
    id: 'courtName', section: 'court', koLabel: '③ 법원명',
    help: { ko: '허가하거나 판결한 법원 이름을 적어요.', en: 'Name of the court that gave the permission or judgment.', zh: '填写作出许可或判决的法院名称。', ja: '許可または判決をした裁判所名を書きます。', vi: 'Tên tòa án đã cho phép hoặc ra bản án.' },
    area: { x: 551, y: 367, w: 189, h: 40 },
    box: { x: 587, y: 370, w: 149, h: 34, align: 'center' },
  }),

  // ── ④ 기타사항 ───────────────────────────────────────────
  otherNotesField({ id: 'otherNotes', section: 'etc', koLabel: '④ 기타사항', area: { x: 251, y: 408, w: 489, h: 41 }, box: { x: 287, y: 411, w: 449, h: 35 } }),

  // ── ⑤ 신청인 ─────────────────────────────────────────────
  reporterNameField({ id: 'applicantName', section: 'applicant', koLabel: '⑤ 신청인 성명', who: APPLICANT, area: { x: 251, y: 450, w: 246, h: 36 }, box: { x: 286, y: 452, w: 150, h: 32, align: 'center' } }),
  idField({
    id: 'applicantId', section: 'applicant', koLabel: '⑤ 신청인 주민등록번호', who: APPLICANT, badge: 'margin',
    area: { x: 606, y: 450, w: 134, h: 36 },
    front: { x: 608, y: 452, w: 60, h: 32, align: 'center' },
    back: { x: 679, y: 452, w: 59, h: 32, align: 'center' },
  }),
  {
    id: 'applicantQualification', section: 'applicant', koLabel: '⑤ 신청인 자격',
    label: { ko: '신청인 자격', en: 'Capacity of the applicant', zh: '申请人资格', ja: '申請人の資格', vi: 'Tư cách người nộp đơn' },
    help: { ko: '신청하는 사람의 자격을 골라요.', en: 'Choose the capacity of the applicant.', zh: '选择申请人的资格。', ja: '申請人の資格を選びます。', vi: 'Chọn tư cách của người nộp đơn.' },
    area: { x: 251, y: 487, w: 489, h: 35 },
    badge: 'margin',
    input: {
      kind: 'choice', mark: 'circle',
      options: [
        opt('self', '본인', { ko: '본인', en: 'The person themself', zh: '本人', ja: '本人', vi: 'Chính người đó' }, 268, 503),
        opt('legalRep', '법정대리인', { ko: '법정대리인', en: 'Legal representative', zh: '法定代理人', ja: '法定代理人', vi: 'Người đại diện theo pháp luật' }, 322, 503),
        opt('plaintiff', '소 제기자', { ko: '소송을 낸 사람', en: 'Person who filed the lawsuit', zh: '提起诉讼者', ja: '訴えを提起した者', vi: 'Người khởi kiện' }, 424, 503),
        opt('other', '기타', { ko: '기타', en: 'Other', zh: '其他', ja: 'その他', vi: 'Khác' }, 517, 503),
      ],
      extra: { ...OTHER_DETAIL, when: ['other'], box: { x: 608, y: 489, w: 115, h: 30, align: 'center' } },
    },
  },
  addressField({ id: 'applicantAddress', section: 'applicant', koLabel: '⑤ 신청인 주소', who: APPLICANT, area: { x: 251, y: 523, w: 220, h: 35 }, box: { x: 287, y: 525, w: 181, h: 31, align: 'center' } }),
  phoneField({ id: 'applicantPhone', section: 'applicant', koLabel: '⑤ 전화', who: APPLICANT, area: { x: 472, y: 523, w: 113, h: 35 }, box: { x: 527, y: 525, w: 57, h: 31, align: 'center' } }),
  emailField({ id: 'applicantEmail', section: 'applicant', koLabel: '⑤ 이메일', who: APPLICANT, area: { x: 586, y: 523, w: 154, h: 35 }, box: { x: 647, y: 525, w: 91, h: 31, align: 'center' } }),

  // ── ⑥ 제출인 ─────────────────────────────────────────────
  submitterNameField({ id: 'submitterName', section: 'submitter', koLabel: '⑥ 제출인 성명', area: { x: 251, y: 560, w: 154, h: 37 }, box: { x: 287, y: 562, w: 115, h: 33, align: 'center' } }),
  submitterIdField({ id: 'submitterId', section: 'submitter', koLabel: '⑥ 제출인 주민등록번호', area: { x: 527, y: 560, w: 213, h: 37 }, front: { x: 563, y: 562, w: 65, h: 33, align: 'center' }, back: { x: 639, y: 562, w: 99, h: 33, align: 'center' } }),

  // ── 2쪽 별지 ─────────────────────────────────────────────
  ...annex(1, [105, 136, 172, 196, 220, 303], 138),
  ...annex(2, [304, 335, 371, 397, 422, 506], 337),
  ...annex(3, [507, 538, 574, 602, 629, 713], 541),
  ...annex(4, [714, 745, 781, 807, 832, 916], 747),
  ...annex(5, [917, 948, 984, 1010, 1035, 1119], 950),
];

const annexLabel = (n: number): L => ({ ko: `별지 사건본인 ${n}`, en: `Annex: person ${n}`, zh: `附件 当事人${n}`, ja: `別紙 事件本人${n}`, vi: `Phụ lục: người ${n}` });

export const registerCorrection: FormDef = {
  id: 'register-correction',
  title: { ko: '등록부정정신청서', en: 'Register Correction', zh: '登记簿更正申请', ja: '登録簿訂正申請', vi: 'Đơn xin đính chính đăng ký' },
  pages: [
    { image: '/forms/register-correction_ko.png', width: 841, height: 1190, marginX: 772 },
    { image: '/forms/register-correction_ko_2.png', width: 841, height: 1190, marginX: 772 },
  ],
  sections: [
    { id: 'meta',       label: { ko: '신청일',              en: 'Application date',   zh: '申请日期',   ja: '申請日',         vi: 'Ngày nộp đơn' } },
    { id: 'person',     label: { ko: '① 사건본인',          en: '① Person concerned', zh: '① 当事人',   ja: '① 事件本人',     vi: '① Người đương sự' } },
    { id: 'correction', label: { ko: '② 정정사항',          en: '② What to correct',  zh: '② 更正事项', ja: '② 訂正事項',     vi: '② Nội dung đính chính' } },
    { id: 'court',      label: { ko: '③ 허가·재판확정일자', en: '③ Court decision',   zh: '③ 许可·判决', ja: '③ 許可・裁判',   vi: '③ Quyết định của tòa' } },
    { id: 'etc',        label: { ko: '④ 기타사항',          en: '④ Other notes',      zh: '④ 其他事项', ja: '④ その他事項',   vi: '④ Ghi chú khác' } },
    { id: 'applicant',  label: { ko: '⑤ 신청인',            en: '⑤ Applicant',        zh: '⑤ 申请人',   ja: '⑤ 申請人',       vi: '⑤ Người nộp đơn' } },
    { id: 'submitter',  label: { ko: '⑥ 제출인',            en: '⑥ Submitter',        zh: '⑥ 提交人',   ja: '⑥ 提出人',       vi: '⑥ Người nộp thay' } },
    ...[1, 2, 3, 4, 5].map((n) => ({ id: `annex${n}`, label: annexLabel(n) })),
  ],
  fields,
};
