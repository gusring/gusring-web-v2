import {
  addressField, bonField, birthDateField, copyAddressFrom, copyIdFrom, courtNameField, dateField, emailField,
  hanjaSplitField, idField, nameSplitField, opt, originField, otherNotesField, OTHER_DETAIL, phoneField,
  reportDateField, reporterNameField, sexField, submitterIdField, submitterNameField, textField, Who, WHO,
} from './common';
import { FieldDef, FormDef } from './types';

// ─────────────────────────────────────────────────────────────
// 가족관계등록창설신고서 [양식 제29호] — v1 서식 1번
// 좌표는 public/forms/family-register-creation_ko.png (1190×1682) 기준.
// 안내 문구는 서식 아래 「작성 방법」을 바탕으로 작성.
// ─────────────────────────────────────────────────────────────

const SELF: Who = { ko: '본인', en: 'the person being registered', zh: '本人', ja: '本人', vi: 'người được đăng ký' };

const fields: FieldDef[] = [
  reportDateField(
    { x: 150, y: 177, w: 460, h: 32 },
    { x: 256, y: 179, w: 72, h: 28, align: 'right' },
    { x: 352, y: 179, w: 53, h: 28, align: 'right' },
    { x: 428, y: 179, w: 54, h: 28, align: 'right' },
  ),

  // ── ① 가족관계등록 창설자 ────────────────────────────────
  nameSplitField({
    id: 'selfName', section: 'self', koLabel: '① 본인 성명 (한글)', who: SELF,
    area: { x: 347, y: 223, w: 185, h: 47 },
    surname: { x: 399, y: 226, w: 44, h: 42, align: 'center' },
    given: { x: 450, y: 226, w: 80, h: 42, align: 'center' },
  }),
  hanjaSplitField({
    id: 'selfHanja', section: 'self', koLabel: '① 본인 성명 (한자)', who: SELF,
    area: { x: 347, y: 271, w: 185, h: 47 },
    surname: { x: 399, y: 274, w: 44, h: 42, align: 'center' },
    given: { x: 450, y: 274, w: 80, h: 42, align: 'center' },
  }),
  bonField({
    id: 'selfBon', section: 'self', koLabel: '① 본(한자)', who: SELF,
    area: { x: 592, y: 223, w: 93, h: 95 },
    box: { x: 596, y: 262, w: 87, h: 40, align: 'center' },
  }),
  sexField({
    id: 'selfSex', section: 'self', koLabel: '① 성별', who: SELF,
    area: { x: 834, y: 223, w: 211, h: 31 },
    male: { x: 902, y: 238 }, female: { x: 956, y: 238 },
  }),
  idField({
    id: 'selfId', section: 'self', koLabel: '① 주민등록번호', who: SELF,
    area: { x: 834, y: 255, w: 211, h: 31 },
    front: { x: 870, y: 257, w: 62, h: 27, align: 'center' },
    back: { x: 949, y: 257, w: 92, h: 27, align: 'center' },
  }),
  birthDateField({
    id: 'selfBirth', section: 'self', koLabel: '① 출생연월일', who: SELF,
    area: { x: 834, y: 287, w: 211, h: 31 },
    box: { x: 870, y: 289, w: 170, h: 27, align: 'center' },
  }),
  originField({
    id: 'selfOrigin', section: 'self', koLabel: '① 등록기준지', who: SELF,
    area: { x: 346, y: 319, w: 699, h: 49 },
    box: { x: 384, y: 322, w: 656, h: 43, align: 'center' },
  }),
  addressField({
    id: 'selfAddress', section: 'self', koLabel: '① 주소', who: SELF,
    area: { x: 346, y: 369, w: 699, h: 53 },
    box: { x: 384, y: 372, w: 656, h: 47, align: 'center' },
  }),

  // ── ① 부모 ───────────────────────────────────────────────
  nameSplitField({
    id: 'fatherName', section: 'parents', koLabel: '① 부(父) 성명', who: WHO.father,
    area: { x: 346, y: 423, w: 186, h: 90 },
    surname: { x: 399, y: 448, w: 44, h: 40, align: 'center' },
    given: { x: 450, y: 448, w: 80, h: 40, align: 'center' },
  }),
  originField({
    id: 'fatherOrigin', section: 'parents', koLabel: '① 부(父) 등록기준지', who: WHO.father,
    area: { x: 676, y: 423, w: 369, h: 45 },
    box: { x: 714, y: 426, w: 327, h: 39, align: 'center' },
  }),
  idField({
    id: 'fatherId', section: 'parents', koLabel: '① 부(父) 주민등록번호', who: WHO.father,
    area: { x: 676, y: 469, w: 369, h: 44 },
    front: { x: 712, y: 472, w: 140, h: 38, align: 'center' },
    back: { x: 869, y: 472, w: 172, h: 38, align: 'center' },
  }),
  nameSplitField({
    id: 'motherName', section: 'parents', koLabel: '① 모(母) 성명', who: WHO.mother,
    area: { x: 346, y: 514, w: 186, h: 90 },
    surname: { x: 399, y: 539, w: 44, h: 40, align: 'center' },
    given: { x: 450, y: 539, w: 80, h: 40, align: 'center' },
  }),
  originField({
    id: 'motherOrigin', section: 'parents', koLabel: '① 모(母) 등록기준지', who: WHO.mother,
    area: { x: 676, y: 514, w: 369, h: 45 },
    box: { x: 714, y: 517, w: 327, h: 39, align: 'center' },
  }),
  idField({
    id: 'motherId', section: 'parents', koLabel: '① 모(母) 주민등록번호', who: WHO.mother,
    area: { x: 676, y: 560, w: 369, h: 44 },
    front: { x: 712, y: 563, w: 140, h: 38, align: 'center' },
    back: { x: 869, y: 563, w: 172, h: 38, align: 'center' },
  }),

  // ── ② 신분에 관한 사항 ───────────────────────────────────
  textField({
    id: 'statusNotes', section: 'status', koLabel: '② 신분에 관한 사항',
    label: { ko: '신분에 관한 사항', en: 'Matters of personal status', zh: '身份相关事项', ja: '身分に関する事項', vi: 'Các nội dung về thân phận' },
    help: {
      ko: '이 신고서에 칸이 없는 신분에 관한 사항을 모두 한국어로 적어요. 법원의 가족관계등록창설허가결정서(신분표)를 별지로 붙이면 그것으로 대신할 수 있어요.',
      en: 'Write in Korean all matters of personal status that have no box on this form. You may instead attach the court’s decision permitting the family register creation (status table) as a separate sheet.',
      zh: '用韩文填写本申报书中没有栏位的所有身份相关事项。也可以另附法院的家族关系登记创设许可决定书（身份表）代替。',
      ja: 'この届出書に欄のない身分に関する事項をすべて韓国語で書きます。裁判所の家族関係登録創設許可決定書（身分表）を別紙として添付すれば、それで代えることができます。',
      vi: 'Ghi bằng tiếng Hàn tất cả nội dung về thân phận không có ô trên tờ khai này. Có thể thay bằng cách đính kèm quyết định cho phép lập đăng ký quan hệ gia đình (bảng thân phận) của tòa án.',
    },
    area: { x: 346, y: 606, w: 699, h: 72 },
    part: { box: { x: 384, y: 620, w: 655, h: 44, align: 'left' }, korean: true },
  }),

  // ── ③ 허가 또는 재판확정일자 ─────────────────────────────
  dateField({
    id: 'courtDate', section: 'court', koLabel: '③ 허가 또는 재판확정일자',
    label: { ko: '허가일 또는 재판 확정일', en: 'Date of permission or final judgment', zh: '许可日期或判决确定日期', ja: '許可日または裁判確定日', vi: 'Ngày cho phép hoặc ngày bản án có hiệu lực' },
    help: {
      ko: '법원이 가족관계등록 창설을 허가한 날, 또는 재판이 확정된 날을 적어요. 법원에서 받은 서류를 보고 적어요. 허가결정 등본을 받은 날부터 1개월 안에 신고해야 해요.',
      en: 'The date the court permitted the family register creation, or the date the judgment became final. Copy it from the court documents. You must report within 1 month of receiving the certified copy of the permission decision.',
      zh: '填写法院许可创设家族关系登记的日期，或判决确定的日期。请参照从法院收到的文件填写。须在收到许可决定副本之日起1个月内申报。',
      ja: '裁判所が家族関係登録の創設を許可した日、または裁判が確定した日を書きます。裁判所から受け取った書類を見て書きます。許可決定の謄本を受け取った日から1か月以内に届け出なければなりません。',
      vi: 'Ngày tòa án cho phép lập đăng ký quan hệ gia đình, hoặc ngày bản án có hiệu lực. Hãy xem giấy tờ nhận từ tòa án. Phải khai báo trong vòng 1 tháng kể từ ngày nhận bản sao quyết định cho phép.',
    },
    area: { x: 346, y: 679, w: 293, h: 51 },
    y: { x: 380, y: 684, w: 78, h: 42, align: 'right' },
    m: { x: 482, y: 684, w: 53, h: 42, align: 'right' },
    d: { x: 558, y: 684, w: 54, h: 42, align: 'right' },
  }),
  courtNameField({
    id: 'courtName', section: 'court', koLabel: '③ 법원명',
    help: {
      ko: '허가하거나 재판한 법원 이름을 적어요.',
      en: 'Name of the court that gave the permission or judgment.',
      zh: '填写作出许可或判决的法院名称。',
      ja: '許可または裁判をした裁判所名を書きます。',
      vi: 'Tên tòa án đã cho phép hoặc xét xử.',
    },
    area: { x: 731, y: 679, w: 314, h: 51 },
    box: { x: 767, y: 682, w: 273, h: 45, align: 'center' },
  }),

  // ── ④ 기타사항 ───────────────────────────────────────────
  otherNotesField({
    id: 'otherNotes', section: 'etc', koLabel: '④ 기타사항',
    area: { x: 346, y: 731, w: 699, h: 77 },
    box: { x: 384, y: 746, w: 655, h: 46 },
  }),

  // ── ⑤ 신고인 ─────────────────────────────────────────────
  reporterNameField({
    id: 'reporterName', section: 'reporter', koLabel: '⑤ 신고인 성명',
    area: { x: 346, y: 809, w: 329, h: 44 },
    box: { x: 382, y: 812, w: 170, h: 38, align: 'center' },
  }),
  idField({
    id: 'reporterId', section: 'reporter', koLabel: '⑤ 신고인 주민등록번호', who: WHO.reporter,
    area: { x: 834, y: 809, w: 211, h: 44 },
    front: { x: 870, y: 812, w: 62, h: 38, align: 'center' },
    back: { x: 949, y: 812, w: 92, h: 38, align: 'center' },
    copyFrom: [copyIdFrom('selfId', SELF)],
  }),
  {
    id: 'reporterQualification',
    section: 'reporter',
    koLabel: '⑤ 신고인 자격',
    label: { ko: '신고인 자격', en: 'Capacity of the person reporting', zh: '申报人资格', ja: '届出人の資格', vi: 'Tư cách người khai báo' },
    help: {
      ko: '신고하는 사람이 본인과 어떤 관계인지 골라요. 이 신고는 원칙적으로 본인이 각자 가족관계등록창설허가와 함께 해야 해요.',
      en: 'Choose how the reporting person is related to the person being registered. As a rule, each person must make this report themselves, together with the court permission.',
      zh: '选择申报人与本人的关系。原则上应由本人各自连同家族关系登记创设许可一并申报。',
      ja: '届出人が本人とどのような関係かを選びます。この届出は原則として本人がそれぞれ、家族関係登録創設許可とともに行わなければなりません。',
      vi: 'Chọn quan hệ giữa người khai báo và người được đăng ký. Về nguyên tắc, mỗi người phải tự khai báo kèm theo quyết định cho phép lập đăng ký.',
    },
    area: { x: 346, y: 854, w: 699, h: 43 },
    badge: 'margin',
    input: {
      kind: 'choice',
      mark: 'circle',
      options: [
        opt('self', '본인', { ko: '본인', en: 'The person themself', zh: '本人', ja: '本人', vi: 'Chính người đó' }, 370, 876),
        opt('spouse', '배우자', { ko: '배우자', en: 'Spouse', zh: '配偶', ja: '配偶者', vi: 'Vợ / chồng' }, 470, 876),
        opt('lineal', '직계혈족', { ko: '직계혈족', en: 'Lineal blood relative', zh: '直系血亲', ja: '直系血族', vi: 'Người thân trực hệ' }, 580, 876),
        opt('other', '기타', { ko: '기타', en: 'Other', zh: '其他', ja: 'その他', vi: 'Khác' }, 712, 876),
      ],
      extra: { ...OTHER_DETAIL, when: ['other'], box: { x: 840, y: 857, w: 150, h: 37, align: 'center' } },
    },
  },
  addressField({
    id: 'reporterAddress', section: 'reporter', koLabel: '⑤ 신고인 주소', who: WHO.reporter,
    area: { x: 346, y: 898, w: 312, h: 43 },
    box: { x: 382, y: 901, w: 272, h: 37, align: 'center' },
    copyFrom: [copyAddressFrom('selfAddress', SELF)],
  }),
  phoneField({
    id: 'reporterPhone', section: 'reporter', koLabel: '⑤ 전화',
    area: { x: 659, y: 898, w: 180, h: 43 },
    box: { x: 715, y: 901, w: 122, h: 37, align: 'center' },
  }),
  emailField({
    id: 'reporterEmail', section: 'reporter', koLabel: '⑤ 이메일',
    area: { x: 840, y: 898, w: 205, h: 43 },
    box: { x: 916, y: 901, w: 127, h: 37, align: 'center' },
  }),

  // ── ⑥ 제출인 ─────────────────────────────────────────────
  submitterNameField({
    id: 'submitterName', section: 'submitter', koLabel: '⑥ 제출인 성명',
    area: { x: 346, y: 942, w: 208, h: 47 },
    box: { x: 382, y: 945, w: 170, h: 41, align: 'center' },
  }),
  submitterIdField({
    id: 'submitterId', section: 'submitter', koLabel: '⑥ 제출인 주민등록번호',
    area: { x: 714, y: 942, w: 331, h: 47 },
    front: { x: 750, y: 945, w: 122, h: 41, align: 'center' },
    back: { x: 888, y: 945, w: 152, h: 41, align: 'center' },
  }),
];

