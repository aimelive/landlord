import { reactive, readonly } from "vue";

export type ToastVariant = "success" | "error" | "info" | "warning";

export interface ToastAction {
  label: string;
  onClick: () => void;
}

export interface ToastInput {
  title: string;
  description?: string;
  /** Auto-dismiss duration in ms. 0 = persistent (only dismissable by user). */
  duration?: number;
  action?: ToastAction;
}

export interface Toast extends Required<Omit<ToastInput, "action">> {
  id: string;
  variant: ToastVariant;
  action?: ToastAction;
  // Internal scheduling state — mutated by pause/resume, rendered by the host
  // via the reactive proxy so the progress bar animation stays in sync.
  _timerId: number | null;
  _startedAt: number;
  _remainingMs: number;
  _paused: boolean;
}

const MAX_VISIBLE = 5;
const DEFAULT_DURATION = 10_000;

const state = reactive({
  items: [] as Toast[],
});

/** Read-only view of the toast stack for the host component. */
export function useToastState() {
  return readonly(state);
}

function makeId() {
  return `t_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function schedule(t: Toast) {
  if (t.duration <= 0) return;
  clear(t);
  t._startedAt = Date.now();
  t._paused = false;
  t._timerId = window.setTimeout(() => dismiss(t.id), t._remainingMs);
}

function clear(t: Toast) {
  if (t._timerId != null) {
    clearTimeout(t._timerId);
    t._timerId = null;
  }
}

function push(variant: ToastVariant, input: ToastInput): string {
  const duration = input.duration ?? DEFAULT_DURATION;
  const t: Toast = reactive({
    id: makeId(),
    variant,
    title: input.title,
    description: input.description ?? "",
    duration,
    action: input.action,
    _timerId: null,
    _startedAt: Date.now(),
    _remainingMs: duration,
    _paused: false,
  }) as Toast;

  // Drop the oldest when overflowing, so rapid-fire errors don't bury the UI.
  if (state.items.length >= MAX_VISIBLE) {
    const victim = state.items[0];
    if (victim) {
      clear(victim);
      state.items.shift();
    }
  }
  state.items.push(t);
  schedule(t);
  return t.id;
}

export function dismiss(id: string) {
  const idx = state.items.findIndex((t) => t.id === id);
  if (idx === -1) return;
  const t = state.items[idx];
  clear(t);
  state.items.splice(idx, 1);
}

export function dismissAll() {
  state.items.forEach(clear);
  state.items.length = 0;
}

export function pause(id: string) {
  const t = state.items.find((t) => t.id === id);
  if (!t || t._paused || t.duration <= 0) return;
  clear(t);
  t._paused = true;
  t._remainingMs = Math.max(0, t._remainingMs - (Date.now() - t._startedAt));
}

export function resume(id: string) {
  const t = state.items.find((t) => t.id === id);
  if (!t || !t._paused) return;
  if (t._remainingMs <= 0) {
    dismiss(id);
    return;
  }
  schedule(t);
}

/**
 * Typed facade used throughout the app.
 *
 *   toast.success('Saved')
 *   toast.error('Failed', { description: 'Try again' })
 *   toast.info('New update', { action: { label: 'Reload', onClick: () => location.reload() } })
 */
export const toast = {
  success(title: string, opts: Omit<ToastInput, "title"> = {}) {
    return push("success", { title, ...opts });
  },
  error(title: string, opts: Omit<ToastInput, "title"> = {}) {
    return push("error", { title, ...opts });
  },
  info(title: string, opts: Omit<ToastInput, "title"> = {}) {
    return push("info", { title, ...opts });
  },
  warning(title: string, opts: Omit<ToastInput, "title"> = {}) {
    return push("warning", { title, ...opts });
  },
  dismiss,
  dismissAll,
};
