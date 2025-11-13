"use client";

import clsx from "clsx";
import { Slot } from "@radix-ui/react-slot";
import { ComponentProps, forwardRef, type Ref } from "react";

export interface ButtonProps extends ComponentProps<"button"> {
  variant?: "primary" | "secondary" | "ghost" | "outline" | "glass";
  size?: "md" | "lg" | "sm" | "icon";
  asChild?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", asChild, ...props }, ref) => {
    const base =
      "relative inline-flex items-center justify-center overflow-hidden rounded-full font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent";

    const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
      primary:
        "bg-gradient-to-r from-primary-500 via-primary-400 to-neon-pink text-white hover:shadow-soft-glow",
      secondary:
        "bg-surface/60 text-white hover:bg-surface/80 border border-surface/40",
      ghost:
        "bg-transparent text-foreground hover:bg-surface/50 border border-transparent",
      outline:
        "border border-primary-400/60 text-primary-100 hover:bg-primary-400/10",
      glass:
        "glass border border-glass-border text-neon-blue hover:border-primary-300/70",
    };

    const sizes: Record<NonNullable<ButtonProps["size"]>, string> = {
      sm: "px-4 py-2 text-sm",
      md: "px-5 py-2.5 text-sm",
      lg: "px-6 py-3 text-base",
      icon: "h-10 w-10",
    };

    const classes = clsx(base, variants[variant], sizes[size], className);

    if (asChild) {
      return (
        <Slot
          ref={ref as unknown as Ref<HTMLButtonElement>}
          className={classes}
          {...props}
        />
      );
    }

    return (
      <button
        ref={ref}
        type={props.type ?? "button"}
        className={classes}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
