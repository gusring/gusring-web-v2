import { copyNameFrom, dateField, nameField, textField, Who } from './common';
import { Box, FieldDef, FormDef, L, Point } from './types';

// ─────────────────────────────────────────────────────────────
// 자동차양도증명서(양도인·양수인 직접 거래용) [자동차등록규칙 별지 제15호서식] — v1 서식 40번
// 좌표는 public/forms/vehicle-transfer-certificate_ko.png(1190×1682) 기준.
// 한국어 작성 방법 이미지가 없어, 서식에 인쇄된 조항(제1~9조)과 유의사항만 근거로 안내한다.
// 접수번호·접수일자, 수입인지 칸, 서명·날인은 입력받지 않는다.
// 표의 한 줄이 28px라 번호는 칸 오른쪽 끝에 두고, 위아래 줄끼리 겹치지 않게 홀수 줄은 옆으로 비켜 놓는다.
// ─────────────────────────────────────────────────────────────

const L_X = 224;
const MID = 664;
const R_X = 1024;

/** 표의 줄 (위, 아래) */
const ROWS: [number, number][] = [
  [228, 256], [256, 285], [285, 313], [313, 370], // 0~3 갑: 양도인 성명 / 전화 / 주소, 공동명의자 성명
  [370, 399], [399, 427], [427, 456], // 4~6 을: 양수인 성명 / 전화 / 주소
  [456, 484], [484, 513], [513, 541], // 7~9 을: 공동명의자 성명 / 전화 / 주소
  [544, 572], [572, 600], [600, 629], [629, 658], // 10~13 거래 내용
];

const cellBox = (row: number, x0: number, x1: number): Box => {
  const [a, b] = ROWS[row];
  return { x: x0 + 1, y: a + 1, w: x1 - x0 - 2, h: b - a - 2 };
};
/** 값 쓰는 자리: 칸 이름(라벨) 오른쪽 ~ 번호 앞 */
/** 홀수 줄 번호를 옆으로 비킬지 — 표 오른쪽 끝 칸은 표 밖 여백으로, 가운데 칸은 칸 안쪽으로 */
const shift = (row: number, cellEnd: number) => (row % 2 === 1 && row !== 3 ? (cellEnd === R_X ? 36 : -34) : 0);
const valueBox = (row: number, labelEnd: number, cellEnd: number, align: Box['align'] = 'left'): Box => {
  const [a] = ROWS[row];
  return { x: labelEnd + 10, y: a + 3, w: cellEnd - labelEnd - 10 - 40 + Math.min(0, shift(row, cellEnd)), h: 23, align };
};
/** 3번 줄(갑 공동명의자)은 높이가 57px라 번호를 칸 아래쪽에 둔다 */
const badge = (row: number, cellEnd: number): Point => ({ x: cellEnd - 18 + shift(row, cellEnd), y: row === 3 ? 349 : ROWS[row][0] + 14 });

type Spot = { row: number; labelEnd: number; left?: boolean; full?: boolean };
const spot = (s: Spot) => {
  const x0 = s.left || s.full ? L_X : MID;
  const x1 = s.left && !s.full ? MID : R_X;
  return { area: cellBox(s.row, x0, x1), badgeAt: badge(s.row, x1), box: valueBox(s.row, s.labelEnd, x1) };
};

const TRANSFEROR: Who = { ko: '양도인(갑)', en: 'the seller (A)', zh: '让渡人（甲）', ja: '譲渡人（甲）', vi: 'bên bán (A)' };
const TRANSFEROR_CO: Who = { ko: '양도인 쪽 공동명의자', en: 'the seller-side co-owner', zh: '让渡方共同名义人', ja: '譲渡人側の共同名義人', vi: 'người đồng sở hữu bên bán' };
const TRANSFEREE: Who = { ko: '양수인(을)', en: 'the buyer (B)', zh: '受让人（乙）', ja: '譲受人（乙）', vi: 'bên mua (B)' };
const TRANSFEREE_CO: Who = { ko: '양수인 쪽 공동명의자', en: 'the buyer-side co-owner', zh: '受让方共同名义人', ja: '譲受人側の共同名義人', vi: 'người đồng sở hữu bên mua' };

