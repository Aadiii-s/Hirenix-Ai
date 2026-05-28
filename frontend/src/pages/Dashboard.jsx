import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { user } = useAuth();

  const profileCompletionText = user?.isProfileCompleted
    ? "Profile completed"
    : "Complete your profile";

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8">
          <p className="text-blue-400 font-medium mb-2">
            Welcome back, {user?.fullName}
          </p>
          <h1 className="text-4xl font-bold">Placement Dashboard</h1>
          <p className="text-slate-400 mt-2">
            Track your readiness, preparation progress, and AI-powered insights.
          </p>
        </div>

        <section className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-sm text-slate-400">Readiness Score</p>
            <h2 className="text-3xl font-bold mt-2">0%</h2>
            <p className="text-xs text-slate-500 mt-2">Start your setup</p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-sm text-slate-400">DSA Progress</p>
            <h2 className="text-3xl font-bold mt-2">0/100</h2>
            <p className="text-xs text-slate-500 mt-2">Problems solved</p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-sm text-slate-400">Resume Score</p>
            <h2 className="text-3xl font-bold mt-2">--</h2>
            <p className="text-xs text-slate-500 mt-2">Upload resume</p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-sm text-slate-400">Profile Status</p>
            <h2
              className={`text-2xl font-bold mt-2 ${
                user?.isProfileCompleted ? "text-green-300" : "text-yellow-300"
              }`}
            >
              {user?.isProfileCompleted ? "Done" : "Pending"}
            </h2>
            <p className="text-xs text-slate-500 mt-2">
              {profileCompletionText}
            </p>
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-xl font-semibold mb-4">Profile Summary</h2>

            <div className="space-y-3 text-sm">
              <p>
                <span className="text-slate-400">Email:</span>{" "}
                {user?.email || "Not available"}
              </p>
              <p>
                <span className="text-slate-400">College:</span>{" "}
                {user?.college || "Not added"}
              </p>
              <p>
                <span className="text-slate-400">Branch:</span>{" "}
                {user?.branch || "Not added"}
              </p>
              <p>
                <span className="text-slate-400">Target Role:</span>{" "}
                {user?.targetRole || "Not added"}
              </p>
              <p>
                <span className="text-slate-400">Preparation Level:</span>{" "}
                {user?.currentPreparationLevel || "beginner"}
              </p>
            </div>

            <Link
              to="/profile"
              className="mt-6 inline-block rounded-xl border border-slate-700 px-5 py-3 font-semibold text-slate-300 hover:bg-slate-800"
            >
              View Full Profile
            </Link>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-xl font-semibold mb-4">Today's AI Suggestion</h2>

            {user?.isProfileCompleted ? (
              <>
                <p className="text-slate-300">
                  Great! Your profile is complete. Next, Hirenix AI can generate
                  your personalized placement roadmap.
                </p>

                <button className="mt-6 rounded-xl bg-blue-600 px-5 py-3 font-semibold hover:bg-blue-700">
                  Generate AI Roadmap
                </button>
              </>
            ) : (
              <>
                <p className="text-slate-300">
                  Complete your profile first. After that Hirenix AI will
                  generate a personalized placement roadmap based on your target
                  role, skills, and preparation level.
                </p>

                <Link
                  to="/edit-profile"
                  className="mt-6 inline-block rounded-xl bg-blue-600 px-5 py-3 font-semibold hover:bg-blue-700"
                >
                  Complete Profile
                </Link>
              </>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;