import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  Circle,
  Save,
} from "lucide-react";

import {
  getCompanyPrepByIdApi,
  toggleCompanyTaskApi,
  updateCompanyPrepApi,
} from "../api/company.api";
import MobileHeader from "../components/MobileHeader";
import Sidebar from "../components/Sidebar";

const CompanyDetails = () => {
  const { id } = useParams();

  const [company, setCompany] = useState(null);
  const [editData, setEditData] = useState({
    priority: "medium",
    applicationStatus: "not_applied",
    notes: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [togglingTaskId, setTogglingTaskId] = useState("");
  const [error, setError] = useState("");

  const fetchCompany = async () => {
    try {
      setLoading(true);

      const response = await getCompanyPrepByIdApi(id);

      setCompany(response.data);

      setEditData({
        priority: response.data.priority || "medium",
        applicationStatus: response.data.applicationStatus || "not_applied",
        notes: response.data.notes || "",
      });
    } catch (error) {
      setError(error.response?.data?.message || "Failed to fetch company");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompany();
  }, [id]);

  const handleEditChange = (e) => {
    setEditData({
      ...editData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      const response = await updateCompanyPrepApi(id, editData);

      setCompany(response.data);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update company");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleTask = async (taskId) => {
    try {
      setTogglingTaskId(taskId);

      const response = await toggleCompanyTaskApi(id, taskId);

      setCompany(response.data);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update task");
    } finally {
      setTogglingTaskId("");
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center text-slate-400">
          Loading company preparation...
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
            to="/companies"
            className="mt-5 inline-block rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Back to Companies
          </Link>
        </div>
      </Layout>
    );
  }

  if (!company) return null;

  const completedTasks =
    company.tasks?.filter((task) => task.isCompleted).length || 0;

  return (
    <Layout>
      <div className="mb-8">
        <Link
          to="/companies"
          className="mb-5 inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white"
        >
          <ArrowLeft size={16} />
          Back to companies
        </Link>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-blue-500/10 p-4 text-blue-300">
              <Building2 size={28} />
            </div>

            <div>
              <p className="font-medium text-blue-400">
                Company Preparation
              </p>
              <h1 className="text-4xl font-bold">{company.companyName}</h1>
            </div>
          </div>

          <p className="mt-4 text-slate-400">{company.targetRole}</p>

          <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-4">
            <InfoBox label="Type" value={company.companyType} />
            <InfoBox label="Priority" value={company.priority} />
            <InfoBox label="Status" value={company.applicationStatus} />
            <InfoBox
              label="Tasks"
              value={`${completedTasks}/${company.tasks?.length || 0}`}
            />
          </div>

          <div className="mt-6">
            <div className="mb-2 flex justify-between text-sm">
              <span className="text-slate-400">Preparation Progress</span>
              <span className="text-slate-300">
                {company.progressPercentage || 0}%
              </span>
            </div>

            <div className="h-3 overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-blue-600"
                style={{ width: `${company.progressPercentage || 0}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 xl:col-span-2">
          <h2 className="mb-5 text-xl font-semibold">Preparation Tasks</h2>

          {company.tasks?.length > 0 ? (
            <div className="space-y-3">
              {company.tasks.map((task) => (
                <button
                  key={task._id}
                  onClick={() => handleToggleTask(task._id)}
                  disabled={togglingTaskId === task._id}
                  className="flex w-full items-start gap-3 rounded-2xl border border-slate-800 bg-slate-950 p-4 text-left hover:border-blue-500/50 disabled:opacity-70"
                >
                  {task.isCompleted ? (
                    <CheckCircle2 className="mt-1 shrink-0 text-green-300" />
                  ) : (
                    <Circle className="mt-1 shrink-0 text-slate-500" />
                  )}

                  <div>
                    <h3
                      className={`font-semibold ${
                        task.isCompleted
                          ? "text-slate-500 line-through"
                          : "text-slate-200"
                      }`}
                    >
                      {task.title}
                    </h3>

                    <p className="mt-1 text-sm capitalize text-slate-500">
                      {task.category}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="rounded-xl bg-slate-950 p-8 text-center text-slate-400">
              No tasks added for this company.
            </div>
          )}
        </div>

        <aside className="space-y-5">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="mb-5 text-xl font-semibold">Update Status</h2>

            <div className="space-y-4">
              <Select
                label="Priority"
                name="priority"
                value={editData.priority}
                onChange={handleEditChange}
                options={[
                  ["high", "High"],
                  ["medium", "Medium"],
                  ["low", "Low"],
                ]}
              />

              <Select
                label="Application Status"
                name="applicationStatus"
                value={editData.applicationStatus}
                onChange={handleEditChange}
                options={[
                  ["not_applied", "Not Applied"],
                  ["applied", "Applied"],
                  ["shortlisted", "Shortlisted"],
                  ["interviewing", "Interviewing"],
                  ["offered", "Offered"],
                  ["rejected", "Rejected"],
                ]}
              />

              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Notes
                </label>
                <textarea
                  name="notes"
                  value={editData.notes}
                  onChange={handleEditChange}
                  rows={5}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
                />
              </div>

              <button
                onClick={handleSave}
                disabled={saving}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold hover:bg-blue-700 disabled:opacity-70"
              >
                <Save size={18} />
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="mb-4 text-xl font-semibold">Preparation Focus</h2>

            <div className="flex flex-wrap gap-2">
              {company.preparationFocus?.length > 0 ? (
                company.preparationFocus.map((focus) => (
                  <span
                    key={focus}
                    className="rounded-full bg-blue-500/10 px-3 py-1 text-sm text-blue-300"
                  >
                    {focus}
                  </span>
                ))
              ) : (
                <p className="text-sm text-slate-400">No focus added.</p>
              )}
            </div>
          </div>
        </aside>
      </section>
    </Layout>
  );
};

const Layout = ({ children }) => {
  return (
    <div className="h-screen overflow-hidden bg-slate-950 text-white lg:flex">
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
        <div className="mx-auto max-w-7xl">{children}</div>
      </main>
    </div>
  );
};

const InfoBox = ({ label, value }) => {
  return (
    <div className="rounded-xl bg-slate-950 p-4">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 font-semibold capitalize">
        {String(value).replace("_", " ")}
      </p>
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

export default CompanyDetails;