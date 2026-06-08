import { AlertTriangle, RefreshCcw } from "lucide-react";

const ApiErrorAlert = ({
  message = "Something went wrong",
  title = "Action failed",
  onRetry,
}) => {
  return (
    <div className="mb-6 rounded-2xl border border-red-500/30 bg-red-500/10 p-5">
      <div className="flex items-start gap-3">
        <div className="rounded-xl bg-red-500/10 p-3 text-red-300">
          <AlertTriangle size={22} />
        </div>

        <div className="flex-1">
          <h3 className="font-semibold text-red-200">{title}</h3>

          <p className="mt-1 text-sm leading-6 text-red-100/80">
            {message}
          </p>

          {message?.toLowerCase().includes("ai") && (
            <p className="mt-3 text-xs leading-5 text-red-100/60">
              No fake result was saved. Please try again after some time.
            </p>
          )}

          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-4 inline-flex items-center gap-2 rounded-xl border border-red-400/40 px-4 py-2 text-sm font-semibold text-red-100 hover:bg-red-500/10"
            >
              <RefreshCcw size={16} />
              Try Again
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApiErrorAlert;