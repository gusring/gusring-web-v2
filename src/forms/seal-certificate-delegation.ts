import { dateField, idField, nameField, nationalityField, opt, SEAL_ID_HELP, textField, Who } from './common';
import { Box, FieldDef, FormDef, L } from './types';

// ─────────────────────────────────────────────────────────────
// 인감증명서 발급 위임장 또는 미성년자의 법정대리인·한정후견인 및 성년후견인 동의서
// ·재외공관 및 수감기관 확인서·세무서(세무서장) 확인서 [인감증명법 시행령 별지 제13호서식] — v1 서식 25번
// 좌표는 public/forms/seal-certificate-delegation_ko.png (1190×1682) 기준.
// 뒤쪽은 「유의사항 및 작성방법」뿐이라 1쪽 서식으로 만든다 (v1의 _ko_2는 앞쪽과 같은 파일).
// 안내 문구는 뒤쪽 「유의사항 및 작성방법」(v1 guides_ko_25)을 바탕으로 작성.
// 서명·날인, 재외공관·수감기관 확인란, 세무서장 직인은 입력받지 않는다.
// ─────────────────────────────────────────────────────────────

const GRANTOR: Who = { ko: '위임자', en: 'the person delegating', zh: '委托人', ja: '委任者', vi: 'người ủy quyền' };
const AGENT: Who = { ko: '대리인', en: 'the agent', zh: '代理人', ja: '代理人', vi: 'người được ủy quyền' };
const CONSENTER: Who = { ko: '동의하는 법정대리인·후견인', en: 'the consenting legal representative / guardian', zh: '表示同意的法定代理人·监护人', ja: '同意する法定代理人・後見人', vi: 'người đại diện / giám hộ đồng ý' };

const cell = (x: number, y: number, x2: number, y2: number): Box => ({ x: x + 1, y: y + 1, w: x2 - x - 2, h: y2 - y - 2 });
const inBox = (a: Box, align: Box['align'] = 'center'): Box => ({ x: a.x + 36, y: a.y + 3, w: a.w - 40, h: a.h - 6, align });

const CONSENT_NOTE: L = {
  ko: ' 미성년자·피한정후견인·피성년후견인의 인감증명서를 위임받아 발급받을 때만 적어요. 이때는 위임장과 동의서를 모두 써야 해요.',
  en: ' Only when obtaining, by delegation, the seal certificate of a minor or of a person under limited / adult guardianship. In that case both the delegation and this consent must be filled in.',
  zh: '仅在受托领取未成年人、被限定监护人或被成年监护人的印鉴证明时填写。此时委托书和同意书都须填写。',
  ja: '未成年者・被限定後見人・被成年後見人の印鑑証明書を委任を受けて発給してもらう場合のみ書きます。この場合は委任状と同意書の両方が必要です。',
  vi: ' Chỉ ghi khi được ủy quyền nhận giấy chứng nhận con dấu cá nhân của người chưa thành niên hoặc người được giám hộ hạn chế / giám hộ thành niên. Khi đó phải điền cả giấy ủy quyền và giấy đồng ý này.',
};

const COUNT_HELP: L = {
  ko: '인감증명서를 2부 이상 받으려면 필요한 수량을 숫자로 적어요. 적지 않으면 1부만 발급돼요.',
  en: 'If you need 2 or more seal certificates, write the number. If left blank, only 1 is issued.',
  zh: '需要2份以上印鉴证明时，用数字填写所需份数。不填写则只发放1份。',
  ja: '印鑑証明書を2通以上受け取る場合は、必要な通数を数字で書きます。書かなければ1通だけ発給されます。',
  vi: 'Nếu cần từ 2 bản giấy chứng nhận con dấu cá nhân trở lên, ghi số lượng. Nếu để trống, chỉ cấp 1 bản.',
};

