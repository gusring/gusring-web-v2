// 서식 정의 점검: npm run check:forms
// 규칙은 src/forms/validate.ts (관리 화면·서버 게시 검사와 같은 규칙). 문제가 있으면 종료 코드 1.

import { nonJsonPaths, pngSize, withSourceForms } from './forms-source.mjs';

const problems = await withSourceForms(async ({ vite, items, loadErrors }) => {
  const { validateDefinition, validateCatalog } = await vite.ssrLoadModule('/src/forms/validate.ts');
  const out = [...loadErrors];
  out.push(...validateCatalog(items).map((p) => p.message));

  for (const { key, formNo, definition, images } of items) {
    const where = `${formNo} ${key}`;
    for (const page of definition.pages) if (/[^\x21-\x7e]/.test(page.imageId)) out.push(`${where}: 이미지 이름에 한글·공백 (${page.imageId})`);
    for (const path of nonJsonPaths(definition)) out.push(`${where}: JSON으로 옮길 수 없는 값 ${path}`);
    const size = (id) => (images[id] ? pngSize(images[id].buf) : undefined);
    for (const p of validateDefinition(definition, size)) out.push(`${where}${p.fieldId ? ` · ${p.fieldId}` : ''}: ${p.message}`);

    const required = definition.fields.filter((f) => f.required).length;
    console.log(`  ${String(formNo).padStart(2)} ${key} — ${definition.pages.length}쪽, 칸 ${definition.fields.length}개${required ? `, 필수 ${required}` : ''}`);
  }
  return out;
});

for (const p of problems) console.log(`✗ ${p}`);
console.log(problems.length ? `\n문제 ${problems.length}건` : '\n서식 이상 없음');
process.exit(problems.length ? 1 : 0);
