import { dateField, idField, ID_HELP, nameField, opt, textField, topRight, Who } from './common';
import { Box, ChoiceOption, FieldDef, FormDef, L } from './types';

// ─────────────────────────────────────────────────────────────
// 주민등록증 발급 신청서 [주민등록법 시행령 별지 제30호서식] — v1 서식 35번 (2쪽)
// 좌표는 public/forms/id-card-issue-application_ko.png, _ko_2.png (1190×1682) 기준.
// 안내 문구는 뒤쪽 「유의 사항」「작성 방법」을 바탕으로 작성.
// 사진·지문, 접수란, 본인 확인(담당 공무원·통장·이장·가족·증명 가능 서류), 서명은 입력받지 않는다.
// ─────────────────────────────────────────────────────────────

const APPLICANT: Who = { ko: '신청인', en: 'the applicant', zh: '申请人', ja: '申請人', vi: 'người nộp đơn' };
const VISIT_APPLICANT: Who = { ko: '방문 발급 신청인', en: 'the person applying for a visit issuance', zh: '上门办理申请人', ja: '訪問発給の申請人', vi: 'người xin cấp tại nhà' };

const cell = (x: number, y: number, x2: number, y2: number): Box => ({ x: x + 1, y: y + 1, w: x2 - x - 2, h: y2 - y - 2 });

/** 오른쪽 끝에 번호를 두는 [ ]신청 / [ ]미신청 줄 */
const YES = 587;
const NO = 781;
const applyOptions = (y: number): ChoiceOption[] => [
  opt('apply', '신청', { ko: '신청', en: 'Apply', zh: '申请', ja: '申請する', vi: 'Đăng ký' }, YES, y),
  opt('no', '미신청', { ko: '미신청', en: 'Do not apply', zh: '不申请', ja: '申請しない', vi: 'Không đăng ký' }, NO, y),
];
const row = (id: string, koLabel: string, label: L, help: L, y0: number, y1: number, options: ChoiceOption[], extra?: Extract<FieldDef['input'], { kind: 'choice' }>['extra']): FieldDef => ({
  id, section: 'request', koLabel, label, help,
  area: cell(562, y0, 1148, y1),
  badgeAt: { x: 1128, y: options[0].mark.y },
  input: { kind: 'choice', mark: 'check', options, extra },
});

const SMS_NOTE: L = {
  ko: ' 「등기우편」으로 받으면서 문자 안내를 받으려면 연락처에 휴대전화 번호를 꼭 적어요.',
  en: ' If you receive by registered mail and want text notifications, you must write a mobile number in the contact box.',
  zh: '选择挂号邮寄并希望接收短信通知时，联系方式栏中必须填写手机号码。',
  ja: '「書留郵便」で受け取り、メッセージ通知を受けたい場合は、連絡先に携帯電話番号を必ず書きます。',
  vi: ' Nếu nhận qua bưu điện bảo đảm và muốn nhận tin nhắn, phải ghi số điện thoại di động ở ô liên hệ.',
};

