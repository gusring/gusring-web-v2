import { dateField, idField, ID_HELP, nameField, opt, textField, topRight, Who } from './common';
import { Box, FieldDef, FormDef } from './types';

// ─────────────────────────────────────────────────────────────
// [ ]주민등록증 [ ]모바일 주민등록증 [ ]분실신고서 [ ]분실신고 철회 신청서
// [주민등록법 시행령 별지 제34호서식] — v1 서식 33번
// 좌표는 public/forms/id-card-loss-report_ko.png (1190×1682) 기준.
// 칸 이름이 칸 왼쪽 위에 인쇄된 정부 서식이라 번호는 칸 오른쪽 위에 둔다.
// 안내 문구는 서식 아래 「유의사항」을 바탕으로 작성. 접수란, 습득(담당 공무원 작성 칸), 서명은 입력받지 않는다.
// ─────────────────────────────────────────────────────────────

const OWNER: Who = { ko: '분실자', en: 'the person who lost the card', zh: '遗失人', ja: '紛失者', vi: 'người bị mất thẻ' };
const REPORTER: Who = { ko: '신고(철회)인', en: 'the person reporting', zh: '申报（撤回）人', ja: '届出（撤回）人', vi: 'người khai báo' };

const cell = (x: number, y: number, x2: number, y2: number): Box => ({ x: x + 1, y: y + 1, w: x2 - x - 2, h: y2 - y - 2 });

