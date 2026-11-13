import { dateField, idField, nameField, nationalityField, opt, SEAL_ID_HELP, textField, topRight, Who } from './common';
import { Box, FieldDef, FormDef, L } from './types';

// ─────────────────────────────────────────────────────────────
// 인감 [사망·실종선고·신고사항의 변경·말소·부활] 신고(신청)서 [인감증명법 시행령 별지 제12호서식]
// — v1 서식 24번(「인감(변경)신고서(서면)」)과 26번(「인감 상태 변경 신고서」)이 같이 쓴다.
// 좌표는 public/forms/seal-status-report_ko.png (1190×1682) 기준.
// 안내 문구는 뒤쪽 「유의사항 및 작성방법」(v1 guides_ko_24)을 바탕으로 작성.
// 접수·처리란, 인감·서명, 재외공관·수감기관 확인란, 수수료는 입력받지 않는다.
// ─────────────────────────────────────────────────────────────

const TARGET: Who = { ko: '대상자', en: 'the person concerned', zh: '对象人', ja: '対象者', vi: 'người liên quan' };
const REPORTER: Who = { ko: '신고(신청)인', en: 'the person reporting', zh: '申报（申请）人', ja: '届出（申請）人', vi: 'người khai báo' };
const AGENT: Who = { ko: '대리인', en: 'the agent', zh: '代理人', ja: '代理人', vi: 'người được ủy quyền' };
const CONSENTER: Who = { ko: '동의하는 법정대리인·후견인', en: 'the consenting legal representative / guardian', zh: '表示同意的法定代理人·监护人', ja: '同意する法定代理人・後見人', vi: 'người đại diện / giám hộ đồng ý' };

const CONSENT_NOTE: L = {
  ko: ' 대상자가 미성년자, 피한정후견인, 피성년후견인일 때만 적어요.',
  en: ' Only if the person concerned is a minor or under limited / adult guardianship.',
  zh: '仅在对象人为未成年人、被限定监护人或被成年监护人时填写。',
  ja: '対象者が未成年者、被限定後見人、被成年後見人の場合のみ書きます。',
  vi: ' Chỉ ghi khi người liên quan là người chưa thành niên hoặc người được giám hộ hạn chế / giám hộ thành niên.',
};

const cell = (x: number, y: number, x2: number, y2: number): Box => ({ x: x + 1, y: y + 1, w: x2 - x - 2, h: y2 - y - 2 });

/** 아래쪽 「○○: ____」 한 줄 */
const line = (id: string, koLabel: string, label: L, help: L, x: number, y: number, w: number, key: string, flags: { hangul?: boolean; korean?: boolean } = {}): FieldDef =>
  textField({ id, section: 'sign', koLabel, label, help, area: { x: x - 2, y: y - 2, w: w + 4, h: 30 }, part: { key, box: { x: x + 34, y, w: w - 34, h: 26, align: 'left' }, ...flags } });

