import { dateField, idField, ID_HELP, nameField, opt, textField, topRight, Who } from './common';
import { Box, ChoiceOption, FieldDef, FormDef, L } from './types';

// ─────────────────────────────────────────────────────────────
// 주민등록증 재발급 신청서 [주민등록법 시행령 별지 제32호서식] — v1 서식 36번 (2쪽)
// 좌표는 public/forms/id-card-reissue-application_ko.png, _ko_2.png (1190×1682) 기준.
// 안내 문구는 앞쪽 안내·뒤쪽 「유의사항」을 바탕으로 작성.
// 접수란, 서명, 담당 공무원 확인 사항은 입력받지 않는다.
// ─────────────────────────────────────────────────────────────

const APPLICANT: Who = { ko: '신청인', en: 'the applicant', zh: '申请人', ja: '申請人', vi: 'người nộp đơn' };
const VISIT_APPLICANT: Who = { ko: '방문 재발급 신청인', en: 'the person applying for a visit re-issuance', zh: '上门补发申请人', ja: '訪問再発給の申請人', vi: 'người xin cấp lại tại nhà' };

const cell = (x: number, y: number, x2: number, y2: number): Box => ({ x: x + 1, y: y + 1, w: x2 - x - 2, h: y2 - y - 2 });

const YES = 601;
const NO = 803;
const applyOptions = (y: number): ChoiceOption[] => [
  opt('apply', '신청', { ko: '신청', en: 'Apply', zh: '申请', ja: '申請する', vi: 'Đăng ký' }, YES, y),
  opt('no', '미신청', { ko: '미신청', en: 'Do not apply', zh: '不申请', ja: '申請しない', vi: 'Không đăng ký' }, NO, y),
];
const row = (id: string, koLabel: string, label: L, help: L, y0: number, y1: number, options: ChoiceOption[], extra?: Extract<FieldDef['input'], { kind: 'choice' }>['extra']): FieldDef => ({
  id, section: 'receive', koLabel, label, help,
  area: cell(560, y0, 1072, y1),
  badgeAt: { x: 1090, y: options[0].mark.y },
  input: { kind: 'choice', mark: 'check', options, extra },
});

/** 주소 (시·도) (시·군·구) — 시·도와 시·군·구만 적는 칸 */
const shortAddress = (id: string, section: string, koLabel: string, who: Who, area: Box, y: number, h: number): FieldDef => ({
  id, section, koLabel,
  label: { ko: `${who.ko} 주소 (시·도, 시·군·구)`, en: `Address of ${who.en} (province, city/district)`, zh: `${who.zh}地址（市·道、市·郡·区）`, ja: `${who.ja}の住所（市・道、市・郡・区）`, vi: `Địa chỉ ${who.vi} (tỉnh / thành, quận / huyện)` },
  help: { ko: '시·도와 시·군·구까지만 적어요. 상세 주소는 적지 않아도 돼요. 칸이 좁아서 시·도는 짧게 적어도 돼요. 예) 서울, 금천구', en: 'Only the province/city and district; no detailed address is needed. The box is small, so a short form is fine, e.g., 서울, 금천구.', zh: '只需填写到市·道和市·郡·区，不必写详细地址。栏位较窄，市·道可简写。例：서울、금천구。', ja: '市・道と市・郡・区までだけ書きます。詳しい住所は不要です。欄が狭いので市・道は短く書いても構いません（ソウル、衿川区にあたる韓国語など）。', vi: 'Chỉ ghi đến tỉnh / thành và quận / huyện; không cần địa chỉ chi tiết. Ô nhỏ nên có thể viết ngắn, VD: 서울, 금천구.' },
  area, badgeAt: topRight(area),
  input: {
    kind: 'text',
    parts: [
      { key: 'sido', box: { x: 240, y, w: 78, h, align: 'center' }, korean: true, label: { ko: '시·도', en: 'Province / metropolitan city', zh: '市·道', ja: '市・道', vi: 'Tỉnh / thành phố' }, placeholder: '예) 서울' },
      { key: 'sigungu', box: { x: 386, y, w: 124, h, align: 'center' }, korean: true, label: { ko: '시·군·구', en: 'City / county / district', zh: '市·郡·区', ja: '市・郡・区', vi: 'Quận / huyện' }, placeholder: '예) 금천구' },
    ],
  },
});

