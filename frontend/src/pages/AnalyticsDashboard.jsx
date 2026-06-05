import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  BarChart3,
  BookOpen,
  Brain,
  Building2,
  CheckCircle2,
  FileText,
  Route,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react";

import { getAnalyticsOverviewApi } from "../api/analytics.api";
import AppLayout from "../components/AppLayout";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import PageHeader from "../components/PageHeader"
import SectionCard from "../components/SectionCard";
import StatCard from "../components/StatCard";

const AnalyticsDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAnalyticsOverviewApi();

      setAnalytics(response.data);
    } catch (error) {
      setError(
        error.response?.data?.message || "Failed to fetch analytics overview"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <AppLayout>
        <LoadingState
          title="Loading analytics overview"
          message="Please wait while we prepare your complete preparation insights."
        />
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout>
        <ErrorState
          title="Analytics loading failed"
          message={error}
          buttonText="Retry"
          onRetry={fetchAnalytics}
        />
      </AppLayout>
    );
  }

  if (!analytics) return null;

  return (
    <AppLayout>
      <PageHeader
        eyebrow="Global Analytics"
        title="Preparation Analytics Dashboard"
        description="Complete overview of your placement preparation across profile, roadmap, resume, DSA, interviews, skill gaps, and company-wise preparation."
        icon={BarChart3}
        backPath="/dashboard"
        backLabel="Back to dashboard"
      />

      <section className="mb-6 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-6">
        <StatCard
          title="Profile"
          value={`${analytics.summary.profileScore || 0}%`}
          icon={Target}
        />

        <StatCard
          title="Roadmap"
          value={`${analytics.summary.roadmapProgress || 0}%`}
          icon={Route}
        />

        <StatCard
          title="Resume"
          value={`${analytics.summary.resumeScore || 0}/100`}
          icon={FileText}
        />

        <StatCard
          title="DSA"
          value={`${analytics.summary.dsaCompletionPercentage || 0}%`}
          icon={BookOpen}
        />

        <StatCard
          title="Interview"
          value={`${analytics.summary.averageInterviewScore || 0}%`}
          icon={Brain}
        />

        <StatCard
          title="Companies"
          value={`${analytics.summary.averageCompanyProgress || 0}%`}
          icon={Building2}
        />
      </section>

      <section className="mb-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <SectionCard
          title="Module Performance"
          description="Score across all preparation modules"
          icon={TrendingUp}
          className="xl:col-span-2"
        >
          <div className="space-y-5">
            {analytics.moduleScores?.map((module) => (
              <ModuleScoreRow key={module.module} module={module} />
            ))}
          </div>
        </SectionCard>

        <SectionCard
          title="Weak Areas"
          description="Improve these first"
          icon={Zap}
        >
          {analytics.weakAreas?.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {analytics.weakAreas.map((area) => (
                <span
                  key={area}
                  className="rounded-full bg-red-500/10 px-3 py-1 text-sm text-red-300"
                >
                  {area}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-400">No major weak areas detected.</p>
          )}
        </SectionCard>
      </section>

      <section className="mb-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <SectionCard
          title="Quick Actions"
          description="Recommended next steps from your preparation data"
          icon={CheckCircle2}
          className="xl:col-span-2"
        >
          {analytics.quickActions?.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {analytics.quickActions.map((action) => (
                <QuickActionCard key={action.title} action={action} />
              ))}
            </div>
          ) : (
            <div className="rounded-xl bg-slate-950 p-8 text-center text-slate-400">
              No quick actions right now. Continue your daily preparation.
            </div>
          )}
        </SectionCard>

        <SectionCard
          title="Skill Gap Focus"
          description="Focus areas from latest analysis"
          icon={Target}
        >
          {analytics.skillGap ? (
            <>
              <p className="text-sm leading-6 text-slate-300">
                {analytics.skillGap.summary || "Latest skill gap report ready."}
              </p>

              {analytics.skillGap.topThreeFocusAreas?.length > 0 && (
                <div className="mt-4">
                  <p className="mb-2 text-sm font-semibold text-slate-300">
                    Focus This Week
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {analytics.skillGap.topThreeFocusAreas.map((focus) => (
                      <span
                        key={focus}
                        className="rounded-full bg-blue-500/10 px-3 py-1 text-xs text-blue-300"
                      >
                        {focus}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <Link
                to={`/skill-gap/${analytics.skillGap._id}`}
                className="mt-5 inline-block rounded-xl bg-blue-600 px-5 py-3 font-semibold hover:bg-blue-700"
              >
                View Skill Gap
              </Link>
            </>
          ) : (
            <>
              <p className="text-sm leading-6 text-slate-300">
                Generate a skill gap analysis to see missing skills and focus areas.
              </p>

              <Link
                to="/skill-gap"
                className="mt-5 inline-block rounded-xl bg-blue-600 px-5 py-3 font-semibold hover:bg-blue-700"
              >
                Generate Analysis
              </Link>
            </>
          )}
        </SectionCard>
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <DsaAnalyticsCard dsaStats={analytics.dsaStats} />
        <InterviewAnalyticsCard interviewStats={analytics.interviewStats} />
        <CompanyAnalyticsCard companyStats={analytics.companyStats} />
      </section>
    </AppLayout>
  );
};


const ModuleScoreRow = ({ module }) => {
  const levelClass =
    module.level === "strong"
      ? "bg-green-500/10 text-green-300"
      : module.level === "good"
        ? "bg-blue-500/10 text-blue-300"
        : module.level === "average"
          ? "bg-yellow-500/10 text-yellow-300"
          : "bg-red-500/10 text-red-300";

  return (
    <div className="rounded-2xl bg-slate-950 p-4">
      <div className="mb-2 flex items-center justify-between gap-4">
        <div>
          <h3 className="font-semibold">{module.module}</h3>
          <p className="text-sm text-slate-500">Score: {module.score}%</p>
        </div>

        <span
          className={`rounded-full px-3 py-1 text-xs capitalize ${levelClass}`}
        >
          {module.level}
        </span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-slate-800">
        <div
          className="h-full rounded-full bg-blue-600"
          style={{ width: `${module.score || 0}%` }}
        />
      </div>

      <Link
        to={module.path}
        className="mt-3 inline-block text-sm text-blue-400 hover:text-blue-300"
      >
        Open {module.module}
      </Link>
    </div>
  );
};

const QuickActionCard = ({ action }) => {
  const priorityClass =
    action.priority === "high"
      ? "bg-red-500/10 text-red-300"
      : action.priority === "medium"
        ? "bg-yellow-500/10 text-yellow-300"
        : "bg-green-500/10 text-green-300";

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
      <div className="mb-3 flex items-start justify-between gap-3">
        <h3 className="text-lg font-semibold">{action.title}</h3>

        <span
          className={`rounded-full px-3 py-1 text-xs capitalize ${priorityClass}`}
        >
          {action.priority}
        </span>
      </div>

      <p className="text-sm leading-6 text-slate-400">{action.description}</p>

      <Link
        to={action.path}
        className="mt-5 inline-block rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold hover:bg-blue-700"
      >
        Start Action
      </Link>
    </div>
  );
};

const DsaAnalyticsCard = ({ dsaStats }) => {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <SectionCard
        title="DSA Analytics"
        description="Coding progress overview"
        icon={BookOpen}
      >
        ...
      </SectionCard>

      <div className="space-y-3 text-sm text-slate-300">
        <InfoRow label="Total Questions" value={dsaStats?.totalQuestions || 0} />
        <InfoRow label="Solved" value={dsaStats?.solvedQuestions || 0} />
        <InfoRow label="In Progress" value={dsaStats?.inProgressQuestions || 0} />
        <InfoRow label="Revision" value={dsaStats?.revisionQuestions || 0} />
        <InfoRow
          label="Completion"
          value={`${dsaStats?.completionPercentage || 0}%`}
        />
      </div>

      {dsaStats?.topicStats?.length > 0 && (
        <div className="mt-5">
          <p className="mb-3 text-sm font-semibold text-slate-300">
            Top Topics
          </p>

          <div className="space-y-2">
            {dsaStats.topicStats.map((topic) => (
              <div
                key={topic._id}
                className="rounded-xl bg-slate-950 px-4 py-3 text-sm text-slate-300"
              >
                {topic._id}: {topic.solved}/{topic.total} solved
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const InterviewAnalyticsCard = ({ interviewStats }) => {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <SectionCard
        title="Interview Analytics"
        description="Mock interview performance"
        icon={Brain}
      >
        ...
      </SectionCard>

      <div className="space-y-3 text-sm text-slate-300">
        <InfoRow
          label="Total Interviews"
          value={interviewStats?.totalInterviews || 0}
        />
        <InfoRow
          label="Completed"
          value={interviewStats?.completedInterviews || 0}
        />
        <InfoRow
          label="Average Score"
          value={`${interviewStats?.averageScore || 0}%`}
        />
      </div>

      {interviewStats?.latestInterview ? (
        <Link
          to={`/mock-interviews/${interviewStats.latestInterview._id}`}
          className="mt-5 inline-block rounded-xl bg-blue-600 px-5 py-3 font-semibold hover:bg-blue-700"
        >
          View Latest Interview
        </Link>
      ) : (
        <Link
          to="/mock-interview"
          className="mt-5 inline-block rounded-xl bg-blue-600 px-5 py-3 font-semibold hover:bg-blue-700"
        >
          Start Interview
        </Link>
      )}
    </div>
  );
};

const CompanyAnalyticsCard = ({ companyStats }) => {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <SectionCard
        title="Company Analytics"
        description="Target company progress"
        icon={Building2}
      >
        ...
      </SectionCard>

      <div className="space-y-3 text-sm text-slate-300">
        <InfoRow
          label="Total Companies"
          value={companyStats?.totalCompanies || 0}
        />
        <InfoRow
          label="High Priority"
          value={companyStats?.highPriorityCompanies || 0}
        />
        <InfoRow label="Applied" value={companyStats?.appliedCompanies || 0} />
        <InfoRow
          label="Average Progress"
          value={`${companyStats?.averageProgress || 0}%`}
        />
      </div>

      {companyStats?.topCompanies?.length > 0 && (
        <div className="mt-5">
          <p className="mb-3 text-sm font-semibold text-slate-300">
            Top Companies
          </p>

          <div className="space-y-2">
            {companyStats.topCompanies.map((company) => (
              <div
                key={company._id}
                className="rounded-xl bg-slate-950 px-4 py-3 text-sm text-slate-300"
              >
                {company.companyName}: {company.progressPercentage || 0}%
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const InfoRow = ({ label, value }) => {
  return (
    <div className="flex items-center justify-between rounded-xl bg-slate-950 px-4 py-3">
      <span className="text-slate-400">{label}</span>
      <span className="font-semibold text-slate-200">{value}</span>
    </div>
  );
};

export default AnalyticsDashboard;