import { Link } from "react-router-dom";
import { useThemeContext } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumb?: { label: string; href: string }[];
  action?: {
    label: string;
    href: string;
    icon?: React.ComponentType<{ className?: string }>;
  };
  gradient?: boolean;
}

export default function PageHeader({
  title,
  subtitle,
  breadcrumb,
  action,
  gradient = false,
}: PageHeaderProps) {
  const { isDark } = useThemeContext();

  return (
    <div className="mb-8">
      {/* Breadcrumb */}
      {breadcrumb && breadcrumb.length > 0 && (
        <nav className="mb-3 flex items-center gap-1.5 text-sm">
          {breadcrumb.map((crumb, idx) => (
            <span key={crumb.href} className="flex items-center gap-1.5">
              <Link
                to={crumb.href}
                className={cn(
                  "transition-colors hover:text-primary-600",
                  isDark ? "text-slate-400" : "text-slate-500"
                )}
              >
                {crumb.label}
              </Link>
              {idx < breadcrumb.length - 1 && (
                <span className={isDark ? "text-slate-600" : "text-slate-300"}>/</span>
              )}
            </span>
          ))}
        </nav>
      )}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1
            className={cn(
              "text-2xl font-bold tracking-tight sm:text-3xl",
              gradient
                ? "text-gradient"
                : isDark
                  ? "text-white"
                  : "text-slate-900"
            )}
          >
            {title}
          </h1>
          {subtitle && (
            <p className={cn("mt-1 text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
              {subtitle}
            </p>
          )}
        </div>

        {action && (
          <Link
            to={action.href}
            className="btn-primary inline-flex items-center gap-2 !text-sm"
          >
            {action.icon && <action.icon className="h-4 w-4" />}
            {action.label}
          </Link>
        )}
      </div>
    </div>
  );
}