const fields: FieldDef[] = [
  {
    id: 'reportType', section: 'type', required: true, koLabel: '인감 [ ]사망 [ ]실종선고 [ ]신고사항의 변경 [ ]말소 [ ]부활',
    label: { ko: '신고(신청) 종류', en: 'Type of report', zh: '申报（申请）种类', ja: '届出（申請）の種類', vi: 'Loại khai báo' },
    help: {
      ko: '무엇을 신고(신청)하는지 골라요. 「신고사항의 변경」은 성명·생년월일 등이 바뀐 경우예요. 새 인감(도장)으로 바꾸는 인감 변경신고는 다른 서식(인감증명법 시행령 별지 제9호서식)을 써요. 사망이나 실종선고는 상속인이 신고해요.',
      en: 'Choose what you are reporting. "Change of registered details" is for changes such as name or date of birth. Changing to a new seal uses a different form (Enforcement Decree of the Certification of Seal Impressions Act, Form No. 9). A death or declaration of disappearance is reported by an heir.',
      zh: '选择申报（申请）的内容。“申报事项变更”指姓名、出生日期等发生变化的情况。更换为新印鉴的印鉴变更申报须使用其他表格（印鉴证明法施行令附表第9号）。死亡或失踪宣告由继承人申报。',
      ja: '何を届け出る（申請する）かを選びます。「届出事項の変更」は氏名・生年月日などが変わった場合です。新しい印鑑に替える印鑑変更届は別の書式（印鑑証明法施行令別紙第9号書式）を使います。死亡や失踪宣告は相続人が届け出ます。',
      vi: 'Chọn nội dung khai báo. "Thay đổi nội dung đã đăng ký" là khi họ tên, ngày sinh... thay đổi. Đổi sang con dấu cá nhân mới thì dùng mẫu khác (Mẫu số 9 của Nghị định thi hành Luật chứng nhận con dấu). Việc chết hoặc tuyên bố mất tích do người thừa kế khai báo.',
    },
    area: { x: 395, y: 158, w: 325, h: 100 },
    badgeAt: { x: 386, y: 170 },
    input: {
      kind: 'choice', mark: 'check',
      options: [
        opt('death', '사망', { ko: '사망', en: 'Death', zh: '死亡', ja: '死亡', vi: 'Chết' }, 420, 176),
        opt('missing', '실종선고', { ko: '실종선고', en: 'Declaration of disappearance', zh: '失踪宣告', ja: '失踪宣告', vi: 'Tuyên bố mất tích' }, 561, 176),
        opt('change', '신고사항의 변경', { ko: '신고사항의 변경 (성명·생년월일 등)', en: 'Change of registered details (name, date of birth, etc.)', zh: '申报事项变更（姓名·出生日期等）', ja: '届出事項の変更（氏名・生年月日など）', vi: 'Thay đổi nội dung đã đăng ký (họ tên, ngày sinh...)' }, 420, 208),
        opt('cancel', '말소', { ko: '말소', en: 'Cancellation', zh: '注销', ja: '抹消', vi: 'Xóa đăng ký' }, 420, 240),
        opt('revive', '부활', { ko: '부활', en: 'Restoration', zh: '恢复', ja: '復活', vi: 'Khôi phục' }, 561, 240),
      ],
    },
  },

  // ── 대상자 ───────────────────────────────────────────────
  {
    id: 'targetName', section: 'target', koLabel: '대상자 성명(한자)',
    label: { ko: '대상자 이름', en: 'Name of the person concerned', zh: '对象人姓名', ja: '対象者の氏名', vi: 'Họ tên người liên quan' },
    help: {
      ko: '인감을 신고한 사람(대상자)의 이름을 한글로 적어요. 한자 이름이 있으면 괄호 안 칸에도 적어요.',
      en: 'Name of the person whose seal is registered, in Korean letters. If there is a name in Chinese characters, add it in the parentheses.',
      zh: '用韩文填写已申报印鉴之人（对象人）的姓名。如有汉字姓名，也填写在括号内。',
      ja: '印鑑を届け出た人（対象者）の氏名をハングルで書きます。漢字の氏名があれば括弧内にも書きます。',
      vi: 'Họ tên người đã đăng ký con dấu cá nhân (người liên quan), bằng chữ Hàn. Nếu có tên chữ Hán, ghi thêm trong ngoặc.',
    },
    area: cell(302, 352, 834, 432),
    input: {
      kind: 'text',
      parts: [
        { key: 'name', box: { x: 340, y: 360, w: 470, h: 38, align: 'center' }, hangul: true, label: { ko: '이름 (한글)', en: 'Name (Hangul)', zh: '姓名（韩文）', ja: '氏名（ハングル）', vi: 'Họ tên (Hangul)' }, placeholder: '예) 응우옌반안' },
        { key: 'hanja', box: { x: 630, y: 403, w: 190, h: 25, align: 'center' }, label: { ko: '한자 (있으면)', en: 'Chinese characters (if any)', zh: '汉字（如有）', ja: '漢字（あれば）', vi: 'Chữ Hán (nếu có)' }, placeholder: '예) 洪吉洞' },
      ],
    },
  },
  { ...idField({ id: 'targetId', section: 'target', koLabel: '대상자 주민등록번호', who: TARGET, area: cell(302, 432, 834, 494), box: { x: 340, y: 440, w: 480, h: 46, align: 'center' } }), help: SEAL_ID_HELP },
  nationalityField({ id: 'targetNationality', section: 'target', koLabel: '대상자 국적', who: TARGET, area: cell(302, 494, 834, 555), box: { x: 340, y: 500, w: 480, h: 48, align: 'center' } }),
  textField({
    id: 'targetAddress', section: 'target', koLabel: '대상자 주소',
    label: { ko: '대상자 주소', en: 'Address of the person concerned', zh: '对象人地址', ja: '対象者の住所', vi: 'Địa chỉ người liên quan' },
    help: { ko: '대상자의 주소를 한국어로 적어요.', en: 'Address of the person concerned, in Korean.', zh: '用韩文填写对象人的地址。', ja: '対象者の住所を韓国語で書きます。', vi: 'Địa chỉ người liên quan, ghi bằng tiếng Hàn.' },
    area: cell(302, 555, 1074, 619),
    part: { key: 'address', box: { x: 340, y: 562, w: 725, h: 50, align: 'center' }, korean: true, placeholder: '예) 서울시 금천구 시흥대로73길 70' },
  }),

  // ── 신고(신청) 사항 ──────────────────────────────────────
  textField({
    id: 'reportDetail', section: 'detail', koLabel: '신고(신청) 사항',
    label: { ko: '신고(신청)하는 내용', en: 'What you are reporting', zh: '申报（申请）内容', ja: '届出（申請）の内容', vi: 'Nội dung khai báo' },
    help: {
      ko: '무엇을 신고(신청)하는지 한국어로 적어요. 신고사항의 변경이면 무엇이 어떻게 바뀌었는지 적어요.',
      en: 'What you are reporting, in Korean. For a change of registered details, write what changed and how.',
      zh: '用韩文填写申报（申请）的内容。如为申报事项变更，写明什么发生了怎样的变化。',
      ja: '何を届け出る（申請する）かを韓国語で書きます。届出事項の変更の場合は、何がどう変わったかを書きます。',
      vi: 'Nội dung khai báo, ghi bằng tiếng Hàn. Nếu là thay đổi nội dung đã đăng ký, ghi điều gì đã thay đổi và thay đổi thế nào.',
    },
    area: cell(302, 625, 1074, 687),
    part: { box: { x: 340, y: 632, w: 725, h: 48, align: 'left' }, korean: true },
  }),
  textField({
    id: 'writtenReason', section: 'detail', koLabel: '서면신고 사유',
    label: { ko: '서면으로 신고하는 이유', en: 'Reason for reporting in writing', zh: '书面申报理由', ja: '書面で届け出る理由', vi: 'Lý do khai báo bằng văn bản' },
    help: { ko: '서면으로 신고(신청)하는 이유를 한국어로 적어요. 잘 모르면 창구에 물어보세요.', en: 'Why you are reporting in writing, in Korean. Ask at the counter if unsure.', zh: '用韩文填写书面申报（申请）的理由。不清楚时请咨询窗口。', ja: '書面で届け出る（申請する）理由を韓国語で書きます。分からない場合は窓口でお尋ねください。', vi: 'Lý do khai báo bằng văn bản, ghi bằng tiếng Hàn. Nếu chưa rõ hãy hỏi tại quầy.' },
    area: cell(302, 687, 1074, 749),
    part: { box: { x: 340, y: 694, w: 725, h: 48, align: 'left' }, korean: true },
  }),
  textField({
    id: 'evidence', section: 'detail', koLabel: '증명자료(첨부)',
    label: { ko: '함께 내는 증명 서류', en: 'Supporting documents attached', zh: '附上的证明材料', ja: '添付する証明資料', vi: 'Giấy tờ chứng minh đính kèm' },
    help: { ko: '함께 붙여 내는 증명 서류의 이름을 한국어로 적어요.', en: 'Names of the supporting documents you attach, in Korean.', zh: '用韩文填写一并附上的证明材料名称。', ja: '一緒に添付する証明資料の名称を韓国語で書きます。', vi: 'Tên các giấy tờ chứng minh nộp kèm, ghi bằng tiếng Hàn.' },
    area: cell(302, 749, 1074, 811),
    part: { box: { x: 340, y: 756, w: 725, h: 48, align: 'left' }, korean: true },
  }),

  // ── 미성년자의 법정대리인·후견인 동의 ─────────────────────
  nameField({
    id: 'consenterName', section: 'consent', koLabel: '동의 성명', who: CONSENTER,
    help: {
      ko: '동의하는 법정대리인·후견인의 이름을 적어요. 인감이나 서명은 출력한 종이에 직접 해요.' + CONSENT_NOTE.ko,
      en: 'Name of the consenting legal representative / guardian. They stamp or sign by hand on the printed paper.' + CONSENT_NOTE.en,
      zh: '填写表示同意的法定代理人·监护人姓名。盖印鉴或签名请在打印出的纸上亲自完成。' + CONSENT_NOTE.zh,
      ja: '同意する法定代理人・後見人の氏名を書きます。印鑑・署名は印刷した紙に直接します。' + CONSENT_NOTE.ja,
      vi: 'Họ tên người đại diện / giám hộ đồng ý. Người đó đóng dấu hoặc ký trực tiếp trên giấy đã in.' + CONSENT_NOTE.vi,
    },
    area: cell(426, 817, 651, 876), box: { x: 462, y: 826, w: 184, h: 42, align: 'center' },
  }),
  {
    ...dateField({
      id: 'consenterBirth', section: 'consent', koLabel: '동의 생년월일',
      label: { ko: `${CONSENTER.ko} 생년월일`, en: `Date of birth of ${CONSENTER.en}`, zh: `${CONSENTER.zh}出生日期`, ja: `${CONSENTER.ja}の生年月日`, vi: `Ngày sinh của ${CONSENTER.vi}` },
      help: { ko: '동의하는 사람의 생년월일을 적어요.' + CONSENT_NOTE.ko, en: 'Date of birth of the consenting person.' + CONSENT_NOTE.en, zh: '填写表示同意者的出生日期。' + CONSENT_NOTE.zh, ja: '同意する人の生年月日を書きます。' + CONSENT_NOTE.ja, vi: 'Ngày sinh của người đồng ý.' + CONSENT_NOTE.vi },
      area: cell(426, 876, 651, 936),
      box: { x: 462, y: 886, w: 184, h: 40, align: 'center' },
    }),
  },
  textField({
    id: 'consenterRelation', section: 'consent', koLabel: '동의 관계',
    label: { ko: '대상자와의 관계', en: 'Relationship to the person concerned', zh: '与对象人的关系', ja: '対象者との関係', vi: 'Quan hệ với người liên quan' },
    help: { ko: '동의하는 사람이 대상자의 누구인지 한국어로 적어요. 예) 부, 모, 후견인' + CONSENT_NOTE.ko, en: 'Who the consenting person is to the person concerned, in Korean, e.g., 부 (father), 모 (mother), 후견인 (guardian).' + CONSENT_NOTE.en, zh: '用韩文填写同意人是对象人的什么人。例：부（父）、모（母）、후견인（监护人）。' + CONSENT_NOTE.zh, ja: '同意する人が対象者の誰にあたるかを韓国語で書きます（父・母・後見人など）。' + CONSENT_NOTE.ja, vi: 'Người đồng ý là ai đối với người liên quan, ghi bằng tiếng Hàn, VD: 부 (bố), 모 (mẹ), 후견인 (người giám hộ).' + CONSENT_NOTE.vi },
    area: cell(651, 817, 834, 936), badgeAt: topRight(cell(651, 817, 834, 936)),
    part: { box: { x: 660, y: 860, w: 165, h: 40, align: 'center' }, korean: true, placeholder: '예) 모' },
  }),
  textField({
    id: 'consenterAddress', section: 'consent', koLabel: '동의 주소',
    label: { ko: `${CONSENTER.ko} 주소`, en: `Address of ${CONSENTER.en}`, zh: `${CONSENTER.zh}地址`, ja: `${CONSENTER.ja}の住所`, vi: `Địa chỉ của ${CONSENTER.vi}` },
    help: { ko: '동의하는 사람의 주소를 한국어로 적어요.' + CONSENT_NOTE.ko, en: 'Address of the consenting person, in Korean.' + CONSENT_NOTE.en, zh: '用韩文填写同意人的地址。' + CONSENT_NOTE.zh, ja: '同意する人の住所を韓国語で書きます。' + CONSENT_NOTE.ja, vi: 'Địa chỉ người đồng ý, ghi bằng tiếng Hàn.' + CONSENT_NOTE.vi },
    area: cell(426, 936, 1074, 1003),
    part: { key: 'address', box: { x: 462, y: 944, w: 605, h: 52, align: 'center' }, korean: true },
  }),

  // ── 아래쪽 신고(신청) ────────────────────────────────────
  dateField({
    id: 'reportDate', section: 'sign', koLabel: '신고(신청)일 ( 년 월 일)',
    label: { ko: '신고(신청)하는 날짜', en: 'Date of report', zh: '申报（申请）日期', ja: '届出（申請）日', vi: 'Ngày khai báo' },
    help: { ko: '이 서류를 제출하는 날짜예요. 보통 오늘 날짜를 적어요.', en: "The date you submit this. Usually today's date.", zh: '提交本文件的日期，通常填写今天的日期。', ja: 'この書類を提出する日付です。通常は今日の日付を書きます。', vi: 'Ngày bạn nộp giấy này. Thường là ngày hôm nay.' },
    area: { x: 760, y: 1284, w: 315, h: 30 },
    y: { x: 796, y: 1286, w: 64, h: 26, align: 'right' },
    m: { x: 890, y: 1286, w: 68, h: 26, align: 'right' },
    d: { x: 980, y: 1286, w: 68, h: 26, align: 'right' },
  }),
  {
    ...line('reporterName', '신고(신청)인:', { ko: '신고(신청)인 이름', en: 'Name of the person reporting', zh: '申报（申请）人姓名', ja: '届出（申請）人の氏名', vi: 'Họ tên người khai báo' },
      { ko: '신고(신청)하는 사람의 이름을 한글로 적어요. 사망·실종선고는 상속인이 신고해요. 서명이나 도장은 출력한 종이에 직접 해요.', en: 'Name of the person reporting, in Korean letters. A death or declaration of disappearance is reported by an heir. Sign or stamp by hand on the printed paper.', zh: '用韩文填写申报（申请）人姓名。死亡·失踪宣告由继承人申报。签名或盖章请在打印出的纸上亲自完成。', ja: '届け出る（申請する）人の氏名をハングルで書きます。死亡・失踪宣告は相続人が届け出ます。署名・押印は印刷した紙に直接します。', vi: 'Họ tên người khai báo, bằng chữ Hàn. Việc chết hoặc tuyên bố mất tích do người thừa kế khai báo. Ký tên hoặc đóng dấu trực tiếp trên giấy đã in.' },
      525, 1326, 395, 'name', { hangul: true }),
    copyFrom: [{ field: 'targetName', label: { ko: '대상자 이름 가져오기', en: 'Use the name of the person concerned', zh: '使用对象人姓名', ja: '対象者の氏名を使う', vi: 'Dùng tên người liên quan' }, map: { name: 'name' } }],
  },
  line('reporterAddress', '신고(신청)인 주소:', { ko: `${REPORTER.ko} 주소`, en: `Address of ${REPORTER.en}`, zh: `${REPORTER.zh}地址`, ja: `${REPORTER.ja}の住所`, vi: `Địa chỉ ${REPORTER.vi}` },
    { ko: '신고(신청)하는 사람의 주소를 한국어로 적어요.', en: 'Address of the person reporting, in Korean.', zh: '用韩文填写申报（申请）人的地址。', ja: '届け出る人の住所を韓国語で書きます。', vi: 'Địa chỉ người khai báo, ghi bằng tiếng Hàn.' },
    450, 1352, 600, 'address', { korean: true }),
  { ...idField({ id: 'reporterId', section: 'sign', koLabel: '신고(신청)인 (주민등록번호: )', who: REPORTER, area: { x: 518, y: 1377, w: 224, h: 30 }, box: { x: 554, y: 1379, w: 186, h: 26, align: 'center' } }), help: SEAL_ID_HELP },
  line('agentName', '대리인:', { ko: '대리인 이름', en: 'Name of the agent', zh: '代理人姓名', ja: '代理人の氏名', vi: 'Họ tên người được ủy quyền' },
    { ko: '다른 사람이 대신 신고(신청)할 때만 적어요. 증명청을 방문하는 대리인은 신분증을 꼭 보여 줘야 해요. 서명이나 도장은 출력한 종이에 직접 해요.', en: 'Only if someone reports on your behalf. An agent visiting the office must show their ID. Sign or stamp by hand on the printed paper.', zh: '仅在由他人代为申报（申请）时填写。到证明机关的代理人必须出示身份证件。签名或盖章请在打印出的纸上亲自完成。', ja: '他の人が代わりに届け出る場合のみ書きます。証明庁を訪問する代理人は身分証を必ず提示します。署名・押印は印刷した紙に直接します。', vi: 'Chỉ ghi khi người khác khai báo thay. Người được ủy quyền đến cơ quan phải xuất trình giấy tờ tùy thân. Ký tên hoặc đóng dấu trực tiếp trên giấy đã in.' },
    465, 1430, 450, 'name', { hangul: true }),
  line('agentAddress', '대리인 주소:', { ko: '대리인 주소', en: 'Address of the agent', zh: '代理人地址', ja: '代理人の住所', vi: 'Địa chỉ người được ủy quyền' },
    { ko: '대리인의 주소를 한국어로 적어요.', en: "The agent's address, in Korean.", zh: '用韩文填写代理人的地址。', ja: '代理人の住所を韓国語で書きます。', vi: 'Địa chỉ người được ủy quyền, ghi bằng tiếng Hàn.' },
    450, 1456, 600, 'address', { korean: true }),
  { ...idField({ id: 'agentId', section: 'sign', koLabel: '대리인 (주민등록번호: )', who: AGENT, area: { x: 518, y: 1481, w: 224, h: 30 }, box: { x: 554, y: 1483, w: 186, h: 26, align: 'center' } }), help: SEAL_ID_HELP },
  line('agentRelation', '관계:', { ko: '대리인과 대상자의 관계', en: 'Relationship of the agent', zh: '代理人与对象人的关系', ja: '代理人との関係', vi: 'Quan hệ của người được ủy quyền' },
    { ko: '대리인이 대상자의 누구인지 한국어로 적어요. 예) 배우자, 자녀', en: 'Who the agent is to the person concerned, in Korean, e.g., 배우자 (spouse), 자녀 (child).', zh: '用韩文填写代理人是对象人的什么人。例：배우자（配偶）、자녀（子女）。', ja: '代理人が対象者の誰にあたるかを韓国語で書きます（配偶者・子など）。', vi: 'Người được ủy quyền là ai đối với người liên quan, ghi bằng tiếng Hàn, VD: 배우자 (vợ / chồng), 자녀 (con).' },
    445, 1508, 300, 'relation', { korean: true }),
];

