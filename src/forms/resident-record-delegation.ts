import { dateField, idField, nameField, textField, topRight, Who } from './common';
import { allItemsField, chobonCountField, chobonItemsField, deungbonCountField, deungbonItemsField, feeExemptField, infoConsentField, officialCheckField, viewField } from './resident-record-items';
import { Box, FieldDef, FormDef, L } from './types';

// ─────────────────────────────────────────────────────────────
// 주민등록표 열람 또는 등·초본 교부 신청서(위임용) [주민등록법 시행규칙 별지 제9호서식] — v1 서식 34번
// 좌표는 public/forms/resident-record-delegation_ko.png, _ko_2.png(1190×1682) 기준.
// 한국어 작성 방법 이미지가 없어 서식 뒤쪽에 인쇄된 「유의 사항」만 근거로 안내를 쓴다.
// 「포함」 목록·확인사항·동의서는 31번과 같은 문구라 resident-record-items.ts를 함께 쓴다.
// 서명란(신청인(위임한 사람) 서명 또는 인)은 입력받지 않는다.
// ─────────────────────────────────────────────────────────────

const DELEGATOR: Who = { ko: '위임한 사람', en: 'the person delegating', zh: '委托人', ja: '委任した人', vi: 'người ủy quyền' };
const DELEGATE: Who = { ko: '위임받은 사람', en: 'the delegate', zh: '受托人', ja: '委任を受けた人', vi: 'người được ủy quyền' };
const TARGET: Who = { ko: '교부대상자', en: 'the person whose record is requested', zh: '发放对象人', ja: '交付対象者', vi: 'người được cấp hồ sơ' };

const cell = (x: number, y: number, x2: number, y2: number): Box => ({ x: x + 1, y: y + 1, w: x2 - x - 2, h: y2 - y - 2 });

const PHONE_HELP: L = { ko: '연락 가능한 번호를 적어요.', en: 'A number where they can be reached.', zh: '填写可以联系到的号码。', ja: '連絡のつく番号を書きます。', vi: 'Số điện thoại có thể liên lạc.' };
const phoneLabel = (who: Who): L => ({ ko: `${who.ko} 연락처`, en: `Phone number of ${who.en}`, zh: `${who.zh}联系电话`, ja: `${who.ja}の連絡先`, vi: `Số điện thoại ${who.vi}` });

/** 유의 사항 6 — 위임한 사람의 서명 */
const SIGN_NOTE: L = {
  ko: ' 위임한 사람은 출력한 종이의 「서명 또는 인」에 직접 서명하거나 도장을 찍어요. 지문은 안 되고, 서명은 한글로 자기 이름을 써야 해요(외국어·특수문자 사인이나 한문은 안 돼요).',
  en: ' The person delegating signs or stamps by hand at "서명 또는 인" on the printed paper. Fingerprints are not accepted; a signature must be their name handwritten in Hangul (no signs in foreign letters or special characters, and no Chinese characters).',
  zh: '委托人须在打印出的纸上“서명 또는 인”处亲自签名或盖章。不能按手印，签名须用韩文亲笔写自己的姓名（不可使用外文·特殊符号签名或汉字）。',
  ja: '委任した人は印刷した紙の「署名または印」の欄に直接署名するか押印します。指紋は使えず、署名はハングルで自分の氏名を自筆します（外国語・特殊文字のサインや漢字は不可）。',
  vi: ' Người ủy quyền tự ký hoặc đóng dấu vào ô "서명 또는 인" trên giấy đã in. Không dùng dấu vân tay; chữ ký phải là họ tên viết tay bằng chữ Hàn (không dùng chữ ký bằng chữ nước ngoài, ký tự đặc biệt hay chữ Hán).',
};
const TARGET_NOTE: L = {
  ko: ' 열람·교부 대상자가 위임한 사람과 다를 때만 적어요.',
  en: ' Only if the person whose record is requested is not the person delegating.',
  zh: '仅在查阅·发放对象人与委托人不同时填写。',
  ja: '閲覧・交付の対象者が委任した人と異なる場合のみ書きます。',
  vi: ' Chỉ ghi khi người được cấp hồ sơ khác với người ủy quyền.',
};

