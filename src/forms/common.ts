import { Box, ChoiceOption, CopySource, FieldDef, L, Part } from './types';

// ─────────────────────────────────────────────────────────────
// 여러 서식이 같이 쓰는 칸 만들기
// 좌표는 각 서식 파일에서 원본 이미지를 재서 넘긴다.
// 안내 문구는 가족관계등록 신고서들의 「작성방법」에 공통으로 적힌 내용만 담는다.
// ─────────────────────────────────────────────────────────────

/** 칸 안쪽 상자 — 왼쪽은 번호 토글(지름 32px) 자리를 비운다 */
export const inner = (a: Box, o: { l?: number; r?: number; t?: number; b?: number; align?: Box['align'] } = {}): Box => {
  const l = o.l ?? 36;
  const r = o.r ?? 6;
  const t = o.t ?? 3;
  const b = o.b ?? 3;
  return { x: a.x + l, y: a.y + t, w: a.w - l - r, h: a.h - t - b, align: o.align ?? 'center' };
};

// ── 사람 (안내 문구에 끼워 넣는 말) ─────────────────────────
export type Who = L;

export const WHO = {
  reporter: { ko: '신고인', en: 'the person reporting', zh: '申报人', ja: '届出人', vi: 'người khai báo' },
  submitter: { ko: '제출인', en: 'the submitter', zh: '提交人', ja: '提出人', vi: 'người nộp thay' },
  father: { ko: '아버지', en: 'the father', zh: '父亲', ja: '父', vi: 'bố' },
  mother: { ko: '어머니', en: 'the mother', zh: '母亲', ja: '母', vi: 'mẹ' },
  guardian: { ko: '성년후견인', en: 'the adult guardian', zh: '成年监护人', ja: '成年後見人', vi: 'người giám hộ người thành niên' },
  adoptiveFather: { ko: '양부(양아버지)', en: 'the adoptive father', zh: '养父', ja: '養父', vi: 'cha nuôi' },
  adoptiveMother: { ko: '양모(양어머니)', en: 'the adoptive mother', zh: '养母', ja: '養母', vi: 'mẹ nuôi' },
  adoptee: { ko: '양자', en: 'the adopted child', zh: '养子女', ja: '養子', vi: 'con nuôi' },
  birthFather: { ko: '양자의 친아버지', en: "the adoptee's birth father", zh: '养子女的生父', ja: '養子の実父', vi: 'cha ruột của con nuôi' },
  birthMother: { ko: '양자의 친어머니', en: "the adoptee's birth mother", zh: '养子女的生母', ja: '養子の実母', vi: 'mẹ ruột của con nuôi' },
  consentingGuardian: { ko: '동의하는 성년후견인', en: 'the consenting adult guardian', zh: '表示同意的成年监护人', ja: '同意する成年後見人', vi: 'người giám hộ người thành niên đồng ý' },
} satisfies Record<string, Who>;

export const nameLabel = (who: Who): L => ({
  ko: `${who.ko} 이름`,
  en: `Name of ${who.en}`,
  zh: `${who.zh}姓名`,
  ja: `${who.ja}の氏名`,
  vi: `Họ tên ${who.vi}`,
});

export const idLabel = (who: Who): L => ({
  ko: `${who.ko} 주민등록번호 / 외국인등록번호`,
  en: `Resident / alien registration no. of ${who.en}`,
  zh: `${who.zh}居民登录号 / 外国人登录号`,
  ja: `${who.ja}の住民登録番号／外国人登録番号`,
  vi: `Số đăng ký cư trú / người nước ngoài của ${who.vi}`,
});

// ── 공통 안내 ───────────────────────────────────────────────

/** 작성방법: 주민등록번호 — 외국인은 외국인등록번호(국내거소신고번호 또는 출생연월일) */
export const ID_HELP: L = {
  ko: '한국인은 주민등록번호, 외국인은 외국인등록번호(외국인등록증 앞면 13자리)를 적어요. 없으면 국내거소신고번호나 생년월일을 적어요.',
  en: 'Koreans: resident registration number. Foreign nationals: alien registration number (13 digits on the front of the residence card). If you have neither, write your domestic residence report number or date of birth.',
  zh: '韩国人填写居民登录号，外国人填写外国人登录号（外国人登录证正面13位）。若都没有，填写国内居所申报号或出生日期。',
  ja: '韓国人は住民登録番号、外国人は外国人登録番号（外国人登録証表面の13桁）を書きます。ない場合は国内居所申告番号または生年月日を書きます。',
  vi: 'Người Hàn: số đăng ký cư trú. Người nước ngoài: số đăng ký người nước ngoài (13 số ở mặt trước thẻ). Nếu không có, ghi số khai báo cư trú trong nước hoặc ngày sinh.',
};

