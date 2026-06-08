import { Loader2, Sparkles } from "lucide-react";

const AiActionLoader = ({
  title = "AI is working",
  message = "Please wait. This may take a few seconds.",
}) => {
  return (
    <div className="mb-6 rounded-2xl border border-blue-500/30 bg-blue-500/10 p-5">
      <div className="flex items-start gap-3">
        <div className="rounded-xl bg-blue-500/10 p-3 text-blue-300">
          <Loader2 size={22} className="animate-spin" />
        </div>

        <div>
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-blue-300" />
            <h3 className="font-semibold text-blue-200">{title}</h3>
          </div>

          <p className="mt-1 text-sm leading-6 text-blue-100/70">
            {message}
          </p>

          <p className="mt-3 text-xs text-blue-100/50">
            Please do not refresh or click again. No fake result will be saved if
            AI fails.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AiActionLoader;