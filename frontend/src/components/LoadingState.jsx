const LoadingState = ({
  title = "Loading...",
  message = "Please wait while we fetch your data.",
}) => {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-10 text-center">
      <div className="mx-auto mb-5 h-10 w-10 animate-spin rounded-full border-4 border-slate-700 border-t-blue-500" />

      <h2 className="text-xl font-semibold text-white">{title}</h2>

      <p className="mt-2 text-sm text-slate-400">{message}</p>
    </div>
  );
};

export default LoadingState;