export default function ClinicalTrialInfo() {
  const steps = [
    {
      title: "Research Study",
      description: "Clinical trials are research studies that test new treatments in a safe, controlled way. Every step is planned and monitored by medical experts.",
      bg: "bg-brand-primary/10",
    },
    {
        title: "Volunteer Participation",
        description: "You choose whether to join. There's no pressure, and you can leave at any time if you change your mind. It's always your decision.",
        bg: "bg-[#45b680]/10",
    },
    {
        title: "Medical Supervision",
        description: "Doctors and nurses monitor your health closely throughout the trial. You get regular check-ups and immediate support if anything comes up.",
        bg: "bg-brand-primary/10",
    }
  ];

  return (
    <section className="w-full max-w-[1780px] mx-auto px-[40px] md:px-[70px] py-16 lg:py-24 flex flex-col items-center gap-12 md:gap-16 relative z-20">
      <div className="text-center flex flex-col gap-2 md:gap-4">
        <h2 className="font-outfit font-regular text-[24px] md:text-[32px] leading-tight text-text-primary">
            What is a Clinical Trial?
        </h2>
        <p className="font-noto-sans text-[15px] md:text-[16px] leading-relaxed text-text-secondary">
            Let's break it down into three simple parts.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 xl:gap-6 w-full">
        {steps.map((step, index) => (
          <div 
            key={index} 
            className={`${step.bg} border border-white backdrop-blur-md rounded-[24px] p-6 lg:p-8 flex flex-col gap-4 lg:gap-6 transition-all duration-300 group min-h-[220px] justify-center`}
          >
            <div className="flex flex-col gap-2">
                <p className="font-noto-sans text-[13px] text-text-secondary font-regular uppercase tracking-wider">Step {index + 1}</p>
                <div className="flex items-center justify-between">
                    <h3 className="font-outfit font-regular text-[20px] lg:text-[22px] leading-tight text-text-primary">{step.title}</h3>
                </div>
            </div>
            <p className="font-noto-sans text-[15px] leading-relaxed text-text-secondary">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
