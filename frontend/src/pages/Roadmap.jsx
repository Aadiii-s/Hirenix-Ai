import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Brain, Clock, Sparkles } from "lucide-react";

import MobileHeader from "../components/MobileHeader";
import Sidebar from "../components/Sidebar";
import { generateRoadmapApi } from "../api/roadmap.api";
import { useAuth } from "../context/AuthContext";

const Roadmap = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    targetRole: user?.targetRole || "",
    targetCompany: user?.targetCompanies?.[0] || "",
    durationInDays: 7,
    currentLevel: user?.currentPreparationLevel || "beginner",
    skills: user?.skills?.join(", ") || "",
    weakAreas: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const convertCommaStringToArray = (value) => {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  };

  const handleChange = (e) => {
    setError("");

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    if (!formData.targetRole) {
      return "Target role is required";
    }

    if (!formData.durationInDays) {
      return "Duration is required";
    }

    const duration = Number(formData.durationInDays);

    if (duration < 7 || duration > 180) {
      return "Duration must be between 7 and 180 days";
    }

    if (!formData.currentLevel) {
      return "Current preparation level is required";
    }

    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    const payload = {
      targetRole: formData.targetRole,
      targetCompany: formData.targetCompany,
      durationInDays: Number(formData.durationInDays),
      currentLevel: formData.currentLevel,
      skills: convertCommaStringToArray(formData.skills),
      weakAreas: convertCommaStringToArray(formData.weakAreas),
    };

    try {
      setLoading(true);

      const response = await generateRoadmapApi(payload);

      navigate(`/roadmaps/${response.data._id}`);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to generate roadmap. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white lg:flex">
      <Sidebar />

      <div className="lg:hidden">
        <MobileHeader />
      </div>

      <main className="flex-1 px-6 py-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
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
                <Sparkles size={28} />
              </div>

              <div>
                <p className="text-blue-400 font-medium">
                  AI Roadmap Generator
                </p>
                <h1 className="text-4xl font-bold">
                  Generate Your Placement Roadmap
                </h1>
              </div>
            </div>

            <p className="mt-4 max-w-3xl text-slate-400">
              Create a personalized placement preparation plan based on your
              target role, company, skills, weak areas, and available time.
            </p>
          </div>

          {!user?.isProfileCompleted && (
            <div className="mb-6 rounded-2xl border border-yellow-500/30 bg-yellow-500/10 p-5 text-yellow-200">
              <p className="font-semibold">Profile incomplete</p>
              <p className="mt-1 text-sm text-yellow-100/80">
                You can still generate a roadmap, but completing your profile
                will make AI suggestions more personalized.
              </p>

              <Link
                to="/edit-profile"
                className="mt-4 inline-block rounded-xl bg-yellow-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-yellow-400"
              >
                Complete Profile
              </Link>
            </div>
          )}

          <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <form
              onSubmit={handleSubmit}
              className="rounded-2xl border border-slate-800 bg-slate-900 p-6 lg:col-span-2"
            >
              {error && (
                <div className="mb-5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 gap-5">
                <div>
                  <label className="mb-2 block text-sm text-slate-300">
                    Target Role
                  </label>
                  <input
                    type="text"
                    name="targetRole"
                    value={formData.targetRole}
                    onChange={handleChange}
                    placeholder="Software Development Engineer"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-slate-300">
                    Target Company
                  </label>
                  <input
                    type="text"
                    name="targetCompany"
                    value={formData.targetCompany}
                    onChange={handleChange}
                    placeholder="Google, Amazon, Microsoft, or General"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm text-slate-300">
                      Duration in Days
                    </label>
                    <select
                      name="durationInDays"
                      value={formData.durationInDays}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-blue-500"
                    >
                      <option value={7}>7 Days</option>
                      <option value={14}>14 Days</option>
                      <option value={30}>30 Days</option>
                      <option value={60}>60 Days</option>
                      <option value={90}>90 Days</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm text-slate-300">
                      Current Level
                    </label>
                    <select
                      name="currentLevel"
                      value={formData.currentLevel}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-blue-500"
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm text-slate-300">
                    Skills
                  </label>
                  <input
                    type="text"
                    name="skills"
                    value={formData.skills}
                    onChange={handleChange}
                    placeholder="MERN, DSA, MongoDB, React.js, Node.js"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-blue-500"
                  />
                  <p className="mt-2 text-xs text-slate-500">
                    Add multiple skills separated by comma.
                  </p>
                </div>

                <div>
                  <label className="mb-2 block text-sm text-slate-300">
                    Weak Areas
                  </label>
                  <input
                    type="text"
                    name="weakAreas"
                    value={formData.weakAreas}
                    onChange={handleChange}
                    placeholder="Dynamic Programming, System Design, Communication"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-blue-500"
                  />
                  <p className="mt-2 text-xs text-slate-500">
                    Add weak areas separated by comma.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading ? (
                    <>
                      <Clock size={18} />
                      Generating roadmap...
                    </>
                  ) : (
                    <>
                      <Brain size={18} />
                      Generate AI Roadmap
                    </>
                  )}
                </button>
              </div>
            </form>

            <aside className="space-y-5">
              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
                <h2 className="text-xl font-semibold">Roadmap Tips</h2>

                <ul className="mt-4 space-y-3 text-sm text-slate-400">
                  <li>Use 7 days first for quick testing.</li>
                  <li>Add weak areas for better personalization.</li>
                  <li>Complete profile for more accurate AI output.</li>
                  <li>Target company helps AI prioritize topics.</li>
                </ul>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
                <h2 className="text-xl font-semibold">Your Profile Data</h2>

                <div className="mt-4 space-y-3 text-sm">
                  <p>
                    <span className="text-slate-500">Role:</span>{" "}
                    {user?.targetRole || "Not added"}
                  </p>

                  <p>
                    <span className="text-slate-500">Level:</span>{" "}
                    <span className="capitalize">
                      {user?.currentPreparationLevel || "beginner"}
                    </span>
                  </p>

                  <p>
                    <span className="text-slate-500">Skills:</span>{" "}
                    {user?.skills?.length > 0
                      ? user.skills.join(", ")
                      : "Not added"}
                  </p>
                </div>
              </div>

              <Link
                to="/roadmaps"
                className="block rounded-2xl border border-slate-800 bg-slate-900 p-6 hover:border-blue-500/50"
              >
                <p className="text-sm text-slate-400">Already generated?</p>
                <h2 className="mt-1 text-xl font-semibold">
                  View Roadmap History
                </h2>
              </Link>
            </aside>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Roadmap;