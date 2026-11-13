import {
  addressField, bonField, courtNameField, dateField, emailField, hanjaSplitField, idField, nameSplitField, opt,
  originField, otherNotesField, OTHER_DETAIL, phoneField, reportDateField, reporterNameField, submitterIdField,
  submitterNameField, Who, WHO,
} from './common';
import { FieldDef, FormDef, L } from './types';

// ─────────────────────────────────────────────────────────────
// 개명신고서 [양식 제27호] — v1 서식 6번
// 좌표는 public/forms/name-change-report_ko.png (1190×1682) 기준.
// 안내 문구는 서식 아래 「작성 방법」을 바탕으로 작성.
// ─────────────────────────────────────────────────────────────

const SELF: Who = { ko: '본인', en: 'the person changing the name', zh: '改名人', ja: '改名する本人', vi: 'người đổi tên' };

const BEFORE: L = { ko: '개명 전', en: 'before the change', zh: '改名前', ja: '改名前', vi: 'trước khi đổi' };
const AFTER: L = { ko: '개명 후', en: 'after the change', zh: '改名后', ja: '改名後', vi: 'sau khi đổi' };

const AFTER_HELP: L = {
  ko: '법원의 개명허가결정등본에 적힌, 허가받은 새 이름을 적어요.',
  en: 'The new name permitted by the court, as written on the certified copy of the name-change permission decision.',
  zh: '填写法院改名许可决定书副本上记载的、获准的新名字。',
  ja: '裁判所の改名許可決定謄本に記載された、許可を受けた新しい名前を書きます。',
  vi: 'Tên mới được tòa cho phép, đúng như ghi trong bản sao quyết định cho phép đổi tên.',
};

const nameHelp = (when: L, extra?: L): L => ({
  ko: `${when.ko} 이름을 한글로 적어요. 성과 이름을 나눠 입력해요.` + (extra ? ' ' + extra.ko : ''),
  en: `The name ${when.en}, in Korean letters (Hangul). Enter the surname and given name separately.` + (extra ? ' ' + extra.en : ''),
  zh: `用韩文填写${when.zh}的姓名，姓和名分开输入。` + (extra ? extra.zh : ''),
  ja: `${when.ja}の氏名をハングルで書きます。姓と名を分けて入力します。` + (extra ? extra.ja : ''),
  vi: `Họ tên ${when.vi}, bằng chữ Hàn (Hangul). Nhập họ và tên riêng.` + (extra ? ' ' + extra.vi : ''),
});

const label = (when: L, kind: 'ko' | 'hanja'): L => kind === 'ko'
  ? { ko: `${when.ko} 이름 (한글)`, en: `Name ${when.en} (Hangul)`, zh: `${when.zh}姓名（韩文）`, ja: `${when.ja}の氏名（ハングル）`, vi: `Họ tên ${when.vi} (Hangul)` }
  : { ko: `${when.ko} 이름 (한자)`, en: `Name ${when.en} (Chinese characters)`, zh: `${when.zh}姓名（汉字）`, ja: `${when.ja}の氏名（漢字）`, vi: `Họ tên ${when.vi} (chữ Hán)` };

