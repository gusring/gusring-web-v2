import { dateField, idField, ID_HELP, nameField, textField, topRight, Who } from './common';
import { allItemsField, CHOBON_HELP_RESTRICTED, chobonCountField, chobonItemsField, deungbonCountField, deungbonItemsField, feeExemptField, infoConsentField, officialCheckField, viewField } from './resident-record-items';
import { Box, FieldDef, FormDef, L } from './types';

// ─────────────────────────────────────────────────────────────
// 주민등록표 열람 또는 등·초본 교부 신청서 [주민등록법 시행규칙 별지 제7호서식] — v1 서식 31번
// 원본은 3쪽(3쪽은 유의 사항뿐)이라 1·2쪽만 쓴다. 좌표는 public/forms/resident-record-request_ko.png, _ko_2.png 기준.
// 칸 이름이 칸 왼쪽 위에 인쇄된 정부 서식이라 번호는 칸 오른쪽 위에 둔다.
// 안내 문구는 3쪽 「유의 사항」(v1 guides_ko_31)을 바탕으로 작성. 서명, 본인정보 제공 요구서 서명란은 입력받지 않는다.
// ─────────────────────────────────────────────────────────────

const APPLICANT: Who = { ko: '신청인', en: 'the applicant', zh: '申请人', ja: '申請人', vi: 'người nộp đơn' };
const VISITOR: Who = { ko: '방문자', en: 'the visitor', zh: '来访者', ja: '訪問者', vi: 'người đến nộp' };
const TARGET: Who = { ko: '교부대상자', en: 'the person whose record is requested', zh: '发放对象人', ja: '交付対象者', vi: 'người được cấp hồ sơ' };

const cell = (x: number, y: number, x2: number, y2: number): Box => ({ x: x + 1, y: y + 1, w: x2 - x - 2, h: y2 - y - 2 });
const valueBox = (a: Box, top = 28, align: Box['align'] = 'center'): Box => ({ x: a.x + 18, y: a.y + top, w: a.w - 70, h: Math.min(40, a.h - top - 6), align });

const CORP_NOTE: L = {
  ko: ' 법인(회사·기관)이 신청할 때만 적어요.',
  en: ' Only when a corporation (company or organization) applies.',
  zh: '仅在法人（公司·机构）申请时填写。',
  ja: '法人（会社・機関）が申請する場合のみ書きます。',
  vi: ' Chỉ ghi khi pháp nhân (công ty, tổ chức) nộp đơn.',
};
const TARGET_NOTE: L = {
  ko: ' 본인의 주민등록표를 열람하거나 등·초본을 받을 때는 적지 않아요.',
  en: ' Leave blank if you are requesting your own record.',
  zh: '查阅本人居民登记表或领取本人的誊本·抄本时不填写。',
  ja: '本人の住民登録票を閲覧したり謄本・抄本を受け取る場合は書きません。',
  vi: ' Để trống nếu bạn xin hồ sơ của chính mình.',
};
const ID_HELP_FOREIGN: L = {
  ko: ID_HELP.ko + ' 외국인등록번호나 국내거소신고번호도 이 칸에 적어요.',
  en: ID_HELP.en + ' The alien registration number or domestic residence report number also goes in this box.',
  zh: ID_HELP.zh + '外国人登录号或国内居所申报号也填在此栏。',
  ja: ID_HELP.ja + '外国人登録番号や国内居所申告番号もこの欄に書きます。',
  vi: ID_HELP.vi + ' Số đăng ký người nước ngoài hoặc số khai báo cư trú cũng ghi vào ô này.',
};

const simpleText = (id: string, section: string, koLabel: string, label: L, help: L, a: Box, extra: Partial<{ key: string; hangul: boolean; korean: boolean; inputMode: 'tel' | 'numeric'; placeholder: string; page: number; box: Box }> = {}): FieldDef =>
  textField({ id, section, koLabel, label, help, area: a, badgeAt: topRight(a), page: extra.page, part: { key: extra.key ?? 'text', box: extra.box ?? valueBox(a), hangul: extra.hangul, korean: extra.korean, inputMode: extra.inputMode, placeholder: extra.placeholder } });

