import { Link } from "react-router-dom";
import {
  User,
  Mail,
  GraduationCap,
  Building2,
  Calendar,
  Target,
  Briefcase,
  Code2,
  CheckCircle,
  AlertCircle,
  Edit,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 px-6 py-10 text-white">
        <div className="mx-auto max-w-5xl">
          <p className="text-slate-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  const isProfileCompleted =
    user?.fullName &&
    user?.email &&
    user?.college &&
    user?.branch &&
    user?.graduationYear &&
    user?.targetRole &&
    user?.targetCompanies?.length > 0 &&
    user?.skills?.length > 0 &&
    user?.currentPreparationLevel;

  const profileFields = [
    {
      label: "Full Name",
      value: user?.fullName || "Not added yet",
      icon: User,
    },
    {
      label: "Email",
      value: user?.email || "Not added yet",
      icon: Mail,
    },
    {
      label: "College",
      value: user?.college || "Not added yet",
      icon: Building2,
    },
    {
      label: "Branch",
      value: user?.branch || "Not added yet",
      icon: GraduationCap,
    },
    {
      label: "Graduation Year",
      value: user?.graduationYear || "Not added yet",
      icon: Calendar,
    },
    {
      label: "Target Role",
      value: user?.targetRole || "Not added yet",
      icon: Target,
    },
    {
      label: "Current Preparation Level",
      value: user?.currentPreparationLevel || "Not added yet",
      icon: Briefcase,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              My Profile
            </h1>

            <p className="mt-2 text-sm text-slate-400">
              This profile helps Hirenix AI personalize your placement
              preparation journey.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium ${
                isProfileCompleted
                  ? "bg-green-500/10 text-green-400"
                  : "bg-yellow-500/10 text-yellow-400"
              }`}
            >
              {isProfileCompleted ? (
                <CheckCircle size={18} />
              ) : (
                <AlertCircle size={18} />
              )}

              <span>
                {isProfileCompleted ? "Profile Completed" : "Profile Incomplete"}
              </span>
            </div>

            <Link
              to="/edit-profile"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
            >
              <Edit size={16} />
              Edit Profile
            </Link>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Card */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg lg:col-span-1">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-blue-600 text-3xl font-bold text-white">
                {user?.fullName
                  ? user.fullName
                      .split(" ")
                      .map((name) => name[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()
                  : "U"}
              </div>

              <h2 className="mt-4 text-xl font-semibold">
                {user?.fullName || "User"}
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                {user?.email || "No email added"}
              </p>

              <div className="mt-5 w-full rounded-xl border border-slate-800 bg-slate-950 p-4">
                <p className="text-sm text-slate-400">Target Role</p>
                <p className="mt-1 font-medium">
                  {user?.targetRole || "Not added yet"}
                </p>
              </div>

              <div className="mt-4 w-full rounded-xl border border-slate-800 bg-slate-950 p-4">
                <p className="text-sm text-slate-400">Preparation Level</p>
                <p className="mt-1 capitalize font-medium">
                  {user?.currentPreparationLevel || "Not added yet"}
                </p>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg lg:col-span-2">
            <div className="mb-6">
              <h2 className="text-xl font-semibold">Profile Details</h2>
              <p className="mt-1 text-sm text-slate-400">
                Your academic and placement preparation information.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {profileFields.map((field) => {
                const Icon = field.icon;

                return (
                  <div
                    key={field.label}
                    className="rounded-xl border border-slate-800 bg-slate-950 p-4"
                  >
                    <div className="mb-3 flex items-center gap-2 text-sm text-slate-400">
                      <Icon size={16} />
                      <span>{field.label}</span>
                    </div>

                    <p className="font-medium capitalize text-slate-100">
                      {field.value}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Companies and Skills */}
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          {/* Target Companies */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg">
            <div className="mb-5 flex items-center gap-2">
              <Briefcase className="text-blue-400" size={20} />
              <div>
                <h2 className="text-xl font-semibold">Target Companies</h2>
                <p className="text-sm text-slate-400">
                  Companies you are preparing for.
                </p>
              </div>
            </div>

            {user?.targetCompanies?.length > 0 ? (
              <div className="flex flex-wrap gap-3">
                {user.targetCompanies.map((company) => (
                  <span
                    key={company}
                    className="rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-sm font-medium text-blue-300"
                  >
                    {company}
                  </span>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-slate-700 p-5 text-center text-sm text-slate-400">
                No target companies added yet.
              </div>
            )}
          </div>

          {/* Skills */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg">
            <div className="mb-5 flex items-center gap-2">
              <Code2 className="text-purple-400" size={20} />
              <div>
                <h2 className="text-xl font-semibold">Skills</h2>
                <p className="text-sm text-slate-400">
                  Skills you are currently building.
                </p>
              </div>
            </div>

            {user?.skills?.length > 0 ? (
              <div className="flex flex-wrap gap-3">
                {user.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-2 text-sm font-medium text-purple-300"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-slate-700 p-5 text-center text-sm text-slate-400">
                No skills added yet.
              </div>
            )}
          </div>
        </div>

        {/* Profile Completion Guidance */}
        {!isProfileCompleted && (
          <div className="mt-6 rounded-2xl border border-yellow-500/20 bg-yellow-500/10 p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-1 text-yellow-400" size={22} />

              <div>
                <h3 className="font-semibold text-yellow-300">
                  Complete your profile
                </h3>

                <p className="mt-1 text-sm text-yellow-100/80">
                  Add your college, branch, graduation year, target role,
                  companies, skills, and preparation level to unlock better AI
                  recommendations.
                </p>

                <Link
                  to="/edit-profile"
                  className="mt-4 inline-flex rounded-lg bg-yellow-500 px-4 py-2 text-sm font-medium text-slate-950 transition hover:bg-yellow-400"
                >
                  Complete Profile
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;

