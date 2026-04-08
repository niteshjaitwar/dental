"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, CheckCircle2, Info, X } from "lucide-react";

type ToastTone = "success" | "error" | "info";

type ToastInput = {
  title: string;
  description?: string;
  tone?: ToastTone;
  duration?: number;
};

type ToastRecord = ToastInput & {
  id: number;
};

type ToastContextValue = {
  showToast: (toast: ToastInput) => void;
};

const toastIcons = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
};

const toastStyles = {
  success:
    "border-emerald-500/25 bg-white text-slate-900 shadow-[0_18px_60px_rgba(16,185,129,0.18)]",
  error:
    "border-rose-500/25 bg-white text-slate-900 shadow-[0_18px_60px_rgba(244,63,94,0.18)]",
  info: "border-sky-500/25 bg-white text-slate-900 shadow-[0_18px_60px_rgba(14,165,233,0.18)]",
};

const iconStyles = {
  success: "text-emerald-600",
  error: "text-rose-600",
  info: "text-sky-600",
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastRecord[]>([]);
  const timersRef = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());
  const nextIdRef = useRef(0);

  const dismissToast = useCallback((id: number) => {
    const activeTimer = timersRef.current.get(id);

    if (activeTimer) {
      clearTimeout(activeTimer);
      timersRef.current.delete(id);
    }

    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    ({
      title,
      description,
      tone = "info",
      duration = 5000,
    }: ToastInput) => {
      const id = nextIdRef.current++;

      setToasts((current) => [...current, { id, title, description, tone }]);

      const timer = setTimeout(() => {
        dismissToast(id);
      }, duration);

      timersRef.current.set(id, timer);
    },
    [dismissToast],
  );

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="pointer-events-none fixed top-4 right-4 z-[120] flex w-[calc(100vw-2rem)] max-w-sm flex-col gap-3"
      >
        <AnimatePresence initial={false}>
          {toasts.map((toast) => {
            const tone = toast.tone ?? "info";
            const Icon = toastIcons[tone];

            return (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, x: 24, y: -12 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                exit={{ opacity: 0, x: 24, y: -10 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className={`pointer-events-auto rounded-2xl border p-4 backdrop-blur-sm ${toastStyles[tone]}`}
              >
                <div className="flex items-start gap-3">
                  <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${iconStyles[tone]}`} />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold">{toast.title}</p>
                    {toast.description ? (
                      <p className="mt-1 text-sm leading-6 text-slate-600">
                        {toast.description}
                      </p>
                    ) : null}
                  </div>
                  <button
                    type="button"
                    onClick={() => dismissToast(toast.id)}
                    className="rounded-full p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                    aria-label="Dismiss notification"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }

  return context;
}
