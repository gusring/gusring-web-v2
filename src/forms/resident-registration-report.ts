import { copyIdFrom, copyNameFrom, dateField, idField, nameField, textField, topRight, Who } from './common';
import { Box, FieldDef, FormDef, L } from './types';

// ─────────────────────────────────────────────────────────────
// 주민등록신고서(거주자용 및 영주귀국자용) [주민등록법 시행령 별지 제10호서식] — v1 서식 32번
// 좌표는 public/forms/resident-registration-report_ko.png(1190×1682) 기준.
// 색이 어두운 칸(접수번호·신고일자·처리란, 아래 「주민등록신고 확인서」)은 공무원이 적으므로 입력받지 않는다.
// 안내 문구는 뒤쪽 「유의사항」(v1 guides_ko_32)을 바탕으로 작성. 서명·날인은 출력한 종이에 직접 한다.
// ─────────────────────────────────────────────────────────────

const REPORTER: Who = { ko: '신고인', en: 'the person reporting', zh: '申报人', ja: '届出人', vi: 'người khai báo' };
const HEAD: Who = { ko: '세대주', en: 'the head of household', zh: '户主', ja: '世帯主', vi: 'chủ hộ' };

const cell = (x: number, y: number, x2: number, y2: number): Box => ({ x: x + 1, y: y + 1, w: x2 - x - 2, h: y2 - y - 2 });
/** 칸 이름이 왼쪽 위에 있는 칸 — 이름 아래 남은 자리 */
const below = (a: Box, top = 24): Box => ({ x: a.x + 14, y: a.y + top, w: a.w - 60, h: a.h - top - 3, align: 'center' });

const PHONE_HELP: L = { ko: '연락 가능한 번호를 적어요.', en: 'A number where they can be reached.', zh: '填写可以联系到的号码。', ja: '連絡のつく番号を書きます。', vi: 'Số điện thoại có thể liên lạc.' };
const label2 = (who: Who, ko: string, en: string, zh: string, ja: string, vi: string): L => ({ ko: `${who.ko} ${ko}`, en: `${en} of ${who.en}`, zh: `${who.zh}${zh}`, ja: `${who.ja}の${ja}`, vi: `${vi} ${who.vi}` });

const phone = (id: string, section: string, koLabel: string, label: L, a: Box, inputMode: 'tel' | 'email' = 'tel'): FieldDef =>
  textField({
    id, section, koLabel, label,
    help: inputMode === 'email' ? { ko: '선택 사항이에요.', en: 'Optional.', zh: '选填。', ja: '任意です。', vi: 'Không bắt buộc.' } : PHONE_HELP,
    area: a, badgeAt: topRight(a),
    part: inputMode === 'email'
      ? { key: 'email', box: below(a), inputMode: 'email', placeholder: 'name@example.com' }
      : { key: 'phone', box: below(a), inputMode: 'tel', placeholder: '010-1234-5678' },
  });

// ── 신고사항 표 (4줄) ────────────────────────────────────────
const ROWS = [666, 717, 768, 819, 870];
const SEX_OPTIONS = [
  { value: '남', label: { ko: '남', en: 'Male', zh: '男', ja: '男', vi: 'Nam' } },
  { value: '여', label: { ko: '여', en: 'Female', zh: '女', ja: '女', vi: 'Nữ' } },
];

