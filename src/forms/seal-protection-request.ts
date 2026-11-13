import { dateField, idField, nameField, nationalityField, opt, SEAL_ID_HELP, textField, topRight, Who } from './common';
import { Box, FieldDef, FormDef, L } from './types';

// ─────────────────────────────────────────────────────────────
// 인감보호 신청 / 인감보호 해지신청 [인감증명법 시행령 별지 제15호의3서식] — v1 서식 22번
// 좌표는 public/forms/seal-protection-request_ko.png (1190×1682) 기준.
// 칸 이름이 칸 왼쪽 위에 인쇄된 정부 서식이라 번호는 칸 오른쪽 위에 둔다.
// 안내 문구는 뒤쪽 「유의사항 및 작성방법」(v1 guides_ko_22)을 바탕으로 작성.
// 접수·처리란, 우무인(지문), 인감·서명, 재외공관·수감기관·관계공무원 확인란은 입력받지 않는다.
// ─────────────────────────────────────────────────────────────

const APPLICANT: Who = { ko: '신청인', en: 'the applicant', zh: '申请人', ja: '申請人', vi: 'người nộp đơn' };
const CONSENTER: Who = { ko: '동의하는 법정대리인·후견인', en: 'the consenting legal representative / guardian', zh: '表示同意的法定代理人·监护人', ja: '同意する法定代理人・後見人', vi: 'người đại diện / giám hộ đồng ý' };
const AGENT: Who = { ko: '대리인', en: 'the agent', zh: '代理人', ja: '代理人', vi: 'người được ủy quyền' };

const CONSENT_NOTE: L = {
  ko: ' 신청인이 미성년자, 피한정후견인, 피성년후견인일 때만 적어요.',
  en: ' Only if the applicant is a minor or under limited / adult guardianship.',
  zh: '仅在申请人为未成年人、被限定监护人或被成年监护人时填写。',
  ja: '申請人が未成年者、被限定後見人、被成年後見人の場合のみ書きます。',
  vi: ' Chỉ ghi khi người nộp đơn là người chưa thành niên hoặc người được giám hộ hạn chế / giám hộ thành niên.',
};

const cell = (x: number, y: number, x2: number, y2: number): Box => ({ x: x + 1, y: y + 1, w: x2 - x - 2, h: y2 - y - 2 });

