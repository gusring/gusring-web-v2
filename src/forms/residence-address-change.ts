import { dateField, nationalityField, opt, textField, Who } from './common';
import { Box, FieldDef, FormDef, L } from './types';

// ─────────────────────────────────────────────────────────────
// 국내거소 이전신고서 (Change of Address Notification Form for Overseas Koreans)
// [재외동포의 출입국과 법적 지위에 관한 법률 시행규칙 별지 제1호의3서식] — v1 서식 21번
// 좌표는 public/forms/residence-address-change_ko.png (1190×1682) 기준.
// 한국어 작성 방법 이미지가 없어, 서식에 인쇄된 안내(작성 언어, 거주 형태 표기, 첨부서류, 위임장)만 근거로 쓴다.
// 서명, 행정정보 공동이용 동의서 서명란은 입력받지 않는다.
// ─────────────────────────────────────────────────────────────

const REPORTER: Who = { ko: '신고인', en: 'the person reporting', zh: '申报人', ja: '届出人', vi: 'người khai báo' };

const cell = (x: number, y: number, x2: number, y2: number): Box => ({ x: x + 1, y: y + 1, w: x2 - x - 2, h: y2 - y - 2 });
const inBox = (a: Box, align: Box['align'] = 'center'): Box => ({ x: a.x + 36, y: a.y + 4, w: a.w - 42, h: a.h - 8, align });

/** 이 서식은 한글 또는 영문으로 쓴다 */
const LANG_NOTE: L = {
  ko: ' 이 신고서는 한글 또는 영문으로 써요.',
  en: ' This form may be filled in Korean or English.',
  zh: '本申报书可用韩文或英文填写。',
  ja: 'この届出書は韓国語または英語で書きます。',
  vi: ' Tờ khai này có thể ghi bằng tiếng Hàn hoặc tiếng Anh.',
};

