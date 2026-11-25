import { CategoryKey, FormDef, L, Values } from './types';

export type { CategoryKey };

// 문서 선택 화면에 보이는 서식 목록. 카테고리·제목·설명은 gusring-web과 동일.

export const categories: Record<CategoryKey, L> = {
  FAMILY:    { ko: '가족관계',   en: 'Family',       zh: '家庭', ja: '家族', vi: 'Gia đình' },
  CERT:      { ko: '증명서',     en: 'Certificates', zh: '证明', ja: '証明', vi: 'Giấy chứng nhận' },
  RESIDENCE: { ko: '체류/주거',  en: 'Residence',    zh: '居住', ja: '居住', vi: 'Cư trú' },
  ID_SEAL:   { ko: '신분/인감',  en: 'ID/Seal',      zh: '身份', ja: '身分', vi: 'Căn cước/con dấu' },
  VEHICLE:   { ko: '차량/이륜차', en: 'Vehicle',     zh: '车辆', ja: '車両', vi: 'Xe cộ' },
};

/**
 * 서식 제목 (서식 id → 제목). 서식 정의(FormDef.title)와 같아야 한다 — npm run check:forms가 확인.
 * 서식 정의는 열 때 불러오므로(코드 분할) 목록에 필요한 제목만 여기에 둔다.
 */