const ROW_HELP: L = {
  ko: '주민등록을 하는 사람을 한 줄에 한 명씩 적어요. 「세대주와의 관계」는 본인·배우자·자녀처럼 한국어로 적고, 성명 아래 칸에는 한자 이름이 있으면 적어요.',
  en: 'One person being registered per row. Write the relationship to the head of household in Korean (e.g., 본인 self, 배우자 spouse, 자녀 child). Put the name in Chinese characters in the lower box if there is one.',
  zh: '每行填写一名办理居民登记的人。“与户主关系”用韩文填写（如본인、배우자、자녀），姓名下栏如有汉字姓名则填写。',
  ja: '住民登録をする人を1行に1人ずつ書きます。「世帯主との関係」は本人・配偶者・子などを韓国語で書き、氏名の下の欄には漢字の氏名があれば書きます。',
  vi: 'Mỗi dòng ghi một người đăng ký cư trú. Quan hệ với chủ hộ ghi bằng tiếng Hàn (VD: 본인 bản thân, 배우자 vợ/chồng, 자녀 con). Nếu có tên chữ Hán thì ghi ở ô dưới tên.',
};
const NUMS_HELP: L = {
  ko: '국내거소신고자는 국내거소신고번호를, 외국인이었다가 한국 국적을 얻은 사람은 외국인등록번호를 꼭 적어요. 등록기준지는 가족관계등록부에 있는 주소를 한국어로 적어요.',
  en: 'A domestic residence reporter must write the domestic residence report number; a person who was a foreigner and acquired Korean nationality must write the alien registration number. For the registration base, write the address on the family relation register in Korean.',
  zh: '国内居所申报者必须填写国内居所申报号；原为外国人后取得韩国国籍者必须填写外国人登录号。登记基准地用韩文填写家族关系登记簿上的地址。',
  ja: '国内居所申告者は国内居所申告番号を、外国人から韓国籍を取得した人は外国人登録番号を必ず書きます。登録基準地は家族関係登録簿にある住所を韓国語で書きます。',
  vi: 'Người khai báo cư trú trong nước phải ghi số khai báo cư trú; người từng là người nước ngoài và đã nhập quốc tịch Hàn phải ghi số đăng ký người nước ngoài. Nơi đăng ký gốc ghi địa chỉ trong sổ quan hệ gia đình, bằng tiếng Hàn.',
};

const personRow = (n: number): FieldDef[] => {
  const top = ROWS[n - 1];
  const bot = ROWS[n];
  const mid = (top + bot) / 2;
  const who: Who = { ko: `신고사항 ${n}번째 사람`, en: `person ${n} in the report`, zh: `申报事项第${n}人`, ja: `届出事項の${n}人目`, vi: `người thứ ${n} trong nội dung khai báo` };
  const s = `person${n}`;
  return [
    {
      id: `${s}`, section: s, koLabel: `신고사항 ${n} 세대주와의 관계 / 성명(한자) / 성별`,
      label: { ko: `${who.ko} — 관계·이름·성별`, en: `${who.en[0].toUpperCase() + who.en.slice(1)}: relationship, name, sex`, zh: `${who.zh}——关系·姓名·性别`, ja: `${who.ja}：関係・氏名・性別`, vi: `${who.vi[0].toUpperCase() + who.vi.slice(1)}: quan hệ, họ tên, giới tính` },
      help: ROW_HELP,
      area: cell(85, top, 421, bot), badgeAt: { x: 62, y: mid },
      input: {
        kind: 'text',
        parts: [
          { key: 'relation', box: { x: 88, y: top + 3, w: 100, h: bot - top - 6, align: 'center' }, korean: true, label: { ko: '세대주와의 관계', en: 'Relationship to the head of household', zh: '与户主关系', ja: '世帯主との関係', vi: 'Quan hệ với chủ hộ' }, placeholder: '예) 본인' },
          { key: 'name', box: { x: 194, y: top + 3, w: 163, h: 24, align: 'center' }, hangul: true, label: { ko: '성명 (한글)', en: 'Name (Hangul)', zh: '姓名（韩文）', ja: '氏名（ハングル）', vi: 'Họ tên (Hangul)' }, placeholder: '예) 응우옌반안' },
          { key: 'hanja', box: { x: 194, y: top + 26, w: 163, h: 22, align: 'center' }, label: { ko: '한자 (있으면)', en: 'Chinese characters (if any)', zh: '汉字（如有）', ja: '漢字（あれば）', vi: 'Chữ Hán (nếu có)' }, placeholder: '예) 洪吉洞' },
          { key: 'sex', box: { x: 363, y: top + 3, w: 55, h: bot - top - 6, align: 'center' }, label: { ko: '성별', en: 'Sex', zh: '性别', ja: '性別', vi: 'Giới tính' }, options: SEX_OPTIONS },
        ],
      },
    },
    {
      ...idField({ id: `${s}Id`, section: s, koLabel: `신고사항 ${n} 주민등록번호`, who, area: cell(421, top, 554, bot), badgeAt: { x: 1072, y: mid }, box: { x: 424, y: top + 3, w: 127, h: bot - top - 6, align: 'center' } }),
      help: {
        ko: '주민등록번호가 있으면 적어요. 처음 주민등록을 하는 사람은 비워 둬요.',
        en: 'Write the resident registration number if the person has one. Leave blank if this is the first registration.',
        zh: '如有居民登录号则填写。首次办理居民登记者留空。',
        ja: '住民登録番号があれば書きます。初めて住民登録をする人は空欄にします。',
        vi: 'Ghi số đăng ký cư trú nếu đã có. Người đăng ký lần đầu để trống.',
      },
      label: { ko: `${who.ko} 주민등록번호`, en: `Resident registration no. of ${who.en}`, zh: `${who.zh}居民登录号`, ja: `${who.ja}の住民登録番号`, vi: `Số đăng ký cư trú của ${who.vi}` },
    },
    {
      id: `${s}Nums`, section: s, koLabel: `신고사항 ${n} 국내거소신고번호 / 외국인등록번호 / 등록기준지`,
      label: { ko: `${who.ko} — 거소·외국인 번호, 등록기준지`, en: `${who.en[0].toUpperCase() + who.en.slice(1)}: residence / alien no., registration base`, zh: `${who.zh}——居所·外国人号码、登记基准地`, ja: `${who.ja}：居所・外国人番号、登録基準地`, vi: `${who.vi[0].toUpperCase() + who.vi.slice(1)}: số cư trú / người nước ngoài, nơi đăng ký gốc` },
      help: NUMS_HELP,
      area: cell(554, top, 1048, bot), badgeAt: { x: 1110, y: mid },
      input: {
        kind: 'text',
        parts: [
          { key: 'residenceNo', box: { x: 557, y: top + 3, w: 148, h: bot - top - 6, align: 'center' }, inputMode: 'numeric', label: { ko: '국내거소신고번호', en: 'Domestic residence report no.', zh: '国内居所申报号', ja: '国内居所申告番号', vi: 'Số khai báo cư trú trong nước' }, placeholder: '901231-5123456' },
          { key: 'alienNo', box: { x: 711, y: top + 3, w: 158, h: bot - top - 6, align: 'center' }, inputMode: 'numeric', label: { ko: '외국인등록번호', en: 'Alien registration no.', zh: '外国人登录号', ja: '外国人登録番号', vi: 'Số đăng ký người nước ngoài' }, placeholder: '901231-5123456' },
          { key: 'origin', box: { x: 875, y: top + 3, w: 170, h: bot - top - 6, align: 'center' }, korean: true, label: { ko: '등록기준지', en: 'Registration base', zh: '登记基准地', ja: '登録基準地', vi: 'Nơi đăng ký gốc' }, placeholder: '예) 서울특별시 금천구 시흥동' },
        ],
      },
    },
  ];
};

