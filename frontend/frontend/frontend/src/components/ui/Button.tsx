import { forwardRef, ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {

  variant?:
    | "primary"
    | "secondary"
    | "outline"
    | "ghost"
    | "danger";

  size?:
    | "sm"
    | "md"
    | "lg"
    | "icon";

  isLoading?: boolean;
}

const Button = forwardRef<
  HTMLButtonElement,
  ButtonProps
>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading,
      disabled,
      children,
      ...props
    },
    ref
  ) => {

    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg";

    const variants = {

      primary:
        "bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500",

      secondary:
        "bg-dark-700 text-white hover:bg-dark-600 focus:ring-dark-500",

      outline:
        "border border-dark-600 text-dark-200 hover:bg-dark-800 focus:ring-dark-500",

      ghost:
        "text-dark-300 hover:bg-dark-800 hover:text-white focus:ring-dark-500",

      danger:
        "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
    };

    const sizes = {

      sm:
        "px-3 py-1.5 text-sm",

      md:
        "px-4 py-2 text-sm",

      lg:
        "px-6 py-3 text-base",

      icon:
        "h-9 w-9 p-0",
    };

    return (

      <button
        ref={ref}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          className
        )}
        disabled={
          disabled || isLoading
        }
        {...props}
      >

        {isLoading && (

          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        )}

        {children}

      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };