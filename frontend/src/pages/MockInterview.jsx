import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Brain, History, Sparkles } from "lucide-react";

import { startMockInterviewApi } from "../api/interview.api";
import MobileHeader from "../components/MobileHeader";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";

const MockInterview = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    interviewType: "mixed",
    targetRole: user?.targetRole || "Software Development Engineer",
    difficulty: user?.currentPreparationLevel || "intermediate",
    questionCount: 3,
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

  const handleStartInterview = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      questionCount: Number(formData.questionCount),
    };

    try {
      setLoading(true);

      const response = await startMockInterviewApi(payload);

      navigate(`/mock-interviews/${response.data._id}`);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to start mock interview. Please try again."
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

      <main
  className="h-screen flex-1 overflow-y-auto px-6 py-6 lg:px-8
  [&::-webkit-scrollbar]:w-2
  [&::-webkit-scrollbar-track]:bg-slate-950
  [&::-webkit-scrollbar-thumb]:rounded-full
  [&::-webkit-scrollbar-thumb]:bg-gray-900
  hover:[&::-webkit-scrollbar-thumb]:bg-gray-700"
>
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
                <Brain size={30} />
              </div>

              <div>
                <p className="font-medium text-blue-400">
                  AI Mock Interview
                </p>
                <h1 className="text-4xl font-bold">
                  Practice Placement Interviews
                </h1>
              </div>
            </div>

            <p className="mt-4 max-w-3xl text-slate-400">
              Generate realistic interview questions, answer them, and get AI
              feedback with scores and improvement suggestions.
            </p>
          </div>

          <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <form
              onSubmit={handleStartInterview}
              className="rounded-2xl border border-slate-800 bg-slate-900 p-6 lg:col-span-2"
            >
              {error && (
                <div className="mb-5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                  {error}
                </div>
              )}

              <div className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm text-slate-300">
                    Interview Type
                  </label>

                  <select
                    name="interviewType"
                    value={formData.interviewType}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-blue-500"
                  >
                    <option value="mixed">Mixed Interview</option>
                    <option value="hr">HR Interview</option>
                    <option value="dsa">DSA Interview</option>
                    <option value="mern">MERN Interview</option>
                    <option value="project">Project Interview</option>
                    <option value="behavioral">Behavioral Interview</option>
                  </select>
                </div>

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

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm text-slate-300">
                      Difficulty
                    </label>

                    <select
                      name="difficulty"
                      value={formData.difficulty}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-blue-500"
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm text-slate-300">
                      Questions
                    </label>

                    <select
                      name="questionCount"
                      value={formData.questionCount}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-blue-500"
                    >
                      <option value={3}>3 Questions</option>
                      <option value={5}>5 Questions</option>
                      <option value={7}>7 Questions</option>
                      <option value={10}>10 Questions</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  <Sparkles size={18} />
                  {loading ? "Generating interview..." : "Start Mock Interview"}
                </button>
              </div>
            </form>

            <aside className="space-y-5">
              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
                <h2 className="text-xl font-semibold">Interview Tips</h2>

                <ul className="mt-4 space-y-3 text-sm text-slate-400">
                  <li>Answer in structured points.</li>
                  <li>Use project examples where possible.</li>
                  <li>Explain approach, trade-offs, and complexity.</li>
                  <li>For HR answers, use STAR method.</li>
                </ul>
              </div>

              <Link
                to="/mock-interviews"
                className="block rounded-2xl border border-slate-800 bg-slate-900 p-6 hover:border-blue-500/50"
              >
                <div className="mb-3 w-fit rounded-xl bg-purple-500/10 p-3 text-purple-300">
                  <History size={22} />
                </div>

                <p className="text-sm text-slate-400">Already practiced?</p>
                <h2 className="mt-1 text-xl font-semibold">
                  View Interview History
                </h2>
              </Link>
            </aside>
          </section>
        </div>
      </main>
    </div>
  );
};

export default MockInterview;