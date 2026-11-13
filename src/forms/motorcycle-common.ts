import { copyNameFrom, dateField, nameField, textField, topRight, Who } from './common';
import { Box, FieldDef, L } from './types';

// ─────────────────────────────────────────────────────────────
// 이륜자동차 서식(37·38·39번)이 같이 쓰는 칸 — 소유자 표와 아래 신고일·신고인 줄.
// 세 서식 모두 한국어 작성 방법 이미지가 없어, 서식에 인쇄된 칸 이름·유의 사항만 근거로 안내한다.
// ─────────────────────────────────────────────────────────────

export const OWNER: Who = { ko: '소유자', en: 'the owner', zh: '所有人', ja: '所有者', vi: 'chủ sở hữu' };

export const cell = (x: number, y: number, x2: number, y2: number): Box => ({ x: x + 1, y: y + 1, w: x2 - x - 2, h: y2 - y - 2 });
/** 칸 이름이 왼쪽 위에 있는 칸 — 이름 아래 남은 자리 */
export const below = (a: Box, top = 26): Box => ({ x: a.x + 14, y: a.y + top, w: a.w - 60, h: a.h - top - 4, align: 'center' });

/** 유의 사항 2 — (휴대)전화번호 */
const PHONE_HELP: L = {
  ko: '이륜자동차 관리에 필요한 안내를 받을 번호예요. 원하지 않으면 적지 않아도 돼요. 번호가 바뀌면 신고한 관청에 알려요.',
  en: 'Used to send you information needed to manage the motorcycle. You may leave it blank if you prefer. Tell the office if the number changes.',
  zh: '用于向您提供二轮汽车管理所需的通知。不愿意可以不填。号码变更时请告知申报机关。',
  ja: '二輪自動車の管理に必要な案内を受け取る番号です。希望しなければ書かなくても構いません。番号が変わったら届け出た役所に知らせます。',
  vi: 'Dùng để thông báo những điều cần thiết cho việc quản lý xe máy. Không muốn thì có thể để trống. Nếu đổi số, hãy báo cho cơ quan đã khai báo.',
};

/** 소유자 표: 성명(명칭) | 주민등록번호(법인등록번호) / 주소 | (휴대)전화번호 */
export const ownerFields = (c: { left: number; right: number; rows: [number, number, number]; idX: number; phoneX: number }): FieldDef[] => {
  const [top, mid, bot] = c.rows;
  const name = cell(c.left, top, c.idX, mid);
  const id = cell(c.idX, top, c.right, mid);
  const addr = cell(c.left, mid, c.phoneX, bot);
  const phone = cell(c.phoneX, mid, c.right, bot);
  return [
    nameField({
      id: 'ownerName', section: 'owner', koLabel: '소유자 성명(명칭)', who: OWNER,
      label: { ko: '소유자 성명(명칭)', en: 'Name of the owner (or company name)', zh: '所有人姓名（名称）', ja: '所有者の氏名（名称）', vi: 'Họ tên chủ sở hữu (hoặc tên tổ chức)' },
      help: { ko: '이륜자동차 주인의 이름을 적어요. 회사 등 법인이 주인이면 법인 이름(명칭)을 적어요.', en: 'Name of the owner of the motorcycle. If a company or other corporation owns it, write its name.', zh: '填写二轮汽车所有人的姓名。所有人是公司等法人时填写法人名称。', ja: '二輪自動車の所有者の氏名を書きます。会社などの法人が所有者なら法人の名称を書きます。', vi: 'Họ tên chủ sở hữu xe máy. Nếu chủ sở hữu là công ty / pháp nhân, ghi tên pháp nhân.' },
      area: name, badgeAt: topRight(name), box: below(name),
    }),
    {
      id: 'ownerId', section: 'owner', koLabel: '소유자 주민등록번호(법인등록번호)',
      label: { ko: '소유자 주민등록번호(법인등록번호)', en: 'Resident registration no. of the owner (corporate registration no.)', zh: '所有人居民登录号（法人登记号）', ja: '所有者の住民登録番号（法人登録番号）', vi: 'Số đăng ký cư trú của chủ sở hữu (số đăng ký pháp nhân)' },
      help: { ko: '소유자의 주민등록번호를 적어요. 법인이 소유자면 법인등록번호를 적어요.', en: "The owner's resident registration number. If a corporation owns it, write the corporate registration number.", zh: '填写所有人的居民登录号。所有人是法人时填写法人登记号。', ja: '所有者の住民登録番号を書きます。法人が所有者なら法人登録番号を書きます。', vi: 'Số đăng ký cư trú của chủ sở hữu. Nếu là pháp nhân, ghi số đăng ký pháp nhân.' },
      area: id, badgeAt: topRight(id),
      input: { kind: 'idnum', box: below(id) },
    },
    textField({
      id: 'ownerAddress', section: 'owner', koLabel: '소유자 주소',
      label: { ko: '소유자 주소', en: 'Address of the owner', zh: '所有人地址', ja: '所有者の住所', vi: 'Địa chỉ chủ sở hữu' },
      help: { ko: '소유자의 주소를 한국어로 적어요.', en: "The owner's address, in Korean.", zh: '用韩文填写所有人的地址。', ja: '所有者の住所を韓国語で書きます。', vi: 'Địa chỉ chủ sở hữu, ghi bằng tiếng Hàn.' },
      area: addr, badgeAt: topRight(addr),
      part: { key: 'address', box: below(addr), korean: true, placeholder: '예) 서울시 금천구 시흥대로73길 70' },
    }),
    textField({
      id: 'ownerPhone', section: 'owner', koLabel: '소유자 (휴대)전화번호',
      label: { ko: '소유자 (휴대)전화번호', en: 'Phone number of the owner', zh: '所有人（手机）电话号码', ja: '所有者の（携帯）電話番号', vi: 'Số điện thoại chủ sở hữu' },
      help: PHONE_HELP,
      area: phone, badgeAt: topRight(phone),
      part: { key: 'phone', box: below(phone), inputMode: 'tel', placeholder: '010-1234-5678' },
    }),
  ];
};

