import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
    ArrowLeft,
    CheckCircle2,
    FileText,
    Lightbulb,
    Target,
    XCircle,
} from "lucide-react";

import MobileHeader from "../components/MobileHeader";
import Sidebar from "../components/Sidebar";
import { getResumeAnalysisByIdApi } from "../api/resume.api";

const ResumeAnalysisDetails = () => {
    const { id } = useParams();

    const [analysis, setAnalysis] = useState(null);
    const [activeTab, setActiveTab] = useState("overview");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchAnalysis = async () => {
        try {
            setLoading(true);

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

    const getScoreColor = (score) => {
        if (score >= 80) return "text-green-300";
        if (score >= 60) return "text-yellow-300";
        return "text-red-300";
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 text-white lg:flex">
                <Sidebar />

                <div className="lg:hidden">
                    <MobileHeader />
                </div>

                <main className="flex-1 px-6 py-6 lg:px-8">
                    <div className="mx-auto max-w-7xl rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center text-slate-400">
                        Loading resume analysis...
                    </div>
                </main>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-slate-950 text-white lg:flex">
                <Sidebar />

                <div className="lg:hidden">
                    <MobileHeader />
                </div>

                <main className="flex-1 px-6 py-6 lg:px-8">
                    <div className="mx-auto max-w-7xl rounded-2xl border border-red-500/30 bg-red-500/10 p-8 text-red-300">
                        <p>{error}</p>

                        <Link
                            to="/resume-analyses"
                            className="mt-5 inline-block rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
                        >
                            Back to Resume History
                        </Link>
                    </div>
                </main>
            </div>
        );
    }

    if (!analysis) return null;

    return (
        <div className="min-h-screen bg-slate-950 text-white lg:flex">
            <Sidebar />

            <div className="lg:hidden">
                <MobileHeader />
            </div>

            <main className="flex-1 px-6 py-6 lg:px-8">
                <div className="mx-auto max-w-7xl">
                    <div className="mb-8">
                        <Link
                            to="/resume-analyses"
                            className="mb-5 inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white"
                        >
                            <ArrowLeft size={16} />
                            Back to resume history
                        </Link>

                        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
                            <p className="text-blue-400 font-medium">Resume Analysis</p>

                            <h1 className="mt-2 text-3xl font-bold md:text-4xl">
                                {analysis.originalFileName}
                            </h1>

                            <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
                                <div className="rounded-xl bg-slate-950 p-4">
                                    <p className="text-xs text-slate-500">ATS Score</p>
                                    <p
                                        className={`mt-1 text-3xl font-bold ${getScoreColor(
                                            analysis.atsScore
                                        )}`}
                                    >
                                        {analysis.atsScore}/100
                                    </p>

                                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-800">
                                        <div
                                            className="h-full rounded-full bg-blue-600"
                                            style={{ width: `${analysis.atsScore || 0}%` }}
                                        />
                                    </div>
                                </div>

                                <div className="rounded-xl bg-slate-950 p-4">
                                    <p className="text-xs text-slate-500">Target Role</p>
                                    <p className="mt-1 font-semibold">
                                        {analysis.targetRole || "Software Developer"}
                                    </p>
                                </div>

                                <div className="rounded-xl bg-slate-950 p-4">
                                    <p className="text-xs text-slate-500">Analyzed On</p>
                                    <p className="mt-1 font-semibold">
                                        {new Date(analysis.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>

                            <p className="mt-5 text-slate-300">
                                {analysis.summary}
                            </p>
                        </div>
                    </div>

                    <section className="mb-6 grid grid-cols-1 gap-5 md:grid-cols-4">
                        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
                            <CheckCircle2 className="mb-3 text-green-300" size={24} />
                            <p className="text-sm text-slate-400">Strengths</p>
                            <p className="mt-1 text-3xl font-bold">
                                {analysis.strengths?.length || 0}
                            </p>
                        </div>

                        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
                            <XCircle className="mb-3 text-red-300" size={24} />
                            <p className="text-sm text-slate-400">Weaknesses</p>
                            <p className="mt-1 text-3xl font-bold">
                                {analysis.weaknesses?.length || 0}
                            </p>
                        </div>

                        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
                            <Target className="mb-3 text-yellow-300" size={24} />
                            <p className="text-sm text-slate-400">Missing Keywords</p>
                            <p className="mt-1 text-3xl font-bold">
                                {analysis.missingKeywords?.length || 0}
                            </p>
                        </div>

                        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
                            <Lightbulb className="mb-3 text-blue-300" size={24} />
                            <p className="text-sm text-slate-400">Improved Bullets</p>
                            <button onClick={() => navigator.clipboard.writeText(bullet)}>
                                Copy
                            </button>
                            <p className="mt-1 text-3xl font-bold">
                                {analysis.improvedBullets?.length || 0}
                            </p>
                        </div>
                    </section>

                    <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
                        <div className="mb-6 flex flex-wrap gap-3">
                            {[
                                ["overview", "Overview"],
                                ["keywords", "Keywords"],
                                ["bullets", "Improved Bullets"],
                                ["suggestions", "Suggestions"],
                            ].map(([key, label]) => (
                                <button
                                    key={key}
                                    onClick={() => setActiveTab(key)}
                                    className={`rounded-xl px-4 py-2 text-sm font-semibold, cursor-pointer ${activeTab === key
                                            ? "bg-blue-600 text-white"
                                            : "bg-slate-950 text-slate-400"
                                        }`}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>

                        {activeTab === "overview" && (
                            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                                <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
                                    <h3 className="mb-4 flex items-center gap-2 text-xl font-semibold">
                                        <CheckCircle2 className="text-green-300" size={22} />
                                        Strengths
                                    </h3>

                                    <ul className="space-y-3">
                                        {analysis.strengths?.map((item, index) => (
                                            <li
                                                key={index}
                                                className="rounded-xl bg-slate-900 px-4 py-3 text-sm text-slate-300"
                                            >
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
                                    <h3 className="mb-4 flex items-center gap-2 text-xl font-semibold">
                                        <XCircle className="text-red-300" size={22} />
                                        Weaknesses
                                    </h3>

                                    <ul className="space-y-3">
                                        {analysis.weaknesses?.map((item, index) => (
                                            <li
                                                key={index}
                                                className="rounded-xl bg-slate-900 px-4 py-3 text-sm text-slate-300"
                                            >
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        )}

                        {activeTab === "keywords" && (
                            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
                                <h3 className="mb-4 text-xl font-semibold">
                                    Missing Keywords
                                </h3>

                                {analysis.missingKeywords?.length > 0 ? (
                                    <div className="flex flex-wrap gap-2">
                                        {analysis.missingKeywords.map((keyword) => (
                                            <span
                                                key={keyword}
                                                className="rounded-full bg-yellow-500/10 px-3 py-1 text-sm text-yellow-300"
                                            >
                                                {keyword}
                                            </span>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-slate-400">
                                        No missing keywords found.
                                    </p>
                                )}
                            </div>
                        )}

                        {activeTab === "bullets" && (
                            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
                                <h3 className="mb-4 text-xl font-semibold">
                                    Improved Resume Bullets
                                </h3>

                                <ul className="space-y-3">
                                    {analysis.improvedBullets?.map((bullet, index) => (
                                        <li
                                            key={index}
                                            className="rounded-xl bg-slate-900 px-4 py-3 text-sm text-slate-300"
                                        >
                                            {bullet}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {activeTab === "suggestions" && (
                            <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
                                <SuggestionBox
                                    title="Project Suggestions"
                                    items={analysis.projectSuggestions}
                                />

                                <SuggestionBox
                                    title="Skills Suggestions"
                                    items={analysis.skillsSuggestions}
                                />

                                <SuggestionBox
                                    title="Final Suggestions"
                                    items={analysis.finalSuggestions}
                                />
                            </div>
                        )}
                    </section>
                </div>
            </main>
        </div>
    );
};

const SuggestionBox = ({ title, items = [] }) => {
    return (
        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
            <h3 className="mb-4 text-xl font-semibold">{title}</h3>

            {items?.length > 0 ? (
                <ul className="space-y-3">
                    {items.map((item, index) => (
                        <li
                            key={index}
                            className="rounded-xl bg-slate-900 px-4 py-3 text-sm text-slate-300"
                        >
                            {item}
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-sm text-slate-400">No suggestions available.</p>
            )}
        </div>
    );
};

export default ResumeAnalysisDetails;