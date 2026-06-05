import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
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
import PageHeader from "../components/PageHeader";
import SectionCard from "../components/SectionCard";

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
      <PageHeader
        eyebrow="Resume Analysis Report"
        title={analysis.originalFileName || "Resume Report"}
        description={
          analysis.summary ||
          "AI-generated resume analysis with ATS score, missing keywords, and improvement suggestions."
        }
        icon={FileText}
        backPath="/resume-analyses"
        backLabel="Back to resume history"
      />

      <SectionCard className="mb-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <InfoBox label="ATS Score" value={`${analysis.atsScore || 0}/100`} />
          <InfoBox
            label="Missing Keywords"
            value={analysis.missingKeywords?.length || 0}
          />
          <InfoBox label="Strengths" value={analysis.strengths?.length || 0} />
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
      </SectionCard>

      <section className="mb-6 grid grid-cols-1 gap-5 lg:grid-cols-3">
        <ResumeListCard
          title="Strengths"
          icon={CheckCircle2}
          items={analysis.strengths}
        />

        <ResumeListCard
          title="Weaknesses"
          icon={XCircle}
          items={analysis.weaknesses}
        />

        <ResumeListCard
          title="Missing Keywords"
          icon={Target}
          items={analysis.missingKeywords}
        />
      </section>

      <SectionCard
        title="Detailed Resume Report"
        description="Review summary, improvements, and improved bullet points."
        icon={Lightbulb}
      >
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
                <ReportItem key={index}>{item}</ReportItem>
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
                <ReportItem key={index}>{bullet}</ReportItem>
              ))
            ) : (
              <MiniEmptyState
                icon={FileText}
                text="No improved bullets available."
              />
            )}
          </div>
        )}
      </SectionCard>
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

const ResumeListCard = ({ title, icon: Icon, items = [] }) => {
  return (
    <SectionCard title={title} icon={Icon}>
      <div className="flex flex-wrap gap-2">
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
    </SectionCard>
  );
};

const ReportItem = ({ children }) => {
  return (
    <div className="rounded-xl bg-slate-950 px-4 py-3 text-sm leading-6 text-slate-300">
      {children}
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