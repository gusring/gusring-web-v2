import {
  addressField, courtNameField, dateField, emailField, hanjaSplitField, idField, nameSplitField, opt, originField,
  otherNotesField, OTHER_DETAIL, phoneField, reportDateField, reporterNameField, submitterIdField, submitterNameField,
  Who, WHO,
} from './common';
import { Box, FieldDef, FormDef, L } from './types';

// ─────────────────────────────────────────────────────────────
// 국적취득자의 성·본 창설신고서 [양식 제33호] — v1 서식 13번
// 좌표는 public/forms/surname-creation-report_ko.png (1190×1682) 기준.
// 안내 문구는 서식 아래 「작성 방법」을 바탕으로 작성.
// ─────────────────────────────────────────────────────────────

const SELF: Who = { ko: '창설하는 사람', en: 'the person creating a surname', zh: '创设人', ja: '創設者', vi: 'người lập họ' };

const PERIOD: L = {
  ko: '외국 성을 쓰던 국적취득자가 새 성·본을 정하는 신고예요. 가정법원의 성·본 창설 허가를 받은 날부터 1개월 안에 신고해야 해요.',
  en: 'This report is for a naturalized citizen who used a foreign surname and is creating a new Korean surname and bon. It must be filed within 1 month of being notified of the family court’s permission.',
  zh: '这是使用外国姓氏的国籍取得者新定姓·本时的申报。须在收到家庭法院姓·本创设许可通知之日起1个月内申报。',
  ja: '外国の姓を使っていた国籍取得者が新しい姓・本を定める届出です。家庭法院の姓・本創設許可の告知を受けた日から1か月以内に届け出なければなりません。',
  vi: 'Đây là tờ khai cho người nhập quốc tịch từng dùng họ nước ngoài, nay lập họ và bon mới. Phải khai báo trong vòng 1 tháng kể từ khi được thông báo quyết định cho phép của tòa gia đình.',
};