const valueText = (b: { id: string; section: string; koLabel: string; label: L; help: L; area: Box; box: Box; key?: string; korean?: boolean; inputMode?: 'tel'; placeholder?: string }): FieldDef =>
  textField({ id: b.id, section: b.section, koLabel: b.koLabel, label: b.label, help: b.help, area: b.area, badgeAt: topRight(b.area), part: { key: b.key ?? 'text', box: b.box, korean: b.korean, inputMode: b.inputMode, placeholder: b.placeholder } });

const fields: FieldDef[] = [
  // ── 위임한 사람 ──────────────────────────────────────────
  nameField({ id: 'delegatorName', section: 'delegator', koLabel: '위임한 사람 성명 (서명 또는 인)', who: DELEGATOR, area: cell(238, 190, 500, 275), badgeAt: topRight(cell(238, 190, 500, 275)), box: { x: 248, y: 214, w: 135, h: 26, align: 'center' },
    help: { ko: '일을 맡기는 사람의 이름을 한글로 적어요.' + SIGN_NOTE.ko, en: 'Name of the person who delegates, in Korean letters.' + SIGN_NOTE.en, zh: '用韩文填写委托他人办理的人的姓名。' + SIGN_NOTE.zh, ja: '手続きを任せる人の氏名をハングルで書きます。' + SIGN_NOTE.ja, vi: 'Họ tên người ủy quyền, bằng chữ Hàn.' + SIGN_NOTE.vi } }),
  valueText({ id: 'delegatorPhone', section: 'delegator', koLabel: '위임한 사람 연락처', label: phoneLabel(DELEGATOR), help: PHONE_HELP, area: cell(500, 190, 762, 275), box: { x: 512, y: 224, w: 210, h: 40, align: 'center' }, key: 'phone', inputMode: 'tel', placeholder: '010-1234-5678' }),
  idField({ id: 'delegatorId', section: 'delegator', koLabel: '위임한 사람 주민등록번호', who: DELEGATOR, area: cell(762, 190, 1074, 275), badgeAt: topRight(cell(762, 190, 1074, 275)), box: { x: 775, y: 224, w: 250, h: 40, align: 'center' } }),
  valueText({
    id: 'delegatorAddress', section: 'delegator', koLabel: '위임한 사람 주소',
    label: { ko: '위임한 사람 주소', en: 'Address of the person delegating', zh: '委托人地址', ja: '委任した人の住所', vi: 'Địa chỉ người ủy quyền' },
    help: { ko: '위임한 사람의 주소를 한국어로 적어요.', en: 'Address of the person delegating, in Korean.', zh: '用韩文填写委托人的地址。', ja: '委任した人の住所を韓国語で書きます。', vi: 'Địa chỉ người ủy quyền, ghi bằng tiếng Hàn.' },
    area: cell(238, 275, 762, 316), box: { x: 296, y: 279, w: 420, h: 34, align: 'left' }, key: 'address', korean: true, placeholder: '예) 서울시 금천구 시흥대로73길 70',
  }),
  valueText({
    id: 'delegatorRelation', section: 'delegator', koLabel: '대상자와의 관계',
    label: { ko: '대상자와의 관계', en: 'Relationship to the person whose record is requested', zh: '与对象人的关系', ja: '対象者との関係', vi: 'Quan hệ với người được cấp hồ sơ' },
    help: { ko: '열람하거나 등·초본을 받는 대상자가 위임한 사람에게 누구인지 한국어로 적어요. 위임한 사람 본인의 것이면 "본인"이라고 적어요.', en: 'Who the person whose record is requested is to the person delegating, in Korean. If it is their own record, write 본인 (self).', zh: '用韩文填写对象人是委托人的什么人。是委托人本人的记录则写“본인”。', ja: '閲覧・交付の対象者が委任した人の誰にあたるかを韓国語で書きます。委任した人本人のものなら「本人」にあたる韓国語を書きます。', vi: 'Người được cấp hồ sơ là ai đối với người ủy quyền, ghi bằng tiếng Hàn. Nếu là hồ sơ của chính người ủy quyền, ghi 본인 (bản thân).' },
    area: cell(762, 275, 1074, 316), box: { x: 938, y: 279, w: 94, h: 34, align: 'center' }, korean: true, placeholder: '예) 본인',
  }),
  feeExemptField({ section: 'delegator', area: cell(238, 316, 1074, 370), badgeAt: topRight(cell(238, 316, 1074, 370)), pts: [[266, 334]] }),

  // ── 위임받은 사람(신청인) ────────────────────────────────
  nameField({ id: 'delegateName', section: 'delegate', koLabel: '위임 받은 사람(신청인) 성명 (서명 또는 인)', who: DELEGATE, area: cell(238, 377, 500, 456), badgeAt: topRight(cell(238, 377, 500, 456)), box: { x: 248, y: 401, w: 135, h: 26, align: 'center' },
    help: { ko: '창구에 와서 신청하는 사람(위임받은 사람)의 이름을 한글로 적어요. 주민등록증(모바일 주민등록증 포함) 같은 신분증을 보여 줘야 해요. 서명이나 도장은 출력한 종이에 직접 해요.', en: 'Name of the person who comes to the counter to apply (the delegate), in Korean letters. They must show an ID such as a resident registration card (mobile card included). Sign or stamp by hand on the printed paper.', zh: '用韩文填写到窗口申请的人（受托人）的姓名。须出示居民登录证（含手机居民登录证）等身份证件。签名或盖章请在打印出的纸上亲自完成。', ja: '窓口に来て申請する人（委任を受けた人）の氏名をハングルで書きます。住民登録証（モバイル住民登録証を含む）などの身分証を提示します。署名・押印は印刷した紙に直接します。', vi: 'Họ tên người đến quầy nộp đơn (người được ủy quyền), bằng chữ Hàn. Người này phải xuất trình giấy tờ tùy thân như thẻ đăng ký cư trú (kể cả thẻ trên điện thoại). Ký tên hoặc đóng dấu trực tiếp trên giấy đã in.' } }),
  valueText({ id: 'delegatePhone', section: 'delegate', koLabel: '위임 받은 사람 연락처', label: phoneLabel(DELEGATE), help: PHONE_HELP, area: cell(500, 377, 762, 456), box: { x: 512, y: 411, w: 210, h: 40, align: 'center' }, key: 'phone', inputMode: 'tel', placeholder: '010-1234-5678' }),
  idField({ id: 'delegateId', section: 'delegate', koLabel: '위임 받은 사람 주민등록번호', who: DELEGATE, area: cell(762, 377, 1074, 456), badgeAt: topRight(cell(762, 377, 1074, 456)), box: { x: 775, y: 411, w: 250, h: 40, align: 'center' } }),
  {
    id: 'delegateAddress', section: 'delegate', koLabel: '위임 받은 사람 주소 (시·도) (시·군·구)',
    label: { ko: '위임받은 사람 주소 (시·도, 시·군·구)', en: 'Address of the delegate (province, city/district)', zh: '受托人地址（市·道、市·郡·区）', ja: '委任を受けた人の住所（市・道、市・郡・区）', vi: 'Địa chỉ người được ủy quyền (tỉnh / thành, quận / huyện)' },
    help: { ko: '시·도와 시·군·구까지만 적어요. 상세 주소는 적지 않아도 돼요. 예) 서울특별시, 금천구', en: 'Only the province/city and district; no detailed address is needed, e.g., 서울특별시, 금천구.', zh: '只填写到市·道和市·郡·区，不必写详细地址。例：서울특별시、금천구。', ja: '市・道と市・郡・区までだけ書きます。詳しい住所は不要です（ソウル特別市、衿川区にあたる韓国語など）。', vi: 'Chỉ ghi đến tỉnh / thành và quận / huyện; không cần địa chỉ chi tiết, VD: 서울특별시, 금천구.' },
    area: cell(238, 456, 762, 508), badgeAt: { x: 1100, y: 482 },
    input: {
      kind: 'text',
      parts: [
        { key: 'sido', box: { x: 375, y: 467, w: 140, h: 34, align: 'center' }, korean: true, label: { ko: '시·도', en: 'Province / metropolitan city', zh: '市·道', ja: '市・道', vi: 'Tỉnh / thành phố' }, placeholder: '예) 서울특별시' },
        { key: 'sigungu', box: { x: 625, y: 467, w: 130, h: 34, align: 'center' }, korean: true, label: { ko: '시·군·구', en: 'City / county / district', zh: '市·郡·区', ja: '市・郡・区', vi: 'Quận / huyện' }, placeholder: '예) 금천구' },
      ],
    },
  },

  // ── 열람 또는 등·초본 교부 대상자 ─────────────────────────
  nameField({ id: 'targetName', section: 'target', koLabel: '열람 또는 등·초본 교부 대상자 성명', who: TARGET, area: cell(238, 543, 762, 615), badgeAt: topRight(cell(238, 543, 762, 615)), box: { x: 250, y: 571, w: 450, h: 38, align: 'center' },
    help: { ko: '주민등록표를 열람하거나 등·초본을 받을 대상자의 이름을 적어요.' + TARGET_NOTE.ko, en: 'Name of the person whose record is requested.' + TARGET_NOTE.en, zh: '填写查阅居民登记表或领取誊本·抄本的对象人姓名。' + TARGET_NOTE.zh, ja: '住民登録票を閲覧したり謄本・抄本を受け取る対象者の氏名を書きます。' + TARGET_NOTE.ja, vi: 'Họ tên người có hồ sơ cần xem / cấp.' + TARGET_NOTE.vi } }),
  { ...idField({ id: 'targetId', section: 'target', koLabel: '열람 또는 등·초본 교부 대상자 주민등록번호', who: TARGET, area: cell(762, 543, 1074, 615), badgeAt: topRight(cell(762, 543, 1074, 615)), box: { x: 775, y: 571, w: 250, h: 38, align: 'center' } }),
    help: { ko: '대상자의 주민등록번호를 적어요.' + TARGET_NOTE.ko, en: 'Resident registration number of the person whose record is requested.' + TARGET_NOTE.en, zh: '填写对象人的居民登录号。' + TARGET_NOTE.zh, ja: '対象者の住民登録番号を書きます。' + TARGET_NOTE.ja, vi: 'Số đăng ký cư trú của người được cấp hồ sơ.' + TARGET_NOTE.vi } },

  // ── 위임 내용(신청 내용) ─────────────────────────────────
  viewField({ section: 'content', area: { x: 357, y: 623, w: 717, h: 31 }, badgeAt: { x: 1100, y: 639 }, pts: [[380, 639], [639, 639]] }),
  allItemsField({ section: 'content', area: { x: 240, y: 695, w: 834, h: 22 }, badgeAt: { x: 1100, y: 707 }, pts: [[292, 707], [659, 707]] }),
  deungbonCountField({ section: 'content', area: { x: 240, y: 860, w: 115, h: 70 }, badgeAt: { x: 297, y: 942 }, box: { x: 270, y: 898, w: 27, h: 22, align: 'center' } }),
  deungbonItemsField({
    section: 'content', area: { x: 357, y: 719, w: 717, h: 345 }, badgeAt: { x: 1100, y: 749 },
    pts: [[686, 749], [821, 749], [1010, 782], [1010, 815], [1010, 849], [811, 884], [893, 884], [983, 884], [1010, 918], [848, 952], [917, 952], [990, 952], [1010, 986], [1010, 1037]],
    years: { x: 979, y: 738, w: 24, h: 20, align: 'center' },
  }),
  chobonCountField({ section: 'content', area: { x: 240, y: 1199, w: 115, h: 70 }, badgeAt: { x: 297, y: 1281 }, box: { x: 270, y: 1237, w: 27, h: 22, align: 'center' } }),
  chobonItemsField({
    section: 'content', area: { x: 357, y: 1065, w: 717, h: 330 }, badgeAt: { x: 1100, y: 1087 },
    pts: [[1010, 1087], [686, 1129], [821, 1129], [1010, 1162], [1010, 1196], [1010, 1237], [1010, 1271], [1010, 1304], [695, 1349], [775, 1349], [1001, 1349], [1007, 1385]],
    years: { x: 979, y: 1118, w: 24, h: 20, align: 'center' },
  }),
  textField({
    id: 'purpose', section: 'content', koLabel: '용도 및 목적',
    label: { ko: '용도 및 목적', en: 'Purpose', zh: '用途及目的', ja: '用途及び目的', vi: 'Mục đích sử dụng' },
    help: { ko: '어디에 쓰려는지 한국어로 적어요.', en: 'What it will be used for, in Korean.', zh: '用韩文填写用途。', ja: '何に使うかを韓国語で書きます。', vi: 'Dùng để làm gì, ghi bằng tiếng Hàn.' },
    area: cell(238, 1403, 1074, 1437), badgeAt: topRight(cell(238, 1403, 1074, 1437)),
    part: { box: { x: 250, y: 1406, w: 780, h: 28, align: 'left' }, korean: true, placeholder: '예) 은행 제출용' },
  }),
  dateField({
    id: 'applyDate', section: 'content', koLabel: '신청일 ( 년 월 일)',
    label: { ko: '신청하는 날짜', en: 'Date of application', zh: '申请日期', ja: '申請日', vi: 'Ngày nộp đơn' },
    help: { ko: '이 신청서를 제출하는 날짜예요. 보통 오늘 날짜를 적어요.', en: "The date you submit this. Usually today's date.", zh: '提交本申请书的日期，通常填写今天的日期。', ja: 'この申請書を提出する日付です。通常は今日の日付を書きます。', vi: 'Ngày bạn nộp đơn này. Thường là ngày hôm nay.' },
    area: { x: 820, y: 1490, w: 254, h: 28 }, badgeAt: { x: 802, y: 1505 },
    y: { x: 830, y: 1493, w: 72, h: 24, align: 'right' }, m: { x: 915, y: 1493, w: 58, h: 24, align: 'right' }, d: { x: 990, y: 1493, w: 55, h: 24, align: 'right' },
  }),

  // ── 뒤쪽: 담당 공무원 확인사항 · 공동이용 동의서 ──────────
  officialCheckField({ section: 'consent', page: 2, area: { x: 252, y: 195, w: 824, h: 175 }, badgeAt: { x: 1100, y: 211 }, pts: [[282, 211], [281, 256], [281, 358]] }),
  infoConsentField({ section: 'consent', page: 2, area: { x: 118, y: 590, w: 958, h: 72 }, badgeAt: { x: 1100, y: 599 }, pts: [[139, 599], [139, 648]] }),
];

