import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";
import MobileHeader from "../components/MobileHeader";

const Profile = () => {
  const { user } = useAuth();

  const calculateProfileStrength = () => {
    let score = 0;

    if (user?.fullName) score += 10;
    if (user?.email) score += 10;
    if (user?.college) score += 10;
    if (user?.branch) score += 10;
    if (user?.graduationYear) score += 10;
    if (user?.targetRole) score += 15;
    if (user?.targetCompanies?.length > 0) score += 15;
    if (user?.skills?.length > 0) score += 15;
    if (user?.currentPreparationLevel) score += 5;

    return score;
  };

  const profileStrength = calculateProfileStrength();

  const profileItems = [
    {
      label: "Full Name",
      value: user?.fullName || "Not added",
    },
    {
      label: "Email",
      value: user?.email || "Not added",
    },
    {
      label: "College",
      value: user?.college || "Not added",
    },
    {
      label: "Branch",
      value: user?.branch || "Not added",
    },
    {
      label: "Graduation Year",
      value: user?.graduationYear || "Not added",
    },
    {
      label: "Target Role",
      value: user?.targetRole || "Not added",
    },
    {
      label: "Current Preparation Level",
      value: user?.currentPreparationLevel || "beginner",
    },
    {
      label: "Profile Completed",
      value: user?.isProfileCompleted ? "Completed" : "Incomplete",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white lg:flex">
      <Sidebar />

      <div className="lg:hidden">
        <MobileHeader/>
      </div>

      <main
  className="h-screen flex-1 overflow-y-auto px-6 py-6 lg:px-8
  [&::-webkit-scrollbar]:w-2
  [&::-webkit-scrollbar-track]:bg-slate-950
  [&::-webkit-scrollbar-thumb]:rounded-full
  [&::-webkit-scrollbar-thumb]:bg-gray-900
  hover:[&::-webkit-scrollbar-thumb]:bg-gray-700"
>
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-blue-400 font-medium mb-2">Student Profile</p>
              <h1 className="text-4xl font-bold">Your Placement Profile</h1>
              <p className="text-slate-400 mt-2">
                This information will be used by Hirenix AI to generate your
                personalized placement roadmap.
              </p>
            </div>

            <Link
              to="/edit-profile"
              className="rounded-xl bg-blue-600 px-5 py-3 text-center font-semibold hover:bg-blue-700"
            >
              Edit Profile
            </Link>
          </div>

          <section className="mb-6 grid grid-cols-1 gap-5 lg:grid-cols-3">
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 lg:col-span-2">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-2xl font-bold">
                  {user?.fullName?.charAt(0)?.toUpperCase() || "U"}
                </div>

                <div>
                  <h2 className="text-2xl font-bold">{user?.fullName}</h2>
                  <p className="text-slate-400">{user?.email}</p>

                  <span
                    className={`mt-3 inline-block rounded-full px-3 py-1 text-xs font-medium ${
                      user?.isProfileCompleted
                        ? "bg-green-500/10 text-green-300"
                        : "bg-yellow-500/10 text-yellow-300"
                    }`}
                  >
                    {user?.isProfileCompleted
                      ? "Profile Completed"
                      : "Profile Incomplete"}
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <p className="text-sm text-slate-400">Profile Strength</p>
              <h2 className="mt-2 text-4xl font-bold">{profileStrength}%</h2>

              <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full bg-blue-600"
                  style={{ width: `${profileStrength}%` }}
                />
              </div>

              <p className="mt-3 text-xs text-slate-500">
                Complete all fields to unlock better AI recommendations.
              </p>
            </div>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {profileItems.map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-slate-800 bg-slate-900 p-5"
              >
                <p className="text-sm text-slate-400">{item.label}</p>
                <p className="mt-2 text-lg font-semibold capitalize">
                  {item.value}
                </p>
              </div>
            ))}
          </section>

          <section className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
              <p className="text-sm text-slate-400 mb-3">Target Companies</p>

              {user?.targetCompanies?.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {user.targetCompanies.map((company) => (
                    <span
                      key={company}
                      className="rounded-full bg-blue-500/10 px-3 py-1 text-sm text-blue-300"
                    >
                      {company}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-slate-300">Not added</p>
              )}
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
              <p className="text-sm text-slate-400 mb-3">Skills</p>

              {user?.skills?.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {user.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full bg-purple-500/10 px-3 py-1 text-sm text-purple-300"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-slate-300">Not added</p>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Profile;