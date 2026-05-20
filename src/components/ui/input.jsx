import * as React from "react"

import { cn } from "@/lib/utils"

function Input({
  className,
  type,
  ...props
}) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-13 w-full min-w-0 rounded-lg border border-zinc-500 bg-transparent px-3 py-2 text-base text-zinc-950 transition-colors shadow-sm outline-none placeholder:text-zinc-500 autofill:bg-black",
        "focus-visible:ring-0 focus-visible:border-3 focus-visible:border-blue-900",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "aria-invalid:border-red-500 aria-invalid:focus-visible:border-red-500",
        className
      )}
      {...props} />
  );
}

export { Input }
