import { textField, topRight, Who } from './common';
import { below, cell, ownerFields, signFields } from './motorcycle-common';
import { FieldDef, FormDef } from './types';

// ─────────────────────────────────────────────────────────────
// 이륜자동차사용신고서 [자동차관리법 시행규칙 별지 제63호서식] — v1 서식 37번
// 좌표는 public/forms/motorcycle-use-report_ko.png(1190×1682) 기준.
// 한국어 작성 방법 이미지가 없어, 서식에 인쇄된 칸 이름·첨부 서류·유의 사항만 근거로 안내한다.
// 접수번호·처리란과 서명은 입력받지 않는다.
// ─────────────────────────────────────────────────────────────

const REPORTER: Who = { ko: '신고인', en: 'the person reporting', zh: '申报人', ja: '届出人', vi: 'người khai báo' };

const model = cell(230, 402, 578, 486);
const power = cell(578, 402, 1089, 486);
const base = cell(230, 486, 1089, 572);

const fields: FieldDef[] = [
  ...ownerFields({ left: 230, right: 1089, rows: [266, 328, 390], idX: 578, phoneX: 772 }),
  textField({
    id: 'model', section: 'motorcycle', koLabel: '차명 (예시 : 데이스타 250)',
    label: { ko: '차명 (모델 이름)', en: 'Model name', zh: '车名（型号）', ja: '車名（モデル名）', vi: 'Tên xe (tên mẫu)' },
    help: { ko: '이륜자동차의 모델 이름을 적어요. 서식에 적힌 예: 데이스타 250', en: 'The model name of the motorcycle. Example printed on the form: 데이스타 250.', zh: '填写二轮汽车的型号名称。表格上的示例：데이스타 250。', ja: '二輪自動車のモデル名を書きます。様式に書かれた例：デイスター250にあたる韓国語表記。', vi: 'Tên mẫu xe máy. Ví dụ in trên mẫu đơn: 데이스타 250.' },
    area: model, badgeAt: topRight(model),
    part: { key: 'model', box: below(model, 34), placeholder: '예) 데이스타 250' },
  }),
  textField({
    id: 'power', section: 'motorcycle', koLabel: '총배기량 또는 최고정격출력',
    label: { ko: '총배기량 또는 최고정격출력', en: 'Total engine displacement or maximum rated output', zh: '总排气量或最高额定输出功率', ja: '総排気量または最高定格出力', vi: 'Tổng dung tích xi-lanh hoặc công suất định mức tối đa' },
    help: { ko: '이륜자동차의 총배기량 또는 최고정격출력을 단위와 함께 적어요.', en: 'The total engine displacement or the maximum rated output of the motorcycle, with the unit.', zh: '填写二轮汽车的总排气量或最高额定输出功率，并注明单位。', ja: '二輪自動車の総排気量または最高定格出力を単位と一緒に書きます。', vi: 'Tổng dung tích xi-lanh hoặc công suất định mức tối đa của xe máy, ghi kèm đơn vị.' },
    area: power, badgeAt: topRight(power),
    part: { key: 'power', box: below(power, 34), placeholder: '예) 249cc' },
  }),
  textField({
    id: 'base', section: 'motorcycle', koLabel: '사용 본거지 (주민등록지, 법인 등의 주 사무소 또는 지점 소재지)',
    label: { ko: '사용 본거지', en: 'Principal place of use', zh: '使用本据地', ja: '使用の本拠地', vi: 'Nơi sử dụng chính' },
    help: { ko: '서식에 적힌 대로, 개인은 주민등록지(주소), 법인 등은 주 사무소나 지점이 있는 곳을 한국어로 적어요.', en: 'As printed on the form: for an individual, the registered address; for a corporation, the location of its main office or branch. In Korean.', zh: '按表格所示：个人填写居民登记地（地址），法人等填写主要办公室或分支机构所在地。用韩文填写。', ja: '様式のとおり、個人は住民登録地（住所）、法人などは主たる事務所または支店の所在地を韓国語で書きます。', vi: 'Theo mẫu đơn: cá nhân ghi nơi đăng ký cư trú (địa chỉ); pháp nhân ghi nơi có trụ sở chính hoặc chi nhánh. Ghi bằng tiếng Hàn.' },
    area: base, badgeAt: topRight(base),
    part: { key: 'address', box: below(base, 36), korean: true, placeholder: '예) 서울시 금천구 시흥대로73길 70' },
    copyFrom: [{ field: 'ownerAddress', label: { ko: '소유자 주소와 같아요', en: 'Same as the owner’s address', zh: '与所有人地址相同', ja: '所有者の住所と同じ', vi: 'Giống địa chỉ chủ sở hữu' }, map: { address: 'address' } }],
  }),
  ...signFields({
    who: REPORTER, koWho: '신고',
    date: { area: { x: 770, y: 648, w: 318, h: 32 }, badgeAt: { x: 752, y: 663 }, y: { x: 780, y: 651, w: 86, h: 26, align: 'right' }, m: { x: 890, y: 651, w: 72, h: 26, align: 'right' }, d: { x: 985, y: 651, w: 75, h: 26, align: 'right' } },
    name: { box: { x: 560, y: 708, w: 400, h: 26, align: 'center' }, badgeAt: { x: 420, y: 721 } },
    birth: { box: { x: 600, y: 762, w: 300, h: 26, align: 'left' }, badgeAt: { x: 492, y: 775 } },
  }),
];

export const motorcycleUseReport: FormDef = {
  id: 'motorcycle-use-report',
  title: { ko: '이륜자동차 사용신고서', en: 'Motorcycle Use Report', zh: '二轮汽车使用申报书', ja: '二輪自動車使用届', vi: 'Tờ khai sử dụng xe máy' },
  pages: [{ image: '/forms/motorcycle-use-report_ko.png', width: 1190, height: 1682 }],
  sections: [
    { id: 'owner', label: { ko: '소유자', en: 'Owner', zh: '所有人', ja: '所有者', vi: 'Chủ sở hữu' } },
    { id: 'motorcycle', label: { ko: '이륜자동차', en: 'Motorcycle', zh: '二轮汽车', ja: '二輪自動車', vi: 'Xe máy' } },
    { id: 'sign', label: { ko: '신고일·신고인', en: 'Date and reporter', zh: '申报日期·申报人', ja: '届出日・届出人', vi: 'Ngày và người khai' } },
  ],
  fields,
};