/** 작성방법: 등록기준지 — 외국인은 그 국적 */
export const ORIGIN_HELP: L = {
  ko: '외국인이면 국적(나라 이름)을 골라요. 한국인이면 가족관계등록부의 등록기준지(옛 본적) 주소를 적어요.',
  en: 'For a foreign national, choose the nationality (country). For a Korean national, write the registration base address (formerly "bonjeok") from the family relation register.',
  zh: '外国人请选择国籍（国家）。韩国人填写家族关系登记簿上的登记基准地（原本籍）地址。',
  ja: '外国人の場合は国籍（国名）を選びます。韓国人の場合は家族関係登録簿の登録基準地（旧本籍）の住所を書きます。',
  vi: 'Nếu là người nước ngoài, chọn quốc tịch (tên nước). Nếu là người Hàn, ghi địa chỉ nơi đăng ký gốc (bản quán cũ) trong sổ đăng ký quan hệ gia đình.',
};

/** 작성방법: 법 제25조제2항 — 주민등록번호를 적었으면 출생연월일은 생략 가능 */
export const BIRTHDATE_HELP: L = {
  ko: '태어난 날짜를 적어요. 주민등록번호(외국인등록번호)를 적었다면 비워 둬도 돼요.',
  en: 'Date of birth. You may leave it blank if you wrote the resident (alien) registration number.',
  zh: '填写出生日期。如已填写居民登录号（外国人登录号），可留空。',
  ja: '生年月日を書きます。住民登録番号（外国人登録番号）を書いた場合は空欄でも構いません。',
  vi: 'Ngày sinh. Có thể để trống nếu đã ghi số đăng ký cư trú (số đăng ký người nước ngoài).',
};

export const HANJA_HELP: L = {
  ko: '한자 이름이 있을 때만 적어요. 없으면 비워 두세요.',
  en: 'Only if there is a name in Chinese characters; otherwise leave it blank.',
  zh: '仅在有汉字姓名时填写，没有可留空。',
  ja: '漢字の氏名がある場合のみ書き、なければ空欄にします。',
  vi: 'Chỉ ghi nếu có tên bằng chữ Hán; nếu không thì để trống.',
};

export const BON_HELP: L = {
  ko: '본(本)은 한국 성씨의 시조 고향이에요(예: 김해, 전주). 한자로 적고, 없거나 모르면 비워 두세요. 외국인은 보통 없어요.',
  en: 'Bon (本) is the ancestral home of a Korean family name (e.g., 金海, 全州). Write it in Chinese characters; leave blank if none or unknown. Foreign nationals usually have none.',
  zh: '本（本贯）是韩国姓氏的祖籍地（例：金海、全州）。用汉字填写，没有或不清楚可留空。外国人一般没有。',
  ja: '本（本貫）は韓国の姓の始祖の出身地です（例：金海、全州）。漢字で書き、ない・分からない場合は空欄にします。外国人には通常ありません。',
  vi: 'Bon (本) là quê gốc của dòng họ Hàn Quốc (VD: 金海, 全州). Ghi bằng chữ Hán; để trống nếu không có hoặc không biết. Người nước ngoài thường không có.',
};

export const ADDRESS_PLACEHOLDER = '예) 서울시 금천구 시흥대로73길 70';
export const NAME_PLACEHOLDER = '예) 응우옌반안';

const ADDRESS_HELP = (who: Who): L => ({
  ko: `${who.ko}의 주소를 한국어로 적어요.`,
  en: `Address of ${who.en}, written in Korean.`,
  zh: `用韩文填写${who.zh}的地址。`,
  ja: `${who.ja}の住所を韓国語で書きます。`,
  vi: `Ghi địa chỉ của ${who.vi} bằng tiếng Hàn.`,
});

