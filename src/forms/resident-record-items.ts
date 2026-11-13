import { opt, textField } from './common';
import { Box, ChoiceOption, FieldDef, L, Point } from './types';

// ─────────────────────────────────────────────────────────────
// 주민등록표 열람·등초본 교부 신청서(31번)와 위임용(34번)이 함께 쓰는 칸.
// 두 서식의 「포함」 목록·확인사항·동의서 문구는 같고 자리만 다르므로 좌표(Spot)만 넘겨받는다.
// ─────────────────────────────────────────────────────────────

export interface Spot {
  section: string;
  page?: number;
  area: Box;
  badgeAt: Point;
  /** [ ] 자리 (서식에 인쇄된 순서대로) */
  pts?: [number, number][];
  /** 「최근 __년」 빈칸 */
  years?: Box;
  /** 「( )통」 빈칸 */
  box?: Box;
  help?: L;
}

/** 포함 [ ] 목록 (여러 개 고르기) */
const inc = (value: string, ko: string, label: L, x: number, y: number): ChoiceOption => opt(value, ko, label, x, y);

export const ITEM_HELP = (what: L): L => ({
  ko: `${what.ko}에 넣고 싶은 사항을 모두 골라요. 고르지 않으면 성명·생년월일·주소 같은 기본 사항만 나와요. 「과거의 주소 변동 사항」을 직접 입력으로 고르면 1년 단위로 적어요.`,
  en: `Choose everything you want included in the ${what.en}. If you choose nothing, only basic items such as name, date of birth and address are shown. For past address changes by "direct input", write the period in whole years.`,
  zh: `选择希望${what.zh}中包含的所有事项。不选择时只提供姓名、出生日期、地址等基本事项。“过去的地址变动事项”选择直接输入时，以1年为单位填写。`,
  ja: `${what.ja}に含めたい事項をすべて選びます。選ばなければ氏名・生年月日・住所などの基本事項だけが出ます。「過去の住所変動事項」を直接入力にした場合は1年単位で書きます。`,
  vi: `Chọn tất cả nội dung muốn có trong ${what.vi}. Nếu không chọn, chỉ có thông tin cơ bản như họ tên, ngày sinh, địa chỉ. Nếu chọn nhập trực tiếp phần thay đổi địa chỉ trước đây, ghi theo đơn vị năm.`,
});
const DEUNGBON: L = { ko: '등본', en: 'certified copy (household)', zh: '誊本', ja: '謄本', vi: 'bản sao hộ khẩu' };
const CHOBON: L = { ko: '초본', en: 'abstract (individual)', zh: '抄本', ja: '抄本', vi: 'bản trích lục cá nhân' };

/** 31번 2쪽 유의 사항 7 — 초본 3·8번은 정해진 사람만 */
export const CHOBON_HELP_RESTRICTED: L = { ...ITEM_HELP(CHOBON), ko: ITEM_HELP(CHOBON).ko + ' 「3. 세대주의 성명과 관계」「8. 병역 사항」은 본인·위임받은 사람 등 정해진 사람만 고를 수 있어요.', en: ITEM_HELP(CHOBON).en + ' Items 3 and 8 (military service) may be chosen only by certain people such as the person themself or their delegate.', zh: ITEM_HELP(CHOBON).zh + '“3. 户主姓名及关系”“8. 兵役事项”仅限本人、受托人等规定人员选择。', ja: ITEM_HELP(CHOBON).ja + '「3. 世帯主の氏名と関係」「8. 兵役事項」は本人や委任を受けた人など決められた人だけが選べます。', vi: ITEM_HELP(CHOBON).vi + ' Mục 3 và mục 8 (nghĩa vụ quân sự) chỉ một số người như chính chủ hoặc người được ủy quyền mới được chọn.' };

