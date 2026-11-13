import {
  addressField, birthDateField, bonField, dateField, EDU_HELP, hanjaSplitField, idField, nameField, nameSplitField,
  opt, originField, otherNotesField, phoneField, reportDateField, submitterIdField, submitterNameField, textField, Who,
} from './common';
import { Box, ChoiceOption, FieldDef, FormDef, L } from './types';

// ─────────────────────────────────────────────────────────────
// 이혼(친권자 지정)신고서 [양식 제11호] — v1 서식 12번
// 좌표는 public/forms/divorce-report_ko.png (1190×1682) 기준.
// 안내 문구는 뒷면 「작성 방법」(v1 guides_ko_12)을 바탕으로 작성.
// ─────────────────────────────────────────────────────────────

const HUSBAND: Who = { ko: '남편', en: 'the husband', zh: '丈夫', ja: '夫', vi: 'chồng' };
const WIFE: Who = { ko: '아내', en: 'the wife', zh: '妻子', ja: '妻', vi: 'vợ' };

const SIGN_HELP: L = {
  ko: ' 협의이혼이면 두 사람 모두, 재판상 이혼이면 한 사람만 서명(또는 도장)해도 돼요. 서명은 출력한 종이에 직접 해요.',
  en: ' For a divorce by agreement both spouses must sign (or stamp); for a judicial divorce one spouse may sign. Sign by hand on the printed paper.',
  zh: '协议离婚须双方签名（或盖章），诉讼离婚可由一方签名。签名请在打印出的纸上亲自完成。',
  ja: '協議離婚は双方が署名（または押印）し、裁判上の離婚は一方だけの署名でも構いません。署名は印刷した紙に直接します。',
  vi: ' Ly hôn thuận tình thì cả hai phải ký (hoặc đóng dấu); ly hôn theo phán quyết thì một người ký cũng được. Ký trực tiếp trên giấy đã in.',
};

const PARENT_HELP = (who: Who): L => ({
  ko: `${who.ko} 이름을 한글로 적어요. 이혼하는 사람이 양자라면 양부모를 적어요.`,
  en: `Name of ${who.en} in Korean letters. If the person divorcing is an adopted child, write the adoptive parents.`,
  zh: `用韩文填写${who.zh}的姓名。离婚当事人为养子女时，填写养父母。`,
  ja: `${who.ja}の氏名をハングルで書きます。離婚当事者が養子の場合は養父母を書きます。`,
  vi: `Họ tên ${who.vi} bằng chữ Hàn. Nếu người ly hôn là con nuôi, ghi cha mẹ nuôi.`,
});

const PARENT_ID_HELP: L = {
  ko: '부모의 주민등록번호를 적어요. 주민등록번호가 없으면 등록기준지(본적)를 적고, 외국인이면 외국인등록번호(국내거소신고번호 또는 생년월일)와 국적을 적어요.',
  en: "The parent's resident registration number. If they have none, write their registration base (bonjeok); for a foreign national, write the alien registration number (or domestic residence report number or date of birth) and nationality.",
  zh: '填写父母的居民登录号。没有居民登录号时填写登记基准地（本籍）；外国人填写外国人登录号（或国内居所申报号、出生日期）及国籍。',
  ja: '父母の住民登録番号を書きます。住民登録番号がない場合は登録基準地（本籍）を書き、外国人の場合は外国人登録番号（または国内居所申告番号、生年月日）と国籍を書きます。',
  vi: 'Số đăng ký cư trú của bố / mẹ. Nếu không có, ghi nơi đăng ký gốc (bản quán); nếu là người nước ngoài, ghi số đăng ký người nước ngoài (hoặc số khai báo cư trú trong nước, ngày sinh) và quốc tịch.',
};

interface Side {
  key: 'husband' | 'wife';
  who: Who;
  x0: number;
  x1: number;
  nameArea: Box;
  surname: Box;
  given: Box;
  hanjaSurname: Box;
  hanjaGiven: Box;
  bon: { area: Box; box: Box };
  phone: { area: Box; box: Box };
  dash: [number, number];
  father: Who;
  mother: Who;
}

const HUSBAND_SIDE: Side = {
  key: 'husband', who: HUSBAND, x0: 351, x1: 683,
  nameArea: { x: 274, y: 221, w: 303, h: 52 },
  surname: { x: 401, y: 224, w: 50, h: 46, align: 'center' },
  given: { x: 484, y: 224, w: 92, h: 46, align: 'center' },
  hanjaSurname: { x: 374, y: 276, w: 50, h: 42, align: 'center' },
  hanjaGiven: { x: 456, y: 276, w: 120, h: 42, align: 'center' },
  bon: { area: { x: 351, y: 322, w: 111, h: 42 }, box: { x: 387, y: 324, w: 73, h: 38, align: 'center' } },
  phone: { area: { x: 463, y: 322, w: 220, h: 42 }, box: { x: 538, y: 324, w: 143, h: 38, align: 'center' } },
  dash: [513, 520],
  father: { ko: '남편의 아버지', en: "the husband's father", zh: '丈夫的父亲', ja: '夫の父', vi: 'bố của chồng' },
  mother: { ko: '남편의 어머니', en: "the husband's mother", zh: '丈夫的母亲', ja: '夫の母', vi: 'mẹ của chồng' },
};

const WIFE_SIDE: Side = {
  key: 'wife', who: WIFE, x0: 684, x1: 1045,
  nameArea: { x: 684, y: 221, w: 241, h: 52 },
  surname: { x: 739, y: 224, w: 50, h: 46, align: 'center' },
  given: { x: 821, y: 224, w: 102, h: 46, align: 'center' },
  hanjaSurname: { x: 708, y: 276, w: 50, h: 42, align: 'center' },
  hanjaGiven: { x: 790, y: 276, w: 133, h: 42, align: 'center' },
  bon: { area: { x: 793, y: 322, w: 75, h: 42 }, box: { x: 826, y: 324, w: 40, h: 38, align: 'center' } },
  phone: { area: { x: 869, y: 322, w: 176, h: 42 }, box: { x: 938, y: 324, w: 105, h: 38, align: 'center' } },
  dash: [861, 868],
  father: { ko: '아내의 아버지', en: "the wife's father", zh: '妻子的父亲', ja: '妻の父', vi: 'bố của vợ' },
  mother: { ko: '아내의 어머니', en: "the wife's mother", zh: '妻子的母亲', ja: '妻の母', vi: 'mẹ của vợ' },
};

const row = (s: Side, y: number, h: number): Box => ({ x: s.x0, y, w: s.x1 - s.x0, h });
const inBox = (s: Side, y: number, h: number): Box => ({ x: s.x0 + 36, y: y + 2, w: s.x1 - s.x0 - 40, h: h - 4, align: 'center' });
const idBoxes = (s: Side, y: number, h: number) => ({
  front: { x: s.x0 + 36, y: y + 2, w: s.dash[0] - s.x0 - 40, h: h - 4, align: 'center' as const },
  back: { x: s.dash[1] + 4, y: y + 2, w: s.x1 - s.dash[1] - 6, h: h - 4, align: 'center' as const },
});

const partyFields = (s: Side): FieldDef[] => {
  const p = s.key;
  return [
    nameSplitField({
      id: `${p}Name`, section: 'party', koLabel: `① ${s.who.ko} 성명 (한글)`, who: s.who,
      help: {
        ko: `${s.who.ko}의 이름을 한글로 적어요. 외국인이면 여권·외국인등록증의 이름을 한글로 옮겨 적어요.` + SIGN_HELP.ko,
        en: `Name of ${s.who.en} in Korean letters (Hangul). For a foreign national, transcribe the passport / residence card name into Hangul.` + SIGN_HELP.en,
        zh: `用韩文填写${s.who.zh}的姓名。外国人请将护照/外国人登录证上的姓名按发音写成韩文。` + SIGN_HELP.zh,
        ja: `${s.who.ja}の氏名をハングルで書きます。外国人の場合、パスポート・外国人登録証の氏名をハングル表記で書きます。` + SIGN_HELP.ja,
        vi: `Họ tên ${s.who.vi} bằng chữ Hàn (Hangul). Nếu là người nước ngoài, phiên âm tên trên hộ chiếu / thẻ người nước ngoài sang Hangul.` + SIGN_HELP.vi,
      },
      area: s.nameArea, surname: s.surname, given: s.given,
    }),
    hanjaSplitField({ id: `${p}Hanja`, section: 'party', koLabel: `① ${s.who.ko} 성명 (한자)`, who: s.who, area: { ...s.nameArea, y: 274, h: 47 }, surname: s.hanjaSurname, given: s.hanjaGiven }),
    bonField({ id: `${p}Bon`, section: 'party', koLabel: `① ${s.who.ko} 본(한자)`, who: s.who, area: s.bon.area, box: s.bon.box }),
    phoneField({ id: `${p}Phone`, section: 'party', koLabel: `① ${s.who.ko} 전화`, who: s.who, area: s.phone.area, box: s.phone.box }),
    idField({ id: `${p}Id`, section: 'party', koLabel: `① ${s.who.ko} 주민등록번호`, who: s.who, area: row(s, 365, 34), ...idBoxes(s, 365, 34) }),
    birthDateField({ id: `${p}Birth`, section: 'party', koLabel: `① ${s.who.ko} 출생연월일`, who: s.who, area: row(s, 400, 35), box: inBox(s, 400, 35) }),
    originField({ id: `${p}Origin`, section: 'party', koLabel: `① ${s.who.ko} 등록기준지`, who: s.who, area: row(s, 436, 35), box: inBox(s, 436, 35) }),
    addressField({ id: `${p}Address`, section: 'party', koLabel: `① ${s.who.ko} 주소`, who: s.who, area: row(s, 472, 47), box: inBox(s, 472, 47) }),
  ];
};

