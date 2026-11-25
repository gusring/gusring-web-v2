// 관리 화면 빌드를 gusring-server에 넣는다: npm run admin:copy -- [gusring-server 폴더]
// (기본 ../gusring-server) → <서버>/public/admin/forms/ 를 비우고 dist-admin을 복사, admin.html은 index.html로
// 서버 저장소에서 바뀐 파일을 커밋하면 서버가 /admin/forms/에서 제공한다.

import { cpSync, existsSync, renameSync, rmSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { root } from './forms-source.mjs';

const dist = join(root, 'dist-admin');
const server = resolve(process.argv[2] ?? join(root, '..', 'gusring-server'));
const target = join(server, 'public', 'admin', 'forms');

if (!existsSync(join(dist, 'admin.html'))) {
  console.error('먼저 npm run build:admin 을 돌려 주세요.');
  process.exit(1);
}
if (!existsSync(join(server, 'public', 'admin'))) {
  console.error(`gusring-server 폴더가 아닙니다: ${server} (public/admin 없음)`);
  process.exit(1);
}

rmSync(target, { recursive: true, force: true });
cpSync(dist, target, { recursive: true });
renameSync(join(target, 'admin.html'), join(target, 'index.html'));
console.log(`관리 화면 → ${target}`);
