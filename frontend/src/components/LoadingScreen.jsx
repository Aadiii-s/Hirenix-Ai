const LoadingScreen = ({ message = "Loading Hirenix AI..." }) => {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6">
      <div className="text-center">
        <div className="mx-auto mb-5 h-12 w-12 animate-spin rounded-full border-4 border-slate-700 border-t-blue-500" />

        <h1 className="text-2xl font-bold">Hirenix AI</h1>

        <p className="mt-2 text-sm text-slate-400">{message}</p>
      </div>
    </div>
  );
};

export default LoadingScreen;