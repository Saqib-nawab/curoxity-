const imgSafelyShield = "/safety_green.svg";
const imgIcon3 = "/review.svg";
const imgIcon4 = "/supervision.svg";
const imgIcon5 = "/leave.svg";
const imgIcon6 = "/safety.svg";

export default function SafetySection() {
  const safetyPoints = [
    {
      title: "Reviewed by regulators",
      description: "Independent ethics committees must approve every trial before it starts.",
      icon: imgIcon3,
    },
    {
      title: "Doctor supervision",
      description: "Medical professionals monitor your health at every visit throughout the trial.",
      icon: imgIcon4,
    },
    {
      title: "You can leave anytime",
      description: "If you change your mind or feel uncomfortable, you can stop participating—no questions asked.",
      icon: imgIcon5,
    },
    {
      title: "Safety reporting required",
      description: "All side effects and health changes must be reported and tracked by law.",
      icon: imgIcon6,
    }
  ];

  return (
    <section className="w-full max-w-[1780px] mx-auto px-[40px] md:px-[70px] py-16 md:py-24 relative z-20">
      <div className="bg-white/20 border border-white backdrop-blur-md rounded-[24px] p-4 md:p-8 lg:p-12 flex flex-col lg:flex-row gap-12 lg:gap-16 shadow-brand-primary/5">
        {/* Left Side */}
        <div className="flex-1 flex flex-col gap-8">
          <div className="bg-[#14b8a6]/20 self-start px-4 py-2 rounded-full flex items-center gap-2">
            <img src={imgSafelyShield} alt="" className="w-4 h-4" title="Safety First" />
            <span className="font-noto-sans text-[14px] font-regular text-[#14b8a6] uppercase tracking-widest">Safety First</span>
          </div>

          <div className="flex flex-col gap-6">
            <h2 className="font-outfit font-regular text-[48px] md:text-[56px] leading-tight text-text-primary">
              Are Clinical Trials Safe?
            </h2>
            <div className="flex flex-col gap-4">
              <p className="font-noto-sans text-[15px] md:text-[16px] text-text-secondary leading-relaxed">
                Yes—clinical trials follow strict safety rules. Before any trial begins, it's reviewed by independent ethics committees who make sure it's designed to protect patients.
              </p>
              <p className="font-noto-sans text-[15px] md:text-[16px] text-text-secondary leading-relaxed">
                Throughout the trial, doctors watch your health closely. If something doesn't feel right, you can stop participating at any time. You're always in control.
              </p>
            </div>
          </div>

          <div className="bg-[#14b8a6]/10 p-6 rounded-[20px]">
            <p className="font-noto-sans text-[14px] text-text-primary leading-relaxed">
              <span className="font-regular text-emerald-600 not-italic">Important:</span> No trial is 100% risk-free, but the safety measures in place are designed to protect you. Your medical team will explain all potential risks before you decide.
            </p>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex-1 grid grid-cols-1 gap-2 lg:gap-4">
          {safetyPoints.map((point, index) => (
            <div
              key={index}
              className="border border-white p-6 rounded-[16px] flex items-center gap-4 transition-all"
              style={{ background: 'radial-gradient(297.79% 119.9% at 100.9% 26.67%, rgba(138, 163, 239, 0.10) 0%, rgba(138, 163, 239, 0.00) 100%), rgba(255, 255, 255, 0.50)' }}
            >
              <div className="w-12 h-12 bg-brand-primary/20 rounded-xl flex items-center justify-center shrink-0 shadow-sm border border-white/50">
                <img src={point.icon} alt="" className="w-6 h-6 opacity-60" />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="font-outfit font-regular text-[18px] text-text-primary">{point.title}</h3>
                <p className="font-noto-sans text-[14px] text-text-secondary leading-relaxed">{point.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
