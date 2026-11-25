// 개발용 가짜 서식 API: npm run dev:api -- <데이터 폴더>
// 폴더에 forms.json(서식 목록 [{ key, formNo, definition }] + 같은 폴더의 PNG)이 있으면 그것으로 시작하고, 없으면 빈 상태로 시작한다.
// gusring-server의 서식 API(공개 + 관리자)와 같은 약속으로 응답한다. 서버 없이 이용자 화면·관리 화면을 개발·확인할 때 쓴다.
// - 데이터는 메모리 + 폴더의 dev-db.json에 저장 (지우면 처음 내보낸 상태로)
// - 로그인: 아무 비밀번호나 됨. 아이디가 staff로 시작하면 일반 관리자, 아니면 계정 관리자
// - 실제 서버처럼 쿠키로 바꾸는 요청은 Origin이 같아야 하고, 게시·지우기는 계정 관리자만
// 실제 서버와 다른 점이 생기면 실제 서버(gusring-server docs/api.md)가 맞다.

import { createHash, randomUUID } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
/** PNG 머리(IHDR)에서 크기를 읽는다 */
const pngSize = (buf) => ({ width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) });

const dir = resolve(process.argv[2] ?? '');
if (!process.argv[2]) {
  console.error('데이터 폴더를 주세요: npm run dev:api -- ../dev-forms');
  process.exit(1);
}
mkdirSync(dir, { recursive: true });
const PORT = Number(process.env.PORT ?? 4000);
const DB_FILE = join(dir, 'dev-db.json');

// ── 저장소 ──
const now = () => new Date().toISOString();
let db;
if (existsSync(DB_FILE)) {
  db = JSON.parse(readFileSync(DB_FILE, 'utf8'));
} else {
  db = { forms: [], images: {} };
  const seed = existsSync(join(dir, 'forms.json')) ? JSON.parse(readFileSync(join(dir, 'forms.json'), 'utf8')) : [];
  for (const f of seed) {
    const at = now();
    db.forms.push({
      id: randomUUID(), key: f.key, formNo: f.formNo, draft: f.definition, draftUpdatedAt: at, draftUpdatedBy: 'import',
      publishedVersion: 1, deletedAt: null, versions: [{ version: 1, definition: f.definition, publishedBy: 'import', publishedAt: at }],
    });
    for (const p of f.definition.pages) db.images[p.imageId] ??= { file: p.imageId, ...pngSize(readFileSync(join(dir, p.imageId))) };
  }
}
const persist = () => writeFileSync(DB_FILE, JSON.stringify(db));
const imageBytes = (id) => readFileSync(join(dir, db.images[id].file));

// ── 응답 ──
class ApiError extends Error {
  constructor(status, code, message, details) {
    super(message);
    Object.assign(this, { status, code, details });
  }
}
const send = (res, status, body, headers = {}) => {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', ...headers });
  res.end(JSON.stringify(body));
};
const ok = (res, data, message = '처리했습니다.', status = 200, headers) => send(res, status, { success: true, message, data }, headers);

const readBody = (req) =>
  new Promise((done, fail) => {
    const chunks = [];
    let size = 0;
    req.on('data', (c) => {
      size += c.length;
      if (size > 4 * 1024 * 1024) fail(new ApiError(413, 'COMMON_PAYLOAD_TOO_LARGE', '요청이 너무 큽니다.'));
      chunks.push(c);
    });
    req.on('end', () => done(Buffer.concat(chunks)));
  });
const json = async (req) => {
  try {
    return JSON.parse((await readBody(req)).toString('utf8') || '{}');
  } catch {
    throw new ApiError(400, 'COMMON_BAD_REQUEST', 'JSON을 읽을 수 없습니다.');
  }
};

