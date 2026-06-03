import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Save, User } from "lucide-react";

import AppLayout from "../components/AppLayout";
import { useAuth } from "../context/AuthContext";

const EditProfile = () => {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    college: "",
    branch: "",
    graduationYear: "",
    targetRole: "",
    targetCompanies: "",
    skills: "",
    currentPreparationLevel: "beginner",
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || "",
        college: user.college || "",
        branch: user.branch || "",
        graduationYear: user.graduationYear || "",
        targetRole: user.targetRole || "",
        targetCompanies: user.targetCompanies?.join(", ") || "",
        skills: user.skills?.join(", ") || "",
        currentPreparationLevel: user.currentPreparationLevel || "beginner",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setError("");

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const convertCommaTextToArray = (text) => {
    return text
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.fullName.trim()) {
      setError("Full name is required");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const payload = {
        fullName: formData.fullName,
        college: formData.college,
        branch: formData.branch,
        graduationYear: formData.graduationYear,
        targetRole: formData.targetRole,
        targetCompanies: convertCommaTextToArray(formData.targetCompanies),
        skills: convertCommaTextToArray(formData.skills),
        currentPreparationLevel: formData.currentPreparationLevel,
      };

      await updateProfile(payload);

      navigate("/profile");
    } catch (error) {
      setError(error.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppLayout maxWidth="max-w-5xl">
      <div className="mb-8">
        <Link
          to="/profile"
          className="mb-5 inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white"
        >
          <ArrowLeft size={16} />
          Back to profile
        </Link>

        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-blue-500/10 p-4 text-blue-300">
            <User size={30} />
          </div>

          <div>
            <p className="font-medium text-blue-400">Edit Profile</p>
            <h1 className="text-4xl font-bold">Update Your Details</h1>
          </div>
        </div>

        <p className="mt-4 max-w-3xl text-slate-400">
          Keep your profile updated so AI modules can generate better roadmaps,
          resume feedback, interviews, and skill gap analysis.
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-slate-800 bg-slate-900 p-6"
      >
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <Input
            label="Full Name"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Aditya Kumar Singh"
          />

          <Input
            label="College"
            name="college"
            value={formData.college}
            onChange={handleChange}
            placeholder="MANIT Bhopal"
          />

          <Input
            label="Branch"
            name="branch"
            value={formData.branch}
            onChange={handleChange}
            placeholder="Mathematics and Data Science"
          />

          <Input
            label="Graduation Year"
            name="graduationYear"
            value={formData.graduationYear}
            onChange={handleChange}
            placeholder="2027"
          />

          <Input
            label="Target Role"
            name="targetRole"
            value={formData.targetRole}
            onChange={handleChange}
            placeholder="Software Development Engineer"
          />

          <div>
            <label className="mb-2 block text-sm text-slate-300">
              Current Preparation Level
            </label>

            <select
              name="currentPreparationLevel"
              value={formData.currentPreparationLevel}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
        </div>

        <div className="mt-5 space-y-5">
          <Input
            label="Target Companies"
            name="targetCompanies"
            value={formData.targetCompanies}
            onChange={handleChange}
            placeholder="Google, Amazon, Microsoft"
          />

          <Input
            label="Skills"
            name="skills"
            value={formData.skills}
            onChange={handleChange}
            placeholder="React, Node.js, MongoDB, DSA, SQL"
          />
        </div>

        <button
          disabled={saving}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
        >
          <Save size={18} />
          {saving ? "Saving..." : "Save Profile"}
        </button>
      </form>
    </AppLayout>
  );
};

const Input = ({ label, ...props }) => {
  return (
    <div>
      <label className="mb-2 block text-sm text-slate-300">{label}</label>
      <input
        {...props}
        className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
      />
    </div>
  );
};

export default EditProfile;