const NAME_HELP = (who: Who): L => ({
  ko: `${who.ko}의 이름을 한글로 적어요. 외국인이면 여권·외국인등록증의 이름을 한글로 옮겨 적어요.`,
  en: `Name of ${who.en} in Korean letters (Hangul). For a foreign national, transcribe the name on the passport / residence card into Hangul.`,
  zh: `用韩文填写${who.zh}的姓名。外国人请将护照/外国人登录证上的姓名按发音写成韩文。`,
  ja: `${who.ja}の氏名をハングルで書きます。外国人の場合、パスポート・外国人登録証の氏名をハングル表記で書きます。`,
  vi: `Ghi họ tên của ${who.vi} bằng chữ Hàn (Hangul). Nếu là người nước ngoài, phiên âm tên trên hộ chiếu / thẻ người nước ngoài sang Hangul.`,
});

// ── 가져오기 버튼 ───────────────────────────────────────────

export const copyNameFrom = (field: string, who: Who, map: Record<string, string> = { name: 'name' }): CopySource => ({
  field,
  label: { ko: `${who.ko} 이름 가져오기`, en: `Use name of ${who.en}`, zh: `使用${who.zh}姓名`, ja: `${who.ja}の氏名を使う`, vi: `Dùng tên ${who.vi}` },
  map,
});

export const copyIdFrom = (field: string, who: Who): CopySource => ({
  field,
  label: { ko: `${who.ko} 번호 가져오기`, en: `Use number of ${who.en}`, zh: `使用${who.zh}号码`, ja: `${who.ja}の番号を使う`, vi: `Dùng số của ${who.vi}` },
  map: { front: 'front', back: 'back' },
});

export const copyAddressFrom = (field: string, who: Who): CopySource => ({
  field,
  label: { ko: `${who.ko} 주소와 같아요`, en: `Same address as ${who.en}`, zh: `与${who.zh}地址相同`, ja: `${who.ja}の住所と同じ`, vi: `Cùng địa chỉ với ${who.vi}` },
  map: { address: 'address' },
});

export const copyOriginFrom = (field: string, who: Who): CopySource => ({
  field,
  label: { ko: `${who.ko}와 같아요`, en: `Same as ${who.en}`, zh: `与${who.zh}相同`, ja: `${who.ja}と同じ`, vi: `Giống ${who.vi}` },
  map: { country: 'country', text: 'text' },
});

// ── 칸 만들기 ───────────────────────────────────────────────

interface Base {
  id: string;
  section: string;
  koLabel: string;
  required?: boolean;
  area: Box;
  page?: number;
  badge?: 'margin';
  copyFrom?: CopySource[];
}

/** 신고서 제목 아래 「( 년 월 일)」 */
export const reportDateField = (area: Box, y: Box, m: Box, d: Box): FieldDef => ({
  id: 'reportDate',
  section: 'meta',
  required: true,
  koLabel: '신고일 ( 년 월 일)',
  label: { ko: '신고하는 날짜', en: 'Date of report', zh: '申报日期', ja: '届出日', vi: 'Ngày khai báo' },
  help: {
    ko: '이 신고서를 제출하는 날짜예요. 보통 오늘 날짜를 적어요.',
    en: "The date you submit this report. Usually today's date.",
    zh: '提交本申报书的日期，通常填写今天的日期。',
    ja: 'この届出を提出する日付です。通常は今日の日付を書きます。',
    vi: 'Ngày bạn nộp tờ khai này. Thường là ngày hôm nay.',
  },
  area,
  input: { kind: 'date', boxes: { y, m, d } },
});

/** 「한글 (성) / (명)」 칸 — 성과 이름을 나눠 받는다 */
export const nameSplitField = (b: Base & { who: Who; surname: Box; given: Box; help?: L }): FieldDef => ({
  id: b.id,
  section: b.section,
  required: b.required,
  koLabel: b.koLabel,
  label: { ...nameLabel(b.who), ko: `${b.who.ko} 이름 (한글)`, en: `Name of ${b.who.en} (Hangul)`, zh: `${b.who.zh}姓名（韩文）`, ja: `${b.who.ja}の氏名（ハングル）`, vi: `Họ tên ${b.who.vi} (Hangul)` },
  help: b.help ?? NAME_HELP(b.who),
  area: b.area,
  page: b.page,
  badge: b.badge,
  copyFrom: b.copyFrom,
  input: {
    kind: 'text',
    parts: [
      { key: 'surname', box: b.surname, hangul: true, label: { ko: '성', en: 'Surname', zh: '姓', ja: '姓', vi: 'Họ' }, placeholder: '예) 응우옌' },
      { key: 'given', box: b.given, hangul: true, label: { ko: '이름', en: 'Given name', zh: '名', ja: '名', vi: 'Tên' }, placeholder: '예) 반안' },
    ],
  },
});

