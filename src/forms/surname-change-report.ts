import {
  addressField, courtNameField, dateField, emailField, hanjaSplitField, idField, nameSplitField, opt, originField,
  otherNotesField, OTHER_DETAIL, phoneField, reportDateField, reporterNameField, submitterIdField, submitterNameField,
  Who, WHO,
} from './common';
import { Box, FieldDef, FormDef, L } from './types';

// ─────────────────────────────────────────────────────────────
// 성·본 변경신고서 [양식 제34호] — v1 서식 7번
// 좌표는 public/forms/surname-change-report_ko.png (1190×1682) 기준.
// 안내 문구는 서식 아래 「작성 방법」을 바탕으로 작성.
// ─────────────────────────────────────────────────────────────

const SELF: Who = { ko: '사건본인', en: 'the person concerned', zh: '当事人', ja: '事件本人', vi: 'người đương sự' };

const BEFORE: L = { ko: '변경 전', en: 'before the change', zh: '变更前', ja: '変更前', vi: 'trước khi đổi' };
const AFTER: L = { ko: '변경한', en: 'after the change', zh: '变更后', ja: '変更後', vi: 'sau khi đổi' };

/** 성(姓) 또는 본(本) — 한글·한자를 한 번에 */
const surnameOrBon = (id: string, koLabel: string, kind: 'surname' | 'bon', when: L, area: Box, ko: Box, hanja: Box): FieldDef => {
  const what: L = kind === 'surname'
    ? { ko: '성', en: 'surname', zh: '姓', ja: '姓', vi: 'họ' }
    : { ko: '본', en: 'bon (family origin)', zh: '本贯', ja: '本', vi: 'bon (quê gốc dòng họ)' };
  return {
    id,
    section: 'surname',
    koLabel,
    label: { ko: `${when.ko} ${what.ko}`, en: `${what.en.charAt(0).toUpperCase() + what.en.slice(1)} ${when.en}`, zh: `${when.zh}的${what.zh}`, ja: `${when.ja}の${what.ja}`, vi: `${what.vi.charAt(0).toUpperCase() + what.vi.slice(1)} ${when.vi}` },
    help: {
      ko: `${when.ko} ${what.ko}을 한글과 한자로 적어요. 한자가 없으면 한글만 적어요. 성·본 변경허가심판서 등본을 보고 적어요.`,
      en: `The ${what.en} ${when.en}, in Hangul and Chinese characters (Hangul only if there are no Chinese characters). Copy it from the certified copy of the court ruling permitting the change.`,
      zh: `用韩文和汉字填写${when.zh}的${what.zh}。没有汉字则只填韩文。请参照姓·本变更许可审判书副本填写。`,
      ja: `${when.ja}の${what.ja}をハングルと漢字で書きます。漢字がなければハングルだけ書きます。姓・本変更許可審判書の謄本を見て書きます。`,
      vi: `Ghi ${what.vi} ${when.vi} bằng chữ Hàn và chữ Hán (nếu không có chữ Hán thì chỉ ghi chữ Hàn). Hãy xem bản sao quyết định cho phép đổi họ, bon của tòa án.`,
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
    { x: 228, y: 188, w: 84, h: 24, align: 'right' },
    { x: 338, y: 188, w: 72, h: 24, align: 'right' },
    { x: 436, y: 188, w: 74, h: 24, align: 'right' },
  ),

  // ── ① 사건본인 ───────────────────────────────────────────
  nameSplitField({
    id: 'personName', section: 'person', koLabel: '① 사건본인 성명 (한글)', who: SELF,
    area: { x: 316, y: 229, w: 338, h: 70 },
    surname: { x: 371, y: 241, w: 54, h: 48, align: 'center' },
    given: { x: 434, y: 241, w: 218, h: 48, align: 'center' },
  }),
  hanjaSplitField({
    id: 'personHanja', section: 'person', koLabel: '① 사건본인 성명 (한자)', who: SELF,
    area: { x: 316, y: 300, w: 338, h: 70 },
    surname: { x: 371, y: 311, w: 54, h: 48, align: 'center' },
    given: { x: 434, y: 311, w: 218, h: 48, align: 'center' },
  }),
  idField({
    id: 'personId', section: 'person', koLabel: '① 주민등록번호', who: SELF,
    area: { x: 754, y: 229, w: 292, h: 141 },
    front: { x: 790, y: 278, w: 101, h: 42, align: 'center' },
    back: { x: 908, y: 278, w: 135, h: 42, align: 'center' },
  }),
  originField({
    id: 'origin', section: 'person', koLabel: '① 등록기준지', who: SELF,
    area: { x: 316, y: 371, w: 730, h: 48 },
    box: { x: 352, y: 373, w: 690, h: 44, align: 'center' },
  }),
  addressField({
    id: 'address', section: 'person', koLabel: '① 주소', who: SELF,
    area: { x: 316, y: 420, w: 730, h: 48 },
    box: { x: 352, y: 422, w: 690, h: 44, align: 'center' },
  }),

  // ── ② 성·본 ──────────────────────────────────────────────
  surnameOrBon('surnameBefore', '② 변경전 성(姓)', 'surname', BEFORE,
    { x: 316, y: 470, w: 321, h: 55 }, { x: 370, y: 473, w: 102, h: 49, align: 'center' }, { x: 528, y: 473, w: 107, h: 49, align: 'center' }),
  surnameOrBon('bonBefore', '② 변경전 본(本)', 'bon', BEFORE,
    { x: 720, y: 470, w: 326, h: 55 }, { x: 778, y: 473, w: 99, h: 49, align: 'center' }, { x: 937, y: 473, w: 107, h: 49, align: 'center' }),
  surnameOrBon('surnameAfter', '② 변경한 성(姓)', 'surname', AFTER,
    { x: 316, y: 526, w: 321, h: 55 }, { x: 370, y: 529, w: 102, h: 49, align: 'center' }, { x: 528, y: 529, w: 107, h: 49, align: 'center' }),
  surnameOrBon('bonAfter', '② 변경한 본(本)', 'bon', AFTER,
    { x: 720, y: 526, w: 326, h: 55 }, { x: 778, y: 529, w: 99, h: 49, align: 'center' }, { x: 937, y: 529, w: 107, h: 49, align: 'center' }),

  // ── ③ 허가일자 ───────────────────────────────────────────
  dateField({
    id: 'permitDate', section: 'court', koLabel: '③ 허가일자',
    label: { ko: '성·본 변경 허가일', en: 'Date the change was permitted', zh: '姓·本变更许可日期', ja: '姓・本変更許可日', vi: 'Ngày cho phép đổi họ, bon' },
    help: {
      ko: '성·본변경허가심판서 등본에 적힌 날짜를 적어요. 등본을 받은 날부터 1개월 안에 신고해야 해요.',
      en: 'The date written on the certified copy of the court ruling permitting the change. You must report within 1 month of receiving it.',
      zh: '填写姓·本变更许可审判书副本上记载的日期。须在收到副本之日起1个月内申报。',
      ja: '姓・本変更許可審判書の謄本に記載された日付を書きます。謄本を受け取った日から1か月以内に届け出なければなりません。',
      vi: 'Ngày ghi trên bản sao quyết định cho phép đổi họ, bon. Phải khai báo trong vòng 1 tháng kể từ ngày nhận bản sao.',
    },
    area: { x: 316, y: 582, w: 321, h: 55 },
    badge: 'margin',
    y: { x: 330, y: 585, w: 74, h: 49, align: 'right' },
    m: { x: 440, y: 585, w: 64, h: 49, align: 'right' },
    d: { x: 538, y: 585, w: 64, h: 49, align: 'right' },
  }),
  courtNameField({
    id: 'courtName', section: 'court', koLabel: '③ 법원명',
    help: {
      ko: '성·본 변경을 허가한 법원 이름을 적어요.',
      en: 'Name of the court that permitted the change.',
      zh: '填写许可姓·本变更的法院名称。',
      ja: '姓・本の変更を許可した裁判所名を書きます。',
      vi: 'Tên tòa án đã cho phép đổi họ, bon.',
    },
    area: { x: 720, y: 582, w: 326, h: 55 },
    box: { x: 756, y: 585, w: 286, h: 49, align: 'center' },
  }),

  // ── ④ 기타사항 ───────────────────────────────────────────
  otherNotesField({
    id: 'otherNotes', section: 'etc', koLabel: '④ 기타사항',
    area: { x: 316, y: 638, w: 730, h: 83 },
    box: { x: 352, y: 655, w: 690, h: 50 },
  }),

  // ── ⑤ 신고인 ─────────────────────────────────────────────
  reporterNameField({
    id: 'reporterName', section: 'reporter', koLabel: '⑤ 신고인 성명',
    extra: {
      ko: '본인이 신고하면 성·본을 바꾼 뒤의 이름을 적어요.',
      en: 'If you are reporting your own change, write your name after the change.',
      zh: '本人申报时填写姓·本变更后的姓名。',
      ja: '本人が届け出る場合は姓・本変更後の氏名を書きます。',
      vi: 'Nếu tự khai báo cho mình, ghi họ tên sau khi đổi.',
    },
    area: { x: 316, y: 722, w: 344, h: 55 },
    box: { x: 352, y: 725, w: 196, h: 49, align: 'center' },
  }),
  idField({
    id: 'reporterId', section: 'reporter', koLabel: '⑤ 신고인 주민등록번호', who: WHO.reporter,
    area: { x: 799, y: 722, w: 247, h: 55 },
    front: { x: 835, y: 725, w: 79, h: 49, align: 'center' },
    back: { x: 930, y: 725, w: 113, h: 49, align: 'center' },
    copyFrom: [{ field: 'personId', label: { ko: '사건본인 번호 가져오기', en: 'Use the person’s number', zh: '使用当事人号码', ja: '事件本人の番号を使う', vi: 'Dùng số của người đương sự' }, map: { front: 'front', back: 'back' } }],
  }),
  {
    id: 'reporterQualification',
    section: 'reporter',
    koLabel: '⑤ 신고인 자격',
    label: { ko: '신고인 자격', en: 'Capacity of the person reporting', zh: '申报人资格', ja: '届出人の資格', vi: 'Tư cách người khai báo' },
    help: { ko: '신고하는 사람의 자격을 골라요.', en: 'Choose the capacity of the person reporting.', zh: '选择申报人的资格。', ja: '届出人の資格を選びます。', vi: 'Chọn tư cách của người khai báo.' },
    area: { x: 316, y: 778, w: 730, h: 43 },
    badge: 'margin',
    input: {
      kind: 'choice',
      mark: 'circle',
      options: [
        opt('self', '본인', { ko: '본인', en: 'The person themself', zh: '本人', ja: '本人', vi: 'Chính người đó' }, 340, 800),
        opt('legalRep', '법정대리인', { ko: '법정대리인', en: 'Legal representative', zh: '法定代理人', ja: '法定代理人', vi: 'Người đại diện theo pháp luật' }, 416, 800),
        opt('other', '기타', { ko: '기타', en: 'Other', zh: '其他', ja: 'その他', vi: 'Khác' }, 560, 800),
      ],
      extra: { ...OTHER_DETAIL, when: ['other'], box: { x: 688, y: 781, w: 294, h: 37, align: 'center' } },
    },
  },
  addressField({
    id: 'reporterAddress', section: 'reporter', koLabel: '⑤ 신고인 주소', who: WHO.reporter,
    area: { x: 316, y: 822, w: 338, h: 44 },
    box: { x: 352, y: 824, w: 299, h: 40, align: 'center' },
    copyFrom: [{ field: 'address', label: { ko: '사건본인 주소와 같아요', en: 'Same as the person’s address', zh: '与当事人地址相同', ja: '事件本人の住所と同じ', vi: 'Giống địa chỉ người đương sự' }, map: { address: 'address' } }],
  }),
  phoneField({
    id: 'reporterPhone', section: 'reporter', koLabel: '⑤ 전화',
    area: { x: 655, y: 822, w: 176, h: 44 },
    box: { x: 710, y: 824, w: 119, h: 40, align: 'center' },
  }),
  emailField({
    id: 'reporterEmail', section: 'reporter', koLabel: '⑤ 이메일',
    area: { x: 832, y: 822, w: 214, h: 44 },
    box: { x: 910, y: 824, w: 133, h: 40, align: 'center' },
  }),

  // ── ⑥ 제출인 ─────────────────────────────────────────────
  submitterNameField({
    id: 'submitterName', section: 'submitter', koLabel: '⑥ 제출인 성명',
    area: { x: 316, y: 867, w: 222, h: 52 },
    box: { x: 352, y: 870, w: 183, h: 46, align: 'center' },
  }),
  submitterIdField({
    id: 'submitterId', section: 'submitter', koLabel: '⑥ 제출인 주민등록번호',
    area: { x: 709, y: 867, w: 337, h: 52 },
    front: { x: 745, y: 870, w: 124, h: 46, align: 'center' },
    back: { x: 886, y: 870, w: 157, h: 46, align: 'center' },
  }),
];

export const surnameChangeReport: FormDef = {
  id: 'surname-change-report',
  title: { ko: '성본 변경 신고서', en: 'Surname Change Report', zh: '姓本变更申报书', ja: '姓本変更届', vi: 'Đơn báo cáo thay đổi họ' },
  pages: [{ image: '/forms/surname-change-report_ko.png', width: 1190, height: 1682 }],
  sections: [
    { id: 'meta',      label: { ko: '신고일',     en: 'Report date',        zh: '申报日期',   ja: '届出日',       vi: 'Ngày khai báo' } },
    { id: 'person',    label: { ko: '① 사건본인', en: '① Person concerned', zh: '① 当事人',   ja: '① 事件本人',   vi: '① Người đương sự' } },
    { id: 'surname',   label: { ko: '② 성·본',    en: '② Surname & bon',    zh: '② 姓·本',    ja: '② 姓・本',     vi: '② Họ & bon' } },
    { id: 'court',     label: { ko: '③ 허가일자', en: '③ Permission',       zh: '③ 许可日期', ja: '③ 許可日',     vi: '③ Ngày cho phép' } },
    { id: 'etc',       label: { ko: '④ 기타사항', en: '④ Other notes',      zh: '④ 其他事项', ja: '④ その他事項', vi: '④ Ghi chú khác' } },
    { id: 'reporter',  label: { ko: '⑤ 신고인',   en: '⑤ Person reporting', zh: '⑤ 申报人',   ja: '⑤ 届出人',     vi: '⑤ Người khai báo' } },
    { id: 'submitter', label: { ko: '⑥ 제출인',   en: '⑥ Submitter',        zh: '⑥ 提交人',   ja: '⑥ 提出人',     vi: '⑥ Người nộp thay' } },
  ],
  fields,
};