export const feeExemptField = (c: Spot & { pts: [number, number][] }): FieldDef => ({
  id: 'feeExempt', section: c.section, page: c.page, koLabel: '[ ] 수수료 면제를 신청함',
  label: { ko: '수수료 면제 신청', en: 'Apply for fee exemption', zh: '申请免除手续费', ja: '手数料免除の申請', vi: 'Xin miễn lệ phí' },
  help: { ko: '수수료 면제 대상(국민기초생활보장법에 따른 수급자, 독립유공자·국가유공자 등과 그 유족, 한부모가족 지원대상자, 미성년 자녀 2명 이상을 키우는 사람 등 유의 사항에 적힌 사람)이면 골라요.', en: 'Tick if you are eligible for fee exemption (e.g., basic livelihood recipients, persons of national merit and their bereaved families, single-parent family support recipients, people raising 2 or more minor children — as listed in the notes).', zh: '如属于免除手续费对象（基本生活保障受助者、独立·国家有功者及遗属、单亲家庭支援对象、抚养2名以上未成年子女者等注意事项所列人员），请勾选。', ja: '手数料免除の対象（基礎生活保障の受給者、独立・国家有功者とその遺族、ひとり親家庭支援対象者、未成年の子を2人以上養育する人など、注意事項に記載の人）であれば選びます。', vi: 'Chọn nếu thuộc đối tượng miễn lệ phí (người nhận trợ cấp sinh hoạt cơ bản, người có công và gia đình, đối tượng hỗ trợ gia đình đơn thân, người nuôi từ 2 con chưa thành niên... như ghi trong phần lưu ý).' },
  area: c.area, badgeAt: c.badgeAt,
  input: { kind: 'choice', mark: 'check', options: [opt('yes', '수수료 면제를 신청함', { ko: '수수료 면제를 신청해요', en: 'Apply for exemption', zh: '申请免除', ja: '免除を申請する', vi: 'Xin miễn' }, ...c.pts[0])] },
});

export const viewField = (c: Spot & { pts: [number, number][] }): FieldDef => ({
  id: 'view', section: c.section, page: c.page, koLabel: '열람 [ ]등본 사항 [ ]초본 사항',
  label: { ko: '열람 (화면으로 보기)', en: 'Viewing', zh: '查阅', ja: '閲覧', vi: 'Xem hồ sơ' },
  help: { ko: '종이로 받지 않고 화면으로 보기만 할 때 골라요.', en: 'Choose if you only want to view the record, not receive a copy.', zh: '只查看而不领取纸本时选择。', ja: '紙で受け取らず閲覧だけする場合に選びます。', vi: 'Chọn nếu chỉ muốn xem, không nhận bản giấy.' },
  area: c.area, badgeAt: c.badgeAt,
  input: { kind: 'choice', mark: 'check', multiple: true, options: [opt('deungbon', '등본 사항', { ko: '등본 사항', en: 'Household copy items', zh: '誊本事项', ja: '謄本事項', vi: 'Nội dung bản sao hộ khẩu' }, ...c.pts[0]), opt('chobon', '초본 사항', { ko: '초본 사항', en: 'Individual abstract items', zh: '抄本事项', ja: '抄本事項', vi: 'Nội dung bản trích lục' }, ...c.pts[1])] },
});

export const allItemsField = (c: Spot & { pts: [number, number][] }): FieldDef => ({
  id: 'allItems', section: c.section, page: c.page, koLabel: '[ ]등본 사항 전부 포함 [ ]초본 사항 전부 포함',
  label: { ko: '모든 사항 포함', en: 'Include everything', zh: '包含全部事项', ja: 'すべての事項を含める', vi: 'Bao gồm tất cả' },
  help: { ko: '개인정보 보호를 위해 필요한 사항만 골라 신청할 수 있어요. 전부 넣으려면 여기서 골라요.', en: 'To protect privacy you may choose only the items you need. Tick here to include everything.', zh: '为保护个人信息，可以只选择需要的事项。如需全部包含，请在此选择。', ja: '個人情報保護のため必要な事項だけ選んで申請できます。すべて含める場合はここで選びます。', vi: 'Để bảo vệ thông tin cá nhân, có thể chỉ chọn nội dung cần thiết. Muốn có tất cả thì chọn ở đây.' },
  area: c.area, badgeAt: c.badgeAt,
  input: { kind: 'choice', mark: 'check', multiple: true, options: [opt('deungbon', '등본 사항 전부 포함', { ko: '등본 사항 전부', en: 'All household copy items', zh: '全部誊本事项', ja: '謄本事項すべて', vi: 'Toàn bộ nội dung bản sao' }, ...c.pts[0]), opt('chobon', '초본 사항 전부 포함', { ko: '초본 사항 전부', en: 'All abstract items', zh: '全部抄本事项', ja: '抄本事項すべて', vi: 'Toàn bộ nội dung trích lục' }, ...c.pts[1])] },
});