const FORM_TITLES: Record<string, L> = {
  'family-register-creation': { ko: '가족관계등록 창설신고서', en: 'Family Register Creation Report', zh: '家族关系登记创立申报书', ja: '家族関係登録創設届', vi: 'Đơn báo cáo lập đăng ký quan hệ gia đình' },
  'death-report': { ko: '사망신고서', en: 'Death Report', zh: '死亡申报书', ja: '死亡届', vi: 'Giấy báo tử' },
  'acknowledgment-report': { ko: '인지(친권자 지정)신고서', en: 'Acknowledgment Report', zh: '认知申报书', ja: '認知届', vi: 'Đơn báo cáo nhận con' },
  'birth-report': { ko: '출생신고서', en: 'Birth Report', zh: '出生申报书', ja: '出生届', vi: 'Giấy khai sinh' },
  'adoption-dissolution-report': { ko: '파양신고서', en: 'Dissolution of Adoption', zh: '罢养申报书', ja: '離縁届', vi: 'Đơn báo cáo chấm dứt nhận nuôi' },
  'name-change-report': { ko: '개명신고서', en: 'Name Change Report', zh: '改名申报书', ja: '改名届', vi: 'Đơn báo cáo đổi tên' },
  'surname-change-report': { ko: '성본 변경 신고서', en: 'Surname Change Report', zh: '姓本变更申报书', ja: '姓本変更届', vi: 'Đơn báo cáo thay đổi họ' },
  'adoption-report': { ko: '입양신고서', en: 'Adoption Report', zh: '收养申报书', ja: '養子縁組届', vi: 'Giấy đăng ký nhận con nuôi' },
  'full-adoption-dissolution-report': { ko: '친양자 파양신고서', en: 'Full Adoption Dissolution', zh: '亲养子罢养申报书', ja: '特別養子離縁届', vi: 'Đơn chấm dứt nhận nuôi đặc biệt' },
  'marriage-report': { ko: '혼인신고서', en: 'Marriage Report', zh: '婚姻申报书', ja: '婚姻届', vi: 'Giấy đăng ký kết hôn' },
  'register-correction': { ko: '등록부정정신청서', en: 'Register Correction', zh: '登记簿更正申请', ja: '登録簿訂正申請', vi: 'Đơn xin đính chính đăng ký' },
  'divorce-report': { ko: '이혼신고서', en: 'Divorce Report', zh: '离婚申报书', ja: '離婚届', vi: 'Giấy báo ly hôn' },
  'surname-creation-report': { ko: '창성신고서', en: 'Surname Creation', zh: '创姓申报书', ja: '創姓届', vi: 'Đơn báo cáo lập họ' },
  'residence-address-change': { ko: '국내거소이전신고서', en: 'Residence Change Report', zh: '国内住所转移申报', ja: '国内居所移転届', vi: 'Báo cáo chuyển nơi cư trú' },
  'seal-protection-request': { ko: '인감보호신청/해제신청서', en: 'Seal Protection/Release', zh: '印章保护申请/解除', ja: '印鑑保護申請/解除', vi: 'Đơn đăng ký hoặc hủy việc bảo vệ con dấu cá nhân' },
  'seal-status-report': { ko: '인감 상태 변경 신고서', en: 'Seal Status Change', zh: '印章状态变更', ja: '印鑑状態変更', vi: 'Báo cáo trạng thái con dấu cá nhân' },
  'seal-certificate-delegation': { ko: '인감증명 위임장', en: 'POA for Seal Certificate', zh: '印章证明委托书', ja: '印鑑証明委任状', vi: 'Giấy ủy quyền cấp giấy chứng nhận con dấu' },
  'resident-record-request': { ko: '주민등록표 신청서', en: 'Resident Record Request', zh: '居民登记表申请', ja: '住民登録票申請', vi: 'Đơn xin bản sao hộ khẩu' },
  'resident-registration-report': { ko: '주민등록신고서', en: 'Resident Registration Report', zh: '居民登记申报书', ja: '住民登録届出書', vi: 'Tờ khai đăng ký cư trú' },
  'id-card-loss-report': { ko: '주민등록증 분실신고서', en: 'Lost ID Card Report', zh: '居民身份证丢失申报', ja: '住民登録証紛失届', vi: 'Báo cáo mất thẻ căn cước' },
  'resident-record-delegation': { ko: '주민등록표 신청서 (위임용)', en: 'Resident Record Request (Delegation)', zh: '居民登记表申请（委托用）', ja: '住民登録票申請（委任用）', vi: 'Đơn xin bản sao hộ khẩu (ủy quyền)' },
  'id-card-issue-application': { ko: '주민등록증 발급 신청서', en: 'ID Issuance Application', zh: '居民身份证发放申请', ja: '住民登録証発行申請', vi: 'Đơn xin cấp thẻ căn cước' },
  'id-card-reissue-application': { ko: '주민등록증 재발급 신청서', en: 'ID Re-issuance App', zh: '身份证再发放申请', ja: '住民登録証再発行申請', vi: 'Đơn cấp lại thẻ căn cước' },
  'motorcycle-use-report': { ko: '이륜자동차 사용신고서', en: 'Motorcycle Use Report', zh: '二轮汽车使用申报书', ja: '二輪自動車使用届', vi: 'Tờ khai sử dụng xe máy' },
  'motorcycle-disuse-report': { ko: '이륜자동차 사용폐지신고서', en: 'Motorcycle Disuse Report', zh: '二轮汽车使用废止申报书', ja: '二輪自動車使用廃止届', vi: 'Tờ khai hủy sử dụng xe máy' },
  'motorcycle-change-report': { ko: '이륜자동차 신고사항변경신고서', en: 'Motorcycle Change Report', zh: '二轮汽车申报事项变更申报书', ja: '二輪自動車届出事項変更届', vi: 'Tờ khai thay đổi thông tin xe máy' },
  'vehicle-transfer-certificate': { ko: '자동차양도증명서', en: 'Vehicle Transfer Certificate', zh: '汽车让渡证明书', ja: '自動車譲渡証明書', vi: 'Giấy chứng nhận chuyển nhượng xe' },
  'motorcycle-certificate-reissue': { ko: '이륜자동차 사용신고필증 재교부신청서', en: 'Motorcycle Certificate Reissue', zh: '二轮汽车使用申报证明再发放申请书', ja: '二輪自動車使用届出済証再交付申請書', vi: 'Đơn xin cấp lại giấy chứng nhận xe máy' },
};

export interface CatalogItem {
  /** gusring-web(v1) 서식 번호 (forms.ts의 id). 이용 기록·의견에 같이 보내 v1 통계와 잇는다 */
  formNo: number;
  cat: CategoryKey;
  desc: L;
  /** 서식 정의의 id (FormDef.id). 이용 기록의 formKey */
  formId: string;
  /** 서식 정의를 불러온다. 서식마다 따로 나눠 받아 첫 화면을 가볍게 한다 */
  load: () => Promise<FormDef>;
  /**
   * 주소(#/form/:key)와 입력값 저장 이름. 없으면 formId.
   * 서식 하나를 목록의 여러 항목이 같이 쓸 때 항목마다 다르게 둔다.
   */
  key?: string;
  /** 목록·작성 화면 제목. 없으면 서식 제목 */
  title?: L;
  /** 처음 열 때(또는 처음부터) 미리 채워 둘 값 — 서식을 같이 쓰는 항목마다 다른 선택지를 골라 둔다 */
  preset?: Values;
}