/** 「한자 (성) / (명)」 칸 */
export const hanjaSplitField = (b: Base & { who: Who; surname: Box; given: Box }): FieldDef => ({
  id: b.id,
  section: b.section,
  required: b.required,
  koLabel: b.koLabel,
  label: { ko: `${b.who.ko} 이름 (한자)`, en: `Name of ${b.who.en} (Chinese characters)`, zh: `${b.who.zh}姓名（汉字）`, ja: `${b.who.ja}の氏名（漢字）`, vi: `Họ tên ${b.who.vi} (chữ Hán)` },
  help: HANJA_HELP,
  area: b.area,
  page: b.page,
  badge: b.badge,
  copyFrom: b.copyFrom,
  input: {
    kind: 'text',
    parts: [
      { key: 'surname', box: b.surname, label: { ko: '성 (한자)', en: 'Surname', zh: '姓', ja: '姓', vi: 'Họ' }, placeholder: '예) 金' },
      { key: 'given', box: b.given, label: { ko: '이름 (한자)', en: 'Given name', zh: '名', ja: '名', vi: 'Tên' }, placeholder: '예) 吉洞' },
    ],
  },
});

/** 이름 한 칸 (성·이름을 나누지 않는 칸) */
export const nameField = (b: Base & { who: Who; box: Box; help?: L; label?: L }): FieldDef => ({
  id: b.id,
  section: b.section,
  required: b.required,
  koLabel: b.koLabel,
  label: b.label ?? nameLabel(b.who),
  help: b.help ?? NAME_HELP(b.who),
  area: b.area,
  page: b.page,
  badge: b.badge,
  copyFrom: b.copyFrom,
  input: { kind: 'text', parts: [{ key: 'name', box: b.box, hangul: true, placeholder: NAME_PLACEHOLDER }] },
});

/** 이름(한글) + 한자를 한 칸에 — 「성명」 칸이 하나뿐인 경우 */
export const nameWithHanjaField = (b: Base & { who: Who; name: Box; hanja: Box; help?: L }): FieldDef => ({
  id: b.id,
  section: b.section,
  required: b.required,
  koLabel: b.koLabel,
  label: nameLabel(b.who),
  help: b.help ?? {
    ko: NAME_HELP(b.who).ko + ' 한자 이름이 있으면 한자 칸에도 적어요.',
    en: NAME_HELP(b.who).en + ' If there is a name in Chinese characters, add it too.',
    zh: NAME_HELP(b.who).zh + '如有汉字姓名，也请填写。',
    ja: NAME_HELP(b.who).ja + '漢字の氏名があればそれも書きます。',
    vi: NAME_HELP(b.who).vi + ' Nếu có tên chữ Hán, ghi thêm.',
  },
  area: b.area,
  page: b.page,
  badge: b.badge,
  copyFrom: b.copyFrom,
  input: {
    kind: 'text',
    parts: [
      { key: 'name', box: b.name, hangul: true, label: { ko: '이름 (한글)', en: 'Name (Hangul)', zh: '姓名（韩文）', ja: '氏名（ハングル）', vi: 'Họ tên (Hangul)' }, placeholder: NAME_PLACEHOLDER },
      { key: 'hanja', box: b.hanja, label: { ko: '한자 (있으면)', en: 'Chinese characters (if any)', zh: '汉字（如有）', ja: '漢字（あれば）', vi: 'Chữ Hán (nếu có)' }, placeholder: '예) 洪吉洞' },
    ],
  },
});

type IdBoxes = { front: Box; back: Box; box?: undefined } | { box: Box; front?: undefined; back?: undefined };

export const idField = (b: Base & { who: Who } & IdBoxes): FieldDef => ({
  id: b.id,
  section: b.section,
  required: b.required,
  koLabel: b.koLabel,
  label: idLabel(b.who),
  help: ID_HELP,
  area: b.area,
  page: b.page,
  badge: b.badge,
  copyFrom: b.copyFrom,
  input: b.box ? { kind: 'idnum', box: b.box } : { kind: 'idnum', front: b.front, back: b.back },
});

