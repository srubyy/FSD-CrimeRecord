import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function ToastNotification({ toast, onDismiss }) {
  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-4 h-4 text-[#167A5B] dark:text-[#4DB58B] shrink-0" />,
    error: <AlertCircle className="w-4 h-4 text-[#B4232C] dark:text-[#E06A70] shrink-0" />,
    info: <Info className="w-4 h-4 text-[#24527A] dark:text-[#6B9BC2] shrink-0" />,
  };

  return (
    <aside aria-label="Notifications" className="fixed bottom-5 right-5 z-50 max-w-sm w-full animate-in fade-in slide-in-from-bottom-2 duration-150">
      <div className="flex items-start gap-2.5 p-3 rounded-md border border-[#D9E0E8] dark:border-[#293544] bg-white dark:bg-[#151C26] text-[#172033] dark:text-[#F1F4F8] shadow-md">
        {icons[toast.type || 'info']}
        <div className="flex-1 text-xs">
          {toast.title && <p className="font-semibold">{toast.title}</p>}
          <p className="text-[#526176] dark:text-[#AAB6C5] mt-0.5">{toast.message}</p>
        </div>
        <button
          onClick={onDismiss}
          className="p-1 text-[#526176] hover:text-[#172033] dark:text-[#AAB6C5] dark:hover:text-white rounded"
          aria-label="Dismiss notification"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
}
