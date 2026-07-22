type Step = {
  label: string;
  state: 'done' | 'active' | 'pending';
};

export function ActivaProgressSteps({
  steps,
}: {
  steps: Step[];
}) {
  return (
    <ol className="flex items-center gap-3">
      {steps.map((step, index) => {
        const tone =
          step.state === 'done'
            ? 'bg-[#0E6F6B] text-white'
            : step.state === 'active'
              ? 'bg-[#F5B11A] text-[#1A1D21]'
              : 'bg-zinc-300 text-zinc-600';

        return (
          <li
            key={`${step.label}-${index}`}
            className="flex min-w-0 flex-1 items-center gap-3"
          >
            <span
              className={`grid h-9 w-9 shrink-0 place-items-center rounded-full text-sm font-black ${tone}`}
            >
              {index + 1}
            </span>

            <span className="min-w-0 text-sm font-semibold">
              {step.label}
            </span>

            {index < steps.length - 1 && (
              <span
                aria-hidden="true"
                className="h-1 min-w-6 flex-1 rounded-full bg-zinc-300"
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
