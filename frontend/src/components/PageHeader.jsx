import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const PageHeader = ({
  eyebrow,
  title,
  description,
  icon: Icon,
  backPath = "/dashboard",
  backLabel = "Back to dashboard",
  action,
}) => {
  return (
    <div className="mb-8">
      {backPath && (
        <Link
          to={backPath}
          className="mb-5 inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white"
        >
          <ArrowLeft size={16} />
          {backLabel}
        </Link>
      )}

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-3">
            {Icon && (
              <div className="rounded-2xl bg-blue-500/10 p-4 text-blue-300">
                <Icon size={30} />
              </div>
            )}

            <div>
              {eyebrow && (
                <p className="font-medium text-blue-400">{eyebrow}</p>
              )}

              <h1 className="text-4xl font-bold">{title}</h1>
            </div>
          </div>

          {description && (
            <p className="mt-4 max-w-3xl text-slate-400">{description}</p>
          )}
        </div>

        {action && <div className="shrink-0">{action}</div>}
      </div>
    </div>
  );
};

export default PageHeader;