const fields: FieldDef[] = [
  {
    id: 'docType', section: 'type', koLabel: '[ ] 위임장·동의서 [ ] 재외공관 및 수감기관 확인서 [ ] 세무서(세무서장) 확인서',
    label: { ko: '이 서류의 용도', en: 'What this document is used as', zh: '本文件的用途', ja: 'この書類の用途', vi: 'Giấy này dùng làm gì' },
    help: {
      ko: '해당하는 것을 모두 골라요. 보통은 첫 번째(위임장·동의서)예요. 재외국민·해외 체류자·수감자는 재외공관(영사관)이나 교도관의 확인을 받아야 하고, 재외국민이 부동산 권리 이전용으로 쓰면 세무서장 확인도 받아요.',
      en: 'Choose all that apply. Usually the first one (delegation / consent). Overseas Koreans, people staying abroad and inmates need confirmation from a consulate or a prison officer; if an overseas Korean uses it to transfer real-estate rights, the head of the tax office must also confirm.',
      zh: '选择所有符合的项，通常为第一项（委托书·同意书）。在外国民、海外居住者和在押人员须取得驻外使领馆或狱警的确认；在外国民用于转移不动产权利时，还须取得税务署长的确认。',
      ja: '当てはまるものをすべて選びます。通常は1つ目（委任状・同意書）です。在外国民・海外滞在者・収監者は在外公館（領事館）または刑務官の確認が必要で、在外国民が不動産の権利移転用に使う場合は税務署長の確認も受けます。',
      vi: 'Chọn tất cả các mục phù hợp. Thường là mục đầu (giấy ủy quyền / đồng ý). Kiều bào, người ở nước ngoài và người bị giam giữ cần xác nhận của lãnh sự quán hoặc cán bộ trại giam; nếu kiều bào dùng để chuyển quyền bất động sản thì cần thêm xác nhận của trưởng cơ quan thuế.',
    },
    area: { x: 250, y: 155, w: 830, h: 155 },
    badgeAt: { x: 238, y: 173 },
    input: {
      kind: 'choice', mark: 'check', multiple: true,
      options: [
        opt('delegation', '인감증명서 발급 위임장·동의서', { ko: '인감증명서 발급 위임장 (또는 법정대리인·후견인 동의서)', en: 'Delegation for issuing a seal certificate (or consent of a legal representative / guardian)', zh: '印鉴证明发放委托书（或法定代理人·监护人同意书）', ja: '印鑑証明書発給委任状（または法定代理人・後見人の同意書）', vi: 'Giấy ủy quyền cấp giấy chứng nhận con dấu cá nhân (hoặc giấy đồng ý của người đại diện / giám hộ)' }, 278, 173),
        opt('consulate', '재외공관 및 수감기관 확인서', { ko: '재외공관 및 수감기관 확인서', en: 'Confirmation by a consulate / prison', zh: '驻外使领馆及收监机关确认书', ja: '在外公館及び収監機関の確認書', vi: 'Xác nhận của lãnh sự quán / trại giam' }, 277, 250),
        opt('taxOffice', '세무서(세무서장) 확인서', { ko: '세무서(세무서장) 확인서', en: 'Confirmation by the tax office', zh: '税务署（署长）确认书', ja: '税務署（税務署長）確認書', vi: 'Xác nhận của cơ quan thuế' }, 277, 288),
      ],
    },
  },

  // ── 인감증명서 발급 위임장 ───────────────────────────────
  nameField({
    id: 'grantorName', section: 'delegation', koLabel: '위임자 성명', who: GRANTOR,
    help: {
      ko: '인감증명서 발급을 맡기는 본인(위임자)의 이름을 적어요. 위임자는 이 위임장을 직접(자필로) 써야 해요. 서명(사인 형태도 가능)이나 도장(인감도장이 아니어도 됨)은 출력한 종이에 직접 해요.',
      en: 'Name of the person delegating (whose seal certificate is to be issued). The delegator must write this delegation themselves. Sign (a signature-style sign is fine) or stamp (it need not be the registered seal) by hand on the printed paper.',
      zh: '填写委托领取印鉴证明的本人（委托人）姓名。委托书须由委托人亲笔填写。签名（可为签字形式）或盖章（不必是印鉴章）请在打印出的纸上亲自完成。',
      ja: '印鑑証明書の発給を任せる本人（委任者）の氏名を書きます。委任状は委任者が自筆で書く必要があります。署名（サイン形式も可）または押印（印鑑登録した印章でなくても可）は印刷した紙に直接します。',
      vi: 'Họ tên người ủy quyền (người cần cấp giấy chứng nhận con dấu cá nhân). Người ủy quyền phải tự tay viết giấy ủy quyền này. Ký tên (có thể ký kiểu chữ ký) hoặc đóng dấu (không cần là con dấu đã đăng ký) trực tiếp trên giấy đã in.',
    },
    area: cell(299, 440, 628, 483), box: { x: 336, y: 444, w: 175, h: 36, align: 'center' },
  }),
  { ...idField({ id: 'grantorId', section: 'delegation', koLabel: '위임자 주민등록번호', who: GRANTOR, area: cell(794, 440, 1077, 483), front: { x: 831, y: 444, w: 97, h: 36, align: 'center' }, back: { x: 943, y: 444, w: 131, h: 36, align: 'center' } }), help: SEAL_ID_HELP },
  {
    ...nationalityField({ id: 'grantorNationality', section: 'delegation', koLabel: '위임자 국적', who: GRANTOR, area: cell(299, 483, 488, 525), box: inBox(cell(299, 483, 488, 525)) }),
    help: { ko: '재외공관(영사관)에서 확인받는 경우에만 적어요.', en: 'Only if the confirmation is done at a consulate.', zh: '仅在由驻外使领馆确认时填写。', ja: '在外公館（領事館）で確認を受ける場合のみ書きます。', vi: 'Chỉ ghi khi được lãnh sự quán xác nhận.' },
  },
  textField({
    id: 'grantorAddress', section: 'delegation', koLabel: '위임자 주소',
    label: { ko: '위임자 주소', en: 'Address of the person delegating', zh: '委托人地址', ja: '委任者の住所', vi: 'Địa chỉ người ủy quyền' },
    help: { ko: '위임자의 주소를 한국어로 적어요.', en: "The delegator's address, in Korean.", zh: '用韩文填写委托人的地址。', ja: '委任者の住所を韓国語で書きます。', vi: 'Địa chỉ người ủy quyền, ghi bằng tiếng Hàn.' },
    area: cell(628, 483, 1077, 525), part: { key: 'address', box: inBox(cell(628, 483, 1077, 525)), korean: true },
  }),
  textField({
    id: 'idCardType', section: 'delegation', koLabel: '신분증 종류',
    label: { ko: '위임자 신분증 종류', en: "Type of the delegator's ID", zh: '委托人身份证件种类', ja: '委任者の身分証の種類', vi: 'Loại giấy tờ tùy thân của người ủy quyền' },
    help: {
      ko: '대리인이 가져가는 위임자의 신분증 종류를 한국어로 적어요. 주민등록증, 운전면허증, 여권, 장애인등록증 중 하나예요. 대리인과 위임자의 신분증이 모두 필요해요.',
      en: "The type of the delegator's ID that the agent brings, in Korean: resident registration card (주민등록증), driver's license (운전면허증), passport (여권), or disability registration card (장애인등록증). IDs of both the agent and the delegator are needed.",
      zh: '用韩文填写代理人携带的委托人身份证件种类：居民登录证（주민등록증）、驾照（운전면허증）、护照（여권）或残疾人登记证（장애인등록증）之一。代理人和委托人的身份证件都需要。',
      ja: '代理人が持参する委任者の身分証の種類を韓国語で書きます。住民登録証・運転免許証・旅券・障害者登録証のいずれかです。代理人と委任者の両方の身分証が必要です。',
      vi: 'Loại giấy tờ tùy thân của người ủy quyền mà người được ủy quyền mang theo, ghi bằng tiếng Hàn: thẻ đăng ký cư trú (주민등록증), bằng lái xe (운전면허증), hộ chiếu (여권) hoặc thẻ người khuyết tật (장애인등록증). Cần giấy tờ của cả hai người.',
    },
    area: cell(299, 525, 488, 576),
    part: {
      box: inBox(cell(299, 525, 488, 576)),
      options: [
        { value: '주민등록증', label: { ko: '주민등록증', en: 'Resident registration card', zh: '居民登录证', ja: '住民登録証', vi: 'Thẻ đăng ký cư trú' } },
        { value: '운전면허증', label: { ko: '운전면허증', en: "Driver's license", zh: '驾照', ja: '運転免許証', vi: 'Bằng lái xe' } },
        { value: '여권', label: { ko: '여권', en: 'Passport', zh: '护照', ja: '旅券', vi: 'Hộ chiếu' } },
        { value: '장애인등록증', label: { ko: '장애인등록증', en: 'Disability registration card', zh: '残疾人登记证', ja: '障害者登録証', vi: 'Thẻ người khuyết tật' } },
      ],
    },
  }),
  textField({
    id: 'purpose', section: 'delegation', koLabel: '용도',
    label: { ko: '인감증명서 용도', en: 'Purpose of the seal certificate', zh: '印鉴证明用途', ja: '印鑑証明書の用途', vi: 'Mục đích sử dụng giấy chứng nhận con dấu' },
    help: {
      ko: '인감증명서를 낼 곳에서 요구하는 용도를 한국어로 적어요. 예) 부동산 매매용, 근저당 설정용, 자동차 매매용. "부동산 매매에 관한 모든 권한 위임" 같은 내용으로 적으면 안 돼요.',
      en: 'The purpose required by the place you will submit the certificate to, in Korean, e.g., 부동산 매매용 (real-estate sale), 근저당 설정용 (mortgage), 자동차 매매용 (car sale). Do not write something like "delegating all authority over the real-estate sale".',
      zh: '用韩文填写提交印鉴证明的机构所要求的用途。例：부동산 매매용（不动产买卖用）、근저당 설정용（设定抵押用）、자동차 매매용（汽车买卖用）。不能写成“委托与不动产买卖有关的全部权限”之类的内容。',
      ja: '印鑑証明書を提出する先が求める用途を韓国語で書きます（不動産売買用、根抵当設定用、自動車売買用など）。「不動産売買に関するすべての権限を委任」のような内容は書いてはいけません。',
      vi: 'Mục đích mà nơi nhận giấy yêu cầu, ghi bằng tiếng Hàn, VD: 부동산 매매용 (mua bán bất động sản), 근저당 설정용 (thế chấp), 자동차 매매용 (mua bán ô tô). Không được ghi kiểu "ủy quyền toàn bộ việc mua bán bất động sản".',
    },
    area: cell(628, 525, 794, 576), part: { box: inBox(cell(628, 525, 794, 576)), korean: true, placeholder: '예) 부동산 매매용' },
  }),
  textField({ id: 'grantorCount', section: 'delegation', koLabel: '발급통수 (위임장)', label: { ko: '발급받을 통수', en: 'Number of copies', zh: '发放份数', ja: '発給通数', vi: 'Số bản cần cấp' }, help: COUNT_HELP, area: cell(918, 525, 1077, 576), part: { box: inBox(cell(918, 525, 1077, 576)), inputMode: 'numeric', placeholder: '1' } }),
  nameField({
    id: 'agentName', section: 'delegation', koLabel: '대리인 성명', who: AGENT,
    help: { ko: '위임자 대신 인감증명서를 받으러 가는 사람(대리인)의 이름을 적어요.', en: 'Name of the person (agent) who goes to receive the seal certificate on behalf of the delegator.', zh: '填写代替委托人去领取印鉴证明的人（代理人）的姓名。', ja: '委任者の代わりに印鑑証明書を受け取りに行く人（代理人）の氏名を書きます。', vi: 'Họ tên người (được ủy quyền) đi nhận giấy chứng nhận con dấu cá nhân thay người ủy quyền.' },
    area: cell(299, 576, 488, 620), box: inBox(cell(299, 576, 488, 620)),
  }),
  { ...idField({ id: 'agentId', section: 'delegation', koLabel: '대리인 주민등록번호', who: AGENT, area: cell(628, 576, 1077, 620), box: inBox(cell(628, 576, 1077, 620)) }), help: SEAL_ID_HELP },
  textField({
    id: 'agentAddress', section: 'delegation', koLabel: '대리인 주소',
    label: { ko: '대리인 주소', en: 'Address of the agent', zh: '代理人地址', ja: '代理人の住所', vi: 'Địa chỉ người được ủy quyền' },
    help: { ko: '대리인의 주소를 한국어로 적어요.', en: "The agent's address, in Korean.", zh: '用韩文填写代理人的地址。', ja: '代理人の住所を韓国語で書きます。', vi: 'Địa chỉ người được ủy quyền, ghi bằng tiếng Hàn.' },
    area: cell(299, 620, 794, 663), part: { key: 'address', box: inBox(cell(299, 620, 794, 663)), korean: true },
  }),
  textField({
    id: 'agentRelation', section: 'delegation', koLabel: '관계',
    label: { ko: '위임자와 대리인의 관계', en: 'Relationship between delegator and agent', zh: '委托人与代理人的关系', ja: '委任者と代理人の関係', vi: 'Quan hệ giữa hai người' },
    help: { ko: '대리인이 위임자의 누구인지 한국어로 적어요. 예) 배우자, 자녀, 지인', en: 'Who the agent is to the delegator, in Korean, e.g., 배우자 (spouse), 자녀 (child), 지인 (acquaintance).', zh: '用韩文填写代理人是委托人的什么人。例：배우자（配偶）、자녀（子女）、지인（熟人）。', ja: '代理人が委任者の誰にあたるかを韓国語で書きます（配偶者・子・知人など）。', vi: 'Người được ủy quyền là ai đối với người ủy quyền, ghi bằng tiếng Hàn, VD: 배우자 (vợ / chồng), 자녀 (con), 지인 (người quen).' },
    area: cell(918, 620, 1077, 663), part: { box: inBox(cell(918, 620, 1077, 663)), korean: true, placeholder: '예) 배우자' },
  }),
  textField({
    id: 'reason', section: 'delegation', koLabel: '위임 사유',
    label: { ko: '위임하는 이유', en: 'Reason for delegating', zh: '委托理由', ja: '委任の理由', vi: 'Lý do ủy quyền' },
    help: { ko: '본인이 직접 가지 못하고 맡기는 이유를 한국어로 적어요.', en: 'Why you cannot go yourself and are delegating, in Korean.', zh: '用韩文填写本人无法亲自前往而委托的理由。', ja: '本人が直接行けず委任する理由を韓国語で書きます。', vi: 'Lý do bạn không thể tự đi và phải ủy quyền, ghi bằng tiếng Hàn.' },
    area: cell(299, 663, 1077, 709), part: { box: inBox(cell(299, 663, 1077, 709), 'left'), korean: true, placeholder: '예) 해외 체류 중' },
  }),
  dateField({
    id: 'delegationDate', section: 'delegation', koLabel: '위임 ( 년 월 일)',
    label: { ko: '위임한 날짜', en: 'Date of delegation', zh: '委托日期', ja: '委任した日', vi: 'Ngày ủy quyền' },
    help: { ko: '위임한 날짜를 적어요. 위임장은 이 날부터 6개월 동안만 쓸 수 있어요.', en: 'The date you delegate. The delegation is valid for 6 months from this date.', zh: '填写委托的日期。委托书自该日起6个月内有效。', ja: '委任した日付を書きます。委任状はこの日から6か月間有効です。', vi: 'Ngày ủy quyền. Giấy ủy quyền có hiệu lực 6 tháng kể từ ngày này.' },
    area: { x: 780, y: 756, w: 296, h: 30 },
    y: { x: 800, y: 758, w: 72, h: 26, align: 'right' }, m: { x: 900, y: 758, w: 60, h: 26, align: 'right' }, d: { x: 985, y: 758, w: 66, h: 26, align: 'right' },
  }),

  // ── 미성년자의 법정대리인·한정후견인 및 성년후견인 동의서 ──
  nameField({ id: 'consenterName', section: 'consent', koLabel: '동의서 성명', who: CONSENTER, help: { ko: '동의하는 법정대리인·후견인의 이름을 적어요.' + CONSENT_NOTE.ko, en: 'Name of the consenting legal representative / guardian.' + CONSENT_NOTE.en, zh: '填写表示同意的法定代理人·监护人姓名。' + CONSENT_NOTE.zh, ja: '同意する法定代理人・後見人の氏名を書きます。' + CONSENT_NOTE.ja, vi: 'Họ tên người đại diện / giám hộ đồng ý.' + CONSENT_NOTE.vi }, area: cell(242, 838, 628, 895), box: { x: 278, y: 848, w: 330, h: 38, align: 'center' } }),
  { ...idField({ id: 'consenterId', section: 'consent', koLabel: '동의서 주민등록번호', who: CONSENTER, area: cell(794, 838, 1077, 895), front: { x: 831, y: 848, w: 97, h: 38, align: 'center' }, back: { x: 943, y: 848, w: 131, h: 38, align: 'center' } }), help: SEAL_ID_HELP },
  textField({
    id: 'consenterAddress', section: 'consent', koLabel: '동의서 주소',
    label: { ko: `${CONSENTER.ko} 주소`, en: `Address of ${CONSENTER.en}`, zh: `${CONSENTER.zh}地址`, ja: `${CONSENTER.ja}の住所`, vi: `Địa chỉ của ${CONSENTER.vi}` },
    help: { ko: '동의하는 사람의 주소를 한국어로 적어요.' + CONSENT_NOTE.ko, en: 'Address of the consenting person, in Korean.' + CONSENT_NOTE.en, zh: '用韩文填写同意人的地址。' + CONSENT_NOTE.zh, ja: '同意する人の住所を韓国語で書きます。' + CONSENT_NOTE.ja, vi: 'Địa chỉ người đồng ý, ghi bằng tiếng Hàn.' + CONSENT_NOTE.vi },
    area: cell(242, 895, 1077, 952), part: { key: 'address', box: inBox(cell(242, 895, 1077, 952)), korean: true },
  }),
  textField({
    id: 'consenterRelation', section: 'consent', koLabel: '동의서 관계',
    label: { ko: '본인과의 관계', en: 'Relationship to the person', zh: '与本人的关系', ja: '本人との関係', vi: 'Quan hệ với người đó' },
    help: { ko: '동의하는 사람이 인감증명서 본인의 누구인지 한국어로 적어요. 예) 부, 모, 후견인' + CONSENT_NOTE.ko, en: 'Who the consenting person is to the certificate holder, in Korean, e.g., 부 (father), 모 (mother), 후견인 (guardian).' + CONSENT_NOTE.en, zh: '用韩文填写同意人是印鉴证明本人的什么人。例：부（父）、모（母）、후견인（监护人）。' + CONSENT_NOTE.zh, ja: '同意する人が印鑑証明書の本人の誰にあたるかを韓国語で書きます（父・母・後見人など）。' + CONSENT_NOTE.ja, vi: 'Người đồng ý là ai đối với người được cấp giấy, ghi bằng tiếng Hàn, VD: 부 (bố), 모 (mẹ), 후견인 (người giám hộ).' + CONSENT_NOTE.vi },
    area: cell(242, 952, 488, 1018), part: { box: inBox(cell(242, 952, 488, 1018)), korean: true, placeholder: '예) 모' },
  }),
  textField({ id: 'consenterCount', section: 'consent', koLabel: '발급통수 (동의서)', label: { ko: '발급받을 통수 (동의서)', en: 'Number of copies (consent)', zh: '发放份数（同意书）', ja: '発給通数（同意書）', vi: 'Số bản cần cấp (giấy đồng ý)' }, help: COUNT_HELP, area: cell(628, 952, 794, 1018), part: { box: inBox(cell(628, 952, 794, 1018)), inputMode: 'numeric', placeholder: '1' } }),
  textField({
    id: 'consentFor', section: 'consent', koLabel: '(성명: ) 에 대한 인감증명서 발급을 동의합니다',
    label: { ko: '누구의 인감증명서 발급에 동의하는지', en: 'Whose seal certificate you consent to', zh: '同意为谁发放印鉴证明', ja: '誰の印鑑証明書の発給に同意するか', vi: 'Đồng ý cấp giấy chứng nhận cho ai' },
    help: { ko: '인감증명서를 발급받는 본인(미성년자 등)의 이름을 적어요.' + CONSENT_NOTE.ko, en: 'Name of the person (the minor, etc.) whose seal certificate is issued.' + CONSENT_NOTE.en, zh: '填写领取印鉴证明的本人（未成年人等）姓名。' + CONSENT_NOTE.zh, ja: '印鑑証明書の本人（未成年者など）の氏名を書きます。' + CONSENT_NOTE.ja, vi: 'Họ tên người (người chưa thành niên...) được cấp giấy chứng nhận.' + CONSENT_NOTE.vi },
    area: { x: 300, y: 1020, w: 220, h: 30 },
    badgeAt: { x: 288, y: 1035 },
    part: { key: 'name', box: { x: 372, y: 1022, w: 138, h: 26, align: 'center' }, hangul: true },
    copyFrom: [{ field: 'grantorName', label: { ko: '위임자 이름 가져오기', en: "Use the delegator's name", zh: '使用委托人姓名', ja: '委任者の氏名を使う', vi: 'Dùng tên người ủy quyền' }, map: { name: 'name' } }],
  }),
  dateField({
    id: 'consentDate', section: 'consent', koLabel: '동의 ( 년 월 일)',
    label: { ko: '동의한 날짜', en: 'Date of consent', zh: '同意日期', ja: '同意した日', vi: 'Ngày đồng ý' },
    help: { ko: '동의한 날짜를 적어요. 동의서는 이 날부터 6개월 동안만 쓸 수 있어요.' + CONSENT_NOTE.ko, en: 'The date of consent. Valid for 6 months from this date.' + CONSENT_NOTE.en, zh: '填写同意的日期。同意书自该日起6个月内有效。' + CONSENT_NOTE.zh, ja: '同意した日付を書きます。同意書はこの日から6か月間有効です。' + CONSENT_NOTE.ja, vi: 'Ngày đồng ý. Có hiệu lực 6 tháng kể từ ngày này.' + CONSENT_NOTE.vi },
    area: { x: 800, y: 1058, w: 276, h: 30 },
    y: { x: 825, y: 1060, w: 74, h: 26, align: 'right' }, m: { x: 925, y: 1060, w: 54, h: 26, align: 'right' }, d: { x: 1000, y: 1060, w: 52, h: 26, align: 'right' },
  }),

  // ── 세무서장 확인 (재외국민 부동산 권리 이전용) ───────────
  textField({
    id: 'propertyType', section: 'tax', koLabel: '세무서장 확인 부동산 종류',
    label: { ko: '부동산 종류', en: 'Type of real estate', zh: '不动产种类', ja: '不動産の種類', vi: 'Loại bất động sản' },
    help: { ko: '재외국민이 부동산 권리 이전용으로 위임하는 경우에만, 부동산 종류를 한국어로 적어요. 예) 아파트, 토지', en: 'Only when an overseas Korean delegates for transferring real-estate rights: the type of property in Korean, e.g., 아파트 (apartment), 토지 (land).', zh: '仅在在外国民为转移不动产权利而委托时，用韩文填写不动产种类。例：아파트（公寓）、토지（土地）。', ja: '在外国民が不動産の権利移転用に委任する場合のみ、不動産の種類を韓国語で書きます（マンション・土地など）。', vi: 'Chỉ khi kiều bào ủy quyền để chuyển quyền bất động sản: ghi loại bất động sản bằng tiếng Hàn, VD: 아파트 (căn hộ), 토지 (đất).' },
    area: cell(488, 1288, 1077, 1348), part: { box: inBox(cell(488, 1288, 1077, 1348)), korean: true, placeholder: '예) 아파트' },
  }),
  textField({
    id: 'propertyLocation', section: 'tax', koLabel: '세무서장 확인 부동산 소재지',
    label: { ko: '부동산 소재지', en: 'Location of the real estate', zh: '不动产所在地', ja: '不動産の所在地', vi: 'Địa chỉ bất động sản' },
    help: { ko: '재외국민이 부동산 권리 이전용으로 위임하는 경우에만, 부동산이 있는 곳의 주소를 한국어로 적어요.', en: 'Only when an overseas Korean delegates for transferring real-estate rights: the address of the property in Korean.', zh: '仅在在外国民为转移不动产权利而委托时，用韩文填写不动产所在地址。', ja: '在外国民が不動産の権利移転用に委任する場合のみ、不動産の所在地を韓国語で書きます。', vi: 'Chỉ khi kiều bào ủy quyền để chuyển quyền bất động sản: địa chỉ bất động sản bằng tiếng Hàn.' },
    area: cell(488, 1348, 1077, 1406), part: { key: 'address', box: inBox(cell(488, 1348, 1077, 1406)), korean: true },
  }),
];

