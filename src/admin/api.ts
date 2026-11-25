// 관리자 API (gusring-server /api/v1/admin/forms…). 관리 화면은 서버와 같은 출처라 주소는 /api/v1부터.
// 로그인은 서버 쿠키(gusring_admin)로 — 브라우저가 알아서 붙인다.

import { FormDefinition, L } from '../forms/types';
import { ApiError, readApi } from '../lib/forms-api';

export { ApiError };

export type Role = 'manager' | 'staff';
export interface Me {
  username: string;
  role: Role;
  mustChangePassword: boolean;
}

export interface AdminFormSummary {
  id: string;
  key: string;
  formNo: number;
  category: FormDefinition['category'];
  title: L;
  draftUpdatedAt: string;
  draftUpdatedBy: string;
  publishedVersion: number | null;
  publishedAt: string | null;
  hasUnpublishedChanges: boolean;
}

export interface AdminForm {
  id: string;
  key: string;
  formNo: number;
  draft: FormDefinition;
  draftUpdatedAt: string;
  draftUpdatedBy: string;
  publishedVersion: number | null;
}

export interface FormVersion {
  version: number;
  publishedBy: string;
  publishedAt: string;
}

const call = async <T>(method: string, path: string, body?: unknown): Promise<T> => {
  const res = await fetch(`/api/v1${path}`, {
    method,
    credentials: 'same-origin',
    headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  return readApi<T>(res);
};

export const imageUrl = (imageId: string) => `/api/v1/form-images/${encodeURIComponent(imageId)}`;

export const adminApi = {
  me: () => call<Me>('GET', '/auth/me'),
  login: (username: string, password: string) => call<{ username: string }>('POST', '/auth/login', { username, password }),
  logout: () => call<null>('POST', '/auth/logout'),

  list: () => call<AdminFormSummary[]>('GET', '/admin/forms'),
  get: (id: string) => call<AdminForm>('GET', `/admin/forms/${id}`),
  create: (body: { key: string; formNo: number; definition: FormDefinition } | { key: string; formNo: number; copyFrom: string }) =>
    call<AdminForm>('POST', '/admin/forms', body),
  save: (id: string, body: { definition?: FormDefinition; key?: string; formNo?: number; baseUpdatedAt: string }) =>
    call<AdminForm>('PATCH', `/admin/forms/${id}`, body),
  remove: (id: string) => call<null>('DELETE', `/admin/forms/${id}`),
  /** baseUpdatedAt: 이 초안을 게시한다 — 그 뒤 다른 사람이 고쳤으면 FORM_CONFLICT (모르는 초안을 게시하지 않게) */
  publish: (id: string, baseUpdatedAt?: string) => call<{ version: number }>('POST', `/admin/forms/${id}/publish`, baseUpdatedAt ? { baseUpdatedAt } : undefined),
  versions: (id: string) => call<FormVersion[]>('GET', `/admin/forms/${id}/versions`),
  restore: (id: string, version: number) => call<AdminForm>('POST', `/admin/forms/${id}/versions/${version}/restore`),

  /** PNG를 그대로 올린다 → 서버 이미지 id(내용 SHA-256)와 크기 */
  uploadImage: async (file: File) => {
    const res = await fetch('/api/v1/admin/form-images', { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'image/png' }, body: file });
    return readApi<{ id: string; width: number; height: number }>(res);
  },
};

/** 서버 오류를 사람이 읽을 문장으로 */
export function errorText(e: unknown): string {
  if (e instanceof ApiError) {
    if (e.code === 'AUTH_FORBIDDEN') return '계정 관리자만 할 수 있습니다.';
    if (e.code === 'AUTH_ADMIN_REQUIRED') return '로그인이 끝났습니다. 다시 로그인해 주세요.';
    return e.message || e.code;
  }
  return '서버에 연결할 수 없습니다.';
}