export const sealStatusReport: FormDef = {
  id: 'seal-status-report',
  title: { ko: '인감 상태 변경 신고서', en: 'Seal Status Change', zh: '印章状态变更', ja: '印鑑状態変更', vi: 'Báo cáo trạng thái con dấu cá nhân' },
  pages: [{ image: '/forms/seal-status-report_ko.png', width: 1190, height: 1682 }],
  sections: [
    { id: 'type',    label: { ko: '신고(신청) 종류', en: 'Type of report',     zh: '申报种类',   ja: '届出の種類',   vi: 'Loại khai báo' } },
    { id: 'target',  label: { ko: '대상자',          en: 'Person concerned',   zh: '对象人',     ja: '対象者',       vi: 'Người liên quan' } },
    { id: 'detail',  label: { ko: '신고(신청) 사항', en: 'Details',            zh: '申报事项',   ja: '届出事項',     vi: 'Nội dung' } },
    { id: 'consent', label: { ko: '법정대리인·후견인 동의', en: 'Consent of representative / guardian', zh: '法定代理人·监护人同意', ja: '法定代理人・後見人の同意', vi: 'Sự đồng ý của người đại diện / giám hộ' } },
    { id: 'sign',    label: { ko: '신고(신청)인·대리인', en: 'Reporter & agent', zh: '申报人·代理人', ja: '届出人・代理人', vi: 'Người khai báo & người được ủy quyền' } },
  ],
  fields,
};
