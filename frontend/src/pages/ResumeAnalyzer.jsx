import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  FileText,
  History,
  Upload,
  WandSparkles,
} from "lucide-react";

import MobileHeader from "../components/MobileHeader";
import Sidebar from "../components/Sidebar";
import { analyzeResumeApi } from "../api/resume.api";
import { useAuth } from "../context/AuthContext";

const ResumeAnalyzer = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [resumeFile, setResumeFile] = useState(null);
  const [targetRole, setTargetRole] = useState(user?.targetRole || "");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setError("");

    const file = e.target.files[0];

    if (!file) return;

    if (file.type !== "application/pdf") {
      setError("Only PDF files are allowed");
      setResumeFile(null);
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setError("Resume file size should be less than 2MB");
      setResumeFile(null);
      return;
    }

    setResumeFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!resumeFile) {
      setError("Please upload your resume PDF");
      return;
    }

    const formData = new FormData();

    formData.append("resume", resumeFile);
    formData.append(
      "targetRole",
      targetRole || user?.targetRole || "Software Development Engineer"
    );

    try {
      setLoading(true);

      const response = await analyzeResumeApi(formData);

      navigate(`/resume-analyses/${response.data._id}`);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Resume analysis failed. Please try again."
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
                <FileText size={28} />
              </div>

              <div>
                <p className="text-blue-400 font-medium">
                  AI Resume Analyzer
                </p>
                <h1 className="text-4xl font-bold">
                  Analyze Your Resume
                </h1>
              </div>
            </div>

            <p className="mt-4 max-w-3xl text-slate-400">
              Upload your resume PDF and get ATS score, strengths, weaknesses,
              missing keywords, improved bullets, and practical suggestions.
            </p>
          </div>

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

              <div className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm text-slate-300">
                    Target Role
                  </label>

                  <input
                    type="text"
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    placeholder="Software Development Engineer"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
                  />

                  <p className="mt-2 text-xs text-slate-500">
                    This helps AI check role-specific keywords.
                  </p>
                </div>

                <div>
                  <label className="mb-2 block text-sm text-slate-300">
                    Upload Resume PDF
                  </label>

                  <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-700 bg-slate-950 px-6 py-10 text-center hover:border-blue-500">
                    <Upload className="mb-4 text-blue-300" size={36} />

                    <p className="font-semibold">
                      {resumeFile ? resumeFile.name : "Click to upload PDF"}
                    </p>

                    <p className="mt-2 text-sm text-slate-500">
                      PDF only, maximum 2MB
                    </p>

                    <input
                      type="file"
                      accept="application/pdf"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading ? (
                    <>
                      <WandSparkles size={18} />
                      Analyzing resume...
                    </>
                  ) : (
                    <>
                      <WandSparkles size={18} />
                      Analyze Resume
                    </>
                  )}
                </button>
              </div>
            </form>

            <aside className="space-y-5">
              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
                <h2 className="text-xl font-semibold">Resume Tips</h2>

                <ul className="mt-4 space-y-3 text-sm text-slate-400">
                  <li>Use a text-based PDF, not scanned image PDF.</li>
                  <li>Keep resume within one page if you are fresher.</li>
                  <li>Add measurable project impact where possible.</li>
                  <li>Use target-role keywords like REST API, MongoDB, React.</li>
                </ul>
              </div>

              <Link
                to="/resume-analyses"
                className="block rounded-2xl border border-slate-800 bg-slate-900 p-6 hover:border-blue-500/50"
              >
                <div className="mb-3 rounded-xl bg-purple-500/10 p-3 text-purple-300 w-fit">
                  <History size={22} />
                </div>

                <p className="text-sm text-slate-400">Already analyzed?</p>
                <h2 className="mt-1 text-xl font-semibold">
                  View Resume History
                </h2>
              </Link>

              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
                <h2 className="text-xl font-semibold">Your Profile</h2>

                <div className="mt-4 space-y-3 text-sm">
                  <p>
                    <span className="text-slate-500">Target Role:</span>{" "}
                    {user?.targetRole || "Not added"}
                  </p>

                  <p>
                    <span className="text-slate-500">Skills:</span>{" "}
                    {user?.skills?.length > 0
                      ? user.skills.join(", ")
                      : "Not added"}
                  </p>
                </div>
              </div>
            </aside>
          </section>
        </div>
      </main>
    </div>
  );
};

export default ResumeAnalyzer;