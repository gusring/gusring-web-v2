import { birthReport } from './birth-report';
import { deathReport } from './death-report';
import { familyRegisterCreation } from './family-register-creation';
import { FormDef, L, Values } from './types';
import { acknowledgmentReport } from './acknowledgment-report';
import { adoptionDissolutionReport } from './adoption-dissolution-report';
import { nameChangeReport } from './name-change-report';
import { surnameChangeReport } from './surname-change-report';
import { adoptionReport } from './adoption-report';
import { fullAdoptionDissolutionReport } from './full-adoption-dissolution-report';
import { marriageReport } from './marriage-report';
import { registerCorrection } from './register-correction';
import { divorceReport } from './divorce-report';
import { surnameCreationReport } from './surname-creation-report';
import { sealProtectionRequest } from './seal-protection-request';
import { sealStatusReport } from './seal-status-report';
import { sealCertificateDelegation } from './seal-certificate-delegation';
import { idCardLossReport } from './id-card-loss-report';
import { idCardIssueApplication } from './id-card-issue-application';
import { idCardReissueApplication } from './id-card-reissue-application';

// 문서 선택 화면에 보이는 서식 목록. 카테고리·제목·설명은 gusring-web과 동일.

export type CategoryKey = 'FAMILY' | 'CERT' | 'RESIDENCE' | 'ID_SEAL' | 'VEHICLE';

export const categories: Record<CategoryKey, L> = {
  FAMILY:    { ko: '가족관계',   en: 'Family',       zh: '家庭', ja: '家族', vi: 'Gia đình' },
  CERT:      { ko: '증명서',     en: 'Certificates', zh: '证明', ja: '証明', vi: 'Giấy chứng nhận' },
  RESIDENCE: { ko: '체류/주거',  en: 'Residence',    zh: '居住', ja: '居住', vi: 'Cư trú' },
  ID_SEAL:   { ko: '신분/인감',  en: 'ID/Seal',      zh: '身份', ja: '身分', vi: 'Căn cước/con dấu' },
  VEHICLE:   { ko: '차량/이륜차', en: 'Vehicle',     zh: '车辆', ja: '車両', vi: 'Xe cộ' },
};

export interface CatalogItem {
  /** gusring-web(v1) 서식 번호 (forms.ts의 id). 이용 기록·의견에 같이 보내 v1 통계와 잇는다 */
  formNo: number;
  cat: CategoryKey;
  desc: L;
  form: FormDef;
  /**
   * 주소(#/form/:key)와 입력값 저장 이름. 없으면 form.id.
   * 서식 하나를 목록의 여러 항목이 같이 쓸 때 항목마다 다르게 둔다.
   */
  key?: string;
  /** 목록·작성 화면 제목. 없으면 form.title */
  title?: L;
  /** 처음 열 때(또는 처음부터) 미리 채워 둘 값 — 서식을 같이 쓰는 항목마다 다른 선택지를 골라 둔다 */
  preset?: Values;
}

export const entryKey = (item: CatalogItem) => item.key ?? item.form.id;
export const entryTitle = (item: CatalogItem) => item.title ?? item.form.title;

