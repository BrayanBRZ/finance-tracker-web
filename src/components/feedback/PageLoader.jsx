import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function PageLoader() {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "relative flex w-full items-center justify-center -m-3 min-h-[calc(100dvh-3rem)] sm:-m-4 sm:w-[calc(100%+2rem)] md:-m-6 md:w-[calc(100%+3rem)]",
      )}
    >
      <Loader2
        className="size-10 animate-spin text-primary"
        aria-hidden="true"
      />
    </div>
  );
}