const fields: FieldDef[] = [
  // ── 신고인 ───────────────────────────────────────────────
  nameField({ id: 'reporterName', section: 'reporter', koLabel: '신고인 성명', who: REPORTER, area: cell(191, 258, 724, 319), badgeAt: topRight(cell(191, 258, 724, 319)), box: below(cell(191, 258, 724, 319)),
    help: { ko: '신고하는 사람의 이름을 한글로 적어요. 외국인이었던 사람은 외국인등록증의 이름을 한글로 옮겨 적어요.', en: 'Name of the person reporting, in Korean letters. If you were a foreign national, transcribe the name on your residence card into Hangul.', zh: '用韩文填写申报人姓名。原为外国人者，请将外国人登录证上的姓名按发音写成韩文。', ja: '届出人の氏名をハングルで書きます。外国人だった人は外国人登録証の氏名をハングル表記で書きます。', vi: 'Họ tên người khai báo bằng chữ Hàn. Nếu từng là người nước ngoài, phiên âm tên trên thẻ người nước ngoài sang Hangul.' } }),
  idField({ id: 'reporterId', section: 'reporter', koLabel: '신고인 주민등록번호', who: REPORTER, area: cell(724, 258, 1048, 319), badgeAt: topRight(cell(724, 258, 1048, 319)), box: below(cell(724, 258, 1048, 319)) }),
  textField({
    id: 'reporterRelation', section: 'reporter', koLabel: '신고인 세대주와의 관계',
    label: { ko: '신고인과 세대주의 관계', en: 'Relationship of the reporter to the head of household', zh: '申报人与户主的关系', ja: '届出人と世帯主の関係', vi: 'Quan hệ của người khai với chủ hộ' },
    help: { ko: '신고하는 사람이 세대주에게 누구인지 한국어로 적어요. 신고인이 세대주면 "본인"이라고 적어요.', en: 'Who the reporter is to the head of household, in Korean. If the reporter is the head, write 본인 (self).', zh: '用韩文填写申报人是户主的什么人。申报人就是户主时写“본인”。', ja: '届出人が世帯主の誰にあたるかを韓国語で書きます。届出人が世帯主なら「本人」にあたる韓国語を書きます。', vi: 'Người khai là ai đối với chủ hộ, ghi bằng tiếng Hàn. Nếu người khai là chủ hộ, ghi 본인 (bản thân).' },
    area: cell(191, 319, 360, 381), badgeAt: { x: 342, y: 362 },
    part: { key: 'relation', box: { x: 196, y: 344, w: 126, h: 33, align: 'center' }, korean: true, placeholder: '예) 본인' },
  }),
  phone('reporterPhone', 'reporter', '신고인 전화번호', label2(REPORTER, '전화번호', 'Phone number', '电话号码', '電話番号', 'Số điện thoại'), cell(360, 319, 724, 381)),
  phone('reporterMobile', 'reporter', '신고인 휴대전화번호', label2(REPORTER, '휴대전화번호', 'Mobile number', '手机号码', '携帯電話番号', 'Số di động'), cell(724, 319, 1048, 381)),

  // ── 세대주 ───────────────────────────────────────────────
  nameField({ id: 'headName', section: 'head', koLabel: '세대주 성명 (서명 또는 인)', who: HEAD, area: cell(191, 387, 724, 447), badgeAt: topRight(cell(191, 387, 724, 447)), box: { x: 206, y: 411, w: 380, h: 33, align: 'center' },
    help: { ko: '세대주의 이름을 한글로 적어요. 세대주의 서명이나 도장(확인)을 출력한 종이에 받아야 해요.', en: "Name of the head of household in Korean letters. The head of household must sign or stamp (confirm) on the printed paper.", zh: '用韩文填写户主姓名。须在打印出的纸上取得户主的签名或盖章（确认）。', ja: '世帯主の氏名をハングルで書きます。印刷した紙に世帯主の署名または押印（確認）をもらいます。', vi: 'Họ tên chủ hộ bằng chữ Hàn. Phải có chữ ký hoặc con dấu (xác nhận) của chủ hộ trên giấy đã in.' },
    copyFrom: [copyNameFrom('reporterName', REPORTER)] }),
  idField({ id: 'headId', section: 'head', koLabel: '세대주 주민등록번호', who: HEAD, area: cell(724, 387, 1048, 447), badgeAt: topRight(cell(724, 387, 1048, 447)), box: below(cell(724, 387, 1048, 447)), copyFrom: [copyIdFrom('reporterId', REPORTER)] }),
  phone('headPhone', 'head', '세대주 전화번호', label2(HEAD, '전화번호', 'Phone number', '电话号码', '電話番号', 'Số điện thoại'), cell(191, 447, 453, 510)),
  phone('headMobile', 'head', '세대주 휴대전화번호', label2(HEAD, '휴대전화번호', 'Mobile number', '手机号码', '携帯電話番号', 'Số di động'), cell(453, 447, 724, 510)),
  phone('headEmail', 'head', '세대주 전자우편주소', label2(HEAD, '이메일', 'Email', '电子邮箱', 'メールアドレス', 'Email'), cell(724, 447, 1048, 510), 'email'),
  textField({
    id: 'headAddress', section: 'head', koLabel: '세대주 주소',
    label: { ko: '세대주 주소', en: 'Address of the head of household', zh: '户主地址', ja: '世帯主の住所', vi: 'Địa chỉ chủ hộ' },
    help: { ko: '주민등록을 할 집 주소를 한국어로 적어요. 동·호수까지 적어요.', en: 'The address where you are registering, in Korean, including building and unit numbers.', zh: '用韩文填写办理居民登记的住址，写到栋、号。', ja: '住民登録をする住所を韓国語で、棟・号まで書きます。', vi: 'Địa chỉ nơi đăng ký cư trú, ghi bằng tiếng Hàn, đến số tòa / số phòng.' },
    area: cell(191, 510, 1049, 566), badgeAt: topRight(cell(191, 510, 1049, 566)),
    part: { key: 'address', box: { x: 250, y: 520, w: 740, h: 40, align: 'center' }, korean: true, placeholder: '예) 서울시 금천구 시흥대로73길 70' },
  }),

  // ── 신고사항 ─────────────────────────────────────────────
  ...personRow(1),
  ...personRow(2),
  ...personRow(3),
  ...personRow(4),
  textField({
    id: 'other', section: 'etc', koLabel: '기타',
    label: { ko: '기타', en: 'Other notes', zh: '其他', ja: 'その他', vi: 'Ghi chú khác' },
    help: { ko: '합숙하는 곳(기숙사 등)에 주민등록을 하면 관리책임자를, 가족관계등록이 안 되어 있거나 분명하지 않은 사람은 그 사유를 한국어로 적어요.', en: 'If registering at a shared lodging (e.g., a dormitory), write the person in charge. If someone has no family relation registration or it is unclear, write the reason. In Korean.', zh: '在集体宿舍等处办理居民登记时填写管理负责人；未办理或不清楚家族关系登记者填写原因。用韩文填写。', ja: '寮など合宿所に住民登録をする場合は管理責任者を、家族関係登録がない・はっきりしない人はその理由を韓国語で書きます。', vi: 'Nếu đăng ký tại nơi ở tập thể (ký túc xá...), ghi người quản lý; nếu chưa có hoặc không rõ đăng ký quan hệ gia đình, ghi lý do. Ghi bằng tiếng Hàn.' },
    area: cell(191, 870, 1048, 910), badgeAt: topRight(cell(191, 870, 1048, 910)),
    part: { box: { x: 200, y: 873, w: 800, h: 34, align: 'left' }, korean: true },
  }),

  // ── 신고일과 신고인 ──────────────────────────────────────
  dateField({
    id: 'reportDate', section: 'sign', koLabel: '신고일 ( 년 월 일)',
    label: { ko: '신고하는 날짜', en: 'Date of report', zh: '申报日期', ja: '届出日', vi: 'Ngày khai báo' },
    help: { ko: '이 신고서를 내는 날짜예요. 보통 오늘 날짜를 적어요.', en: "The date you submit this report. Usually today's date.", zh: '提交本申报书的日期，通常填写今天的日期。', ja: 'この届出を出す日付です。通常は今日の日付を書きます。', vi: 'Ngày bạn nộp tờ khai này. Thường là ngày hôm nay.' },
    area: { x: 800, y: 952, w: 248, h: 26 }, badgeAt: { x: 782, y: 965 },
    y: { x: 820, y: 954, w: 62, h: 22, align: 'right' }, m: { x: 900, y: 954, w: 53, h: 22, align: 'right' }, d: { x: 970, y: 954, w: 55, h: 22, align: 'right' },
  }),
  nameField({ id: 'signReporter', section: 'sign', koLabel: '신고인 (서명 또는 인)', who: REPORTER, area: { x: 510, y: 980, w: 540, h: 26 }, badgeAt: { x: 492, y: 992 }, box: { x: 590, y: 981, w: 330, h: 24, align: 'center' },
    help: { ko: '신고하는 사람의 이름을 다시 적어요. 도장을 찍는 대신 한글로 서명해도 돼요. 서명은 출력한 종이에 직접 해요.', en: 'The reporter’s name again. You may sign in Hangul instead of using a stamp. Sign by hand on the printed paper.', zh: '再次填写申报人姓名。可用韩文签名代替盖章。签名请在打印出的纸上亲自完成。', ja: '届出人の氏名をもう一度書きます。押印の代わりにハングルで署名してもかまいません。署名は印刷した紙に直接します。', vi: 'Ghi lại họ tên người khai. Có thể ký bằng chữ Hàn thay cho đóng dấu. Ký trực tiếp trên giấy đã in.' },
    copyFrom: [copyNameFrom('reporterName', REPORTER)] }),

  // ── 위임장 ───────────────────────────────────────────────
  dateField({
    id: 'delegateDate', section: 'delegate', koLabel: '위임장 ( 년 월 일)',
    label: { ko: '위임한 날짜', en: 'Date of delegation', zh: '委托日期', ja: '委任日', vi: 'Ngày ủy quyền' },
    help: { ko: '세대주가 다른 사람(배우자, 직계혈족 등)에게 신고를 맡길 때만 적어요. 맡긴 날짜예요.', en: 'Only when the head of household delegates the report to someone else (spouse, lineal relative, etc.). The date of delegation.', zh: '仅在户主委托他人（配偶、直系血亲等）申报时填写。填写委托日期。', ja: '世帯主が他の人（配偶者、直系血族など）に届出を任せる場合のみ書きます。任せた日付です。', vi: 'Chỉ ghi khi chủ hộ ủy quyền cho người khác (vợ/chồng, người thân trực hệ...) khai báo. Ngày ủy quyền.' },
    area: { x: 800, y: 1151, w: 248, h: 26 }, badgeAt: { x: 782, y: 1164 },
    y: { x: 820, y: 1153, w: 62, h: 22, align: 'right' }, m: { x: 900, y: 1153, w: 53, h: 22, align: 'right' }, d: { x: 970, y: 1153, w: 55, h: 22, align: 'right' },
  }),
  nameField({ id: 'delegatorName', section: 'delegate', koLabel: '위임한 사람(세대주) (서명 또는 인)', who: HEAD, area: { x: 430, y: 1180, w: 620, h: 26 }, badgeAt: { x: 412, y: 1192 }, box: { x: 625, y: 1181, w: 295, h: 24, align: 'center' },
    help: { ko: '위임한 세대주의 이름을 적어요. 위임받은 사람은 세대주의 주민등록증·여권 같은 신분증을 함께 보여 줘야 해요. 거짓으로 위임장을 쓰면 처벌받아요.', en: "Name of the head of household who delegates. The delegate must also show the head of household's ID (resident registration card, passport, etc.). Writing a false letter of delegation is punishable.", zh: '填写委托的户主姓名。受托人须一并出示户主的居民登录证、护照等身份证件。伪造委托书将受处罚。', ja: '委任した世帯主の氏名を書きます。委任を受けた人は世帯主の住民登録証・パスポートなどの身分証も提示します。偽りの委任状を書くと処罰されます。', vi: 'Họ tên chủ hộ ủy quyền. Người được ủy quyền phải xuất trình cả giấy tờ tùy thân của chủ hộ (thẻ đăng ký cư trú, hộ chiếu...). Viết giấy ủy quyền giả sẽ bị xử phạt.' },
    copyFrom: [copyNameFrom('headName', HEAD)] }),
];

