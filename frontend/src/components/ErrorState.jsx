import { AlertTriangle } from "lucide-react";

const ErrorState = ({
  title = "Something went wrong",
  message = "Unable to load data. Please try again.",
  buttonText = "Retry",
  onRetry,
}) => {
  return (
    <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-8 text-center">
      <div className="mx-auto mb-5 w-fit rounded-2xl bg-red-500/10 p-4 text-red-300">
        <AlertTriangle size={34} />
      </div>

      <h2 className="text-2xl font-bold text-red-200">{title}</h2>

      <p className="mt-3 text-sm leading-6 text-red-300">{message}</p>

      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-6 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
        >
          {buttonText}
        </button>
      )}
    </div>
  );
};

export default ErrorState;