const parentFields = (s: Side): FieldDef[] => {
  const p = s.key;
  return [
    nameField({ id: `${p}FatherName`, section: 'parents', koLabel: `② ${s.who.ko} 부(양부) 성명`, who: s.father, help: PARENT_HELP(s.father), area: row(s, 520, 35), box: inBox(s, 520, 35) }),
    { ...idField({ id: `${p}FatherId`, section: 'parents', koLabel: `② ${s.who.ko} 부 주민등록번호`, who: s.father, area: row(s, 556, 35), ...idBoxes(s, 556, 35) }), help: PARENT_ID_HELP },
    nameField({ id: `${p}MotherName`, section: 'parents', koLabel: `② ${s.who.ko} 모(양모) 성명`, who: s.mother, help: PARENT_HELP(s.mother), area: row(s, 592, 35), box: inBox(s, 592, 35) }),
    { ...idField({ id: `${p}MotherId`, section: 'parents', koLabel: `② ${s.who.ko} 모 주민등록번호`, who: s.mother, area: row(s, 628, 36), ...idBoxes(s, 628, 36) }), help: PARENT_ID_HELP },
  ];
};

// ── ⑤ 친권자 지정 (미성년 자녀 4명까지) ─────────────────────

interface ChildCol {
  /** 열 왼쪽 끝 (성명·주민등록번호 칸) */
  x0: number;
  x1: number;
  dash: [number, number];
  /** 부·모·부모 상자 [부, 모, 부모] */
  who: [number, number, number];
  /** 효력발생일 칸 (라벨 포함) 왼쪽 끝과 년·월·일 글자 x */
  dateX0: number;
  ymd: [number, number, number];
  /** 원인 협의·재판 상자 */
  cause: [number, number];
}
const COL1: ChildCol = { x0: 351, x1: 683, dash: [513, 520], who: [362, 402, 362], dateX0: 434, ymd: [579, 615, 651], cause: [560, 618] };
const COL2: ChildCol = { x0: 684, x1: 1045, dash: [861, 868], who: [695, 740, 695], dateX0: 775, ymd: [925, 961, 997], cause: [894, 951] };

const CUSTODY_HELP: L = {
  ko: '협의이혼은 법원에서 이혼 의사를 확인받은 뒤에 정해진 친권자를 적어요(확인 신청할 때는 비워 둬요). 미성년 자녀의 친권자가 누구인지 골라요.',
  en: 'For a divorce by agreement, fill this in only after the court has confirmed the intention to divorce (leave blank when applying for that confirmation). Choose who has parental authority over the minor child.',
  zh: '协议离婚须在法院确认离婚意思后，填写确定的亲权人（申请确认时留空）。选择未成年子女的亲权人。',
  ja: '協議離婚は、裁判所で離婚意思の確認を受けた後に定まった親権者を書きます（確認申請の時は空欄）。未成年の子の親権者を選びます。',
  vi: 'Với ly hôn thuận tình, chỉ ghi sau khi tòa đã xác nhận ý chí ly hôn (để trống khi nộp đơn xin xác nhận). Chọn người có thân quyền đối với con chưa thành niên.',
};

/** 줄 위치 [성명, 주민등록번호, 친권자, 원인, 끝]과 ○ 높이 [부·모, 부모, 원인] */
type ChildRows = { y: [number, number, number, number, number]; marks: [number, number, number] };
const PAIR1: ChildRows = { y: [772, 809, 845, 883, 916], marks: [871, 892, 900] };
const PAIR2: ChildRows = { y: [916, 955, 994, 1038, 1077], marks: [1025, 1047, 1058] };