/** 등록기준지 — 외국인은 국적, 한국인은 주소 */
export const originField = (b: Base & { who: Who; box: Box }): FieldDef => ({
  id: b.id,
  section: b.section,
  required: b.required,
  koLabel: b.koLabel,
  label: { ko: `${b.who.ko} 국적 (등록기준지)`, en: `Nationality of ${b.who.en} (registration base)`, zh: `${b.who.zh}国籍（登记基准地）`, ja: `${b.who.ja}の国籍（登録基準地）`, vi: `Quốc tịch ${b.who.vi} (nơi đăng ký gốc)` },
  help: ORIGIN_HELP,
  area: b.area,
  page: b.page,
  badge: b.badge,
  copyFrom: b.copyFrom,
  input: { kind: 'country', box: b.box, allowKorea: true },
});

export const addressField = (b: Base & { who: Who; box: Box; help?: L }): FieldDef => ({
  id: b.id,
  section: b.section,
  required: b.required,
  koLabel: b.koLabel,
  label: { ko: `${b.who.ko} 주소`, en: `Address of ${b.who.en}`, zh: `${b.who.zh}地址`, ja: `${b.who.ja}の住所`, vi: `Địa chỉ ${b.who.vi}` },
  help: b.help ?? ADDRESS_HELP(b.who),
  area: b.area,
  page: b.page,
  badge: b.badge,
  copyFrom: b.copyFrom,
  input: { kind: 'text', parts: [{ key: 'address', box: b.box, korean: true, placeholder: ADDRESS_PLACEHOLDER }] },
});

export const bonField = (b: Base & { who: Who; box: Box }): FieldDef => ({
  id: b.id,
  section: b.section,
  required: b.required,
  koLabel: b.koLabel,
  label: { ko: `${b.who.ko} 본 (한자)`, en: `Bon (family origin) of ${b.who.en}`, zh: `${b.who.zh}本贯（汉字）`, ja: `${b.who.ja}の本（漢字）`, vi: `Bon (quê gốc dòng họ) của ${b.who.vi}` },
  help: BON_HELP,
  area: b.area,
  page: b.page,
  badge: b.badge,
  copyFrom: b.copyFrom,
  input: { kind: 'text', parts: [{ key: 'bon', box: b.box, placeholder: '예) 金海' }] },
});

type DateBoxes = { y: Box; m: Box; d: Box; box?: undefined } | { box: Box; y?: undefined; m?: undefined; d?: undefined };
const dateInput = (b: DateBoxes): FieldDef['input'] =>
  b.box ? { kind: 'date', box: b.box } : { kind: 'date', boxes: { y: b.y, m: b.m, d: b.d } };

export const birthDateField = (b: Base & { who: Who } & DateBoxes): FieldDef => ({
  id: b.id,
  section: b.section,
  required: b.required,
  koLabel: b.koLabel,
  label: { ko: `${b.who.ko} 출생연월일`, en: `Date of birth of ${b.who.en}`, zh: `${b.who.zh}出生日期`, ja: `${b.who.ja}の生年月日`, vi: `Ngày sinh của ${b.who.vi}` },
  help: BIRTHDATE_HELP,
  area: b.area,
  page: b.page,
  badge: b.badge,
  copyFrom: b.copyFrom,
  input: dateInput(b),
});

export const sexField = (b: Base & { who: Who; male: { x: number; y: number }; female: { x: number; y: number } }): FieldDef => ({
  id: b.id,
  section: b.section,
  required: b.required,
  koLabel: b.koLabel,
  label: { ko: `${b.who.ko} 성별`, en: `Sex of ${b.who.en}`, zh: `${b.who.zh}性别`, ja: `${b.who.ja}の性別`, vi: `Giới tính ${b.who.vi}` },
  help: { ko: '성별을 골라요.', en: 'Choose the sex.', zh: '选择性别。', ja: '性別を選びます。', vi: 'Chọn giới tính.' },
  area: b.area,
  page: b.page,
  badge: b.badge,
  input: {
    kind: 'choice',
    mark: 'circle',
    options: [
      { value: 'M', ko: '남', label: { ko: '남', en: 'Male', zh: '男', ja: '男', vi: 'Nam' }, mark: b.male },
      { value: 'F', ko: '여', label: { ko: '여', en: 'Female', zh: '女', ja: '女', vi: 'Nữ' }, mark: b.female },
    ],
  },
});

