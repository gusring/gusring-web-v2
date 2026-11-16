import { textField, Who } from './common';
import { cell, ownerFields, signFields } from './motorcycle-common';
import { FieldDef, FormDef, L } from './types';

// ─────────────────────────────────────────────────────────────
// 이륜자동차 신고사항변경신고서 [자동차관리법 시행규칙 별지 제65호서식] — v1 서식 39번
// 좌표는 public/forms/motorcycle-change-report_ko.png(1190×1682) 기준.
// 한국어 작성 방법 이미지가 없어, 서식에 인쇄된 칸 이름·첨부서류·유의사항만 근거로 안내한다.
// 접수번호·처리란, 담당공무원 확인 사항, 서명(행정정보 공동이용 동의서 포함)은 입력받지 않는다.
// ─────────────────────────────────────────────────────────────

const APPLICANT: Who = { ko: '신청인', en: 'the applicant', zh: '申请人', ja: '申請人', vi: 'người nộp đơn' };

/** 유의사항 1 — 변경 신고 기간 */
const DEADLINE: L = {
  ko: ' 사용본거지나 소유자 성명(명칭)이 바뀌면 30일 안에, 매매는 15일, 증여는 20일 안에, 상속은 상속이 시작된 날이 속한 달의 말일부터 6개월 안에, 그 밖의 경우는 사유가 생긴 날부터 15일 안에 신고해요. 늦으면 과태료를 물 수 있어요.',
  en: ' Deadlines: change of principal place of use or owner name — within 30 days; sale — 15 days; gift — 20 days; inheritance — 6 months from the end of the month inheritance began; other cases — 15 days from the cause. Late reports may be fined.',
  zh: '使用本据地或所有人姓名（名称）变更须在30日内申报；买卖15日内，赠与20日内，继承自继承开始之日所属月末起6个月内，其他情况自原因发生之日起15日内。逾期可能被处以罚款。',
  ja: '使用の本拠地や所有者の氏名（名称）が変わったら30日以内、売買は15日以内、贈与は20日以内、相続は相続開始日の属する月の末日から6か月以内、その他は理由が生じた日から15日以内に届け出ます。遅れると過料を科されることがあります。',
  vi: ' Thời hạn: đổi nơi sử dụng chính hoặc tên chủ sở hữu — trong 30 ngày; mua bán — 15 ngày; tặng cho — 20 ngày; thừa kế — 6 tháng kể từ cuối tháng bắt đầu thừa kế; trường hợp khác — 15 ngày kể từ ngày phát sinh lý do. Khai muộn có thể bị phạt.',
};

