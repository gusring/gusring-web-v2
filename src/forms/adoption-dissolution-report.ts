import {
  addressField, birthDateField, bonField, courtNameField, dateField, emailField, hanjaSplitField, idField, nameField,
  nameSplitField, opt, originField, otherNotesField, phoneField, reportDateField, reporterNameField, submitterIdField,
  submitterNameField, WHO,
} from './common';
import { FieldDef, FormDef, L } from './types';

// ─────────────────────────────────────────────────────────────
// 파양신고서 [양식 제6호] — v1 서식 5번
// 좌표는 public/forms/adoption-dissolution-report_ko.png (1190×1682) 기준.
// 안내 문구는 뒷면 「작성 방법」(v1 guides_ko_5)을 바탕으로 작성.
// ─────────────────────────────────────────────────────────────

const AF = WHO.adoptiveFather;
const AM = WHO.adoptiveMother;
const AD = WHO.adoptee;

const SIGN_SELF: L = {
  ko: '파양을 하는 양자 본인이 이 칸에 이름을 쓰고 서명(도장)해요.',
  en: 'The adopted child ending the adoption writes their name here and signs (or stamps).',
  zh: '解除收养的养子女本人在此栏填写姓名并签名（盖章）。',
  ja: '離縁する養子本人がこの欄に氏名を書き、署名（押印）します。',
  vi: 'Chính người con nuôi chấm dứt quan hệ nhận nuôi ghi tên vào ô này và ký tên (đóng dấu).',
};

/** 양부·양모 두 칸이 나란히 있는 줄 */
const parentCols = (who: typeof AF, key: 'Father' | 'Mother', x: number, x2: number, xBon: number, wName: number, wBon: number) => [
  nameSplitField({
    id: `adoptive${key}Name`, section: 'parents', koLabel: `① ${key === 'Father' ? '양부' : '양모'} 성명 (한글)`, who,
    area: { x, y: 269, w: wName, h: 68 },
    surname: { x: x2, y: 280, w: 58, h: 46, align: 'center' },
    given: { x: x2 + 70, y: 280, w: x + wName - x2 - 71, h: 46, align: 'center' },
  }),
  bonField({
    id: `adoptive${key}Bon`, section: 'parents', koLabel: `① ${key === 'Father' ? '양부' : '양모'} 본(한자)`, who,
    area: { x: xBon, y: 269, w: wBon, h: 68 },
    box: { x: xBon + 35, y: 280, w: wBon - 37, h: 46, align: 'center' },
  }),
  hanjaSplitField({
    id: `adoptive${key}Hanja`, section: 'parents', koLabel: `① ${key === 'Father' ? '양부' : '양모'} 성명 (한자)`, who,
    area: { x, y: 338, w: wName, h: 66 },
    surname: { x: x2, y: 349, w: 58, h: 44, align: 'center' },
    given: { x: x2 + 70, y: 349, w: x + wName - x2 - 71, h: 44, align: 'center' },
  }),
  birthDateField({
    id: `adoptive${key}Birth`, section: 'parents', koLabel: `① ${key === 'Father' ? '양부' : '양모'} 출생연월일`, who,
    area: { x: xBon, y: 338, w: wBon, h: 66 },
    box: { x: xBon + 35, y: 345, w: wBon - 37, h: 52, align: 'center' },
  }),
];