const phoneHelp: L = { ko: '연락 가능한 번호를 적어요.', en: 'A number where they can be reached.', zh: '填写可以联系到的号码。', ja: '連絡のつく番号を書きます。', vi: 'Số điện thoại có thể liên lạc.' };
const PHONE: L = { ko: '연락처', en: 'Phone number', zh: '联系电话', ja: '連絡先', vi: 'Số điện thoại' };


const fields: FieldDef[] = [
  // ── 1쪽: 신청인(개인) ────────────────────────────────────
  nameField({ id: 'applicantName', section: 'applicant', koLabel: '신청인(개인) 성명', who: APPLICANT, help: { ko: '신청하는 사람의 이름을 한글로 적어요. 서명이나 도장은 출력한 종이에 직접 해요.', en: 'Name of the applicant in Korean letters. Sign or stamp by hand on the printed paper.', zh: '用韩文填写申请人姓名。签名或盖章请在打印出的纸上亲自完成。', ja: '申請人の氏名をハングルで書きます。署名・押印は印刷した紙に直接します。', vi: 'Họ tên người nộp đơn bằng chữ Hàn. Ký tên hoặc đóng dấu trực tiếp trên giấy đã in.' }, area: cell(211, 291, 651, 387), badgeAt: topRight(cell(211, 291, 651, 387)), box: { x: 230, y: 328, w: 250, h: 40, align: 'center' } }),
  { ...idField({ id: 'applicantId', section: 'applicant', koLabel: '신청인(개인) 주민등록번호', who: APPLICANT, area: cell(651, 291, 1090, 387), badgeAt: topRight(cell(651, 291, 1090, 387)), box: { x: 670, y: 325, w: 380, h: 40, align: 'center' } }), help: ID_HELP_FOREIGN },
  {
    id: 'applicantAddress', section: 'applicant', koLabel: '신청인(개인) 주소 (시·도) (시·군·구)',
    label: { ko: '신청인 주소 (시·도, 시·군·구)', en: 'Address of the applicant (province, city/district)', zh: '申请人地址（市·道、市·郡·区）', ja: '申請人の住所（市・道、市・郡・区）', vi: 'Địa chỉ người nộp đơn (tỉnh / thành, quận / huyện)' },
    help: { ko: '시·도와 시·군·구까지만 적어요. 상세 주소는 적지 않아도 돼요. 예) 서울특별시, 금천구', en: 'Only the province/city and district; no detailed address is needed, e.g., 서울특별시, 금천구.', zh: '只填写到市·道和市·郡·区，不必写详细地址。例：서울특별시、금천구。', ja: '市・道と市・郡・区までだけ書きます。詳しい住所は不要です（ソウル特別市、衿川区にあたる韓国語など）。', vi: 'Chỉ ghi đến tỉnh / thành và quận / huyện; không cần địa chỉ chi tiết, VD: 서울특별시, 금천구.' },
    area: cell(211, 387, 1090, 560), badgeAt: topRight(cell(211, 387, 1090, 560)),
    input: {
      kind: 'text',
      parts: [
        { key: 'sido', box: { x: 282, y: 431, w: 192, h: 32, align: 'center' }, korean: true, label: { ko: '시·도', en: 'Province / metropolitan city', zh: '市·道', ja: '市・道', vi: 'Tỉnh / thành phố' }, placeholder: '예) 서울특별시' },
        { key: 'sigungu', box: { x: 558, y: 431, w: 202, h: 32, align: 'center' }, korean: true, label: { ko: '시·군·구', en: 'City / county / district', zh: '市·郡·区', ja: '市・郡・区', vi: 'Quận / huyện' }, placeholder: '예) 금천구' },
      ],
    },
  },
  simpleText('applicantRelation', 'applicant', '대상자와의 관계', { ko: '대상자와의 관계', en: 'Relationship to the person whose record is requested', zh: '与对象人的关系', ja: '対象者との関係', vi: 'Quan hệ với người được cấp hồ sơ' },
    { ko: '열람하거나 등·초본을 받는 대상자가 신청인의 누구인지 한국어로 적어요. 본인 것이면 "본인"이라고 적어요.', en: 'Who the person whose record is requested is to you, in Korean. If it is your own, write 본인 (self).', zh: '用韩文填写对象人是申请人的什么人。本人的记录写“본인”。', ja: '閲覧・交付の対象者が申請人の誰にあたるかを韓国語で書きます。本人のものなら「本人」にあたる韓国語を書きます。', vi: 'Người được cấp hồ sơ là ai đối với bạn, ghi bằng tiếng Hàn. Nếu là của chính bạn, ghi 본인 (bản thân).' },
    cell(211, 560, 651, 657), { korean: true, placeholder: '예) 본인' }),
  simpleText('applicantPhone', 'applicant', '신청인(개인) 연락처', PHONE, phoneHelp, cell(651, 560, 1090, 657), { key: 'phone', inputMode: 'tel', placeholder: '010-1234-5678' }),
  feeExemptField({ section: 'applicant', area: cell(211, 657, 1090, 750), badgeAt: topRight(cell(211, 657, 1090, 750)), pts: [[239, 686]] }),

  // ── 1쪽: 신청인(법인) ────────────────────────────────────
  simpleText('corpName', 'corporate', '기관명', { ko: '기관명', en: 'Name of the organization', zh: '机构名称', ja: '機関名', vi: 'Tên tổ chức' }, { ko: '회사·기관 이름을 적어요.' + CORP_NOTE.ko, en: 'Name of the company or organization.' + CORP_NOTE.en, zh: '填写公司·机构名称。' + CORP_NOTE.zh, ja: '会社・機関の名称を書きます。' + CORP_NOTE.ja, vi: 'Tên công ty / tổ chức.' + CORP_NOTE.vi }, cell(211, 750, 651, 837)),
  simpleText('corpRegNo', 'corporate', '사업자등록번호', { ko: '사업자등록번호', en: 'Business registration number', zh: '营业执照号码', ja: '事業者登録番号', vi: 'Mã số đăng ký kinh doanh' }, { ko: '사업자등록번호를 적어요.' + CORP_NOTE.ko, en: 'The business registration number.' + CORP_NOTE.en, zh: '填写营业执照号码。' + CORP_NOTE.zh, ja: '事業者登録番号を書きます。' + CORP_NOTE.ja, vi: 'Mã số đăng ký kinh doanh.' + CORP_NOTE.vi }, cell(651, 750, 1090, 837), { inputMode: 'numeric', placeholder: '123-45-67890' }),
  simpleText('corpRep', 'corporate', '대표자', { ko: '대표자 이름', en: 'Name of the representative', zh: '代表人姓名', ja: '代表者の氏名', vi: 'Tên người đại diện' }, { ko: '대표자 이름을 적어요. 서명이나 도장은 출력한 종이에 직접 해요.' + CORP_NOTE.ko, en: "The representative's name. Sign or stamp by hand on the printed paper." + CORP_NOTE.en, zh: '填写代表人姓名。签名或盖章请在打印出的纸上亲自完成。' + CORP_NOTE.zh, ja: '代表者の氏名を書きます。署名・押印は印刷した紙に直接します。' + CORP_NOTE.ja, vi: 'Tên người đại diện. Ký tên hoặc đóng dấu trực tiếp trên giấy đã in.' + CORP_NOTE.vi }, cell(211, 837, 651, 935), { key: 'name' }),
  simpleText('corpPhone', 'corporate', '법인 연락처', PHONE, phoneHelp, cell(651, 837, 1090, 935), { key: 'phone', inputMode: 'tel' }),
  simpleText('corpAddress', 'corporate', '소재지', { ko: '소재지', en: 'Address of the organization', zh: '所在地', ja: '所在地', vi: 'Địa chỉ tổ chức' }, { ko: '회사·기관의 주소를 한국어로 적어요.' + CORP_NOTE.ko, en: 'Address of the company or organization, in Korean.' + CORP_NOTE.en, zh: '用韩文填写公司·机构地址。' + CORP_NOTE.zh, ja: '会社・機関の住所を韓国語で書きます。' + CORP_NOTE.ja, vi: 'Địa chỉ công ty / tổ chức, ghi bằng tiếng Hàn.' + CORP_NOTE.vi }, cell(211, 935, 1090, 1033), { key: 'address', korean: true }),
  nameField({ id: 'visitorName', section: 'corporate', koLabel: '방문자 성명', who: VISITOR, help: { ko: '창구에 오는 직원의 이름을 적어요. 신분증과 사원증(또는 재직증명서)을 보여 줘야 해요.' + CORP_NOTE.ko, en: 'Name of the employee who comes to the counter. They must show their ID and employee card (or certificate of employment).' + CORP_NOTE.en, zh: '填写到窗口来的职员姓名。须出示身份证件及工作证（或在职证明）。' + CORP_NOTE.zh, ja: '窓口に来る職員の氏名を書きます。身分証と社員証（または在職証明書）を提示します。' + CORP_NOTE.ja, vi: 'Tên nhân viên đến quầy. Người đó phải xuất trình giấy tờ tùy thân và thẻ nhân viên (hoặc giấy xác nhận công tác).' + CORP_NOTE.vi }, area: cell(211, 1033, 462, 1131), badgeAt: topRight(cell(211, 1033, 462, 1131)), box: valueBox(cell(211, 1033, 462, 1131)) }),
  { ...idField({ id: 'visitorId', section: 'corporate', koLabel: '방문자 주민등록번호', who: VISITOR, area: cell(462, 1033, 758, 1131), badgeAt: topRight(cell(462, 1033, 758, 1131)), box: valueBox(cell(462, 1033, 758, 1131)) }), help: ID_HELP_FOREIGN },
  simpleText('visitorPhone', 'corporate', '방문자 연락처', PHONE, phoneHelp, cell(758, 1033, 1090, 1131), { key: 'phone', inputMode: 'tel' }),

  // ── 1쪽: 열람 또는 등·초본 교부대상자 ────────────────────
  nameField({ id: 'targetName', section: 'target', koLabel: '교부대상자 성명', who: TARGET, help: { ko: '주민등록표를 열람하거나 등·초본을 받을 대상자의 이름을 적어요.' + TARGET_NOTE.ko, en: 'Name of the person whose record you are requesting.' + TARGET_NOTE.en, zh: '填写查阅居民登记表或领取誊本·抄本的对象人姓名。' + TARGET_NOTE.zh, ja: '住民登録票を閲覧したり謄本・抄本を受け取る対象者の氏名を書きます。' + TARGET_NOTE.ja, vi: 'Họ tên người có hồ sơ cần xem / cấp.' + TARGET_NOTE.vi }, area: cell(211, 1217, 651, 1311), badgeAt: topRight(cell(211, 1217, 651, 1311)), box: valueBox(cell(211, 1217, 651, 1311)) }),
  { ...idField({ id: 'targetId', section: 'target', koLabel: '교부대상자 주민등록번호', who: TARGET, area: cell(651, 1217, 1090, 1311), badgeAt: topRight(cell(651, 1217, 1090, 1311)), box: valueBox(cell(651, 1217, 1090, 1311)) }), help: { ...ID_HELP_FOREIGN, ko: ID_HELP_FOREIGN.ko + TARGET_NOTE.ko, en: ID_HELP_FOREIGN.en + TARGET_NOTE.en, zh: ID_HELP_FOREIGN.zh + TARGET_NOTE.zh, ja: ID_HELP_FOREIGN.ja + TARGET_NOTE.ja, vi: ID_HELP_FOREIGN.vi + TARGET_NOTE.vi } },
  simpleText('targetAddress', 'target', '교부대상자 주소', { ko: '교부대상자 주소', en: 'Address of the person whose record is requested', zh: '对象人地址', ja: '対象者の住所', vi: 'Địa chỉ người được cấp hồ sơ' }, { ko: '대상자의 주소를 한국어로 적어요.' + TARGET_NOTE.ko, en: "The person's address, in Korean." + TARGET_NOTE.en, zh: '用韩文填写对象人地址。' + TARGET_NOTE.zh, ja: '対象者の住所を韓国語で書きます。' + TARGET_NOTE.ja, vi: 'Địa chỉ người đó, ghi bằng tiếng Hàn.' + TARGET_NOTE.vi }, cell(211, 1311, 1090, 1415), { key: 'address', korean: true }),

  // ── 2쪽: 신청 내용 ───────────────────────────────────────
  viewField({ section: 'content', page: 2, area: { x: 226, y: 147, w: 880, h: 28 }, badgeAt: { x: 1128, y: 161 }, pts: [[345, 161], [707, 161]] }),
  allItemsField({ section: 'content', page: 2, area: { x: 226, y: 222, w: 880, h: 26 }, badgeAt: { x: 1128, y: 234 }, pts: [[358, 234], [800, 234]] }),
  deungbonCountField({ section: 'content', page: 2, area: { x: 230, y: 420, w: 60, h: 64 }, badgeAt: { x: 210, y: 466 }, box: { x: 248, y: 456, w: 22, h: 20, align: 'center' } }),
  deungbonItemsField({
    section: 'content', page: 2, area: { x: 323, y: 250, w: 783, h: 395 }, badgeAt: { x: 1128, y: 264 },
    pts: [[702, 277], [844, 277], [970, 320], [970, 364], [969, 408], [792, 453], [874, 451], [949, 451], [970, 497], [787, 541], [869, 539], [944, 539], [970, 584], [970, 628]],
    years: { x: 1004, y: 264, w: 24, h: 22, align: 'center' },
  }),
  chobonCountField({ section: 'content', page: 2, area: { x: 230, y: 772, w: 60, h: 64 }, badgeAt: { x: 210, y: 817 }, box: { x: 248, y: 807, w: 22, h: 20, align: 'center' } }),
  chobonItemsField({
    section: 'content', page: 2, area: { x: 323, y: 640, w: 783, h: 300 }, badgeAt: { x: 1128, y: 672 }, help: CHOBON_HELP_RESTRICTED,
    pts: [[970, 672], [717, 713], [853, 713], [970, 757], [907, 785], [905, 810], [905, 838], [907, 865], [607, 893], [690, 891], [904, 891], [775, 939]],
    years: { x: 1006, y: 700, w: 24, h: 22, align: 'center' },
  }),
  simpleText('purpose', 'content', '용도 및 목적', { ko: '용도 및 목적', en: 'Purpose', zh: '用途及目的', ja: '用途及び目的', vi: 'Mục đích sử dụng' },
    { ko: '어디에 쓰려는지 한국어로 적어요. 본인이나 세대원이 아닌 사람이 받는 등·초본에는 이 내용이 찍혀 나오니 꼭 적어요.', en: 'What you will use it for, in Korean. If someone other than the person or a household member receives the copy, this purpose is printed on it, so be sure to fill it in.', zh: '用韩文填写用途。非本人或户内成员领取的誊本·抄本上会印出此内容，请务必填写。', ja: '何に使うかを韓国語で書きます。本人や世帯員以外が受け取る謄本・抄本にはこの内容が表示されるので、必ず書きます。', vi: 'Dùng để làm gì, ghi bằng tiếng Hàn. Nếu người nhận không phải chính chủ hay thành viên hộ, nội dung này sẽ in trên bản sao nên phải ghi.' },
    { x: 229, y: 949, w: 878, h: 32 }, { korean: true, placeholder: '예) 은행 제출용', page: 2, box: { x: 240, y: 951, w: 830, h: 28, align: 'left' } }),
  simpleText('evidence', 'content', '증명자료', { ko: '증명자료', en: 'Supporting documents', zh: '证明材料', ja: '証明資料', vi: 'Giấy tờ chứng minh' },
    { ko: '함께 내는 증명 자료를 한국어로 적어요. 본인·세대원이 아닌 사람이 등본을 신청하면 증명 자료를 따로 내야 해요.', en: 'Supporting documents you submit, in Korean. If someone other than the person or a household member requests a household copy, separate proof is required.', zh: '用韩文填写一并提交的证明材料。非本人或户内成员申请誊本时须另交证明材料。', ja: '一緒に提出する証明資料を韓国語で書きます。本人・世帯員以外が謄本を申請する場合は証明資料を別途提出します。', vi: 'Giấy tờ chứng minh nộp kèm, ghi bằng tiếng Hàn. Người không phải chính chủ / thành viên hộ xin bản sao hộ khẩu phải nộp giấy tờ chứng minh.' },
    { x: 229, y: 982, w: 878, h: 30 }, { korean: true, page: 2, box: { x: 240, y: 984, w: 830, h: 26, align: 'left' } }),
  dateField({
    id: 'applyDate', section: 'content', page: 2, koLabel: '신청일 ( 년 월 일)',
    label: { ko: '신청하는 날짜', en: 'Date of application', zh: '申请日期', ja: '申請日', vi: 'Ngày nộp đơn' },
    help: { ko: '이 신청서를 제출하는 날짜예요. 보통 오늘 날짜를 적어요.', en: "The date you submit this. Usually today's date.", zh: '提交本申请书的日期，通常填写今天的日期。', ja: 'この申請書を提出する日付です。通常は今日の日付を書きます。', vi: 'Ngày bạn nộp đơn này. Thường là ngày hôm nay.' },
    area: { x: 780, y: 1046, w: 320, h: 32 },
    y: { x: 790, y: 1049, w: 72, h: 28, align: 'right' }, m: { x: 900, y: 1049, w: 64, h: 28, align: 'right' }, d: { x: 1000, y: 1049, w: 68, h: 28, align: 'right' },
  }),

  // ── 2쪽: 담당 공무원 확인사항 동의 · 공동이용 동의서 ──────
  officialCheckField({ section: 'consent', page: 2, area: { x: 228, y: 1140, w: 878, h: 145 }, badgeAt: { x: 1128, y: 1151 }, pts: [[257, 1151], [256, 1187], [255, 1268]] }),
  infoConsentField({ section: 'consent', page: 2, area: { x: 90, y: 1455, w: 1016, h: 60 }, badgeAt: { x: 76, y: 1484 }, pts: [[112, 1466], [112, 1502]] }),
];