const REASONS: [string, string, L, number, number][] = [
  ['lost', '분실', { ko: '분실', en: 'Lost', zh: '遗失', ja: '紛失', vi: 'Bị mất' }, 257, 490],
  ['damaged', '훼손', { ko: '훼손', en: 'Damaged', zh: '损坏', ja: '毀損', vi: 'Bị hỏng' }, 520, 490],
  ['nameChange', '성명 변경', { ko: '성명 변경', en: 'Name changed', zh: '姓名变更', ja: '氏名変更', vi: 'Đổi họ tên' }, 810, 490],
  ['idChange', '주민등록번호 변경', { ko: '주민등록번호 변경', en: 'Registration number changed', zh: '居民登录号变更', ja: '住民登録番号変更', vi: 'Đổi số đăng ký cư trú' }, 257, 514],
  ['addressFull', '주소 변경 칸 부족', { ko: '주소 변경 칸 부족', en: 'No space left for address changes', zh: '地址变更栏已满', ja: '住所変更欄の不足', vi: 'Hết chỗ ghi đổi địa chỉ' }, 520, 514],
  ['photo', '용모(사진)변경', { ko: '용모(사진) 변경', en: 'Appearance (photo) changed', zh: '容貌（照片）变更', ja: '容貌（写真）変更', vi: 'Thay đổi diện mạo (ảnh)' }, 810, 514],
  ['fingerprint', '지문 재등록', { ko: '지문 재등록', en: 'Fingerprint re-registration', zh: '指纹重新登记', ja: '指紋の再登録', vi: 'Đăng ký lại vân tay' }, 257, 538],
  ['uncollected', '미수령으로 회수·파기', { ko: '안 찾아가서 회수·파기됨', en: 'Uncollected card was withdrawn / destroyed', zh: '因未领取被回收·销毁', ja: '未受領による回収・廃棄', vi: 'Thẻ không nhận nên đã bị thu hồi / hủy' }, 520, 538],
  ['returnee', '주민등록 말소자의 귀국', { ko: '주민등록이 말소된 뒤 귀국', en: 'Return to Korea after registration was cancelled', zh: '居民登记被注销后回国', ja: '住民登録抹消者の帰国', vi: 'Về nước sau khi bị xóa đăng ký cư trú' }, 810, 538],
  ['overseas', '재외국민 주민등록', { ko: '재외국민 주민등록', en: 'Resident registration of an overseas Korean', zh: '在外国民居民登记', ja: '在外国民の住民登録', vi: 'Đăng ký cư trú của kiều bào' }, 257, 563],
  ['other', '그 밖의 사유', { ko: '그 밖의 사유', en: 'Other reason', zh: '其他原因', ja: 'その他の事由', vi: 'Lý do khác' }, 520, 563],
];

