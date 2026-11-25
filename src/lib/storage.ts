// 브라우저 저장소 (서버 전송 없음).
// - 서식 입력값(이름·주민등록번호 등): sessionStorage — 이 탭 안에서만 남고, 탭을 닫으면 지워진다.
//   구청 공용 기기에서 다음 사람이 앞사람의 정보를 보지 않도록 기기에 오래 남기지 않는다.
// - 언어·안내 닫음 같은 설정: localStorage — 개인정보가 아니라 다음에 와도 유지한다.
// 시크릿 모드 등에서 저장소가 막혀 있어도 앱은 동작해야 한다 (저장소에 접근만 해도 예외가 날 수 있음).

type StoreGetter = () => Storage;

/** 설정용 (오래 유지) */
export const persistent: StoreGetter = () => window.localStorage;
/** 입력값용 (탭을 닫으면 지워짐) */
export const tabOnly: StoreGetter = () => window.sessionStorage;

export function load<T>(key: string, fallback: T, store: StoreGetter = persistent): T {
  try {
    const raw = store().getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function save(key: string, value: unknown, store: StoreGetter = persistent) {
  try {
    store().setItem(key, JSON.stringify(value));
  } catch {
    /* 저장 실패는 무시 */
  }
}

export function remove(key: string, store: StoreGetter = persistent) {
  try {
    store().removeItem(key);
  } catch {
    /* noop */
  }
}

/** 서식 입력값 저장 이름 */
export const valuesKey = (entryKey: string) => `gusring.${entryKey}.values`;

const VALUES_KEY = /^gusring\..+\.values$/;

/** 예전 버전이 localStorage에 남긴 서식 입력값을 지운다 (앱 시작 때 한 번) */
export function purgeStoredValues() {
  try {
    const ls = persistent();
    const stale: string[] = [];
    for (let i = 0; i < ls.length; i++) {
      const k = ls.key(i);
      if (k && VALUES_KEY.test(k)) stale.push(k);
    }
    stale.forEach((k) => ls.removeItem(k));
  } catch {
    /* noop */
  }
}