export const familyRegisterCreation: FormDef = {
  id: 'family-register-creation',
  title: { ko: '가족관계등록 창설신고서', en: 'Family Register Creation Report', zh: '家族关系登记创立申报书', ja: '家族関係登録創設届', vi: 'Đơn báo cáo lập đăng ký quan hệ gia đình' },
  pages: [{ image: '/forms/family-register-creation_ko.png', width: 1190, height: 1682 }],
  sections: [
    { id: 'meta',      label: { ko: '신고일',                 en: 'Report date',          zh: '申报日期',       ja: '届出日',         vi: 'Ngày khai báo' } },
    { id: 'self',      label: { ko: '① 가족관계등록 창설자',  en: '① Person registered',  zh: '① 登记创设人',   ja: '① 登録創設者',   vi: '① Người được đăng ký' } },
    { id: 'parents',   label: { ko: '① 부모',                 en: '① Parents',            zh: '① 父母',         ja: '① 父母',         vi: '① Bố mẹ' } },
    { id: 'status',    label: { ko: '② 신분에 관한 사항',     en: '② Personal status',    zh: '② 身份事项',     ja: '② 身分事項',     vi: '② Thân phận' } },
    { id: 'court',     label: { ko: '③ 허가·재판',            en: '③ Court permission',   zh: '③ 许可·判决',    ja: '③ 許可・裁判',   vi: '③ Quyết định của tòa' } },
    { id: 'etc',       label: { ko: '④ 기타사항',             en: '④ Other notes',        zh: '④ 其他事项',     ja: '④ その他事項',   vi: '④ Ghi chú khác' } },
    { id: 'reporter',  label: { ko: '⑤ 신고인',               en: '⑤ Person reporting',   zh: '⑤ 申报人',       ja: '⑤ 届出人',       vi: '⑤ Người khai báo' } },
    { id: 'submitter', label: { ko: '⑥ 제출인',               en: '⑥ Submitter',          zh: '⑥ 提交人',       ja: '⑥ 提出人',       vi: '⑥ Người nộp thay' } },
  ],
  fields,
};
