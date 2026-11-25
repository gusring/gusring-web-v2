// 자주 쓰는 칸 틀 — 고른 뒤 서식 위에 한 번 끌면 값 상자·5개 국어 이름·안내까지 들어간다
// 문구는 기존 서식에서 쓰던 번역을 「본인·신고인」 같은 주어 없이 옮겼다. 칸에 맞게(예: 아버지 이름) 고쳐 쓰면 된다.

import { Box, FieldDef, L } from '../../forms/types';
import { defaultInput, emptyL, inner, split } from './geometry';

export interface FieldTemplate {
  key: string;
  /** 메뉴에 보일 이름 */
  name: string;
  /** 메뉴의 짧은 설명 */
  desc: string;
  /** 칸 id 바탕 (겹치면 뒤에 숫자) */
  idBase: string;
  build: (area: Box) => Pick<FieldDef, 'koLabel' | 'label' | 'help' | 'input'>;
}

const NAME_HELP: L = {
  ko: '이름을 한글로 적어요. 외국인이면 여권·외국인등록증의 이름을 한글로 옮겨 적어요.',
  en: 'Name in Korean letters (Hangul). For a foreign national, transcribe the name on the passport / residence card into Hangul.',
  zh: '用韩文填写姓名。外国人请将护照/外国人登录证上的姓名按发音写成韩文。',
  ja: '氏名をハングルで書きます。外国人の場合、パスポート・外国人登録証の氏名をハングル表記で書きます。',
  vi: 'Ghi họ tên bằng chữ Hàn (Hangul). Nếu là người nước ngoài, phiên âm tên trên hộ chiếu / thẻ người nước ngoài sang Hangul.',
};
const SURNAME: L = { ko: '성', en: 'Surname', zh: '姓', ja: '姓', vi: 'Họ' };
const GIVEN: L = { ko: '이름', en: 'Given name', zh: '名', ja: '名', vi: 'Tên' };

