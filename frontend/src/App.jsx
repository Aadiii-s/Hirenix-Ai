function App() {
  return (
    <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6">
      <section className="max-w-4xl text-center">
        <div className="inline-flex items-center rounded-full border border-blue-400/30 bg-blue-500/10 px-4 py-2 text-sm font-medium text-blue-300 mb-6">
          Intelligent Placement Preparation Platform
        </div>

        <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
          Hirenix AI
        </h1>

        <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-3xl mx-auto">
          Prepare smarter for placements with AI-powered roadmaps, resume
          analysis, DSA tracking, mock interviews, aptitude practice, and
          placement readiness scoring.
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <button className="rounded-xl bg-blue-600 px-7 py-3 text-white font-semibold hover:bg-blue-700 transition">
            Start Preparation
          </button>

          <button className="rounded-xl border border-slate-600 px-7 py-3 text-slate-200 font-semibold hover:bg-slate-900 transition">
            Explore Features
          </button>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
            <h3 className="font-semibold text-lg mb-2">AI Roadmaps</h3>
            <p className="text-slate-400 text-sm">
              Get personalized placement plans based on your target role,
              company, and preparation level.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
            <h3 className="font-semibold text-lg mb-2">Resume Analyzer</h3>
            <p className="text-slate-400 text-sm">
              Analyze your resume with AI and improve ATS score, project
              bullets, and job relevance.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
            <h3 className="font-semibold text-lg mb-2">Mock Interviews</h3>
            <p className="text-slate-400 text-sm">
              Practice HR, technical, DSA, and project interviews with detailed
              AI feedback.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default App;