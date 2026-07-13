import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  maxLength?: number;
  showCount?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, maxLength, showCount, id, value, ...props }, ref) => {
    const textareaId = id || React.useId();
    const [charCount, setCharCount] = React.useState(
      typeof value === "string" ? value.length : 0
    );

    const handleChange: React.ChangeEventHandler<HTMLTextAreaElement> = React.useCallback(
      (e) => {
        setCharCount(e.target.value.length);
        props.onChange?.(e);
      },
      [props.onChange]
    );

    React.useEffect(() => {
      if (typeof value === "string") {
        setCharCount(value.length);
      }
    }, [value]);

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={textareaId}
            className="mb-1.5 block text-sm font-medium text-slate-700"
          >
            {label}
          </label>
        )}
        <textarea
          id={textareaId}
          className={cn(
            "flex min-h-[80px] w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm transition-all duration-200",
            "placeholder:text-slate-400",
            "focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20",
            "disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-danger-500 focus:border-danger-500 focus:ring-danger-500/20",
            className
          )}
          ref={ref}
          value={value}
          maxLength={maxLength}
          onChange={handleChange}
          {...props}
        />
        <div className="mt-1 flex items-center justify-between">
          {error && <p className="text-xs text-danger-500">{error}</p>}
          {showCount && maxLength && (
            <p className={cn(
              "ml-auto text-xs",
              charCount >= maxLength ? "text-danger-500" : "text-slate-400"
            )}>
              {charCount}/{maxLength}
            </p>
          )}
        </div>
      </div>
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