const child = (n: number, c: ChildCol, rows: ChildRows): FieldDef[] => {
  const who: Who = { ko: `미성년 자녀 ${n}`, en: `minor child ${n}`, zh: `未成年子女${n}`, ja: `未成年の子${n}`, vi: `con chưa thành niên ${n}` };
  const s = `child${n}`;
  const [yName, yId, yCust, yCause, yEnd] = rows.y;
  const [markY1, markY3, causeY] = rows.marks;
  return [
    nameField({ id: `${s}Name`, section: 'custody', koLabel: `⑤ 미성년인 자의 성명 (${n})`, who, help: { ko: '친권자를 정한 미성년 자녀의 이름을 적어요. 자녀가 5명 이상이면 별지에 적어 붙여요.', en: 'Name of the minor child whose parental authority was decided. If there are 5 or more children, list them on a separate sheet.', zh: '填写已确定亲权人的未成年子女姓名。子女有5名以上时，另附别纸填写。', ja: '親権者を定めた未成年の子の氏名を書きます。子が5人以上の場合は別紙に書いて添付します。', vi: 'Họ tên con chưa thành niên đã được xác định thân quyền. Nếu có từ 5 con trở lên, ghi vào tờ riêng đính kèm.' }, area: { x: c.x0, y: yName + 1, w: c.x1 - c.x0, h: yId - yName - 1 }, box: { x: c.x0 + 36, y: yName + 3, w: c.x1 - c.x0 - 40, h: yId - yName - 5, align: 'center' } }),
    idField({ id: `${s}Id`, section: 'custody', koLabel: `⑤ 미성년인 자의 주민등록번호 (${n})`, who, area: { x: c.x0, y: yId + 1, w: c.x1 - c.x0, h: yCust - yId - 1 }, front: { x: c.x0 + 36, y: yId + 3, w: c.dash[0] - c.x0 - 40, h: yCust - yId - 5, align: 'center' }, back: { x: c.dash[1] + 4, y: yId + 3, w: c.x1 - c.dash[1] - 6, h: yCust - yId - 5, align: 'center' } }),
    {
      id: `${s}Custodian`, section: 'custody', koLabel: `⑤ 친권자 (${n})`,
      label: { ko: `${who.ko}의 친권자`, en: `Parental authority over ${who.en}`, zh: `${who.zh}的亲权人`, ja: `${who.ja}の親権者`, vi: `Thân quyền đối với ${who.vi}` },
      help: CUSTODY_HELP,
      area: { x: c.x0, y: yCust + 1, w: c.dateX0 - c.x0, h: yEnd - yCust - 1 },
      badgeAt: { x: c.dateX0 - 17, y: yEnd - 17 },
      input: {
        kind: 'choice', mark: 'circle',
        options: [
          opt('father', '부', { ko: '부 (아버지)', en: 'Father', zh: '父亲', ja: '父', vi: 'Bố' }, c.who[0], markY1),
          opt('mother', '모', { ko: '모 (어머니)', en: 'Mother', zh: '母亲', ja: '母', vi: 'Mẹ' }, c.who[1], markY1),
          opt('both', '부모', { ko: '부모 (두 분 모두)', en: 'Both parents', zh: '父母双方', ja: '父母', vi: 'Cả bố và mẹ' }, c.who[2], markY3),
        ],
      },
    },
    dateField({
      id: `${s}EffectiveDate`, section: 'custody', koLabel: `⑤ 효력발생일 (${n})`,
      label: { ko: `${who.ko} 친권 효력발생일`, en: `Effective date for ${who.en}`, zh: `${who.zh}亲权生效日`, ja: `${who.ja}の親権効力発生日`, vi: `Ngày thân quyền có hiệu lực (${who.vi})` },
      help: { ko: '협의이혼이면 이혼신고일, 재판상 이혼이면 재판 확정일을 적어요.', en: 'For a divorce by agreement, the date of this divorce report; for a judicial divorce, the date the judgment became final.', zh: '协议离婚填写离婚申报日，诉讼离婚填写判决确定日。', ja: '協議離婚は離婚届出日、裁判上の離婚は裁判確定日を書きます。', vi: 'Ly hôn thuận tình: ngày khai báo ly hôn; ly hôn theo phán quyết: ngày phán quyết có hiệu lực.' },
      area: { x: c.dateX0, y: yCust + 1, w: c.x1 - c.dateX0, h: yCause - yCust - 1 },
      y: { x: c.ymd[0] - 48, y: yCust + 4, w: 46, h: yCause - yCust - 7, align: 'right' },
      m: { x: c.ymd[1] - 22, y: yCust + 4, w: 20, h: yCause - yCust - 7, align: 'right' },
      d: { x: c.ymd[2] - 22, y: yCust + 4, w: 20, h: yCause - yCust - 7, align: 'right' },
    }),
    {
      id: `${s}Cause`, section: 'custody', koLabel: `⑤ 원인 (${n})`,
      label: { ko: `${who.ko} 친권자를 정한 방법`, en: `How parental authority was decided (${who.en})`, zh: `${who.zh}亲权人的确定方式`, ja: `${who.ja}の親権者を定めた方法`, vi: `Cách xác định thân quyền (${who.vi})` },
      help: { ko: '두 사람이 협의해서 정했으면 "협의", 법원이 정했으면 "재판"을 골라요. 그 내용을 증명하는 서류를 함께 내야 해요.', en: 'Choose "Agreement" if the two of you decided, or "Judgment" if the court decided. Documents proving it must be attached.', zh: '双方协议确定选“协议”，由法院决定选“判决”。须附上证明材料。', ja: '2人で協議して定めた場合は「協議」、裁判所が定めた場合は「裁判」を選びます。その内容を証明する書類も提出します。', vi: 'Chọn "Thỏa thuận" nếu hai người tự quyết định, "Phán quyết" nếu tòa quyết định. Phải nộp kèm giấy tờ chứng minh.' },
      area: { x: c.dateX0, y: yCause + 1, w: c.x1 - c.dateX0, h: yEnd - yCause - 1 },
      input: {
        kind: 'choice', mark: 'circle',
        options: [
          opt('agreement', '협의', { ko: '협의', en: 'Agreement', zh: '协议', ja: '協議', vi: 'Thỏa thuận' }, c.cause[0], causeY),
          opt('court', '재판', { ko: '재판', en: 'Judgment', zh: '判决', ja: '裁判', vi: 'Phán quyết' }, c.cause[1], causeY),
        ],
      },
    },
  ];
};

// ── 인구동향조사 ─────────────────────────────────────────────

