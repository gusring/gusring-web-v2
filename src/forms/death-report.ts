import {
  addressField, EDU_HELP, eduOptions, emailField, hanjaSplitField, idField, nameSplitField, opt, originField,
  otherNotesField, phoneField, reportDateField, reporterNameField, sexField, submitterIdField, submitterNameField, textField,
  Who, WHO,
} from './common';
import { FieldDef, FormDef } from './types';

// ─────────────────────────────────────────────────────────────
// 사망신고서 [양식 제19호] — v1 서식 2번
// 좌표는 public/forms/death-report_ko.png (1190×1682) 기준.
// 안내 문구는 뒷면 「작성 방법」(v1 guides_ko_2)을 바탕으로 작성.
// ─────────────────────────────────────────────────────────────

const DECEASED: Who = { ko: '사망자', en: 'the deceased', zh: '死者', ja: '死亡者', vi: 'người đã mất' };

const fields: FieldDef[] = [
  reportDateField(
    { x: 148, y: 166, w: 368, h: 26 },
    { x: 190, y: 168, w: 108, h: 24, align: 'right' },
    { x: 322, y: 168, w: 52, h: 24, align: 'right' },
    { x: 398, y: 168, w: 54, h: 24, align: 'right' },
  ),

  // ── ① 사망자 ─────────────────────────────────────────────
  nameSplitField({
    id: 'deceasedName', section: 'deceased', koLabel: '① 사망자 성명 (한글)', who: DECEASED,
    area: { x: 309, y: 193, w: 286, h: 50 },
    surname: { x: 374, y: 196, w: 58, h: 44, align: 'center' },
    given: { x: 442, y: 196, w: 151, h: 44, align: 'center' },
  }),
  hanjaSplitField({
    id: 'deceasedHanja', section: 'deceased', koLabel: '① 사망자 성명 (한자)', who: DECEASED,
    area: { x: 309, y: 244, w: 286, h: 55 },
    surname: { x: 374, y: 247, w: 58, h: 49, align: 'center' },
    given: { x: 442, y: 247, w: 151, h: 49, align: 'center' },
  }),
  sexField({
    id: 'deceasedSex', section: 'deceased', koLabel: '① 성별', who: DECEASED,
    area: { x: 596, y: 244, w: 121, h: 55 },
    badge: 'margin',
    male: { x: 618, y: 272 }, female: { x: 674, y: 272 },
  }),
  idField({
    id: 'deceasedId', section: 'deceased', koLabel: '① 주민등록번호', who: DECEASED,
    area: { x: 822, y: 193, w: 223, h: 106 },
    front: { x: 852, y: 226, w: 74, h: 42, align: 'center' },
    back: { x: 942, y: 226, w: 100, h: 42, align: 'center' },
  }),
  originField({
    id: 'deceasedOrigin', section: 'deceased', koLabel: '① 등록기준지', who: DECEASED,
    area: { x: 309, y: 300, w: 736, h: 55 },
    box: { x: 346, y: 303, w: 694, h: 49, align: 'center' },
  }),
  addressField({
    id: 'deceasedAddress', section: 'deceased', koLabel: '① 주소', who: DECEASED,
    help: {
      ko: '사망자가 살던 주소를 한국어로 적어요.',
      en: 'The address where the deceased lived, written in Korean.',
      zh: '用韩文填写死者生前居住的地址。',
      ja: '死亡者が住んでいた住所を韓国語で書きます。',
      vi: 'Địa chỉ nơi người mất đã sống, ghi bằng tiếng Hàn.',
    },
    area: { x: 309, y: 356, w: 442, h: 66 },
    box: { x: 346, y: 360, w: 401, h: 58, align: 'center' },
  }),
  {
    id: 'householder',
    section: 'deceased',
    koLabel: '① 세대주·관계',
    label: { ko: '세대주와 사망자의 관계', en: 'Head of household & relationship', zh: '户主及与死者的关系', ja: '世帯主及び続柄', vi: 'Chủ hộ & quan hệ với người mất' },
    help: {
      ko: '그 주소의 세대주 이름과, 세대주가 볼 때 사망자가 누구인지 적어요. 사망자가 세대주였다면 사망자 이름과 "본인"을 적어요.',
      en: 'Name of the head of household at that address, and who the deceased was to them. If the deceased was the head of household, write the deceased’s name and "본인" (self).',
      zh: '填写该地址户主的姓名，以及死者与户主的关系。死者本人是户主时，填写死者姓名和“본인”（本人）。',
      ja: 'その住所の世帯主の氏名と、世帯主から見た死亡者の続柄を書きます。死亡者が世帯主だった場合は、死亡者の氏名と「本人」を意味する韓国語を書きます。',
      vi: 'Tên chủ hộ tại địa chỉ đó và người mất là ai đối với chủ hộ. Nếu người mất là chủ hộ, ghi tên người mất và "본인" (bản thân).',
    },
    area: { x: 873, y: 356, w: 172, h: 66 },
    badge: 'margin',
    input: {
      kind: 'text',
      parts: [
        { key: 'name', box: { x: 876, y: 372, w: 88, h: 36, align: 'center' }, hangul: true, label: { ko: '세대주 이름 (한글)', en: 'Head of household (Hangul)', zh: '户主姓名（韩文）', ja: '世帯主の氏名（ハングル）', vi: 'Tên chủ hộ (Hangul)' }, placeholder: '예) 김민수' },
        { key: 'relation', box: { x: 986, y: 372, w: 57, h: 36, align: 'center' }, korean: true, label: { ko: '관계 (한국어)', en: 'Relationship (in Korean)', zh: '关系（韩文）', ja: '続柄（韓国語）', vi: 'Quan hệ (tiếng Hàn)' }, placeholder: '예) 본인, 배우자' },
      ],
    },
  },
  {
    id: 'deathDateTime',
    section: 'deceased',
    koLabel: '① 사망일시',
    label: { ko: '사망한 날짜와 시간', en: 'Date and time of death', zh: '死亡日期和时间', ja: '死亡日時', vi: 'Ngày giờ mất' },
    help: {
      ko: '사망한 곳의 시각으로, 24시간제로 적어요. (예: 오후 2시 30분 → 14시 30분, 밤 12시 30분 → 다음 날 0시 30분) 외국에서 사망했다면 그곳 시각을 적고, 서머타임 기간이었다면 시각 옆에 "(서머타임 적용)"이라고 출력한 종이에 직접 적어요.',
      en: 'Use the local time where the death occurred, in 24-hour format (e.g., 2:30 PM → 14:30; 12:30 at midnight → 0:30 of the next day). If the death occurred abroad, use the local time there; if daylight saving time was in effect, write "(서머타임 적용)" next to the time by hand on the printed form.',
      zh: '按死亡地的时间，用24小时制填写（例：下午2点30分 → 14时30分；夜里12点30分 → 次日0时30分）。如在国外死亡，填写当地时间；若当时实行夏令时，请在打印出的纸上于时间旁手写“(서머타임 적용)”（适用夏令时）。',
      ja: '死亡地の時刻を24時間制で書きます（例：午後2時30分 → 14時30分、夜12時30分 → 翌日0時30分）。外国で死亡した場合は現地時刻を書き、サマータイム期間中だった場合は、印刷した紙の時刻の横に「サマータイム適用」を意味する韓国語を手書きします。',
      vi: 'Ghi theo giờ tại nơi mất, dạng 24 giờ (VD: 2 giờ 30 chiều → 14 giờ 30; 12 giờ 30 đêm → 0 giờ 30 ngày hôm sau). Nếu mất ở nước ngoài, ghi giờ địa phương; nếu lúc đó đang áp dụng giờ mùa hè, hãy tự viết "(서머타임 적용)" bên cạnh giờ trên giấy đã in.',
    },
    area: { x: 309, y: 423, w: 736, h: 49 },
    badge: 'margin',
    input: {
      kind: 'datetime',
      boxes: {
        y: { x: 312, y: 426, w: 64, h: 42, align: 'right' },
        m: { x: 400, y: 426, w: 33, h: 42, align: 'right' },
        d: { x: 455, y: 426, w: 33, h: 42, align: 'right' },
        h: { x: 509, y: 426, w: 33, h: 42, align: 'right' },
        min: { x: 563, y: 426, w: 34, h: 42, align: 'right' },
      },
    },
  },
  textField({
    id: 'deathPlace', section: 'deceased', koLabel: '① 사망장소 (장소)',
    label: { ko: '사망한 장소 (주소)', en: 'Place of death (address)', zh: '死亡地点（地址）', ja: '死亡場所（住所）', vi: 'Nơi mất (địa chỉ)' },
    help: {
      ko: '사망한 곳의 주소를 한국어로 적어요. 시·구의 동, 읍·면의 리, 또는 도로명까지만 적어도 돼요.',
      en: 'Address of the place of death, in Korean. Writing up to the dong (city/district), ri (eup/myeon), or road name is enough.',
      zh: '用韩文填写死亡地点的地址。写到市·区的洞、邑·面的里或道路名即可。',
      ja: '死亡した場所の住所を韓国語で書きます。市・区の洞、邑・面の里、または道路名まででも構いません。',
      vi: 'Địa chỉ nơi mất, ghi bằng tiếng Hàn. Chỉ cần ghi đến phường (dong), xã (ri) hoặc tên đường.',
    },
    area: { x: 366, y: 473, w: 679, h: 61 },
    part: { box: { x: 404, y: 478, w: 636, h: 51, align: 'center' }, korean: true, placeholder: '예) 서울시 금천구 시흥대로 999' },
  }),
  {
    id: 'deathPlaceType',
    section: 'deceased',
    koLabel: '① 사망장소 (구분)',
    label: { ko: '사망한 장소의 종류', en: 'Type of place of death', zh: '死亡地点类型', ja: '死亡場所の種類', vi: 'Loại nơi mất' },
    help: {
      ko: '사망한 장소의 종류를 골라요. ① 주택에는 사망자의 집뿐 아니라 부모·친척 등의 집도 포함돼요. ⑩ 기타는 비행기, 배, 기차 등 보기에 없는 곳이에요.',
      en: 'Choose the type of place. ① Home includes not only the deceased’s own home but also the home of parents, relatives, etc. ⑩ Other is for places not listed, such as an airplane, ship or train.',
      zh: '选择死亡地点的类型。① 住宅不仅包括死者自己的家，也包括父母、亲戚等的家。⑩ 其他指飞机、船舶、火车等未列出的地点。',
      ja: '死亡した場所の種類を選びます。① 住宅には死亡者本人の家だけでなく、父母・親戚などの家も含まれます。⑩ その他は飛行機、船、列車など選択肢にない場所です。',
      vi: 'Chọn loại nơi mất. ① Nhà ở bao gồm cả nhà của bố mẹ, họ hàng…, không chỉ nhà của người mất. ⑩ Khác là nơi không có trong danh sách như máy bay, tàu thủy, tàu hỏa.',
    },
    area: { x: 366, y: 535, w: 679, h: 118 },
    badge: 'margin',
    input: {
      kind: 'choice',
      mark: 'circle',
      options: [
        opt('home', '주택', { ko: '주택', en: 'Home', zh: '住宅', ja: '住宅', vi: 'Nhà ở' }, 379, 556),
        opt('medical', '의료기관', { ko: '의료기관', en: 'Medical institution', zh: '医疗机构', ja: '医療機関', vi: 'Cơ sở y tế' }, 526, 556),
        opt('welfare', '사회복지시설', { ko: '사회복지시설 (양로원, 고아원 등)', en: 'Social welfare facility (nursing home, orphanage, etc.)', zh: '社会福利设施（养老院、孤儿院等）', ja: '社会福祉施設（老人ホーム、児童養護施設など）', vi: 'Cơ sở phúc lợi xã hội (viện dưỡng lão, trại trẻ mồ côi…)' }, 706, 556),
        opt('public', '공공시설', { ko: '공공시설 (학교, 운동장 등)', en: 'Public facility (school, sports ground, etc.)', zh: '公共设施（学校、运动场等）', ja: '公共施設（学校、運動場など）', vi: 'Cơ sở công cộng (trường học, sân vận động…)' }, 379, 580),
        opt('road', '도로', { ko: '도로', en: 'Road', zh: '道路', ja: '道路', vi: 'Đường' }, 674, 580),
        opt('commercial', '상업·서비스시설', { ko: '상업·서비스시설 (상점, 호텔 등)', en: 'Commercial / service facility (shop, hotel, etc.)', zh: '商业·服务设施（商店、酒店等）', ja: '商業・サービス施設（商店、ホテルなど）', vi: 'Cơ sở thương mại / dịch vụ (cửa hàng, khách sạn…)' }, 768, 580),
        opt('industrial', '산업장', { ko: '산업장', en: 'Industrial site', zh: '工业场所', ja: '産業現場', vi: 'Khu công nghiệp / nơi làm việc' }, 379, 606),
        opt('farm', '농장', { ko: '농장 (논밭, 축사, 양식장 등)', en: 'Farm (fields, livestock barn, fish farm, etc.)', zh: '农场（田地、畜舍、养殖场等）', ja: '農場（田畑、畜舎、養殖場など）', vi: 'Trang trại (ruộng, chuồng trại, nơi nuôi trồng thủy sản…)' }, 526, 606),
        opt('transfer', '병원 이송 중 사망', { ko: '병원으로 옮기는 중', en: 'On the way to hospital', zh: '送医途中', ja: '病院へ搬送中', vi: 'Trên đường đến bệnh viện' }, 839, 606),
        opt('other', '기타', { ko: '기타', en: 'Other', zh: '其他', ja: 'その他', vi: 'Khác' }, 379, 632),
      ],
      extra: {
        key: 'detail',
        when: ['other'],
        box: { x: 440, y: 621, w: 495, h: 24, align: 'center' },
        korean: true,
        label: { ko: '장소 (한국어)', en: 'Place (in Korean)', zh: '地点（韩文）', ja: '場所（韓国語）', vi: 'Nơi (tiếng Hàn)' },
        placeholder: '예) 비행기 안',
      },
    },
  },

  // ── ② 기타사항 ───────────────────────────────────────────
  otherNotesField({
    id: 'otherNotes', section: 'etc', koLabel: '② 기타사항',
    extra: {
      ko: '예) 사망진단서(시체검안서)를 붙이지 못할 때 그 이유.',
      en: 'e.g., why the death certificate (post-mortem report) cannot be attached.',
      zh: '例：无法附上死亡诊断书（尸体检验书）时的原因。',
      ja: '例）死亡診断書（死体検案書）を添付できない場合、その理由。',
      vi: 'VD: lý do không thể nộp kèm giấy chứng tử (biên bản khám nghiệm tử thi).',
    },
    area: { x: 309, y: 654, w: 736, h: 49 },
    box: { x: 346, y: 657, w: 694, h: 43 },
  }),

  // ── ③ 신고인 ─────────────────────────────────────────────
  reporterNameField({
    id: 'reporterName', section: 'reporter', koLabel: '③ 신고인 성명',
    area: { x: 284, y: 704, w: 379, h: 61 },
    box: { x: 320, y: 709, w: 220, h: 51, align: 'center' },
  }),
  idField({
    id: 'reporterId', section: 'reporter', koLabel: '③ 신고인 주민등록번호', who: WHO.reporter,
    area: { x: 805, y: 704, w: 240, h: 61 },
    front: { x: 840, y: 714, w: 79, h: 42, align: 'center' },
    back: { x: 934, y: 714, w: 108, h: 42, align: 'center' },
  }),
  {
    id: 'reporterQualification',
    section: 'reporter',
    koLabel: '③ 신고인 자격',
    label: { ko: '신고인 자격', en: 'Capacity of the person reporting', zh: '申报人资格', ja: '届出人の資格', vi: 'Tư cách người khai báo' },
    help: {
      ko: '신고하는 사람이 어떤 자격으로 신고하는지 골라요. ④ 기타에는 사망한 장소를 관리하는 사람 등이 들어가요.',
      en: 'Choose in what capacity the person is reporting. ④ Other includes, for example, the person managing the place where the death occurred.',
      zh: '选择申报人以何种资格申报。④ 其他包括管理死亡地点的人等。',
      ja: '届出人がどのような資格で届け出るかを選びます。④ その他には、死亡した場所を管理する人などが含まれます。',
      vi: 'Chọn tư cách khai báo của người khai. ④ Khác bao gồm người quản lý nơi xảy ra cái chết, v.v.',
    },
    area: { x: 284, y: 766, w: 413, h: 88 },
    badge: 'margin',
    input: {
      kind: 'choice',
      mark: 'circle',
      options: [
        opt('cohabitingRelative', '동거친족', { ko: '같이 살던 친족', en: 'Relative who lived with the deceased', zh: '同住亲属', ja: '同居の親族', vi: 'Người thân sống cùng' }, 307, 788),
        opt('relative', '비동거친족', { ko: '따로 살던 친족', en: 'Relative who lived separately', zh: '非同住亲属', ja: '別居の親族', vi: 'Người thân sống riêng' }, 423, 788),
        opt('cohabitant', '동거자', { ko: '같이 살던 사람 (친족 아님)', en: 'Person who lived with the deceased (not a relative)', zh: '同住人（非亲属）', ja: '同居者（親族以外）', vi: 'Người sống cùng (không phải người thân)' }, 558, 788),
        opt('other', '기타', { ko: '기타 (보호시설장·사망장소 관리자 등)', en: 'Other (head of a care facility, manager of the place of death, etc.)', zh: '其他（保护设施负责人、死亡地点管理人等）', ja: 'その他（保護施設長・死亡場所の管理者など）', vi: 'Khác (người đứng đầu cơ sở bảo trợ, người quản lý nơi mất…)' }, 308, 832),
      ],
    },
  },
  textField({
    id: 'reporterRelation', section: 'reporter', koLabel: '③ 관계',
    label: { ko: '사망자와의 관계', en: 'Relationship to the deceased', zh: '与死者的关系', ja: '死亡者との関係', vi: 'Quan hệ với người mất' },
    help: {
      ko: '신고하는 사람이 사망자의 누구인지 한국어로 적어요. 예) 배우자, 자녀, 부, 모',
      en: 'Who the reporting person is to the deceased, in Korean. e.g., 배우자 (spouse), 자녀 (child), 부 (father), 모 (mother)',
      zh: '用韩文填写申报人是死者的什么人。例：배우자（配偶）、자녀（子女）、부（父）、모（母）',
      ja: '届出人が死亡者の誰にあたるかを韓国語で書きます。例）配偶者、子、父、母にあたる韓国語',
      vi: 'Người khai là ai đối với người mất, ghi bằng tiếng Hàn. VD: 배우자 (vợ/chồng), 자녀 (con), 부 (bố), 모 (mẹ)',
    },
    area: { x: 763, y: 766, w: 282, h: 43 },
    part: { box: { x: 799, y: 769, w: 241, h: 37, align: 'center' }, korean: true, placeholder: '예) 자녀' },
  }),
  addressField({
    id: 'reporterAddress', section: 'reporter', koLabel: '③ 신고인 주소', who: WHO.reporter,
    area: { x: 284, y: 855, w: 379, h: 66 },
    box: { x: 320, y: 860, w: 339, h: 56, align: 'center' },
  }),
  phoneField({
    id: 'reporterPhone', section: 'reporter', koLabel: '③ 전화',
    area: { x: 664, y: 855, w: 185, h: 66 },
    box: { x: 731, y: 870, w: 116, h: 36, align: 'center' },
  }),
  emailField({
    id: 'reporterEmail', section: 'reporter', koLabel: '③ 이메일',
    area: { x: 850, y: 855, w: 195, h: 66 },
    box: { x: 929, y: 870, w: 114, h: 36, align: 'center' },
  }),

  // ── ④ 제출인 ─────────────────────────────────────────────
  submitterNameField({
    id: 'submitterName', section: 'submitter', koLabel: '④ 제출인 성명',
    area: { x: 373, y: 922, w: 290, h: 55 },
    box: { x: 409, y: 927, w: 250, h: 46, align: 'center' },
  }),
  submitterIdField({
    id: 'submitterId', section: 'submitter', koLabel: '④ 제출인 주민등록번호',
    area: { x: 805, y: 922, w: 240, h: 55 },
    front: { x: 840, y: 927, w: 79, h: 46, align: 'center' },
    back: { x: 934, y: 927, w: 108, h: 46, align: 'center' },
  }),

  // ── 인구동향조사 ─────────────────────────────────────────
  {
    id: 'deceasedEducation',
    section: 'survey',
    koLabel: '㉮ 최종 졸업학교',
    label: { ko: '사망자 최종 학력', en: 'Highest education of the deceased', zh: '死者最高学历', ja: '死亡者の最終学歴', vi: 'Học vấn cao nhất của người mất' },
    help: EDU_HELP,
    area: { x: 273, y: 1243, w: 771, h: 68 },
    badge: 'margin',
    input: { kind: 'choice', mark: 'circle', options: eduOptions([296, 432, 556, 662, 786, 906], 1277) },
  },
  {
    id: 'deceasedMarital',
    section: 'survey',
    koLabel: '㉯ 혼인상태',
    label: { ko: '사망자 혼인 상태', en: 'Marital status of the deceased', zh: '死者婚姻状况', ja: '死亡者の婚姻状態', vi: 'Tình trạng hôn nhân của người mất' },
    help: {
      ko: '통계청 조사 항목이에요. 사망 당시 사망자의 혼인 상태를 골라요.',
      en: "This is for Statistics Korea's survey. Choose the deceased's marital status at the time of death.",
      zh: '这是统计厅的调查项目。选择死者去世时的婚姻状况。',
      ja: '統計庁の調査項目です。死亡当時の死亡者の婚姻状態を選びます。',
      vi: 'Đây là mục khảo sát của Cục Thống kê. Chọn tình trạng hôn nhân của người mất tại thời điểm qua đời.',
    },
    area: { x: 273, y: 1312, w: 771, h: 38 },
    badge: 'margin',
    input: {
      kind: 'choice',
      mark: 'circle',
      options: [
        opt('single', '미혼', { ko: '미혼', en: 'Never married', zh: '未婚', ja: '未婚', vi: 'Chưa kết hôn' }, 295, 1332),
        opt('married', '배우자 있음', { ko: '배우자 있음', en: 'Married', zh: '有配偶', ja: '配偶者あり', vi: 'Có vợ / chồng' }, 432, 1332),
        opt('divorced', '이혼', { ko: '이혼', en: 'Divorced', zh: '离婚', ja: '離婚', vi: 'Ly hôn' }, 618, 1332),
        opt('widowed', '사별', { ko: '사별', en: 'Widowed', zh: '丧偶', ja: '死別', vi: 'Góa' }, 755, 1332),
      ],
    },
  },
];

