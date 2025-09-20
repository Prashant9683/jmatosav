import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "default",
      size = "default",
      asChild = false,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        className={cn(
          "inline-flex items-center justify-center rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-600 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ring-offset-white",
          {
            // Primary: Gray background, white text
            "bg-gray-700 text-white hover:bg-gray-800 hover:shadow-lg":
              variant === "default",
            // Outline: White background, gray text and border
            "border border-gray-600 bg-white text-gray-700 hover:bg-gray-50 hover:shadow-md":
              variant === "outline",
            // Ghost: Transparent background, gray text on hover
            "text-black hover:bg-gray-50 hover:text-gray-600":
              variant === "ghost",
          },
          {
            "h-10 py-2 px-4": size === "default",
            "h-9 px-3 rounded-md": size === "sm",
            "h-11 px-8 rounded-md": size === "lg",
          },
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
