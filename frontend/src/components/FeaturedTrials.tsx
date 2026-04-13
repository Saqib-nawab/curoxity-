

const imgSolarArrowUpOutline = "./arrow-right.svg";
const imgIcon = "./company.svg";
const imgHealthiconsClinicalA = "./phase.svg";
const imgFa7SolidRandom = "./randomized.svg";
const imgDoubleBlindContainer = "./masking.svg";
const imgGroup = "./placebo.svg";

const imgIcon1 = "./arrow-right.svg";

const trialsData = [
  {
    title: "Dapagliflozin for Aortic Pressure Reduction in Type 2 Diabetes",
    sponsor: "Hellenic Society of Medical Education",
    phase: "Phase IV",
    treatment: "Tirzepatide",
    population: "<80 >20 years",
    location: "United States",
    duration: "Feb 2021 - Apr 2021",
    risk: "Risk Level: Low",
    results: "HbA1c Reduction"
  },
  {
    title: "Semaglutide Cardiovascular Outcomes in Patients With Obesity",
    sponsor: "Novo Nordisk",
    phase: "Phase III",
    treatment: "Semaglutide",
    population: "<80 >20 years",
    location: "Global",
    duration: "Feb 2021 - Apr 2021",
    risk: "Risk Level: Low",
    results: "Body Weight Change"
  },
  {
    title: "Empagliflozin Effects on Cardiac Function in Type 2 Diabetes",
    sponsor: "Imperial College London",
    phase: "Phase IV",
    treatment: "Empagliflozin",
    population: "<80 >20 years",
    location: "United Kingdom",
    duration: "Nov 2018 - Mar 2020",
    risk: "Risk Level: Low",
    results: "Left Ventricular Mass Reduction"
  }
];

