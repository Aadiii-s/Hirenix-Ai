import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";
import MobileHeader from "../components/MobileHeader";

const EditProfile = () => {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    college: user?.college || "",
    branch: user?.branch || "",
    graduationYear: user?.graduationYear || "",
    targetRole: user?.targetRole || "",
    targetCompanies: user?.targetCompanies?.join(", ") || "",
    skills: user?.skills?.join(", ") || "",
    currentPreparationLevel: user?.currentPreparationLevel || "beginner",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setError("");

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const convertCommaStringToArray = (value) => {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.college ||
      !formData.branch ||
      !formData.graduationYear ||
      !formData.targetRole ||
      !formData.targetCompanies ||
      !formData.skills
    ) {
      setError("Please fill all required profile fields");
      return;
    }

    const profilePayload = {
      college: formData.college,
      branch: formData.branch,
      graduationYear: Number(formData.graduationYear),
      targetRole: formData.targetRole,
      targetCompanies: convertCommaStringToArray(formData.targetCompanies),
      skills: convertCommaStringToArray(formData.skills),
      currentPreparationLevel: formData.currentPreparationLevel,
    };

    try {
      setLoading(true);
      await updateProfile(profilePayload);
      navigate("/profile");
    } catch (error) {
      setError(
        error.response?.data?.message || "Profile update failed. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

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
        <div className="mx-auto max-w-4xl">
          <div className="mb-8">
            <p className="text-blue-400 font-medium mb-2">Onboarding</p>
            <h1 className="text-4xl font-bold">Complete Your Profile</h1>
            <p className="text-slate-400 mt-2">
              Add your academic and placement details so Hirenix AI can
              personalize your preparation.
            </p>
          </div>

          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-8">
            {error && (
              <div className="mb-5 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-5">
              <div>
                <label className="block text-sm text-slate-300 mb-2">
                  College
                </label>
                <input
                  type="text"
                  name="college"
                  value={formData.college}
                  onChange={handleChange}
                  placeholder="NIT Bhopal"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-300 mb-2">
                  Branch
                </label>
                <input
                  type="text"
                  name="branch"
                  value={formData.branch}
                  onChange={handleChange}
                  placeholder="Computer Science"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-300 mb-2">
                  Graduation Year
                </label>
                <input
                  type="number"
                  name="graduationYear"
                  value={formData.graduationYear}
                  onChange={handleChange}
                  placeholder="2026"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-300 mb-2">
                  Target Role
                </label>
                <input
                  type="text"
                  name="targetRole"
                  value={formData.targetRole}
                  onChange={handleChange}
                  placeholder="Software Development Engineer"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-300 mb-2">
                  Target Companies
                </label>
                <input
                  type="text"
                  name="targetCompanies"
                  value={formData.targetCompanies}
                  onChange={handleChange}
                  placeholder="Google, Amazon, Microsoft"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
                />
                <p className="mt-2 text-xs text-slate-500">
                  Add multiple companies separated by comma.
                </p>
              </div>

              <div>
                <label className="block text-sm text-slate-300 mb-2">
                  Skills
                </label>
                <input
                  type="text"
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  placeholder="MERN, DSA, MongoDB, React.js"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
                />
                <p className="mt-2 text-xs text-slate-500">
                  Add multiple skills separated by comma.
                </p>
              </div>

              <div>
                <label className="block text-sm text-slate-300 mb-2">
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

              <div className="flex flex-col gap-3 md:flex-row">
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-xl bg-blue-600 px-6 py-3 font-semibold hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading ? "Saving Profile..." : "Save Profile"}
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/profile")}
                  className="rounded-xl border border-slate-700 px-6 py-3 font-semibold text-slate-300 hover:bg-slate-800"
                >
                  Cancel
                </button>
              </div>
            </form>
          </section>
        </div>
      </main>
    </div>
  );
};

export default EditProfile;