import { Link } from "react-router-dom";
import { AlertTriangle } from "lucide-react";

const NotFound = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
      <div className="max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center">
        <div className="mx-auto mb-5 w-fit rounded-2xl bg-red-500/10 p-4 text-red-300">
          <AlertTriangle size={36} />
        </div>

        <h1 className="text-4xl font-bold">404</h1>

        <h2 className="mt-3 text-2xl font-semibold">Page Not Found</h2>

        <p className="mt-3 text-slate-400">
          This route does not exist or is not connected yet. Go back to your
          Hirenix AI dashboard.
        </p>

        <Link
          to="/dashboard"
          className="mt-6 inline-block rounded-xl bg-blue-600 px-5 py-3 font-semibold hover:bg-blue-700"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default NotFound;