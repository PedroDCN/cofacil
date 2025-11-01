import { useApp } from "@/contexts/appContext";
import { cn } from "@/lib/utils";

export default function ChartContainer({ className, children }: any) {
  const { printMode } = useApp();
  return (
    <div
      className={cn(
        printMode ? "" : "w-full h-full flex items-center justify-center",
        className
      )}
    >
      <article
        className={`relative flex flex-col justify-center items-center gap-3
          h-full w-full p-2
          border border-slate-300/80 bg-white shadow-sm
          min-w-[300px] max-w-[450px] min-h-[300px] max-h-[350px]`}
      >
        {children}
      </article>
    </div>
  );
}