const fields: FieldDef[] = [
  // ── 신청인 ───────────────────────────────────────────────
  nameField({ id: 'nameKo', section: 'applicant', koLabel: '신청인 성명(한글)', who: APPLICANT, area: cell(231, 248, 677, 286), badgeAt: topRight(cell(231, 248, 677, 286)), box: { x: 340, y: 252, w: 290, h: 31, align: 'center' } }),
  { ...idField({ id: 'personId', section: 'applicant', koLabel: '신청인 주민등록번호', who: APPLICANT, area: cell(677, 248, 1072, 286), badgeAt: topRight(cell(677, 248, 1072, 286)), box: { x: 810, y: 252, w: 225, h: 31, align: 'center' } }), help: ID_HELP },
  shortAddress('address', 'applicant', '신청인 주소 (시·도) (시·군·구)', APPLICANT, cell(231, 286, 1072, 337), 304, 26),
  textField({
    id: 'phone', section: 'applicant', koLabel: '신청인 연락처',
    label: { ko: '신청인 연락처', en: 'Phone of the applicant', zh: '申请人联系电话', ja: '申請人の連絡先', vi: 'Số điện thoại người nộp đơn' },
    help: { ko: '연락 가능한 번호를 적어요. 수령 문자 안내 서비스를 신청하거나 등기우편으로 받으면서 문자를 받으려면 휴대전화 번호를 꼭 적어요.', en: 'A number where you can be reached. Write a mobile number if you apply for the pickup text service or want texts while receiving by registered mail.', zh: '填写可以联系到的号码。申请领取短信通知服务，或挂号邮寄时希望接收短信，必须填写手机号码。', ja: '連絡のつく番号を書きます。受取メッセージ案内サービスを申請する場合や、書留郵便で受け取りながらメッセージを受けたい場合は携帯電話番号を必ず書きます。', vi: 'Số điện thoại có thể liên lạc. Nếu đăng ký dịch vụ nhắn tin hoặc nhận qua bưu điện mà muốn nhận tin nhắn, phải ghi số di động.' },
    area: cell(231, 337, 1072, 385), badgeAt: topRight(cell(231, 337, 1072, 385)),
    part: { key: 'phone', box: { x: 300, y: 352, w: 420, h: 28, align: 'center' }, inputMode: 'tel', placeholder: '010-1234-5678' },
  }),
  {
    id: 'feeExempt', section: 'applicant', koLabel: '[ ] 수수료 면제를 신청함',
    label: { ko: '수수료 면제 신청', en: 'Apply for fee exemption', zh: '申请免除手续费', ja: '手数料免除の申請', vi: 'Xin miễn lệ phí' },
    help: { ko: '수수료 면제 대상(국민기초생활보장법에 따른 수급자, 독립유공자, 국가유공자 등 서식에 적힌 사람)이면 골라요. 재발급 수수료는 보통 5,000원이고, IC 칩이 든 주민등록증은 10,000원이에요.', en: 'Tick if you are eligible for fee exemption (e.g., a recipient under the National Basic Living Security Act, a person of national merit, etc., as listed on the form). The re-issuance fee is usually 5,000 won, or 10,000 won for an IC-chip card.', zh: '如属于免除手续费对象（依《国民基本生活保障法》的受助者、独立有功者、国家有功者等表格所列人员），请勾选。补发手续费一般为5,000韩元，内置IC芯片的为10,000韩元。', ja: '手数料免除の対象（国民基礎生活保障法による受給者、独立有功者、国家有功者など書式に記載された人）であれば選びます。再発給の手数料は通常5,000ウォン、ICチップ入りは10,000ウォンです。', vi: 'Chọn nếu thuộc đối tượng miễn lệ phí (người nhận trợ cấp sinh hoạt cơ bản, người có công... như ghi trên mẫu). Lệ phí cấp lại thường 5.000 won, thẻ có chip IC là 10.000 won.' },
    area: cell(231, 386, 1072, 473), badgeAt: { x: 1090, y: 400 },
    input: { kind: 'choice', mark: 'check', options: [opt('yes', '수수료 면제를 신청함', { ko: '수수료 면제를 신청해요', en: 'Apply for exemption', zh: '申请免除', ja: '免除を申請する', vi: 'Xin miễn' }, 257, 400)] },
  },

  // ── 재발급 사유 ──────────────────────────────────────────
  {
    id: 'reason', section: 'reason', koLabel: '재발급 사유',
    label: { ko: '재발급 사유', en: 'Reason for re-issuance', zh: '补发原因', ja: '再発給の事由', vi: 'Lý do cấp lại' },
    help: { ko: '다시 발급받는 이유를 골라요. 분실했다가 재발급받은 뒤 잃어버린 주민등록증을 찾으면 바로 읍·면사무소나 동 주민센터에 돌려줘야 해요.', en: 'Choose why you need a new card. If you find the lost card after getting a new one, return it to the community center right away.', zh: '选择补发原因。因遗失补发后又找到原证件时，须立即交还邑·面事务所或洞居民中心。', ja: '再発給を受ける理由を選びます。紛失して再発給を受けた後に元の住民登録証が見つかったら、すぐに邑・面事務所または洞住民センターに返却します。', vi: 'Chọn lý do cấp lại. Nếu sau khi cấp lại mà tìm thấy thẻ cũ bị mất, phải trả lại ngay cho văn phòng / trung tâm phường.' },
    area: cell(231, 473, 1072, 580), badgeAt: { x: 1090, y: 490 },
    input: { kind: 'choice', mark: 'check', options: REASONS.map(([v, ko, l, x, y]) => opt(v, ko, l, x, y)) },
  },
  {
    id: 'icChip', section: 'reason', koLabel: '[ ] 집적회로 칩 내장',
    label: { ko: 'IC 칩 내장', en: 'Built-in IC chip', zh: '内置IC芯片', ja: 'ICチップ内蔵', vi: 'Gắn chip IC' },
    help: { ko: 'IC 칩이 든 주민등록증을 받으면 주민센터에 가지 않고 휴대전화로 모바일 주민등록증을 발급·재발급 신청할 수 있어요. 수수료가 5,000원 더 들어요.', en: 'With an IC-chip card you can apply for (re)issuance of a mobile ID on your phone without visiting the community center. It costs 5,000 won more.', zh: '领取内置IC芯片的居民登录证后，无需前往居民中心即可用手机申请发放或补发移动居民登录证。手续费多5,000韩元。', ja: 'ICチップ入りの住民登録証を受け取ると、住民センターに行かずに携帯電話でモバイル住民登録証の発給・再発給を申請できます。手数料が5,000ウォン追加されます。', vi: 'Có thẻ gắn chip IC thì có thể xin cấp / cấp lại thẻ trên điện thoại mà không cần đến trung tâm phường. Phí thêm 5.000 won.' },
    area: cell(231, 580, 1072, 679), badgeAt: { x: 1090, y: 595 },
    input: { kind: 'choice', mark: 'check', options: [opt('yes', '집적회로 칩 내장', { ko: 'IC 칩이 든 주민등록증으로 받아요', en: 'Get a card with an IC chip', zh: '领取内置IC芯片的证件', ja: 'ICチップ入りで受け取る', vi: 'Nhận thẻ có chip IC' }, 257, 595)] },
  },

  // ── 수령 ─────────────────────────────────────────────────
  row('confirmSlip', '주민등록증 발급신청 확인서',
    { ko: '발급신청 확인서', en: 'Application confirmation slip', zh: '发放申请确认书', ja: '発給申請確認書', vi: 'Giấy xác nhận đã nộp đơn' },
    { ko: '재발급을 신청했다는 확인서를 받을지 골라요.', en: 'Choose whether you want a slip confirming your application.', zh: '选择是否领取已申请补发的确认书。', ja: '再発給を申請したという確認書を受け取るかを選びます。', vi: 'Chọn có nhận giấy xác nhận đã nộp đơn hay không.' },
    764, 795, applyOptions(783)),
  row('receiveMethod', '주민등록증 수령 방법',
    { ko: '받는 방법', en: 'How to receive the card', zh: '领取方式', ja: '受取方法', vi: 'Cách nhận thẻ' },
    { ko: '직접 찾으러 갈지(방문), 등기우편으로 받을지 골라요. 방문이면 받을 읍·면사무소나 동 주민센터 이름을 적어요. 방문 수령은 6개월이 지나도 안 찾아가면 주민등록지로 옮겨지고, 3년이 지나면 파기돼요. 등기우편은 우편료를 내야 해요.', en: 'Choose to pick it up in person (visit) or by registered mail. For a visit, write the name of the office where you will pick it up. Uncollected cards are moved after 6 months and destroyed after 3 years. Registered mail requires a postage fee.', zh: '选择亲自领取（上门）还是挂号邮寄。上门领取请填写领取地点名称。超过6个月未领会移交住所地，超过3年将销毁。挂号邮寄须缴纳邮费。', ja: '直接受け取りに行く（訪問）か書留郵便かを選びます。訪問の場合は受け取る場所の名称を書きます。6か月過ぎても受け取らないと住民登録地へ移され、3年過ぎると廃棄されます。書留郵便は郵便料が必要です。', vi: 'Chọn tự đến nhận hay nhận qua bưu điện bảo đảm. Nếu đến nhận, ghi tên nơi nhận. Quá 6 tháng không nhận thẻ được chuyển đi, quá 3 năm sẽ bị hủy. Bưu điện bảo đảm phải trả phí.' },
    795, 881, [
      opt('visit', '방문', { ko: '방문 (직접 찾으러 가요)', en: 'Pick up in person', zh: '上门领取', ja: '訪問（直接受け取る）', vi: 'Tự đến nhận' }, YES, 812),
      opt('mail', '등기우편', { ko: '등기우편', en: 'Registered mail', zh: '挂号邮寄', ja: '書留郵便', vi: 'Bưu điện bảo đảm' }, YES, 869),
    ],
    { key: 'place', when: ['visit'], box: { x: 692, y: 801, w: 166, h: 22, align: 'center' }, korean: true, label: { ko: '받을 곳 (읍·면사무소, 동 주민센터 이름)', en: 'Pickup office name', zh: '领取地点名称', ja: '受取場所の名称', vi: 'Tên nơi nhận' }, placeholder: '예) 독산1동 주민센터' }),
  row('smsService', '주민등록증 수령 문자 안내 서비스',
    { ko: '수령 문자 안내', en: 'Pickup text notification', zh: '领取短信通知', ja: '受取メッセージ案内', vi: 'Tin nhắn thông báo nhận thẻ' },
    { ko: '주민등록증이 준비되면 문자로 알려 주는 서비스를 신청할지 골라요. 신청하면 연락처에 휴대전화 번호를 적어요.', en: 'Choose whether to get a text message when the card is ready. If so, write a mobile number in the contact box.', zh: '选择是否申请证件制作完成时的短信通知服务。申请时请在联系方式栏填写手机号码。', ja: '住民登録証ができたらメッセージで知らせるサービスを申請するかを選びます。申請する場合は連絡先に携帯電話番号を書きます。', vi: 'Chọn có đăng ký nhận tin nhắn khi thẻ làm xong không. Nếu có, ghi số di động ở ô liên hệ.' },
    881, 911, applyOptions(899)),
  row('braille', '점자 스티커',
    { ko: '점자 스티커', en: 'Braille sticker', zh: '盲文贴纸', ja: '点字ステッカー', vi: 'Nhãn chữ nổi' },
    { ko: '주민등록증에 붙이는 점자 스티커가 필요하면 「신청」을 골라요.', en: 'Choose "Apply" if you need a braille sticker for the card.', zh: '需要贴在居民登录证上的盲文贴纸时，选择“申请”。', ja: '住民登録証に貼る点字ステッカーが必要なら「申請する」を選びます。', vi: 'Chọn "Đăng ký" nếu cần nhãn chữ nổi dán lên thẻ.' },
    911, 942, applyOptions(928)),
  {
    id: 'mailSameAddress', section: 'receive', koLabel: '등기우편 수령 주소 [ ] 주민등록 주소와 같음',
    label: { ko: '등기우편 받을 주소가 주민등록 주소와 같음', en: 'Mail to my registered address', zh: '挂号邮寄地址与居民登记地址相同', ja: '書留郵便の受取住所が住民登録住所と同じ', vi: 'Địa chỉ nhận thư giống địa chỉ cư trú' },
    help: { ko: '등기우편으로 받을 때만 적어요. 주민등록 주소로 받으면 이 칸을 골라요. 다른 주소로 받으려면 아래 칸에 우편번호와 주소를 적어요.', en: 'Only if receiving by registered mail. Tick this if it should go to your registered address; otherwise fill in the postal code and address in the next box.', zh: '仅在挂号邮寄时填写。寄到居民登记地址时勾选此项；寄到其他地址时，请在下一栏填写邮编和地址。', ja: '書留郵便で受け取る場合のみ書きます。住民登録の住所で受け取るならこれを選び、別の住所なら次の欄に郵便番号と住所を書きます。', vi: 'Chỉ khi nhận qua bưu điện bảo đảm. Chọn ô này nếu gửi về địa chỉ cư trú; nếu khác, ghi mã bưu chính và địa chỉ ở ô tiếp theo.' },
    area: cell(231, 942, 1072, 972), badgeAt: { x: 1090, y: 960 },
    input: { kind: 'choice', mark: 'check', options: [opt('same', '주민등록 주소와 같음', { ko: '주민등록 주소와 같아요', en: 'Same as my registered address', zh: '与居民登记地址相同', ja: '住民登録の住所と同じ', vi: 'Giống địa chỉ cư trú' }, 605, 960)] },
  },
  {
    id: 'mailOtherAddress', section: 'receive', koLabel: '주민등록 주소가 아닌 경우: (우 )',
    label: { ko: '등기우편 받을 다른 주소', en: 'Other mailing address', zh: '其他邮寄地址', ja: '別の郵送先住所', vi: 'Địa chỉ nhận thư khác' },
    help: { ko: '주민등록 주소가 아닌 곳에서 받을 때만, 우편번호와 주소를 한국어로 적어요.', en: 'Only if mailing to an address other than your registered one: postal code and address in Korean.', zh: '仅在寄到居民登记地址以外时，用韩文填写邮编和地址。', ja: '住民登録の住所以外で受け取る場合のみ、郵便番号と住所を韓国語で書きます。', vi: 'Chỉ khi nhận ở địa chỉ khác địa chỉ cư trú: mã bưu chính và địa chỉ bằng tiếng Hàn.' },
    area: cell(231, 972, 1072, 1001), badgeAt: { x: 1090, y: 987 },
    input: {
      kind: 'text',
      parts: [
        { key: 'zip', box: { x: 470, y: 977, w: 78, h: 21, align: 'center' }, inputMode: 'numeric', label: { ko: '우편번호', en: 'Postal code', zh: '邮编', ja: '郵便番号', vi: 'Mã bưu chính' }, placeholder: '08611' },
        { key: 'address', box: { x: 560, y: 977, w: 500, h: 21, align: 'left' }, korean: true, label: { ko: '주소', en: 'Address', zh: '地址', ja: '住所', vi: 'Địa chỉ' }, placeholder: '예) 서울시 금천구 시흥대로73길 70' },
      ],
    },
  },
  dateField({
    id: 'applyDate', section: 'receive', koLabel: '신청일 ( 년 월 일)',
    label: { ko: '신청하는 날짜', en: 'Date of application', zh: '申请日期', ja: '申請日', vi: 'Ngày nộp đơn' },
    help: { ko: '이 신청서를 제출하는 날짜예요. 보통 오늘 날짜를 적어요. 신청 철회는 신청한 날 근무 시간이 끝나기 전에만 할 수 있어요.', en: "The date you submit this. Usually today's date. A re-issuance application can be withdrawn only before office hours end on the day you applied.", zh: '提交本申请书的日期，通常填写今天的日期。撤回补发申请只能在申请当日下班前进行。', ja: 'この申請書を提出する日付です。通常は今日の日付を書きます。再発給申請の撤回は申請した日の勤務時間が終わる前にのみできます。', vi: 'Ngày bạn nộp đơn này. Thường là ngày hôm nay. Chỉ có thể rút đơn trước khi hết giờ làm việc trong ngày nộp.' },
    area: { x: 780, y: 1027, w: 292, h: 28 },
    y: { x: 800, y: 1029, w: 64, h: 24, align: 'right' }, m: { x: 890, y: 1029, w: 62, h: 24, align: 'right' }, d: { x: 980, y: 1029, w: 62, h: 24, align: 'right' },
  }),

  // ── 관계 공무원 방문 재발급 신청인 ───────────────────────
  nameField({
    id: 'visitName', section: 'visit', koLabel: '관계 공무원 방문 재발급 신청인 성명(한글)', who: VISIT_APPLICANT,
    help: { ko: '중증장애인을 위해 공무원이 찾아가 재발급해 달라고 신청하는 경우에만 적어요. 이 신청은 그 중증장애인, 법정대리인 또는 보호자(세대주·배우자·직계혈족 등)가 할 수 있어요. 서명은 출력한 종이에 직접 해요.', en: 'Only when requesting that an official visit to re-issue the card for a person with a severe disability. The person, their legal representative or a guardian (head of household, spouse, lineal relative, etc.) can request it. Sign by hand on the printed paper.', zh: '仅在申请由公务员上门为重度残疾人补发时填写。该申请可由重度残疾人本人、法定代理人或监护人（户主·配偶·直系血亲等）提出。签名请在打印出的纸上亲自完成。', ja: '重度障害者のために公務員が訪問して再発給するよう申請する場合のみ書きます。本人、法定代理人または保護者（世帯主・配偶者・直系血族など）が申請できます。署名は印刷した紙に直接します。', vi: 'Chỉ ghi khi xin cán bộ đến tận nơi cấp lại thẻ cho người khuyết tật nặng. Người đó, người đại diện theo pháp luật hoặc người bảo hộ (chủ hộ, vợ / chồng, người thân trực hệ...) có thể nộp. Ký trực tiếp trên giấy đã in.' },
    area: cell(231, 1078, 704, 1127), badgeAt: topRight(cell(231, 1078, 704, 1127)), box: { x: 330, y: 1098, w: 240, h: 26, align: 'center' },
  }),
  { ...idField({ id: 'visitId', section: 'visit', koLabel: '관계 공무원 방문 재발급 신청인 주민등록번호', who: VISIT_APPLICANT, area: cell(704, 1078, 1072, 1127), badgeAt: topRight(cell(704, 1078, 1072, 1127)), box: { x: 720, y: 1100, w: 300, h: 24, align: 'center' } }), help: ID_HELP },
  shortAddress('visitAddress', 'visit', '관계 공무원 방문 재발급 신청인 주소 (시·도) (시·군·구)', VISIT_APPLICANT, cell(231, 1127, 704, 1184), 1155, 22),
  textField({
    id: 'visitPhone', section: 'visit', koLabel: '관계 공무원 방문 재발급 신청인 연락처',
    label: { ko: `${VISIT_APPLICANT.ko} 연락처`, en: `Phone of ${VISIT_APPLICANT.en}`, zh: `${VISIT_APPLICANT.zh}联系电话`, ja: `${VISIT_APPLICANT.ja}の連絡先`, vi: `Số điện thoại ${VISIT_APPLICANT.vi}` },
    help: { ko: '연락 가능한 번호를 적어요.', en: 'A number where they can be reached.', zh: '填写可以联系到的号码。', ja: '連絡のつく番号を書きます。', vi: 'Số điện thoại có thể liên lạc.' },
    area: cell(704, 1127, 1072, 1184), badgeAt: topRight(cell(704, 1127, 1072, 1184)),
    part: { key: 'phone', box: { x: 720, y: 1155, w: 300, h: 24, align: 'center' }, inputMode: 'tel', placeholder: '010-1234-5678' },
  }),

  // ── 2쪽: 본인정보 공동이용 및 행정정보 공동이용 동의서 ────
  {
    id: 'infoConsent', section: 'consent', page: 2, koLabel: '본인정보 공동이용 및 행정정보 공동이용 동의서 [ ]1 [ ]2',
    label: { ko: '서류 확인 동의', en: 'Consent to check documents electronically', zh: '同意电子核查材料', ja: '書類確認への同意', vi: 'Đồng ý kiểm tra giấy tờ điện tử' },
    help: {
      ko: '담당 공무원이 수급자 정보나 가족관계증명서(상세) 같은 서류를 전산으로 확인하는 데 동의하면 해당 번호를 골라요. 동의하지 않으면 그 서류를 직접 내야 해요. 서명은 출력한 종이에 직접 해요.',
      en: 'Tick the items if you agree that the official checks documents such as benefit-recipient information or your family relation certificate (detailed) electronically. Otherwise you must submit them yourself. Sign by hand on the printed paper.',
      zh: '如同意由负责公务员电子核查受助者信息或家族关系证明书（详细）等材料，请勾选相应项。不同意时须亲自提交。签名请在打印出的纸上亲自完成。',
      ja: '担当公務員が受給者情報や家族関係証明書（詳細）などを電子的に確認することに同意する場合、該当する番号を選びます。同意しない場合は書類を自分で提出します。署名は印刷した紙に直接します。',
      vi: 'Chọn các mục nếu đồng ý để cán bộ kiểm tra thông tin người nhận trợ cấp hoặc giấy chứng nhận quan hệ gia đình (chi tiết) qua hệ thống điện tử. Nếu không, phải tự nộp. Ký trực tiếp trên giấy đã in.',
    },
    area: { x: 115, y: 672, w: 965, h: 80 },
    badgeAt: { x: 100, y: 713 },
    input: {
      kind: 'choice', mark: 'check', multiple: true,
      options: [
        opt('provide', '1', { ko: '1. 본인정보 제공 요구를 통한 전자적 확인에 동의', en: '1. Agree to electronic checking through a request for one’s own information', zh: '1. 同意通过本人信息提供要求进行电子核查', ja: '1. 本人情報提供要求による電子的確認に同意', vi: '1. Đồng ý kiểm tra điện tử qua yêu cầu cung cấp thông tin cá nhân' }, 135, 688),
        opt('share', '2', { ko: '2. 행정정보 공동이용을 통한 확인에 동의', en: '2. Agree to checking through shared administrative information', zh: '2. 同意通过行政信息共同利用进行核查', ja: '2. 行政情報の共同利用による確認に同意', vi: '2. Đồng ý kiểm tra qua dùng chung thông tin hành chính' }, 135, 738),
      ],
    },
  },
];