export const residentRegistrationReport: FormDef = {
  id: 'resident-registration-report',
  title: { ko: '주민등록신고서', en: 'Resident Registration Report', zh: '居民登记申报书', ja: '住民登録届出書', vi: 'Tờ khai đăng ký cư trú' },
  pages: [{ image: '/forms/resident-registration-report_ko.png', width: 1190, height: 1682 }],
  sections: [
    { id: 'reporter', label: { ko: '신고인', en: 'Person reporting', zh: '申报人', ja: '届出人', vi: 'Người khai báo' } },
    { id: 'head', label: { ko: '세대주', en: 'Head of household', zh: '户主', ja: '世帯主', vi: 'Chủ hộ' } },
    ...[1, 2, 3, 4].map((n) => ({ id: `person${n}`, label: { ko: `신고사항 ${n}`, en: `Report: person ${n}`, zh: `申报事项 ${n}`, ja: `届出事項 ${n}`, vi: `Nội dung khai báo: người ${n}` } })),
    { id: 'etc', label: { ko: '기타', en: 'Other', zh: '其他', ja: 'その他', vi: 'Khác' } },
    { id: 'sign', label: { ko: '신고일·신고인', en: 'Date and reporter', zh: '申报日期·申报人', ja: '届出日・届出人', vi: 'Ngày và người khai' } },
    { id: 'delegate', label: { ko: '위임장 (맡길 때만)', en: 'Delegation (only if delegated)', zh: '委托书（仅委托时）', ja: '委任状（任せる場合のみ）', vi: 'Giấy ủy quyền (khi ủy quyền)' } },
  ],
  fields,
};