export const residentRecordDelegation: FormDef = {
  id: 'resident-record-delegation',
  title: { ko: '주민등록표 신청서 (위임용)', en: 'Resident Record Request (Delegation)', zh: '居民登记表申请（委托用）', ja: '住民登録票申請（委任用）', vi: 'Đơn xin bản sao hộ khẩu (ủy quyền)' },
  pages: [
    { image: '/forms/resident-record-delegation_ko.png', width: 1190, height: 1682, marginX: 1100 },
    { image: '/forms/resident-record-delegation_ko_2.png', width: 1190, height: 1682, marginX: 1100 },
  ],
  sections: [
    { id: 'delegator', label: { ko: '위임한 사람',            en: 'Person delegating',              zh: '委托人',           ja: '委任した人',         vi: 'Người ủy quyền' } },
    { id: 'delegate',  label: { ko: '위임받은 사람 (신청인)', en: 'Delegate (applicant)',            zh: '受托人（申请人）', ja: '委任を受けた人（申請人）', vi: 'Người được ủy quyền (người nộp)' } },
    { id: 'target',    label: { ko: '열람·교부 대상자',       en: 'Person whose record is requested', zh: '查阅·发放对象人', ja: '閲覧・交付対象者',   vi: 'Người được cấp hồ sơ' } },
    { id: 'content',   label: { ko: '위임 내용',              en: 'What is delegated',               zh: '委托内容',         ja: '委任内容',           vi: 'Nội dung ủy quyền' } },
    { id: 'consent',   label: { ko: '뒤쪽 확인·동의',         en: 'Back page: consent',              zh: '背面 确认·同意',   ja: '裏面 確認・同意',     vi: 'Mặt sau: đồng ý' } },
  ],
  fields,
};