/** 「○○일자 년 월 일」 */
export const dateField = (b: Base & { label: L; help: L } & DateBoxes): FieldDef => ({
  id: b.id,
  section: b.section,
  required: b.required,
  koLabel: b.koLabel,
  label: b.label,
  help: b.help,
  area: b.area,
  page: b.page,
  badge: b.badge,
  input: dateInput(b),
});

export const textField = (b: Base & { label: L; help: L; part: Omit<Part, 'key'> & { key?: string } }): FieldDef => ({
  id: b.id,
  section: b.section,
  required: b.required,
  koLabel: b.koLabel,
  label: b.label,
  help: b.help,
  area: b.area,
  page: b.page,
  badge: b.badge,
  copyFrom: b.copyFrom,
  input: { kind: 'text', parts: [{ key: 'text', ...b.part }] },
});

export const COURT_NAME_LABEL: L = { ko: '법원 이름', en: 'Name of the court', zh: '法院名称', ja: '裁判所名', vi: 'Tên tòa án' };

export const courtNameField = (b: Base & { box: Box; help: L }): FieldDef =>
  textField({
    ...b,
    label: COURT_NAME_LABEL,
    part: { box: b.box, korean: true, placeholder: '예) 서울가정법원' },
  });

/** 기타사항 — 작성방법: 가족관계등록부에 기록을 분명하게 하는데 특히 필요한 사항 */
export const otherNotesField = (b: Base & { box: Box; extra?: L }): FieldDef =>
  textField({
    ...b,
    label: { ko: '기타 사항', en: 'Other notes', zh: '其他事项', ja: 'その他事項', vi: 'Ghi chú khác' },
    help: {
      ko: '가족관계등록부에 정확히 기록하는 데 특히 필요한 내용이 있을 때만 한국어로 적어요.' + (b.extra ? ' ' + b.extra.ko : '') + ' 잘 모르면 비워 두고 창구에 물어보세요.',
      en: 'Only if something is especially needed to record the family relation register accurately, written in Korean.' + (b.extra ? ' ' + b.extra.en : '') + ' If unsure, leave it blank and ask at the counter.',
      zh: '仅在有为准确记录家族关系登记簿而特别需要的内容时，用韩文填写。' + (b.extra ? b.extra.zh : '') + '不确定时请留空并咨询窗口。',
      ja: '家族関係登録簿に正確に記録するため特に必要な事項がある場合のみ韓国語で書きます。' + (b.extra ? b.extra.ja : '') + '分からない場合は空欄にして窓口でお尋ねください。',
      vi: 'Chỉ ghi bằng tiếng Hàn khi có nội dung đặc biệt cần để ghi chính xác vào sổ đăng ký quan hệ gia đình.' + (b.extra ? ' ' + b.extra.vi : '') + ' Nếu chưa rõ, hãy để trống và hỏi tại quầy.',
    },
    part: { box: { ...b.box, align: 'left' }, korean: true },
  });

/** 신고인 이름 — 서명·날인은 종이에 직접 */
export const reporterNameField = (b: Base & { box: Box; who?: Who; extra?: L }): FieldDef => {
  const who = b.who ?? WHO.reporter;
  return nameField({
    ...b,
    who,
    help: {
      ko: `이 신고서를 내는 사람(${who.ko})의 이름을 한글로 적어요. 서명이나 도장은 출력한 종이에 직접 해요.` + (b.extra ? ' ' + b.extra.ko : ''),
      en: `Name of the person submitting this report (${who.en}), in Korean letters. Sign or stamp by hand on the printed paper.` + (b.extra ? ' ' + b.extra.en : ''),
      zh: `用韩文填写提交本申报书的人（${who.zh}）的姓名。签名或盖章请在打印出的纸上亲自完成。` + (b.extra ? b.extra.zh : ''),
      ja: `この届出を出す人（${who.ja}）の氏名をハングルで書きます。署名・押印は印刷した紙に直接します。` + (b.extra ? b.extra.ja : ''),
      vi: `Họ tên người nộp tờ khai này (${who.vi}) bằng chữ Hàn. Ký tên hoặc đóng dấu trực tiếp trên giấy đã in.` + (b.extra ? ' ' + b.extra.vi : ''),
    },
  });
};