export const residentRecordRequest: FormDef = {
  id: 'resident-record-request',
  title: { ko: '주민등록표 신청서', en: 'Resident Record Request', zh: '居民登记表申请', ja: '住民登録票申請', vi: 'Đơn xin bản sao hộ khẩu' },
  pages: [
    { image: '/forms/resident-record-request_ko.png', width: 1190, height: 1682 },
    { image: '/forms/resident-record-request_ko_2.png', width: 1190, height: 1682, marginX: 1128 },
  ],
  sections: [
    { id: 'applicant', label: { ko: '신청인 (개인)',        en: 'Applicant (individual)',  zh: '申请人（个人）', ja: '申請人（個人）', vi: 'Người nộp đơn (cá nhân)' } },
    { id: 'corporate', label: { ko: '신청인 (법인)',        en: 'Applicant (corporation)', zh: '申请人（法人）', ja: '申請人（法人）', vi: 'Người nộp đơn (pháp nhân)' } },
    { id: 'target',    label: { ko: '열람·교부 대상자',     en: 'Person whose record is requested', zh: '查阅·发放对象人', ja: '閲覧・交付対象者', vi: 'Người được cấp hồ sơ' } },
    { id: 'content',   label: { ko: '2쪽 신청 내용',        en: 'Page 2: request',         zh: '第2页 申请内容', ja: '2ページ 申請内容', vi: 'Trang 2: nội dung' } },
    { id: 'consent',   label: { ko: '2쪽 확인·동의',        en: 'Page 2: consent',         zh: '第2页 确认·同意', ja: '2ページ 確認・同意', vi: 'Trang 2: đồng ý' } },
  ],
  fields,
};