const fields: FieldDef[] = [
  {
    id: 'requestType', section: 'request', required: true, koLabel: '[ ] 인감보호 신청 / [ ] 인감보호 해지신청',
    label: { ko: '신청 종류', en: 'Type of request', zh: '申请种类', ja: '申請の種類', vi: 'Loại yêu cầu' },
    help: {
      ko: '인감을 보호해 달라는 신청인지, 이미 신청한 보호를 풀어 달라는 신청인지 골라요. 인감보호는 내 인감증명을 나 또는 내가 정한 사람만 발급받을 수 있게 막는 제도예요.',
      en: 'Choose whether you are requesting seal protection or cancelling an existing protection. Seal protection restricts who can be issued your seal certificate to you or people you designate.',
      zh: '选择是申请印鉴保护，还是解除已申请的保护。印鉴保护是将印鉴证明的发放对象限制为本人或本人指定之人的制度。',
      ja: '印鑑保護の申請か、すでに申請した保護の解除申請かを選びます。印鑑保護は、印鑑証明の発給対象を本人または本人が指定する人に制限する制度です。',
      vi: 'Chọn yêu cầu bảo vệ con dấu cá nhân, hay hủy bảo vệ đã đăng ký. Bảo vệ con dấu cá nhân là chế độ giới hạn người được cấp giấy chứng nhận con dấu cá nhân của bạn chỉ là bạn hoặc người bạn chỉ định.',
    },
    area: { x: 430, y: 150, w: 360, h: 80 },
    input: {
      kind: 'choice', mark: 'check',
      options: [
        opt('protect', '인감보호 신청', { ko: '인감보호 신청', en: 'Request seal protection', zh: '申请印鉴保护', ja: '印鑑保護の申請', vi: 'Yêu cầu bảo vệ con dấu cá nhân' }, 458, 168),
        opt('release', '인감보호 해지신청', { ko: '인감보호 해지신청', en: 'Cancel seal protection', zh: '申请解除印鉴保护', ja: '印鑑保護の解除申請', vi: 'Hủy bảo vệ con dấu cá nhân' }, 458, 210),
      ],
    },
  },

  // ── 신청인 ───────────────────────────────────────────────
  {
    id: 'applicantName', section: 'applicant', koLabel: '신청인 성명 (한자)',
    label: { ko: '신청인 이름', en: 'Name of the applicant', zh: '申请人姓名', ja: '申請人の氏名', vi: 'Họ tên người nộp đơn' },
    help: {
      ko: '인감을 신고한 본인의 이름을 한글로 적어요. 한자 이름이 있으면 괄호 안 칸에도 적어요.',
      en: 'Name of the person whose seal is registered, in Korean letters. If there is a name in Chinese characters, add it in the parentheses.',
      zh: '用韩文填写已申报印鉴的本人姓名。如有汉字姓名，也填写在括号内。',
      ja: '印鑑を届け出た本人の氏名をハングルで書きます。漢字の氏名があれば括弧内にも書きます。',
      vi: 'Họ tên người đã đăng ký con dấu cá nhân, bằng chữ Hàn. Nếu có tên chữ Hán, ghi thêm trong ngoặc.',
    },
    area: cell(264, 310, 633, 384),
    badgeAt: topRight(cell(264, 310, 633, 384)),
    input: {
      kind: 'text',
      parts: [
        { key: 'name', box: { x: 330, y: 316, w: 270, h: 32, align: 'center' }, hangul: true, label: { ko: '이름 (한글)', en: 'Name (Hangul)', zh: '姓名（韩文）', ja: '氏名（ハングル）', vi: 'Họ tên (Hangul)' }, placeholder: '예) 응우옌반안' },
        { key: 'hanja', box: { x: 322, y: 351, w: 205, h: 26, align: 'center' }, label: { ko: '한자 (있으면)', en: 'Chinese characters (if any)', zh: '汉字（如有）', ja: '漢字（あれば）', vi: 'Chữ Hán (nếu có)' }, placeholder: '예) 洪吉洞' },
      ],
    },
  },
  {
    ...idField({
      id: 'applicantId', section: 'applicant', koLabel: '신청인 주민등록번호', who: APPLICANT,
      area: cell(633, 310, 902, 384), badgeAt: topRight(cell(633, 310, 902, 384)),
      front: { x: 640, y: 350, w: 103, h: 28, align: 'center' }, back: { x: 755, y: 350, w: 140, h: 28, align: 'center' },
    }),
    help: SEAL_ID_HELP,
  },
  nationalityField({
    id: 'applicantNationality', section: 'applicant', koLabel: '신청인 국적', who: APPLICANT,
    area: cell(902, 310, 1075, 384), badgeAt: topRight(cell(902, 310, 1075, 384)),
    box: { x: 908, y: 346, w: 160, h: 32, align: 'center' },
  }),
  textField({
    id: 'applicantAddress', section: 'applicant', koLabel: '신청인 주소',
    label: { ko: '신청인 주소', en: 'Address of the applicant', zh: '申请人地址', ja: '申請人の住所', vi: 'Địa chỉ người nộp đơn' },
    help: { ko: '신청인의 주소를 한국어로 적어요.', en: "The applicant's address, in Korean.", zh: '用韩文填写申请人的地址。', ja: '申請人の住所を韓国語で書きます。', vi: 'Địa chỉ người nộp đơn, ghi bằng tiếng Hàn.' },
    area: cell(264, 384, 902, 442), badgeAt: topRight(cell(264, 384, 902, 442)),
    part: { key: 'address', box: { x: 330, y: 392, w: 530, h: 46, align: 'center' }, korean: true, placeholder: '예) 서울시 금천구 시흥대로73길 70' },
  }),
  textField({
    id: 'requestDetail', section: 'applicant', koLabel: '인감보호(보호해지) 신청내용',
    label: { ko: '신청 내용', en: 'What you are requesting', zh: '申请内容', ja: '申請内容', vi: 'Nội dung yêu cầu' },
    help: {
      ko: '원하는 보호 내용을 한국어로 적어요. 예) 본인 외 발급 금지 / 본인, 처(○○○: 주민등록번호) 외 발급 금지 / 주소지 시·군·구(읍·면·동)에서만 발급하고 그 외 인감증명서 발급기관에서는 발급 금지',
      en: 'What protection you want, in Korean. e.g., 본인 외 발급 금지 (issue to no one but me) / 본인, 처(○○○: 주민등록번호) 외 발급 금지 (only me and my wife ○○○) / 주소지 시·군·구에서만 발급 (issue only at my local district office).',
      zh: '用韩文填写希望的保护内容。例：본인 외 발급 금지（禁止向本人以外发放）/ 본인, 처(○○○: 주민등록번호) 외 발급 금지（仅限本人和妻子○○○）/ 주소지 시·군·구에서만 발급（仅在住所地区厅发放）。',
      ja: '希望する保護の内容を韓国語で書きます。例：本人以外への発給禁止／本人と妻（氏名・住民登録番号）以外への発給禁止／住所地の市・郡・区（邑・面・洞）でのみ発給し、その他の発給機関では発給禁止、といった内容を韓国語で書きます。',
      vi: 'Nội dung bảo vệ mong muốn, ghi bằng tiếng Hàn. VD: 본인 외 발급 금지 (chỉ cấp cho tôi) / 본인, 처(○○○: 주민등록번호) 외 발급 금지 (chỉ tôi và vợ ○○○) / 주소지 시·군·구에서만 발급 (chỉ cấp tại quận nơi cư trú).',
    },
    area: cell(264, 442, 902, 547), badgeAt: topRight(cell(264, 442, 902, 547)),
    part: { box: { x: 280, y: 482, w: 610, h: 56, align: 'left' }, korean: true, placeholder: '예) 본인 외 발급 금지' },
  }),

  // ── 미성년자의 법정대리인·한정후견인·성년후견인 동의 ─────
  nameField({
    id: 'consenterName', section: 'consent', koLabel: '동의 성명', who: CONSENTER,
    help: {
      ko: '동의하는 법정대리인·후견인의 이름을 적어요. 인감이나 서명은 출력한 종이에 직접 해요.' + CONSENT_NOTE.ko,
      en: "Name of the consenting legal representative / guardian. They stamp or sign by hand on the printed paper." + CONSENT_NOTE.en,
      zh: '填写表示同意的法定代理人·监护人姓名。盖印鉴或签名请在打印出的纸上亲自完成。' + CONSENT_NOTE.zh,
      ja: '同意する法定代理人・後見人の氏名を書きます。印鑑・署名は印刷した紙に直接します。' + CONSENT_NOTE.ja,
      vi: 'Họ tên người đại diện / giám hộ đồng ý. Người đó đóng dấu hoặc ký trực tiếp trên giấy đã in.' + CONSENT_NOTE.vi,
    },
    area: cell(264, 565, 633, 645), badgeAt: topRight(cell(264, 565, 633, 645)),
    box: { x: 290, y: 600, w: 320, h: 38, align: 'center' },
  }),
  {
    ...dateField({
      id: 'consenterBirth', section: 'consent', koLabel: '동의 생년월일',
      label: { ko: `${CONSENTER.ko} 생년월일`, en: `Date of birth of ${CONSENTER.en}`, zh: `${CONSENTER.zh}出生日期`, ja: `${CONSENTER.ja}の生年月日`, vi: `Ngày sinh của ${CONSENTER.vi}` },
      help: { ko: '동의하는 사람의 생년월일을 적어요.' + CONSENT_NOTE.ko, en: 'Date of birth of the consenting person.' + CONSENT_NOTE.en, zh: '填写表示同意者的出生日期。' + CONSENT_NOTE.zh, ja: '同意する人の生年月日を書きます。' + CONSENT_NOTE.ja, vi: 'Ngày sinh của người đồng ý.' + CONSENT_NOTE.vi },
      area: cell(264, 645, 633, 728),
      box: { x: 290, y: 684, w: 320, h: 36, align: 'center' },
    }),
    badgeAt: topRight(cell(264, 645, 633, 728)),
  },
  textField({
    id: 'consenterRelation', section: 'consent', koLabel: '동의 신청인과의 관계',
    label: { ko: '신청인과의 관계', en: 'Relationship to the applicant', zh: '与申请人的关系', ja: '申請人との関係', vi: 'Quan hệ với người nộp đơn' },
    help: { ko: '동의하는 사람이 신청인의 누구인지 한국어로 적어요. 예) 부, 모, 후견인' + CONSENT_NOTE.ko, en: 'Who the consenting person is to the applicant, in Korean, e.g., 부 (father), 모 (mother), 후견인 (guardian).' + CONSENT_NOTE.en, zh: '用韩文填写同意人是申请人的什么人。例：부（父）、모（母）、후견인（监护人）。' + CONSENT_NOTE.zh, ja: '同意する人が申請人の誰にあたるかを韓国語で書きます（父・母・後見人など）。' + CONSENT_NOTE.ja, vi: 'Người đồng ý là ai đối với người nộp đơn, ghi bằng tiếng Hàn, VD: 부 (bố), 모 (mẹ), 후견인 (người giám hộ).' + CONSENT_NOTE.vi },
    area: cell(633, 565, 902, 728), badgeAt: topRight(cell(633, 565, 902, 728)),
    part: { box: { x: 650, y: 620, w: 235, h: 40, align: 'center' }, korean: true, placeholder: '예) 모' },
  }),
  textField({
    id: 'consenterAddress', section: 'consent', koLabel: '동의 주소',
    label: { ko: `${CONSENTER.ko} 주소`, en: `Address of ${CONSENTER.en}`, zh: `${CONSENTER.zh}地址`, ja: `${CONSENTER.ja}の住所`, vi: `Địa chỉ của ${CONSENTER.vi}` },
    help: { ko: '동의하는 사람의 주소를 한국어로 적어요.' + CONSENT_NOTE.ko, en: 'Address of the consenting person, in Korean.' + CONSENT_NOTE.en, zh: '用韩文填写同意人的地址。' + CONSENT_NOTE.zh, ja: '同意する人の住所を韓国語で書きます。' + CONSENT_NOTE.ja, vi: 'Địa chỉ người đồng ý, ghi bằng tiếng Hàn.' + CONSENT_NOTE.vi },
    area: cell(264, 728, 1075, 804), badgeAt: topRight(cell(264, 728, 1075, 804)),
    part: { key: 'address', box: { x: 330, y: 760, w: 700, h: 38, align: 'center' }, korean: true },
  }),

  // ── 아래쪽 신청 ──────────────────────────────────────────
  dateField({
    id: 'applyDate', section: 'sign', koLabel: '신청일 ( 년 월 일)',
    label: { ko: '신청하는 날짜', en: 'Date of application', zh: '申请日期', ja: '申請日', vi: 'Ngày nộp đơn' },
    help: { ko: '이 신청서를 제출하는 날짜예요. 보통 오늘 날짜를 적어요.', en: "The date you submit this application. Usually today's date.", zh: '提交本申请书的日期，通常填写今天的日期。', ja: 'この申請書を提出する日付です。通常は今日の日付を書きます。', vi: 'Ngày bạn nộp đơn này. Thường là ngày hôm nay.' },
    area: { x: 760, y: 1242, w: 300, h: 32 },
    y: { x: 790, y: 1245, w: 74, h: 28, align: 'right' },
    m: { x: 890, y: 1245, w: 64, h: 28, align: 'right' },
    d: { x: 975, y: 1245, w: 60, h: 28, align: 'right' },
  }),
  textField({
    id: 'signApplicant', section: 'sign', koLabel: '신청인:',
    label: { ko: '신청인 이름 (아래 서명란)', en: 'Applicant name (signature line)', zh: '申请人姓名（签名栏）', ja: '申請人の氏名（署名欄）', vi: 'Tên người nộp đơn (dòng ký tên)' },
    help: { ko: '신청인의 이름을 한글로 적어요. 서명이나 도장은 출력한 종이에 직접 해요.', en: "The applicant's name in Korean letters. Sign or stamp by hand on the printed paper.", zh: '用韩文填写申请人姓名。签名或盖章请在打印出的纸上亲自完成。', ja: '申請人の氏名をハングルで書きます。署名・押印は印刷した紙に直接します。', vi: 'Họ tên người nộp đơn bằng chữ Hàn. Ký tên hoặc đóng dấu trực tiếp trên giấy đã in.' },
    area: { x: 590, y: 1288, w: 350, h: 34 },
    part: { key: 'name', box: { x: 626, y: 1290, w: 300, h: 30, align: 'center' }, hangul: true },
    copyFrom: [{ field: 'applicantName', label: { ko: '위 신청인 이름 가져오기', en: 'Use the applicant name above', zh: '使用上方申请人姓名', ja: '上の申請人の氏名を使う', vi: 'Dùng tên người nộp đơn ở trên' }, map: { name: 'name' } }],
  }),
  textField({
    id: 'agentName', section: 'sign', koLabel: '대리인:',
    label: { ko: '대리인 이름', en: 'Name of the agent', zh: '代理人姓名', ja: '代理人の氏名', vi: 'Họ tên người được ủy quyền' },
    help: {
      ko: '다른 사람이 대신 신청할 때만 대리인의 이름을 적어요. 재외국민·해외 체류자·수감자를 대신해 방문하는 대리인은 주민등록증 등 신분증을 꼭 보여 줘야 해요.',
      en: 'Only if someone applies on your behalf: the agent’s name. An agent visiting on behalf of an overseas Korean, a person staying abroad, or an inmate must show their resident registration card or other ID.',
      zh: '仅在由他人代为申请时填写代理人姓名。代替在外国民、海外居住（滞留）者或在押人员来访的代理人，必须出示居民登录证等身份证件。',
      ja: '他の人が代わりに申請する場合のみ、代理人の氏名を書きます。在外国民・海外居住（滞在）者・収監者の代わりに訪問する代理人は、住民登録証などを必ず提示します。',
      vi: 'Chỉ ghi khi người khác nộp thay: họ tên người được ủy quyền. Người đến thay cho kiều bào, người ở nước ngoài hoặc người đang bị giam giữ phải xuất trình thẻ cư trú hoặc giấy tờ tùy thân.',
    },
    area: { x: 590, y: 1338, w: 350, h: 34 },
    part: { key: 'name', box: { x: 626, y: 1340, w: 300, h: 30, align: 'center' }, hangul: true },
  }),
  {
    ...idField({
      id: 'agentId', section: 'sign', koLabel: '주민등록번호: (대리인)', who: AGENT,
      area: { x: 590, y: 1390, w: 350, h: 34 },
      box: { x: 626, y: 1392, w: 300, h: 30, align: 'center' },
    }),
    help: { ...SEAL_ID_HELP, ko: '대리인이 있을 때 대리인의 번호를 적어요. ' + SEAL_ID_HELP.ko, en: "If there is an agent, the agent's number. " + SEAL_ID_HELP.en, zh: '有代理人时填写代理人的号码。' + SEAL_ID_HELP.zh, ja: '代理人がいる場合は代理人の番号を書きます。' + SEAL_ID_HELP.ja, vi: 'Nếu có người được ủy quyền, ghi số của người đó. ' + SEAL_ID_HELP.vi },
  },
  textField({
    id: 'agentAddress', section: 'sign', koLabel: '주소: (대리인)',
    label: { ko: '대리인 주소', en: 'Address of the agent', zh: '代理人地址', ja: '代理人の住所', vi: 'Địa chỉ người được ủy quyền' },
    help: { ko: '대리인이 있을 때 대리인의 주소를 한국어로 적어요.', en: "If there is an agent, the agent's address in Korean.", zh: '有代理人时，用韩文填写代理人的地址。', ja: '代理人がいる場合は代理人の住所を韓国語で書きます。', vi: 'Nếu có người được ủy quyền, ghi địa chỉ của người đó bằng tiếng Hàn.' },
    area: { x: 590, y: 1440, w: 470, h: 34 },
    part: { key: 'address', box: { x: 626, y: 1442, w: 430, h: 30, align: 'left' }, korean: true },
  }),
];