const fields: FieldDef[] = [
  // ── 신청인 ───────────────────────────────────────────────
  nameField({ id: 'nameKo', section: 'applicant', koLabel: '성명(한글)', who: APPLICANT, area: cell(222, 122, 562, 164), badgeAt: topRight(cell(222, 122, 562, 164)), box: { x: 330, y: 127, w: 200, h: 34, align: 'center' } }),
  textField({
    id: 'nameHanja', section: 'applicant', koLabel: '성명(한자)',
    label: { ko: '신청인 이름 (한자)', en: 'Name of the applicant (Chinese characters)', zh: '申请人姓名（汉字）', ja: '申請人の氏名（漢字）', vi: 'Họ tên người nộp đơn (chữ Hán)' },
    help: { ko: '한자 이름이 있을 때만 적어요.', en: 'Only if there is a name in Chinese characters.', zh: '仅在有汉字姓名时填写。', ja: '漢字の氏名がある場合のみ書きます。', vi: 'Chỉ ghi nếu có tên chữ Hán.' },
    area: cell(562, 122, 920, 164), badgeAt: topRight(cell(562, 122, 920, 164)),
    part: { key: 'hanja', box: { x: 670, y: 127, w: 210, h: 34, align: 'center' }, placeholder: '예) 洪吉洞' },
  }),
  { ...idField({ id: 'personId', section: 'applicant', koLabel: '주민등록번호', who: APPLICANT, area: cell(222, 164, 920, 195), badgeAt: topRight(cell(222, 164, 920, 195)), box: { x: 380, y: 166, w: 400, h: 28, align: 'center' } }), help: ID_HELP },
  textField({
    id: 'address', section: 'applicant', koLabel: '주소',
    label: { ko: '신청인 주소', en: 'Address of the applicant', zh: '申请人地址', ja: '申請人の住所', vi: 'Địa chỉ người nộp đơn' },
    help: { ko: '주민등록이 된 주소를 한국어로 적어요.', en: 'Your registered address, in Korean.', zh: '用韩文填写已登记的居民地址。', ja: '住民登録している住所を韓国語で書きます。', vi: 'Địa chỉ đăng ký cư trú, ghi bằng tiếng Hàn.' },
    area: cell(222, 195, 920, 241), badgeAt: topRight(cell(222, 195, 920, 241)),
    part: { key: 'address', box: { x: 280, y: 199, w: 600, h: 39, align: 'center' }, korean: true },
  }),
  textField({
    id: 'phone', section: 'applicant', koLabel: '연락처',
    label: { ko: '신청인 연락처', en: 'Phone of the applicant', zh: '申请人联系电话', ja: '申請人の連絡先', vi: 'Số điện thoại người nộp đơn' },
    help: { ko: '연락 가능한 번호를 적어요. 수령 문자 안내 서비스를 신청하면 휴대전화 번호를 적어요.', en: 'A number where you can be reached. If you apply for the pickup text service, write a mobile number.', zh: '填写可以联系到的号码。申请领取短信通知服务时，请填写手机号码。', ja: '連絡のつく番号を書きます。受取メッセージ案内サービスを申請する場合は携帯電話番号を書きます。', vi: 'Số điện thoại có thể liên lạc. Nếu đăng ký dịch vụ nhắn tin nhận thẻ, ghi số di động.' },
    area: cell(222, 241, 920, 297), badgeAt: topRight(cell(222, 241, 920, 297)),
    part: { key: 'phone', box: { x: 300, y: 245, w: 400, h: 30, align: 'center' }, inputMode: 'tel', placeholder: '010-1234-5678' },
  }),

  // ── 신청 내용 ────────────────────────────────────────────
  row('issueType', '주민등록증 발급 구분',
    { ko: '발급 구분', en: 'Type of issuance', zh: '发放类别', ja: '発給区分', vi: 'Loại cấp thẻ' },
    { ko: '국내에 사는 사람(거주자)인지, 재외국민인지 골라요.', en: 'Choose whether you live in Korea (resident) or are an overseas Korean national.', zh: '选择是在国内居住者（居住者）还是在外国民。', ja: '国内に住む人（居住者）か在外国民かを選びます。', vi: 'Chọn là người cư trú trong nước hay kiều bào (công dân Hàn ở nước ngoài).' },
    300, 326, [
      opt('resident', '거주자', { ko: '거주자', en: 'Resident in Korea', zh: '居住者', ja: '居住者', vi: 'Người cư trú' }, YES, 313),
      opt('overseas', '재외국민', { ko: '재외국민', en: 'Overseas Korean national', zh: '在外国民', ja: '在外国民', vi: 'Kiều bào' }, NO, 313),
    ]),
  row('icChip', '집적회로(IC) 칩 내장',
    { ko: 'IC 칩 내장', en: 'Built-in IC chip', zh: '内置IC芯片', ja: 'ICチップ内蔵', vi: 'Gắn chip IC' },
    { ko: 'IC 칩이 든 주민등록증을 받으면 주민센터에 가지 않고 휴대전화로 모바일 주민등록증을 발급·재발급 신청할 수 있어요. 칩에는 개인정보가 들어가지 않아요.', en: 'With an IC-chip card you can apply for (re)issuance of a mobile ID card on your phone without visiting the community center. No personal information is stored on the chip.', zh: '领取内置IC芯片的居民登录证后，无需前往居民中心即可用手机申请发放或补发移动居民登录证。芯片中不含个人信息。', ja: 'ICチップ入りの住民登録証を受け取ると、住民センターに行かずに携帯電話でモバイル住民登録証の発給・再発給を申請できます。チップには個人情報は入りません。', vi: 'Có thẻ gắn chip IC thì có thể xin cấp / cấp lại thẻ trên điện thoại mà không cần đến trung tâm phường. Chip không chứa thông tin cá nhân.' },
    326, 388, applyOptions(339)),
  row('confirmSlip', '주민등록증 발급 신청 확인서',
    { ko: '발급 신청 확인서', en: 'Application confirmation slip', zh: '发放申请确认书', ja: '発給申請確認書', vi: 'Giấy xác nhận đã nộp đơn' },
    { ko: '발급을 신청했다는 확인서를 받을지 골라요.', en: 'Choose whether you want a slip confirming your application.', zh: '选择是否领取已申请发放的确认书。', ja: '発給を申請したという確認書を受け取るかを選びます。', vi: 'Chọn có nhận giấy xác nhận đã nộp đơn hay không.' },
    390, 414, applyOptions(402)),
  row('receiveMethod', '주민등록증 수령 방법',
    { ko: '받는 방법', en: 'How to receive the card', zh: '领取方式', ja: '受取方法', vi: 'Cách nhận thẻ' },
    { ko: '직접 찾으러 갈지(방문), 등기우편으로 받을지 골라요. 방문이면 받을 읍·면사무소나 동 주민센터 이름을 적어요. 방문 수령은 6개월이 지나도 안 찾아가면 주민등록지로 옮겨지고, 3년이 지나면 파기돼요. 등기우편은 우편료를 내야 해요.' + SMS_NOTE.ko, en: 'Choose to pick it up in person (visit) or by registered mail. For a visit, write the name of the office where you will pick it up. Uncollected cards are moved to your registered address office after 6 months and destroyed after 3 years. Registered mail requires a postage fee.' + SMS_NOTE.en, zh: '选择亲自领取（上门）还是挂号邮寄。上门领取请填写领取的邑·面事务所或洞居民中心名称。上门领取超过6个月未领会移交住所地，超过3年将销毁。挂号邮寄须缴纳邮费。' + SMS_NOTE.zh, ja: '直接受け取りに行く（訪問）か書留郵便かを選びます。訪問の場合は受け取る邑・面事務所または洞住民センターの名称を書きます。訪問受取は6か月過ぎても受け取らないと住民登録地へ移され、3年過ぎると廃棄されます。書留郵便は郵便料が必要です。' + SMS_NOTE.ja, vi: 'Chọn tự đến nhận (trực tiếp) hay nhận qua bưu điện bảo đảm. Nếu đến nhận, ghi tên văn phòng / trung tâm phường nơi nhận. Quá 6 tháng không nhận, thẻ được chuyển về nơi đăng ký cư trú; quá 3 năm sẽ bị hủy. Bưu điện bảo đảm phải trả phí.' + SMS_NOTE.vi },
    414, 488, [
      opt('visit', '방문', { ko: '방문 (직접 찾으러 가요)', en: 'Pick up in person', zh: '上门领取', ja: '訪問（直接受け取る）', vi: 'Tự đến nhận' }, YES, 428),
      opt('mail', '등기우편', { ko: '등기우편', en: 'Registered mail', zh: '挂号邮寄', ja: '書留郵便', vi: 'Bưu điện bảo đảm' }, YES, 477),
    ],
    { key: 'place', when: ['visit'], box: { x: 667, y: 416, w: 145, h: 24, align: 'center' }, korean: true, label: { ko: '받을 곳 (읍·면사무소, 동 주민센터 이름)', en: 'Pickup office name', zh: '领取地点名称', ja: '受取場所の名称', vi: 'Tên nơi nhận' }, placeholder: '예) 독산1동 주민센터' }),
  row('smsService', '주민등록증 수령 문자 안내 서비스',
    { ko: '수령 문자 안내', en: 'Pickup text notification', zh: '领取短信通知', ja: '受取メッセージ案内', vi: 'Tin nhắn thông báo nhận thẻ' },
    { ko: '주민등록증이 준비되면 문자로 알려 주는 서비스를 신청할지 골라요. 신청하면 연락처에 휴대전화 번호를 적어요.', en: 'Choose whether to get a text message when the card is ready. If so, write a mobile number in the contact box.', zh: '选择是否申请证件制作完成时的短信通知服务。申请时请在联系方式栏填写手机号码。', ja: '住民登録証ができたらメッセージで知らせるサービスを申請するかを選びます。申請する場合は連絡先に携帯電話番号を書きます。', vi: 'Chọn có đăng ký nhận tin nhắn khi thẻ làm xong không. Nếu có, ghi số di động ở ô liên hệ.' },
    490, 514, applyOptions(503)),
  row('braille', '점자 스티커',
    { ko: '점자 스티커', en: 'Braille sticker', zh: '盲文贴纸', ja: '点字ステッカー', vi: 'Nhãn chữ nổi' },
    { ko: '주민등록증에 붙이는 점자 스티커가 필요하면 「신청」을 골라요.', en: 'Choose "Apply" if you need a braille sticker for the card.', zh: '需要贴在居民登录证上的盲文贴纸时，选择“申请”。', ja: '住民登録証に貼る点字ステッカーが必要なら「申請する」を選びます。', vi: 'Chọn "Đăng ký" nếu cần nhãn chữ nổi dán lên thẻ.' },
    516, 540, applyOptions(528)),
  {
    id: 'mailSameAddress', section: 'request', koLabel: '등기우편 수령 주소 [ ] 주민등록 주소와 같음',
    label: { ko: '등기우편 받을 주소가 주민등록 주소와 같음', en: 'Mail to my registered address', zh: '挂号邮寄地址与居民登记地址相同', ja: '書留郵便の受取住所が住民登録住所と同じ', vi: 'Địa chỉ nhận thư giống địa chỉ cư trú' },
    help: { ko: '등기우편으로 받을 때만 적어요. 주민등록 주소로 받으면 이 칸을 골라요. 다른 주소로 받으려면 아래 칸에 우편번호와 주소를 적어요.', en: 'Only if receiving by registered mail. Tick this if it should go to your registered address; otherwise fill in the postal code and address in the next box.', zh: '仅在挂号邮寄时填写。寄到居民登记地址时勾选此项；寄到其他地址时，请在下一栏填写邮编和地址。', ja: '書留郵便で受け取る場合のみ書きます。住民登録の住所で受け取るならこれを選び、別の住所なら次の欄に郵便番号と住所を書きます。', vi: 'Chỉ khi nhận qua bưu điện bảo đảm. Chọn ô này nếu gửi về địa chỉ cư trú; nếu khác, ghi mã bưu chính và địa chỉ ở ô tiếp theo.' },
    area: cell(222, 540, 1148, 563), badgeAt: { x: 1128, y: 553 },
    input: { kind: 'choice', mark: 'check', options: [opt('same', '주민등록 주소와 같음', { ko: '주민등록 주소와 같아요', en: 'Same as my registered address', zh: '与居民登记地址相同', ja: '住民登録の住所と同じ', vi: 'Giống địa chỉ cư trú' }, 534, 553)] },
  },
  {
    id: 'mailOtherAddress', section: 'request', koLabel: '주민등록 주소가 아닌 경우: (우 )',
    label: { ko: '등기우편 받을 다른 주소', en: 'Other mailing address', zh: '其他邮寄地址', ja: '別の郵送先住所', vi: 'Địa chỉ nhận thư khác' },
    help: { ko: '주민등록 주소가 아닌 곳에서 받을 때만, 우편번호와 주소를 한국어로 적어요.', en: 'Only if mailing to an address other than your registered one: postal code and address in Korean.', zh: '仅在寄到居民登记地址以外时，用韩文填写邮编和地址。', ja: '住民登録の住所以外で受け取る場合のみ、郵便番号と住所を韓国語で書きます。', vi: 'Chỉ khi nhận ở địa chỉ khác địa chỉ cư trú: mã bưu chính và địa chỉ bằng tiếng Hàn.' },
    area: cell(222, 563, 1148, 587), badgeAt: { x: 1128, y: 575 },
    input: {
      kind: 'text',
      parts: [
        { key: 'zip', box: { x: 482, y: 565, w: 114, h: 21, align: 'center' }, inputMode: 'numeric', label: { ko: '우편번호', en: 'Postal code', zh: '邮编', ja: '郵便番号', vi: 'Mã bưu chính' }, placeholder: '08611' },
        { key: 'address', box: { x: 606, y: 565, w: 500, h: 21, align: 'left' }, korean: true, label: { ko: '주소', en: 'Address', zh: '地址', ja: '住所', vi: 'Địa chỉ' }, placeholder: '예) 서울시 금천구 시흥대로73길 70' },
      ],
    },
  },

  // ── 신청일 ───────────────────────────────────────────────
  dateField({
    id: 'applyDate', section: 'request', koLabel: '신청일 ( 년 월 일)',
    label: { ko: '신청하는 날짜', en: 'Date of application', zh: '申请日期', ja: '申請日', vi: 'Ngày nộp đơn' },
    help: { ko: '이 신청서를 제출하는 날짜예요. 보통 오늘 날짜를 적어요.', en: "The date you submit this. Usually today's date.", zh: '提交本申请书的日期，通常填写今天的日期。', ja: 'この申請書を提出する日付です。通常は今日の日付を書きます。', vi: 'Ngày bạn nộp đơn này. Thường là ngày hôm nay.' },
    area: { x: 880, y: 678, w: 266, h: 28 },
    y: { x: 890, y: 680, w: 66, h: 24, align: 'right' }, m: { x: 980, y: 680, w: 56, h: 24, align: 'right' }, d: { x: 1062, y: 680, w: 56, h: 24, align: 'right' },
  }),

  // ── 관계 공무원 방문 발급 신청인 ─────────────────────────
  nameField({
    id: 'visitName', section: 'visit', koLabel: '관계 공무원 방문 발급 신청인 성명(한글)', who: VISIT_APPLICANT,
    help: { ko: '중증장애인을 위해 공무원이 찾아가 발급해 달라고 신청하는 경우에만 적어요. 이 신청은 그 중증장애인, 법정대리인 또는 보호자(세대주·배우자·직계혈족 등)가 할 수 있어요. 서명은 출력한 종이에 직접 해요.', en: 'Only when requesting that an official visit to issue the card for a person with a severe disability. This can be requested by that person, their legal representative, or a guardian (head of household, spouse, lineal relative, etc.). Sign by hand on the printed paper.', zh: '仅在申请由公务员上门为重度残疾人办理时填写。该申请可由重度残疾人本人、法定代理人或监护人（户主·配偶·直系血亲等）提出。签名请在打印出的纸上亲自完成。', ja: '重度障害者のために公務員が訪問して発給するよう申請する場合のみ書きます。この申請は本人、法定代理人または保護者（世帯主・配偶者・直系血族など）ができます。署名は印刷した紙に直接します。', vi: 'Chỉ ghi khi xin cán bộ đến tận nơi cấp thẻ cho người khuyết tật nặng. Người khuyết tật đó, người đại diện theo pháp luật hoặc người bảo hộ (chủ hộ, vợ / chồng, người thân trực hệ...) có thể nộp. Ký trực tiếp trên giấy đã in.' },
    area: cell(228, 726, 699, 766), badgeAt: topRight(cell(228, 726, 699, 766)), box: { x: 330, y: 729, w: 240, h: 34, align: 'center' },
  }),
  { ...idField({ id: 'visitId', section: 'visit', koLabel: '관계 공무원 방문 발급 신청인 주민등록번호', who: VISIT_APPLICANT, area: cell(699, 726, 1148, 766), badgeAt: topRight(cell(699, 726, 1148, 766)), box: { x: 830, y: 729, w: 270, h: 34, align: 'center' } }), help: ID_HELP },
  {
    id: 'visitAddress', section: 'visit', koLabel: '관계 공무원 방문 발급 신청인 주소 (시·도) (시·군·구)',
    label: { ko: `${VISIT_APPLICANT.ko} 주소 (시·도, 시·군·구)`, en: `Address of ${VISIT_APPLICANT.en} (province, city/district)`, zh: `${VISIT_APPLICANT.zh}地址（市·道、市·郡·区）`, ja: `${VISIT_APPLICANT.ja}の住所（市・道、市・郡・区）`, vi: `Địa chỉ ${VISIT_APPLICANT.vi} (tỉnh / thành, quận / huyện)` },
    help: { ko: '시·도와 시·군·구만 적으면 돼요. 칸이 좁아서 시·도는 짧게 적어도 돼요. 예) 서울, 금천구', en: 'Only the province/city and district are needed. The box is small, so a short form is fine, e.g., 서울, 금천구.', zh: '只需填写市·道和市·郡·区。栏位较窄，市·道可简写。例：서울、금천구。', ja: '市・道と市・郡・区だけ書けば十分です。欄が狭いので市・道は短く書いても構いません（ソウル、衿川区にあたる韓国語など）。', vi: 'Chỉ cần ghi tỉnh / thành và quận / huyện. Ô nhỏ nên có thể viết ngắn, VD: 서울, 금천구.' },
    area: cell(146, 766, 699, 806), badgeAt: topRight(cell(146, 766, 699, 806)),
    input: {
      kind: 'text',
      parts: [
        { key: 'sido', box: { x: 191, y: 769, w: 48, h: 34, align: 'center' }, korean: true, label: { ko: '시·도', en: 'Province / metropolitan city', zh: '市·道', ja: '市・道', vi: 'Tỉnh / thành phố' }, placeholder: '예) 서울' },
        { key: 'sigungu', box: { x: 300, y: 769, w: 146, h: 34, align: 'center' }, korean: true, label: { ko: '시·군·구', en: 'City / county / district', zh: '市·郡·区', ja: '市・郡・区', vi: 'Quận / huyện' }, placeholder: '예) 금천구' },
      ],
    },
  },
  textField({
    id: 'visitPhone', section: 'visit', koLabel: '관계 공무원 방문 발급 신청인 연락처',
    label: { ko: `${VISIT_APPLICANT.ko} 연락처`, en: `Phone of ${VISIT_APPLICANT.en}`, zh: `${VISIT_APPLICANT.zh}联系电话`, ja: `${VISIT_APPLICANT.ja}の連絡先`, vi: `Số điện thoại ${VISIT_APPLICANT.vi}` },
    help: { ko: '연락 가능한 번호를 적어요.', en: 'A number where they can be reached.', zh: '填写可以联系到的号码。', ja: '連絡のつく番号を書きます。', vi: 'Số điện thoại có thể liên lạc.' },
    area: cell(699, 766, 1148, 806), badgeAt: topRight(cell(699, 766, 1148, 806)),
    part: { key: 'phone', box: { x: 800, y: 769, w: 300, h: 34, align: 'center' }, inputMode: 'tel', placeholder: '010-1234-5678' },
  }),

  // ── 2쪽: 본인정보 공동이용 및 행정정보 공동이용 동의서 ────
  {
    id: 'infoConsent', section: 'consent', page: 2, koLabel: '본인정보 공동이용 및 행정정보 공동이용 동의서 [ ]1 [ ]2',
    label: { ko: '서류 확인 동의', en: 'Consent to check documents electronically', zh: '同意电子核查材料', ja: '書類確認への同意', vi: 'Đồng ý kiểm tra giấy tờ điện tử' },
    help: {
      ko: '담당 공무원이 가족관계증명서(상세) 같은 서류를 전산으로 확인하는 데 동의하면 해당 번호를 골라요. 동의하지 않으면 그 서류를 직접 내야 해요. 서명은 출력한 종이에 직접 해요.',
      en: 'Tick the items if you agree that the official checks documents such as your family relation certificate (detailed) electronically. If you do not agree, you must submit those documents yourself. Sign by hand on the printed paper.',
      zh: '如同意由负责公务员电子核查家族关系证明书（详细）等材料，请勾选相应项。不同意时须亲自提交该材料。签名请在打印出的纸上亲自完成。',
      ja: '担当公務員が家族関係証明書（詳細）などの書類を電子的に確認することに同意する場合、該当する番号を選びます。同意しない場合はその書類を自分で提出します。署名は印刷した紙に直接します。',
      vi: 'Chọn các mục nếu đồng ý để cán bộ kiểm tra giấy tờ như giấy chứng nhận quan hệ gia đình (chi tiết) qua hệ thống điện tử. Nếu không đồng ý, phải tự nộp giấy tờ đó. Ký trực tiếp trên giấy đã in.',
    },
    area: { x: 30, y: 645, w: 1140, h: 78 },
    badgeAt: { x: 18, y: 684 },
    input: {
      kind: 'choice', mark: 'check', multiple: true,
      options: [
        opt('provide', '1', { ko: '1. 본인정보 제공 요구를 통한 전자적 확인에 동의', en: '1. Agree to electronic checking through a request for one’s own information', zh: '1. 同意通过本人信息提供要求进行电子核查', ja: '1. 本人情報提供要求による電子的確認に同意', vi: '1. Đồng ý kiểm tra điện tử qua yêu cầu cung cấp thông tin cá nhân' }, 50, 659),
        opt('share', '2', { ko: '2. 행정정보 공동이용을 통한 확인에 동의', en: '2. Agree to checking through shared administrative information', zh: '2. 同意通过行政信息共同利用进行核查', ja: '2. 行政情報の共同利用による確認に同意', vi: '2. Đồng ý kiểm tra qua dùng chung thông tin hành chính' }, 50, 709),
      ],
    },
  },
];