const fields: FieldDef[] = [
  {
    id: 'cardKind', section: 'kind', koLabel: '[ ]주민등록증 [ ]모바일 주민등록증',
    label: { ko: '잃어버린 신분증', en: 'Which ID was lost', zh: '遗失的身份证', ja: '紛失した身分証', vi: 'Giấy tờ bị mất' },
    help: { ko: '잃어버린 것을 모두 골라요. 분실신고가 접수되면 주민등록증과 모바일 주민등록증의 효력이 모두 정지돼요.', en: 'Choose everything that was lost. Once the loss report is received, both the resident registration card and the mobile card are suspended.', zh: '选择所有遗失的证件。遗失申报受理后，居民登录证和移动居民登录证都会停止效力。', ja: '紛失したものをすべて選びます。紛失届が受理されると、住民登録証とモバイル住民登録証の効力がすべて停止されます。', vi: 'Chọn tất cả những gì bị mất. Khi tiếp nhận khai báo mất, cả thẻ đăng ký cư trú và thẻ trên điện thoại đều bị tạm ngưng hiệu lực.' },
    area: { x: 120, y: 158, w: 320, h: 70 },
    badgeAt: { x: 110, y: 193 },
    input: {
      kind: 'choice', mark: 'check', multiple: true,
      options: [
        opt('card', '주민등록증', { ko: '주민등록증', en: 'Resident registration card', zh: '居民登录证', ja: '住民登録証', vi: 'Thẻ đăng ký cư trú' }, 155, 175),
        opt('mobile', '모바일 주민등록증', { ko: '모바일 주민등록증', en: 'Mobile resident registration card', zh: '移动居民登录证', ja: 'モバイル住民登録証', vi: 'Thẻ đăng ký cư trú trên điện thoại' }, 156, 210),
      ],
    },
  },
  {
    id: 'reportKind', section: 'kind', koLabel: '[ ]분실신고서 [ ]분실신고 철회 신청서',
    label: { ko: '신고 종류', en: 'Type of report', zh: '申报种类', ja: '届出の種類', vi: 'Loại khai báo' },
    help: {
      ko: '잃어버려서 신고하는지, 잃어버린 신분증을 되찾아 신고를 철회하는지 골라요. 새로 발급받으려면 이 서식이 아니라 주민등록증 재발급 신청서를 써요.',
      en: 'Choose whether you are reporting a loss, or withdrawing the report because you found the card. To get a new card, use the re-issuance application instead of this form.',
      zh: '选择是申报遗失，还是因找回证件而撤回申报。如需重新办理，请使用居民登录证补发申请书，而不是本表格。',
      ja: '紛失の届出か、見つかったため届出を撤回するかを選びます。再発行を受けるには、この書式ではなく住民登録証再発給申請書を使います。',
      vi: 'Chọn khai báo mất, hay rút lại khai báo vì đã tìm thấy thẻ. Muốn cấp lại thẻ mới thì dùng đơn xin cấp lại, không phải mẫu này.',
    },
    area: { x: 465, y: 172, w: 610, h: 42 },
    badgeAt: { x: 455, y: 158 },
    input: {
      kind: 'choice', mark: 'check',
      options: [
        opt('loss', '분실신고서', { ko: '분실신고', en: 'Report a loss', zh: '遗失申报', ja: '紛失届', vi: 'Khai báo mất' }, 497, 193),
        opt('withdraw', '분실신고 철회 신청서', { ko: '분실신고 철회 (되찾았어요)', en: 'Withdraw the loss report (found it)', zh: '撤回遗失申报（已找回）', ja: '紛失届の撤回（見つかった）', vi: 'Rút lại khai báo mất (đã tìm thấy)' }, 734, 193),
      ],
    },
  },

  // ── 분실자 ───────────────────────────────────────────────
  nameField({ id: 'ownerName', section: 'owner', koLabel: '분실자 성명(한글)', who: OWNER, area: cell(239, 312, 791, 371), badgeAt: topRight(cell(239, 312, 791, 371)), box: { x: 330, y: 338, w: 420, h: 30, align: 'center' } }),
  { ...idField({ id: 'ownerId', section: 'owner', koLabel: '분실자 주민등록번호', who: OWNER, area: cell(791, 312, 1075, 371), badgeAt: topRight(cell(791, 312, 1075, 371)), box: { x: 800, y: 338, w: 260, h: 30, align: 'center' } }), help: ID_HELP },
  textField({
    id: 'ownerAddress', section: 'owner', koLabel: '분실자 주소',
    label: { ko: '분실자 주소', en: 'Address of the person who lost the card', zh: '遗失人地址', ja: '紛失者の住所', vi: 'Địa chỉ người bị mất thẻ' },
    help: { ko: '분실자의 주소를 한국어로 적어요.', en: 'Address of the person who lost the card, in Korean.', zh: '用韩文填写遗失人的地址。', ja: '紛失者の住所を韓国語で書きます。', vi: 'Địa chỉ người bị mất thẻ, ghi bằng tiếng Hàn.' },
    area: cell(239, 371, 791, 428), badgeAt: topRight(cell(239, 371, 791, 428)),
    part: { key: 'address', box: { x: 300, y: 396, w: 465, h: 28, align: 'center' }, korean: true },
  }),
  textField({
    id: 'ownerPhone', section: 'owner', koLabel: '분실자 연락처',
    label: { ko: '분실자 연락처', en: 'Phone of the person who lost the card', zh: '遗失人联系电话', ja: '紛失者の連絡先', vi: 'Số điện thoại người bị mất thẻ' },
    help: { ko: '연락 가능한 휴대전화 번호를 적어요.', en: 'A mobile number where they can be reached.', zh: '填写可以联系到的手机号码。', ja: '連絡のつく携帯電話番号を書きます。', vi: 'Số điện thoại di động có thể liên lạc được.' },
    area: cell(791, 371, 1075, 428), badgeAt: topRight(cell(791, 371, 1075, 428)),
    part: { key: 'phone', box: { x: 800, y: 396, w: 245, h: 28, align: 'center' }, inputMode: 'tel', placeholder: '010-1234-5678' },
  }),

  // ── 신고(철회) 내용 ──────────────────────────────────────
  dateField({
    id: 'lossDate', section: 'detail', koLabel: '분실일',
    label: { ko: '잃어버린 날', en: 'Date of loss', zh: '遗失日期', ja: '紛失日', vi: 'Ngày bị mất' },
    help: { ko: '신분증을 잃어버린 날을 적어요. 정확히 모르면 대략적인 날짜를 적어요.', en: 'The date the ID was lost. If you are not sure, an approximate date.', zh: '填写遗失证件的日期。不确定时填写大概日期。', ja: '身分証を紛失した日を書きます。正確に分からなければおおよその日付を書きます。', vi: 'Ngày làm mất giấy tờ. Nếu không chắc, ghi ngày gần đúng.' },
    area: cell(239, 439, 1075, 494), badgeAt: topRight(cell(239, 439, 1075, 494)),
    box: { x: 320, y: 450, w: 420, h: 38, align: 'center' },
  }),
  textField({
    id: 'reason', section: 'detail', koLabel: '분실(철회) 사유',
    label: { ko: '잃어버린 (철회하는) 이유', en: 'How it was lost (reason for withdrawal)', zh: '遗失（撤回）原因', ja: '紛失（撤回）の理由', vi: 'Lý do mất (rút lại)' },
    help: { ko: '어떻게 잃어버렸는지, 또는 철회하는 이유(예: 되찾음)를 한국어로 적어요.', en: 'How it was lost, or why you are withdrawing (e.g., found it), in Korean.', zh: '用韩文填写遗失经过，或撤回原因（例：已找回）。', ja: 'どのように紛失したか、または撤回の理由（見つかった等）を韓国語で書きます。', vi: 'Mất như thế nào, hoặc lý do rút lại (VD: đã tìm thấy), ghi bằng tiếng Hàn.' },
    area: cell(239, 494, 1075, 548), badgeAt: topRight(cell(239, 494, 1075, 548)),
    part: { box: { x: 390, y: 500, w: 640, h: 42, align: 'left' }, korean: true, placeholder: '예) 지하철에서 지갑 분실' },
  }),

  // ── 신고(철회)일·신고(철회)인 ────────────────────────────
  dateField({
    id: 'reportDate', section: 'reporter', koLabel: '신고(철회)일 ( 년 월 일)',
    label: { ko: '신고하는 날짜', en: 'Date of report', zh: '申报日期', ja: '届出日', vi: 'Ngày khai báo' },
    help: { ko: '이 신고서를 제출하는 날짜예요. 보통 오늘 날짜를 적어요.', en: "The date you submit this. Usually today's date.", zh: '提交本申报书的日期，通常填写今天的日期。', ja: 'この届出を提出する日付です。通常は今日の日付を書きます。', vi: 'Ngày bạn nộp tờ khai này. Thường là ngày hôm nay.' },
    area: { x: 820, y: 702, w: 255, h: 28 },
    y: { x: 850, y: 704, w: 66, h: 24, align: 'right' }, m: { x: 936, y: 704, w: 44, h: 24, align: 'right' }, d: { x: 1002, y: 704, w: 44, h: 24, align: 'right' },
  }),
  nameField({
    id: 'reporterName', section: 'reporter', koLabel: '신고(철회)인 성명', who: REPORTER,
    help: { ko: '신고하는 사람의 이름을 적어요. 분실자가 직접 신고하면 이 칸에는 이름과 서명(또는 도장)만 하면 돼요. 서명은 출력한 종이에 직접 해요.', en: 'Name of the person reporting. If the person who lost the card reports in person, only the name and signature (or stamp) are needed in this section. Sign by hand on the printed paper.', zh: '填写申报人姓名。遗失人本人申报时，此栏只需填写姓名并签名（或盖章）。签名请在打印出的纸上亲自完成。', ja: '届け出る人の氏名を書きます。紛失者本人が届け出る場合、この欄は氏名と署名（または押印）だけで構いません。署名は印刷した紙に直接します。', vi: 'Họ tên người khai báo. Nếu chính người bị mất tự khai báo, phần này chỉ cần họ tên và chữ ký (hoặc dấu). Ký trực tiếp trên giấy đã in.' },
    area: cell(253, 774, 670, 836), badgeAt: topRight(cell(253, 774, 670, 836)),
    box: { x: 300, y: 798, w: 220, h: 32, align: 'center' },
    copyFrom: [{ field: 'ownerName', label: { ko: '분실자 이름 가져오기', en: 'Use the card owner’s name', zh: '使用遗失人姓名', ja: '紛失者の氏名を使う', vi: 'Dùng tên người bị mất thẻ' }, map: { name: 'name' } }],
  }),
  { ...idField({ id: 'reporterId', section: 'reporter', koLabel: '신고(철회)인 주민등록번호', who: REPORTER, area: cell(670, 774, 1075, 836), badgeAt: topRight(cell(670, 774, 1075, 836)), box: { x: 680, y: 798, w: 360, h: 32, align: 'center' } }), help: { ...ID_HELP, ko: '분실자가 아닌 사람이 신고할 때만 적어요. ' + ID_HELP.ko, en: 'Only if someone other than the card owner reports. ' + ID_HELP.en, zh: '仅在由遗失人以外的人申报时填写。' + ID_HELP.zh, ja: '紛失者以外の人が届け出る場合のみ書きます。' + ID_HELP.ja, vi: 'Chỉ ghi khi người khác (không phải người bị mất) khai báo. ' + ID_HELP.vi } },
  textField({
    id: 'reporterPhone', section: 'reporter', koLabel: '신고(철회)인 연락처',
    label: { ko: '신고(철회)인 연락처', en: 'Phone of the person reporting', zh: '申报人联系电话', ja: '届出人の連絡先', vi: 'Số điện thoại người khai báo' },
    help: { ko: '분실자가 아닌 사람이 신고할 때만, 연락 가능한 번호를 적어요.', en: 'Only if someone other than the card owner reports: a number where they can be reached.', zh: '仅在由遗失人以外的人申报时，填写可以联系到的号码。', ja: '紛失者以外の人が届け出る場合のみ、連絡のつく番号を書きます。', vi: 'Chỉ khi người khác khai báo: số điện thoại có thể liên lạc.' },
    area: cell(253, 836, 670, 903), badgeAt: topRight(cell(253, 836, 670, 903)),
    part: { key: 'phone', box: { x: 300, y: 862, w: 330, h: 32, align: 'center' }, inputMode: 'tel', placeholder: '010-1234-5678' },
  }),
  textField({
    id: 'reporterRelation', section: 'reporter', koLabel: '분실자와의 관계',
    label: { ko: '분실자와의 관계', en: 'Relationship to the card owner', zh: '与遗失人的关系', ja: '紛失者との関係', vi: 'Quan hệ với người bị mất thẻ' },
    help: { ko: '분실자가 아닌 사람이 신고할 때만, 분실자의 누구인지 한국어로 적어요. 예) 배우자, 자녀', en: "Only if someone other than the card owner reports: who they are to the owner, in Korean, e.g., 배우자 (spouse), 자녀 (child).", zh: '仅在由遗失人以外的人申报时，用韩文填写是遗失人的什么人。例：배우자（配偶）、자녀（子女）。', ja: '紛失者以外の人が届け出る場合のみ、紛失者の誰にあたるかを韓国語で書きます（配偶者・子など）。', vi: 'Chỉ khi người khác khai báo: người đó là ai đối với người bị mất, ghi bằng tiếng Hàn, VD: 배우자 (vợ / chồng), 자녀 (con).' },
    area: cell(670, 836, 1075, 903), badgeAt: topRight(cell(670, 836, 1075, 903)),
    part: { box: { x: 680, y: 862, w: 340, h: 32, align: 'center' }, korean: true, placeholder: '예) 배우자' },
  }),
];

export const idCardLossReport: FormDef = {
  id: 'id-card-loss-report',
  title: { ko: '주민등록증 분실신고서', en: 'Lost ID Card Report', zh: '居民身份证丢失申报', ja: '住民登録証紛失届', vi: 'Báo cáo mất thẻ căn cước' },
  pages: [{ image: '/forms/id-card-loss-report_ko.png', width: 1190, height: 1682 }],
  sections: [
    { id: 'kind',     label: { ko: '신고 종류',         en: 'Type',               zh: '申报种类',   ja: '届出の種類', vi: 'Loại khai báo' } },
    { id: 'owner',    label: { ko: '분실자',            en: 'Card owner',         zh: '遗失人',     ja: '紛失者',     vi: 'Người bị mất thẻ' } },
    { id: 'detail',   label: { ko: '신고(철회) 내용',   en: 'Details',            zh: '申报内容',   ja: '届出内容',   vi: 'Nội dung' } },
    { id: 'reporter', label: { ko: '신고(철회)인',      en: 'Person reporting',   zh: '申报人',     ja: '届出人',     vi: 'Người khai báo' } },
  ],
  fields,
};
