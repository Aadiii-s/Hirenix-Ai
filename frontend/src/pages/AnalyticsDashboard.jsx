import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
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
            <BarChart3 size={30} />
          </div>

          <div>
            <p className="font-medium text-blue-400">Global Analytics</p>
            <h1 className="text-4xl font-bold">
              Preparation Analytics Dashboard
            </h1>
          </div>
        </div>

        <p className="mt-4 max-w-3xl text-slate-400">
          Complete overview of your placement preparation across profile,
          roadmap, resume, DSA, interviews, skill gaps, and company-wise
          preparation.
        </p>
      </div>

      <section className="mb-6 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-6">
        <AnalyticsStatCard
          title="Profile"
          value={`${analytics.summary.profileScore || 0}%`}
          icon={Target}
        />

        <AnalyticsStatCard
          title="Roadmap"
          value={`${analytics.summary.roadmapProgress || 0}%`}
          icon={Route}
        />

        <AnalyticsStatCard
          title="Resume"
          value={`${analytics.summary.resumeScore || 0}/100`}
          icon={FileText}
        />

        <AnalyticsStatCard
          title="DSA"
          value={`${analytics.summary.dsaCompletionPercentage || 0}%`}
          icon={BookOpen}
        />

        <AnalyticsStatCard
          title="Interview"
          value={`${analytics.summary.averageInterviewScore || 0}%`}
          icon={Brain}
        />

        <AnalyticsStatCard
          title="Companies"
          value={`${analytics.summary.averageCompanyProgress || 0}%`}
          icon={Building2}
        />
      </section>

      <section className="mb-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 xl:col-span-2">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-xl bg-blue-500/10 p-3 text-blue-300">
              <TrendingUp size={22} />
            </div>

            <div>
              <h2 className="text-xl font-semibold">Module Performance</h2>
              <p className="text-sm text-slate-400">
                Score across all preparation modules
              </p>
            </div>
          </div>

          <div className="space-y-5">
            {analytics.moduleScores?.map((module) => (
              <ModuleScoreRow key={module.module} module={module} />
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <div className="mb-5 flex items-center gap-3">
            <div className="rounded-xl bg-red-500/10 p-3 text-red-300">
              <Zap size={22} />
            </div>

            <div>
              <h2 className="text-xl font-semibold">Weak Areas</h2>
              <p className="text-sm text-slate-400">Improve these first</p>
            </div>
          </div>

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
            <p className="text-sm text-slate-400">
              No major weak areas detected.
            </p>
          )}
        </div>
      </section>

      <section className="mb-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 xl:col-span-2">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-xl bg-green-500/10 p-3 text-green-300">
              <CheckCircle2 size={22} />
            </div>

            <div>
              <h2 className="text-xl font-semibold">Quick Actions</h2>
              <p className="text-sm text-slate-400">
                Recommended next steps from your preparation data
              </p>
            </div>
          </div>

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
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <div className="mb-5 flex items-center gap-3">
            <div className="rounded-xl bg-purple-500/10 p-3 text-purple-300">
              <Target size={22} />
            </div>

            <div>
              <h2 className="text-xl font-semibold">Skill Gap Focus</h2>
              <p className="text-sm text-slate-400">
                Focus areas from latest analysis
              </p>
            </div>
          </div>

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
                Generate a skill gap analysis to see missing skills and focus
                areas.
              </p>

              <Link
                to="/skill-gap"
                className="mt-5 inline-block rounded-xl bg-blue-600 px-5 py-3 font-semibold hover:bg-blue-700"
              >
                Generate Analysis
              </Link>
            </>
          )}
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <DsaAnalyticsCard dsaStats={analytics.dsaStats} />
        <InterviewAnalyticsCard interviewStats={analytics.interviewStats} />
        <CompanyAnalyticsCard companyStats={analytics.companyStats} />
      </section>
    </AppLayout>
  );
};

const AnalyticsStatCard = ({ title, value, icon: Icon }) => {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
      <div className="mb-3 w-fit rounded-xl bg-blue-500/10 p-3 text-blue-300">
        <Icon size={22} />
      </div>

      <p className="text-sm text-slate-400">{title}</p>
      <h2 className="mt-2 text-2xl font-bold">{value}</h2>
    </div>
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
      <div className="mb-5 flex items-center gap-3">
        <div className="rounded-xl bg-blue-500/10 p-3 text-blue-300">
          <BookOpen size={22} />
        </div>

        <div>
          <h2 className="text-xl font-semibold">DSA Analytics</h2>
          <p className="text-sm text-slate-400">Coding progress overview</p>
        </div>
      </div>

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
      <div className="mb-5 flex items-center gap-3">
        <div className="rounded-xl bg-purple-500/10 p-3 text-purple-300">
          <Brain size={22} />
        </div>

        <div>
          <h2 className="text-xl font-semibold">Interview Analytics</h2>
          <p className="text-sm text-slate-400">Mock interview performance</p>
        </div>
      </div>

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
      <div className="mb-5 flex items-center gap-3">
        <div className="rounded-xl bg-green-500/10 p-3 text-green-300">
          <Building2 size={22} />
        </div>

        <div>
          <h2 className="text-xl font-semibold">Company Analytics</h2>
          <p className="text-sm text-slate-400">Target company progress</p>
        </div>
      </div>

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