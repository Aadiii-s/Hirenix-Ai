import { PlusCircle } from "lucide-react";
import { Link } from "react-router-dom";

const EmptyState = ({
  icon: Icon = PlusCircle,
  title = "No data found",
  message = "There is nothing to show yet.",
  buttonText,
  buttonPath,
  onAction,
}) => {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-10 text-center">
      <div className="mx-auto mb-5 w-fit rounded-2xl bg-blue-500/10 p-4 text-blue-300">
        <Icon size={38} />
      </div>

      <h2 className="text-2xl font-bold text-white">{title}</h2>

      <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-400">
        {message}
      </p>

      {buttonPath && buttonText && (
        <Link
          to={buttonPath}
          className="mt-6 inline-block rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
        >
          {buttonText}
        </Link>
      )}

      {!buttonPath && buttonText && onAction && (
        <button
          onClick={onAction}
          className="mt-6 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
        >
          {buttonText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;