export const entryKey = (item: CatalogItem) => item.key ?? item.formId;
export const entryTitle = (item: CatalogItem) => item.title ?? FORM_TITLES[item.formId];
/** 서식 정의의 원래 제목 (check:forms가 FormDef.title과 비교) */
export const formTitle = (formId: string): L | undefined => FORM_TITLES[formId];

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
    formId: 'family-register-creation',
    load: () => import('./family-register-creation').then((m) => m.familyRegisterCreation),
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
    formId: 'death-report',
    load: () => import('./death-report').then((m) => m.deathReport),
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
    formId: 'acknowledgment-report',
    load: () => import('./acknowledgment-report').then((m) => m.acknowledgmentReport),
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
    formId: 'birth-report',
    load: () => import('./birth-report').then((m) => m.birthReport),
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
    formId: 'adoption-dissolution-report',
    load: () => import('./adoption-dissolution-report').then((m) => m.adoptionDissolutionReport),
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
    formId: 'name-change-report',
    load: () => import('./name-change-report').then((m) => m.nameChangeReport),
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
    formId: 'surname-change-report',
    load: () => import('./surname-change-report').then((m) => m.surnameChangeReport),
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
    formId: 'adoption-report',
    load: () => import('./adoption-report').then((m) => m.adoptionReport),
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
    formId: 'full-adoption-dissolution-report',
    load: () => import('./full-adoption-dissolution-report').then((m) => m.fullAdoptionDissolutionReport),
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
    formId: 'marriage-report',
    load: () => import('./marriage-report').then((m) => m.marriageReport),
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
    formId: 'register-correction',
    load: () => import('./register-correction').then((m) => m.registerCorrection),
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
    formId: 'divorce-report',
    load: () => import('./divorce-report').then((m) => m.divorceReport),
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
    formId: 'surname-creation-report',
    load: () => import('./surname-creation-report').then((m) => m.surnameCreationReport),
  },
  {
    formNo: 21,
    cat: 'RESIDENCE',
    desc: {
      ko: '국내 거주지를 옮겼을 때 새로운 주소지를 신고합니다.',
      en: 'Report a new address when moving within Korea.',
      zh: '国内居住地搬迁时申报新住所. ',
      ja: '国内の居住地を移した時に新しい住所地を届け出ます.',
      vi: 'Báo cáo địa chỉ mới khi chuyển nơi cư trú trong nước.',
    },
    formId: 'residence-address-change',
    load: () => import('./residence-address-change').then((m) => m.residenceAddressChange),
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
    formId: 'seal-protection-request',
    load: () => import('./seal-protection-request').then((m) => m.sealProtectionRequest),
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
    formId: 'seal-status-report',
    load: () => import('./seal-status-report').then((m) => m.sealStatusReport),
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
    formId: 'seal-certificate-delegation',
    load: () => import('./seal-certificate-delegation').then((m) => m.sealCertificateDelegation),
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
    formId: 'seal-status-report',
    load: () => import('./seal-status-report').then((m) => m.sealStatusReport),
  },
  {
    formNo: 31,
    cat: 'RESIDENCE',
    desc: {
      ko: '주민등록 등본이나 초본을 발급받기 위해 신청합니다.',
      en: 'Request to issue a resident register copy.',
      zh: '领取居民登记誊本或抄本. ',
      ja: '住民登録の謄本や抄本を発行してもらうために申請します.',
      vi: 'Đăng ký lấy bản sao sổ hộ khẩu.',
    },
    formId: 'resident-record-request',
    load: () => import('./resident-record-request').then((m) => m.residentRecordRequest),
  },
  {
    formNo: 32,
    cat: 'RESIDENCE',
    desc: {
      ko: '전입, 전출 등 주민등록 사항을 신고할 때 사용합니다.',
      en: 'Used for resident registration like moving in/out.',
      zh: '申报迁入、迁出等居民登记事项. ',
      ja: '転入, 転出など住民登録事項を届け出る時に使用します.',
      vi: 'Báo cáo các vấn đề đăng ký cư trú.',
    },
    formId: 'resident-registration-report',
    load: () => import('./resident-registration-report').then((m) => m.residentRegistrationReport),
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
    formId: 'id-card-loss-report',
    load: () => import('./id-card-loss-report').then((m) => m.idCardLossReport),
  },
  {
    formNo: 34,
    cat: 'RESIDENCE',
    desc: {
      ko: '주민등록 등·초본 발급을 대리인에게 위임할 때 작성합니다.',
      en: 'To delegate resident register issuance.',
      zh: '将居民登记誊·抄本发放委托给代理人. ',
      ja: '住民登録謄・抄本の発行を代理人に委任する時に作成します.',
      vi: 'Ủy quyền lấy bản sao sổ hộ khẩu.',
    },
    formId: 'resident-record-delegation',
    load: () => import('./resident-record-delegation').then((m) => m.residentRecordDelegation),
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
    formId: 'id-card-issue-application',
    load: () => import('./id-card-issue-application').then((m) => m.idCardIssueApplication),
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
    formId: 'id-card-reissue-application',
    load: () => import('./id-card-reissue-application').then((m) => m.idCardReissueApplication),
  },
  {
    formNo: 37,
    cat: 'VEHICLE',
    desc: {
      ko: '오토바이를 새로 구입하여 신고할 때 제출합니다.',
      en: 'Submitted to register a new motorcycle.',
      zh: '新购买摩托车进行使用申报. ',
      ja: 'バイクを新しく購入して使用届を出す時に提出します。',
      vi: 'Đăng ký sử dụng xe máy mới.',
    },
    formId: 'motorcycle-use-report',
    load: () => import('./motorcycle-use-report').then((m) => m.motorcycleUseReport),
  },
  {
    formNo: 38,
    cat: 'VEHICLE',
    desc: {
      ko: '오토바이 사용을 중단하거나 폐기할 때 신고합니다.',
      en: 'Report stopping or scrapping a motorcycle.',
      zh: '停止使用或报废摩托车时申报. ',
      ja: 'バイクの使用を中断または廃棄する時に届け出ます。',
      vi: 'Báo cáo hủy sử dụng xe máy.',
    },
    formId: 'motorcycle-disuse-report',
    load: () => import('./motorcycle-disuse-report').then((m) => m.motorcycleDisuseReport),
  },
  {
    formNo: 39,
    cat: 'VEHICLE',
    desc: {
      ko: '오토바이 소유자 정보 등 변경 사항이 있을 때 신청합니다.',
      en: 'Apply when there are changes in owner info.',
      zh: '摩托车所有者地址等有变更事项. ',
      ja: 'バイクの所有者の住所など変更がある時に申請します.',
      vi: 'Thay đổi thông tin báo cáo xe máy.',
    },
    formId: 'motorcycle-change-report',
    load: () => import('./motorcycle-change-report').then((m) => m.motorcycleChangeReport),
  },
  {
    formNo: 40,
    cat: 'VEHICLE',
    desc: {
      ko: '차량을 팔거나 넘길 때 작성하는 계약 서류입니다.',
      en: 'A contract for selling or transferring a vehicle.',
      zh: '转让车辆时填写的合同. ',
      ja: '車両を売ったり譲ったりする時に作成する書類です.',
      vi: 'Hợp đồng chuyển nhượng xe.',
    },
    formId: 'vehicle-transfer-certificate',
    load: () => import('./vehicle-transfer-certificate').then((m) => m.vehicleTransferCertificate),
  },
  {
    formNo: 41,
    cat: 'VEHICLE',
    desc: {
      ko: '오토바이 사용신고필증을 잃어버렸을 때 사용합니다.',
      en: 'Used to re-issue lost registration certificate.',
      zh: '丢失摩托车证件重新领取. ',
      ja: 'バイクの証書を紛失して再発行してもらう時に使用します.',
      vi: 'Cấp lại giấy chứng nhận xe máy.',
    },
    formId: 'motorcycle-certificate-reissue',
    load: () => import('./motorcycle-certificate-reissue').then((m) => m.motorcycleCertificateReissue),
  },
];

export const findEntry = (key: string) => catalog.find((c) => entryKey(c) === key);