export const sealCertificateDelegation: FormDef = {
  id: 'seal-certificate-delegation',
  title: { ko: '인감증명 위임장', en: 'POA for Seal Certificate', zh: '印章证明委托书', ja: '印鑑証明委任状', vi: 'Giấy ủy quyền cấp giấy chứng nhận con dấu' },
  pages: [{ image: '/forms/seal-certificate-delegation_ko.png', width: 1190, height: 1682 }],
  sections: [
    { id: 'type',       label: { ko: '서류 용도',         en: 'Document type',        zh: '文件用途',   ja: '書類の用途',   vi: 'Loại giấy' } },
    { id: 'delegation', label: { ko: '인감증명서 발급 위임장', en: 'Delegation',     zh: '印鉴证明发放委托书', ja: '印鑑証明書発給委任状', vi: 'Giấy ủy quyền' } },
    { id: 'consent',    label: { ko: '법정대리인·후견인 동의서', en: 'Consent of representative / guardian', zh: '法定代理人·监护人同意书', ja: '法定代理人・後見人の同意書', vi: 'Giấy đồng ý của người đại diện / giám hộ' } },
    { id: 'tax',        label: { ko: '세무서장 확인 (부동산)', en: 'Tax office confirmation (real estate)', zh: '税务署长确认（不动产）', ja: '税務署長の確認（不動産）', vi: 'Xác nhận của cơ quan thuế (bất động sản)' } },
  ],
  fields,
};
