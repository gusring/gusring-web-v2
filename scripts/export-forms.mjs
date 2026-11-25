// 서버로 옮기기: npm run export:forms -- <나갈 폴더>
// 지금 코드의 서식을 forms.json + 원본 PNG로 내보낸다. gusring-server에서 `npm run forms:import <폴더>`로 넣는다.
// forms.json: [{ key, formNo, definition }] — definition.pages[].imageId는 같은 폴더의 PNG 파일 이름

import { mkdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { nonJsonPaths, withSourceForms } from './forms-source.mjs';

const outDir = process.argv[2];
if (!outDir) {
  console.error('나갈 폴더를 주세요: npm run export:forms -- ../forms-export');
  process.exit(1);
}

await withSourceForms(async ({ vite, items, loadErrors }) => {
  const { validateDefinition, validateCatalog } = await vite.ssrLoadModule('/src/forms/validate.ts');
  // 문제가 있는 서식은 내보내지 않는다 (서버에서 게시가 막히므로)
  const problems = [...loadErrors, ...validateCatalog(items).map((p) => p.message)];
  for (const { key, definition } of items) {
    for (const path of nonJsonPaths(definition)) problems.push(`${key}: JSON으로 옮길 수 없는 값 ${path}`);
    for (const p of validateDefinition(definition)) problems.push(`${key}: ${p.message}`);
  }
  if (problems.length) {
    problems.forEach((p) => console.error(`✗ ${p}`));
    process.exit(1);
  }

  const dir = resolve(outDir);
  mkdirSync(dir, { recursive: true });
  const files = new Map();
  for (const { images } of items) for (const img of Object.values(images)) files.set(img.file, img.buf);
  for (const [file, buf] of files) writeFileSync(join(dir, file), buf);
  const forms = items.map(({ key, formNo, definition }) => ({ key, formNo, definition }));
  writeFileSync(join(dir, 'forms.json'), `${JSON.stringify(forms, null, 2)}\n`);
  console.log(`서식 ${forms.length}개, 이미지 ${files.size}개 → ${dir}`);
});
