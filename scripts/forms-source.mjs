// 지금 코드에 있는 서식(src/forms/catalog.ts + 서식 파일)을 서버 저장 형식(FormDefinition)으로 바꿔 읽는다.
// check:forms와 export:forms가 같이 쓴다. 서버로 옮기기를 마치면 서식 파일과 함께 없앤다.

import { readFileSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';

export const root = join(dirname(fileURLToPath(import.meta.url)), '..');

/** PNG 머리(IHDR)에서 실제 크기를 읽는다 */
export const pngSize = (buf) => ({ width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) });

/**
 * JSON으로 옮기면 뜻이 바뀌는 값(함수·NaN·클래스 객체·배열 속 undefined)이 있는 곳.
 * 객체 속성의 undefined(예: `required: b.required`)는 JSON에서 빠져도 「없음」과 같으므로 괜찮다.
 */
export function nonJsonPaths(value, path = '$') {
  if (value === null || typeof value === 'string' || typeof value === 'boolean') return [];
  if (typeof value === 'number') return Number.isFinite(value) ? [] : [path];
  if (Array.isArray(value)) return value.flatMap((v, i) => nonJsonPaths(v, `${path}[${i}]`));
  if (typeof value === 'object' && Object.getPrototypeOf(value) === Object.prototype) {
    return Object.entries(value).flatMap(([k, v]) => (v === undefined ? [] : nonJsonPaths(v, `${path}.${k}`)));
  }
  return [path];
}

/**
 * 콜백에 vite(TS 모듈 읽기용)와 서식 목록을 넘긴다.
 * 목록 항목: { key, formNo, definition, images: { [imageId]: { file, buf } } }
 * definition.pages[].imageId는 원본 이미지 파일 이름 (예: birth-report_ko.png) — 서버로 옮길 때 실제 id로 바뀐다
 */
export async function withSourceForms(fn) {
  const vite = await createServer({
    root,
    configFile: false,
    logLevel: 'error',
    appType: 'custom',
    server: { middlewareMode: true, hmr: false },
  });
  try {
    const { catalog, entryKey, entryTitle, formTitle } = await vite.ssrLoadModule('/src/forms/catalog.ts');
    const items = [];
    const loadErrors = [];
    for (const entry of catalog) {
      const key = entryKey(entry);
      let form;
      try {
        form = await entry.load();
      } catch (e) {
        loadErrors.push(`${entry.formNo} ${key}: 서식 정의를 불러오지 못함 (${e.message})`);
        continue;
      }
      if (form.id !== entry.formId) loadErrors.push(`${entry.formNo} ${key}: 목록 formId ${entry.formId} ↔ 서식 정의 id ${form.id}`);
      if (JSON.stringify(formTitle(form.id)) !== JSON.stringify(form.title)) loadErrors.push(`${entry.formNo} ${key}: 목록 제목(catalog.ts FORM_TITLES)이 서식 정의 title과 다름`);

      const images = {};
      const pages = form.pages.map((p) => {
        const file = basename(p.image);
        try {
          images[file] = { file, buf: readFileSync(join(root, 'public', p.image)) };
        } catch {
          loadErrors.push(`${entry.formNo} ${key}: 이미지 없음 (public${p.image})`);
        }
        return { imageId: file, width: p.width, height: p.height, ...(p.marginX !== undefined && { marginX: p.marginX }) };
      });
      const definition = {
        title: entryTitle(entry),
        desc: entry.desc,
        category: entry.cat,
        ...(entry.preset && { preset: entry.preset }),
        pages,
        sections: form.sections,
        fields: form.fields,
      };
      items.push({ key, formNo: entry.formNo, definition, images });
    }
    return await fn({ vite, items, loadErrors });
  } finally {
    await vite.close();
  }
}