const fields: FieldDef[] = [
  reportDateField(
    { x: 150, y: 177, w: 395, h: 30 },
    { x: 215, y: 179, w: 86, h: 26, align: 'right' },
    { x: 325, y: 179, w: 53, h: 26, align: 'right' },
    { x: 401, y: 179, w: 54, h: 26, align: 'right' },
  ),

  // ── ① 양친 ───────────────────────────────────────────────
  ...parentCols(AF, 'Father', 261, 302, 531, 184, 119),
  idField({
    id: 'adoptiveFatherId', section: 'parents', koLabel: '① 양부 주민등록번호', who: AF,
    area: { x: 390, y: 405, w: 260, h: 44 },
    front: { x: 426, y: 408, w: 86, h: 38, align: 'center' },
    back: { x: 528, y: 408, w: 120, h: 38, align: 'center' },
  }),
  originField({
    id: 'adoptiveFatherOrigin', section: 'parents', koLabel: '① 양부 등록기준지', who: AF,
    area: { x: 261, y: 450, w: 389, h: 54 },
    box: { x: 297, y: 453, w: 349, h: 48, align: 'center' },
  }),
  addressField({
    id: 'adoptiveFatherAddress', section: 'parents', koLabel: '① 양부 주소', who: AF,
    area: { x: 261, y: 505, w: 389, h: 55 },
    box: { x: 297, y: 508, w: 349, h: 49, align: 'center' },
  }),
  ...parentCols(AM, 'Mother', 651, 700, 929, 196, 120),
  idField({
    id: 'adoptiveMotherId', section: 'parents', koLabel: '① 양모 주민등록번호', who: AM,
    area: { x: 783, y: 405, w: 266, h: 44 },
    front: { x: 819, y: 408, w: 89, h: 38, align: 'center' },
    back: { x: 924, y: 408, w: 123, h: 38, align: 'center' },
  }),
  originField({
    id: 'adoptiveMotherOrigin', section: 'parents', koLabel: '① 양모 등록기준지', who: AM,
    area: { x: 651, y: 450, w: 398, h: 54 },
    box: { x: 687, y: 453, w: 358, h: 48, align: 'center' },
  }),
  addressField({
    id: 'adoptiveMotherAddress', section: 'parents', koLabel: '① 양모 주소', who: AM,
    area: { x: 651, y: 505, w: 398, h: 55 },
    box: { x: 687, y: 508, w: 358, h: 49, align: 'center' },
    copyFrom: [{ field: 'adoptiveFatherAddress', label: { ko: '양부 주소와 같아요', en: 'Same as the adoptive father', zh: '与养父地址相同', ja: '養父の住所と同じ', vi: 'Giống địa chỉ cha nuôi' }, map: { address: 'address' } }],
  }),

  // ── ② 양자 ───────────────────────────────────────────────
  nameSplitField({
    id: 'adopteeName', section: 'adoptee', koLabel: '② 양자 성명 (한글)', who: AD,
    area: { x: 261, y: 561, w: 308, h: 67 },
    surname: { x: 313, y: 572, w: 58, h: 46, align: 'center' },
    given: { x: 384, y: 572, w: 183, h: 46, align: 'center' },
  }),
  bonField({
    id: 'adopteeBon', section: 'adoptee', koLabel: '② 양자 본(한자)', who: AD,
    area: { x: 651, y: 561, w: 165, h: 67 },
    box: { x: 687, y: 572, w: 127, h: 46, align: 'center' },
  }),
  hanjaSplitField({
    id: 'adopteeHanja', section: 'adoptee', koLabel: '② 양자 성명 (한자)', who: AD,
    area: { x: 261, y: 629, w: 308, h: 66 },
    surname: { x: 313, y: 640, w: 58, h: 44, align: 'center' },
    given: { x: 384, y: 640, w: 183, h: 44, align: 'center' },
  }),
  birthDateField({
    id: 'adopteeBirth', section: 'adoptee', koLabel: '② 양자 출생연월일', who: AD,
    area: { x: 651, y: 629, w: 165, h: 66 },
    box: { x: 687, y: 640, w: 127, h: 44, align: 'center' },
  }),
  idField({
    id: 'adopteeId', section: 'adoptee', koLabel: '② 양자 주민등록번호', who: AD,
    area: { x: 817, y: 629, w: 232, h: 66 },
    front: { x: 853, y: 640, w: 72, h: 44, align: 'center' },
    back: { x: 942, y: 640, w: 105, h: 44, align: 'center' },
  }),
  originField({
    id: 'adopteeOrigin', section: 'adoptee', koLabel: '② 양자 등록기준지', who: AD,
    area: { x: 311, y: 696, w: 738, h: 49 },
    box: { x: 347, y: 699, w: 698, h: 43, align: 'center' },
  }),
  addressField({
    id: 'adopteeAddress', section: 'adoptee', koLabel: '② 양자 주소', who: AD,
    area: { x: 311, y: 746, w: 738, h: 45 },
    box: { x: 347, y: 748, w: 698, h: 41, align: 'center' },
  }),

  // ── ③ 양자의 친생부모 ────────────────────────────────────
  nameField({
    id: 'birthFatherName', section: 'birthParents', koLabel: '③ 양자의 친생부 성명', who: WHO.birthFather,
    area: { x: 351, y: 792, w: 147, h: 77 },
    box: { x: 387, y: 810, w: 109, h: 40, align: 'center' },
  }),
  originField({
    id: 'birthFatherOrigin', section: 'birthParents', koLabel: '③ 친생부 등록기준지', who: WHO.birthFather,
    area: { x: 643, y: 792, w: 406, h: 38 },
    box: { x: 679, y: 794, w: 366, h: 34, align: 'center' },
  }),
  idField({
    id: 'birthFatherId', section: 'birthParents', koLabel: '③ 친생부 주민등록번호', who: WHO.birthFather,
    area: { x: 643, y: 831, w: 406, h: 38 },
    front: { x: 679, y: 833, w: 158, h: 34, align: 'center' },
    back: { x: 854, y: 833, w: 192, h: 34, align: 'center' },
  }),
  nameField({
    id: 'birthMotherName', section: 'birthParents', koLabel: '③ 양자의 친생모 성명', who: WHO.birthMother,
    area: { x: 351, y: 870, w: 147, h: 78 },
    box: { x: 387, y: 888, w: 109, h: 40, align: 'center' },
  }),
  originField({
    id: 'birthMotherOrigin', section: 'birthParents', koLabel: '③ 친생모 등록기준지', who: WHO.birthMother,
    area: { x: 643, y: 870, w: 406, h: 38 },
    box: { x: 679, y: 872, w: 366, h: 34, align: 'center' },
  }),
  idField({
    id: 'birthMotherId', section: 'birthParents', koLabel: '③ 친생모 주민등록번호', who: WHO.birthMother,
    area: { x: 643, y: 909, w: 406, h: 39 },
    front: { x: 679, y: 911, w: 158, h: 35, align: 'center' },
    back: { x: 854, y: 911, w: 192, h: 35, align: 'center' },
  }),

  // ── ④ 기타사항 ───────────────────────────────────────────
  otherNotesField({
    id: 'otherNotes', section: 'etc', koLabel: '④ 기타사항',
    area: { x: 311, y: 949, w: 738, h: 41 },
    box: { x: 347, y: 951, w: 698, h: 37 },
  }),

  // ── ⑤ 재판확정일자 ───────────────────────────────────────
  dateField({
    id: 'courtDate', section: 'court', koLabel: '⑤ 재판확정일자',
    label: { ko: '재판 확정일', en: 'Date the judgment became final', zh: '判决确定日期', ja: '裁判確定日', vi: 'Ngày bản án có hiệu lực' },
    help: {
      ko: '법원의 재판으로 파양하는 경우에만, 재판이 확정된 날을 적어요.',
      en: 'Only for a dissolution by court judgment: the date the judgment became final.',
      zh: '仅在通过法院判决罢养时，填写判决确定的日期。',
      ja: '裁判による離縁の場合のみ、裁判が確定した日を書きます。',
      vi: 'Chỉ khi chấm dứt nhận nuôi theo phán quyết của tòa: ghi ngày phán quyết có hiệu lực.',
    },
    area: { x: 311, y: 991, w: 448, h: 44 },
    y: { x: 356, y: 994, w: 66, h: 38, align: 'right' },
    m: { x: 446, y: 994, w: 52, h: 38, align: 'right' },
    d: { x: 523, y: 994, w: 52, h: 38, align: 'right' },
  }),
  courtNameField({
    id: 'courtName', section: 'court', koLabel: '⑤ 법원명',
    help: {
      ko: '재판으로 파양하는 경우에만, 재판한 법원 이름을 적어요.',
      en: 'Only for a dissolution by court judgment: the name of the court.',
      zh: '仅在通过判决罢养时，填写作出判决的法院名称。',
      ja: '裁判による離縁の場合のみ、裁判をした裁判所名を書きます。',
      vi: 'Chỉ khi chấm dứt nhận nuôi theo phán quyết: ghi tên tòa án.',
    },
    area: { x: 908, y: 991, w: 141, h: 44 },
    box: { x: 944, y: 994, w: 103, h: 38, align: 'center' },
  }),

  // ── ⑥ 동의자 ─────────────────────────────────────────────
  nameField({
    id: 'consenterName', section: 'consent', koLabel: '⑥ 동의자(성년후견인) 성명', who: WHO.consentingGuardian,
    help: {
      ko: '피성년후견인인 양부모가 성년후견인의 동의를 받아 협의로 파양하는 경우에만 적어요. 양자가 미성년자이거나 피성년후견인이면 협의로 파양할 수 없어요. 서명이나 도장은 출력한 종이에 직접 해요.',
      en: 'Only when an adoptive parent under adult guardianship ends the adoption by agreement with the guardian’s consent. If the adopted child is a minor or under adult guardianship, the adoption cannot be ended by agreement. Sign or stamp by hand on the printed paper.',
      zh: '仅在被成年监护的养父母经成年监护人同意协议罢养时填写。养子女为未成年人或被成年监护人时，不能协议罢养。签名或盖章请在打印出的纸上亲自完成。',
      ja: '被成年後見人である養親が成年後見人の同意を得て協議離縁する場合のみ書きます。養子が未成年者または被成年後見人の場合は協議離縁できません。署名・押印は印刷した紙に直接します。',
      vi: 'Chỉ ghi khi cha mẹ nuôi là người được giám hộ thành niên chấm dứt nhận nuôi theo thỏa thuận với sự đồng ý của người giám hộ. Nếu con nuôi là người chưa thành niên hoặc người được giám hộ thành niên thì không thể chấm dứt theo thỏa thuận. Ký tên hoặc đóng dấu trực tiếp trên giấy đã in.',
    },
    area: { x: 278, y: 1037, w: 402, h: 78 },
    box: { x: 314, y: 1056, w: 250, h: 40, align: 'center' },
  }),
  idField({
    id: 'consenterId', section: 'consent', koLabel: '⑥ 동의자 주민등록번호', who: WHO.consentingGuardian,
    area: { x: 822, y: 1037, w: 227, h: 78 },
    front: { x: 858, y: 1056, w: 70, h: 40, align: 'center' },
    back: { x: 944, y: 1056, w: 103, h: 40, align: 'center' },
  }),

  // ── ⑦ 신고인 ─────────────────────────────────────────────
  reporterNameField({ id: 'reporterFatherName', section: 'reporter', koLabel: '⑦ 신고인 양부', who: AF, area: { x: 278, y: 1116, w: 402, h: 76 }, box: { x: 314, y: 1134, w: 250, h: 40, align: 'center' } }),
  phoneField({ id: 'reporterFatherPhone', section: 'reporter', koLabel: '⑦ 양부 전화', who: AF, area: { x: 760, y: 1116, w: 289, h: 37 }, box: { x: 796, y: 1118, w: 250, h: 33, align: 'center' } }),
  emailField({ id: 'reporterFatherEmail', section: 'reporter', koLabel: '⑦ 양부 이메일', who: AF, area: { x: 760, y: 1154, w: 289, h: 38 }, box: { x: 796, y: 1156, w: 250, h: 34, align: 'center' } }),
  reporterNameField({ id: 'reporterMotherName', section: 'reporter', koLabel: '⑦ 신고인 양모', who: AM, area: { x: 278, y: 1193, w: 402, h: 77 }, box: { x: 314, y: 1211, w: 250, h: 40, align: 'center' } }),
  phoneField({ id: 'reporterMotherPhone', section: 'reporter', koLabel: '⑦ 양모 전화', who: AM, area: { x: 760, y: 1193, w: 289, h: 38 }, box: { x: 796, y: 1195, w: 250, h: 34, align: 'center' } }),
  emailField({ id: 'reporterMotherEmail', section: 'reporter', koLabel: '⑦ 양모 이메일', who: AM, area: { x: 760, y: 1232, w: 289, h: 38 }, box: { x: 796, y: 1234, w: 250, h: 34, align: 'center' } }),
  reporterNameField({ id: 'reporterAdopteeName', section: 'reporter', koLabel: '⑦ 신고인 양자', who: AD, extra: SIGN_SELF, area: { x: 278, y: 1271, w: 402, h: 77 }, box: { x: 314, y: 1289, w: 250, h: 40, align: 'center' } }),
  phoneField({ id: 'reporterAdopteePhone', section: 'reporter', koLabel: '⑦ 양자 전화', who: AD, area: { x: 760, y: 1271, w: 289, h: 38 }, box: { x: 796, y: 1273, w: 250, h: 34, align: 'center' } }),
  emailField({ id: 'reporterAdopteeEmail', section: 'reporter', koLabel: '⑦ 양자 이메일', who: AD, area: { x: 760, y: 1310, w: 289, h: 38 }, box: { x: 796, y: 1312, w: 250, h: 34, align: 'center' } }),
  {
    id: 'lawsuitParty',
    section: 'reporter',
    koLabel: '⑦ 소 제기자 / 소의 상대방',
    label: { ko: '재판 당사자로 신고', en: 'Reporting as a party to the lawsuit', zh: '作为诉讼当事人申报', ja: '訴訟当事者として届出', vi: 'Khai báo với tư cách bên trong vụ kiện' },
    help: {
      ko: '파양 재판이 확정된 경우에는 소송을 낸 사람이나 그 상대방이 혼자 신고할 수 있어요. 그런 경우에만 해당하는 쪽을 고르고, 옆 칸에 이름을 적어요.',
      en: 'If a dissolution judgment has become final, the person who filed the lawsuit or the opposing party may report alone. Only in that case, choose which one and write the name in the next box.',
      zh: '罢养判决确定后，起诉人或其相对方可以单独申报。仅在这种情况下选择相应一方，并在旁边栏填写姓名。',
      ja: '離縁の裁判が確定した場合は、訴えを提起した者またはその相手方が単独で届け出ることができます。その場合のみ該当する方を選び、隣の欄に氏名を書きます。',
      vi: 'Nếu phán quyết chấm dứt nhận nuôi đã có hiệu lực, người khởi kiện hoặc bên bị kiện có thể tự khai báo một mình. Chỉ trong trường hợp đó, chọn bên tương ứng và ghi tên ở ô bên cạnh.',
    },
    area: { x: 192, y: 1349, w: 294, h: 80 },
    badge: 'margin',
    input: {
      kind: 'choice',
      mark: 'circle',
      options: [
        opt('plaintiff', '소 제기자', { ko: '소송을 낸 사람', en: 'Person who filed the lawsuit', zh: '提起诉讼者', ja: '訴えを提起した者', vi: 'Người khởi kiện' }, 212, 1390),
        opt('defendant', '소의 상대방', { ko: '소송의 상대방', en: 'Opposing party in the lawsuit', zh: '诉讼相对方', ja: '訴えの相手方', vi: 'Bên bị kiện' }, 344, 1390),
      ],
    },
  },
  reporterNameField({ id: 'lawsuitPartyName', section: 'reporter', koLabel: '⑦ 소 제기자·상대방 성명', area: { x: 487, y: 1349, w: 339, h: 80 }, box: { x: 523, y: 1370, w: 190, h: 40, align: 'center' } }),
  phoneField({ id: 'lawsuitPartyPhone', section: 'reporter', koLabel: '⑦ 소 제기자·상대방 전화', area: { x: 898, y: 1349, w: 151, h: 39 }, box: { x: 934, y: 1351, w: 113, h: 35, align: 'center' } }),
  emailField({ id: 'lawsuitPartyEmail', section: 'reporter', koLabel: '⑦ 소 제기자·상대방 이메일', area: { x: 898, y: 1389, w: 151, h: 40 }, box: { x: 934, y: 1391, w: 113, h: 36, align: 'center' } }),

  // ── ⑧ 신고인 출석여부 ────────────────────────────────────
  {
    id: 'attendance',
    section: 'attendance',
    koLabel: '⑧ 신고인 출석여부',
    label: { ko: '창구에 직접 나온 신고인', en: 'Reporters present at the counter', zh: '亲自到窗口的申报人', ja: '窓口に出頭した届出人', vi: 'Người khai báo có mặt tại quầy' },
    help: {
      ko: '신고인 중 창구에 직접 나와 신고하는 사람을 모두 골라요.',
      en: 'Choose every reporter who comes to the counter in person.',
      zh: '选择所有亲自到窗口申报的申报人。',
      ja: '届出人のうち、窓口に直接来て届け出る人をすべて選びます。',
      vi: 'Chọn tất cả những người khai báo trực tiếp đến quầy.',
    },
    area: { x: 384, y: 1430, w: 665, h: 48 },
    input: {
      kind: 'choice',
      mark: 'circle',
      multiple: true,
      options: [
        opt('adoptiveFather', '양부', { ko: '양부', en: 'Adoptive father', zh: '养父', ja: '養父', vi: 'Cha nuôi' }, 446, 1454),
        opt('adoptiveMother', '양모', { ko: '양모', en: 'Adoptive mother', zh: '养母', ja: '養母', vi: 'Mẹ nuôi' }, 535, 1454),
        opt('adoptee', '양자', { ko: '양자', en: 'Adopted child', zh: '养子女', ja: '養子', vi: 'Con nuôi' }, 622, 1454),
        opt('plaintiff', '소 제기자', { ko: '소송을 낸 사람', en: 'Person who filed the lawsuit', zh: '提起诉讼者', ja: '訴えを提起した者', vi: 'Người khởi kiện' }, 710, 1454),
        opt('defendant', '소의 상대방', { ko: '소송의 상대방', en: 'Opposing party in the lawsuit', zh: '诉讼相对方', ja: '訴えの相手方', vi: 'Bên bị kiện' }, 854, 1454),
      ],
    },
  },

  // ── ⑨ 제출인 ─────────────────────────────────────────────
  submitterNameField({
    id: 'submitterName', section: 'submitter', koLabel: '⑨ 제출인 성명',
    area: { x: 384, y: 1479, w: 235, h: 49 },
    box: { x: 420, y: 1482, w: 196, h: 43, align: 'center' },
  }),
  submitterIdField({
    id: 'submitterId', section: 'submitter', koLabel: '⑨ 제출인 주민등록번호',
    area: { x: 777, y: 1479, w: 272, h: 49 },
    front: { x: 813, y: 1482, w: 92, h: 43, align: 'center' },
    back: { x: 922, y: 1482, w: 125, h: 43, align: 'center' },
  }),
];