const JOB_LABELS: [string, string, L][] = [
  ['manager', '관리직', { ko: '관리직', en: 'Manager', zh: '管理职', ja: '管理職', vi: 'Quản lý' }],
  ['professional', '전문직', { ko: '전문직', en: 'Professional', zh: '专业技术职', ja: '専門職', vi: 'Chuyên môn' }],
  ['clerical', '사무직', { ko: '사무직', en: 'Office / clerical', zh: '事务职', ja: '事務職', vi: 'Văn phòng' }],
  ['service', '서비스직', { ko: '서비스직', en: 'Service', zh: '服务职', ja: 'サービス職', vi: 'Dịch vụ' }],
  ['sales', '판매직', { ko: '판매직', en: 'Sales', zh: '销售职', ja: '販売職', vi: 'Bán hàng' }],
  ['farming', '농림어업', { ko: '농림어업', en: 'Agriculture, forestry, fishery', zh: '农林渔业', ja: '農林漁業', vi: 'Nông, lâm, ngư nghiệp' }],
  ['craft', '기능직', { ko: '기능직', en: 'Craft / skilled trades', zh: '技能职', ja: '技能職', vi: 'Thợ có tay nghề' }],
  ['machine', '장치·기계 조작 및 조립', { ko: '장치·기계 조작 및 조립', en: 'Machine operation & assembly', zh: '装置·机械操作及装配', ja: '装置・機械の操作及び組立', vi: 'Vận hành & lắp ráp máy móc' }],
  ['labor', '단순노무직', { ko: '단순노무직', en: 'Simple labor', zh: '简单劳务职', ja: '単純労務職', vi: 'Lao động giản đơn' }],
  ['military', '군인', { ko: '군인', en: 'Military', zh: '军人', ja: '軍人', vi: 'Quân nhân' }],
  ['none', '학생·가사·무직', { ko: '학생·가사·무직', en: 'Student, homemaker or no job', zh: '学生·家务·无业', ja: '学生・家事・無職', vi: 'Học sinh, nội trợ, không có việc làm' }],
];
const JOB_ROWS = [1457, 1479, 1502, 1527, 1549, 1574];
const EDU: [string, string, L][] = [
  ['none', '학력 없음', { ko: '학력 없음', en: 'No schooling', zh: '无学历', ja: '学歴なし', vi: 'Không đi học' }],
  ['elem', '초등학교', { ko: '초등학교', en: 'Elementary school', zh: '小学', ja: '小学校', vi: 'Tiểu học' }],
  ['middle', '중학교', { ko: '중학교', en: 'Middle school', zh: '初中', ja: '中学校', vi: 'Trung học cơ sở' }],
  ['high', '고등학교', { ko: '고등학교', en: 'High school', zh: '高中', ja: '高校', vi: 'Trung học phổ thông' }],
  ['univ', '대학(교)', { ko: '대학(교)', en: 'College / University', zh: '大学', ja: '大学', vi: 'Cao đẳng / Đại học' }],
  ['grad', '대학원 이상', { ko: '대학원 이상', en: 'Graduate school or higher', zh: '研究生及以上', ja: '大学院以上', vi: 'Sau đại học' }],
];

const survey = (s: Side, eduX: [number, number, number], jobX: [number, number], x0: number, w: number): FieldDef[] => [
  {
    id: `${s.key}Education`, section: 'survey', koLabel: `㉱ 최종 졸업학교 (${s.who.ko})`,
    label: { ko: `${s.who.ko} 최종 학력`, en: `Highest education of ${s.who.en}`, zh: `${s.who.zh}最高学历`, ja: `${s.who.ja}の最終学歴`, vi: `Học vấn cao nhất của ${s.who.vi}` },
    help: EDU_HELP,
    area: { x: x0, y: 1397, w, h: 46 },
    badge: 'margin',
    input: { kind: 'choice', mark: 'circle', options: EDU.map(([v, ko, l], i): ChoiceOption => opt(v, ko, l, eduX[i % 3], i < 3 ? 1408 : 1433)) },
  },
  {
    id: `${s.key}Job`, section: 'survey', koLabel: `㉲ 직업 (${s.who.ko})`,
    label: { ko: `${s.who.ko} 직업`, en: `Occupation of ${s.who.en}`, zh: `${s.who.zh}职业`, ja: `${s.who.ja}の職業`, vi: `Nghề nghiệp của ${s.who.vi}` },
    help: { ko: '통계청 조사 항목이에요. 이혼할 당시의 주된 직업을 기준으로 골라요.', en: "For Statistics Korea's survey. Choose based on the main occupation at the time of divorce.", zh: '这是统计厅的调查项目。以离婚时的主要职业为准选择。', ja: '統計庁の調査項目です。離婚当時の主な職業を基準に選びます。', vi: 'Đây là mục khảo sát của Cục Thống kê. Chọn theo nghề chính tại thời điểm ly hôn.' },
    area: { x: x0, y: 1444, w, h: 140 },
    badge: 'margin',
    input: { kind: 'choice', mark: 'circle', options: JOB_LABELS.map(([v, ko, l], i) => opt(v, ko, l, i % 2 === 0 ? jobX[0] : jobX[1], JOB_ROWS[Math.floor(i / 2)])) },
  },
];