export const idCardIssueApplication: FormDef = {
  id: 'id-card-issue-application',
  title: { ko: '주민등록증 발급 신청서', en: 'ID Issuance Application', zh: '居民身份证发放申请', ja: '住民登録証発行申請', vi: 'Đơn xin cấp thẻ căn cước' },
  pages: [
    { image: '/forms/id-card-issue-application_ko.png', width: 1190, height: 1682 },
    { image: '/forms/id-card-issue-application_ko_2.png', width: 1190, height: 1682 },
  ],
  sections: [
    { id: 'applicant', label: { ko: '신청인',                 en: 'Applicant',            zh: '申请人',     ja: '申請人',     vi: 'Người nộp đơn' } },
    { id: 'request',   label: { ko: '신청 내용',              en: 'Request',              zh: '申请内容',   ja: '申請内容',   vi: 'Nội dung đăng ký' } },
    { id: 'visit',     label: { ko: '관계 공무원 방문 발급',  en: 'Visit issuance',       zh: '上门办理',   ja: '訪問発給',   vi: 'Cấp tại nhà' } },
    { id: 'consent',   label: { ko: '2쪽 동의서',             en: 'Page 2: consent',      zh: '第2页 同意书', ja: '2ページ 同意書', vi: 'Trang 2: đồng ý' } },
  ],
  fields,
};