export const adoptionDissolutionReport: FormDef = {
  id: 'adoption-dissolution-report',
  title: { ko: '파양신고서', en: 'Dissolution of Adoption', zh: '罢养申报书', ja: '離縁届', vi: 'Đơn báo cáo chấm dứt nhận nuôi' },
  pages: [{ image: '/forms/adoption-dissolution-report_ko.png', width: 1190, height: 1682 }],
  sections: [
    { id: 'meta',         label: { ko: '신고일',              en: 'Report date',             zh: '申报日期',       ja: '届出日',           vi: 'Ngày khai báo' } },
    { id: 'parents',      label: { ko: '① 양친',              en: '① Adoptive parents',      zh: '① 养父母',       ja: '① 養親',           vi: '① Cha mẹ nuôi' } },
    { id: 'adoptee',      label: { ko: '② 양자',              en: '② Adopted child',         zh: '② 养子女',       ja: '② 養子',           vi: '② Con nuôi' } },
    { id: 'birthParents', label: { ko: '③ 양자의 친생부모',   en: '③ Birth parents',         zh: '③ 亲生父母',     ja: '③ 実父母',         vi: '③ Cha mẹ ruột' } },
    { id: 'etc',          label: { ko: '④ 기타사항',          en: '④ Other notes',           zh: '④ 其他事项',     ja: '④ その他事項',     vi: '④ Ghi chú khác' } },
    { id: 'court',        label: { ko: '⑤ 재판확정일자',      en: '⑤ Court judgment',        zh: '⑤ 判决确定',     ja: '⑤ 裁判確定',       vi: '⑤ Phán quyết của tòa' } },
    { id: 'consent',      label: { ko: '⑥ 동의자',            en: '⑥ Consenting guardian',   zh: '⑥ 同意人',       ja: '⑥ 同意者',         vi: '⑥ Người đồng ý' } },
    { id: 'reporter',     label: { ko: '⑦ 신고인',            en: '⑦ Persons reporting',     zh: '⑦ 申报人',       ja: '⑦ 届出人',         vi: '⑦ Người khai báo' } },
    { id: 'attendance',   label: { ko: '⑧ 신고인 출석여부',   en: '⑧ Attendance',            zh: '⑧ 申报人出席',   ja: '⑧ 届出人の出頭',   vi: '⑧ Có mặt tại quầy' } },
    { id: 'submitter',    label: { ko: '⑨ 제출인',            en: '⑨ Submitter',             zh: '⑨ 提交人',       ja: '⑨ 提出人',         vi: '⑨ Người nộp thay' } },
  ],
  fields,
};
