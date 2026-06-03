import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, FileText, History, Sparkles, Upload } from "lucide-react";

import { analyzeResumeApi } from "../api/resume.api";
import AppLayout from "../components/AppLayout";

const ResumeAnalyzer = () => {
  const navigate = useNavigate();

  const [resumeFile, setResumeFile] = useState(null);
  const [targetRole, setTargetRole] = useState("Software Development Engineer");
  const [targetCompany, setTargetCompany] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    setError("");

    const file = e.target.files?.[0];

    if (!file) return;

    if (file.type !== "application/pdf") {
      setError("Only PDF resume files are allowed");
      return;
    }

    setResumeFile(file);
  };

  const handleAnalyze = async (e) => {
    e.preventDefault();

    if (!resumeFile) {
      setError("Please upload your resume PDF first");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const formData = new FormData();
      formData.append("resume", resumeFile);
      formData.append("targetRole", targetRole);
      formData.append("targetCompany", targetCompany);

      const response = await analyzeResumeApi(formData);

      navigate(`/resume-analyses/${response.data._id}`);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to analyze resume");
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
            <FileText size={30} />
          </div>

          <div>
            <p className="font-medium text-blue-400">AI Resume Analyzer</p>
            <h1 className="text-4xl font-bold">Analyze Your Resume</h1>
          </div>
        </div>

        <p className="mt-4 max-w-3xl text-slate-400">
          Upload your PDF resume and get ATS score, missing keywords,
          strengths, weaknesses, improved bullets, and AI suggestions.
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <form
          onSubmit={handleAnalyze}
          className="rounded-2xl border border-slate-800 bg-slate-900 p-6 lg:col-span-2"
        >
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-xl bg-blue-500/10 p-3 text-blue-300">
              <Upload size={22} />
            </div>

            <div>
              <h2 className="text-xl font-semibold">Upload Resume</h2>
              <p className="text-sm text-slate-400">
                PDF format is required for analysis.
              </p>
            </div>
          </div>

          <div className="space-y-5">
            <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-700 bg-slate-950 px-6 py-10 text-center hover:border-blue-500/60">
              <Upload className="mb-4 text-blue-300" size={36} />

              <p className="font-semibold text-white">
                {resumeFile ? resumeFile.name : "Click to upload resume PDF"}
              </p>

              <p className="mt-2 text-sm text-slate-400">
                Only PDF files are supported.
              </p>

              <input
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>

            <Input
              label="Target Role"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              placeholder="Software Development Engineer"
            />

            <Input
              label="Target Company"
              value={targetCompany}
              onChange={(e) => setTargetCompany(e.target.value)}
              placeholder="Google, Amazon, Microsoft, General..."
            />

            <button
              disabled={loading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              <Sparkles size={18} />
              {loading ? "Analyzing Resume..." : "Analyze Resume"}
            </button>
          </div>
        </form>

        <aside className="space-y-5">
          <Link
            to="/resume-analyses"
            className="block rounded-2xl border border-slate-800 bg-slate-900 p-6 hover:border-blue-500/50"
          >
            <div className="mb-3 w-fit rounded-xl bg-purple-500/10 p-3 text-purple-300">
              <History size={22} />
            </div>

            <p className="text-sm text-slate-400">Past reports</p>
            <h2 className="mt-1 text-xl font-semibold">Resume History</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              View all previous resume ATS reports and suggestions.
            </p>
          </Link>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-xl font-semibold">What AI checks</h2>

            <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-400">
              <li>ATS score and keyword match.</li>
              <li>Missing role-specific skills.</li>
              <li>Project impact and measurable achievements.</li>
              <li>Weak bullet points and improved versions.</li>
              <li>Final resume improvement advice.</li>
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

export default ResumeAnalyzer;