/** 아래 「년 월 일 / 신고인(신청인) 성명 (서명 또는 인) / 생년월일」 */
export const signFields = (c: {
  who: Who;
  koWho: string;
  date: { y: Box; m: Box; d: Box; area: Box; badgeAt: { x: number; y: number } };
  name: { box: Box; badgeAt: { x: number; y: number } };
  birth: { box: Box; badgeAt: { x: number; y: number } };
}): FieldDef[] => [
  dateField({
    id: 'reportDate', section: 'sign', koLabel: '( 년 월 일)',
    label: { ko: `${c.koWho}하는 날짜`, en: 'Date of submission', zh: '提交日期', ja: '提出日', vi: 'Ngày nộp' },
    help: { ko: '이 서류를 내는 날짜예요. 보통 오늘 날짜를 적어요.', en: "The date you submit this. Usually today's date.", zh: '提交本文件的日期，通常填写今天的日期。', ja: 'この書類を出す日付です。通常は今日の日付を書きます。', vi: 'Ngày bạn nộp giấy này. Thường là ngày hôm nay.' },
    area: c.date.area, badgeAt: c.date.badgeAt,
    y: c.date.y, m: c.date.m, d: c.date.d,
  }),
  nameField({
    id: 'signName', section: 'sign', koLabel: `${c.koWho}인 성명 (서명 또는 인)`, who: c.who,
    help: {
      ko: `${c.who.ko}의 이름을 한글로 적어요. 서명이나 도장은 출력한 종이에 직접 해요.`,
      en: `Name of ${c.who.en} in Korean letters. Sign or stamp by hand on the printed paper.`,
      zh: `用韩文填写${c.who.zh}的姓名。签名或盖章请在打印出的纸上亲自完成。`,
      ja: `${c.who.ja}の氏名をハングルで書きます。署名・押印は印刷した紙に直接します。`,
      vi: `Họ tên ${c.who.vi} bằng chữ Hàn. Ký tên hoặc đóng dấu trực tiếp trên giấy đã in.`,
    },
    area: { x: c.name.box.x - 4, y: c.name.box.y - 2, w: c.name.box.w + 8, h: c.name.box.h + 4 }, badgeAt: c.name.badgeAt, box: c.name.box,
    copyFrom: [copyNameFrom('ownerName', OWNER)],
  }),
  dateField({
    id: 'signBirth', section: 'sign', koLabel: `${c.koWho}인 생년월일`,
    label: { ko: `${c.who.ko} 생년월일`, en: `Date of birth of ${c.who.en}`, zh: `${c.who.zh}出生日期`, ja: `${c.who.ja}の生年月日`, vi: `Ngày sinh ${c.who.vi}` },
    help: { ko: `${c.who.ko}의 태어난 날짜를 적어요.`, en: `Date of birth of ${c.who.en}.`, zh: `填写${c.who.zh}的出生日期。`, ja: `${c.who.ja}の生年月日を書きます。`, vi: `Ngày sinh của ${c.who.vi}.` },
    area: { x: c.birth.box.x - 4, y: c.birth.box.y - 2, w: c.birth.box.w + 8, h: c.birth.box.h + 4 }, badgeAt: c.birth.badgeAt,
    box: c.birth.box,
  }),
];