// v1(gusring-web) 서식 번호 순서
export const catalog: CatalogItem[] = [
  {
    formNo: 1,
    cat: 'FAMILY',
    desc: {
      ko: '가족관계등록부가 없는 사람이 새로 등록을 만들 때 사용합니다.',
      en: 'Used to create a new family register.',
      zh: '没有家族关系登记簿的人重新登记时使用。',
      ja: '家族関係登録簿がない人が新しく登録を作る時に使用します。',
      vi: 'Sử dụng cho người chưa có sổ đăng ký quan hệ gia đình để lập mới.',
    },
    form: familyRegisterCreation,
  },
  {
    formNo: 2,
    cat: 'FAMILY',
    desc: {
      ko: '가족이나 친족이 사망했을 때 관할 기관에 알리는 서류입니다.',
      en: "A document to notify authorities of a family member's death.",
      zh: '家属或亲属死亡时向管辖机构报告的文件。',
      ja: '家族や親族が死亡した時に管轄機関に知らせる書類です。',
      vi: 'Văn bản thông báo khi có thành viên trong gia đình qua đời.',
    },
    form: deathReport,
  },
  {
    formNo: 3,
    cat: 'FAMILY',
    desc: {
      ko: '혼인 외의 자녀를 자신의 자식으로 인정할 때 제출합니다.',
      en: "Submitted to acknowledge a child born out of wedlock as one's own.",
      zh: '承认婚姻以外的子女为自己的子女时提交。',
      ja: '婚姻外の子を自分の子として認める時に提出します.',
      vi: 'Nộp để công nhận con ngoài giá thú là con của mình.',
    },
    form: acknowledgmentReport,
  },
  {
    formNo: 4,
    cat: 'FAMILY',
    desc: {
      ko: '자녀가 태어난 후 법적 등록을 위해 작성하는 신고서입니다.',
      en: 'A report to legally register a child after birth.',
      zh: '孩子出生后为了法律登记而填写的申报书。',
      ja: '子供が生まれた後、法的登録のために作成する届出書です。',
      vi: 'Đơn đăng ký hợp pháp cho trẻ sau khi sinh.',
    },
    form: birthReport,
  },
  {
    formNo: 5,
    cat: 'FAMILY',
    desc: {
      ko: '입양된 자녀와 양부모 사이의 법적 관계를 해소할 때 사용합니다.',
      en: 'Used to terminate the legal relationship of adoption.',
      zh: '解除领养子女与养父母之间的法律关系时使用。',
      ja: '養子と養親の間の法的関係を解消する時に使用します.',
      vi: 'Dùng để chấm dứt quan hệ pháp lý giữa con nuôi và cha mẹ nuôi.',
    },
    form: adoptionDissolutionReport,
  },
  {
    formNo: 6,
    cat: 'FAMILY',
    desc: {
      ko: '법원의 허가를 받아 이름을 공식적으로 바꿀 때 제출합니다.',
      en: "Submitted to officially change one's name with court approval.",
      zh: '获得法院许可正式改名时提交。',
      ja: '裁判所の許可を得て名前を公式に変える時に提出します.',
      vi: 'Nộp để chính thức đổi tên sau khi được tòa án cho phép.',
    },
    form: nameChangeReport,
  },
  {
    formNo: 7,
    cat: 'FAMILY',
    desc: {
      ko: '자녀의 성과 본을 변경하기 위해 작성하는 서류입니다.',
      en: "Document to change a child's surname and origin.",
      zh: '为了变更子女的姓和本而填写的材料。',
      ja: '子の氏と本を変更するために作成する書類です.',
      vi: 'Văn bản dùng để thay đổi họ và nguồn gốc của con.',
    },
    form: surnameChangeReport,
  },
  {
    formNo: 8,
    cat: 'FAMILY',
    desc: {
      ko: '법적으로 자녀를 입양하여 부모-자식 관계를 맺을 때 사용합니다.',
      en: 'Used to legally adopt a child.',
      zh: '法律上收养子女并建立父母子女关系时使用。',
      ja: '法的に子どもを養子にし, 親子関係を結ぶ時使用します。',
      vi: 'Sử dụng khi nhận con nuôi hợp pháp.',
    },
    form: adoptionReport,
  },
  {
    formNo: 9,
    cat: 'FAMILY',
    desc: {
      ko: '친양자 관계를 법적으로 해소하기 위해 작성합니다.',
      en: 'Written to legally dissolve a full adoption relationship.',
      zh: '为了法律上解除亲养子关系而填写。',
      ja: '特別養子関係を法的に解消するために作成します.',
      vi: 'Dùng để chấm dứt quan hệ con nuôi đặc biệt về mặt pháp lý.',
    },
    form: fullAdoptionDissolutionReport,
  },
  {
    formNo: 10,
    cat: 'FAMILY',
    desc: {
      ko: '법적으로 부부가 되었음을 공인받기 위해 제출하는 서류입니다.',
      en: 'Submitted to be officially recognized as a married couple.',
      zh: '为了获得法律上成为夫妇的公认而提交的文件。',
      ja: '法的に夫婦になったことを公認されるために提出する書類です.',
      vi: 'Là giấy tờ được nộp nhằm đăng ký và được công nhận quan hệ vợ chồng theo pháp luật.',
    },
    form: marriageReport,
  },
  {
    formNo: 11,
    cat: 'FAMILY',
    desc: {
      ko: '가족관계등록부의 잘못된 기재 내용을 수정할 때 사용합니다.',
      en: 'Used to correct errors in the register.',
      zh: '修正家族关系登记簿中错误的记载内容时使用。',
      ja: '家族関係登録簿の誤った記載内容を修正する時に使用します.',
      vi: 'Sử dụng để sửa các nội dung ghi sai trong sổ đăng ký.',
    },
    form: registerCorrection,
  },
  {
    formNo: 12,
    cat: 'FAMILY',
    desc: {
      ko: '법적 혼인 관계를 해소했음을 신고하는 서류입니다.',
      en: 'Document reporting the dissolution of a legal marriage.',
      zh: '申报法律婚姻关系已解除的文件。',
      ja: '法的婚姻関係を解消したことを届け出る書類です。',
      vi: 'Văn bản báo cáo việc chấm dứt quan hệ hôn nhân hợp pháp.',
    },
    form: divorceReport,
  },
  {
    formNo: 13,
    cat: 'FAMILY',
    desc: {
      ko: '새로운 성(姓)을 만들어 등록할 때 제출합니다.',
      en: 'Submitted when creating and registering a new surname.',
      zh: '创立并登记新姓氏时提交. ',
      ja: '新しい氏を作って登録する時に提出します.',
      vi: 'Nộp khi tạo và đăng ký một họ mới.',
    },
    form: surnameCreationReport,
  },
  {
    formNo: 22,
    cat: 'ID_SEAL',
    desc: {
      ko: '인감 도용 방지를 위해 본인 외 발급을 제한하거나 해제합니다.',
      en: 'Restrict or release seal issuance to others.',
      zh: '为防止印章被盗用, 限制或解除发放. ',
      ja: '印鑑の盗用防止のために発行を制限したり解除したりします.',
      vi: 'Ngăn người khác sử dụng con dấu của mình bằng cách hạn chế hoặc hủy việc cấp giấy tờ cho người khác.',
    },
    form: sealProtectionRequest,
  },
  {
    formNo: 24,
    cat: 'ID_SEAL',
    desc: {
      ko: '새로운 인감을 등록하거나 기존 인감을 변경할 때 사용합니다.',
      en: 'Used to register or change a personal seal.',
      zh: '登记新印章或变更现有印章时使用. ',
      ja: '新しい印鑑を登録したり既存の印鑑を変更する時に使用します.',
      vi: 'Sử dụng khi đăng ký con dấu cá nhân mới.',
    },
    form: sealStatusReport,
    // 26번과 같은 서식 — 「신고사항의 변경」을 골라 둔 채로 연다
    key: 'seal-change-report',
    title: { ko: '인감(변경)신고서(서면)', en: 'Seal Registration', zh: '印章(变更)申报', ja: '印鑑(変更)届', vi: 'Báo cáo thay đổi con dấu cá nhân' },
    preset: { reportType: { choice: 'change' } },
  },
  {
    formNo: 25,
    cat: 'ID_SEAL',
    desc: {
      ko: '대리인이 인감증명을 발급받을 때 작성합니다.',
      en: 'Written when a representative gets a seal certificate.',
      zh: '由代理人领取印章证明时填写. ',
      ja: '代理人が印鑑証明を受け取る時に作成します.',
      vi: 'Lập khi người đại diện đi lấy chứng nhận con dấu cá nhân.',
    },
    form: sealCertificateDelegation,
  },
  {
    formNo: 26,
    cat: 'ID_SEAL',
    desc: {
      ko: '인감의 말소, 부활, 사망 신고 등을 할 때 제출합니다.',
      en: 'Submitted for cancellation or restoration of a seal.',
      zh: '进行印章的注销、恢复、死亡申报等. ',
      ja: '印鑑の抹消, 復活, 死亡届などをする時に提出します.',
      vi: 'Nộp khi báo cáo hủy hoặc khôi phục con dấu cá nhân.',
    },
    form: sealStatusReport,
  },
  {
    formNo: 33,
    cat: 'ID_SEAL',
    desc: {
      ko: '주민등록증을 잃어버렸을 때 도용 방지를 위해 신고합니다.',
      en: 'Report a lost ID card to prevent misuse.',
      zh: '丢失居民身份证时为防止被盗用而申报. ',
      ja: '住民登録証を紛失した時, 盗用防止のために届け出ます.',
      vi: 'Báo cáo khi mất thẻ căn cước.',
    },
    form: idCardLossReport,
  },
  {
    formNo: 35,
    cat: 'ID_SEAL',
    desc: {
      ko: '만 17세가 되어 처음 주민등록증을 만들 때 신청합니다.',
      en: 'Apply for the first ID card at age 17.',
      zh: '满17岁第一次制作居民身份证时申请. ',
      ja: '満17歳になり, 初めて住民登録証を作る時に申請します.',
      vi: 'Làm thẻ căn cước lần đầu khi đủ 17 tuổi.',
    },
    form: idCardIssueApplication,
  },
  {
    formNo: 36,
    cat: 'ID_SEAL',
    desc: {
      ko: '분실, 훼손 등으로 주민등록증을 다시 만들 때 신청합니다.',
      en: 'Apply for ID card re-issuance.',
      zh: '因丢失、损坏等重新制作居民身份证. ',
      ja: '紛失, 毀損などで住民登録証を作り直す時に申請します.',
      vi: 'Đăng ký làm lại thẻ căn cước.',
    },
    form: idCardReissueApplication,
  },
];

export const findEntry = (key: string) => catalog.find((c) => entryKey(c) === key);
