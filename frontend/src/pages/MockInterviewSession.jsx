import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Brain,
  CheckCircle2,
  Clock,
  Send,
  Trophy,
} from "lucide-react";

import {
  completeMockInterviewApi,
  getMockInterviewByIdApi,
  submitInterviewAnswerApi,
} from "../api/interview.api";

import AppLayout from "../components/AppLayout";
import ErrorState from "../components/ErrorState";
import LoadingState from "../components/LoadingState";
import PageHeader from "../components/PageHeader";
import SectionCard from "../components/SectionCard";
import { getApiErrorMessage } from "../../utils/getApiErrorMessage";
import ApiErrorAlert from "../components/ApiErrorAlert";
import AiActionLoader from "../components/AiActionLoader";

const MockInterviewSession = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [interview, setInterview] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [latestEvaluation, setLatestEvaluation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [answerLoading, setAnswerLoading] = useState(false);
  const [completeLoading, setCompleteLoading] = useState(false);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");

  const fetchInterview = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getMockInterviewByIdApi(id);

      setInterview(response.data);

      const firstUnansweredIndex = response.data.questions.findIndex(
        (question) => !question.isAnswered
      );

      if (firstUnansweredIndex !== -1) {
        setCurrentQuestionIndex(firstUnansweredIndex);
      }
    } catch (error) {
      setError(error.response?.data?.message || "Failed to load interview");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInterview();
  }, [id]);

  useEffect(() => {
    if (interview?.questions?.[currentQuestionIndex]) {
      setAnswer(interview.questions[currentQuestionIndex].userAnswer || "");
      setLatestEvaluation(null);
    }
  }, [currentQuestionIndex, interview]);

  const currentQuestion = interview?.questions?.[currentQuestionIndex];

  const answeredCount =
    interview?.questions?.filter((question) => question.isAnswered).length || 0;

  const handleSubmitAnswer = async () => {
    if(answerLoading) return;
    if (!answer.trim()) {
      alert("Please write your answer first");
      return;
    }

    try {
      setAnswerLoading(true);

      const response = await submitInterviewAnswerApi(id, {
        questionId: currentQuestion._id,
        answer,
      });

      setInterview(response.data.interview);
      setLatestEvaluation(response.data.evaluation);
    } catch (error) {
      setActionError(
        getApiErrorMessage(
          error,
          "Failed to evaluate answer. Please try again."
        )
      );
    } finally {
      setAnswerLoading(false);
    }
  };

  const handleCompleteInterview = async () => {

    if(completeLoading) return;
    
    const isConfirmed = window.confirm(
      "Are you sure you want to complete this interview?"
    );

    if (!isConfirmed) return;

    try {
      setCompleteLoading(true);

      const response = await completeMockInterviewApi(id);

      setInterview(response.data);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to complete interview");
    } finally {
      setCompleteLoading(false);
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <LoadingState
          title="Loading mock interview"
          message="Please wait while we fetch your interview questions and progress."
        />
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout>
        <ErrorState
          title="Interview not found"
          message={error}
          buttonText="Back to Interviews"
          onRetry={() => navigate("/mock-interviews")}
        />
      </AppLayout>
    );
  }

  if (!interview) return null;

  return (
    <AppLayout>
      <PageHeader
        eyebrow="AI Mock Interview"
        title={interview.title}
        description={`${interview.targetRole || "Target role"} • ${interview.interviewType
          } • ${interview.difficulty}`}
        icon={Brain}
        backPath="/mock-interviews"
        backLabel="Back to interview history"
      />

      <SectionCard className="mb-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <InfoBox label="Type" value={interview.interviewType} />
          <InfoBox label="Difficulty" value={interview.difficulty} />
          <InfoBox
            label="Answered"
            value={`${answeredCount}/${interview.questions.length}`}
          />
          <InfoBox label="Status" value={interview.status} />
        </div>
      </SectionCard>

      {interview.status === "completed" ? (
        <InterviewReport interview={interview} />
      ) : (
        <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <SectionCard
            title={`Question ${currentQuestionIndex + 1} of ${interview.questions.length
              }`}
            description={currentQuestion?.isAnswered ? "Already answered" : "Write and submit your answer"}
            icon={Brain}
            className="xl:col-span-2"
          >
            <h2 className="mb-5 text-2xl font-semibold">
              {currentQuestion?.question}
            </h2>

            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              rows={9}
              placeholder="Write your interview answer here..."
              className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
            />

            <div className="mt-2 flex justify-between text-xs text-slate-500">
              <span>Tip: Use structured points and examples.</span>
              <span>{answer.length} characters</span>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <button
                onClick={handleSubmitAnswer}
                disabled={answerLoading}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold hover:bg-blue-700 disabled:opacity-70 cursor-pointer"
              >
                <Send size={18} />
                {answerLoading ? "Evaluating..." : "Submit Answer"}
              </button>

              <button
                onClick={handleCompleteInterview}
                disabled={completeLoading || answeredCount === 0}
                className="inline-flex items-center gap-2 rounded-xl border border-green-500/30 px-5 py-3 font-semibold text-green-300 hover:bg-green-500/10 disabled:opacity-50"
              >
                <Trophy size={18} />
                {completeLoading ? "Completing..." : "Complete Interview"}
              </button>
            </div>

            {latestEvaluation && (
              <EvaluationCard evaluation={latestEvaluation} />
            )}
          </SectionCard>

          {answerLoading && (
            <AiActionLoader
              title="Evaluating your answer"
              message="AI is reviewing your answer and generating score, feedback, strengths, and improvements."
            />
          )}

          {completeLoading && (
            <AiActionLoader
              title="Completing interview report"
              message="AI is generating your final interview summary and performance report."
            />
          )}

          {actionError && (
            <ApiErrorAlert
              title="Interview action failed"
              message={actionError}
              onRetry={() => setActionError("")}
            />
          )}

          <SectionCard
            title="Questions"
            description="Navigate through interview questions"
            icon={Clock}
          >
            <div className="space-y-2">
              {interview.questions.map((question, index) => (
                <button
                  key={question._id}
                  onClick={() => setCurrentQuestionIndex(index)}
                  className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-sm ${currentQuestionIndex === index
                    ? "bg-blue-600 text-white"
                    : "bg-slate-950 text-slate-300 hover:bg-slate-800"
                    }`}
                >
                  <span>Question {index + 1}</span>

                  {question.isAnswered ? (
                    <CheckCircle2 size={16} className="text-green-300" />
                  ) : (
                    <Clock size={16} className="text-slate-500" />
                  )}
                </button>
              ))}
            </div>
          </SectionCard>
        </section>
      )}
    </AppLayout>
  );
};

const EvaluationCard = ({ evaluation }) => {
  return (
    <div className="mt-6 rounded-2xl border border-blue-500/30 bg-blue-500/10 p-5">
      <p className="text-sm text-blue-300">Latest Evaluation</p>

      <h3 className="mt-2 text-2xl font-bold">
        Score: {evaluation.score}/10
      </h3>

      <p className="mt-3 text-sm leading-6 text-slate-300">
        {evaluation.feedback}
      </p>

      {evaluation.idealAnswer && (
        <div className="mt-4 rounded-xl bg-slate-950 p-4">
          <p className="mb-2 text-sm font-semibold text-slate-300">
            Ideal Answer
          </p>
          <p className="text-sm leading-6 text-slate-400">
            {evaluation.idealAnswer}
          </p>
        </div>
      )}
    </div>
  );
};

const InfoBox = ({ label, value }) => {
  return (
    <div className="rounded-xl bg-slate-950 p-4">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 font-semibold capitalize">
        {String(value || "N/A").replace("_", " ")}
      </p>
    </div>
  );
};

const InterviewReport = ({ interview }) => {
  return (
    <section className="space-y-6">
      <SectionCard
        title="Final Interview Score"
        description="Overall AI evaluation of this mock interview"
        icon={Trophy}
      >
        <h2 className="text-5xl font-bold">{interview.overallScore}%</h2>

        <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-800">
          <div
            className="h-full rounded-full bg-blue-600"
            style={{ width: `${interview.overallScore || 0}%` }}
          />
        </div>

        <p className="mt-5 text-slate-300">{interview.overallFeedback}</p>
      </SectionCard>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <ListCard title="Strengths" items={interview.strengths} />
        <ListCard title="Improvements" items={interview.improvements} />
      </div>

      <SectionCard
        title="Question Review"
        description="Review your answers, scores, and feedback."
        icon={Brain}
      >
        <div className="space-y-4">
          {interview.questions.map((question, index) => (
            <div
              key={question._id}
              className="rounded-2xl border border-slate-800 bg-slate-950 p-5"
            >
              <p className="text-sm text-blue-400">Question {index + 1}</p>
              <h4 className="mt-2 font-semibold">{question.question}</h4>

              <p className="mt-3 text-sm text-slate-400">
                Your Answer: {question.userAnswer || "Not answered"}
              </p>

              <p className="mt-3 text-sm text-slate-300">
                Score: {question.score}/10
              </p>

              <p className="mt-2 text-sm text-slate-400">
                Feedback: {question.feedback || "No feedback"}
              </p>
            </div>
          ))}
        </div>
      </SectionCard>
    </section>
  );
};

const ListCard = ({ title, items = [] }) => {
  return (
    <SectionCard title={title}>
      {items?.length > 0 ? (
        <ul className="space-y-3">
          {items.map((item, index) => (
            <li
              key={index}
              className="rounded-xl bg-slate-950 px-4 py-3 text-sm text-slate-300"
            >
              {item}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-slate-400">No data available.</p>
      )}
    </SectionCard>
  );
};

export default MockInterviewSession;