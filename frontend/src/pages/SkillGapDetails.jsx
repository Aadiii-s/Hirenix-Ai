import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Brain,
  CheckCircle2,
  Flame,
  Lightbulb,
  Search,
  Target,
  XCircle,
} from "lucide-react";

import { getSkillGapAnalysisByIdApi } from "../api/skillGap.api";

import AppLayout from "../components/AppLayout";
import ErrorState from "../components/ErrorState";
import LoadingState from "../components/LoadingState";
import PageHeader from "../components/PageHeader";
import SectionCard from "../components/SectionCard";

const SkillGapDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [analysis, setAnalysis] = useState(null);
  const [activeTab, setActiveTab] = useState("skills");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAnalysis = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getSkillGapAnalysisByIdApi(id);
      setAnalysis(response.data);
    } catch (error) {
      setError(
        error.response?.data?.message || "Failed to fetch skill gap analysis"
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
          title="Loading skill gap report"
          message="Please wait while we fetch your AI-generated skill gap analysis."
        />
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout>
        <ErrorState
          title="Skill gap report not found"
          message={error}
          buttonText="Back to History"
          onRetry={() => navigate("/skill-gap/history")}
        />
      </AppLayout>
    );
  }

  if (!analysis) return null;

  return (
    <AppLayout>
      <PageHeader
        eyebrow="Skill Gap Report"
        title={analysis.targetRole || "Skill Gap Analysis"}
        description={
          analysis.summary ||
          "AI-generated skill gap analysis based on your preparation data."
        }
        icon={Brain}
        backPath="/skill-gap/history"
        backLabel="Back to skill gap history"
      />

      <SectionCard className="mb-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <InfoBox
            label="Missing Skills"
            value={analysis.missingSkills?.length || 0}
          />
          <InfoBox
            label="Weak Skills"
            value={analysis.weakSkills?.length || 0}
          />
          <InfoBox
            label="Strong Skills"
            value={analysis.strongSkills?.length || 0}
          />
          <InfoBox label="Impact" value={analysis.readinessImpact || "Medium"} />
        </div>

        {analysis.topThreeFocusAreas?.length > 0 && (
          <div className="mt-6 rounded-2xl border border-blue-500/20 bg-blue-500/10 p-5">
            <div className="mb-3 flex items-center gap-2">
              <Target size={18} className="text-blue-300" />
              <h2 className="font-semibold text-blue-200">Focus This Week</h2>
            </div>

            <div className="flex flex-wrap gap-2">
              {analysis.topThreeFocusAreas.map((focus) => (
                <span
                  key={focus}
                  className="rounded-full bg-slate-950 px-4 py-2 text-sm text-blue-300"
                >
                  {focus}
                </span>
              ))}
            </div>
          </div>
        )}
      </SectionCard>

      <section className="mb-6 grid grid-cols-1 gap-5 lg:grid-cols-3">
        <SkillListCard
          title="Missing Skills"
          icon={XCircle}
          items={analysis.missingSkills}
          color="red"
        />

        <SkillListCard
          title="Weak Skills"
          icon={Flame}
          items={analysis.weakSkills}
          color="yellow"
        />

        <SkillListCard
          title="Strong Skills"
          icon={CheckCircle2}
          items={analysis.strongSkills}
          color="green"
        />
      </section>

      <SectionCard
        title="Detailed Learning Report"
        description="Review priority skills, 4-week plan, and required skills."
        icon={Lightbulb}
      >
        <div className="mb-6 flex flex-wrap gap-3">
          {[
            ["skills", "Priority Skills"],
            ["plan", "4-Week Plan"],
            ["required", "Required Skills"],
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

        {activeTab === "skills" && (
          <div className="space-y-4">
            {analysis.prioritySkills?.length > 0 ? (
              analysis.prioritySkills.map((item, index) => (
                <PrioritySkillCard key={index} item={item} index={index} />
              ))
            ) : (
              <MiniEmptyState
                icon={Lightbulb}
                text="No priority skills available."
              />
            )}
          </div>
        )}

        {activeTab === "plan" && (
          <div className="space-y-4">
            {analysis.learningPlan?.length > 0 ? (
              analysis.learningPlan.map((week) => (
                <WeekPlanCard key={week.week} week={week} />
              ))
            ) : (
              <MiniEmptyState
                icon={Search}
                text="No learning plan available."
              />
            )}
          </div>
        )}

        {activeTab === "required" && (
          <div className="flex flex-wrap gap-2">
            {analysis.requiredSkills?.length > 0 ? (
              analysis.requiredSkills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full bg-purple-500/10 px-3 py-1 text-sm text-purple-300"
                >
                  {skill}
                </span>
              ))
            ) : (
              <MiniEmptyState
                icon={Search}
                text="No required skills available."
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

const SkillListCard = ({ title, icon: Icon, items = [], color }) => {
  const colorClass =
    color === "red"
      ? "text-red-300 bg-red-500/10"
      : color === "yellow"
      ? "text-yellow-300 bg-yellow-500/10"
      : "text-green-300 bg-green-500/10";

  return (
    <SectionCard title={title} icon={Icon}>
      <div className={`mb-4 hidden w-fit rounded-xl p-3 ${colorClass}`} />

      <div className="flex flex-wrap gap-2">
        {items?.length > 0 ? (
          items.map((item) => (
            <span
              key={item}
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

const PrioritySkillCard = ({ item, index }) => {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-blue-400">Priority Skill #{index + 1}</p>
          <h3 className="mt-1 text-xl font-semibold">{item.skill}</h3>
        </div>

        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
            item.priority === "high"
              ? "bg-red-500/10 text-red-300"
              : item.priority === "medium"
              ? "bg-yellow-500/10 text-yellow-300"
              : "bg-green-500/10 text-green-300"
          }`}
        >
          {item.priority || "medium"}
        </span>
      </div>

      <p className="text-sm leading-6 text-slate-400">
        <span className="font-semibold text-slate-300">Reason:</span>{" "}
        {item.reason || "This skill is important for your target role."}
      </p>

      <p className="mt-3 text-sm leading-6 text-slate-400">
        <span className="font-semibold text-slate-300">Suggested Action:</span>{" "}
        {item.suggestedAction || "Practice this skill consistently this week."}
      </p>
    </div>
  );
};

const WeekPlanCard = ({ week }) => {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
      <p className="text-sm text-blue-400">Week {week.week}</p>
      <h3 className="mt-1 text-xl font-semibold">{week.focus}</h3>

      {week.skills?.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {week.skills.map((skill) => (
            <span
              key={skill}
              className="rounded-full bg-blue-500/10 px-3 py-1 text-xs text-blue-300"
            >
              {skill}
            </span>
          ))}
        </div>
      )}

      {week.tasks?.length > 0 && (
        <ul className="mt-4 space-y-2">
          {week.tasks.map((task, index) => (
            <li
              key={index}
              className="rounded-xl bg-slate-900 px-4 py-3 text-sm text-slate-300"
            >
              {task}
            </li>
          ))}
        </ul>
      )}
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

export default SkillGapDetails;