export const phoneField = (b: Base & { box: Box; who?: Who }): FieldDef => {
  const who = b.who ?? WHO.reporter;
  return {
    id: b.id,
    section: b.section,
    required: b.required,
    koLabel: b.koLabel,
    label: { ko: `${who.ko} 전화번호`, en: `Phone number of ${who.en}`, zh: `${who.zh}电话号码`, ja: `${who.ja}の電話番号`, vi: `Số điện thoại ${who.vi}` },
    help: { ko: '연락 가능한 휴대전화 번호를 적어요.', en: 'A mobile number where you can be reached.', zh: '填写可以联系到的手机号码。', ja: '連絡のつく携帯電話番号を書きます。', vi: 'Số điện thoại di động có thể liên lạc được.' },
    area: b.area,
    page: b.page,
    badge: b.badge,
    copyFrom: b.copyFrom,
    input: { kind: 'text', parts: [{ key: 'phone', box: b.box, inputMode: 'tel', placeholder: '010-1234-5678' }] },
  };
};

export const emailField = (b: Base & { box: Box; who?: Who }): FieldDef => {
  const who = b.who ?? WHO.reporter;
  return {
    id: b.id,
    section: b.section,
    required: b.required,
    koLabel: b.koLabel,
    label: { ko: `${who.ko} 이메일`, en: `Email of ${who.en}`, zh: `${who.zh}电子邮箱`, ja: `${who.ja}のメールアドレス`, vi: `Email ${who.vi}` },
    help: { ko: '선택 사항이에요.', en: 'Optional.', zh: '选填。', ja: '任意です。', vi: 'Không bắt buộc.' },
    area: b.area,
    page: b.page,
    badge: b.badge,
    input: { kind: 'text', parts: [{ key: 'email', box: b.box, inputMode: 'email', placeholder: 'name@example.com' }] },
  };
};

const SUBMITTER_HELP: L = {
  ko: '신고인이 아닌 다른 사람이 창구에 서류를 낼 때만 적어요. 신고인이 직접 내면 비워 두세요. (창구 직원이 신분증과 맞춰 봐요)',
  en: 'Only if someone other than the reporting person brings this form to the office. Leave blank if the reporter submits it in person. (Staff will check it against the ID.)',
  zh: '仅在由申报人以外的人到窗口提交时填写。申报人本人提交则留空。（窗口工作人员会核对身份证件）',
  ja: '届出人以外の人が窓口に提出する場合のみ書きます。届出人本人が提出する場合は空欄にします。（窓口職員が身分証と照合します）',
  vi: 'Chỉ ghi khi người khác (không phải người khai) mang tờ khai đến nộp. Để trống nếu người khai tự nộp. (Nhân viên sẽ đối chiếu với giấy tờ tùy thân.)',
};

export const submitterNameField = (b: Base & { box: Box }): FieldDef =>
  nameField({
    ...b,
    who: WHO.submitter,
    label: { ko: '대신 제출하는 사람 이름', en: 'Name of the person submitting on behalf', zh: '代为提交人姓名', ja: '提出人の氏名', vi: 'Tên người nộp thay' },
    help: SUBMITTER_HELP,
  });

export const submitterIdField = (b: Base & IdBoxes): FieldDef => ({
  ...idField({ ...b, who: WHO.submitter }),
  help: { ...ID_HELP, ko: ID_HELP.ko + ' 대신 제출하는 사람이 있을 때만 적어요.', en: ID_HELP.en + ' Only if someone submits on your behalf.', zh: ID_HELP.zh + '仅在有人代为提交时填写。', ja: ID_HELP.ja + '代わりに提出する人がいる場合のみ書きます。', vi: ID_HELP.vi + ' Chỉ ghi khi có người nộp thay.' },
});

/** 선택지 — [value, 서식 한국어, 5개 국어, ○ 위치] */
export const opt = (value: string, ko: string, label: L, x: number, y: number): ChoiceOption => ({ value, ko, label, mark: { x, y } });

export const OTHER_DETAIL: Omit<Part, 'box'> = {
  key: 'detail',
  korean: true,
  label: { ko: '자격 (한국어)', en: 'Capacity (in Korean)', zh: '资格（韩文）', ja: '資格（韓国語）', vi: 'Tư cách (tiếng Hàn)' },
};


// ── 인구동향조사 (통계청) ───────────────────────────────────

