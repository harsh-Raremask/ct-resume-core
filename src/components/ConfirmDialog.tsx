interface ConfirmDialogProps {
  open: boolean;
  variant?: 'visit' | 'logout' | 'delete' | 'default';
  title: string;
  message: string;
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-3xl bg-cream border border-ink/10 p-6 shadow-2xl">
        <h3 className="font-[var(--font-display)] text-xl font-medium">{title}</h3>
        <p className="mt-2 text-sm text-muted">{message}</p>
        <div className="mt-6 flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 rounded-full border border-ink/20 py-2.5 text-sm font-medium hover:bg-ink/5 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 rounded-full bg-btnbg text-btntext py-2.5 text-sm font-medium hover:bg-btnhover transition-colors"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
