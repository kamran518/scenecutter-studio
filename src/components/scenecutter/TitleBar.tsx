import { Scissors } from "lucide-react";

type Props = { step: 1 | 2; compact: boolean };

export function TitleBar({ step, compact }: Props) {
  const steps = ["Movie & Timestamps", "Clips & Export"];
  if (compact) {
    return (
      <header className="sticky top-0 z-20 border-b border-border bg-card/90 px-4 pb-3 pt-3 backdrop-blur">
        <div className="flex items-center gap-2">
          <div className="grid h-7 w-7 place-items-center rounded-lg bg-foreground text-background">
            <Scissors className="h-3.5 w-3.5" />
          </div>
          <span className="text-[15px] font-semibold tracking-tight">SceneCutter Pro</span>
          <span className="ml-auto text-xs text-muted-foreground">Step {step} of 2</span>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-1.5">
          {steps.map((_, i) => (
            <div key={i} className={`h-1 rounded-full ${i < step ? "bg-primary" : "bg-border"}`} />
          ))}
        </div>
      </header>
    );
  }
  return (
    <header className="flex h-12 items-center border-b border-border bg-chrome px-4">
      <div className="flex w-40 gap-2" aria-hidden>
        <span className="h-3 w-3 rounded-full bg-destructive/80" />
        <span className="h-3 w-3 rounded-full bg-warning/90" />
        <span className="h-3 w-3 rounded-full bg-success/80" />
      </div>
      <div className="flex flex-1 items-center justify-center gap-2 text-[13px]">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            {i > 0 && <span className="h-px w-6 bg-border" />}
            <span
              className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 ${
                i + 1 === step ? "bg-card font-medium text-foreground shadow-soft" : "text-muted-foreground"
              }`}
            >
              <span
                className={`grid h-4 w-4 place-items-center rounded-full text-[10px] ${
                  i + 1 <= step ? "bg-primary text-primary-foreground" : "bg-border text-muted-foreground"
                }`}
              >
                {i + 1}
              </span>
              {s}
            </span>
          </div>
        ))}
      </div>
      <div className="flex w-40 items-center justify-end gap-1.5 text-[13px] font-medium text-muted-foreground">
        <Scissors className="h-3.5 w-3.5" /> SceneCutter Pro
      </div>
    </header>
  );
}