export const idCardReissueApplication: FormDef = {
  id: 'id-card-reissue-application',
  title: { ko: '주민등록증 재발급 신청서', en: 'ID Re-issuance App', zh: '身份证再发放申请', ja: '住民登録証再発行申請', vi: 'Đơn cấp lại thẻ căn cước' },
  pages: [
    { image: '/forms/id-card-reissue-application_ko.png', width: 1190, height: 1682 },
    { image: '/forms/id-card-reissue-application_ko_2.png', width: 1190, height: 1682 },
  ],
  sections: [
    { id: 'applicant', label: { ko: '신청인',                   en: 'Applicant',        zh: '申请人',   ja: '申請人',   vi: 'Người nộp đơn' } },
    { id: 'reason',    label: { ko: '재발급 사유',              en: 'Reason',           zh: '补发原因', ja: '再発給の事由', vi: 'Lý do cấp lại' } },
    { id: 'receive',   label: { ko: '수령',                     en: 'Receiving the card', zh: '领取',   ja: '受取',     vi: 'Nhận thẻ' } },
    { id: 'visit',     label: { ko: '관계 공무원 방문 재발급',  en: 'Visit re-issuance', zh: '上门补发', ja: '訪問再発給', vi: 'Cấp lại tại nhà' } },
    { id: 'consent',   label: { ko: '2쪽 동의서',               en: 'Page 2: consent',  zh: '第2页 同意书', ja: '2ページ 同意書', vi: 'Trang 2: đồng ý' } },
  ],
  fields,
};
