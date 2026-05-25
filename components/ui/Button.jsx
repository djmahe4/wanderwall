"use client";

export default function Button({
  children,
  className = "",
  variant = "primary",
  ...props
}) {
  const base =
    "inline-flex items-center justify-center rounded-full px-5 py-2 text-sm font-semibold transition";
  const variants = {
    primary: "bg-teal text-white hover:bg-teal/90",
    secondary: "bg-charcoal text-cream hover:bg-charcoal/90",
    ghost: "bg-transparent text-charcoal hover:bg-cream/80",
    outline:
      "border border-charcoal/20 text-charcoal hover:border-charcoal/50 hover:bg-cream/80",
  };

  return (
    <button
      className={`${base} ${variants[variant] ?? variants.primary} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