const SURVEY_DATE = (kind: 'start' | 'end'): L => kind === 'start'
  ? { ko: '통계청 조사 항목이에요. 신고일과 관계없이 실제로 부부가 함께 살기 시작한 날을 적어요.', en: "For Statistics Korea's survey. The date you actually began living together, regardless of any report date.", zh: '这是统计厅的调查项目。与申报日无关，填写实际开始共同生活的日期。', ja: '統計庁の調査項目です。届出日とは関係なく、実際に同居を始めた日を書きます。', vi: 'Đây là mục khảo sát của Cục Thống kê. Ngày thực sự bắt đầu chung sống, không phụ thuộc ngày khai báo.' }
  : { ko: '통계청 조사 항목이에요. 신고일이나 재판 확정일과 관계없이 실제로 따로 살기 시작한 날을 적어요.', en: "For Statistics Korea's survey. The date you actually began living apart, regardless of the report or judgment date.", zh: '这是统计厅的调查项目。与申报日或判决确定日无关，填写实际开始分居的日期。', ja: '統計庁の調査項目です。届出日や裁判確定日とは関係なく、実際に別居を始めた日を書きます。', vi: 'Đây là mục khảo sát của Cục Thống kê. Ngày thực sự bắt đầu sống riêng, không phụ thuộc ngày khai báo hay ngày phán quyết.' };

