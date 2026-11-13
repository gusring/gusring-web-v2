import { opt, textField, topRight, Who } from './common';
import { cell, ownerFields, signFields } from './motorcycle-common';
import { FieldDef, FormDef } from './types';

// ─────────────────────────────────────────────────────────────
// 이륜자동차 사용폐지신고서 [자동차관리법 시행규칙 별지 제68호서식] — v1 서식 38번
// 좌표는 public/forms/motorcycle-disuse-report_ko.png(1190×1682) 기준.
// 한국어 작성 방법 이미지가 없어, 서식에 인쇄된 칸 이름·첨부서류·유의사항만 근거로 안내한다.
// 접수번호·처리란, 담당공무원 확인 사항, 서명(행정정보 공동이용 동의서 포함)은 입력받지 않는다.
// ─────────────────────────────────────────────────────────────

const APPLICANT: Who = { ko: '신청인', en: 'the applicant', zh: '申请人', ja: '申請人', vi: 'người nộp đơn' };

const plate = cell(235, 415, 1079, 477);
const reason = cell(235, 477, 1079, 558);

const fields: FieldDef[] = [
  ...ownerFields({ left: 235, right: 1079, rows: [266, 333, 404], idX: 611, phoneX: 795 }),
  textField({
    id: 'plate', section: 'report', koLabel: '이륜자동차번호',
    label: { ko: '이륜자동차번호 (번호판)', en: 'Motorcycle number (license plate)', zh: '二轮汽车号码（车牌）', ja: '二輪自動車番号（ナンバープレート）', vi: 'Biển số xe máy' },
    help: { ko: '번호판에 적힌 이륜자동차번호를 그대로 적어요.', en: 'The motorcycle number exactly as on the license plate.', zh: '按车牌上的号码照写。', ja: 'ナンバープレートに書かれた番号をそのまま書きます。', vi: 'Ghi đúng số trên biển số xe máy.' },
    area: plate, badgeAt: topRight(plate),
    part: { key: 'plate', box: { x: 400, y: 432, w: 560, h: 36, align: 'center' } },
  }),
  {
    id: 'reason', section: 'report', koLabel: '신고사유 [ ] 용도폐지 [ ] 분실·멸실 [ ] 도난 [ ] 기타',
    label: { ko: '신고 사유', en: 'Reason for the report', zh: '申报原因', ja: '届出の理由', vi: 'Lý do khai báo' },
    help: {
      ko: '사용을 그만두는 이유를 골라요. 사유가 생긴 날부터 15일 안에 신고해야 하고, 늦으면 과태료를 물 수 있어요. 번호판을 함께 내요(멸실·분실·도난은 제외). 분실·도난은 경찰서에서 받은 분실(도난)신고확인서를, 멸실이나 그 밖의 사유는 그 사유를 증명하는 서류를 함께 내요.',
      en: 'Choose why you stop using it. Report within 15 days of the cause, or you may be fined. Return the license plate (except when destroyed, lost or stolen). For loss or theft, attach the loss/theft report confirmation from the police; for destruction or other reasons, attach proof of the reason.',
      zh: '选择停止使用的原因。须在原因发生之日起15日内申报，逾期可能被处以罚款。须一并交回车牌（灭失·丢失·被盗除外）。丢失·被盗须附警察署出具的丢失（被盗）申报确认书；灭失或其他原因须附证明该原因的文件。',
      ja: '使用をやめる理由を選びます。理由が生じた日から15日以内に届け出る必要があり、遅れると過料を科されることがあります。ナンバープレートを一緒に返納します（滅失・紛失・盗難を除く）。紛失・盗難は警察署で受けた紛失（盗難）届出確認書を、滅失やその他の理由はその理由を証明する書類を添付します。',
      vi: 'Chọn lý do ngừng sử dụng. Phải khai báo trong vòng 15 ngày kể từ ngày phát sinh lý do, nếu muộn có thể bị phạt. Nộp lại biển số (trừ khi bị hủy hoại, mất hoặc bị trộm). Mất hoặc bị trộm: nộp giấy xác nhận trình báo của đồn cảnh sát; hủy hoại hoặc lý do khác: nộp giấy tờ chứng minh lý do.',
    },
    area: reason, badgeAt: topRight(reason),
    input: {
      kind: 'choice', mark: 'check',
      options: [
        opt('scrap', '용도폐지', { ko: '용도폐지 (더 이상 쓰지 않음)', en: 'No longer used', zh: '停止用途', ja: '用途廃止', vi: 'Không sử dụng nữa' }, 579, 512),
        opt('lost', '분실·멸실', { ko: '분실·멸실 (잃어버림·없어짐)', en: 'Lost or destroyed', zh: '丢失·灭失', ja: '紛失・滅失', vi: 'Bị mất hoặc bị hủy hoại' }, 708, 512),
        opt('stolen', '도난', { ko: '도난', en: 'Stolen', zh: '被盗', ja: '盗難', vi: 'Bị trộm' }, 854, 512),
        opt('other', '기타', { ko: '기타', en: 'Other', zh: '其他', ja: 'その他', vi: 'Khác' }, 951, 512),
      ],
    },
  },
  ...signFields({
    who: APPLICANT, koWho: '신청',
    date: { area: { x: 760, y: 649, w: 320, h: 32 }, badgeAt: { x: 742, y: 663 }, y: { x: 770, y: 651, w: 86, h: 26, align: 'right' }, m: { x: 880, y: 651, w: 72, h: 26, align: 'right' }, d: { x: 975, y: 651, w: 75, h: 26, align: 'right' } },
    name: { box: { x: 552, y: 702, w: 400, h: 26, align: 'center' }, badgeAt: { x: 413, y: 715 } },
    birth: { box: { x: 592, y: 756, w: 300, h: 26, align: 'left' }, badgeAt: { x: 485, y: 769 } },
  }),
];

export const motorcycleDisuseReport: FormDef = {
  id: 'motorcycle-disuse-report',
  title: { ko: '이륜자동차 사용폐지신고서', en: 'Motorcycle Disuse Report', zh: '二轮汽车使用废止申报书', ja: '二輪自動車使用廃止届', vi: 'Tờ khai hủy sử dụng xe máy' },
  pages: [{ image: '/forms/motorcycle-disuse-report_ko.png', width: 1190, height: 1682 }],
  sections: [
    { id: 'owner', label: { ko: '소유자', en: 'Owner', zh: '所有人', ja: '所有者', vi: 'Chủ sở hữu' } },
    { id: 'report', label: { ko: '신고 내용', en: 'Report details', zh: '申报内容', ja: '届出内容', vi: 'Nội dung khai báo' } },
    { id: 'sign', label: { ko: '신청일·신청인', en: 'Date and applicant', zh: '申请日期·申请人', ja: '申請日・申請人', vi: 'Ngày và người nộp' } },
  ],
  fields,
};
