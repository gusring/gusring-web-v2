// 게시된 서식을 구스링 백엔드에서 받는다 (공개 API, 로그인 없음).
// 서식은 관리 화면에서 만들고 게시한다 — 코드에는 서식이 없다.

import { toFormDef } from '../forms/definition';
import { CategoryKey, FormDef, FormDefinition, L, Values } from '../forms/types';

/** 로컬 서버에 붙일 때: VITE_GUSRING_API (이용 기록과 같은 서버) */
export const API_BASE = (import.meta.env.VITE_GUSRING_API || 'https://api.gusring.kro.kr').replace(/\/+$/, '');

/** 목록 항목 */
export interface FormSummary {
  key: string;
  formNo: number;
  category: CategoryKey;
  title: L;
  desc: L;
  version: number;
}

/** 서식 작성 화면에 필요한 것 (목록 정보 + 그릴 서식) */
export interface FormEntry {
  /** 주소(#/form/:key)·입력값 저장 이름·이용 기록 formKey */
  key: string;
  /** gusring-web(v1) 서식 번호. 이용 기록·의견에 같이 보낸다 */
  formNo: number;
  title: L;
  /** 처음 열 때 미리 채워 둘 값 */
  preset?: Values;
}

export class ApiError extends Error {
  constructor(public status: number, public code: string, message: string, public details?: unknown) {
    super(message);
  }
}

/** 공통 응답 { success, message, data } 를 풀어 data를 돌려준다 */
export async function readApi<T>(res: Response): Promise<T> {
  const body = await res.json().catch(() => null);
  if (body?.success === true) return body.data as T;
  if (body?.success === false) throw new ApiError(res.status, body.error?.code ?? `HTTP_${res.status}`, body.message ?? '', body.error?.details);
  throw new ApiError(res.status, `HTTP_${res.status}`, '응답을 읽을 수 없습니다.');
}

export const formImageUrl = (imageId: string) => `${API_BASE}/api/v1/form-images/${encodeURIComponent(imageId)}`;

/** 목록은 화면을 오가도 다시 받지 않도록 한 번 받은 것을 쓴다 (실패하면 다음에 다시) */
let listPromise: Promise<FormSummary[]> | null = null;
export function fetchFormList(): Promise<FormSummary[]> {
  listPromise ??= fetch(`${API_BASE}/api/v1/forms`).then((r) => readApi<FormSummary[]>(r));
  listPromise.catch(() => { listPromise = null; });
  return listPromise;
}

/** 정의 → 작성 화면에 넘길 것 */
export const entryFrom = (key: string, formNo: number, def: FormDefinition): { entry: FormEntry; form: FormDef } => ({
  entry: { key, formNo, title: def.title, ...(def.preset && { preset: def.preset }) },
  form: toFormDef(key, def, formImageUrl),
});

export async function fetchForm(key: string): Promise<{ entry: FormEntry; form: FormDef }> {
  const res = await fetch(`${API_BASE}/api/v1/forms/${encodeURIComponent(key)}`);
  const data = await readApi<{ key: string; formNo: number; version: number; definition: FormDefinition }>(res);
  return entryFrom(data.key, data.formNo, data.definition);
}
