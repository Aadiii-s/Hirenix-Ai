const DashboardCard = ({ title, value, subtitle, icon: Icon, status }) => {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-slate-400">{title}</p>
          <h2 className="mt-2 text-3xl font-bold text-white">{value}</h2>
          <p className="mt-2 text-xs text-slate-500">{subtitle}</p>
        </div>

        {Icon && (
          <div className="rounded-xl bg-blue-500/10 p-3 text-blue-300">
            <Icon size={22} />
          </div>
        )}
      </div>

      {status && (
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-800">
          <div
            className="h-full rounded-full bg-blue-600"
            style={{ width: `${status}%` }}
          />
        </div>
      )}
    </div>
  );
};

export default DashboardCard;