const fields: FieldDef[] = [
  textField({
    id: 'name', section: 'person', koLabel: '성명 (Full Name)',
    label: { ko: '성명', en: 'Full name', zh: '姓名', ja: '氏名', vi: 'Họ tên' },
    help: { ko: '국내거소신고증에 적힌 이름을 적어요.' + LANG_NOTE.ko, en: 'Your name as on your Overseas Korean Resident Card.' + LANG_NOTE.en, zh: '填写国内居所申报证上的姓名。' + LANG_NOTE.zh, ja: '国内居所申告証に記載された氏名を書きます。' + LANG_NOTE.ja, vi: 'Họ tên như trên thẻ khai báo cư trú trong nước.' + LANG_NOTE.vi },
    area: cell(235, 260, 1078, 326),
    part: { key: 'name', box: inBox(cell(235, 260, 1078, 326)), placeholder: '예) HONG GILDONG' },
  }),
  {
    id: 'sex', section: 'person', koLabel: '성별 (Sex)',
    label: { ko: '성별', en: 'Sex', zh: '性别', ja: '性別', vi: 'Giới tính' },
    help: { ko: '성별을 골라요.', en: 'Choose your sex.', zh: '选择性别。', ja: '性別を選びます。', vi: 'Chọn giới tính.' },
    area: cell(235, 326, 439, 392), badgeAt: { x: 420, y: 340 },
    input: {
      kind: 'choice', mark: 'check',
      options: [
        opt('M', '남', { ko: '남', en: 'Male', zh: '男', ja: '男', vi: 'Nam' }, 267, 359),
        opt('F', '여', { ko: '여', en: 'Female', zh: '女', ja: '女', vi: 'Nữ' }, 367, 359),
      ],
    },
  },
  nationalityField({ id: 'nationality', section: 'person', koLabel: '국적 (Nationality)', who: REPORTER, area: cell(576, 326, 712, 392), box: inBox(cell(576, 326, 712, 392)) }),
  textField({
    id: 'phone', section: 'person', koLabel: '연락처 (Phone No.)',
    label: { ko: '연락처', en: 'Phone number', zh: '联系电话', ja: '連絡先', vi: 'Số điện thoại' },
    help: { ko: '연락 가능한 휴대전화 번호를 적어요.', en: 'A mobile number where you can be reached.', zh: '填写可以联系到的手机号码。', ja: '連絡のつく携帯電話番号を書きます。', vi: 'Số điện thoại di động có thể liên lạc được.' },
    area: cell(849, 326, 1078, 392),
    part: { key: 'phone', box: inBox(cell(849, 326, 1078, 392)), inputMode: 'tel', placeholder: '010-1234-5678' },
  }),
  {
    id: 'residentNo', section: 'person', koLabel: '국내거소신고번호 (Overseas Korean Resident No.)',
    label: { ko: '국내거소신고번호', en: 'Overseas Korean Resident No.', zh: '国内居所申报号', ja: '国内居所申告番号', vi: 'Số khai báo cư trú trong nước' },
    help: { ko: '국내거소신고증에 적힌 13자리 번호를 적어요.', en: 'The 13-digit number on your Overseas Korean Resident Card.', zh: '填写国内居所申报证上的13位号码。', ja: '国内居所申告証に記載された13桁の番号を書きます。', vi: 'Số 13 chữ số trên thẻ khai báo cư trú trong nước.' },
    area: cell(439, 392, 1078, 458), badgeAt: { x: 420, y: 425 },
    input: { kind: 'idnum', front: { x: 443, y: 400, w: 266, h: 50, align: 'center' }, back: { x: 762, y: 400, w: 312, h: 50, align: 'center' } },
  },
  textField({
    id: 'newAddress', section: 'person', koLabel: '변경된 대한민국 내 주소 (New Address in Korea)',
    label: { ko: '새 주소 (한국)', en: 'New address in Korea', zh: '变更后的韩国国内地址', ja: '変更後の韓国内の住所', vi: 'Địa chỉ mới tại Hàn Quốc' },
    help: { ko: '이사한 새 주소를 적어요.' + LANG_NOTE.ko, en: 'Your new address after moving.' + LANG_NOTE.en, zh: '填写搬家后的新地址。' + LANG_NOTE.zh, ja: '引っ越した後の新しい住所を書きます。' + LANG_NOTE.ja, vi: 'Địa chỉ mới sau khi chuyển nhà.' + LANG_NOTE.vi },
    area: cell(326, 458, 1078, 542),
    part: { key: 'address', box: inBox(cell(326, 458, 1078, 542)), placeholder: '예) 서울시 금천구 시흥대로73길 70' },
  }),
  {
    id: 'residenceType', section: 'person', koLabel: '거주 형태 (Type of Residence)',
    label: { ko: '거주 형태', en: 'Type of residence', zh: '居住形态', ja: '居住形態', vi: 'Hình thức cư trú' },
    help: {
      ko: '새 집에 어떻게 사는지 골라요. 가족 모두가 함께 신고할 때는, 집 주인이나 임대차 계약을 한 본인 외의 가족은 「그 밖의 형태」를 골라요.',
      en: 'Choose how you live in the new home. When the whole family reports together, family members other than the owner or the person who signed the lease choose "Others".',
      zh: '选择在新住处的居住方式。全家一起申报时，房主或签订租赁合同的本人以外的家庭成员选择“其他形态”。',
      ja: '新しい住まいでの居住形態を選びます。家族全員で届け出る場合、所有者または賃貸借契約をした本人以外の家族は「その他の形態」を選びます。',
      vi: 'Chọn hình thức cư trú ở nhà mới. Khi cả gia đình cùng khai báo, các thành viên không phải chủ nhà hay người ký hợp đồng thuê thì chọn "Hình thức khác".',
    },
    area: cell(326, 542, 1078, 648), badgeAt: { x: 1095, y: 566 },
    input: {
      kind: 'choice', mark: 'check',
      options: [
        opt('own', '자가', { ko: '자가 (내 집)', en: 'House of your own', zh: '自有住房', ja: '持ち家', vi: 'Nhà riêng' }, 351, 566),
        opt('rent', '전세·월세', { ko: '전세·월세', en: 'Rental (full deposit or monthly rent)', zh: '全租·月租', ja: 'チョンセ・月払い家賃', vi: 'Thuê (đặt cọc toàn bộ hoặc trả tháng)' }, 351, 596),
        opt('other', '그 밖의 형태', { ko: '그 밖의 형태', en: 'Others', zh: '其他形态', ja: 'その他の形態', vi: 'Hình thức khác' }, 351, 626),
      ],
      extra: { key: 'detail', when: ['other'], box: { x: 592, y: 616, w: 446, h: 22, align: 'center' }, label: { ko: '그 밖의 형태 (내용)', en: 'Others (details)', zh: '其他（具体）', ja: 'その他（内容）', vi: 'Khác (chi tiết)' }, placeholder: '예) 가족과 함께 거주' },
    },
  },
  dateField({
    id: 'reportDate', section: 'report', koLabel: '신고일 (Date of Notification)',
    label: { ko: '신고하는 날짜', en: 'Date of notification', zh: '申报日期', ja: '届出日', vi: 'Ngày khai báo' },
    help: { ko: '이 신고서를 제출하는 날짜예요. 보통 오늘 날짜를 적어요.', en: "The date you submit this. Usually today's date.", zh: '提交本申报书的日期，通常填写今天的日期。', ja: 'この届出を提出する日付です。通常は今日の日付を書きます。', vi: 'Ngày bạn nộp tờ khai này. Thường là ngày hôm nay.' },
    area: cell(326, 743, 523, 822),
    box: inBox(cell(326, 743, 523, 822)),
  }),
  textField({
    id: 'reporterName', section: 'report', koLabel: '신고인 (Name of Person who Reports the Change)',
    label: { ko: '신고인 이름', en: 'Name of the person reporting', zh: '申报人姓名', ja: '届出人の氏名', vi: 'Họ tên người khai báo' },
    help: { ko: '신고하는 사람의 이름을 적어요. 서명이나 도장은 출력한 종이에 직접 해요.' + LANG_NOTE.ko, en: 'Name of the person reporting. Sign or stamp by hand on the printed paper.' + LANG_NOTE.en, zh: '填写申报人姓名。签名或盖章请在打印出的纸上亲自完成。' + LANG_NOTE.zh, ja: '届出人の氏名を書きます。署名・押印は印刷した紙に直接します。' + LANG_NOTE.ja, vi: 'Họ tên người khai báo. Ký tên hoặc đóng dấu trực tiếp trên giấy đã in.' + LANG_NOTE.vi },
    area: cell(703, 743, 885, 822),
    part: { key: 'name', box: inBox(cell(703, 743, 885, 822)) },
    copyFrom: [{ field: 'name', label: { ko: '위 성명 가져오기', en: 'Use the name above', zh: '使用上方姓名', ja: '上の氏名を使う', vi: 'Dùng họ tên ở trên' }, map: { name: 'name' } }],
  }),

  // ── 위임장 ───────────────────────────────────────────────
  {
    ...dateField({
      id: 'delegationDate', section: 'delegation', koLabel: '위임장 년 월 일',
      label: { ko: '위임한 날짜', en: 'Date of authorization', zh: '委托日期', ja: '委任日', vi: 'Ngày ủy quyền' },
      help: { ko: '다른 사람에게 신고를 맡길 때만 위임한 날짜를 적어요. 위임자 서명은 출력한 종이에 직접 해요.', en: 'Only if someone else reports for you: the date you authorize them. The authorizing signature goes by hand on the printed paper.', zh: '仅在委托他人申报时，填写委托日期。委托人签名请在打印出的纸上亲自完成。', ja: '他の人に届出を任せる場合のみ、委任した日付を書きます。委任者の署名は印刷した紙に直接します。', vi: 'Chỉ khi nhờ người khác khai báo: ghi ngày ủy quyền. Chữ ký người ủy quyền ký trực tiếp trên giấy đã in.' },
      area: { x: 120, y: 1530, w: 420, h: 30 },
      y: { x: 125, y: 1533, w: 72, h: 24, align: 'right' }, m: { x: 262, y: 1533, w: 70, h: 24, align: 'right' }, d: { x: 405, y: 1533, w: 72, h: 24, align: 'right' },
    }),
    badgeAt: { x: 104, y: 1545 },
  },
  textField({
    id: 'delegateName', section: 'delegation', koLabel: '위임받은 사람 성명 (Name)',
    label: { ko: '위임받은 사람 이름', en: 'Name of the authorized person', zh: '受托人姓名', ja: '受任者の氏名', vi: 'Họ tên người được ủy quyền' },
    help: { ko: '신고를 대신할 사람의 이름을 적어요.', en: 'Name of the person who will report on your behalf.', zh: '填写代为申报之人的姓名。', ja: '代わりに届け出る人の氏名を書きます。', vi: 'Họ tên người sẽ khai báo thay.' },
    area: { x: 380, y: 1576, w: 340, h: 38 },
    badgeAt: { x: 362, y: 1595 },
    part: { key: 'name', box: { x: 440, y: 1582, w: 275, h: 28, align: 'center' } },
  }),
  dateField({
    id: 'delegateBirth', section: 'delegation', koLabel: '위임받은 사람 생년월일 (Date of Birth)',
    label: { ko: '위임받은 사람 생년월일', en: 'Date of birth of the authorized person', zh: '受托人出生日期', ja: '受任者の生年月日', vi: 'Ngày sinh người được ủy quyền' },
    help: { ko: '신고를 대신할 사람의 생년월일을 적어요.', en: 'Date of birth of the person who will report on your behalf.', zh: '填写代为申报之人的出生日期。', ja: '代わりに届け出る人の生年月日を書きます。', vi: 'Ngày sinh người sẽ khai báo thay.' },
    area: { x: 730, y: 1576, w: 345, h: 38 },
    badgeAt: { x: 712, y: 1595 },
    box: { x: 855, y: 1582, w: 215, h: 28, align: 'center' },
  }),
];

export const residenceAddressChange: FormDef = {
  id: 'residence-address-change',
  title: { ko: '국내거소이전신고서', en: 'Residence Change Report', zh: '国内住所转移申报', ja: '国内居所移転届', vi: 'Báo cáo chuyển nơi cư trú' },
  pages: [{ image: '/forms/residence-address-change_ko.png', width: 1190, height: 1682, marginX: 1095 }],
  sections: [
    { id: 'person',     label: { ko: '신고 내용',   en: 'Report details',  zh: '申报内容', ja: '届出内容', vi: 'Nội dung khai báo' } },
    { id: 'report',     label: { ko: '신고일·신고인', en: 'Date & reporter', zh: '申报日期·申报人', ja: '届出日・届出人', vi: 'Ngày & người khai báo' } },
    { id: 'delegation', label: { ko: '위임장',      en: 'Power of attorney', zh: '委托书', ja: '委任状', vi: 'Giấy ủy quyền' } },
  ],
  fields,
};