// ── 관리자 로그인 (쿠키 gusring_admin = 아이디) ──
const cookieUser = (req) => /(?:^|;\s*)gusring_admin=([^;]+)/.exec(req.headers.cookie ?? '')?.[1];
const roleOf = (username) => (username.startsWith('staff') ? 'staff' : 'manager');
function requireAdmin(req) {
  const username = cookieUser(req);
  if (!username) throw new ApiError(401, 'AUTH_ADMIN_REQUIRED', '로그인이 필요합니다.');
  if (!['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    const origin = req.headers.origin;
    if (!origin || new URL(origin).host !== req.headers.host) throw new ApiError(403, 'AUTH_BAD_ORIGIN', '다른 출처에서 온 요청입니다.');
  }
  return { username, role: roleOf(username) };
}
const requireManager = (admin) => {
  if (admin.role !== 'manager') throw new ApiError(403, 'AUTH_FORBIDDEN', '계정 관리자만 할 수 있습니다.');
};

// ── 서식 ──
const live = () => db.forms.filter((f) => !f.deletedAt);
const findForm = (id) => {
  const f = live().find((x) => x.id === id);
  if (!f) throw new ApiError(404, 'FORM_NOT_FOUND', '서식이 없습니다.');
  return f;
};
const published = (f) => f.versions.find((v) => v.version === f.publishedVersion);
const adminForm = (f) => ({
  id: f.id, key: f.key, formNo: f.formNo, draft: f.draft, draftUpdatedAt: f.draftUpdatedAt, draftUpdatedBy: f.draftUpdatedBy,
  publishedVersion: f.publishedVersion,
});
const adminSummary = (f) => {
  const pub = published(f);
  return {
    id: f.id, key: f.key, formNo: f.formNo, category: f.draft.category, title: f.draft.title,
    draftUpdatedAt: f.draftUpdatedAt, draftUpdatedBy: f.draftUpdatedBy,
    publishedVersion: f.publishedVersion, publishedAt: pub?.publishedAt ?? null,
    hasUnpublishedChanges: !pub || JSON.stringify(pub.definition) !== JSON.stringify(f.draft),
  };
};
const checkUnique = (key, formNo, selfId) => {
  if (!/^[a-z0-9][a-z0-9-]{0,63}$/.test(key)) throw new ApiError(400, 'COMMON_INVALID_INPUT', '주소 이름 형식이 틀렸습니다.');
  // 실제 서버처럼 지운 서식의 주소 이름·번호도 계속 자리를 차지한다
  if (db.forms.some((f) => f.key === key && f.id !== selfId)) throw new ApiError(409, 'FORM_KEY_TAKEN', '이미 쓰는 주소 이름입니다.');
  if (db.forms.some((f) => f.formNo === formNo && f.id !== selfId)) throw new ApiError(409, 'FORM_NO_TAKEN', '이미 쓰는 서식 번호입니다.');
};

// gusring-server src/middlewares/security-headers.ts의 adminPageCsp와 같게
const ADMIN_CSP = "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; connect-src 'self'; object-src 'none'; base-uri 'none'; form-action 'self'; frame-ancestors 'none'";

let validate;
const loadValidate = async () => {
  // 게시 검사는 실제 서버처럼 validate.ts 규칙 (TS라 vite로 읽는다)
  const { createServer: vite } = await import('vite');
  const v = await vite({ root, configFile: false, logLevel: 'error', appType: 'custom', server: { middlewareMode: true, hmr: false } });
  const mod = await v.ssrLoadModule('/src/forms/validate.ts');
  validate = mod.validateDefinition;
};

async function route(req, res) {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const path = url.pathname;
  const m = (re) => re.exec(path);
  let p;

  // 관리 화면 빌드(dist-admin)를 실제 서버처럼 /admin/forms/에서 CSP와 함께 제공 — 빌드가 CSP에 막히지 않는지 확인용
  if (req.method === 'GET' && path.startsWith('/admin/forms')) {
    const distAdmin = join(root, 'dist-admin');
    const rel = path.replace(/^\/admin\/forms\/?/, '');
    const file = rel && existsSync(join(distAdmin, rel)) && !rel.includes('..') ? join(distAdmin, rel) : join(distAdmin, 'admin.html');
    if (!existsSync(file)) throw new ApiError(404, 'NOT_FOUND', '먼저 npm run build:admin 을 돌려 주세요.');
    const type = { js: 'text/javascript', css: 'text/css', html: 'text/html; charset=utf-8' }[file.split('.').pop()] ?? 'application/octet-stream';
    res.writeHead(200, {
      'Content-Type': type,
      'Content-Security-Policy': ADMIN_CSP,
    });
    return res.end(readFileSync(file));
  }

  // 공개 (CORS 허용)
  const cors = { 'Access-Control-Allow-Origin': '*' };
  if (req.method === 'OPTIONS') return send(res, 204, {}, { ...cors, 'Access-Control-Allow-Methods': 'GET' });
  if (req.method === 'GET' && path === '/api/v1/forms') {
    const list = live().filter(published).map((f) => {
      const d = published(f).definition;
      return { key: f.key, formNo: f.formNo, category: d.category, title: d.title, desc: d.desc, version: f.publishedVersion };
    }).sort((a, b) => a.formNo - b.formNo);
    return ok(res, list, '서식 목록입니다.', 200, cors);
  }
  if (req.method === 'GET' && (p = m(/^\/api\/v1\/forms\/([^/]+)$/))) {
    const f = live().find((x) => x.key === decodeURIComponent(p[1]) && published(x));
    if (!f) throw new ApiError(404, 'FORM_NOT_FOUND', '서식이 없습니다.');
    return ok(res, { key: f.key, formNo: f.formNo, version: f.publishedVersion, definition: published(f).definition }, '서식입니다.', 200, cors);
  }
  if (req.method === 'GET' && (p = m(/^\/api\/v1\/form-images\/([^/]+)$/))) {
    if (!db.images[p[1]]) throw new ApiError(404, 'FORM_IMAGE_NOT_FOUND', '이미지가 없습니다.');
    res.writeHead(200, { 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=31536000, immutable', ...cors });
    return res.end(imageBytes(p[1]));
  }

  // 이용 기록·의견은 받기만 하고 버림 (.env.local의 VITE_GUSRING_API가 이 서버를 가리킬 때)
  if (req.method === 'POST' && (path === '/api/v1/events' || path === '/api/v1/feedbacks')) {
    await readBody(req);
    return ok(res, path.endsWith('feedbacks') ? { id: null } : null, '받았습니다.', 201, cors);
  }

  // 로그인
  if (req.method === 'POST' && path === '/api/v1/auth/login') {
    const { username } = await json(req);
    if (!username) throw new ApiError(400, 'COMMON_INVALID_INPUT', '아이디를 넣어 주세요.');
    const name = String(username).trim().toLowerCase();
    return ok(res, { username: name }, '로그인했습니다.', 200, { 'Set-Cookie': `gusring_admin=${name}; Path=/api/v1; HttpOnly; SameSite=Strict` });
  }
  if (req.method === 'POST' && path === '/api/v1/auth/logout') {
    return ok(res, null, '로그아웃했습니다.', 200, { 'Set-Cookie': 'gusring_admin=; Path=/api/v1; Max-Age=0' });
  }
  if (req.method === 'GET' && path === '/api/v1/auth/me') {
    const a = requireAdmin(req);
    return ok(res, { ...a, mustChangePassword: false }, '로그인 상태입니다.');
  }

  // 관리자
  if (!path.startsWith('/api/v1/admin/')) throw new ApiError(404, 'NOT_FOUND', `${req.method} ${path} 경로가 없습니다.`);
  const admin = requireAdmin(req);

  if (req.method === 'POST' && path === '/api/v1/admin/form-images') {
    if (req.headers['content-type'] !== 'image/png') throw new ApiError(400, 'FORM_IMAGE_INVALID', 'PNG 파일만 올릴 수 있습니다.');
    const buf = await readBody(req);
    if (buf.length < 24 || buf.toString('latin1', 1, 4) !== 'PNG') throw new ApiError(400, 'FORM_IMAGE_INVALID', 'PNG 파일만 올릴 수 있습니다.');
    const id = createHash('sha256').update(buf).digest('hex');
    if (!db.images[id]) {
      writeFileSync(join(dir, `${id}.png`), buf);
      db.images[id] = { file: `${id}.png`, ...pngSize(buf) };
      persist();
    }
    return ok(res, { id, width: db.images[id].width, height: db.images[id].height }, '이미지를 올렸습니다.', 201);
  }
  if (req.method === 'GET' && path === '/api/v1/admin/forms') {
    return ok(res, live().map(adminSummary).sort((a, b) => a.formNo - b.formNo), '서식 목록입니다.');
  }
  if (req.method === 'POST' && path === '/api/v1/admin/forms') {
    const { key, formNo, definition, copyFrom } = await json(req);
    checkUnique(key, formNo);
    const draft = copyFrom ? structuredClone(findForm(copyFrom).draft) : definition;
    if (!draft) throw new ApiError(400, 'COMMON_INVALID_INPUT', '정의나 복제할 서식을 주세요.');
    const f = { id: randomUUID(), key, formNo, draft, draftUpdatedAt: now(), draftUpdatedBy: admin.username, publishedVersion: null, deletedAt: null, versions: [] };
    db.forms.push(f);
    persist();
    return ok(res, adminForm(f), '서식을 만들었습니다.', 201);
  }
  if ((p = m(/^\/api\/v1\/admin\/forms\/([^/]+)$/))) {
    const f = findForm(p[1]);
    if (req.method === 'GET') return ok(res, adminForm(f), '서식입니다.');
    if (req.method === 'PATCH') {
      const { definition, key = f.key, formNo = f.formNo, baseUpdatedAt } = await json(req);
      if (baseUpdatedAt !== f.draftUpdatedAt) throw new ApiError(409, 'FORM_CONFLICT', '다른 사람이 먼저 고쳤습니다. 새로 불러와 주세요.', { draftUpdatedAt: f.draftUpdatedAt, draftUpdatedBy: f.draftUpdatedBy });
      checkUnique(key, formNo, f.id);
      Object.assign(f, { key, formNo, draft: definition ?? f.draft, draftUpdatedAt: now(), draftUpdatedBy: admin.username });
      persist();
      return ok(res, adminForm(f), '초안을 저장했습니다.');
    }
    if (req.method === 'DELETE') {
      requireManager(admin);
      f.deletedAt = now();
      persist();
      return ok(res, null, '서식을 지웠습니다.');
    }
  }
  if (req.method === 'POST' && (p = m(/^\/api\/v1\/admin\/forms\/([^/]+)\/publish$/))) {
    requireManager(admin);
    const f = findForm(p[1]);
    const { baseUpdatedAt } = await json(req);
    if (baseUpdatedAt && baseUpdatedAt !== f.draftUpdatedAt) throw new ApiError(409, 'FORM_CONFLICT', '다른 사람이 먼저 고쳤습니다. 새로 불러와 주세요.', { draftUpdatedAt: f.draftUpdatedAt, draftUpdatedBy: f.draftUpdatedBy });
    if (!validate) await loadValidate();
    const problems = validate(f.draft, (id) => db.images[id]);
    if (problems.length) throw new ApiError(422, 'FORM_INVALID', '검사를 통과하지 못해 게시하지 않았습니다.', problems);
    const version = Math.max(0, ...f.versions.map((v) => v.version)) + 1;
    f.versions.push({ version, definition: structuredClone(f.draft), publishedBy: admin.username, publishedAt: now() });
    f.publishedVersion = version;
    persist();
    return ok(res, { version }, '게시했습니다.');
  }
  if (req.method === 'GET' && (p = m(/^\/api\/v1\/admin\/forms\/([^/]+)\/versions$/))) {
    const f = findForm(p[1]);
    return ok(res, f.versions.map(({ version, publishedBy, publishedAt }) => ({ version, publishedBy, publishedAt })).reverse(), '게시 이력입니다.');
  }
  if (req.method === 'POST' && (p = m(/^\/api\/v1\/admin\/forms\/([^/]+)\/versions\/(\d+)\/restore$/))) {
    const f = findForm(p[1]);
    const v = f.versions.find((x) => x.version === Number(p[2]));
    if (!v) throw new ApiError(404, 'FORM_VERSION_NOT_FOUND', '그 버전이 없습니다.');
    Object.assign(f, { draft: structuredClone(v.definition), draftUpdatedAt: now(), draftUpdatedBy: admin.username });
    persist();
    return ok(res, adminForm(f), `${v.version}번 버전을 초안으로 가져왔습니다.`);
  }
  throw new ApiError(404, 'NOT_FOUND', `${req.method} ${path} 경로가 없습니다.`);
}

createServer((req, res) => {
  route(req, res).catch((e) => {
    if (e instanceof ApiError) return send(res, e.status, { success: false, message: e.message, error: { code: e.code, ...(e.details && { details: e.details }) } }, { 'Access-Control-Allow-Origin': '*' });
    console.error(e);
    send(res, 500, { success: false, message: '서버 오류입니다.', error: { code: 'COMMON_INTERNAL_ERROR' } });
  });
}).listen(PORT, () => console.info(`가짜 서식 API http://localhost:${PORT} (데이터 ${dir})`));