const fields: FieldDef[] = [
  reportDateField(
    { x: 150, y: 168, w: 404, h: 21 },
    { x: 247, y: 169, w: 70, h: 19, align: 'right' },
    { x: 336, y: 169, w: 43, h: 19, align: 'right' },
    { x: 398, y: 169, w: 44, h: 19, align: 'right' },
  ),

  // ── ① 이혼당사자(신고인) ─────────────────────────────────
  ...partyFields(HUSBAND_SIDE),
  ...partyFields(WIFE_SIDE),

  // ── ② 부모(양부모) ───────────────────────────────────────
  ...parentFields(HUSBAND_SIDE),
  ...parentFields(WIFE_SIDE),

  // ── ③ 기타사항 ───────────────────────────────────────────
  otherNotesField({
    id: 'otherNotes', section: 'etc', koLabel: '③ 기타사항',
    extra: {
      ko: '예) 이 신고로 신분이 바뀌는 사람이 있으면 그 사람의 이름·출생연월일·등록기준지와 바뀌는 이유, 피성년후견인이 협의이혼하면 동의한 사람의 이름·출생연월일(서명은 종이에 직접).',
      en: 'e.g., if this report changes someone’s personal status, that person’s name, date of birth, registration base and the reason; if a person under adult guardianship divorces by agreement, the consenting person’s name and date of birth (signature by hand on paper).',
      zh: '例：如有因本申报而身份发生变化的人，填写其姓名·出生日期·登记基准地及变更原因；被成年监护人协议离婚时，填写同意人的姓名·出生日期（签名在纸上亲自完成）。',
      ja: '例）この届出で身分が変わる人がいる場合はその人の氏名・生年月日・登録基準地と変更の事由、被成年後見人が協議離婚する場合は同意者の氏名・生年月日（署名は紙に直接）。',
      vi: 'VD: nếu tờ khai này làm thay đổi thân phận của ai đó, ghi tên, ngày sinh, nơi đăng ký gốc và lý do; nếu người được giám hộ thành niên ly hôn thuận tình, ghi tên và ngày sinh người đồng ý (ký trực tiếp trên giấy).',
    },
    area: { x: 351, y: 665, w: 694, h: 29 },
    box: { x: 387, y: 667, w: 654, h: 25 },
  }),

  // ── ④ 재판확정일자 ───────────────────────────────────────
  textField({
    id: 'judgmentType', section: 'court', koLabel: '④ 재판확정일자 ( )',
    label: { ko: '조정·화해로 이혼한 경우 그 종류', en: 'If by mediation / settlement: its type', zh: '经调解·和解离婚时的种类', ja: '調停・和解による場合の種類', vi: 'Nếu qua hòa giải: loại hòa giải' },
    help: { ko: '조정이나 화해로 이혼이 정해진 경우에만 골라요. 판결이 확정된 경우나 협의이혼은 비워 두세요.', en: 'Only if the divorce was settled by mediation or reconciliation. Leave blank for a final judgment or a divorce by agreement.', zh: '仅在通过调解或和解确定离婚时选择。判决确定或协议离婚请留空。', ja: '調停や和解で離婚が決まった場合のみ選びます。判決確定や協議離婚の場合は空欄にします。', vi: 'Chỉ chọn khi ly hôn được quyết định qua hòa giải. Nếu là bản án có hiệu lực hoặc ly hôn thuận tình thì để trống.' },
    area: { x: 146, y: 695, w: 241, h: 48 },
    badge: 'margin',
    part: {
      box: { x: 160, y: 716, w: 164, h: 22, align: 'center' },
      options: [
        { value: '조정성립', label: { ko: '조정성립', en: 'Mediation concluded', zh: '调解成立', ja: '調停成立', vi: 'Hòa giải thành' } },
        { value: '조정에 갈음하는 결정확정', label: { ko: '조정에 갈음하는 결정확정', en: 'Decision in lieu of mediation became final', zh: '代替调解的决定确定', ja: '調停に代わる決定確定', vi: 'Quyết định thay hòa giải có hiệu lực' } },
        { value: '화해성립', label: { ko: '화해성립', en: 'Settlement concluded', zh: '和解成立', ja: '和解成立', vi: 'Hòa giải (thỏa thuận) thành' } },
        { value: '화해권고결정', label: { ko: '화해권고결정', en: 'Recommended-settlement decision', zh: '和解劝告决定', ja: '和解勧告決定', vi: 'Quyết định khuyến nghị hòa giải' } },
      ],
    },
  }),
  dateField({
    id: 'judgmentDate', section: 'court', koLabel: '④ 재판확정일자',
    label: { ko: '재판 확정일 (또는 조정·화해 성립일)', en: 'Date the judgment became final (or mediation / settlement date)', zh: '判决确定日（或调解·和解成立日）', ja: '裁判確定日（または調停・和解の成立日）', vi: 'Ngày bản án có hiệu lực (hoặc ngày hòa giải thành)' },
    help: { ko: '재판(조정·화해 포함)으로 이혼하는 경우에만 적어요. 협의이혼은 비워 두세요.', en: 'Only for a divorce by court (including mediation / settlement). Leave blank for a divorce by agreement.', zh: '仅在通过诉讼（含调解·和解）离婚时填写。协议离婚请留空。', ja: '裁判（調停・和解を含む）による離婚の場合のみ書きます。協議離婚は空欄にします。', vi: 'Chỉ ghi khi ly hôn qua tòa (kể cả hòa giải). Ly hôn thuận tình thì để trống.' },
    area: { x: 388, y: 695, w: 276, h: 48 },
    y: { x: 424, y: 704, w: 48, h: 30, align: 'right' },
    m: { x: 491, y: 704, w: 44, h: 30, align: 'right' },
    d: { x: 554, y: 704, w: 44, h: 30, align: 'right' },
  }),
  textField({
    id: 'judgmentCourt', section: 'court', koLabel: '④ 법원명',
    label: { ko: '법원 이름', en: 'Name of the court', zh: '法院名称', ja: '裁判所名', vi: 'Tên tòa án' },
    help: { ko: '재판한 법원 이름을 적어요. "법원"은 이미 인쇄돼 있어서 그 앞부분만 적으면 돼요. 예) 서울가정', en: 'Name of the court. "법원" (court) is already printed, so write only the part before it, e.g., 서울가정', zh: '填写法院名称。表格上已印有“법원”（法院），只需填写前面部分。例：서울가정', ja: '裁判所名を書きます。「法院（裁判所）」は印刷済みなので、その前の部分だけ韓国語で書きます。', vi: 'Tên tòa án. Chữ "법원" (tòa án) đã in sẵn nên chỉ ghi phần phía trước, VD: 서울가정' },
    area: { x: 743, y: 695, w: 302, h: 48 },
    part: { box: { x: 779, y: 704, w: 162, h: 30, align: 'center' }, korean: true, placeholder: '예) 서울가정' },
  }),

  // ── ⑤ 친권자 지정 ────────────────────────────────────────
  ...child(1, COL1, PAIR1),
  ...child(2, COL2, PAIR1),
  ...child(3, COL1, PAIR2),
  ...child(4, COL2, PAIR2),

  // ── ⑥ 신고인 출석여부 ────────────────────────────────────
  {
    id: 'attendance', section: 'attendance', koLabel: '⑥ 신고인 출석여부',
    label: { ko: '창구에 직접 나온 사람', en: 'Who is present at the counter', zh: '亲自到窗口的人', ja: '窓口に出頭した人', vi: 'Người có mặt tại quầy' },
    help: { ko: '창구에 직접 나온 신고인을 모두 골라요.', en: 'Choose every reporter present at the counter.', zh: '选择所有亲自到窗口的申报人。', ja: '窓口に直接来た届出人をすべて選びます。', vi: 'Chọn tất cả người khai báo có mặt tại quầy.' },
    area: { x: 351, y: 1078, w: 694, h: 34 },
    input: {
      kind: 'choice', mark: 'circle', multiple: true,
      options: [
        opt('husband', '남편(부)', { ko: '남편', en: 'Husband', zh: '丈夫', ja: '夫', vi: 'Chồng' }, 558, 1096),
        opt('wife', '아내(처)', { ko: '아내', en: 'Wife', zh: '妻子', ja: '妻', vi: 'Vợ' }, 760, 1096),
      ],
    },
  },

  // ── ⑦ 제출인 ─────────────────────────────────────────────
  submitterNameField({ id: 'submitterName', section: 'submitter', koLabel: '⑦ 제출인 성명', area: { x: 351, y: 1114, w: 265, h: 38 }, box: { x: 387, y: 1116, w: 225, h: 34, align: 'center' } }),
  submitterIdField({ id: 'submitterId', section: 'submitter', koLabel: '⑦ 제출인 주민등록번호', area: { x: 746, y: 1114, w: 299, h: 38 }, front: { x: 782, y: 1116, w: 106, h: 34, align: 'center' }, back: { x: 903, y: 1116, w: 140, h: 34, align: 'center' } }),

  // ── 인구동향조사 ─────────────────────────────────────────
  dateField({
    id: 'cohabitDate', section: 'survey', koLabel: '㉮ 실제 결혼 생활 시작일',
    label: { ko: '실제로 함께 살기 시작한 날', en: 'Date you actually began living together', zh: '实际开始共同生活的日期', ja: '実際に同居を始めた日', vi: 'Ngày thực sự bắt đầu chung sống' },
    help: SURVEY_DATE('start'),
    area: { x: 397, y: 1351, w: 240, h: 22 }, badge: 'margin',
    y: { x: 400, y: 1352, w: 90, h: 20, align: 'right' }, m: { x: 510, y: 1352, w: 26, h: 20, align: 'right' }, d: { x: 555, y: 1352, w: 26, h: 20, align: 'right' },
  }),
  dateField({
    id: 'separationDate', section: 'survey', koLabel: '㉯ 실제 이혼 연월일',
    label: { ko: '실제로 따로 살기 시작한 날', en: 'Date you actually began living apart', zh: '实际开始分居的日期', ja: '実際に別居を始めた日', vi: 'Ngày thực sự bắt đầu sống riêng' },
    help: SURVEY_DATE('end'),
    area: { x: 397, y: 1374, w: 240, h: 22 }, badge: 'margin',
    y: { x: 400, y: 1375, w: 90, h: 20, align: 'right' }, m: { x: 510, y: 1375, w: 26, h: 20, align: 'right' }, d: { x: 555, y: 1375, w: 26, h: 20, align: 'right' },
  }),
  textField({
    id: 'minorChildren', section: 'survey', koLabel: '㉰ 19세 미만 자녀 수',
    label: { ko: '19세 미만 자녀 수', en: 'Number of children under 19', zh: '未满19岁子女人数', ja: '19歳未満の子の数', vi: 'Số con dưới 19 tuổi' },
    help: { ko: '통계청 조사 항목이에요. 19세가 안 된 자녀가 몇 명인지 숫자로 적어요. 없으면 0이에요.', en: "For Statistics Korea's survey. How many children under 19, as a number (0 if none).", zh: '这是统计厅的调查项目。用数字填写未满19岁的子女人数，没有则填0。', ja: '統計庁の調査項目です。19歳未満の子の数を数字で書きます。いなければ0です。', vi: 'Đây là mục khảo sát của Cục Thống kê. Ghi số con dưới 19 tuổi (không có thì ghi 0).' },
    area: { x: 882, y: 1351, w: 160, h: 45 },
    part: { box: { x: 918, y: 1353, w: 100, h: 41, align: 'right' }, inputMode: 'numeric', placeholder: '0' },
  }),
  ...survey(HUSBAND_SIDE, [287, 409, 528], [287, 444], 278, 359),
  ...survey(WIFE_SIDE, [701, 822, 939], [701, 851], 690, 350),
];

