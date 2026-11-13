import { dateField, idField, ID_HELP, nameField, opt, textField, topRight, Who } from './common';
import { Box, ChoiceOption, FieldDef, FormDef, L } from './types';

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

/** 포함 [ ] 목록 (여러 개 고르기) */
const inc = (value: string, ko: string, label: L, x: number, y: number): ChoiceOption => opt(value, ko, label, x, y);

const ITEM_HELP = (what: L): L => ({
  ko: `${what.ko}에 넣고 싶은 사항을 모두 골라요. 고르지 않으면 성명·생년월일·주소 같은 기본 사항만 나와요. 「과거의 주소 변동 사항」을 직접 입력으로 고르면 1년 단위로 적어요.`,
  en: `Choose everything you want included in the ${what.en}. If you choose nothing, only basic items such as name, date of birth and address are shown. For past address changes by "direct input", write the period in whole years.`,
  zh: `选择希望${what.zh}中包含的所有事项。不选择时只提供姓名、出生日期、地址等基本事项。“过去的地址变动事项”选择直接输入时，以1年为单位填写。`,
  ja: `${what.ja}に含めたい事項をすべて選びます。選ばなければ氏名・生年月日・住所などの基本事項だけが出ます。「過去の住所変動事項」を直接入力にした場合は1年単位で書きます。`,
  vi: `Chọn tất cả nội dung muốn có trong ${what.vi}. Nếu không chọn, chỉ có thông tin cơ bản như họ tên, ngày sinh, địa chỉ. Nếu chọn nhập trực tiếp phần thay đổi địa chỉ trước đây, ghi theo đơn vị năm.`,
});
const DEUNGBON: L = { ko: '등본', en: 'certified copy (household)', zh: '誊本', ja: '謄本', vi: 'bản sao hộ khẩu' };
const CHOBON: L = { ko: '초본', en: 'abstract (individual)', zh: '抄本', ja: '抄本', vi: 'bản trích lục cá nhân' };

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
  {
    id: 'feeExempt', section: 'applicant', koLabel: '[ ] 수수료 면제를 신청함',
    label: { ko: '수수료 면제 신청', en: 'Apply for fee exemption', zh: '申请免除手续费', ja: '手数料免除の申請', vi: 'Xin miễn lệ phí' },
    help: { ko: '수수료 면제 대상(국민기초생활보장법에 따른 수급자, 독립유공자·국가유공자 등과 그 유족, 한부모가족 지원대상자, 미성년 자녀 2명 이상을 키우는 사람 등 3쪽 유의 사항에 적힌 사람)이면 골라요.', en: 'Tick if you are eligible for fee exemption (e.g., basic livelihood recipients, persons of national merit and their bereaved families, single-parent family support recipients, people raising 2 or more minor children — as listed on page 3).', zh: '如属于免除手续费对象（基本生活保障受助者、独立·国家有功者及遗属、单亲家庭支援对象、抚养2名以上未成年子女者等第3页所列人员），请勾选。', ja: '手数料免除の対象（基礎生活保障の受給者、独立・国家有功者とその遺族、ひとり親家庭支援対象者、未成年の子を2人以上養育する人など、3ページに記載の人）であれば選びます。', vi: 'Chọn nếu thuộc đối tượng miễn lệ phí (người nhận trợ cấp sinh hoạt cơ bản, người có công và gia đình, đối tượng hỗ trợ gia đình đơn thân, người nuôi từ 2 con chưa thành niên... như ghi ở trang 3).' },
    area: cell(211, 657, 1090, 750), badgeAt: topRight(cell(211, 657, 1090, 750)),
    input: { kind: 'choice', mark: 'check', options: [opt('yes', '수수료 면제를 신청함', { ko: '수수료 면제를 신청해요', en: 'Apply for exemption', zh: '申请免除', ja: '免除を申請する', vi: 'Xin miễn' }, 239, 686)] },
  },

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
  {
    id: 'view', section: 'content', page: 2, koLabel: '열람 [ ]등본 사항 [ ]초본 사항',
    label: { ko: '열람 (화면으로 보기)', en: 'Viewing', zh: '查阅', ja: '閲覧', vi: 'Xem hồ sơ' },
    help: { ko: '종이로 받지 않고 화면으로 보기만 할 때 골라요.', en: 'Choose if you only want to view the record, not receive a copy.', zh: '只查看而不领取纸本时选择。', ja: '紙で受け取らず閲覧だけする場合に選びます。', vi: 'Chọn nếu chỉ muốn xem, không nhận bản giấy.' },
    area: { x: 226, y: 147, w: 880, h: 28 }, badgeAt: { x: 1128, y: 161 },
    input: { kind: 'choice', mark: 'check', multiple: true, options: [opt('deungbon', '등본 사항', { ko: '등본 사항', en: 'Household copy items', zh: '誊本事项', ja: '謄本事項', vi: 'Nội dung bản sao hộ khẩu' }, 345, 161), opt('chobon', '초본 사항', { ko: '초본 사항', en: 'Individual abstract items', zh: '抄本事项', ja: '抄本事項', vi: 'Nội dung bản trích lục' }, 707, 161)] },
  },
  {
    id: 'allItems', section: 'content', page: 2, koLabel: '[ ]등본 사항 전부 포함 [ ]초본 사항 전부 포함',
    label: { ko: '모든 사항 포함', en: 'Include everything', zh: '包含全部事项', ja: 'すべての事項を含める', vi: 'Bao gồm tất cả' },
    help: { ko: '개인정보 보호를 위해 필요한 사항만 골라 신청할 수 있어요. 전부 넣으려면 여기서 골라요.', en: 'To protect privacy you may choose only the items you need. Tick here to include everything.', zh: '为保护个人信息，可以只选择需要的事项。如需全部包含，请在此选择。', ja: '個人情報保護のため必要な事項だけ選んで申請できます。すべて含める場合はここで選びます。', vi: 'Để bảo vệ thông tin cá nhân, có thể chỉ chọn nội dung cần thiết. Muốn có tất cả thì chọn ở đây.' },
    area: { x: 226, y: 222, w: 880, h: 26 }, badgeAt: { x: 1128, y: 234 },
    input: { kind: 'choice', mark: 'check', multiple: true, options: [opt('deungbon', '등본 사항 전부 포함', { ko: '등본 사항 전부', en: 'All household copy items', zh: '全部誊本事项', ja: '謄本事項すべて', vi: 'Toàn bộ nội dung bản sao' }, 358, 234), opt('chobon', '초본 사항 전부 포함', { ko: '초본 사항 전부', en: 'All abstract items', zh: '全部抄本事项', ja: '抄本事項すべて', vi: 'Toàn bộ nội dung trích lục' }, 800, 234)] },
  },
  textField({ id: 'deungbonCount', section: 'content', page: 2, koLabel: '등본 교부 [ ]통', label: { ko: '등본 몇 통', en: 'Copies of the household record', zh: '誊本份数', ja: '謄本の通数', vi: 'Số bản sao hộ khẩu' }, help: { ko: '등본을 몇 통 받을지 숫자로 적어요. 등본이 필요 없으면 비워 둬요.', en: 'How many household copies you need (number). Leave blank if none.', zh: '用数字填写要领取几份誊本。不需要则留空。', ja: '謄本を何通受け取るか数字で書きます。不要なら空欄にします。', vi: 'Số bản sao hộ khẩu cần lấy. Không cần thì để trống.' }, area: { x: 230, y: 420, w: 60, h: 64 }, badgeAt: { x: 210, y: 466 }, part: { box: { x: 248, y: 456, w: 22, h: 20, align: 'center' }, inputMode: 'numeric', placeholder: '1' } }),
  {
    id: 'deungbonItems', section: 'content', page: 2, koLabel: '등본 교부 1~9 [ ]포함',
    label: { ko: '등본에 넣을 사항', en: 'Items in the household copy', zh: '誊本包含的事项', ja: '謄本に含める事項', vi: 'Nội dung trong bản sao hộ khẩu' },
    help: ITEM_HELP(DEUNGBON),
    area: { x: 323, y: 250, w: 783, h: 395 }, badgeAt: { x: 1128, y: 264 },
    input: {
      kind: 'choice', mark: 'check', multiple: true,
      options: [
        inc('addrAll', '1 과거의 주소 변동 사항: 전체 포함', { ko: '1. 과거 주소 변동: 전체', en: '1. Past address changes: all', zh: '1. 过去的地址变动：全部', ja: '1. 過去の住所変動：全部', vi: '1. Thay đổi địa chỉ trước đây: tất cả' }, 702, 277),
        inc('addrRecent', '1 과거의 주소 변동 사항: 직접 입력', { ko: '1. 과거 주소 변동: 최근 몇 년만', en: '1. Past address changes: recent years only', zh: '1. 过去的地址变动：仅最近几年', ja: '1. 過去の住所変動：直近の年数のみ', vi: '1. Thay đổi địa chỉ: chỉ vài năm gần đây' }, 844, 277),
        inc('reason', '2 세대 구성 사유', { ko: '2. 세대 구성 사유', en: '2. Reason for household composition', zh: '2. 户籍构成原因', ja: '2. 世帯構成の事由', vi: '2. Lý do lập hộ' }, 970, 320),
        inc('formed', '3 세대 구성 일자', { ko: '3. 세대 구성 일자', en: '3. Date the household was formed', zh: '3. 户籍构成日期', ja: '3. 世帯構成の日付', vi: '3. Ngày lập hộ' }, 970, 364),
        inc('dates', '4 발생일 / 신고일', { ko: '4. 발생일 / 신고일', en: '4. Date of event / report', zh: '4. 发生日 / 申报日', ja: '4. 発生日／届出日', vi: '4. Ngày phát sinh / khai báo' }, 969, 408),
        inc('changeReason', '5 변동 사유', { ko: '5. 변동 사유', en: '5. Reason for change', zh: '5. 变动原因', ja: '5. 変動事由', vi: '5. Lý do thay đổi' }, 792, 453),
        inc('changeHousehold', '5 변동 사유: 세대', { ko: '└ 5. 세대', en: '└ 5. household', zh: '└ 5. 户', ja: '└ 5. 世帯', vi: '└ 5. hộ' }, 874, 451),
        inc('changeMember', '5 변동 사유: 세대원', { ko: '└ 5. 세대원', en: '└ 5. household members', zh: '└ 5. 户内成员', ja: '└ 5. 世帯員', vi: '└ 5. thành viên hộ' }, 949, 451),
        inc('others', '6 교부 대상자 외 세대주·세대원·외국인등의 이름', { ko: '6. 대상자 외 세대주·세대원·외국인 등 이름', en: '6. Names of the head, members and foreigners other than the person', zh: '6. 对象人以外的户主·成员·外国人等姓名', ja: '6. 対象者以外の世帯主・世帯員・外国人等の氏名', vi: '6. Tên chủ hộ, thành viên, người nước ngoài khác' }, 970, 497),
        inc('idBack', '7 주민등록번호 뒷자리', { ko: '7. 주민등록번호 뒷자리', en: '7. Last digits of registration numbers', zh: '7. 居民登录号后几位', ja: '7. 住民登録番号の後半', vi: '7. Các số sau của số đăng ký' }, 787, 541),
        inc('idBackSelf', '7 주민등록번호 뒷자리: 본인', { ko: '└ 7. 본인', en: '└ 7. self', zh: '└ 7. 本人', ja: '└ 7. 本人', vi: '└ 7. bản thân' }, 869, 539),
        inc('idBackMember', '7 주민등록번호 뒷자리: 세대원', { ko: '└ 7. 세대원', en: '└ 7. household members', zh: '└ 7. 户内成员', ja: '└ 7. 世帯員', vi: '└ 7. thành viên hộ' }, 944, 539),
        inc('relation', '8 세대원의 세대주와의 관계', { ko: '8. 세대원과 세대주의 관계', en: "8. Members' relationship to the head", zh: '8. 成员与户主的关系', ja: '8. 世帯員と世帯主の関係', vi: '8. Quan hệ của thành viên với chủ hộ' }, 970, 584),
        inc('cohabitant', '9 동거인', { ko: '9. 동거인', en: '9. Cohabitants', zh: '9. 同住人', ja: '9. 同居人', vi: '9. Người sống cùng' }, 970, 628),
      ],
      extra: { key: 'years', when: ['addrRecent'], box: { x: 1004, y: 264, w: 24, h: 22, align: 'center' }, inputMode: 'numeric', label: { ko: '최근 몇 년', en: 'How many recent years', zh: '最近几年', ja: '直近何年', vi: 'Bao nhiêu năm gần đây' }, placeholder: '5' },
    },
  },
  textField({ id: 'chobonCount', section: 'content', page: 2, koLabel: '초본 교부 [ ]통', label: { ko: '초본 몇 통', en: 'Copies of the individual abstract', zh: '抄本份数', ja: '抄本の通数', vi: 'Số bản trích lục' }, help: { ko: '초본을 몇 통 받을지 숫자로 적어요. 초본이 필요 없으면 비워 둬요.', en: 'How many abstracts you need (number). Leave blank if none.', zh: '用数字填写要领取几份抄本。不需要则留空。', ja: '抄本を何通受け取るか数字で書きます。不要なら空欄にします。', vi: 'Số bản trích lục cần lấy. Không cần thì để trống.' }, area: { x: 230, y: 772, w: 60, h: 64 }, badgeAt: { x: 210, y: 817 }, part: { box: { x: 248, y: 807, w: 22, h: 20, align: 'center' }, inputMode: 'numeric', placeholder: '1' } }),
  {
    id: 'chobonItems', section: 'content', page: 2, koLabel: '초본 교부 1~9 [ ]포함',
    label: { ko: '초본에 넣을 사항', en: 'Items in the individual abstract', zh: '抄本包含的事项', ja: '抄本に含める事項', vi: 'Nội dung trong bản trích lục' },
    help: { ...ITEM_HELP(CHOBON), ko: ITEM_HELP(CHOBON).ko + ' 「3. 세대주의 성명과 관계」「8. 병역 사항」은 본인·위임받은 사람 등 정해진 사람만 고를 수 있어요.', en: ITEM_HELP(CHOBON).en + ' Items 3 and 8 (military service) may be chosen only by certain people such as the person themself or their delegate.', zh: ITEM_HELP(CHOBON).zh + '“3. 户主姓名及关系”“8. 兵役事项”仅限本人、受托人等规定人员选择。', ja: ITEM_HELP(CHOBON).ja + '「3. 世帯主の氏名と関係」「8. 兵役事項」は本人や委任を受けた人など決められた人だけが選べます。', vi: ITEM_HELP(CHOBON).vi + ' Mục 3 và mục 8 (nghĩa vụ quân sự) chỉ một số người như chính chủ hoặc người được ủy quyền mới được chọn.' },
    area: { x: 323, y: 640, w: 783, h: 300 }, badgeAt: { x: 1128, y: 672 },
    input: {
      kind: 'choice', mark: 'check', multiple: true,
      options: [
        inc('personal', '1 개인 인적 사항 변경 내용', { ko: '1. 개인 인적 사항 변경 내용', en: '1. Changes in personal details', zh: '1. 个人信息变更内容', ja: '1. 個人の人的事項の変更内容', vi: '1. Thay đổi thông tin cá nhân' }, 970, 672),
        inc('addrAll', '2 과거의 주소 변동 사항: 전체 포함', { ko: '2. 과거 주소 변동: 전체', en: '2. Past address changes: all', zh: '2. 过去的地址变动：全部', ja: '2. 過去の住所変動：全部', vi: '2. Thay đổi địa chỉ trước đây: tất cả' }, 717, 713),
        inc('addrRecent', '2 과거의 주소 변동 사항: 직접 입력', { ko: '2. 과거 주소 변동: 최근 몇 년만', en: '2. Past address changes: recent years only', zh: '2. 过去的地址变动：仅最近几年', ja: '2. 過去の住所変動：直近の年数のみ', vi: '2. Thay đổi địa chỉ: chỉ vài năm gần đây' }, 853, 713),
        inc('headInPast', '3 과거의 주소 변동 사항 중 세대주의 성명과 세대주와의 관계', { ko: '3. 과거 주소 변동 중 세대주 이름·관계', en: '3. Head of household and relationship in past addresses', zh: '3. 过去地址变动中户主姓名及关系', ja: '3. 過去の住所変動中の世帯主の氏名と関係', vi: '3. Tên chủ hộ và quan hệ trong các địa chỉ trước' }, 970, 757),
        inc('idBack', '4 주민등록번호 뒷자리', { ko: '4. 주민등록번호 뒷자리', en: '4. Last digits of the registration number', zh: '4. 居民登录号后几位', ja: '4. 住民登録番号の後半', vi: '4. Các số sau của số đăng ký' }, 907, 785),
        inc('head', '5 세대주의 성명과 세대주와의 관계', { ko: '5. 세대주 이름과 관계', en: '5. Head of household and relationship', zh: '5. 户主姓名及关系', ja: '5. 世帯主の氏名と関係', vi: '5. Tên chủ hộ và quan hệ' }, 905, 810),
        inc('dates', '6 발생일 / 신고일', { ko: '6. 발생일 / 신고일', en: '6. Date of event / report', zh: '6. 发生日 / 申报日', ja: '6. 発生日／届出日', vi: '6. Ngày phát sinh / khai báo' }, 905, 838),
        inc('changeReason', '7 변동 사유', { ko: '7. 변동 사유', en: '7. Reason for change', zh: '7. 变动原因', ja: '7. 変動事由', vi: '7. Lý do thay đổi' }, 907, 865),
        inc('military', '8 병역 사항', { ko: '8. 병역 사항', en: '8. Military service', zh: '8. 兵役事项', ja: '8. 兵役事項', vi: '8. Nghĩa vụ quân sự' }, 607, 893),
        inc('militaryBasic', '8 병역 사항: 기본', { ko: '└ 8. 기본 (입영/전역일자)', en: '└ 8. basic (enlistment / discharge dates)', zh: '└ 8. 基本（入伍/退伍日期）', ja: '└ 8. 基本（入営／除隊日）', vi: '└ 8. cơ bản (ngày nhập ngũ / xuất ngũ)' }, 690, 891),
        inc('militaryAll', '8 병역 사항: 전체', { ko: '└ 8. 전체', en: '└ 8. all', zh: '└ 8. 全部', ja: '└ 8. 全部', vi: '└ 8. tất cả' }, 904, 891),
        inc('foreignNo', '9 국내거소신고번호 / 외국인등록번호', { ko: '9. 국내거소신고번호 / 외국인등록번호', en: '9. Domestic residence / alien registration number', zh: '9. 国内居所申报号 / 外国人登录号', ja: '9. 国内居所申告番号／外国人登録番号', vi: '9. Số khai báo cư trú / số đăng ký người nước ngoài' }, 775, 939),
      ],
      extra: { key: 'years', when: ['addrRecent'], box: { x: 1006, y: 700, w: 24, h: 22, align: 'center' }, inputMode: 'numeric', label: { ko: '최근 몇 년', en: 'How many recent years', zh: '最近几年', ja: '直近何年', vi: 'Bao nhiêu năm gần đây' }, placeholder: '5' },
    },
  },
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
  {
    id: 'officialCheck', section: 'consent', page: 2, koLabel: '담당 공무원 확인사항 [ ]1 [ ]2 [ ]3',
    label: { ko: '담당 공무원이 확인할 서류', en: 'Documents the official may check', zh: '由负责公务员核查的材料', ja: '担当公務員が確認する書類', vi: 'Giấy tờ để cán bộ kiểm tra' },
    help: { ko: '담당 공무원이 전산으로 확인하는 데 동의하는 서류를 골라요. 동의하지 않은 서류는 직접 내야 해요.', en: 'Choose the documents you agree the official checks electronically. Documents you do not agree to must be submitted yourself.', zh: '选择同意由负责公务员电子核查的材料。不同意的材料须亲自提交。', ja: '担当公務員が電子的に確認することに同意する書類を選びます。同意しない書類は自分で提出します。', vi: 'Chọn giấy tờ đồng ý để cán bộ kiểm tra qua hệ thống. Giấy tờ không đồng ý thì phải tự nộp.' },
    area: { x: 228, y: 1140, w: 878, h: 145 }, badgeAt: { x: 1128, y: 1151 },
    input: {
      kind: 'choice', mark: 'check', multiple: true,
      options: [
        opt('idDocs', '1', { ko: '1. 신청에 필요한 신분증명서와 증명서류', en: '1. ID and supporting documents needed for the application', zh: '1. 申请所需身份证明及证明材料', ja: '1. 申請に必要な身分証明書と証明書類', vi: '1. Giấy tờ tùy thân và giấy tờ chứng minh cần thiết' }, 257, 1151),
        opt('benefit', '2', { ko: '2. 수급자·유공자·한부모가족 등 정보', en: '2. Information on benefit recipients, persons of merit, single-parent families, etc.', zh: '2. 受助者·有功者·单亲家庭等信息', ja: '2. 受給者・有功者・ひとり親家庭などの情報', vi: '2. Thông tin người nhận trợ cấp, người có công, gia đình đơn thân...' }, 256, 1187),
        opt('family', '3', { ko: '3. 신청인의 가족관계증명서(상세)', en: "3. Applicant's family relation certificate (detailed)", zh: '3. 申请人的家族关系证明书（详细）', ja: '3. 申請人の家族関係証明書（詳細）', vi: '3. Giấy chứng nhận quan hệ gia đình (chi tiết) của người nộp' }, 255, 1268),
      ],
    },
  },
  {
    id: 'infoConsent', section: 'consent', page: 2, koLabel: '본인정보 공동이용 및 행정정보 공동이용 동의서 [ ]1 [ ]2',
    label: { ko: '정보 공동이용 동의', en: 'Consent to share information', zh: '同意信息共同利用', ja: '情報の共同利用への同意', vi: 'Đồng ý dùng chung thông tin' },
    help: { ko: '위 서류를 전산으로 확인하는 방식에 동의하면 해당 번호를 골라요. 서명은 출력한 종이에 직접 해요.', en: 'Tick the items if you agree to the electronic checking above. Sign by hand on the printed paper.', zh: '同意以上电子核查方式时，勾选相应项。签名请在打印出的纸上亲自完成。', ja: '上記の書類を電子的に確認する方法に同意する場合、該当番号を選びます。署名は印刷した紙に直接します。', vi: 'Chọn các mục nếu đồng ý cách kiểm tra điện tử ở trên. Ký trực tiếp trên giấy đã in.' },
    area: { x: 90, y: 1455, w: 1016, h: 60 }, badgeAt: { x: 76, y: 1484 },
    input: {
      kind: 'choice', mark: 'check', multiple: true,
      options: [
        opt('provide', '1', { ko: '1. 본인정보 제공 요구를 통한 전자적 확인에 동의', en: '1. Agree to electronic checking through a request for one’s own information', zh: '1. 同意通过本人信息提供要求进行电子核查', ja: '1. 本人情報提供要求による電子的確認に同意', vi: '1. Đồng ý kiểm tra điện tử qua yêu cầu cung cấp thông tin cá nhân' }, 112, 1466),
        opt('share', '2', { ko: '2. 행정정보 공동이용을 통한 확인에 동의', en: '2. Agree to checking through shared administrative information', zh: '2. 同意通过行政信息共同利用进行核查', ja: '2. 行政情報の共同利用による確認に同意', vi: '2. Đồng ý kiểm tra qua dùng chung thông tin hành chính' }, 112, 1502),
      ],
    },
  },
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