export const FIELD_TEMPLATES: FieldTemplate[] = [
  {
    key: 'name',
    name: '성명 (한글)',
    desc: '성 · 이름 두 칸, 한글만',
    idBase: 'name',
    build: (area) => {
      const [a, b] = split(inner(area), [1, 1]);
      return {
        koLabel: '성명 (한글)',
        label: { ko: '이름 (한글)', en: 'Name (Hangul)', zh: '姓名（韩文）', ja: '氏名（ハングル）', vi: 'Họ tên (Hangul)' },
        help: NAME_HELP,
        input: {
          kind: 'text',
          parts: [
            { key: 'surname', box: a, label: SURNAME, placeholder: '예) 응우옌', hangul: true },
            { key: 'given', box: b, label: GIVEN, placeholder: '예) 반안', hangul: true },
          ],
        },
      };
    },
  },
  {
    key: 'nameHanja',
    name: '성명 (한자)',
    desc: '성 · 이름 두 칸',
    idBase: 'nameHanja',
    build: (area) => {
      const [a, b] = split(inner(area), [1, 1]);
      return {
        koLabel: '성명 (한자)',
        label: { ko: '이름 (한자)', en: 'Name (Chinese characters)', zh: '姓名（汉字）', ja: '氏名（漢字）', vi: 'Họ tên (chữ Hán)' },
        help: {
          ko: '한자 이름이 있을 때만 적어요. 없으면 비워 두세요.',
          en: 'Only if there is a name in Chinese characters; otherwise leave it blank.',
          zh: '仅在有汉字姓名时填写，没有可留空。',
          ja: '漢字の氏名がある場合のみ書き、なければ空欄にします。',
          vi: 'Chỉ ghi nếu có tên bằng chữ Hán; nếu không thì để trống.',
        },
        input: {
          kind: 'text',
          parts: [
            { key: 'surname', box: a, label: { ...SURNAME, ko: '성 (한자)' }, placeholder: '예) 金' },
            { key: 'given', box: b, label: { ...GIVEN, ko: '이름 (한자)' }, placeholder: '예) 吉洞' },
          ],
        },
      };
    },
  },
  {
    key: 'idnum',
    name: '주민·외국인등록번호',
    desc: '앞자리 · 뒷자리 두 칸',
    idBase: 'idNumber',
    build: (area) => ({
      koLabel: '주민등록번호',
      label: { ko: '주민등록번호 / 외국인등록번호', en: 'Resident / alien registration no.', zh: '居民登录号 / 外国人登录号', ja: '住民登録番号／外国人登録番号', vi: 'Số đăng ký cư trú / người nước ngoài' },
      help: {
        ko: '한국인은 주민등록번호, 외국인은 외국인등록번호(외국인등록증 앞면 13자리)를 적어요. 없으면 국내거소신고번호나 생년월일을 적어요.',
        en: 'Koreans: resident registration number. Foreign nationals: alien registration number (13 digits on the front of the residence card). If you have neither, write your domestic residence report number or date of birth.',
        zh: '韩国人填写居民登录号，外国人填写外国人登录号（外国人登录证正面13位）。若都没有，填写国内居所申报号或出生日期。',
        ja: '韓国人は住民登録番号、外国人は外国人登録番号（外国人登録証表面の13桁）を書きます。ない場合は国内居所申告番号または生年月日を書きます。',
        vi: 'Người Hàn: số đăng ký cư trú. Người nước ngoài: số đăng ký người nước ngoài (13 số ở mặt trước thẻ). Nếu không có, ghi số khai báo cư trú trong nước hoặc ngày sinh.',
      },
      input: defaultInput('idnum', area),
    }),
  },
  {
    key: 'address',
    name: '주소',
    desc: '한 칸, 한국어로',
    idBase: 'address',
    build: (area) => ({
      koLabel: '주소',
      label: { ko: '주소', en: 'Address', zh: '地址', ja: '住所', vi: 'Địa chỉ' },
      help: { ko: '주소를 한국어로 적어요.', en: 'Address, written in Korean.', zh: '用韩文填写地址。', ja: '住所を韓国語で書きます。', vi: 'Ghi địa chỉ bằng tiếng Hàn.' },
      input: { kind: 'text', parts: [{ key: 'address', box: inner(area), placeholder: '예) 서울시 금천구 시흥대로73길 70', korean: true }] },
    }),
  },
  {
    key: 'phone',
    name: '전화번호',
    desc: '한 칸, 전화 자판',
    idBase: 'phone',
    build: (area) => ({
      koLabel: '전화번호',
      label: { ko: '전화번호', en: 'Phone number', zh: '电话号码', ja: '電話番号', vi: 'Số điện thoại' },
      help: {
        ko: '연락 가능한 휴대전화 번호를 적어요.',
        en: 'A mobile number where you can be reached.',
        zh: '填写可以联系到的手机号码。',
        ja: '連絡のつく携帯電話番号を書きます。',
        vi: 'Số điện thoại di động có thể liên lạc được.',
      },
      input: { kind: 'text', parts: [{ key: 'phone', box: inner(area), placeholder: '010-1234-5678', inputMode: 'tel' }] },
    }),
  },
  {
    key: 'email',
    name: '이메일',
    desc: '한 칸, 선택 사항',
    idBase: 'email',
    build: (area) => ({
      koLabel: '이메일',
      label: { ko: '이메일', en: 'Email', zh: '电子邮箱', ja: 'メールアドレス', vi: 'Email' },
      help: { ko: '선택 사항이에요.', en: 'Optional.', zh: '选填。', ja: '任意です。', vi: 'Không bắt buộc.' },
      input: { kind: 'text', parts: [{ key: 'email', box: inner(area), placeholder: 'name@example.com', inputMode: 'email' }] },
    }),
  },
  {
    key: 'reportDate',
    name: '신고일',
    desc: '「년 월 일」이 인쇄된 칸',
    idBase: 'reportDate',
    build: (area) => ({
      koLabel: '신고일',
      label: { ko: '신고하는 날짜', en: 'Date of report', zh: '申报日期', ja: '届出日', vi: 'Ngày khai báo' },
      help: {
        ko: '이 신고서를 제출하는 날짜예요. 보통 오늘 날짜를 적어요.',
        en: "The date you submit this report. Usually today's date.",
        zh: '提交本申报书的日期，通常填写今天的日期。',
        ja: 'この届出を提出する日付です。通常は今日の日付を書きます。',
        vi: 'Ngày bạn nộp tờ khai này. Thường là ngày hôm nay.',
      },
      input: defaultInput('date', area),
    }),
  },
  {
    key: 'date',
    name: '날짜',
    desc: '「년 월 일」이 인쇄된 칸',
    idBase: 'date',
    build: (area) => ({
      koLabel: '년 월 일',
      label: { ko: '날짜', en: 'Date', zh: '日期', ja: '日付', vi: 'Ngày' },
      help: { ko: '날짜를 적어요.', en: 'Write the date.', zh: '填写日期。', ja: '日付を書きます。', vi: 'Ghi ngày.' },
      input: defaultInput('date', area),
    }),
  },
  {
    key: 'origin',
    name: '등록기준지',
    desc: '외국인은 나라, 한국인은 주소',
    idBase: 'origin',
    build: (area) => ({
      koLabel: '등록기준지',
      label: { ko: '국적 (등록기준지)', en: 'Nationality (registration base)', zh: '国籍（登记基准地）', ja: '国籍（登録基準地）', vi: 'Quốc tịch (nơi đăng ký gốc)' },
      help: {
        ko: '외국인이면 국적(나라 이름)을 골라요. 한국인이면 가족관계등록부의 등록기준지(옛 본적) 주소를 적어요.',
        en: 'For a foreign national, choose the nationality (country). For a Korean national, write the registration base address (formerly "bonjeok") from the family relation register.',
        zh: '外国人请选择国籍（国家）。韩国人填写家族关系登记簿上的登记基准地（原本籍）地址。',
        ja: '外国人の場合は国籍（国名）を選びます。韓国人の場合は家族関係登録簿の登録基準地（旧本籍）の住所を書きます。',
        vi: 'Nếu là người nước ngoài, chọn quốc tịch (tên nước). Nếu là người Hàn, ghi địa chỉ nơi đăng ký gốc (bản quán cũ) trong sổ đăng ký quan hệ gia đình.',
      },
      input: { kind: 'country', box: inner(area), allowKorea: true },
    }),
  },
  {
    key: 'nationality',
    name: '국적',
    desc: '나라 고르기 (한국이면 「대한민국」)',
    idBase: 'nationality',
    build: (area) => ({
      koLabel: '국적',
      label: { ko: '국적', en: 'Nationality', zh: '国籍', ja: '国籍', vi: 'Quốc tịch' },
      help: {
        ko: '국적(나라)을 골라요. 목록에 없으면 「목록에 없어요」를 고르고 나라 이름을 한국어로 적어요.',
        en: 'Choose the nationality (country). If it is not listed, choose "Not listed" and type the country name in Korean.',
        zh: '选择国籍（国家）。列表中没有时，选择“列表中没有”并用韩文填写国名。',
        ja: '国籍（国）を選びます。一覧にない場合は「リストにない」を選び、国名を韓国語で書きます。',
        vi: 'Chọn quốc tịch (nước). Nếu không có trong danh sách, chọn "Không có trong danh sách" và nhập tên nước bằng tiếng Hàn.',
      },
      input: { kind: 'country', box: inner(area), allowKorea: 'name' },
    }),
  },
  {
    key: 'choice',
    name: '선택 (○ 표시)',
    desc: '선택지를 서식 위에 찍기',
    idBase: 'choice',
    build: (area) => ({ koLabel: '', label: emptyL(), help: emptyL(), input: defaultInput('choice', area) }),
  },
  {
    key: 'blank',
    name: '빈 글자 칸',
    desc: '이름·안내를 직접 적기',
    idBase: 'field',
    build: (area) => ({ koLabel: '', label: emptyL(), help: emptyL(), input: defaultInput('text', area) }),
  },
];

export const templateOf = (key?: string) => FIELD_TEMPLATES.find((t) => t.key === key) ?? FIELD_TEMPLATES[FIELD_TEMPLATES.length - 1];
