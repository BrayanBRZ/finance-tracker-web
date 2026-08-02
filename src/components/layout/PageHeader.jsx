import { cn } from "@/lib/utils";

export function PageHeader({ title, description, className }) {
  return (
    <div className={cn(className)}>
      <h1 className="text-3xl font-bold">{title}</h1>
      <p className="mt-2 text-muted-foreground">{description}</p>
    </div>
  );
}