export const divorceReport: FormDef = {
  id: 'divorce-report',
  title: { ko: '이혼신고서', en: 'Divorce Report', zh: '离婚申报书', ja: '離婚届', vi: 'Giấy báo ly hôn' },
  pages: [{ image: '/forms/divorce-report_ko.png', width: 1190, height: 1682 }],
  sections: [
    { id: 'meta',       label: { ko: '신고일',                 en: 'Report date',              zh: '申报日期',     ja: '届出日',         vi: 'Ngày khai báo' } },
    { id: 'party',      label: { ko: '① 이혼당사자(신고인)',   en: '① The couple (reporters)', zh: '① 离婚当事人', ja: '① 離婚当事者',   vi: '① Hai người ly hôn' } },
    { id: 'parents',    label: { ko: '② 부모(양부모)',         en: '② Parents',                zh: '② 父母',       ja: '② 父母',         vi: '② Bố mẹ' } },
    { id: 'etc',        label: { ko: '③ 기타사항',             en: '③ Other notes',            zh: '③ 其他事项',   ja: '③ その他事項',   vi: '③ Ghi chú khác' } },
    { id: 'court',      label: { ko: '④ 재판확정일자',         en: '④ Court judgment',         zh: '④ 判决确定',   ja: '④ 裁判確定',     vi: '④ Phán quyết của tòa' } },
    { id: 'custody',    label: { ko: '⑤ 친권자 지정',          en: '⑤ Parental authority',     zh: '⑤ 亲权人指定', ja: '⑤ 親権者指定',   vi: '⑤ Thân quyền' } },
    { id: 'attendance', label: { ko: '⑥ 신고인 출석여부',      en: '⑥ Attendance',             zh: '⑥ 申报人出席', ja: '⑥ 届出人の出頭', vi: '⑥ Có mặt tại quầy' } },
    { id: 'submitter',  label: { ko: '⑦ 제출인',               en: '⑦ Submitter',              zh: '⑦ 提交人',     ja: '⑦ 提出人',       vi: '⑦ Người nộp thay' } },
    { id: 'survey',     label: { ko: '인구동향조사',           en: 'Population survey',        zh: '人口动向调查', ja: '人口動向調査',   vi: 'Khảo sát dân số' } },
  ],
  fields,
};
