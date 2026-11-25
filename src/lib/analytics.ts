// 이용 기록 보내기 (gusring-api.ts는 서버 원본의 복사본이라 고치지 않고 여기서 감싼다).
// 관리 화면의 「이용자 화면 미리보기」는 실제 이용이 아니므로 기록을 끈다.

import * as api from './gusring-api';

let enabled = true;

/** 관리 화면에서 한 번 부른다 — 이후 track·flush는 아무것도 보내지 않는다 */
export function disableAnalytics(): void {
  enabled = false;
}

export function track(e: api.GusringEvent): void {
  if (enabled) api.track(e);
}

export function flush(useBeacon = false): Promise<void> {
  return enabled ? api.flush(useBeacon) : Promise.resolve();
}