export const deungbonCountField = (c: Spot & { box: Box }): FieldDef => textField({ id: 'deungbonCount', section: c.section, page: c.page, koLabel: '등본 교부 [ ]통', label: { ko: '등본 몇 통', en: 'Copies of the household record', zh: '誊本份数', ja: '謄本の通数', vi: 'Số bản sao hộ khẩu' }, help: { ko: '등본을 몇 통 받을지 숫자로 적어요. 등본이 필요 없으면 비워 둬요.', en: 'How many household copies you need (number). Leave blank if none.', zh: '用数字填写要领取几份誊本。不需要则留空。', ja: '謄本を何通受け取るか数字で書きます。不要なら空欄にします。', vi: 'Số bản sao hộ khẩu cần lấy. Không cần thì để trống.' }, area: c.area, badgeAt: c.badgeAt, part: { box: c.box, inputMode: 'numeric', placeholder: '1' } });

export const deungbonItemsField = (c: Spot & { pts: [number, number][]; years: Box }): FieldDef => ({
  id: 'deungbonItems', section: c.section, page: c.page, koLabel: '등본 교부 1~9 [ ]포함',
  label: { ko: '등본에 넣을 사항', en: 'Items in the household copy', zh: '誊本包含的事项', ja: '謄本に含める事項', vi: 'Nội dung trong bản sao hộ khẩu' },
  help: ITEM_HELP(DEUNGBON),
  area: c.area, badgeAt: c.badgeAt,
  input: {
    kind: 'choice', mark: 'check', multiple: true,
    options: [
      inc('addrAll', '1 과거의 주소 변동 사항: 전체 포함', { ko: '1. 과거 주소 변동: 전체', en: '1. Past address changes: all', zh: '1. 过去的地址变动：全部', ja: '1. 過去の住所変動：全部', vi: '1. Thay đổi địa chỉ trước đây: tất cả' }, ...c.pts[0]),
      inc('addrRecent', '1 과거의 주소 변동 사항: 직접 입력', { ko: '1. 과거 주소 변동: 최근 몇 년만', en: '1. Past address changes: recent years only', zh: '1. 过去的地址变动：仅最近几年', ja: '1. 過去の住所変動：直近の年数のみ', vi: '1. Thay đổi địa chỉ: chỉ vài năm gần đây' }, ...c.pts[1]),
      inc('reason', '2 세대 구성 사유', { ko: '2. 세대 구성 사유', en: '2. Reason for household composition', zh: '2. 户籍构成原因', ja: '2. 世帯構成の事由', vi: '2. Lý do lập hộ' }, ...c.pts[2]),
      inc('formed', '3 세대 구성 일자', { ko: '3. 세대 구성 일자', en: '3. Date the household was formed', zh: '3. 户籍构成日期', ja: '3. 世帯構成の日付', vi: '3. Ngày lập hộ' }, ...c.pts[3]),
      inc('dates', '4 발생일 / 신고일', { ko: '4. 발생일 / 신고일', en: '4. Date of event / report', zh: '4. 发生日 / 申报日', ja: '4. 発生日／届出日', vi: '4. Ngày phát sinh / khai báo' }, ...c.pts[4]),
      inc('changeReason', '5 변동 사유', { ko: '5. 변동 사유', en: '5. Reason for change', zh: '5. 变动原因', ja: '5. 変動事由', vi: '5. Lý do thay đổi' }, ...c.pts[5]),
      inc('changeHousehold', '5 변동 사유: 세대', { ko: '└ 5. 세대', en: '└ 5. household', zh: '└ 5. 户', ja: '└ 5. 世帯', vi: '└ 5. hộ' }, ...c.pts[6]),
      inc('changeMember', '5 변동 사유: 세대원', { ko: '└ 5. 세대원', en: '└ 5. household members', zh: '└ 5. 户内成员', ja: '└ 5. 世帯員', vi: '└ 5. thành viên hộ' }, ...c.pts[7]),
      inc('others', '6 교부 대상자 외 세대주·세대원·외국인등의 이름', { ko: '6. 대상자 외 세대주·세대원·외국인 등 이름', en: '6. Names of the head, members and foreigners other than the person', zh: '6. 对象人以外的户主·成员·外国人等姓名', ja: '6. 対象者以外の世帯主・世帯員・外国人等の氏名', vi: '6. Tên chủ hộ, thành viên, người nước ngoài khác' }, ...c.pts[8]),
      inc('idBack', '7 주민등록번호 뒷자리', { ko: '7. 주민등록번호 뒷자리', en: '7. Last digits of registration numbers', zh: '7. 居民登录号后几位', ja: '7. 住民登録番号の後半', vi: '7. Các số sau của số đăng ký' }, ...c.pts[9]),
      inc('idBackSelf', '7 주민등록번호 뒷자리: 본인', { ko: '└ 7. 본인', en: '└ 7. self', zh: '└ 7. 本人', ja: '└ 7. 本人', vi: '└ 7. bản thân' }, ...c.pts[10]),
      inc('idBackMember', '7 주민등록번호 뒷자리: 세대원', { ko: '└ 7. 세대원', en: '└ 7. household members', zh: '└ 7. 户内成员', ja: '└ 7. 世帯員', vi: '└ 7. thành viên hộ' }, ...c.pts[11]),
      inc('relation', '8 세대원의 세대주와의 관계', { ko: '8. 세대원과 세대주의 관계', en: "8. Members' relationship to the head", zh: '8. 成员与户主的关系', ja: '8. 世帯員と世帯主の関係', vi: '8. Quan hệ của thành viên với chủ hộ' }, ...c.pts[12]),
      inc('cohabitant', '9 동거인', { ko: '9. 동거인', en: '9. Cohabitants', zh: '9. 同住人', ja: '9. 同居人', vi: '9. Người sống cùng' }, ...c.pts[13]),
    ],
    extra: { key: 'years', when: ['addrRecent'], box: c.years, inputMode: 'numeric', label: { ko: '최근 몇 년', en: 'How many recent years', zh: '最近几年', ja: '直近何年', vi: 'Bao nhiêu năm gần đây' }, placeholder: '5' },
  },
});