/** 유의사항 1 — 양수인 인적사항 */
const BUYER_NOTE: L = {
  ko: ' 양수인의 인적사항을 적지 않으면 양수인이 몰래 되파는 등 예상하지 못한 손해를 볼 수 있으니 양도인은 꼭 적게 해요.',
  en: ' If the buyer’s details are left blank, the seller may suffer unexpected loss (e.g., unauthorized resale), so the seller should make sure they are filled in.',
  zh: '如不填写受让人信息，让渡人可能因受让人擅自转卖等遭受意外损失，请务必填写。',
  ja: '譲受人の人的事項を書かないと、無断転売などで譲渡人が予期しない損害を受けることがあるので、必ず書きます。',
  vi: ' Nếu không ghi thông tin bên mua, bên bán có thể chịu thiệt hại bất ngờ (như bị bán lại trái phép), nên bên bán cần đảm bảo ghi đủ.',
};
/** 제9조 — 대표자 */
const CO_NOTE: L = {
  ko: ' 공동명의일 때만 적어요. 대표 양도인·대표 양수인은 공동명의자끼리 합의해서 정해요.',
  en: ' Only for joint ownership. The representative seller/buyer is decided by agreement among the co-owners.',
  zh: '仅在共同名义时填写。代表让渡人·代表受让人由共同名义人协商决定。',
  ja: '共同名義の場合のみ書きます。代表譲渡人・代表譲受人は共同名義人の合意で決めます。',
  vi: ' Chỉ ghi khi đồng sở hữu. Người đại diện bên bán / bên mua do các đồng sở hữu thỏa thuận chọn.',
};

const ID_HELP_V: L = {
  ko: '주민등록번호를 적어요. 법인이면 법인등록번호를 적어요.',
  en: 'The resident registration number. For a corporation, the corporate registration number.',
  zh: '填写居民登录号。法人填写法人登记号。',
  ja: '住民登録番号を書きます。法人なら法人登録番号を書きます。',
  vi: 'Số đăng ký cư trú. Nếu là pháp nhân, ghi số đăng ký pháp nhân.',
};

