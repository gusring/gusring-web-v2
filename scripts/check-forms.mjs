// 서식 정의 점검: npm run check:forms
// 서식을 추가·수정한 뒤 돌려서 좌표·번역·이름 실수를 잡는다. 문제가 있으면 종료 코드 1.
// TS 서식 파일을 Vite로 불러온다 (새 의존성 없음).

import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const LANGS = ['ko', 'en', 'zh', 'ja', 'vi'];

const vite = await createServer({
  root,
  configFile: false,
  logLevel: 'error',
  appType: 'custom',
  server: { middlewareMode: true, hmr: false },
});

let problems = 0;
try {
  const { catalog, entryKey } = await vite.ssrLoadModule('/src/forms/catalog.ts');
  const { cleanEvent } = await vite.ssrLoadModule('/src/lib/gusring-api.ts');

  const problem = (where, msg) => {
    problems++;
    console.log(`✗ ${where}: ${msg}`);
  };

  /** 5개 국어가 모두 비어 있지 않은지 */
  const checkL = (where, what, l) => {
    if (!l) return problem(where, `${what} 없음`);
    for (const lang of LANGS) if (!l[lang]?.trim()) problem(where, `${what} ${lang} 비어 있음`);
  };

  /** PNG 머리(IHDR)에서 실제 크기를 읽는다 */
  const pngSize = (image) => {
    const buf = readFileSync(join(root, 'public', image));
    return { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) };
  };

  const inside = (b, pg) => b.x >= 0 && b.y >= 0 && b.w > 0 && b.h > 0 && b.x + b.w <= pg.width && b.y + b.h <= pg.height;

  /** 입력값을 써 넣는 상자들 */
  const valueBoxes = (input) => {
    switch (input.kind) {
      case 'text': return input.parts.map((p) => p.box);
      case 'date': return input.box ? [input.box] : [input.boxes.y, input.boxes.m, input.boxes.d];
      case 'datetime': return Object.values(input.boxes);
      case 'choice': return input.extra ? [input.extra.box] : [];
      case 'country': return [input.box];
      case 'idnum': return input.box ? [input.box] : [input.front, input.back];
      default: return [];
    }
  };

  const keys = new Set();
  const formNos = new Map();
  for (const entry of catalog) {
    const key = entryKey(entry);
    const form = entry.form;
    const where = `${entry.formNo} ${key}`;

    if (keys.has(key)) problem(where, '목록 key 중복');
    keys.add(key);
    if (formNos.has(entry.formNo)) problem(where, `formNo ${entry.formNo}가 ${formNos.get(entry.formNo)}와 중복`);
    formNos.set(entry.formNo, key);
    if (!/^[a-z0-9][a-z0-9-]*$/.test(key)) problem(where, '목록 key는 영어 kebab-case');
    if (!cleanEvent({ type: 'form_view', formKey: form.id })?.formKey) problem(where, `서식 id ${form.id}를 이용 기록 서버가 받지 않음`);
    checkL(where, '제목', entry.title ?? form.title);
    checkL(where, '설명', entry.desc);

    form.pages.forEach((pg, i) => {
      if (/[^\x21-\x7e]/.test(pg.image)) problem(where, `${i + 1}쪽 이미지 이름에 한글·공백 (${pg.image})`);
      try {
        const { w, h } = pngSize(pg.image);
        if (w !== pg.width || h !== pg.height) problem(where, `${i + 1}쪽 크기 ${pg.width}×${pg.height} ↔ 실제 이미지 ${w}×${h}`);
      } catch {
        problem(where, `${i + 1}쪽 이미지 없음 (public${pg.image})`);
      }
    });

    const sections = new Set(form.sections.map((s) => s.id));
    form.sections.forEach((s) => checkL(where, `섹션 ${s.id} 이름`, s.label));
    const ids = new Set(form.fields.map((f) => f.id));
    const seen = new Set();
    let lastPage = 1;

    for (const f of form.fields) {
      const at = `${where} · ${f.id}`;
      if (seen.has(f.id)) problem(at, '칸 id 중복');
      seen.add(f.id);
      if (!cleanEvent({ type: 'field_open', formKey: form.id, fieldId: f.id })?.fieldId) problem(at, '칸 id를 이용 기록 서버가 받지 않음');
      if (!sections.has(f.section)) problem(at, `없는 섹션 ${f.section}`);
      if (!f.koLabel?.trim()) problem(at, 'koLabel 없음');
      checkL(at, 'label', f.label);
      checkL(at, 'help', f.help);

      const page = f.page ?? 1;
      if (page < lastPage) problem(at, `${page}쪽 칸이 ${lastPage}쪽 칸 뒤에 있음 (번호 순서)`);
      lastPage = page;
      const pg = form.pages[page - 1];
      if (!pg) {
        problem(at, `없는 쪽 ${page}`);
        continue;
      }
      if (!inside(f.area, pg)) problem(at, 'area가 쪽 밖으로 나감');
      for (const b of valueBoxes(f.input)) if (!inside(b, pg)) problem(at, '값 상자가 쪽 밖으로 나감');

      const input = f.input;
      if (input.kind === 'text') {
        input.parts.forEach((p) => p.label && checkL(at, `${p.key} 라벨`, p.label));
        if (new Set(input.parts.map((p) => p.key)).size !== input.parts.length) problem(at, '입력칸 key 중복');
      }
      if (input.kind === 'choice') {
        const values = input.options.map((o) => o.value);
        if (new Set(values).size !== values.length) problem(at, '선택지 value 중복');
        if (input.multiple && values.some((v) => v.includes(','))) problem(at, '여러 개 고르기 선택지 value에 쉼표');
        for (const o of input.options) {
          checkL(at, `선택지 ${o.value}`, o.label);
          if (!o.ko?.trim()) problem(at, `선택지 ${o.value} ko 없음`);
          if (o.mark.x < 0 || o.mark.y < 0 || o.mark.x > pg.width || o.mark.y > pg.height) problem(at, `선택지 ${o.value} 표시 위치가 쪽 밖`);
        }
        for (const w of input.extra?.when ?? []) if (!values.includes(w)) problem(at, `extra.when의 ${w}가 선택지에 없음`);
      }
      for (const src of f.copyFrom ?? []) {
        if (!ids.has(src.field)) problem(at, `copyFrom ${src.field} 칸 없음`);
        checkL(at, `copyFrom ${src.field} 버튼`, src.label);
      }
    }

    for (const id of Object.keys(entry.preset ?? {})) if (!ids.has(id)) problem(where, `preset의 ${id} 칸 없음`);

    const required = form.fields.filter((f) => f.required).length;
    console.log(`  ${String(entry.formNo).padStart(2)} ${key} — ${form.pages.length}쪽, 칸 ${form.fields.length}개${required ? `, 필수 ${required}` : ''}`);
  }

  console.log(problems ? `\n문제 ${problems}건` : `\n서식 ${catalog.length}개 이상 없음`);
} finally {
  await vite.close();
}
process.exit(problems ? 1 : 0);
