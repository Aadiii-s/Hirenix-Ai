import { CheckCircle2 } from "lucide-react";

const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon = CheckCircle2,
  tone = "blue",
}) => {
  const toneClass =
    tone === "green"
      ? "bg-green-500/10 text-green-300"
      : tone === "red"
      ? "bg-red-500/10 text-red-300"
      : tone === "yellow"
      ? "bg-yellow-500/10 text-yellow-300"
      : tone === "purple"
      ? "bg-purple-500/10 text-purple-300"
      : "bg-blue-500/10 text-blue-300";

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
      <div className={`mb-3 w-fit rounded-xl p-3 ${toneClass}`}>
        <Icon size={22} />
      </div>

      <p className="text-sm text-slate-400">{title}</p>
      <h2 className="mt-2 text-3xl font-bold">{value}</h2>

      {subtitle && <p className="mt-2 text-xs text-slate-500">{subtitle}</p>}
    </div>
  );
};

export default StatCard;