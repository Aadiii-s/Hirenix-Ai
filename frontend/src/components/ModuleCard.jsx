const ModuleCard = ({
  title,
  description,
  icon: Icon,
  status,
  buttonText = "Start Module",
  locked = true,
}) => {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 transition hover:border-slate-700">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div className="rounded-xl bg-blue-500/10 p-3 text-blue-300">
          {Icon && <Icon size={22} />}
        </div>

        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            status === "Ready"
              ? "bg-green-500/10 text-green-300"
              : "bg-slate-800 text-slate-400"
          }`}
        >
          {status}
        </span>
      </div>

      <h3 className="text-lg font-semibold text-white">{title}</h3>

      <p className="mt-2 text-sm leading-6 text-slate-400">{description}</p>

      {locked ? (
        <button
          disabled
          className="mt-5 cursor-not-allowed rounded-xl border border-slate-800 px-4 py-2 text-sm text-slate-500"
        >
          Locked
        </button>
      ) : (
        <button className="mt-5 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
          {buttonText}
        </button>
      )}
    </div>
  );
};

export default ModuleCard;