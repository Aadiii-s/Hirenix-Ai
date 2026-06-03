import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Building2,
  GraduationCap,
  Mail,
  Target,
  User,
} from "lucide-react";

import AppLayout from "../components/AppLayout";
import EmptyState from "../components/EmptyState";
import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <AppLayout maxWidth="max-w-5xl">
        <EmptyState
          icon={User}
          title="Profile not available"
          message="We could not load your profile. Please login again or refresh the page."
          buttonText="Go to Dashboard"
          buttonPath="/dashboard"
        />
      </AppLayout>
    );
  }

  return (
    <AppLayout maxWidth="max-w-5xl">
      <div className="mb-8">
        <Link
          to="/dashboard"
          className="mb-5 inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white"
        >
          <ArrowLeft size={16} />
          Back to dashboard
        </Link>

        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-blue-500/10 p-4 text-blue-300">
            <User size={30} />
          </div>

          <div>
            <p className="font-medium text-blue-400">Your Profile</p>
            <h1 className="text-4xl font-bold">{user.fullName || "User"}</h1>
          </div>
        </div>

        <p className="mt-4 max-w-3xl text-slate-400">
          Your profile is used by Hirenix AI to personalize roadmap, resume
          analysis, mock interviews, skill gap analysis, and readiness score.
        </p>
      </div>

      <section className="mb-6 rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm text-slate-400">Profile Completion</p>
            <h2 className="mt-2 text-3xl font-bold">
              {user.isProfileCompleted ? "Completed" : "Incomplete"}
            </h2>
          </div>

          <Link
            to="/edit-profile"
            className="rounded-xl bg-blue-600 px-5 py-3 text-center font-semibold hover:bg-blue-700"
          >
            Edit Profile
          </Link>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <ProfileCard
          icon={User}
          title="Basic Information"
          items={[
            ["Full Name", user.fullName || "Not added"],
            ["Email", user.email || "Not added"],
          ]}
        />

        <ProfileCard
          icon={GraduationCap}
          title="Academic Information"
          items={[
            ["College", user.college || "Not added"],
            ["Branch", user.branch || "Not added"],
            ["Graduation Year", user.graduationYear || "Not added"],
          ]}
        />

        <ProfileCard
          icon={Target}
          title="Career Goal"
          items={[
            ["Target Role", user.targetRole || "Not added"],
            [
              "Preparation Level",
              user.currentPreparationLevel || "beginner",
            ],
          ]}
        />

        <ProfileCard
          icon={Building2}
          title="Target Companies"
          items={[
            [
              "Companies",
              user.targetCompanies?.length > 0
                ? user.targetCompanies.join(", ")
                : "Not added",
            ],
          ]}
        />
      </section>

      <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="rounded-xl bg-purple-500/10 p-3 text-purple-300">
            <Mail size={22} />
          </div>

          <div>
            <h2 className="text-xl font-semibold">Skills</h2>
            <p className="text-sm text-slate-400">
              Skills used for AI personalization
            </p>
          </div>
        </div>

        {user.skills?.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {user.skills.map((skill) => (
              <span
                key={skill}
                className="rounded-full bg-blue-500/10 px-3 py-1 text-sm text-blue-300"
              >
                {skill}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-400">No skills added yet.</p>
        )}
      </section>
    </AppLayout>
  );
};

const ProfileCard = ({ icon: Icon, title, items }) => {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <div className="mb-5 flex items-center gap-3">
        <div className="rounded-xl bg-blue-500/10 p-3 text-blue-300">
          <Icon size={22} />
        </div>

        <h2 className="text-xl font-semibold">{title}</h2>
      </div>

      <div className="space-y-4">
        {items.map(([label, value]) => (
          <div key={label}>
            <p className="text-sm text-slate-500">{label}</p>
            <p className="mt-1 font-medium capitalize text-slate-200">
              {String(value)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Profile;