export const chobonCountField = (c: Spot & { box: Box }): FieldDef => textField({ id: 'chobonCount', section: c.section, page: c.page, koLabel: '초본 교부 [ ]통', label: { ko: '초본 몇 통', en: 'Copies of the individual abstract', zh: '抄本份数', ja: '抄本の通数', vi: 'Số bản trích lục' }, help: { ko: '초본을 몇 통 받을지 숫자로 적어요. 초본이 필요 없으면 비워 둬요.', en: 'How many abstracts you need (number). Leave blank if none.', zh: '用数字填写要领取几份抄本。不需要则留空。', ja: '抄本を何通受け取るか数字で書きます。不要なら空欄にします。', vi: 'Số bản trích lục cần lấy. Không cần thì để trống.' }, area: c.area, badgeAt: c.badgeAt, part: { box: c.box, inputMode: 'numeric', placeholder: '1' } });

export const chobonItemsField = (c: Spot & { pts: [number, number][]; years: Box }): FieldDef => ({
  id: 'chobonItems', section: c.section, page: c.page, koLabel: '초본 교부 1~9 [ ]포함',
  label: { ko: '초본에 넣을 사항', en: 'Items in the individual abstract', zh: '抄本包含的事项', ja: '抄本に含める事項', vi: 'Nội dung trong bản trích lục' },
  help: c.help ?? ITEM_HELP(CHOBON),
  area: c.area, badgeAt: c.badgeAt,
  input: {
    kind: 'choice', mark: 'check', multiple: true,
    options: [
      inc('personal', '1 개인 인적 사항 변경 내용', { ko: '1. 개인 인적 사항 변경 내용', en: '1. Changes in personal details', zh: '1. 个人信息变更内容', ja: '1. 個人の人的事項の変更内容', vi: '1. Thay đổi thông tin cá nhân' }, ...c.pts[0]),
      inc('addrAll', '2 과거의 주소 변동 사항: 전체 포함', { ko: '2. 과거 주소 변동: 전체', en: '2. Past address changes: all', zh: '2. 过去的地址变动：全部', ja: '2. 過去の住所変動：全部', vi: '2. Thay đổi địa chỉ trước đây: tất cả' }, ...c.pts[1]),
      inc('addrRecent', '2 과거의 주소 변동 사항: 직접 입력', { ko: '2. 과거 주소 변동: 최근 몇 년만', en: '2. Past address changes: recent years only', zh: '2. 过去的地址变动：仅最近几年', ja: '2. 過去の住所変動：直近の年数のみ', vi: '2. Thay đổi địa chỉ: chỉ vài năm gần đây' }, ...c.pts[2]),
      inc('headInPast', '3 과거의 주소 변동 사항 중 세대주의 성명과 세대주와의 관계', { ko: '3. 과거 주소 변동 중 세대주 이름·관계', en: '3. Head of household and relationship in past addresses', zh: '3. 过去地址变动中户主姓名及关系', ja: '3. 過去の住所変動中の世帯主の氏名と関係', vi: '3. Tên chủ hộ và quan hệ trong các địa chỉ trước' }, ...c.pts[3]),
      inc('idBack', '4 주민등록번호 뒷자리', { ko: '4. 주민등록번호 뒷자리', en: '4. Last digits of the registration number', zh: '4. 居民登录号后几位', ja: '4. 住民登録番号の後半', vi: '4. Các số sau của số đăng ký' }, ...c.pts[4]),
      inc('head', '5 세대주의 성명과 세대주와의 관계', { ko: '5. 세대주 이름과 관계', en: '5. Head of household and relationship', zh: '5. 户主姓名及关系', ja: '5. 世帯主の氏名と関係', vi: '5. Tên chủ hộ và quan hệ' }, ...c.pts[5]),
      inc('dates', '6 발생일 / 신고일', { ko: '6. 발생일 / 신고일', en: '6. Date of event / report', zh: '6. 发生日 / 申报日', ja: '6. 発生日／届出日', vi: '6. Ngày phát sinh / khai báo' }, ...c.pts[6]),
      inc('changeReason', '7 변동 사유', { ko: '7. 변동 사유', en: '7. Reason for change', zh: '7. 变动原因', ja: '7. 変動事由', vi: '7. Lý do thay đổi' }, ...c.pts[7]),
      inc('military', '8 병역 사항', { ko: '8. 병역 사항', en: '8. Military service', zh: '8. 兵役事项', ja: '8. 兵役事項', vi: '8. Nghĩa vụ quân sự' }, ...c.pts[8]),
      inc('militaryBasic', '8 병역 사항: 기본', { ko: '└ 8. 기본 (입영/전역일자)', en: '└ 8. basic (enlistment / discharge dates)', zh: '└ 8. 基本（入伍/退伍日期）', ja: '└ 8. 基本（入営／除隊日）', vi: '└ 8. cơ bản (ngày nhập ngũ / xuất ngũ)' }, ...c.pts[9]),
      inc('militaryAll', '8 병역 사항: 전체', { ko: '└ 8. 전체', en: '└ 8. all', zh: '└ 8. 全部', ja: '└ 8. 全部', vi: '└ 8. tất cả' }, ...c.pts[10]),
      inc('foreignNo', '9 국내거소신고번호 / 외국인등록번호', { ko: '9. 국내거소신고번호 / 외국인등록번호', en: '9. Domestic residence / alien registration number', zh: '9. 国内居所申报号 / 外国人登录号', ja: '9. 国内居所申告番号／外国人登録番号', vi: '9. Số khai báo cư trú / số đăng ký người nước ngoài' }, ...c.pts[11]),
    ],
    extra: { key: 'years', when: ['addrRecent'], box: c.years, inputMode: 'numeric', label: { ko: '최근 몇 년', en: 'How many recent years', zh: '最近几年', ja: '直近何年', vi: 'Bao nhiêu năm gần đây' }, placeholder: '5' },
  },
});

