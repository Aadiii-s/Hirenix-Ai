import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Brain, History, Sparkles } from "lucide-react";

import { startMockInterviewApi } from "../api/interview.api";
import AppLayout from "../components/AppLayout";
import PageHeader from "../components/PageHeader";
import SectionCard from "../components/SectionCard";
import { useAuth } from "../context/AuthContext";
import ApiErrorAlert from "../components/ApiErrorAlert";
import { getApiErrorMessage } from "../../utils/getApiErrorMessage";

const MockInterview = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    interviewType: "mixed",
    targetRole: user?.targetRole || "Software Development Engineer",
    difficulty: "medium",
    numberOfQuestions: 5,
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

  const handleStartInterview = async (e) => {
    e.preventDefault();

    if (!formData.targetRole.trim()) {
      setError("Target role is required");
      return;
    }

    const payload = {
      title:
        formData.title ||
        `${formData.targetRole} ${formData.interviewType} interview`,
      interviewType: formData.interviewType.toLowerCase(),
      targetRole: formData.targetRole,
      difficulty: formData.difficulty.toLowerCase(),
      numberOfQuestions: Number(formData.numberOfQuestions),
      focusAreas: convertCommaTextToArray(formData.focusAreas),
    };

    try {
      setLoading(true);
      setError("");

      const response = await startMockInterviewApi(payload);

      navigate(`/mock-interviews/${response.data._id}`);
    } catch (error) {
      setError(
        getApiErrorMessage(
          error,
          "Failed to start mock interview. Please try again."
        )
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout maxWidth="max-w-5xl">
      <PageHeader
        eyebrow="AI Mock Interview"
        title="Start Mock Interview"
        description="Practice HR, DSA, MERN, project, behavioral, and mixed interviews with AI-generated questions and feedback."
        icon={Brain}
        backPath="/dashboard"
        backLabel="Back to dashboard"
      />

      {error && (
        <ApiErrorAlert
          title="Mock interview generation failed"
          message={error}
          onRetry={() => setError("")}
        />
      )}

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <form onSubmit={handleStartInterview} className="lg:col-span-2">
          <SectionCard
            title="Interview Setup"
            description="Choose interview type, difficulty, number of questions, and focus areas."
            icon={Sparkles}
          >
            <div className="space-y-5">
              <Input
                label="Interview Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="MERN Developer Mock Interview"
              />

              <Input
                label="Target Role"
                name="targetRole"
                value={formData.targetRole}
                onChange={handleChange}
                placeholder="Software Development Engineer"
              />

              <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                <Select
                  label="Interview Type"
                  name="interviewType"
                  value={formData.interviewType}
                  onChange={handleChange}
                  options={[
                    ["hr", "HR"],
                    ["dsa", "DSA"],
                    ["mern", "MERN"],
                    ["project", "Project"],
                    ["behavioral", "Behavioral"],
                    ["mixed", "Mixed"],
                  ]}
                />

                <Select
                  label="Difficulty"
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleChange}
                  options={[
                    ["easy", "Easy"],
                    ["medium", "Medium"],
                    ["hard", "Hard"],
                  ]}
                />

                <Select
                  label="Questions"
                  name="numberOfQuestions"
                  value={formData.numberOfQuestions}
                  onChange={handleChange}
                  options={[
                    [3, "3 Questions"],
                    [5, "5 Questions"],
                    [7, "7 Questions"],
                    [10, "10 Questions"],
                  ]}
                />
              </div>

              <Input
                label="Focus Areas"
                name="focusAreas"
                value={formData.focusAreas}
                onChange={handleChange}
                placeholder="React, Node.js, DBMS, DSA, Projects"
              />

              <button
                type="submit"
                disabled={loading}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70 cursor-pointer"
              >
                <Sparkles size={18} />
                {loading ? "Generating Interview..." : "Start AI Interview"}
              </button>
            </div>
          </SectionCard>
        </form>

        <aside className="space-y-5">
          <Link
            to="/mock-interviews"
            className="block rounded-2xl border border-slate-800 bg-slate-900 p-6 hover:border-blue-500/50"
          >
            <div className="mb-3 w-fit rounded-xl bg-purple-500/10 p-3 text-purple-300">
              <History size={22} />
            </div>

            <p className="text-sm text-slate-400">Past sessions</p>
            <h2 className="mt-1 text-xl font-semibold">Interview History</h2>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              View previous interviews, continue pending sessions, and review AI
              feedback reports.
            </p>
          </Link>

          <SectionCard title="Interview Tips">
            <ul className="space-y-3 text-sm leading-6 text-slate-400">
              <li>Answer in structured points instead of one long paragraph.</li>
              <li>
                For projects, explain problem, tech stack, features, and impact.
              </li>
              <li>For HR answers, use STAR method where possible.</li>
              <li>
                After submitting, read AI feedback and improve your next answer.
              </li>
            </ul>
          </SectionCard>
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

const Select = ({ label, options, ...props }) => {
  return (
    <div>
      <label className="mb-2 block text-sm text-slate-300">{label}</label>

      <select
        {...props}
        className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
      >
        {options.map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default MockInterview;