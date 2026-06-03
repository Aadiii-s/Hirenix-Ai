import { useEffect, useState } from "react";
import {
  BookOpen,
  CheckCircle2,
  Edit,
  Filter,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";

import {
  createDsaQuestionApi,
  deleteDsaQuestionApi,
  getDsaQuestionsApi,
  getDsaStatsApi,
  updateDsaQuestionApi,
} from "../api/dsa.api";

import AppLayout from "../components/AppLayout";
import EmptyState from "../components/EmptyState";
import LoadingState from "../components/LoadingState";

const initialFormData = {
  title: "",
  platform: "LeetCode",
  problemUrl: "",
  topic: "",
  difficulty: "medium",
  status: "unsolved",
  notes: "",
};

const DsaTracker = () => {
  const [questions, setQuestions] = useState([]);
  const [stats, setStats] = useState(null);

  const [formData, setFormData] = useState(initialFormData);
  const [editingQuestionId, setEditingQuestionId] = useState("");

  const [filters, setFilters] = useState({
    search: "",
    topic: "",
    difficulty: "",
    status: "",
  });

  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState("");
  const [error, setError] = useState("");

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      setError("");

      const activeFilters = Object.fromEntries(
        Object.entries(filters).filter(([, value]) => value)
      );

      const response = await getDsaQuestionsApi(activeFilters);

      setQuestions(response.data);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to fetch DSA questions");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await getDsaStatsApi();
      setStats(response.data);
    } catch (error) {
      console.log("DSA stats error:", error.response?.data || error);
    }
  };

  useEffect(() => {
    fetchQuestions();
    fetchStats();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchQuestions();
    }, 300);

    return () => clearTimeout(timer);
  }, [filters]);

  const handleFormChange = (e) => {
    setError("");

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setEditingQuestionId("");
    setShowForm(false);
  };

  const resetFilters = () => {
    setFilters({
      search: "",
      topic: "",
      difficulty: "",
      status: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      setError("Question title is required");
      return;
    }

    if (!formData.topic.trim()) {
      setError("Topic is required");
      return;
    }

    try {
      setSaving(true);
      setError("");

      if (editingQuestionId) {
        await updateDsaQuestionApi(editingQuestionId, formData);
      } else {
        await createDsaQuestionApi(formData);
      }

      resetForm();

      await fetchQuestions();
      await fetchStats();
    } catch (error) {
      setError(error.response?.data?.message || "Failed to save DSA question");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (question) => {
    setEditingQuestionId(question._id);

    setFormData({
      title: question.title || "",
      platform: question.platform || "LeetCode",
      problemUrl: question.problemUrl || "",
      topic: question.topic || "",
      difficulty: question.difficulty || "medium",
      status: question.status || "unsolved",
      notes: question.notes || "",
    });

    setShowForm(true);
  };

  const handleDelete = async (questionId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this DSA question?"
    );

    if (!confirmed) return;

    try {
      setDeletingId(questionId);

      await deleteDsaQuestionApi(questionId);

      setQuestions((prev) =>
        prev.filter((question) => question._id !== questionId)
      );

      await fetchStats();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete question");
    } finally {
      setDeletingId("");
    }
  };

  const getDifficultyClass = (difficulty) => {
    if (difficulty === "easy") return "bg-green-500/10 text-green-300";
    if (difficulty === "medium") return "bg-yellow-500/10 text-yellow-300";
    return "bg-red-500/10 text-red-300";
  };

  const getStatusClass = (status) => {
    if (status === "solved") return "bg-green-500/10 text-green-300";
    if (status === "in_progress") return "bg-blue-500/10 text-blue-300";
    if (status === "revision") return "bg-purple-500/10 text-purple-300";
    return "bg-slate-800 text-slate-400";
  };

  return (
    <AppLayout>
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-medium text-blue-400">DSA Tracker</p>
          <h1 className="mt-2 text-4xl font-bold">Track Your Coding Practice</h1>
          <p className="mt-2 text-slate-400">
            Add DSA questions, track topic-wise progress, difficulty, notes, and
            revision status.
          </p>
        </div>

        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold hover:bg-blue-700"
        >
          <Plus size={18} />
          Add Question
        </button>
      </div>

      <section className="mb-6 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        <StatsCard
          title="Total Questions"
          value={stats?.totalQuestions || 0}
          subtitle="Tracked problems"
        />

        <StatsCard
          title="Solved"
          value={stats?.solvedQuestions || 0}
          subtitle="Completed problems"
        />

        <StatsCard
          title="In Progress"
          value={stats?.inProgressQuestions || 0}
          subtitle="Currently solving"
        />

        <StatsCard
          title="Completion"
          value={`${stats?.completionPercentage || 0}%`}
          subtitle="Overall progress"
        />
      </section>

      <section className="mb-6 rounded-2xl border border-slate-800 bg-slate-900 p-5">
        <div className="mb-4 flex items-center gap-2">
          <Filter size={18} className="text-blue-300" />
          <h2 className="text-lg font-semibold">Search & Filters</h2>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
          <div className="relative md:col-span-2">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
            />

            <input
              type="text"
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              placeholder="Search question, topic, platform..."
              className="w-full rounded-xl border border-slate-700 bg-slate-950 py-3 pl-11 pr-4 outline-none focus:border-blue-500"
            />
          </div>

          <input
            type="text"
            name="topic"
            value={filters.topic}
            onChange={handleFilterChange}
            placeholder="Topic"
            className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-blue-500"
          />

          <select
            name="difficulty"
            value={filters.difficulty}
            onChange={handleFilterChange}
            className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-blue-500"
          >
            <option value="">All Difficulty</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>

          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-blue-500"
          >
            <option value="">All Status</option>
            <option value="unsolved">Unsolved</option>
            <option value="in_progress">In Progress</option>
            <option value="solved">Solved</option>
            <option value="revision">Revision</option>
          </select>
        </div>

        <button
          onClick={resetFilters}
          className="mt-4 rounded-xl border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800"
        >
          Clear Filters
        </button>
      </section>

      {error && (
        <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {showForm && (
        <section className="mb-6 rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              {editingQuestionId ? "Edit Question" : "Add DSA Question"}
            </h2>

            <button
              onClick={resetForm}
              className="rounded-xl bg-slate-800 p-2 text-slate-300 hover:bg-slate-700"
            >
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <Input
                label="Question Title"
                name="title"
                value={formData.title}
                onChange={handleFormChange}
                placeholder="Two Sum"
              />

              <Input
                label="Platform"
                name="platform"
                value={formData.platform}
                onChange={handleFormChange}
                placeholder="LeetCode"
              />
            </div>

            <Input
              label="Problem URL"
              name="problemUrl"
              value={formData.problemUrl}
              onChange={handleFormChange}
              placeholder="https://leetcode.com/problems/two-sum"
            />

            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              <Input
                label="Topic"
                name="topic"
                value={formData.topic}
                onChange={handleFormChange}
                placeholder="Array"
              />

              <Select
                label="Difficulty"
                name="difficulty"
                value={formData.difficulty}
                onChange={handleFormChange}
                options={[
                  ["easy", "Easy"],
                  ["medium", "Medium"],
                  ["hard", "Hard"],
                ]}
              />

              <Select
                label="Status"
                name="status"
                value={formData.status}
                onChange={handleFormChange}
                options={[
                  ["unsolved", "Unsolved"],
                  ["in_progress", "In Progress"],
                  ["solved", "Solved"],
                  ["revision", "Revision"],
                ]}
              />
            </div>

            <Textarea
              label="Notes"
              name="notes"
              value={formData.notes}
              onChange={handleFormChange}
              placeholder="Approach, mistakes, edge cases..."
            />

            <button
              disabled={saving}
              className="rounded-xl bg-blue-600 px-6 py-3 font-semibold hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {saving
                ? "Saving..."
                : editingQuestionId
                ? "Update Question"
                : "Add Question"}
            </button>
          </form>
        </section>
      )}

      <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Question List</h2>
          <p className="text-sm text-slate-400">
            {questions.length} question{questions.length !== 1 ? "s" : ""}
          </p>
        </div>

        {loading ? (
          <LoadingState
            title="Loading DSA questions"
            message="Please wait while we fetch your tracked coding problems."
          />
        ) : questions.length === 0 ? (
          <EmptyState
            icon={BookOpen}
            title="No DSA questions added yet"
            message="Add your first coding problem to start tracking DSA progress."
            buttonText="Add First Question"
            onAction={() => setShowForm(true)}
          />
        ) : (
          <div className="space-y-4">
            {questions.map((question) => (
              <div
                key={question._id}
                className="rounded-2xl border border-slate-800 bg-slate-950 p-5"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <h3 className="text-xl font-semibold">{question.title}</h3>

                    <p className="mt-2 text-sm text-slate-400">
                      {question.platform} • {question.topic}
                    </p>

                    {question.problemUrl && (
                      <a
                        href={question.problemUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-2 inline-block text-sm text-blue-400 hover:text-blue-300"
                      >
                        Open Problem
                      </a>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <span
                      className={`rounded-full px-3 py-1 text-xs capitalize ${getDifficultyClass(
                        question.difficulty
                      )}`}
                    >
                      {question.difficulty}
                    </span>

                    <span
                      className={`rounded-full px-3 py-1 text-xs capitalize ${getStatusClass(
                        question.status
                      )}`}
                    >
                      {question.status?.replace("_", " ")}
                    </span>
                  </div>
                </div>

                {question.notes && (
                  <p className="mt-4 rounded-xl bg-slate-900 px-4 py-3 text-sm leading-6 text-slate-400">
                    {question.notes}
                  </p>
                )}

                <div className="mt-5 flex gap-3">
                  <button
                    onClick={() => handleEdit(question)}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800"
                  >
                    <Edit size={16} />
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(question._id)}
                    disabled={deletingId === question._id}
                    className="inline-flex items-center gap-2 rounded-xl border border-red-500/30 px-4 py-2 text-sm text-red-300 hover:bg-red-500/10 disabled:opacity-60"
                  >
                    <Trash2 size={16} />
                    {deletingId === question._id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </AppLayout>
  );
};

const StatsCard = ({ title, value, subtitle }) => {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
      <div className="mb-3 w-fit rounded-xl bg-blue-500/10 p-3 text-blue-300">
        <CheckCircle2 size={22} />
      </div>

      <p className="text-sm text-slate-400">{title}</p>
      <h2 className="mt-2 text-3xl font-bold">{value}</h2>
      <p className="mt-2 text-xs text-slate-500">{subtitle}</p>
    </div>
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

const Textarea = ({ label, ...props }) => {
  return (
    <div>
      <label className="mb-2 block text-sm text-slate-300">{label}</label>
      <textarea
        {...props}
        rows={4}
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

export default DsaTracker;