const EDU_LABELS: { value: string; ko: string; label: L }[] = [
  { value: 'none',   ko: '학력 없음',   label: { ko: '학력 없음',   en: 'No schooling',              zh: '无学历',       ja: '学歴なし',   vi: 'Không đi học' } },
  { value: 'elem',   ko: '초등학교',    label: { ko: '초등학교',    en: 'Elementary school',         zh: '小学',         ja: '小学校',     vi: 'Tiểu học' } },
  { value: 'middle', ko: '중학교',      label: { ko: '중학교',      en: 'Middle school',             zh: '初中',         ja: '中学校',     vi: 'Trung học cơ sở' } },
  { value: 'high',   ko: '고등학교',    label: { ko: '고등학교',    en: 'High school',               zh: '高中',         ja: '高校',       vi: 'Trung học phổ thông' } },
  { value: 'univ',   ko: '대학(교)',    label: { ko: '대학(교)',    en: 'College / University',      zh: '大学',         ja: '大学',       vi: 'Cao đẳng / Đại học' } },
  { value: 'grad',   ko: '대학원 이상', label: { ko: '대학원 이상', en: 'Graduate school or higher', zh: '研究生及以上', ja: '大学院以上', vi: 'Sau đại học' } },
];

/** 최종 졸업학교 선택지 — xs: 1~6번 상자 가운데 x */
export const eduOptions = (xs: number[], y: number): ChoiceOption[] => EDU_LABELS.map((o, i) => ({ ...o, mark: { x: xs[i], y } }));

/** 작성방법: 교육부장관이 인정하는 정규기관 기준, 재학(중퇴)자는 졸업한 최종학교 */
export const EDU_HELP: L = {
  ko: '통계청 조사 항목이에요. 졸업한 학교 중 가장 높은 단계를 골라요(교육부가 인정하는 정규 학교 기준). 다니는 중이거나 중퇴했다면 그 전 단계를 골라요. (예: 대학교 3학년 재학 → 고등학교)',
  en: "This is for Statistics Korea's survey. Choose the highest level graduated from (schools recognized by the Ministry of Education). If still enrolled or dropped out, choose the level below (e.g., 3rd-year university student → high school).",
  zh: '这是统计厅的调查项目。请选择已毕业的最高学历（以教育部认可的正规学校为准）。在读或肄业则选择前一阶段（例：大学三年级在读 → 高中）。',
  ja: '統計庁の調査項目です。卒業した学校のうち最も高い段階を選びます（教育部が認める正規の学校が基準）。在学中・中退の場合はその前の段階を選びます（例：大学3年在学 → 高校）。',
  vi: 'Đây là mục khảo sát của Cục Thống kê. Chọn bậc học cao nhất đã tốt nghiệp (theo trường chính quy được Bộ Giáo dục công nhận). Nếu đang học hoặc bỏ dở, chọn bậc trước đó (VD: đang học năm 3 đại học → trung học phổ thông).',
};

/** 전화·이메일이 위아래 두 줄로 붙어 있는 칸 — 번호 하나로 함께 받는다 */
export const contactField = (b: Base & { who: Who; phone: Box; email: Box }): FieldDef => ({
  id: b.id,
  section: b.section,
  required: b.required,
  koLabel: b.koLabel,
  label: { ko: `${b.who.ko} 연락처`, en: `Contact of ${b.who.en}`, zh: `${b.who.zh}联系方式`, ja: `${b.who.ja}の連絡先`, vi: `Liên lạc của ${b.who.vi}` },
  help: {
    ko: '연락 가능한 휴대전화 번호를 적어요. 이메일은 선택 사항이에요.',
    en: 'A mobile number where they can be reached. Email is optional.',
    zh: '填写可以联系到的手机号码。电子邮箱选填。',
    ja: '連絡のつく携帯電話番号を書きます。メールアドレスは任意です。',
    vi: 'Số điện thoại di động có thể liên lạc được. Email không bắt buộc.',
  },
  area: b.area,
  page: b.page,
  badge: b.badge,
  input: {
    kind: 'text',
    parts: [
      { key: 'phone', box: b.phone, inputMode: 'tel', label: { ko: '전화', en: 'Phone', zh: '电话', ja: '電話', vi: 'Điện thoại' }, placeholder: '010-1234-5678' },
      { key: 'email', box: b.email, inputMode: 'email', label: { ko: '이메일 (선택)', en: 'Email (optional)', zh: '电子邮箱（选填）', ja: 'メール（任意）', vi: 'Email (không bắt buộc)' }, placeholder: 'name@example.com' },
    ],
  },
});