const surnameOrBon = (id: string, koLabel: string, kind: 'surname' | 'bon', created: boolean, area: Box, ko: Box, hanja: Box): FieldDef => {
  const what: L = kind === 'surname'
    ? { ko: '성', en: 'surname', zh: '姓', ja: '姓', vi: 'họ' }
    : { ko: '본', en: 'bon (family origin)', zh: '本贯', ja: '本', vi: 'bon (quê gốc dòng họ)' };
  const when: L = created
    ? { ko: '창설한', en: 'new', zh: '创设的', ja: '創設した', vi: 'mới lập' }
    : { ko: '종전의', en: 'previous', zh: '原来的', ja: '従前の', vi: 'trước đây' };
  return {
    id,
    section: 'surname',
    koLabel,
    label: { ko: `${when.ko} ${what.ko}`, en: `${when.en.charAt(0).toUpperCase() + when.en.slice(1)} ${what.en}`, zh: `${when.zh}${what.zh}`, ja: `${when.ja}${what.ja}`, vi: `${what.vi.charAt(0).toUpperCase() + what.vi.slice(1)} ${when.vi}` },
    help: created
      ? {
          ko: `법원이 허가한 새 ${what.ko}을 한글과 한자로 적어요. 허가결정서 등본을 보고 적어요.`,
          en: `The new ${what.en} permitted by the court, in Hangul and Chinese characters. Copy it from the certified copy of the permission decision.`,
          zh: `用韩文和汉字填写法院许可的新${what.zh}。请参照许可决定书副本填写。`,
          ja: `裁判所が許可した新しい${what.ja}をハングルと漢字で書きます。許可決定書の謄本を見て書きます。`,
          vi: `Ghi ${what.vi} mới được tòa cho phép, bằng chữ Hàn và chữ Hán. Hãy xem bản sao quyết định cho phép.`,
        }
      : {
          ko: `지금까지 쓰던 ${what.ko}을 적어요. 한글이나 한자가 아니면 기타사항 칸에 원래 글자로 적어요.`,
          en: `The ${what.en} used until now. If it is not in Hangul or Chinese characters, write it in its original script in the "Other notes" box.`,
          zh: `填写至今使用的${what.zh}。如不是韩文或汉字，请在“其他事项”栏用原文字填写。`,
          ja: `これまで使っていた${what.ja}を書きます。ハングルや漢字でない場合は「その他事項」欄に元の文字で書きます。`,
          vi: `Ghi ${what.vi} đang dùng đến nay. Nếu không phải chữ Hàn hay chữ Hán, ghi bằng chữ gốc ở ô "Ghi chú khác".`,
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

const fields: FieldDef[] = [
  reportDateField(
    { x: 150, y: 186, w: 460, h: 26 },
    { x: 228, y: 188, w: 86, h: 24, align: 'right' },
    { x: 337, y: 188, w: 74, h: 24, align: 'right' },
    { x: 435, y: 188, w: 76, h: 24, align: 'right' },
  ),

  // ── ① 성·본 창설자 ───────────────────────────────────────
  nameSplitField({
    id: 'personName', section: 'person', koLabel: '① 성·본 창설자 성명 (한글)', who: SELF,
    help: {
      ko: '창설하는 사람의 이름을 한글로 적어요. ' + PERIOD.ko,
      en: 'Name of the person creating the surname, in Korean letters. ' + PERIOD.en,
      zh: '用韩文填写创设人的姓名。' + PERIOD.zh,
      ja: '創設者の氏名をハングルで書きます。' + PERIOD.ja,
      vi: 'Họ tên người lập họ, bằng chữ Hàn. ' + PERIOD.vi,
    },
    area: { x: 316, y: 229, w: 320, h: 59 },
    surname: { x: 378, y: 240, w: 54, h: 44, align: 'center' },
    given: { x: 440, y: 240, w: 194, h: 44, align: 'center' },
  }),
  hanjaSplitField({
    id: 'personHanja', section: 'person', koLabel: '① 성·본 창설자 성명 (한자)', who: SELF,
    area: { x: 316, y: 289, w: 320, h: 59 },
    surname: { x: 378, y: 300, w: 54, h: 44, align: 'center' },
    given: { x: 440, y: 300, w: 194, h: 44, align: 'center' },
  }),
  idField({
    id: 'personId', section: 'person', koLabel: '① 주민등록번호', who: SELF,
    area: { x: 758, y: 229, w: 289, h: 119 },
    front: { x: 794, y: 268, w: 100, h: 42, align: 'center' },
    back: { x: 910, y: 268, w: 135, h: 42, align: 'center' },
  }),
  originField({ id: 'origin', section: 'person', koLabel: '① 등록기준지', who: SELF, area: { x: 316, y: 349, w: 731, h: 54 }, box: { x: 352, y: 352, w: 691, h: 48, align: 'center' } }),
  addressField({ id: 'address', section: 'person', koLabel: '① 주소', who: SELF, area: { x: 316, y: 405, w: 731, h: 54 }, box: { x: 352, y: 408, w: 691, h: 48, align: 'center' } }),

  // ── ② 성·본 ──────────────────────────────────────────────
  surnameOrBon('surnameBefore', '② 종전의 성(姓)', 'surname', false, { x: 316, y: 460, w: 319, h: 72 }, { x: 370, y: 480, w: 96, h: 44, align: 'center' }, { x: 532, y: 480, w: 102, h: 44, align: 'center' }),
  surnameOrBon('bonBefore', '② 종전의 본(本)', 'bon', false, { x: 712, y: 460, w: 335, h: 72 }, { x: 769, y: 480, w: 105, h: 44, align: 'center' }, { x: 933, y: 480, w: 112, h: 44, align: 'center' }),
  surnameOrBon('surnameCreated', '② 창설한 성(姓)', 'surname', true, { x: 316, y: 533, w: 319, h: 72 }, { x: 370, y: 553, w: 96, h: 44, align: 'center' }, { x: 532, y: 553, w: 102, h: 44, align: 'center' }),
  surnameOrBon('bonCreated', '② 창설한 본(本)', 'bon', true, { x: 712, y: 533, w: 335, h: 72 }, { x: 769, y: 553, w: 105, h: 44, align: 'center' }, { x: 933, y: 553, w: 112, h: 44, align: 'center' }),

  // ── ③ 허가일자 ───────────────────────────────────────────
  dateField({
    id: 'permitDate', section: 'court', koLabel: '③ 허가일자',
    label: { ko: '성·본 창설 허가일', en: 'Date the surname creation was permitted', zh: '姓·本创设许可日期', ja: '姓・本創設許可日', vi: 'Ngày cho phép lập họ, bon' },
    help: {
      ko: '가정법원이 성·본 창설을 허가한 날짜를 적어요. 허가결정서 등본을 보고 적어요.',
      en: 'The date the family court permitted the creation. Copy it from the certified copy of the permission decision.',
      zh: '填写家庭法院许可创设姓·本的日期。请参照许可决定书副本填写。',
      ja: '家庭法院が姓・本の創設を許可した日付を書きます。許可決定書の謄本を見て書きます。',
      vi: 'Ngày tòa gia đình cho phép lập họ, bon. Hãy xem bản sao quyết định cho phép.',
    },
    area: { x: 316, y: 606, w: 287, h: 44 },
    badge: 'margin',
    y: { x: 330, y: 609, w: 86, h: 38, align: 'right' },
    m: { x: 440, y: 609, w: 54, h: 38, align: 'right' },
    d: { x: 517, y: 609, w: 54, h: 38, align: 'right' },
  }),
  courtNameField({
    id: 'courtName', section: 'court', koLabel: '③ 법원명',
    help: { ko: '성·본 창설을 허가한 가정법원 이름을 적어요.', en: 'Name of the family court that permitted the creation.', zh: '填写许可创设姓·本的家庭法院名称。', ja: '姓・本の創設を許可した家庭法院名を書きます。', vi: 'Tên tòa gia đình đã cho phép lập họ, bon.' },
    area: { x: 712, y: 606, w: 335, h: 44 },
    box: { x: 748, y: 609, w: 295, h: 38, align: 'center' },
  }),

  // ── ④ 기타사항 ───────────────────────────────────────────
  otherNotesField({
    id: 'otherNotes', section: 'etc', koLabel: '④ 기타사항',
    extra: {
      ko: '예) 창설 전의 성과 본이 한자나 한글이 아니면 원래 글자로 적어요.',
      en: 'e.g., if the previous surname and bon were not in Chinese characters or Hangul, write them in the original script.',
      zh: '例：创设前的姓和本如不是汉字或韩文，用原文字填写。',
      ja: '例）創設前の姓と本が漢字やハングルでない場合は、元の文字で書きます。',
      vi: 'VD: nếu họ và bon trước khi lập không phải chữ Hán hay chữ Hàn, ghi bằng chữ gốc.',
    },
    area: { x: 316, y: 651, w: 731, h: 77 },
    box: { x: 352, y: 666, w: 691, h: 48 },
  }),

  // ── ⑤ 신고인 ─────────────────────────────────────────────
  reporterNameField({
    id: 'reporterName', section: 'reporter', koLabel: '⑤ 신고인 성명',
    extra: { ko: '본인이 신고하면 창설한 뒤의 이름을 적어요.', en: 'If you are reporting for yourself, write your name after the creation.', zh: '本人申报时填写创设后的姓名。', ja: '本人が届け出る場合は創設後の氏名を書きます。', vi: 'Nếu tự khai báo, ghi họ tên sau khi lập họ.' },
    area: { x: 316, y: 729, w: 320, h: 56 },
    box: { x: 352, y: 735, w: 170, h: 44, align: 'center' },
  }),
  idField({
    id: 'reporterId', section: 'reporter', koLabel: '⑤ 신고인 주민등록번호', who: WHO.reporter,
    area: { x: 781, y: 729, w: 266, h: 56 },
    front: { x: 817, y: 735, w: 88, h: 44, align: 'center' },
    back: { x: 922, y: 735, w: 123, h: 44, align: 'center' },
    copyFrom: [{ field: 'personId', label: { ko: '창설자 번호 가져오기', en: 'Use the person’s number', zh: '使用创设人号码', ja: '創設者の番号を使う', vi: 'Dùng số của người lập họ' }, map: { front: 'front', back: 'back' } }],
  }),
  {
    id: 'reporterQualification', section: 'reporter', koLabel: '⑤ 신고인 자격',
    label: { ko: '신고인 자격', en: 'Capacity of the person reporting', zh: '申报人资格', ja: '届出人の資格', vi: 'Tư cách người khai báo' },
    help: { ko: '신고하는 사람의 자격을 골라요.', en: 'Choose the capacity of the person reporting.', zh: '选择申报人的资格。', ja: '届出人の資格を選びます。', vi: 'Chọn tư cách của người khai báo.' },
    area: { x: 316, y: 786, w: 731, h: 68 },
    badge: 'margin',
    input: {
      kind: 'choice', mark: 'circle',
      options: [
        opt('self', '본인', { ko: '본인', en: 'The person themself', zh: '本人', ja: '本人', vi: 'Chính người đó' }, 340, 820),
        opt('legalRep', '법정대리인', { ko: '법정대리인', en: 'Legal representative', zh: '法定代理人', ja: '法定代理人', vi: 'Người đại diện theo pháp luật' }, 438, 820),
        opt('other', '기타', { ko: '기타', en: 'Other', zh: '其他', ja: 'その他', vi: 'Khác' }, 604, 820),
      ],
      extra: { ...OTHER_DETAIL, when: ['other'], box: { x: 732, y: 806, w: 292, h: 30, align: 'center' } },
    },
  },
  addressField({
    id: 'reporterAddress', section: 'reporter', koLabel: '⑤ 신고인 주소', who: WHO.reporter,
    area: { x: 316, y: 855, w: 314, h: 56 }, box: { x: 352, y: 859, w: 275, h: 48, align: 'center' },
    copyFrom: [{ field: 'address', label: { ko: '창설자 주소와 같아요', en: 'Same as the person’s address', zh: '与创设人地址相同', ja: '創設者の住所と同じ', vi: 'Giống địa chỉ người lập họ' }, map: { address: 'address' } }],
  }),
  phoneField({ id: 'reporterPhone', section: 'reporter', koLabel: '⑤ 전화', area: { x: 631, y: 855, w: 194, h: 56 }, box: { x: 691, y: 859, w: 132, h: 48, align: 'center' } }),
  emailField({ id: 'reporterEmail', section: 'reporter', koLabel: '⑤ 이메일', area: { x: 826, y: 855, w: 221, h: 56 }, box: { x: 903, y: 859, w: 141, h: 48, align: 'center' } }),

  // ── ⑥ 제출인 ─────────────────────────────────────────────
  submitterNameField({ id: 'submitterName', section: 'submitter', koLabel: '⑥ 제출인 성명', area: { x: 316, y: 914, w: 222, h: 57 }, box: { x: 352, y: 919, w: 183, h: 48, align: 'center' } }),
  submitterIdField({ id: 'submitterId', section: 'submitter', koLabel: '⑥ 제출인 주민등록번호', area: { x: 690, y: 914, w: 357, h: 57 }, front: { x: 726, y: 919, w: 133, h: 48, align: 'center' }, back: { x: 876, y: 919, w: 168, h: 48, align: 'center' } }),
];

export const surnameCreationReport: FormDef = {
  id: 'surname-creation-report',
  title: { ko: '창성신고서', en: 'Surname Creation', zh: '创姓申报书', ja: '創姓届', vi: 'Đơn báo cáo lập họ' },
  pages: [{ image: '/forms/surname-creation-report_ko.png', width: 1190, height: 1682 }],
  sections: [
    { id: 'meta',      label: { ko: '신고일',             en: 'Report date',          zh: '申报日期',   ja: '届出日',       vi: 'Ngày khai báo' } },
    { id: 'person',    label: { ko: '① 성·본 창설자',     en: '① Person',             zh: '① 创设人',   ja: '① 創設者',     vi: '① Người lập họ' } },
    { id: 'surname',   label: { ko: '② 성·본',            en: '② Surname & bon',      zh: '② 姓·本',    ja: '② 姓・本',     vi: '② Họ & bon' } },
    { id: 'court',     label: { ko: '③ 허가일자',         en: '③ Permission',         zh: '③ 许可日期', ja: '③ 許可日',     vi: '③ Ngày cho phép' } },
    { id: 'etc',       label: { ko: '④ 기타사항',         en: '④ Other notes',        zh: '④ 其他事项', ja: '④ その他事項', vi: '④ Ghi chú khác' } },
    { id: 'reporter',  label: { ko: '⑤ 신고인',           en: '⑤ Person reporting',   zh: '⑤ 申报人',   ja: '⑤ 届出人',     vi: '⑤ Người khai báo' } },
    { id: 'submitter', label: { ko: '⑥ 제출인',           en: '⑥ Submitter',          zh: '⑥ 提交人',   ja: '⑥ 提出人',     vi: '⑥ Người nộp thay' } },
  ],
  fields,
};
