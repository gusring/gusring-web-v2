import { copyNameFrom, dateField, nameField, opt, textField, Who } from './common';
import { OWNER } from './motorcycle-common';
import { FieldDef, FormDef } from './types';

// ─────────────────────────────────────────────────────────────
// 이륜자동차사용신고필증재교부신청서 [별지 제67호서식, 96.10.4 승인] — v1 서식 41번
// 좌표는 public/forms/motorcycle-certificate-reissue_ko.png(1190×1682) 기준.
// 1996년에 승인된 옛 서식을 v1 원본 그대로 쓴다(README 「확인이 필요한 것」 참고).
// 한국어 작성 방법 이미지가 없어, 서식에 인쇄된 구비서류·신청안내만 근거로 안내한다.
// ※표시란(제 호)과 서명은 입력받지 않는다. 칸 높이가 35px라 번호는 표 오른쪽 여백에 둔다.
// ─────────────────────────────────────────────────────────────

const APPLICANT: Who = { ko: '신청인', en: 'the applicant', zh: '申请人', ja: '申請人', vi: 'người nộp đơn' };

const fields: FieldDef[] = [
  nameField({
    id: 'ownerName', section: 'owner', koLabel: '소유자 성명(명칭)', who: OWNER,
    label: { ko: '소유자 성명(명칭)', en: 'Name of the owner (or company name)', zh: '所有人姓名（名称）', ja: '所有者の氏名（名称）', vi: 'Họ tên chủ sở hữu (hoặc tên tổ chức)' },
    help: { ko: '이륜자동차 주인의 이름을 적어요. 회사 등이 주인이면 그 이름(명칭)을 적어요.', en: 'Name of the owner of the motorcycle. If a company owns it, write its name.', zh: '填写二轮汽车所有人的姓名。所有人是公司等时填写其名称。', ja: '二輪自動車の所有者の氏名を書きます。会社などが所有者ならその名称を書きます。', vi: 'Họ tên chủ sở hữu xe máy. Nếu là công ty, ghi tên công ty.' },
    area: { x: 396, y: 303, w: 200, h: 34 }, badgeAt: { x: 1062, y: 320 },
    box: { x: 400, y: 305, w: 192, h: 30, align: 'center' },
  }),
  {
    id: 'ownerId', section: 'owner', koLabel: '소유자 주민(사업자)등록번호',
    label: { ko: '소유자 주민(사업자)등록번호', en: 'Resident (business) registration no. of the owner', zh: '所有人居民（营业执照）登录号', ja: '所有者の住民（事業者）登録番号', vi: 'Số đăng ký cư trú (kinh doanh) của chủ sở hữu' },
    help: { ko: '소유자의 주민등록번호를 적어요. 사업자면 사업자등록번호를 적어요.', en: "The owner's resident registration number; for a business, the business registration number.", zh: '填写所有人的居民登录号。经营者填写营业执照号码。', ja: '所有者の住民登録番号を書きます。事業者なら事業者登録番号を書きます。', vi: 'Số đăng ký cư trú của chủ sở hữu; nếu là doanh nghiệp, ghi số đăng ký kinh doanh.' },
    area: { x: 873, y: 303, w: 164, h: 34 }, badgeAt: { x: 1098, y: 320 },
    input: { kind: 'idnum', box: { x: 876, y: 305, w: 158, h: 30, align: 'center' } },
  },
  textField({
    id: 'ownerAddress', section: 'owner', koLabel: '소유자 주소',
    label: { ko: '소유자 주소', en: 'Address of the owner', zh: '所有人地址', ja: '所有者の住所', vi: 'Địa chỉ chủ sở hữu' },
    help: { ko: '소유자의 주소를 한국어로 적어요.', en: "The owner's address, in Korean.", zh: '用韩文填写所有人的地址。', ja: '所有者の住所を韓国語で書きます。', vi: 'Địa chỉ chủ sở hữu, ghi bằng tiếng Hàn.' },
    area: { x: 396, y: 339, w: 352, h: 33 }, badgeAt: { x: 1062, y: 355 },
    part: { key: 'address', box: { x: 400, y: 340, w: 346, h: 31, align: 'left' }, korean: true, placeholder: '예) 서울시 금천구 시흥대로73길 70' },
  }),
  textField({
    id: 'ownerPhone', section: 'owner', koLabel: '(전화번호 : )',
    label: { ko: '소유자 전화번호', en: 'Phone number of the owner', zh: '所有人电话号码', ja: '所有者の電話番号', vi: 'Số điện thoại chủ sở hữu' },
    help: { ko: '연락 가능한 번호를 적어요.', en: 'A number where they can be reached.', zh: '填写可以联系到的号码。', ja: '連絡のつく番号を書きます。', vi: 'Số điện thoại có thể liên lạc.' },
    area: { x: 750, y: 339, w: 287, h: 33 }, badgeAt: { x: 1098, y: 355 },
    part: { key: 'phone', box: { x: 880, y: 342, w: 140, h: 28, align: 'center' }, inputMode: 'tel', placeholder: '010-1234-5678' },
  }),
  textField({
    id: 'plate', section: 'reissue', koLabel: '이륜자동차번호',
    label: { ko: '이륜자동차번호 (번호판)', en: 'Motorcycle number (license plate)', zh: '二轮汽车号码（车牌）', ja: '二輪自動車番号（ナンバープレート）', vi: 'Biển số xe máy' },
    help: { ko: '번호판에 적힌 이륜자동차번호를 그대로 적어요.', en: 'The motorcycle number exactly as on the license plate.', zh: '按车牌上的号码照写。', ja: 'ナンバープレートに書かれた番号をそのまま書きます。', vi: 'Ghi đúng số trên biển số xe máy.' },
    area: { x: 396, y: 374, w: 641, h: 33 }, badgeAt: { x: 1062, y: 390 },
    part: { key: 'plate', box: { x: 402, y: 376, w: 620, h: 30, align: 'center' } },
  }),
  {
    id: 'reason', section: 'reissue', koLabel: '신청사유 □ 훼손 □ 분실 □ 기타( )',
    label: { ko: '신청 사유', en: 'Reason for the application', zh: '申请原因', ja: '申請の理由', vi: 'Lý do xin cấp lại' },
    help: {
      ko: '사용신고필증을 다시 받으려는 이유를 골라요. 훼손돼서 알아보기 어려우면 그 사용신고필증 1부를 함께 내요. 신청은 읍·면·동에서 하고, 바로 처리되며 수수료는 없다고 서식에 적혀 있어요.',
      en: 'Choose why you need the use report certificate reissued. If it is damaged and hard to read, hand in that certificate. The form says to apply at the eup/myeon/dong office; it is processed immediately and there is no fee.',
      zh: '选择需要重新发放使用申报证明的原因。如因损坏难以辨认，须交回该使用申报证明1份。表格上写明在邑·面·洞申请，立即办理，无手续费。',
      ja: '使用届出済証の再交付を受ける理由を選びます。破損して判読が難しい場合はその使用届出済証1部を一緒に出します。申請は邑・面・洞で行い、即時処理で手数料はないと様式に書かれています。',
      vi: 'Chọn lý do xin cấp lại giấy chứng nhận khai báo sử dụng. Nếu giấy bị hư hỏng khó đọc, nộp kèm giấy đó. Theo mẫu đơn, nộp tại văn phòng eup/myeon/dong, xử lý ngay và không mất phí.',
    },
    area: { x: 396, y: 409, w: 641, h: 34 }, badgeAt: { x: 1062, y: 426 },
    input: {
      kind: 'choice', mark: 'check',
      options: [
        opt('damaged', '훼손', { ko: '훼손 (망가짐)', en: 'Damaged', zh: '损坏', ja: '破損', vi: 'Bị hư hỏng' }, 424, 426),
        opt('lost', '분실', { ko: '분실 (잃어버림)', en: 'Lost', zh: '丢失', ja: '紛失', vi: 'Bị mất' }, 544, 426),
        opt('other', '기타', { ko: '기타', en: 'Other', zh: '其他', ja: 'その他', vi: 'Khác' }, 664, 426),
      ],
      extra: { key: 'detail', when: ['other'], box: { x: 750, y: 414, w: 72, h: 24, align: 'center' }, korean: true, label: { ko: '기타 사유', en: 'Other reason', zh: '其他原因', ja: 'その他の理由', vi: 'Lý do khác' } },
    },
  },
  dateField({
    id: 'applyDate', section: 'sign', koLabel: '( 년 월 일)',
    label: { ko: '신청하는 날짜', en: 'Date of application', zh: '申请日期', ja: '申請日', vi: 'Ngày nộp đơn' },
    help: { ko: '이 신청서를 내는 날짜예요. 보통 오늘 날짜를 적어요.', en: "The date you submit this. Usually today's date.", zh: '提交本申请书的日期，通常填写今天的日期。', ja: 'この申請書を出す日付です。通常は今日の日付を書きます。', vi: 'Ngày bạn nộp đơn này. Thường là ngày hôm nay.' },
    area: { x: 398, y: 560, w: 300, h: 32 }, badgeAt: { x: 378, y: 576 },
    y: { x: 400, y: 563, w: 88, h: 26, align: 'right' }, m: { x: 515, y: 563, w: 58, h: 26, align: 'right' }, d: { x: 598, y: 563, w: 72, h: 26, align: 'right' },
  }),
  nameField({
    id: 'signName', section: 'sign', koLabel: '신청인 (서명 또는 인)', who: APPLICANT,
    help: { ko: '신청하는 사람의 이름을 한글로 적어요. 서명이나 도장은 출력한 종이에 직접 해요.', en: 'Name of the applicant in Korean letters. Sign or stamp by hand on the printed paper.', zh: '用韩文填写申请人姓名。签名或盖章请在打印出的纸上亲自完成。', ja: '申請人の氏名をハングルで書きます。署名・押印は印刷した紙に直接します。', vi: 'Họ tên người nộp đơn bằng chữ Hàn. Ký tên hoặc đóng dấu trực tiếp trên giấy đã in.' },
    area: { x: 706, y: 639, w: 158, h: 28 }, badgeAt: { x: 612, y: 652 },
    box: { x: 710, y: 641, w: 150, h: 24, align: 'center' },
    copyFrom: [copyNameFrom('ownerName', OWNER)],
  }),
];

export const motorcycleCertificateReissue: FormDef = {
  id: 'motorcycle-certificate-reissue',
  title: { ko: '이륜자동차 사용신고필증 재교부신청서', en: 'Motorcycle Certificate Reissue', zh: '二轮汽车使用申报证明再发放申请书', ja: '二輪自動車使用届出済証再交付申請書', vi: 'Đơn xin cấp lại giấy chứng nhận xe máy' },
  pages: [{ image: '/forms/motorcycle-certificate-reissue_ko.png', width: 1190, height: 1682 }],
  sections: [
    { id: 'owner', label: { ko: '소유자', en: 'Owner', zh: '所有人', ja: '所有者', vi: 'Chủ sở hữu' } },
    { id: 'reissue', label: { ko: '이륜자동차·신청 사유', en: 'Motorcycle and reason', zh: '二轮汽车·申请原因', ja: '二輪自動車・申請理由', vi: 'Xe máy và lý do' } },
    { id: 'sign', label: { ko: '신청일·신청인', en: 'Date and applicant', zh: '申请日期·申请人', ja: '申請日・申請人', vi: 'Ngày và người nộp' } },
  ],
  fields,
};
