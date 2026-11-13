import { birthReport } from './birth-report';
import { deathReport } from './death-report';
import { familyRegisterCreation } from './family-register-creation';
import { FormDef, L } from './types';
import { acknowledgmentReport } from './acknowledgment-report';
import { adoptionDissolutionReport } from './adoption-dissolution-report';
import { nameChangeReport } from './name-change-report';
import { surnameChangeReport } from './surname-change-report';
import { adoptionReport } from './adoption-report';
import { fullAdoptionDissolutionReport } from './full-adoption-dissolution-report';
import { marriageReport } from './marriage-report';

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
];

export const findEntry = (key: string) => catalog.find((c) => entryKey(c) === key);