const fields: FieldDef[] = [
  reportDateField(
    { x: 150, y: 170, w: 340, h: 30 },
    { x: 184, y: 172, w: 74, h: 26, align: 'right' },
    { x: 281, y: 172, w: 64, h: 26, align: 'right' },
    { x: 369, y: 172, w: 65, h: 26, align: 'right' },
  ),

  // ── ① 개명자 · ② 개명 후 이름 ────────────────────────────
  {
    ...nameSplitField({
      id: 'nameBefore', section: 'person', koLabel: '① 개명 전 이름 (한글)', who: SELF, help: nameHelp(BEFORE),
      area: { x: 327, y: 245, w: 165, h: 60 },
      surname: { x: 380, y: 252, w: 44, h: 46, align: 'center' },
      given: { x: 430, y: 252, w: 61, h: 46, align: 'center' },
    }),
    label: label(BEFORE, 'ko'),
  },
  {
    ...hanjaSplitField({
      id: 'hanjaBefore', section: 'person', koLabel: '① 개명 전 이름 (한자)', who: SELF,
      area: { x: 493, y: 245, w: 189, h: 60 },
      surname: { x: 549, y: 252, w: 44, h: 46, align: 'center' },
      given: { x: 600, y: 252, w: 80, h: 46, align: 'center' },
    }),
    label: label(BEFORE, 'hanja'),
  },
  {
    ...nameSplitField({
      id: 'nameAfter', section: 'person', koLabel: '② 개명 후 이름 (한글)', who: SELF, help: nameHelp(AFTER, AFTER_HELP),
      area: { x: 683, y: 245, w: 161, h: 60 },
      surname: { x: 735, y: 252, w: 44, h: 46, align: 'center' },
      given: { x: 786, y: 252, w: 57, h: 46, align: 'center' },
    }),
    label: label(AFTER, 'ko'),
  },
  {
    ...hanjaSplitField({
      id: 'hanjaAfter', section: 'person', koLabel: '② 개명 후 이름 (한자)', who: SELF,
      area: { x: 845, y: 245, w: 201, h: 60 },
      surname: { x: 899, y: 252, w: 44, h: 46, align: 'center' },
      given: { x: 950, y: 252, w: 94, h: 46, align: 'center' },
    }),
    label: label(AFTER, 'hanja'),
    help: {
      ko: '허가받은 새 이름에 한자가 있을 때만 적어요. 한자가 없으면 한글 칸에만 적어요.',
      en: 'Only if the newly permitted name has Chinese characters. If not, fill in only the Hangul box.',
      zh: '仅在获准的新名字有汉字时填写。没有汉字则只填韩文栏。',
      ja: '許可を受けた新しい名前に漢字がある場合のみ書きます。漢字がなければハングル欄だけに書きます。',
      vi: 'Chỉ ghi nếu tên mới được cho phép có chữ Hán. Nếu không, chỉ ghi ở ô Hangul.',
    },
  },
  bonField({
    id: 'bon', section: 'person', koLabel: '① 본(한자)', who: SELF,
    area: { x: 327, y: 306, w: 219, h: 55 },
    box: { x: 363, y: 309, w: 180, h: 49, align: 'center' },
  }),
  idField({
    id: 'personId', section: 'person', koLabel: '① 주민등록번호', who: SELF,
    area: { x: 733, y: 306, w: 313, h: 55 },
    front: { x: 769, y: 309, w: 112, h: 49, align: 'center' },
    back: { x: 897, y: 309, w: 147, h: 49, align: 'center' },
  }),
  originField({
    id: 'origin', section: 'person', koLabel: '① 등록기준지', who: SELF,
    area: { x: 327, y: 362, w: 719, h: 50 },
    box: { x: 363, y: 365, w: 679, h: 44, align: 'center' },
  }),
  addressField({
    id: 'address', section: 'person', koLabel: '① 주소', who: SELF,
    area: { x: 327, y: 413, w: 719, h: 62 },
    box: { x: 363, y: 417, w: 679, h: 54, align: 'center' },
  }),

  // ── ③ 허가일자 ───────────────────────────────────────────
  dateField({
    id: 'permitDate', section: 'court', koLabel: '③ 허가일자',
    label: { ko: '개명 허가일', en: 'Date the name change was permitted', zh: '改名许可日期', ja: '改名許可日', vi: 'Ngày cho phép đổi tên' },
    help: {
      ko: '개명허가결정등본에 적힌 날짜를 적어요. 결정등본을 받은 날부터 1개월 안에 신고해야 해요.',
      en: 'The date written on the certified copy of the permission decision. You must report within 1 month of receiving it.',
      zh: '填写改名许可决定书副本上记载的日期。须在收到决定书副本之日起1个月内申报。',
      ja: '改名許可決定謄本に記載された日付を書きます。決定謄本を受け取った日から1か月以内に届け出なければなりません。',
      vi: 'Ngày ghi trên bản sao quyết định cho phép đổi tên. Phải khai báo trong vòng 1 tháng kể từ ngày nhận bản sao đó.',
    },
    area: { x: 327, y: 476, w: 330, h: 55 },
    badge: 'margin',
    y: { x: 330, y: 479, w: 63, h: 49, align: 'right' },
    m: { x: 416, y: 479, w: 66, h: 49, align: 'right' },
    d: { x: 504, y: 479, w: 66, h: 49, align: 'right' },
  }),
  courtNameField({
    id: 'courtName', section: 'court', koLabel: '③ 법원명',
    help: {
      ko: '개명을 허가한 법원 이름을 적어요.',
      en: 'Name of the court that permitted the name change.',
      zh: '填写许可改名的法院名称。',
      ja: '改名を許可した裁判所名を書きます。',
      vi: 'Tên tòa án đã cho phép đổi tên.',
    },
    area: { x: 733, y: 476, w: 313, h: 55 },
    box: { x: 769, y: 479, w: 273, h: 49, align: 'center' },
  }),

  // ── ④ 기타사항 ───────────────────────────────────────────
  otherNotesField({
    id: 'otherNotes', section: 'etc', koLabel: '④ 기타사항',
    area: { x: 327, y: 532, w: 719, h: 61 },
    box: { x: 363, y: 539, w: 679, h: 48 },
  }),

  // ── ⑤ 신고인 ─────────────────────────────────────────────
  reporterNameField({
    id: 'reporterName', section: 'reporter', koLabel: '⑤ 신고인 성명',
    extra: {
      ko: '본인이 신고하면 개명 후의 이름을 적어요.',
      en: 'If you are reporting your own name change, write the new name.',
      zh: '本人申报时填写改名后的姓名。',
      ja: '本人が届け出る場合は改名後の氏名を書きます。',
      vi: 'Nếu tự khai báo cho mình, ghi tên sau khi đổi.',
    },
    area: { x: 327, y: 594, w: 330, h: 61 },
    box: { x: 363, y: 600, w: 160, h: 49, align: 'center' },
  }),
  idField({
    id: 'reporterId', section: 'reporter', koLabel: '⑤ 신고인 주민등록번호', who: WHO.reporter,
    area: { x: 797, y: 594, w: 249, h: 61 },
    front: { x: 833, y: 600, w: 80, h: 49, align: 'center' },
    back: { x: 929, y: 600, w: 114, h: 49, align: 'center' },
    copyFrom: [{ field: 'personId', label: { ko: '본인 번호 가져오기', en: 'Use the person’s number', zh: '使用本人号码', ja: '本人の番号を使う', vi: 'Dùng số của người đổi tên' }, map: { front: 'front', back: 'back' } }],
  }),
  {
    id: 'reporterQualification',
    section: 'reporter',
    koLabel: '⑤ 신고인 자격',
    label: { ko: '신고인 자격', en: 'Capacity of the person reporting', zh: '申报人资格', ja: '届出人の資格', vi: 'Tư cách người khai báo' },
    help: { ko: '신고하는 사람의 자격을 골라요.', en: 'Choose the capacity of the person reporting.', zh: '选择申报人的资格。', ja: '届出人の資格を選びます。', vi: 'Chọn tư cách của người khai báo.' },
    area: { x: 327, y: 656, w: 719, h: 43 },
    badge: 'margin',
    input: {
      kind: 'choice',
      mark: 'circle',
      options: [
        opt('self', '본인', { ko: '본인', en: 'The person themself', zh: '本人', ja: '本人', vi: 'Chính người đó' }, 350, 678),
        opt('legalRep', '법정대리인', { ko: '법정대리인', en: 'Legal representative', zh: '法定代理人', ja: '法定代理人', vi: 'Người đại diện theo pháp luật' }, 450, 678),
        opt('other', '기타', { ko: '기타', en: 'Other', zh: '其他', ja: 'その他', vi: 'Khác' }, 614, 678),
      ],
      extra: { ...OTHER_DETAIL, when: ['other'], box: { x: 742, y: 659, w: 262, h: 37, align: 'center' } },
    },
  },
  addressField({
    id: 'reporterAddress', section: 'reporter', koLabel: '⑤ 신고인 주소', who: WHO.reporter,
    area: { x: 327, y: 700, w: 287, h: 50 },
    box: { x: 363, y: 703, w: 248, h: 44, align: 'center' },
    copyFrom: [{ field: 'address', label: { ko: '본인 주소와 같아요', en: 'Same as the person’s address', zh: '与本人地址相同', ja: '本人の住所と同じ', vi: 'Giống địa chỉ người đổi tên' }, map: { address: 'address' } }],
  }),
  phoneField({
    id: 'reporterPhone', section: 'reporter', koLabel: '⑤ 전화',
    area: { x: 615, y: 700, w: 203, h: 50 },
    box: { x: 671, y: 703, w: 145, h: 44, align: 'center' },
  }),
  emailField({
    id: 'reporterEmail', section: 'reporter', koLabel: '⑤ 이메일',
    area: { x: 819, y: 700, w: 227, h: 50 },
    box: { x: 892, y: 703, w: 151, h: 44, align: 'center' },
  }),

  // ── ⑥ 제출인 ─────────────────────────────────────────────
  submitterNameField({
    id: 'submitterName', section: 'submitter', koLabel: '⑥ 제출인 성명',
    area: { x: 327, y: 751, w: 199, h: 64 },
    box: { x: 363, y: 757, w: 160, h: 52, align: 'center' },
  }),
  submitterIdField({
    id: 'submitterId', section: 'submitter', koLabel: '⑥ 제출인 주민등록번호',
    area: { x: 670, y: 751, w: 376, h: 64 },
    front: { x: 706, y: 757, w: 143, h: 52, align: 'center' },
    back: { x: 866, y: 757, w: 177, h: 52, align: 'center' },
  }),
];

