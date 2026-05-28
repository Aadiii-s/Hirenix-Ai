import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6">
      <section className="max-w-xl text-center">
        <p className="text-blue-400 font-semibold mb-3">404 Error</p>

        <h1 className="text-5xl font-bold mb-5">Page Not Found</h1>

        <p className="text-slate-400 mb-8">
          The page you are looking for does not exist or may have been moved.
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <Link
            to="/"
            className="rounded-xl bg-blue-600 px-6 py-3 font-semibold hover:bg-blue-700"
          >
            Go Home
          </Link>

          <Link
            to="/dashboard"
            className="rounded-xl border border-slate-700 px-6 py-3 font-semibold text-slate-300 hover:bg-slate-900"
          >
            Go Dashboard
          </Link>
        </div>
      </section>
    </div>
  );
};

export default NotFound;