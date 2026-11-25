import { useCallback, useRef, useState } from 'react';

// 되돌리기·다시하기. 끌기처럼 연달아 바뀌는 것은 같은 묶음 이름(coalesce)이면 한 번으로 친다.

const LIMIT = 200;

export function useHistory<T>(initial: T) {
  const [state, setState] = useState({ past: [] as T[], present: initial, future: [] as T[] });
  const lastKey = useRef<string | null>(null);

  const set = useCallback((next: T | ((prev: T) => T), coalesce?: string) => {
    setState((h) => {
      const value = typeof next === 'function' ? (next as (p: T) => T)(h.present) : next;
      if (value === h.present) return h;
      const merge = coalesce !== undefined && coalesce === lastKey.current;
      lastKey.current = coalesce ?? null;
      if (merge) return { ...h, present: value };
      return { past: [...h.past, h.present].slice(-LIMIT), present: value, future: [] };
    });
  }, []);

  const undo = useCallback(() => {
    lastKey.current = null;
    setState((h) => (h.past.length ? { past: h.past.slice(0, -1), present: h.past[h.past.length - 1], future: [h.present, ...h.future] } : h));
  }, []);

  const redo = useCallback(() => {
    lastKey.current = null;
    setState((h) => (h.future.length ? { past: [...h.past, h.present], present: h.future[0], future: h.future.slice(1) } : h));
  }, []);

  /** 서버에서 새로 받은 것으로 바꾼다 (이력 지움) */
  const reset = useCallback((value: T) => {
    lastKey.current = null;
    setState({ past: [], present: value, future: [] });
  }, []);

  return { value: state.present, set, undo, redo, reset, canUndo: state.past.length > 0, canRedo: state.future.length > 0 };
}