export const nameChangeReport: FormDef = {
  id: 'name-change-report',
  title: { ko: '개명신고서', en: 'Name Change Report', zh: '改名申报书', ja: '改名届', vi: 'Đơn báo cáo đổi tên' },
  pages: [{ image: '/forms/name-change-report_ko.png', width: 1190, height: 1682 }],
  sections: [
    { id: 'meta',      label: { ko: '신고일',           en: 'Report date',        zh: '申报日期',     ja: '届出日',       vi: 'Ngày khai báo' } },
    { id: 'person',    label: { ko: '① 개명자 · ② 개명 후 이름', en: '① Person · ② New name', zh: '① 改名人 · ② 新名字', ja: '① 改名者・② 改名後の名', vi: '① Người đổi tên · ② Tên mới' } },
    { id: 'court',     label: { ko: '③ 허가일자',       en: '③ Permission',       zh: '③ 许可日期',   ja: '③ 許可日',     vi: '③ Ngày cho phép' } },
    { id: 'etc',       label: { ko: '④ 기타사항',       en: '④ Other notes',      zh: '④ 其他事项',   ja: '④ その他事項', vi: '④ Ghi chú khác' } },
    { id: 'reporter',  label: { ko: '⑤ 신고인',         en: '⑤ Person reporting', zh: '⑤ 申报人',     ja: '⑤ 届出人',     vi: '⑤ Người khai báo' } },
    { id: 'submitter', label: { ko: '⑥ 제출인',         en: '⑥ Submitter',        zh: '⑥ 提交人',     ja: '⑥ 提出人',     vi: '⑥ Người nộp thay' } },
  ],
  fields,
};
