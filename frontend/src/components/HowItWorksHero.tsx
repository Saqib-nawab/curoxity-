
const imgSolarArrowUpOutline = "/arrow_up.svg";
const imgFluentPerson12Filled = "/share-condition.svg";
const imgFrame40 = "/Logo_gradient.svg";
const imgHealthiconsClinicalA = "/phase_gradient.svg";
const imgBasilAddSolid = "/explore.svg";
const imgHoriLines = "/hori lines.svg";
const imgVertiLines = "/verti lines.svg";

export default function HowItWorksHero() {
  return (
    <section className="relative w-full overflow-hidden flex flex-col items-center bg-[#f1f4fb]">
      {/* Background Frame */}
      <div className="absolute top-[20px] left-[20px] right-[20px] bottom-[20px] z-0 rounded-[24px] bg-white/30 border border-white pointer-events-none"></div>

      {/* Background Grid */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-30">
        <div className="absolute inset-0" style={{ backgroundImage: `url('${imgHoriLines}')`, backgroundSize: '20px 20px' }}></div>
        <div className="absolute inset-0" style={{ backgroundImage: `url('${imgVertiLines}')`, backgroundSize: '20px 20px' }}></div>
      </div>

      {/* Content */}
      <div className="relative min-h-screen z-10 w-full max-w-[1780px] mx-auto px-6 flex flex-col items-center text-center justify-center gap-10 md:gap-12">
        <div className="flex flex-col gap-4 md:gap-6 items-center">
          <h1 className="font-outfit font-regular text-[28px] md:text-[36px] text-text-primary tracking-tight leading-tight">
            How clinEvidence Helps You Discover the Right Clinical Trials
          </h1>
          <p className="font-noto-sans text-[16px] md:text-[20px] text-text-secondary max-w-4xl leading-relaxed">
            Victreat simplifies the process of finding clinical trials by helping you search research studies, understand eligibility, and explore participation opportunities.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <button className="bg-brand-primary text-white px-8 py-3.5 rounded-full font-medium flex items-center gap-3 hover:bg-brand-primary/90 transition-all shadow-lg shadow-brand-primary/25 cursor-pointer">
            Start Exploring Trials
            <div className="bg-white rounded-full p-1.5 flex items-center justify-center">
              <img src={imgSolarArrowUpOutline} alt="" className="w-3.5 h-3.5 rotate-45" />
            </div>
          </button>
          <button className="bg-white/40 border border-brand-primary/20 text-brand-primary px-8 py-3.5 rounded-full font-medium hover:bg-white/60 transition-all cursor-pointer backdrop-blur-sm">
            Browse Trials
          </button>
        </div>

        {/* Diagram */}
        <div className="w-full mt-10 md:mt-12 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-4 max-w-[1100px]">
          {/* Patient */}
          <div className="flex flex-col items-center gap-4 group w-full md:w-auto">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-3xl bg-white/50 border border-white backdrop-blur-md flex items-center justify-center shadow-xl shadow-brand-primary/10 group-hover:scale-105 transition-transform duration-300">
              <img src={imgFluentPerson12Filled} alt="Patient" className="w-10 h-10 md:w-12 md:h-12" />
            </div>
            <p className="font-outfit text-lg md:text-xl font-regular text-text-primary">Patient</p>
          </div>

          {/* Line 1 */}
          <div className="hidden md:flex flex-1 items-center gap-2 px-2 opacity-20">
            <div className="w-1.5 h-1.5 rounded-full bg-brand-primary"></div>
            <div className="flex-1 h-0.5 bg-brand-primary"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-brand-primary"></div>
          </div>

          {/* Platform */}
          <div className="flex flex-col items-center gap-4 group w-full md:w-auto">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-3xl bg-white/50 border border-white backdrop-blur-md flex items-center justify-center shadow-xl shadow-brand-primary/10 group-hover:scale-105 transition-transform duration-300">
              <img src={imgFrame40} alt="Platform" className="w-10 h-10 md:w-12 md:h-12" />
            </div>
            <p className="font-outfit text-lg md:text-xl font-regular text-text-primary">Platform</p>
          </div>

          {/* Line 2 */}
          <div className="hidden md:flex flex-1 items-center gap-2 px-2 opacity-20">
            <div className="w-1.5 h-1.5 rounded-full bg-brand-primary"></div>
            <div className="flex-1 h-0.5 bg-brand-primary"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-brand-primary"></div>
          </div>

          {/* Clinical Trials */}
          <div className="flex flex-col items-center gap-4 group w-full md:w-auto">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-3xl bg-white/50 border border-white backdrop-blur-md flex items-center justify-center shadow-xl shadow-brand-primary/10 group-hover:scale-105 transition-transform duration-300">
              <img src={imgHealthiconsClinicalA} alt="Clinical Trials" className="w-10 h-10 md:w-12 md:h-12" />
            </div>
            <p className="font-outfit text-lg md:text-xl font-regular text-text-primary text-center">Clinical Trials</p>
          </div>

          {/* Line 3 */}
          <div className="hidden md:flex flex-1 items-center gap-2 px-2 opacity-20">
            <div className="w-1.5 h-1.5 rounded-full bg-brand-primary"></div>
            <div className="flex-1 h-0.5 bg-brand-primary"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-brand-primary"></div>
          </div>

          {/* Participation */}
          <div className="flex flex-col items-center gap-4 group w-full md:w-auto">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-3xl bg-white/50 border border-white backdrop-blur-md flex items-center justify-center shadow-xl shadow-brand-primary/10 group-hover:scale-105 transition-transform duration-300">
              <img src={imgBasilAddSolid} alt="Participation" className="w-10 h-10 md:w-12 md:h-12" />
            </div>
            <p className="font-outfit text-lg md:text-xl font-regular text-text-primary">Participation</p>
          </div>
        </div>
      </div>
    </section>
  );
}
