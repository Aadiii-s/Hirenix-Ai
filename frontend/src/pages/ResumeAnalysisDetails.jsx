import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  FileText,
  Lightbulb,
  Target,
  XCircle,
} from "lucide-react";

import { getResumeAnalysisByIdApi } from "../api/resume.api";

import AppLayout from "../components/AppLayout";
import ErrorState from "../components/ErrorState";
import LoadingState from "../components/LoadingState";

const ResumeAnalysisDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [analysis, setAnalysis] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAnalysis = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getResumeAnalysisByIdApi(id);

      setAnalysis(response.data);
    } catch (error) {
      setError(
        error.response?.data?.message || "Failed to fetch resume analysis"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalysis();
  }, [id]);

  if (loading) {
    return (
      <AppLayout>
        <LoadingState
          title="Loading resume report"
          message="Please wait while we fetch your resume ATS report and AI suggestions."
        />
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout>
        <ErrorState
          title="Resume report not found"
          message={error}
          buttonText="Back to Resume History"
          onRetry={() => navigate("/resume-analyses")}
        />
      </AppLayout>
    );
  }

  if (!analysis) return null;

  return (
    <AppLayout>
      <div className="mb-8">
        <Link
          to="/resume-analyses"
          className="mb-5 inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white"
        >
          <ArrowLeft size={16} />
          Back to resume history
        </Link>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-blue-500/10 p-4 text-blue-300">
              <FileText size={28} />
            </div>

            <div>
              <p className="font-medium text-blue-400">Resume Analysis Report</p>
              <h1 className="text-3xl font-bold">
                {analysis.originalFileName || "Resume Report"}
              </h1>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-4">
            <InfoBox label="ATS Score" value={`${analysis.atsScore || 0}/100`} />
            <InfoBox
              label="Missing Keywords"
              value={analysis.missingKeywords?.length || 0}
            />
            <InfoBox
              label="Strengths"
              value={analysis.strengths?.length || 0}
            />
            <InfoBox
              label="Improvements"
              value={analysis.improvements?.length || 0}
            />
          </div>

          <div className="mt-6">
            <div className="mb-2 flex justify-between text-sm">
              <span className="text-slate-400">ATS Score</span>
              <span className="font-semibold text-slate-300">
                {analysis.atsScore || 0}%
              </span>
            </div>

            <div className="h-3 overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-blue-600"
                style={{ width: `${analysis.atsScore || 0}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <section className="mb-6 grid grid-cols-1 gap-5 lg:grid-cols-3">
        <ResumeListCard
          title="Strengths"
          icon={CheckCircle2}
          items={analysis.strengths}
          color="green"
        />

        <ResumeListCard
          title="Weaknesses"
          icon={XCircle}
          items={analysis.weaknesses}
          color="red"
        />

        <ResumeListCard
          title="Missing Keywords"
          icon={Target}
          items={analysis.missingKeywords}
          color="yellow"
        />
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <div className="mb-6 flex flex-wrap gap-3">
          {[
            ["overview", "Overview"],
            ["improvements", "Improvements"],
            ["bullets", "Improved Bullets"],
          ].map(([key, label]) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`rounded-xl px-4 py-2 text-sm font-semibold ${
                activeTab === key
                  ? "bg-blue-600 text-white"
                  : "bg-slate-950 text-slate-400 hover:bg-slate-800"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {activeTab === "overview" && (
          <div className="space-y-5">
            <div className="rounded-2xl bg-slate-950 p-5">
              <h2 className="mb-3 text-xl font-semibold">Summary</h2>
              <p className="text-sm leading-6 text-slate-400">
                {analysis.summary || "No summary available."}
              </p>
            </div>

            <div className="rounded-2xl bg-slate-950 p-5">
              <h2 className="mb-3 text-xl font-semibold">Final Advice</h2>
              <p className="text-sm leading-6 text-slate-400">
                {analysis.finalAdvice ||
                  "Improve your resume with stronger keywords, measurable achievements, and role-specific project impact."}
              </p>
            </div>
          </div>
        )}

        {activeTab === "improvements" && (
          <div className="space-y-3">
            {analysis.improvements?.length > 0 ? (
              analysis.improvements.map((item, index) => (
                <div
                  key={index}
                  className="rounded-xl bg-slate-950 px-4 py-3 text-sm leading-6 text-slate-300"
                >
                  {item}
                </div>
              ))
            ) : (
              <MiniEmptyState
                icon={Lightbulb}
                text="No improvement suggestions available."
              />
            )}
          </div>
        )}

        {activeTab === "bullets" && (
          <div className="space-y-3">
            {analysis.improvedBullets?.length > 0 ? (
              analysis.improvedBullets.map((bullet, index) => (
                <div
                  key={index}
                  className="rounded-xl bg-slate-950 px-4 py-3 text-sm leading-6 text-slate-300"
                >
                  {bullet}
                </div>
              ))
            ) : (
              <MiniEmptyState
                icon={FileText}
                text="No improved bullets available."
              />
            )}
          </div>
        )}
      </section>
    </AppLayout>
  );
};

const InfoBox = ({ label, value }) => {
  return (
    <div className="rounded-xl bg-slate-950 p-4">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 font-semibold capitalize">{String(value)}</p>
    </div>
  );
};

const ResumeListCard = ({ title, icon: Icon, items = [], color }) => {
  const colorClass =
    color === "green"
      ? "text-green-300 bg-green-500/10"
      : color === "red"
      ? "text-red-300 bg-red-500/10"
      : "text-yellow-300 bg-yellow-500/10";

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <div className={`mb-4 w-fit rounded-xl p-3 ${colorClass}`}>
        <Icon size={22} />
      </div>

      <h2 className="text-xl font-semibold">{title}</h2>

      <div className="mt-4 flex flex-wrap gap-2">
        {items?.length > 0 ? (
          items.map((item, index) => (
            <span
              key={`${item}-${index}`}
              className="rounded-full bg-slate-950 px-3 py-1 text-sm text-slate-300"
            >
              {item}
            </span>
          ))
        ) : (
          <p className="text-sm text-slate-400">No data available.</p>
        )}
      </div>
    </div>
  );
};

const MiniEmptyState = ({ icon: Icon, text }) => {
  return (
    <div className="rounded-xl bg-slate-950 p-8 text-center text-slate-400">
      <Icon className="mx-auto mb-3 text-slate-500" size={26} />
      {text}
    </div>
  );
};

export default ResumeAnalysisDetails;