const nameOf = (id: string, section: string, ko: string, who: Who, s: Spot, extra: L = { ko: '', en: '', zh: '', ja: '', vi: '' }): FieldDef => {
  const p = spot(s);
  return nameField({
    id, section, koLabel: `${ko} 성명(명칭)`, who,
    label: { ko: `${who.ko} 성명(명칭)`, en: `Name of ${who.en} (or company name)`, zh: `${who.zh}姓名（名称）`, ja: `${who.ja}の氏名（名称）`, vi: `Họ tên ${who.vi} (hoặc tên tổ chức)` },
    help: { ko: `${who.ko}의 이름을 적어요. 법인이면 법인 이름(명칭)을 적어요.` + extra.ko, en: `Name of ${who.en}; for a corporation, its name.` + extra.en, zh: `填写${who.zh}的姓名。法人填写法人名称。` + extra.zh, ja: `${who.ja}の氏名を書きます。法人なら法人の名称を書きます。` + extra.ja, vi: `Họ tên ${who.vi}; nếu là pháp nhân, ghi tên pháp nhân.` + extra.vi },
    area: p.area, badgeAt: p.badgeAt, box: p.box,
  });
};
const idOf = (id: string, section: string, ko: string, who: Who, s: Spot, extra: L = { ko: '', en: '', zh: '', ja: '', vi: '' }): FieldDef => {
  const p = spot(s);
  return {
    id, section, koLabel: `${ko} 주민(법인)등록번호`,
    label: { ko: `${who.ko} 주민(법인)등록번호`, en: `Resident (corporate) registration no. of ${who.en}`, zh: `${who.zh}居民（法人）登录号`, ja: `${who.ja}の住民（法人）登録番号`, vi: `Số đăng ký cư trú (pháp nhân) của ${who.vi}` },
    help: { ko: ID_HELP_V.ko + extra.ko, en: ID_HELP_V.en + extra.en, zh: ID_HELP_V.zh + extra.zh, ja: ID_HELP_V.ja + extra.ja, vi: ID_HELP_V.vi + extra.vi },
    area: p.area, badgeAt: p.badgeAt,
    input: { kind: 'idnum', box: { ...p.box, align: 'center' } },
  };
};
const phoneOf = (id: string, section: string, ko: string, who: Who, s: Spot, extra: L = { ko: '', en: '', zh: '', ja: '', vi: '' }): FieldDef => {
  const p = spot(s);
  return textField({
    id, section, koLabel: `${ko} 전화번호`,
    label: { ko: `${who.ko} 전화번호`, en: `Phone number of ${who.en}`, zh: `${who.zh}电话号码`, ja: `${who.ja}の電話番号`, vi: `Số điện thoại ${who.vi}` },
    help: { ko: '연락 가능한 번호를 적어요.' + extra.ko, en: 'A number where they can be reached.' + extra.en, zh: '填写可以联系到的号码。' + extra.zh, ja: '連絡のつく番号を書きます。' + extra.ja, vi: 'Số điện thoại có thể liên lạc.' + extra.vi },
    area: p.area, badgeAt: p.badgeAt,
    part: { key: 'phone', box: p.box, inputMode: 'tel', placeholder: '010-1234-5678' },
  });
};
const addressOf = (id: string, section: string, ko: string, who: Who, s: Spot, extra: L = { ko: '', en: '', zh: '', ja: '', vi: '' }): FieldDef => {
  const p = spot(s);
  return textField({
    id, section, koLabel: `${ko} 주소`,
    label: { ko: `${who.ko} 주소`, en: `Address of ${who.en}`, zh: `${who.zh}地址`, ja: `${who.ja}の住所`, vi: `Địa chỉ ${who.vi}` },
    help: { ko: `${who.ko}의 주소를 한국어로 적어요.` + extra.ko, en: `Address of ${who.en}, in Korean.` + extra.en, zh: `用韩文填写${who.zh}的地址。` + extra.zh, ja: `${who.ja}の住所を韓国語で書きます。` + extra.ja, vi: `Địa chỉ ${who.vi}, ghi bằng tiếng Hàn.` + extra.vi },
    area: p.area, badgeAt: p.badgeAt,
    part: { key: 'address', box: p.box, korean: true, placeholder: '예) 서울시 금천구 시흥대로73길 70' },
  });
};
const shareOf = (id: string, section: string, ko: string, who: Who, s: Spot, extra: L = { ko: '', en: '', zh: '', ja: '', vi: '' }): FieldDef => {
  const p = spot(s);
  return textField({
    id, section, koLabel: `${ko} 지분율(%)`,
    label: { ko: `${who.ko} 지분율(%)`, en: `Ownership share of ${who.en} (%)`, zh: `${who.zh}持股比例（%）`, ja: `${who.ja}の持分率（%）`, vi: `Tỷ lệ sở hữu của ${who.vi} (%)` },
    help: { ko: '공동명의일 때 이 사람이 가질 몫을 %로 적어요.' + extra.ko, en: 'For joint ownership, this person’s share in %.' + extra.en, zh: '共同名义时，用%填写此人所占份额。' + extra.zh, ja: '共同名義の場合、この人の持分を%で書きます。' + extra.ja, vi: 'Khi đồng sở hữu, ghi phần sở hữu của người này theo %.' + extra.vi },
    area: p.area, badgeAt: p.badgeAt,
    part: { key: 'share', box: p.box, inputMode: 'numeric', placeholder: '50' },
  });
};

const deal = (id: string, koLabel: string, label: L, help: L, s: Spot, part: { inputMode?: 'numeric'; placeholder?: string; korean?: boolean; align?: Box['align']; w?: number } = {}): FieldDef => {
  const p = spot(s);
  return textField({
    id, section: 'deal', koLabel, label, help, area: p.area, badgeAt: p.badgeAt,
    part: { key: 'text', box: { ...p.box, w: part.w ?? p.box.w, align: part.align ?? 'left' }, inputMode: part.inputMode, placeholder: part.placeholder, korean: part.korean },
  });
};
const dealDate = (id: string, koLabel: string, label: L, help: L, s: Spot): FieldDef => {
  const p = spot(s);
  return dateField({ id, section: 'deal', koLabel, label, help, area: p.area, badgeAt: p.badgeAt, box: p.box });
};

