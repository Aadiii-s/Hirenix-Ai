import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, History, Route, Sparkles } from "lucide-react";

import { generateRoadmapApi } from "../api/roadmap.api";
import AppLayout from "../components/AppLayout";
import { useAuth } from "../context/AuthContext";

const Roadmap = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    targetRole: user?.targetRole || "Software Development Engineer",
    targetCompany: user?.targetCompanies?.[0] || "",
    durationInDays: 30,
    currentLevel: user?.currentPreparationLevel || "beginner",
    focusAreas: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

  const handleGenerate = async (e) => {
    e.preventDefault();

    if (!formData.targetRole.trim()) {
      setError("Target role is required");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const payload = {
        targetRole: formData.targetRole,
        targetCompany: formData.targetCompany,
        durationInDays: Number(formData.durationInDays),
        currentLevel: formData.currentLevel,
        focusAreas: convertCommaTextToArray(formData.focusAreas),
      };

      const response = await generateRoadmapApi(payload);

      navigate(`/roadmaps/${response.data._id}`);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to generate roadmap");
    } finally {
      setLoading(false);
    }
  };

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
            <Route size={30} />
          </div>

          <div>
            <p className="font-medium text-blue-400">AI Roadmap Generator</p>
            <h1 className="text-4xl font-bold">
              Generate Your Placement Roadmap
            </h1>
          </div>
        </div>

        <p className="mt-4 max-w-3xl text-slate-400">
          Create a personalized day-wise preparation plan based on your target
          role, company, level, and focus areas.
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <form
          onSubmit={handleGenerate}
          className="rounded-2xl border border-slate-800 bg-slate-900 p-6 lg:col-span-2"
        >
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-xl bg-blue-500/10 p-3 text-blue-300">
              <Sparkles size={22} />
            </div>

            <div>
              <h2 className="text-xl font-semibold">Roadmap Details</h2>
              <p className="text-sm text-slate-400">
                Fill details to generate your AI-powered roadmap.
              </p>
            </div>
          </div>

          <div className="space-y-5">
            <Input
              label="Target Role"
              name="targetRole"
              value={formData.targetRole}
              onChange={handleChange}
              placeholder="Software Development Engineer"
            />

            <Input
              label="Target Company"
              name="targetCompany"
              value={formData.targetCompany}
              onChange={handleChange}
              placeholder="Google, Amazon, Microsoft, General..."
            />

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Duration
                </label>

                <select
                  name="durationInDays"
                  value={formData.durationInDays}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
                >
                  <option value={15}>15 Days</option>
                  <option value={30}>30 Days</option>
                  <option value={45}>45 Days</option>
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
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
            </div>

            <Input
              label="Focus Areas"
              name="focusAreas"
              value={formData.focusAreas}
              onChange={handleChange}
              placeholder="DSA, MERN, System Design, Resume, Interview"
            />

            <button
              disabled={loading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              <Sparkles size={18} />
              {loading ? "Generating Roadmap..." : "Generate AI Roadmap"}
            </button>
          </div>
        </form>

        <aside className="space-y-5">
          <Link
            to="/roadmaps"
            className="block rounded-2xl border border-slate-800 bg-slate-900 p-6 hover:border-blue-500/50"
          >
            <div className="mb-3 w-fit rounded-xl bg-purple-500/10 p-3 text-purple-300">
              <History size={22} />
            </div>

            <p className="text-sm text-slate-400">Previous plans</p>
            <h2 className="mt-1 text-xl font-semibold">Roadmap History</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              View and continue your old AI-generated preparation roadmaps.
            </p>
          </Link>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-xl font-semibold">Tips</h2>

            <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-400">
              <li>Choose 30–60 days for realistic placement preparation.</li>
              <li>Add a target company for company-specific guidance.</li>
              <li>Use focus areas to prioritize weak topics.</li>
              <li>Track daily progress after roadmap generation.</li>
            </ul>
          </div>
        </aside>
      </section>
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

export default Roadmap;