export default function FeaturedTrials() {
  return (
    <section className="w-full max-w-[1780px] mx-auto px-[70px] py-16 flex flex-col gap-8 relative z-20">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <h2 className="font-outfit font-medium text-[40px] leading-[48px] text-text-primary tracking-[-0.4px]">
          Trending Clinical Trials
        </h2>
        <p className="font-noto-sans text-[16px] leading-[28px] text-text-secondary">
          Explore notable clinical studies across different diseases.
        </p>
      </div>

      {/* Categories Row */}
      <div className="bg-white/40 border border-white rounded-[24px] p-[18px] flex items-center justify-between">
        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar">
          <button className="bg-brand-primary text-white px-5 py-2.5 rounded-2xl font-noto-sans text-[15px] font-medium whitespace-nowrap">
            Obesity
          </button>
          {[
            'Breast Cancer', 'Lung Cancer', 'Colorectal Cancer',
            'Alzheimer\'s', 'Cardiovascular', 'Parkinson\'s'
          ].map(cat => (
            <button key={cat} className="bg-white/40 border border-border-default text-text-muted hover:text-text-primary hover:border-[#cbd5e1] px-5 py-2.5 rounded-2xl font-noto-sans text-[15px] whitespace-nowrap transition-colors">
              {cat}
            </button>
          ))}
        </div>
        <button className="bg-brand-primary text-white flex items-center gap-3 pl-5 pr-[6px] py-[6px] rounded-[100px] shrink-0 font-noto-sans text-[15px] font-medium shadow-sm hover:opacity-90 transition-opacity">
          View All Trials
          <div className="bg-white rounded-full w-[34px] h-[34px] flex items-center justify-center text-brand-primary rotate-90">
            <img src={imgSolarArrowUpOutline} alt="arrow" className="w-[18px] h-[18px] -rotate-90" />
          </div>
        </button>
      </div>

      {/* Cards Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {trialsData.map((trial, idx) => (
          <div key={idx} className="bg-white/40 backdrop-blur-lg border border-white rounded-[24px] p-6 flex flex-col gap-5 transition-shadow">
            {/* Title & Sponsor */}
            <div className="flex flex-col gap-3">
              <h3 className="font-outfit text-[20px] leading-[30px] font-regular text-text-primary tracking-[-0.2px] min-h-[60px]">
                {trial.title}
              </h3>
              <div className="flex items-center gap-2">
                <img src={imgIcon} alt="sponsor" className="w-3.5 h-3.5 opacity-70" />
                <span className="font-noto-sans text-[13px] text-text-secondary">{trial.sponsor}</span>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-white/40 border border-white flex items-center gap-1.5 px-2.5 py-1.5 rounded-[10px] text-brand-primary text-[11px] font-noto-sans font-regular whitespace-nowrap">
                <img src={imgHealthiconsClinicalA} className="w-3 h-3" alt="phase" />
                {trial.phase}
              </span>
              <span className="bg-white/40 border border-white flex items-center gap-1.5 px-2.5 py-1.5 rounded-[10px] text-brand-primary text-[11px] font-noto-sans font-regular whitespace-nowrap">
                <img src={imgFa7SolidRandom} className="w-3 h-3" alt="randomized" />
                Randomized
              </span>
              <span className="bg-white/40 border border-white flex items-center gap-1.5 px-2.5 py-1.5 rounded-[10px] text-brand-primary text-[11px] font-noto-sans font-medium whitespace-nowrap">
                <img src={imgDoubleBlindContainer} className="w-3 h-3" alt="double blind" />
                Double-Blind
              </span>
              <span className="bg-white/40 border border-white flex items-center gap-1.5 px-2.5 py-1.5 rounded-[10px] text-brand-primary text-[11px] font-noto-sans font-medium whitespace-nowrap">
                <img src={imgGroup} className="w-3 h-3" alt="placebo" />
                Placebo-Controlled
              </span>
            </div>

            {/* Trial Specs */}
            <div
              className="flex flex-col gap-4 mt-2 border border-white rounded-[16px] p-6"
              style={{ background: 'radial-gradient(297.79% 119.9% at 100.9% 26.67%, rgba(138, 163, 239, 0.10) 0%, rgba(138, 163, 239, 0.00) 100%), rgba(255, 255, 255, 0.50)' }}
            >
              <div className="grid grid-cols-2 gap-y-5 gap-x-2">
                <div className="flex flex-col gap-1.5">
                  <span className="font-noto-sans text-[11px] text-text-secondary uppercase tracking-[0.05em] font-medium">Treatment</span>
                  <span className="font-noto-sans text-[13px] font-medium text-text-primary">{trial.treatment}</span>
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="font-noto-sans text-[11px] text-text-secondary uppercase tracking-[0.05em] font-medium">Population</span>
                  <span className="font-noto-sans text-[13px] font-medium text-text-primary">{trial.population}</span>
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="font-noto-sans text-[11px] text-text-secondary uppercase tracking-[0.05em] font-medium">Location</span>
                  <span className="font-noto-sans text-[13px] font-medium text-text-primary">{trial.location}</span>
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="font-noto-sans text-[11px] text-text-secondary uppercase tracking-[0.05em] font-medium">Duration</span>
                  <span className="font-noto-sans text-[13px] font-medium text-text-primary">{trial.duration}</span>
                </div>
              </div>
            </div>

            {/* Outcomes */}
            {/* <div className="grid grid-cols-2 gap-4 mt-auto pt-2">
              <div className="bg-[#14b8a6]/5 border border-[#14b8a6]/20 rounded-[16px] p-4 flex flex-col gap-3">
                <span className="font-noto-sans font-bold text-[#14b8a6] text-[12px]">Results</span>
                <span className="font-noto-sans font-medium text-text-primary text-[14px] leading-[20px]">{trial.results}</span>
              </div>
              <div className="bg-[#f45954]/5 border border-[#f45954]/20 rounded-[16px] p-4 flex flex-col gap-3">
                <span className="font-noto-sans font-bold text-[#f45954] text-[12px]">Adverse Events / Risk</span>
                <span className="font-noto-sans font-medium text-text-primary text-[14px] leading-[20px]">{trial.risk}</span>
              </div>
            </div> */}
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-end gap-3 mt-4">
        <button className="w-12 h-12 rounded-[16px] bg-white/40 border border-white flex items-center justify-center hover:bg-white/60 transition-colors rotate-90">
          <img src={imgIcon1} alt="prev" className="w-6 h-6 rotate-90 opacity-50" />
        </button>
        <button className="w-12 h-12 rounded-[16px] bg-white/40 border border-white flex items-center justify-center hover:bg-white/60 transition-colors rotate-90">
          <img src={imgIcon1} alt="next" className="w-6 h-6 text-text-primary -rotate-90" />
        </button>
      </div>
    </section>
  );
}
