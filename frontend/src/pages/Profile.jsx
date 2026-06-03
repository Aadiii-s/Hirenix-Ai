import { Link } from "react-router-dom";
import {
  Building2,
  GraduationCap,
  Mail,
  Target,
  User,
} from "lucide-react";

import AppLayout from "../components/AppLayout";
import EmptyState from "../components/EmptyState";
import PageHeader from "../components/PageHeader";
import SectionCard from "../components/SectionCard";
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
      <PageHeader
        eyebrow="Your Profile"
        title={user.fullName || "User"}
        description="Your profile is used by Hirenix AI to personalize roadmap, resume analysis, mock interviews, skill gap analysis, and readiness score."
        icon={User}
        backPath="/dashboard"
        backLabel="Back to dashboard"
      />

      <SectionCard
        className="mb-6"
        title="Profile Completion"
        description="Complete your profile to improve AI personalization."
        action={
          <Link
            to="/edit-profile"
            className="rounded-xl bg-blue-600 px-5 py-3 text-center font-semibold hover:bg-blue-700"
          >
            Edit Profile
          </Link>
        }
      >
        <h2 className="text-3xl font-bold">
          {user.isProfileCompleted ? "Completed" : "Incomplete"}
        </h2>
      </SectionCard>

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
            ["Preparation Level", user.currentPreparationLevel || "beginner"],
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

      <SectionCard
        className="mt-6"
        title="Skills"
        description="Skills used for AI personalization."
        icon={Mail}
      >
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
      </SectionCard>
    </AppLayout>
  );
};

const ProfileCard = ({ icon: Icon, title, items }) => {
  return (
    <SectionCard title={title} icon={Icon}>
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
    </SectionCard>
  );
};

export default Profile;