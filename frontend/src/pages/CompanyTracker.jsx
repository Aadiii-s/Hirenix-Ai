import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Building2,
  CheckCircle2,
  Filter,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";

import {
  createCompanyPrepApi,
  deleteCompanyPrepApi,
  getCompanyPrepStatsApi,
  getMyCompanyPrepsApi,
} from "../api/company.api";

import AppLayout from "../components/AppLayout";
import EmptyState from "../components/EmptyState";
import LoadingState from "../components/LoadingState";
import { useAuth } from "../context/AuthContext";

const initialFormData = {
  companyName: "",
  targetRole: "",
  companyType: "product",
  priority: "medium",
  applicationStatus: "not_applied",
  preparationFocus: "",
  tasks: "",
  notes: "",
};

const CompanyTracker = () => {
  const { user } = useAuth();

  const [companies, setCompanies] = useState([]);
  const [stats, setStats] = useState(null);

  const [formData, setFormData] = useState({
    ...initialFormData,
    targetRole: user?.targetRole || "Software Development Engineer",
  });

  const [filters, setFilters] = useState({
    search: "",
    companyType: "",
    priority: "",
    applicationStatus: "",
  });

  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState("");
  const [error, setError] = useState("");

  const fetchCompanies = async () => {
    try {
      setLoading(true);

      const activeFilters = Object.fromEntries(
        Object.entries(filters).filter(([, value]) => value)
      );

      const response = await getMyCompanyPrepsApi(activeFilters);

      setCompanies(response.data);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to fetch companies");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await getCompanyPrepStatsApi();
      setStats(response.data);
    } catch (error) {
      console.log("Company stats error:", error.response?.data || error);
    }
  };

  useEffect(() => {
    fetchCompanies();
    fetchStats();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCompanies();
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
      companyType: "",
      priority: "",
      applicationStatus: "",
    });
  };

  const convertCommaTextToArray = (text) => {
    return text
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  };

  const convertTasksToArray = (text) => {
    return text
      .split("\n")
      .map((task) => task.trim())
      .filter(Boolean)
      .map((task) => ({
        title: task,
        category: "other",
      }));
  };

  const handleCreateCompany = async (e) => {
    e.preventDefault();

    if (!formData.companyName.trim()) {
      setError("Company name is required");
      return;
    }

    const payload = {
      companyName: formData.companyName,
      targetRole: formData.targetRole,
      companyType: formData.companyType,
      priority: formData.priority,
      applicationStatus: formData.applicationStatus,
      preparationFocus: convertCommaTextToArray(formData.preparationFocus),
      tasks: convertTasksToArray(formData.tasks),
      notes: formData.notes,
    };

    try {
      setCreating(true);

      await createCompanyPrepApi(payload);

      setFormData({
        ...initialFormData,
        targetRole: user?.targetRole || "Software Development Engineer",
      });

      setShowForm(false);

      await fetchCompanies();
      await fetchStats();
    } catch (error) {
      setError(
        error.response?.data?.message || "Failed to create company tracker"
      );
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteCompany = async (companyId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this company preparation tracker?"
    );

    if (!confirmed) return;

    try {
      setDeletingId(companyId);

      await deleteCompanyPrepApi(companyId);

      setCompanies((prev) =>
        prev.filter((company) => company._id !== companyId)
      );

      await fetchStats();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete company");
    } finally {
      setDeletingId("");
    }
  };

  const getPriorityClass = (priority) => {
    if (priority === "high") return "bg-red-500/10 text-red-300";
    if (priority === "medium") return "bg-yellow-500/10 text-yellow-300";
    return "bg-green-500/10 text-green-300";
  };

  const getStatusClass = (status) => {
    if (status === "offered") return "bg-green-500/10 text-green-300";
    if (status === "interviewing") return "bg-blue-500/10 text-blue-300";
    if (status === "shortlisted") return "bg-purple-500/10 text-purple-300";
    if (status === "rejected") return "bg-red-500/10 text-red-300";
    if (status === "applied") return "bg-yellow-500/10 text-yellow-300";
    return "bg-slate-800 text-slate-400";
  };

  return (
    <AppLayout>
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-medium text-blue-400">Company-wise Preparation</p>
          <h1 className="mt-2 text-4xl font-bold">Target Company Tracker</h1>
          <p className="mt-2 text-slate-400">
            Track company-specific preparation, application status, tasks, and
            progress.
          </p>
        </div>

        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold hover:bg-blue-700"
        >
          <Plus size={18} />
          Add Company
        </button>
      </div>

      <section className="mb-6 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        <StatsCard
          title="Total Companies"
          value={stats?.totalCompanies || 0}
          subtitle="Tracked companies"
        />

        <StatsCard
          title="High Priority"
          value={stats?.highPriorityCompanies || 0}
          subtitle="Important targets"
        />

        <StatsCard
          title="Applied"
          value={stats?.appliedCompanies || 0}
          subtitle="Applications submitted"
        />

        <StatsCard
          title="Avg Progress"
          value={`${stats?.averageProgress || 0}%`}
          subtitle="Across companies"
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
              placeholder="Search Google, Amazon, SDE..."
              className="w-full rounded-xl border border-slate-700 bg-slate-950 py-3 pl-11 pr-4 outline-none focus:border-blue-500"
            />
          </div>

          <select
            name="companyType"
            value={filters.companyType}
            onChange={handleFilterChange}
            className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-blue-500"
          >
            <option value="">All Types</option>
            <option value="product">Product</option>
            <option value="service">Service</option>
            <option value="startup">Startup</option>
            <option value="fintech">Fintech</option>
            <option value="consulting">Consulting</option>
            <option value="other">Other</option>
          </select>

          <select
            name="priority"
            value={filters.priority}
            onChange={handleFilterChange}
            className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-blue-500"
          >
            <option value="">All Priority</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          <select
            name="applicationStatus"
            value={filters.applicationStatus}
            onChange={handleFilterChange}
            className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-blue-500"
          >
            <option value="">All Status</option>
            <option value="not_applied">Not Applied</option>
            <option value="applied">Applied</option>
            <option value="shortlisted">Shortlisted</option>
            <option value="interviewing">Interviewing</option>
            <option value="offered">Offered</option>
            <option value="rejected">Rejected</option>
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
            <h2 className="text-xl font-semibold">Add Target Company</h2>

            <button
              onClick={() => setShowForm(false)}
              className="rounded-xl bg-slate-800 p-2 text-slate-300 hover:bg-slate-700"
            >
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleCreateCompany} className="space-y-5">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <Input
                label="Company Name"
                name="companyName"
                value={formData.companyName}
                onChange={handleFormChange}
                placeholder="Google"
              />

              <Input
                label="Target Role"
                name="targetRole"
                value={formData.targetRole}
                onChange={handleFormChange}
                placeholder="Software Development Engineer"
              />
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              <Select
                label="Company Type"
                name="companyType"
                value={formData.companyType}
                onChange={handleFormChange}
                options={[
                  ["product", "Product"],
                  ["service", "Service"],
                  ["startup", "Startup"],
                  ["fintech", "Fintech"],
                  ["consulting", "Consulting"],
                  ["other", "Other"],
                ]}
              />

              <Select
                label="Priority"
                name="priority"
                value={formData.priority}
                onChange={handleFormChange}
                options={[
                  ["high", "High"],
                  ["medium", "Medium"],
                  ["low", "Low"],
                ]}
              />

              <Select
                label="Application Status"
                name="applicationStatus"
                value={formData.applicationStatus}
                onChange={handleFormChange}
                options={[
                  ["not_applied", "Not Applied"],
                  ["applied", "Applied"],
                  ["shortlisted", "Shortlisted"],
                  ["interviewing", "Interviewing"],
                  ["offered", "Offered"],
                  ["rejected", "Rejected"],
                ]}
              />
            </div>

            <Input
              label="Preparation Focus"
              name="preparationFocus"
              value={formData.preparationFocus}
              onChange={handleFormChange}
              placeholder="DSA, System Design, Projects, Aptitude"
            />

            <Textarea
              label="Tasks"
              name="tasks"
              value={formData.tasks}
              onChange={handleFormChange}
              placeholder={`Write one task per line:\nSolve 50 DSA problems\nRevise project explanation\nPractice mock interview`}
            />

            <Textarea
              label="Notes"
              name="notes"
              value={formData.notes}
              onChange={handleFormChange}
              placeholder="Important notes for this company..."
            />

            <button
              disabled={creating}
              className="rounded-xl bg-blue-600 px-6 py-3 font-semibold hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {creating ? "Creating..." : "Create Company Tracker"}
            </button>
          </form>
        </section>
      )}

      <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Company List</h2>
          <p className="text-sm text-slate-400">
            {companies.length} company{companies.length !== 1 ? "ies" : ""}
          </p>
        </div>

        {loading ? (
          <LoadingState
            title="Loading companies"
            message="Please wait while we fetch your company preparation trackers."
          />
        ) : companies.length === 0 ? (
          <EmptyState
            icon={Building2}
            title="No companies added yet"
            message="Add your first target company to track preparation, tasks, status, and progress."
            buttonText="Add First Company"
            onAction={() => setShowForm(true)}
          />
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {companies.map((company) => (
              <div
                key={company._id}
                className="rounded-2xl border border-slate-800 bg-slate-950 p-5"
              >
                <div className="mb-4 flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-semibold">
                      {company.companyName}
                    </h3>
                    <p className="mt-1 text-sm text-slate-400">
                      {company.targetRole}
                    </p>
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${getPriorityClass(
                      company.priority
                    )}`}
                  >
                    {company.priority}
                  </span>
                </div>

                <div className="mb-4 flex flex-wrap gap-2">
                  <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs capitalize text-blue-300">
                    {company.companyType}
                  </span>

                  <span
                    className={`rounded-full px-3 py-1 text-xs capitalize ${getStatusClass(
                      company.applicationStatus
                    )}`}
                  >
                    {company.applicationStatus.replace("_", " ")}
                  </span>
                </div>

                <p className="text-sm text-slate-400">
                  Progress:{" "}
                  <span className="text-slate-200">
                    {company.progressPercentage || 0}%
                  </span>
                </p>

                <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-800">
                  <div
                    className="h-full rounded-full bg-blue-600"
                    style={{
                      width: `${company.progressPercentage || 0}%`,
                    }}
                  />
                </div>

                <p className="mt-4 text-sm text-slate-500">
                  Tasks:{" "}
                  {company.tasks?.filter((task) => task.isCompleted).length || 0}
                  /{company.tasks?.length || 0} completed
                </p>

                {company.preparationFocus?.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {company.preparationFocus.slice(0, 4).map((focus) => (
                      <span
                        key={focus}
                        className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300"
                      >
                        {focus}
                      </span>
                    ))}
                  </div>
                )}

                <div className="mt-6 flex gap-3">
                  <Link
                    to={`/companies/${company._id}`}
                    className="flex-1 rounded-xl bg-blue-600 px-4 py-2 text-center text-sm font-semibold hover:bg-blue-700"
                  >
                    View
                  </Link>

                  <button
                    onClick={() => handleDeleteCompany(company._id)}
                    disabled={deletingId === company._id}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-500/30 px-4 py-2 text-sm text-red-300 hover:bg-red-500/10 disabled:opacity-60"
                  >
                    <Trash2 size={16} />
                    {deletingId === company._id ? "..." : "Delete"}
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

export default CompanyTracker;