# 구스링 버전 2 — 서식 작성 도우미

외국인 주민이 **모국어 안내를 보며 입력하면, 한국어 원본 행정 서식에 바로 기재**되는 구스링 버전 2입니다. ([gusring_prototype](https://github.com/gusring/gusring_prototype)에서 옮겨 왔습니다.)
첫 대상 서식은 출생신고서([양식 제1호])입니다.

## 화면 흐름
`#/` 언어 선택 → `#/list` 문서 선택 → `#/form/birth-report` 서식 작성 (`#/map` 민원실 지도)

언어 선택·문서 선택 화면과 헤더·지도는 [gusring-web](https://github.com/gusring/gusring-web)을 그대로 옮겼습니다. 헤더의 의견 보내기는 구글 폼 대신 구스링 백엔드로 보냅니다.
처음에 고른 언어로 서식 작성 화면의 안내와 라벨이 모두 표시됩니다.

## 서식 작성 화면
1. 한국어 원본 서식 이미지 위, 입력해야 하는 칸마다 번호 토글이 표시됩니다.
2. 번호를 누르면 바텀시트가 열리고, 그 칸의 의미와 작성법을 모국어(ko/en/zh/ja/vi)로 안내합니다.
3. 입력하는 즉시 한국어 서식의 해당 칸에 기재됩니다. 선택형 항목은 ○/✓로, 국가는 한국어 국가명으로 변환됩니다.
4. "완성 서식 보기"에서 이미지 저장 또는 A4 인쇄. 입력값은 브라우저(localStorage)에만 저장됩니다.

## 실행
```bash
npm install
npm run dev
```

로컬 [gusring-server](https://github.com/gusring/gusring-server)에 붙일 때 (기본은 운영 `https://api.gusring.kro.kr`):
```bash
VITE_GUSRING_API=http://localhost:4000 npm run dev
```

## 구스링 백엔드 연결
`src/lib/gusring-api.ts`는 gusring-server `examples/gusring-api.ts`와 같은 파일입니다 (gusring-web `src/shared/gusring-api.ts`와도 같음). 고칠 때는 원본을 고치고 복사합니다.
- 이용 기록: 화면 진입·언어 선택·검색·카테고리, 서식 작성 단계(`form_view` `fill_start` `field_open` `fill_preview` `fill_png_save` `fill_print` `fill_reset` `detail_time`)를 `formKey`(서식 id)와 함께 보냅니다. **칸에 적은 값은 보내지 않습니다.**
- 의견 보내기: 헤더 버튼 → `POST /api/v1/feedbacks`. 서식 화면에서 보내면 서식·칸 id가 같이 갑니다.
- 운영 서버 CORS에 이 사이트 주소가 등록돼 있어야 의견 보내기가 됩니다 (이용 기록은 text/plain이라 등록 없이도 도착).

## 구조
```
src/forms/types.ts        서식 정의 타입 (Box, FieldDef, InputSpec, Mark)
src/forms/birthReport.ts  출생신고서 칸 정의: 좌표 + 5개 국어 라벨/안내 + 입력 종류
src/forms/countries.ts    국가 목록 (모국어 표시 → 한국어 국가명 출력)
src/forms/render.ts       입력값 → 서식 위 표시(Mark) 변환, 글자 크기 자동 맞춤
src/App.tsx               해시 라우팅 (언어 선택 → 문서 선택 → 서식 작성)
src/pages/                LandingView · ListView · Header · OfficeMap (gusring-web) + FormFillView
src/forms/catalog.ts      문서 선택 화면 서식 목록 · 카테고리
src/components/FormSvg    서식 이미지 + 입력값 + 번호 토글 (SVG)
src/components/FieldSheet 바텀시트 (안내 · 입력 · 칸 미리보기)
src/lib/exportImage.ts    같은 Mark를 Canvas에 그려 PNG 생성
src/lib/gusring-api.ts    구스링 백엔드 연결 (이용 기록 · 의견 보내기)
src/components/FeedbackSheet  의견 보내기 바텀시트
```

## 서식 추가하기
`src/forms/`에 `FormDef`를 하나 더 만들고 `src/forms/catalog.ts`에 카테고리·설명과 함께 등록하면 문서 선택 화면에 나타납니다. 칸마다 필요한 것은
- `area`: 서식 이미지 위 탭 영역 (원본 이미지 픽셀 좌표)
- `input`: 입력 종류(`text` · `date` · `datetime` · `choice` · `country` · `idnum`)와 값을 쓸 위치
- `label` · `help`: 5개 국어 안내

## 확인이 필요한 것
- 외국인 이름의 한글 표기 기준 (현재 안내: 여권·외국인등록증 이름을 한글로 옮겨 적기)
- 컴퓨터로 기재해 출력한 서식을 법원 송부용으로 그대로 받는지
- zh/ja/vi 안내 문구 원어민 검수