export const sealProtectionRequest: FormDef = {
  id: 'seal-protection-request',
  title: { ko: '인감보호신청/해제신청서', en: 'Seal Protection/Release', zh: '印章保护申请/解除', ja: '印鑑保護申請/解除', vi: 'Đơn đăng ký hoặc hủy việc bảo vệ con dấu cá nhân' },
  pages: [{ image: '/forms/seal-protection-request_ko.png', width: 1190, height: 1682 }],
  sections: [
    { id: 'request',   label: { ko: '신청 종류',     en: 'Type of request',  zh: '申请种类',   ja: '申請の種類',   vi: 'Loại yêu cầu' } },
    { id: 'applicant', label: { ko: '신청인',        en: 'Applicant',        zh: '申请人',     ja: '申請人',       vi: 'Người nộp đơn' } },
    { id: 'consent',   label: { ko: '법정대리인·후견인 동의', en: 'Consent of representative / guardian', zh: '法定代理人·监护人同意', ja: '法定代理人・後見人の同意', vi: 'Sự đồng ý của người đại diện / giám hộ' } },
    { id: 'sign',      label: { ko: '신청일·서명',   en: 'Date & signature', zh: '申请日期·签名', ja: '申請日・署名', vi: 'Ngày & chữ ký' } },
  ],
  fields,
};