export const officialCheckField = (c: Spot & { pts: [number, number][] }): FieldDef => ({
  id: 'officialCheck', section: c.section, page: c.page, koLabel: '담당 공무원 확인사항 [ ]1 [ ]2 [ ]3',
  label: { ko: '담당 공무원이 확인할 서류', en: 'Documents the official may check', zh: '由负责公务员核查的材料', ja: '担当公務員が確認する書類', vi: 'Giấy tờ để cán bộ kiểm tra' },
  help: { ko: '담당 공무원이 전산으로 확인하는 데 동의하는 서류를 골라요. 동의하지 않은 서류는 직접 내야 해요.', en: 'Choose the documents you agree the official checks electronically. Documents you do not agree to must be submitted yourself.', zh: '选择同意由负责公务员电子核查的材料。不同意的材料须亲自提交。', ja: '担当公務員が電子的に確認することに同意する書類を選びます。同意しない書類は自分で提出します。', vi: 'Chọn giấy tờ đồng ý để cán bộ kiểm tra qua hệ thống. Giấy tờ không đồng ý thì phải tự nộp.' },
  area: c.area, badgeAt: c.badgeAt,
  input: {
    kind: 'choice', mark: 'check', multiple: true,
    options: [
      opt('idDocs', '1', { ko: '1. 신청에 필요한 신분증명서와 증명서류', en: '1. ID and supporting documents needed for the application', zh: '1. 申请所需身份证明及证明材料', ja: '1. 申請に必要な身分証明書と証明書類', vi: '1. Giấy tờ tùy thân và giấy tờ chứng minh cần thiết' }, ...c.pts[0]),
      opt('benefit', '2', { ko: '2. 수급자·유공자·한부모가족 등 정보', en: '2. Information on benefit recipients, persons of merit, single-parent families, etc.', zh: '2. 受助者·有功者·单亲家庭等信息', ja: '2. 受給者・有功者・ひとり親家庭などの情報', vi: '2. Thông tin người nhận trợ cấp, người có công, gia đình đơn thân...' }, ...c.pts[1]),
      opt('family', '3', { ko: '3. 신청인의 가족관계증명서(상세)', en: "3. Applicant's family relation certificate (detailed)", zh: '3. 申请人的家族关系证明书（详细）', ja: '3. 申請人の家族関係証明書（詳細）', vi: '3. Giấy chứng nhận quan hệ gia đình (chi tiết) của người nộp' }, ...c.pts[2]),
    ],
  },
});