const fields: FieldDef[] = [
  // ── 갑: 양도인(대표자) · 공동명의자 ──────────────────────
  nameOf('sellerName', 'seller', '양도인(대표자)', TRANSFEROR, { row: 0, labelEnd: 308, left: true }, { ko: ' 차를 넘기는 사람이에요.', en: ' This is the person handing over the vehicle.', zh: '即转让车辆的人。', ja: '車を譲る人です。', vi: ' Đây là người chuyển nhượng xe.' }),
  idOf('sellerId', 'seller', '양도인(대표자)', TRANSFEROR, { row: 0, labelEnd: 822 }),
  phoneOf('sellerPhone', 'seller', '양도인(대표자)', TRANSFEROR, { row: 1, labelEnd: 301, full: true }),
  addressOf('sellerAddress', 'seller', '양도인(대표자)', TRANSFEROR, { row: 2, labelEnd: 265, full: true }),
  nameOf('sellerCoName', 'seller', '갑 공동명의자', TRANSFEROR_CO, { row: 3, labelEnd: 308, left: true }, CO_NOTE),
  idOf('sellerCoId', 'seller', '갑 공동명의자', TRANSFEROR_CO, { row: 3, labelEnd: 822 }, CO_NOTE),

  // ── 을: 양수인(대표자) · 공동명의자 ──────────────────────
  nameOf('buyerName', 'buyer', '양수인(대표자)', TRANSFEREE, { row: 4, labelEnd: 308, left: true }, { ko: ' 차를 넘겨받는 사람이에요.' + BUYER_NOTE.ko, en: ' This is the person receiving the vehicle.' + BUYER_NOTE.en, zh: '即接受车辆的人。' + BUYER_NOTE.zh, ja: '車を譲り受ける人です。' + BUYER_NOTE.ja, vi: ' Đây là người nhận xe.' + BUYER_NOTE.vi }),
  idOf('buyerId', 'buyer', '양수인(대표자)', TRANSFEREE, { row: 4, labelEnd: 822 }, BUYER_NOTE),
  phoneOf('buyerPhone', 'buyer', '양수인(대표자)', TRANSFEREE, { row: 5, labelEnd: 301, left: true }),
  shareOf('buyerShare', 'buyer', '양수인(대표자)', TRANSFEREE, { row: 5, labelEnd: 749 }),
  addressOf('buyerAddress', 'buyer', '양수인(대표자)', TRANSFEREE, { row: 6, labelEnd: 265, full: true }, BUYER_NOTE),
  nameOf('buyerCoName', 'buyer', '을 공동명의자', TRANSFEREE_CO, { row: 7, labelEnd: 308, left: true }, CO_NOTE),
  idOf('buyerCoId', 'buyer', '을 공동명의자', TRANSFEREE_CO, { row: 7, labelEnd: 822 }, CO_NOTE),
  phoneOf('buyerCoPhone', 'buyer', '을 공동명의자', TRANSFEREE_CO, { row: 8, labelEnd: 301, left: true }, CO_NOTE),
  shareOf('buyerCoShare', 'buyer', '을 공동명의자', TRANSFEREE_CO, { row: 8, labelEnd: 749 }, CO_NOTE),
  addressOf('buyerCoAddress', 'buyer', '을 공동명의자', TRANSFEREE_CO, { row: 9, labelEnd: 265, full: true }, CO_NOTE),

  // ── 거래 내용 ─────────────────────────────────────────────
  deal('regNo', '자동차등록번호',
    { ko: '자동차등록번호 (번호판)', en: 'Vehicle registration number (license plate)', zh: '汽车登记号码（车牌）', ja: '自動車登録番号（ナンバープレート）', vi: 'Số đăng ký xe (biển số)' },
    { ko: '번호판에 적힌 자동차등록번호를 그대로 적어요.', en: 'The registration number exactly as on the license plate.', zh: '按车牌上的登记号码照写。', ja: 'ナンバープレートに書かれた登録番号をそのまま書きます。', vi: 'Ghi đúng số đăng ký trên biển số.' },
    { row: 10, labelEnd: 355, left: true }),
  deal('model', '차종 및 차명',
    { ko: '차종 및 차명', en: 'Vehicle type and model', zh: '车种及车名', ja: '車種及び車名', vi: 'Loại xe và tên xe' },
    { ko: '차의 종류와 모델 이름을 적어요.', en: 'The type of vehicle and its model name.', zh: '填写车辆种类和型号名称。', ja: '車の種類とモデル名を書きます。', vi: 'Loại xe và tên mẫu xe.' },
    { row: 10, labelEnd: 775 }),
  deal('vin', '차대번호',
    { ko: '차대번호', en: 'Vehicle identification number (VIN)', zh: '车架号', ja: '車台番号', vi: 'Số khung (VIN)' },
    { ko: '차대번호를 그대로 적어요.', en: 'The vehicle identification number, exactly as it is.', zh: '照写车架号。', ja: '車台番号をそのまま書きます。', vi: 'Ghi đúng số khung.' },
    { row: 11, labelEnd: 301, left: true }),
  dealDate('saleDate', '매매일',
    { ko: '매매일 (사고판 날)', en: 'Date of sale', zh: '买卖日', ja: '売買日', vi: 'Ngày mua bán' },
    { ko: '차를 사고판 날짜예요.', en: 'The date the vehicle was sold.', zh: '车辆买卖的日期。', ja: '車を売買した日付です。', vi: 'Ngày mua bán xe.' },
    { row: 11, labelEnd: 722 }),
  deal('price', '매매금액',
    { ko: '매매금액', en: 'Sale price', zh: '买卖金额', ja: '売買金額', vi: 'Giá mua bán' },
    { ko: '차를 사고판 금액을 원 단위로 적어요.', en: 'The sale price in won.', zh: '以韩元为单位填写买卖金额。', ja: '売買金額をウォン単位で書きます。', vi: 'Giá mua bán, tính bằng won.' },
    { row: 12, labelEnd: 299, left: true }, { placeholder: '예) 500만원' }),
  dealDate('balanceDate', '잔금지급일',
    { ko: '잔금지급일 (남은 돈을 다 낸 날)', en: 'Date the balance is paid', zh: '尾款支付日', ja: '残金支払日', vi: 'Ngày trả hết tiền còn lại' },
    { ko: '남은 돈(잔금)을 다 주고받은 날짜예요. 양수인은 이 날부터 15일 안에 이 증명서를 내고 소유권 이전등록을 해야 해요(제8조).', en: 'The date the balance is paid in full. The buyer must submit this certificate for the ownership transfer registration within 15 days of this date (Article 8).', zh: '尾款付清的日期。受让人须自该日起15日内提交本证明书办理所有权转移登记（第8条）。', ja: '残金を支払い終えた日付です。譲受人はこの日から15日以内にこの証明書を提出して所有権移転登録をします（第8条）。', vi: 'Ngày đã trả hết tiền còn lại. Bên mua phải nộp giấy này để đăng ký chuyển quyền sở hữu trong vòng 15 ngày kể từ ngày này (Điều 8).' },
    { row: 12, labelEnd: 758 }),
  dealDate('handoverDate', '자동차인도일',
    { ko: '자동차인도일 (차를 넘겨준 날)', en: 'Date the vehicle is handed over', zh: '车辆交付日', ja: '自動車引渡日', vi: 'Ngày giao xe' },
    { ko: '차를 실제로 넘겨준 날짜예요. 이 날까지의 세금·공과금은 양도인이, 다음 날부터는 양수인이 내요(제3조). 이 날부터 생긴 사고는 양수인 책임이에요(제4조).', en: 'The date the vehicle is actually handed over. Taxes and charges up to this date are paid by the seller, from the next day by the buyer (Article 3). Accidents from this date are the buyer’s responsibility (Article 4).', zh: '实际交付车辆的日期。截至该日的税费由让渡人负担，次日起由受让人负担（第3条）。自该日起发生的事故由受让人负责（第4条）。', ja: '実際に車を引き渡した日付です。この日までの税金・公課金は譲渡人が、翌日からは譲受人が負担します（第3条）。この日から起きた事故は譲受人の責任です（第4条）。', vi: 'Ngày thực tế giao xe. Thuế và phí đến ngày này do bên bán chịu, từ ngày hôm sau do bên mua chịu (Điều 3). Tai nạn từ ngày này là trách nhiệm của bên mua (Điều 4).' },
    { row: 13, labelEnd: 335, left: true }),
  deal('mileage', '주행거리 km',
    { ko: '주행거리 (km)', en: 'Mileage (km)', zh: '行驶里程（km）', ja: '走行距離（km）', vi: 'Số km đã đi' },
    { ko: '계기판의 주행거리를 숫자로 적어요. 정당한 이유 없이 주행거리를 바꾸면 징역이나 벌금에 처해져요.', en: 'The mileage on the odometer, as a number. Altering the mileage without good reason is punishable by imprisonment or a fine.', zh: '用数字填写仪表盘上的行驶里程。无正当理由更改行驶里程将被处以徒刑或罚金。', ja: 'メーターの走行距離を数字で書きます。正当な理由なく走行距離を変えると懲役または罰金に処されます。', vi: 'Số km trên đồng hồ, ghi bằng số. Thay đổi số km không có lý do chính đáng sẽ bị phạt tù hoặc phạt tiền.' },
    { row: 13, labelEnd: 739 }, { inputMode: 'numeric', placeholder: '45000', align: 'right', w: 192 }),

  // ── 특약사항 · 날짜 · 서명 줄 ────────────────────────────
  textField({
    id: 'special', section: 'sign', koLabel: '특약사항',
    label: { ko: '특약사항', en: 'Special terms', zh: '特约事项', ja: '特約事項', vi: 'Điều khoản đặc biệt' },
    help: { ko: '따로 정한 약속을 한국어로 적어요. 양도인이 할부로 산 차를 할부금을 다 내지 않은 채 넘기면, 남은 할부금을 양수인이 이어서 낼지를 여기에 꼭 적어요(제7조).', en: 'Any separate agreement, in Korean. If the seller bought the vehicle on installments and has not finished paying, write here whether the buyer will take over the remaining installments (Article 7).', zh: '用韩文填写另行约定的事项。让渡人分期购买车辆且未付清分期款就转让时，须在此注明剩余分期款是否由受让人继续支付（第7条）。', ja: '別に決めた約束を韓国語で書きます。譲渡人が割賦で買った車を割賦金を払い終えないまま譲る場合は、残りの割賦金を譲受人が引き継ぐかどうかを必ずここに書きます（第7条）。', vi: 'Thỏa thuận riêng, ghi bằng tiếng Hàn. Nếu bên bán mua xe trả góp và chưa trả hết, phải ghi ở đây bên mua có tiếp tục trả phần trả góp còn lại hay không (Điều 7).' },
    area: { x: 145, y: 1080, w: 718, h: 56 }, badgeAt: { x: 127, y: 1096 },
    part: { key: 'text', box: { x: 225, y: 1083, w: 630, h: 50, align: 'left' }, korean: true },
  }),
  dateField({
    id: 'certDate', section: 'sign', koLabel: '( 년 월 일)',
    label: { ko: '증명서를 쓴 날짜', en: 'Date of this certificate', zh: '证明书日期', ja: '証明書の日付', vi: 'Ngày lập giấy chứng nhận' },
    help: { ko: '양도인과 양수인이 이 증명서를 쓰는 날짜예요. 증명서는 2통을 써서 갑과 을이 1통씩 가져요(제8조).', en: 'The date the seller and buyer complete this certificate. Make 2 copies; A and B keep one each (Article 8).', zh: '让渡人和受让人填写本证明书的日期。证明书一式2份，甲乙各持1份（第8条）。', ja: '譲渡人と譲受人がこの証明書を書く日付です。証明書は2通作り、甲と乙が1通ずつ持ちます（第8条）。', vi: 'Ngày bên bán và bên mua lập giấy này. Lập 2 bản, A và B mỗi bên giữ 1 bản (Điều 8).' },
    area: { x: 712, y: 1192, w: 312, h: 26 }, badgeAt: { x: 694, y: 1205 },
    y: { x: 720, y: 1193, w: 82, h: 24, align: 'right' }, m: { x: 830, y: 1193, w: 68, h: 24, align: 'right' }, d: { x: 925, y: 1193, w: 70, h: 24, align: 'right' },
  }),
  ...([
    ['signSeller', '양도인 (대표)', TRANSFEROR, 'sellerName', { x: 262, y: 1219, w: 180, h: 24 }, { x: 128, y: 1231 }],
    ['signSellerCo', '양도인 공동명의자', TRANSFEROR_CO, 'sellerCoName', { x: 306, y: 1245, w: 136, h: 24 }, { x: 96, y: 1257 }],
    ['signBuyer', '양수인 (대표)', TRANSFEREE, 'buyerName', { x: 692, y: 1219, w: 220, h: 24 }, { x: 1042, y: 1231 }],
    ['signBuyerCo', '양수인 공동명의자', TRANSFEREE_CO, 'buyerCoName', { x: 732, y: 1245, w: 180, h: 24 }, { x: 1078, y: 1257 }],
  ] as const).map(([id, ko, who, from, box, at]) =>
    nameField({
      id, section: 'sign', koLabel: `${ko} (서명 또는 인)`, who,
      help: {
        ko: `${who.ko}의 이름을 다시 적고, 출력한 종이에 서명하거나 도장을 찍어요. 양도인이 서명하면 본인서명사실확인서(또는 전자본인서명확인서 발급증)를, 도장을 찍으면 인감증명서를 함께 내야 해요.`,
        en: `Write the name of ${who.en} again and sign or stamp by hand on the printed paper. If the seller signs, attach a personal signature confirmation (or electronic signature confirmation issuance certificate); if the seller stamps, attach a seal certificate.`,
        zh: `再次填写${who.zh}的姓名，并在打印出的纸上签名或盖章。让渡人签名时须附本人签名事实确认书（或电子本人签名确认书发放证），盖章时须附印鉴证明书。`,
        ja: `${who.ja}の氏名をもう一度書き、印刷した紙に署名または押印します。譲渡人が署名する場合は本人署名事実確認書（または電子本人署名確認書発給証）を、押印する場合は印鑑証明書を添付します。`,
        vi: `Ghi lại họ tên ${who.vi}, rồi ký hoặc đóng dấu trên giấy đã in. Nếu bên bán ký tên, nộp kèm giấy xác nhận chữ ký (hoặc giấy cấp xác nhận chữ ký điện tử); nếu đóng dấu, nộp kèm giấy chứng nhận con dấu cá nhân.`,
      },
      area: { x: box.x - 4, y: box.y - 2, w: box.w + 8, h: box.h + 4 }, badgeAt: at, box: { ...box, align: 'center' },
      copyFrom: [copyNameFrom(from, who)],
    }),
  ),
];

export const vehicleTransferCertificate: FormDef = {
  id: 'vehicle-transfer-certificate',
  title: { ko: '자동차양도증명서', en: 'Vehicle Transfer Certificate', zh: '汽车让渡证明书', ja: '自動車譲渡証明書', vi: 'Giấy chứng nhận chuyển nhượng xe' },
  pages: [{ image: '/forms/vehicle-transfer-certificate_ko.png', width: 1190, height: 1682 }],
  sections: [
    { id: 'seller', label: { ko: '갑 (양도인)', en: 'A (seller)', zh: '甲（让渡人）', ja: '甲（譲渡人）', vi: 'A (bên bán)' } },
    { id: 'buyer', label: { ko: '을 (양수인)', en: 'B (buyer)', zh: '乙（受让人）', ja: '乙（譲受人）', vi: 'B (bên mua)' } },
    { id: 'deal', label: { ko: '거래 내용', en: 'Transaction', zh: '交易内容', ja: '取引内容', vi: 'Nội dung giao dịch' } },
    { id: 'sign', label: { ko: '특약·날짜·서명', en: 'Terms, date and signatures', zh: '特约·日期·签名', ja: '特約・日付・署名', vi: 'Điều khoản, ngày và chữ ký' } },
  ],
  fields,
};
