import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
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

const MockInterviewSession = () => {
  const { id } = useParams();

  const [interview, setInterview] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [latestEvaluation, setLatestEvaluation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [answerLoading, setAnswerLoading] = useState(false);
  const [completeLoading, setCompleteLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchInterview = async () => {
    try {
      setLoading(true);

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
      alert(error.response?.data?.message || "Failed to submit answer");
    } finally {
      setAnswerLoading(false);
    }
  };

  const handleCompleteInterview = async () => {
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
      <Layout>
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center text-slate-400">
          Loading interview...
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-8 text-red-300">
          <p>{error}</p>

          <Link
            to="/mock-interviews"
            className="mt-5 inline-block rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Back to Interviews
          </Link>
        </div>
      </Layout>
    );
  }

  if (!interview) return null;

  return (
    <AppLayout>
      <div className="mb-8">
        <Link
          to="/mock-interviews"
          className="mb-5 inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white"
        >
          <ArrowLeft size={16} />
          Back to interview history
        </Link>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <p className="font-medium text-blue-400">AI Mock Interview</p>

          <h1 className="mt-2 text-3xl font-bold">{interview.title}</h1>

          <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-4">
            <InfoBox label="Type" value={interview.interviewType} />
            <InfoBox label="Difficulty" value={interview.difficulty} />
            <InfoBox
              label="Answered"
              value={`${answeredCount}/${interview.questions.length}`}
            />
            <InfoBox label="Status" value={interview.status} />
          </div>
        </div>
      </div>

      {interview.status === "completed" ? (
        <InterviewReport interview={interview} />
      ) : (
        <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 xl:col-span-2">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-400">
                  Question {currentQuestionIndex + 1} of{" "}
                  {interview.questions.length}
                </p>

                <h2 className="mt-2 text-2xl font-semibold">
                  {currentQuestion?.question}
                </h2>
              </div>

              {currentQuestion?.isAnswered && (
                <span className="rounded-full bg-green-500/10 px-3 py-1 text-sm text-green-300">
                  Answered
                </span>
              )}
            </div>

            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              rows={8}
              placeholder="Write your interview answer here..."
              className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
            />

            <div className="mt-5 flex flex-wrap gap-3">
              <button
                onClick={handleSubmitAnswer}
                disabled={answerLoading}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold hover:bg-blue-700 disabled:opacity-70"
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
              <div className="mt-6 rounded-2xl border border-blue-500/30 bg-blue-500/10 p-5">
                <p className="text-sm text-blue-300">Latest Evaluation</p>

                <h3 className="mt-2 text-2xl font-bold">
                  Score: {latestEvaluation.score}/10
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-300">
                  {latestEvaluation.feedback}
                </p>

                {latestEvaluation.idealAnswer && (
                  <div className="mt-4 rounded-xl bg-slate-950 p-4">
                    <p className="mb-2 text-sm font-semibold text-slate-300">
                      Ideal Answer
                    </p>
                    <p className="text-sm leading-6 text-slate-400">
                      {latestEvaluation.idealAnswer}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          <aside className="space-y-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
              <h3 className="text-lg font-semibold">Questions</h3>

              <div className="mt-4 space-y-2">
                {interview.questions.map((question, index) => (
                  <button
                    key={question._id}
                    onClick={() => setCurrentQuestionIndex(index)}
                    className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-sm ${
                      currentQuestionIndex === index
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
            </div>
          </aside>
        </section>
      )}
    </AppLayout>
  );
};

const Layout = ({ children }) => {
  return (
    <AppLayout>

      <main className="flex-1 px-6 py-6 lg:px-8">
        <div className="mx-auto max-w-7xl">{children}</div>
      </main>
    </AppLayout>
  );
};

const InfoBox = ({ label, value }) => {
  return (
    <div className="rounded-xl bg-slate-950 p-4">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 font-semibold capitalize">{value}</p>
    </div>
  );
};

const InterviewReport = ({ interview }) => {
  return (
    <section className="space-y-6">
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <p className="text-blue-400">Final Interview Score</p>

        <h2 className="mt-2 text-5xl font-bold">{interview.overallScore}%</h2>

        <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-800">
          <div
            className="h-full rounded-full bg-blue-600"
            style={{ width: `${interview.overallScore || 0}%` }}
          />
        </div>

        <p className="mt-5 text-slate-300">{interview.overallFeedback}</p>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <ListCard title="Strengths" items={interview.strengths} />
        <ListCard title="Improvements" items={interview.improvements} />
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <h3 className="mb-5 text-xl font-semibold">Question Review</h3>

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
      </div>
    </section>
  );
};

const ListCard = ({ title, items = [] }) => {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <h3 className="mb-4 text-xl font-semibold">{title}</h3>

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
    </div>
  );
};

export default MockInterviewSession;