export const infoConsentField = (c: Spot & { pts: [number, number][] }): FieldDef => ({
  id: 'infoConsent', section: c.section, page: c.page, koLabel: '본인정보 공동이용 및 행정정보 공동이용 동의서 [ ]1 [ ]2',
  label: { ko: '정보 공동이용 동의', en: 'Consent to share information', zh: '同意信息共同利用', ja: '情報の共同利用への同意', vi: 'Đồng ý dùng chung thông tin' },
  help: { ko: '위 서류를 전산으로 확인하는 방식에 동의하면 해당 번호를 골라요. 서명은 출력한 종이에 직접 해요.', en: 'Tick the items if you agree to the electronic checking above. Sign by hand on the printed paper.', zh: '同意以上电子核查方式时，勾选相应项。签名请在打印出的纸上亲自完成。', ja: '上記の書類を電子的に確認する方法に同意する場合、該当番号を選びます。署名は印刷した紙に直接します。', vi: 'Chọn các mục nếu đồng ý cách kiểm tra điện tử ở trên. Ký trực tiếp trên giấy đã in.' },
  area: c.area, badgeAt: c.badgeAt,
  input: {
    kind: 'choice', mark: 'check', multiple: true,
    options: [
      opt('provide', '1', { ko: '1. 본인정보 제공 요구를 통한 전자적 확인에 동의', en: '1. Agree to electronic checking through a request for one’s own information', zh: '1. 同意通过本人信息提供要求进行电子核查', ja: '1. 本人情報提供要求による電子的確認に同意', vi: '1. Đồng ý kiểm tra điện tử qua yêu cầu cung cấp thông tin cá nhân' }, ...c.pts[0]),
      opt('share', '2', { ko: '2. 행정정보 공동이용을 통한 확인에 동의', en: '2. Agree to checking through shared administrative information', zh: '2. 同意通过行政信息共同利用进行核查', ja: '2. 行政情報の共同利用による確認に同意', vi: '2. Đồng ý kiểm tra qua dùng chung thông tin hành chính' }, ...c.pts[1]),
    ],
  },
});

