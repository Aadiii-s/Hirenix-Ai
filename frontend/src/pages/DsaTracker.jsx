import { useEffect, useState } from "react";
import {
  BookOpen,
  CheckCircle2,
  Filter,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";

import MobileHeader from "../components/MobileHeader";
import Sidebar from "../components/Sidebar";
import {
  createDsaQuestionApi,
  deleteDsaQuestionApi,
  getDsaQuestionsApi,
  getDsaStatsApi,
  updateDsaQuestionStatusApi,
} from "../api/dsa.api";

const initialFormData = {
  title: "",
  platform: "leetcode",
  questionUrl: "",
  topic: "",
  difficulty: "easy",
  status: "not_started",
  notes: "",
  approach: "",
  timeComplexity: "",
  spaceComplexity: "",
  tags: "",
};

const DsaTracker = () => {
  const [questions, setQuestions] = useState([]);
  const [stats, setStats] = useState(null);

  const [formData, setFormData] = useState(initialFormData);
  const [showForm, setShowForm] = useState(false);

  const [filters, setFilters] = useState({
    search: "",
    topic: "",
    difficulty: "",
    status: "",
    platform: "",
  });

  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [updatingId, setUpdatingId] = useState("");
  const [deletingId, setDeletingId] = useState("");
  const [error, setError] = useState("");

  const fetchQuestions = async () => {
    try {
      setLoading(true);

      const activeFilters = Object.fromEntries(
        Object.entries(filters).filter(([, value]) => value)
      );

      const response = await getDsaQuestionsApi(activeFilters);

      setQuestions(response.data);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to fetch questions");
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

  const resetFilters = () => {
    setFilters({
      search: "",
      topic: "",
      difficulty: "",
      status: "",
      platform: "",
    });
  };

  const convertTagsToArray = (value) => {
    return value
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
  };

  const handleCreateQuestion = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.topic || !formData.difficulty) {
      setError("Title, topic, and difficulty are required");
      return;
    }

    const payload = {
      ...formData,
      tags: convertTagsToArray(formData.tags),
    };

    try {
      setCreating(true);

      await createDsaQuestionApi(payload);

      setFormData(initialFormData);
      setShowForm(false);

      await fetchQuestions();
      await fetchStats();
    } catch (error) {
      setError(error.response?.data?.message || "Failed to add question");
    } finally {
      setCreating(false);
    }
  };

  const handleStatusChange = async (questionId, status) => {
    try {
      setUpdatingId(questionId);

      await updateDsaQuestionStatusApi(questionId, status);

      await fetchQuestions();
      await fetchStats();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update status");
    } finally {
      setUpdatingId("");
    }
  };

  const handleDelete = async (questionId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this DSA question?"
    );

    if (!confirmDelete) return;

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
    <div className="min-h-screen bg-slate-950 text-white lg:flex">
      <Sidebar />

      <div className="lg:hidden">
        <MobileHeader />
      </div>

      <main
  className="h-screen flex-1 overflow-y-auto px-6 py-6 lg:px-8
  [&::-webkit-scrollbar]:w-2
  [&::-webkit-scrollbar-track]:bg-slate-950
  [&::-webkit-scrollbar-thumb]:rounded-full
  [&::-webkit-scrollbar-thumb]:bg-gray-900
  hover:[&::-webkit-scrollbar-thumb]:bg-gray-700"
>
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-blue-400 font-medium">DSA Tracker</p>
              <h1 className="mt-2 text-4xl font-bold">Track DSA Preparation</h1>
              <p className="mt-2 text-slate-400">
                Add questions, track status, revise weak topics, and monitor
                your placement coding progress.
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
              subtitle="Tracked questions"
            />

            <StatsCard
              title="Solved"
              value={stats?.solvedQuestions || 0}
              subtitle={`${stats?.completionPercentage || 0}% completion`}
            />

            <StatsCard
              title="In Progress"
              value={stats?.inProgressQuestions || 0}
              subtitle="Currently solving"
            />

            <StatsCard
              title="Revision"
              value={stats?.revisionQuestions || 0}
              subtitle="Need revision"
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
                  placeholder="Search title, topic, notes..."
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 py-3 pl-11 pr-4 outline-none focus:border-blue-500"
                />
              </div>

              <input
                type="text"
                name="topic"
                value={filters.topic}
                onChange={handleFilterChange}
                placeholder="Topic"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-blue-500"
              />

              <select
                name="difficulty"
                value={filters.difficulty}
                onChange={handleFilterChange}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-blue-500"
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
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-blue-500"
              >
                <option value="">All Status</option>
                <option value="not_started">Not Started</option>
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
                <h2 className="text-xl font-semibold">Add DSA Question</h2>

                <button
                  onClick={() => setShowForm(false)}
                  className="rounded-xl bg-slate-800 p-2 text-slate-300 hover:bg-slate-700"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleCreateQuestion} className="space-y-5">
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <Input
                    label="Question Title"
                    name="title"
                    value={formData.title}
                    onChange={handleFormChange}
                    placeholder="Two Sum"
                  />

                  <Input
                    label="Topic"
                    name="topic"
                    value={formData.topic}
                    onChange={handleFormChange}
                    placeholder="Arrays"
                  />
                </div>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                  <Select
                    label="Platform"
                    name="platform"
                    value={formData.platform}
                    onChange={handleFormChange}
                    options={[
                      ["leetcode", "LeetCode"],
                      ["gfg", "GFG"],
                      ["codeforces", "Codeforces"],
                      ["codingninjas", "Coding Ninjas"],
                      ["other", "Other"],
                    ]}
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
                      ["not_started", "Not Started"],
                      ["in_progress", "In Progress"],
                      ["solved", "Solved"],
                      ["revision", "Revision"],
                    ]}
                  />
                </div>

                <Input
                  label="Question URL"
                  name="questionUrl"
                  value={formData.questionUrl}
                  onChange={handleFormChange}
                  placeholder="https://leetcode.com/problems/two-sum/"
                />

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <Input
                    label="Time Complexity"
                    name="timeComplexity"
                    value={formData.timeComplexity}
                    onChange={handleFormChange}
                    placeholder="O(n)"
                  />

                  <Input
                    label="Space Complexity"
                    name="spaceComplexity"
                    value={formData.spaceComplexity}
                    onChange={handleFormChange}
                    placeholder="O(n)"
                  />
                </div>

                <Textarea
                  label="Approach"
                  name="approach"
                  value={formData.approach}
                  onChange={handleFormChange}
                  placeholder="Explain your approach..."
                />

                <Textarea
                  label="Notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleFormChange}
                  placeholder="Important edge cases, mistakes, revision notes..."
                />

                <Input
                  label="Tags"
                  name="tags"
                  value={formData.tags}
                  onChange={handleFormChange}
                  placeholder="hashmap, array, two-pointer"
                />

                <button
                  type="submit"
                  disabled={creating}
                  className="rounded-xl bg-blue-600 px-6 py-3 font-semibold hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {creating ? "Adding Question..." : "Add Question"}
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
              <div className="rounded-xl bg-slate-950 p-8 text-center text-slate-400">
                Loading questions...
              </div>
            ) : questions.length === 0 ? (
              <div className="rounded-xl bg-slate-950 p-10 text-center">
                <BookOpen className="mx-auto mb-4 text-blue-300" size={40} />

                <h3 className="text-2xl font-bold">No questions yet</h3>
                <p className="mt-2 text-slate-400">
                  Add your first DSA question to start tracking.
                </p>

                <button
                  onClick={() => setShowForm(true)}
                  className="mt-6 rounded-xl bg-blue-600 px-5 py-3 font-semibold hover:bg-blue-700"
                >
                  Add First Question
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {questions.map((question) => (
                  <div
                    key={question._id}
                    className="rounded-2xl border border-slate-800 bg-slate-950 p-5"
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div className="min-w-0">
                        <h3 className="text-xl font-semibold">
                          {question.title}
                        </h3>

                        <div className="mt-3 flex flex-wrap gap-2">
                          <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs text-blue-300">
                            {question.topic}
                          </span>

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
                            {question.status.replace("_", " ")}
                          </span>

                          <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-400 capitalize">
                            {question.platform}
                          </span>
                        </div>

                        {question.questionUrl && (
                          <a
                            href={question.questionUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-3 inline-block text-sm text-blue-400 hover:text-blue-300"
                          >
                            Open question
                          </a>
                        )}

                        {question.notes && (
                          <p className="mt-3 text-sm text-slate-400">
                            {question.notes}
                          </p>
                        )}

                        {(question.timeComplexity ||
                          question.spaceComplexity) && (
                          <p className="mt-3 text-sm text-slate-500">
                            Time: {question.timeComplexity || "N/A"} | Space:{" "}
                            {question.spaceComplexity || "N/A"}
                          </p>
                        )}
                      </div>

                      <div className="flex flex-col gap-3 lg:min-w-56">
                        <select
                          value={question.status}
                          disabled={updatingId === question._id}
                          onChange={(e) =>
                            handleStatusChange(question._id, e.target.value)
                          }
                          className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-sm outline-none focus:border-blue-500"
                        >
                          <option value="not_started">Not Started</option>
                          <option value="in_progress">In Progress</option>
                          <option value="solved">Solved</option>
                          <option value="revision">Revision</option>
                        </select>

                        <button
                          onClick={() => handleDelete(question._id)}
                          disabled={deletingId === question._id}
                          className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-500/30 px-4 py-2 text-sm text-red-300 hover:bg-red-500/10 disabled:opacity-60"
                        >
                          <Trash2 size={16} />
                          {deletingId === question._id ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

const StatsCard = ({ title, value, subtitle }) => {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
      <div className="mb-3 rounded-xl bg-blue-500/10 p-3 text-blue-300 w-fit">
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