export const deathReport: FormDef = {
  id: 'death-report',
  title: { ko: '사망신고서', en: 'Death Report', zh: '死亡申报书', ja: '死亡届', vi: 'Giấy báo tử' },
  pages: [{ image: '/forms/death-report_ko.png', width: 1190, height: 1682 }],
  sections: [
    { id: 'meta',      label: { ko: '신고일',       en: 'Report date',        zh: '申报日期',     ja: '届出日',       vi: 'Ngày khai báo' } },
    { id: 'deceased',  label: { ko: '① 사망자',     en: '① The deceased',     zh: '① 死者',       ja: '① 死亡者',     vi: '① Người đã mất' } },
    { id: 'etc',       label: { ko: '② 기타사항',   en: '② Other notes',      zh: '② 其他事项',   ja: '② その他事項', vi: '② Ghi chú khác' } },
    { id: 'reporter',  label: { ko: '③ 신고인',     en: '③ Person reporting', zh: '③ 申报人',     ja: '③ 届出人',     vi: '③ Người khai báo' } },
    { id: 'submitter', label: { ko: '④ 제출인',     en: '④ Submitter',        zh: '④ 提交人',     ja: '④ 提出人',     vi: '④ Người nộp thay' } },
    { id: 'survey',    label: { ko: '인구동향조사', en: 'Population survey',  zh: '人口动向调查', ja: '人口動向調査', vi: 'Khảo sát dân số' } },
  ],
  fields,
};
