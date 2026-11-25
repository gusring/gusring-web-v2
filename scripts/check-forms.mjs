// 게시된 서식 점검: npm run check:forms -- [서버 주소]
// 서버(기본 VITE_GUSRING_API 또는 운영)의 게시된 서식을 받아 src/forms/validate.ts 규칙으로 검사한다.
// 게시할 때 서버가 같은 규칙으로 검사하므로 보통은 문제가 없다 — 규칙을 바꾼 뒤 이미 게시된 서식을 다시 볼 때 쓴다.
// 이미지 실제 크기도 받아 비교한다. 문제가 있으면 종료 코드 1.

import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer, loadEnv } from 'vite';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const env = loadEnv('development', root, '');
const base = (process.argv[2] || env.VITE_GUSRING_API || 'https://api.gusring.kro.kr').replace(/\/+$/, '');

const get = async (path) => {
  const res = await fetch(`${base}${path}`);
  const body = await res.json().catch(() => null);
  if (!body?.success) throw new Error(`${path}: ${body?.message ?? `HTTP ${res.status}`}`);
  return body.data;
};

/** PNG 머리(IHDR)만 읽어 크기를 안다 */
async function pngSize(imageId) {
  const res = await fetch(`${base}/api/v1/form-images/${encodeURIComponent(imageId)}`);
  if (!res.ok) return undefined;
  const buf = Buffer.from(await res.arrayBuffer());
  return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
}

const vite = await createServer({ root, configFile: false, logLevel: 'error', appType: 'custom', server: { middlewareMode: true, hmr: false } });
const problems = [];
try {
  const { validateDefinition, validateCatalog } = await vite.ssrLoadModule('/src/forms/validate.ts');
  console.log(`서버 ${base}`);
  const list = await get('/api/v1/forms');
  problems.push(...validateCatalog(list).map((p) => p.message));

  const sizes = new Map();
  for (const item of list) {
    const where = `${item.formNo} ${item.key}`;
    const { definition: def, version } = await get(`/api/v1/forms/${encodeURIComponent(item.key)}`);
    for (const p of def.pages) if (!sizes.has(p.imageId)) sizes.set(p.imageId, await pngSize(p.imageId));
    for (const [i, p] of def.pages.entries()) if (!sizes.get(p.imageId)) problems.push(`${where}: ${i + 1}쪽 이미지를 받을 수 없음`);
    for (const p of validateDefinition(def, (id) => sizes.get(id))) problems.push(`${where}${p.fieldId ? ` · ${p.fieldId}` : ''}: ${p.message}`);
    const required = def.fields.filter((f) => f.required).length;
    console.log(`  ${String(item.formNo).padStart(3)} ${item.key} v${version} — ${def.pages.length}쪽, 칸 ${def.fields.length}개${required ? `, 필수 ${required}` : ''}`);
  }
  for (const p of problems) console.log(`✗ ${p}`);
  console.log(problems.length ? `\n문제 ${problems.length}건` : `\n서식 ${list.length}개 이상 없음`);
} catch (e) {
  console.error(`✗ ${e.message}`);
  problems.push(e.message);
} finally {
  await vite.close();
}
process.exit(problems.length ? 1 : 0);