const fields: FieldDef[] = [
  ...ownerFields({ left: 220, right: 1079, rows: [260, 327, 398], idX: 606, phoneX: 806 }),
  textField({
    id: 'plate', section: 'change', koLabel: '이륜자동차번호',
    label: { ko: '이륜자동차번호 (번호판)', en: 'Motorcycle number (license plate)', zh: '二轮汽车号码（车牌）', ja: '二輪自動車番号（ナンバープレート）', vi: 'Biển số xe máy' },
    help: { ko: '번호판에 적힌 이륜자동차번호를 그대로 적어요.', en: 'The motorcycle number exactly as on the license plate.', zh: '按车牌上的号码照写。', ja: 'ナンバープレートに書かれた番号をそのまま書きます。', vi: 'Ghi đúng số trên biển số xe máy.' },
    area: cell(115, 409, 716, 466), badgeAt: { x: 698, y: 428 },
    part: { key: 'plate', box: { x: 262, y: 416, w: 410, h: 44, align: 'center' } },
  }),
  textField({
    id: 'power', section: 'change', koLabel: '총배기량 또는 최고정격출력',
    label: { ko: '총배기량 또는 최고정격출력', en: 'Total engine displacement or maximum rated output', zh: '总排气量或最高额定输出功率', ja: '総排気量または最高定格出力', vi: 'Tổng dung tích xi-lanh hoặc công suất định mức tối đa' },
    help: { ko: '이륜자동차의 총배기량 또는 최고정격출력을 단위와 함께 적어요.', en: 'The total engine displacement or the maximum rated output of the motorcycle, with the unit.', zh: '填写二轮汽车的总排气量或最高额定输出功率，并注明单位。', ja: '二輪自動車の総排気量または最高定格出力を単位と一緒に書きます。', vi: 'Tổng dung tích xi-lanh hoặc công suất định mức tối đa của xe máy, ghi kèm đơn vị.' },
    area: cell(716, 409, 1079, 466), badgeAt: { x: 1061, y: 428 },
    part: { key: 'power', box: { x: 730, y: 436, w: 300, h: 26, align: 'center' }, placeholder: '예) 249cc' },
  }),
  textField({
    id: 'before', section: 'change', koLabel: '변경내용 변경전',
    label: { ko: '바뀌기 전 내용', en: 'Before the change', zh: '变更前', ja: '変更前', vi: 'Trước khi thay đổi' },
    help: { ko: '바뀌기 전의 내용을 한국어로 적어요. 바뀐 것을 증명하는 서류 1부를 함께 내요.' + DEADLINE.ko, en: 'What it was before the change, in Korean. Attach 1 document proving the change.' + DEADLINE.en, zh: '用韩文填写变更前的内容。须附1份证明变更的文件。' + DEADLINE.zh, ja: '変更前の内容を韓国語で書きます。変更を証明する書類1部を添付します。' + DEADLINE.ja, vi: 'Nội dung trước khi thay đổi, ghi bằng tiếng Hàn. Nộp kèm 1 bản giấy tờ chứng minh thay đổi.' + DEADLINE.vi },
    area: cell(220, 466, 1078, 523), badgeAt: { x: 1060, y: 485 },
    part: { key: 'text', box: { x: 300, y: 472, w: 740, h: 46, align: 'left' }, korean: true, placeholder: '예) 사용본거지: 서울시 금천구 시흥대로73길 70' },
  }),
  textField({
    id: 'after', section: 'change', koLabel: '변경내용 변경후',
    label: { ko: '바뀐 뒤 내용', en: 'After the change', zh: '变更后', ja: '変更後', vi: 'Sau khi thay đổi' },
    help: { ko: '바뀐 뒤의 내용을 한국어로 적어요. 번호판에 표시된 관할 관청이 달라졌으면 번호판도 함께 내요.', en: 'What it is after the change, in Korean. If the office shown on the license plate has changed, also hand in the plate.', zh: '用韩文填写变更后的内容。车牌上标示的管辖机关变更时，须一并交回车牌。', ja: '変更後の内容を韓国語で書きます。ナンバープレートに表示された管轄官庁が変わった場合は、プレートも一緒に出します。', vi: 'Nội dung sau khi thay đổi, ghi bằng tiếng Hàn. Nếu cơ quan quản lý ghi trên biển số thay đổi, nộp kèm biển số.' },
    area: cell(220, 523, 1078, 591), badgeAt: { x: 1060, y: 542 },
    part: { key: 'text', box: { x: 300, y: 530, w: 740, h: 52, align: 'left' }, korean: true, placeholder: '예) 사용본거지: 서울시 금천구 독산로 100' },
  }),
  ...signFields({
    who: APPLICANT, koWho: '신청',
    date: { area: { x: 760, y: 651, w: 320, h: 32 }, badgeAt: { x: 742, y: 666 }, y: { x: 770, y: 654, w: 86, h: 26, align: 'right' }, m: { x: 880, y: 654, w: 72, h: 26, align: 'right' }, d: { x: 975, y: 654, w: 75, h: 26, align: 'right' } },
    name: { box: { x: 553, y: 705, w: 400, h: 26, align: 'center' }, badgeAt: { x: 414, y: 718 } },
    birth: { box: { x: 593, y: 748, w: 300, h: 26, align: 'left' }, badgeAt: { x: 487, y: 761 } },
  }),
];

export const motorcycleChangeReport: FormDef = {
  id: 'motorcycle-change-report',
  title: { ko: '이륜자동차 신고사항변경신고서', en: 'Motorcycle Change Report', zh: '二轮汽车申报事项变更申报书', ja: '二輪自動車届出事項変更届', vi: 'Tờ khai thay đổi thông tin xe máy' },
  pages: [{ image: '/forms/motorcycle-change-report_ko.png', width: 1190, height: 1682 }],
  sections: [
    { id: 'owner', label: { ko: '소유자', en: 'Owner', zh: '所有人', ja: '所有者', vi: 'Chủ sở hữu' } },
    { id: 'change', label: { ko: '이륜자동차·변경 내용', en: 'Motorcycle and change', zh: '二轮汽车·变更内容', ja: '二輪自動車・変更内容', vi: 'Xe máy và nội dung thay đổi' } },
    { id: 'sign', label: { ko: '신청일·신청인', en: 'Date and applicant', zh: '申请日期·申请人', ja: '申請日・申請人', vi: 'Ngày và người nộp' } },
  ],
  fields,
};
