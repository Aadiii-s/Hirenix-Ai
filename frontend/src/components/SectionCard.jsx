const SectionCard = ({
  children,
  title,
  description,
  icon: Icon,
  action,
  className = "",
}) => {
  return (
    <section
      className={`rounded-2xl border border-slate-800 bg-slate-900 p-6 ${className}`}
    >
      {(title || description || Icon || action) && (
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="flex items-start gap-3">
            {Icon && (
              <div className="rounded-xl bg-blue-500/10 p-3 text-blue-300">
                <Icon size={22} />
              </div>
            )}

            <div>
              {title && <h2 className="text-xl font-semibold">{title}</h2>}
              {description && (
                <p className="mt-1 text-sm text-slate-400">{description}</p>
              )}
            </div>
          </div>

          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}

      {children}
    </section>
  );
};

export default SectionCard;