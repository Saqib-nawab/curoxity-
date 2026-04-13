

const imgFluentShare16Filled = "./share-condition.svg";
const imgFrame = "./arrow-upright-black.svg";
const imgGroup = "./ai-match.svg";
const imgLogoContainer = "./Logo_gradient.svg";
const imgIconamoonDiscoverFill = "./discover-trials.svg";
const imgGroup1 = "./explore.svg";

export default function HowItWorks() {
  return (
    <section className="w-full max-w-[1780px] mx-auto px-[40px] md:px-[70px] py-10 lg:py-16 flex flex-col items-center justify-center min-h-[calc(100vh-80px)] lg:min-h-screen relative z-20">
      {/* Header */}
      <div className="flex flex-col items-center gap-2 md:gap-4 mb-8 md:mb-12">
        <h2 className="font-outfit font-regular text-[32px] md:text-[40px] leading-tight text-text-primary tracking-[-0.4px] text-center">
          How It Works
        </h2>
        <p className="font-noto-sans text-[15px] md:text-[16px] leading-relaxed text-text-secondary text-center">
          Three simple steps to finding the right clinical trial for you.
        </p>
      </div>

      {/* Steps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_minmax(180px,236px)_1fr] md:auto-rows-fr gap-4 xl:gap-6 w-full max-w-[1780px] relative px-[16px] md:px-[24px] place-items-center">
        {/* Row 1 */}
        {/* Step 1 */}
        <div className="relative z-10 bg-white/20 border border-white backdrop-blur-md rounded-[24px] p-5 xl:p-6 flex flex-col gap-1.5 xl:gap-2 items-start w-full h-full justify-center">
          <div className="w-12 h-12 rounded-full border border-white p-1 shrink-0 bg-white/50">
            <div className="w-full h-full rounded-full bg-[#7DC4F0]/10 flex items-center justify-center">
              <img src={imgFluentShare16Filled} alt="step 1" className="w-5 h-5 opacity-80" />
            </div>
          </div>
          <p className="font-noto-sans text-[14px] text-text-secondary font-regular m-0">Step 1</p>
          <div className="flex items-center gap-2">
            <h3 className="font-outfit font-regular text-[22px] leading-[30px] text-text-primary m-0">Share Your Condition</h3>
            <img src={imgFrame} alt="arrow" className="ml-2 w-5 h-5" />
          </div>
          <p className="font-noto-sans text-[15px] leading-[26px] text-text-secondary m-0 truncate w-full">
            Describe your condition and preferences in simple terms.
          </p>
        </div>

        {/* Top-Middle Gradient Block */}
        <div className="hidden md:block rounded-[24px] bg-gradient-to-b from-[#7DC4F0]/0 to-[#7DC4F0]/20 w-full h-full"></div>

        {/* Step 2 */}
        <div className="relative z-10 bg-white/20 border border-white backdrop-blur-md rounded-[24px] p-5 xl:p-6 flex flex-col gap-1.5 xl:gap-2 items-start w-full h-full justify-center">
          <div className="w-12 h-12 rounded-full border border-white p-1 shrink-0 bg-white/50">
            <div className="w-full h-full rounded-full bg-[#7DC4F0]/10 flex items-center justify-center">
              <img src={imgGroup} alt="step 2" className="w-5 h-5 opacity-80" />
            </div>
          </div>
          <p className="font-noto-sans text-[14px] text-text-secondary font-regular m-0">Step 2</p>
          <div className="flex items-center gap-2">
            <h3 className="font-outfit font-regular text-[22px] leading-[30px] text-text-primary m-0">AI Finds Matches</h3>
            <img src={imgFrame} alt="arrow" className="ml-2 w-5 h-5" />
          </div>
          <p className="font-noto-sans text-[15px] leading-[26px] text-text-secondary m-0 truncate w-full">
            Our AI scans global clinical trials for your best matches.
          </p>
        </div>

        {/* Row 2 */}
        {/* Middle-Left Gradient Block */}
        <div className="hidden md:block rounded-[24px] bg-gradient-to-r from-[#7DC4F0]/0 to-[#7DC4F0]/20 w-full h-full"></div>

        {/* Logo Center */}
        <div className="hidden md:flex shrink-0 relative z-10 items-center justify-center rounded-[24px] bg-white/20 border border-white backdrop-blur-md w-full h-full">
          <img src={imgLogoContainer} alt="clinEvidence logo" className=" opacity-100 object-contain w-24 h-24" />
        </div>

        {/* Middle-Right Gradient Block */}
        <div className="hidden md:block rounded-[24px] bg-gradient-to-l from-[#7DC4F0]/0 to-[#7DC4F0]/20 w-full h-full"></div>

        {/* Row 3 */}
        {/* Step 3 */}
        <div className="relative z-10 bg-white/20 border border-white backdrop-blur-md rounded-[24px] p-5 xl:p-6 flex flex-col gap-1.5 xl:gap-2 items-start w-full h-full justify-center">
          <div className="w-12 h-12 rounded-full border border-white p-1 shrink-0 bg-white/50">
            <div className="w-full h-full rounded-full bg-[#7DC4F0]/10 flex items-center justify-center">
              <img src={imgIconamoonDiscoverFill} alt="step 3" className="w-5 h-5 opacity-80" />
            </div>
          </div>
          <p className="font-noto-sans text-[14px] text-text-secondary font-regular m-0">Step 3</p>
          <div className="flex items-center gap-2">
            <h3 className="font-outfit font-regular text-[22px] leading-[30px] text-text-primary m-0">Discover Matched Trials</h3>
            <img src={imgFrame} alt="arrow" className="ml-2 w-5 h-5" />
          </div>
          <p className="font-noto-sans text-[15px] leading-[26px] text-text-secondary m-0 truncate w-full">
            We evaluate and rank trials based on your profile match.
          </p>
        </div>

        {/* Bottom-Middle Gradient Block */}
        <div className="hidden md:block rounded-[24px] bg-gradient-to-t from-[#7DC4F0]/0 to-[#7DC4F0]/20 w-full h-full"></div>

        {/* Step 4 */}
        <div className="relative z-10 bg-white/20 border border-white backdrop-blur-md rounded-[24px] p-5 xl:p-6 flex flex-col gap-1.5 xl:gap-2 items-start w-full h-full justify-center">
          <div className="w-12 h-12 rounded-full border border-white p-1 shrink-0 bg-white/50">
            <div className="w-full h-full rounded-full bg-[#7DC4F0]/10 flex items-center justify-center">
              <img src={imgGroup1} alt="step 4" className="w-[18px] h-[18px] opacity-80" />
            </div>
          </div>
          <p className="font-noto-sans text-[14px] text-text-secondary font-regular m-0">Step 4</p>
          <div className="flex items-center gap-2">
            <h3 className="font-outfit font-regular text-[22px] leading-[30px] text-text-primary m-0">Explore and Connect</h3>
            <img src={imgFrame} alt="arrow" className="ml-2 w-5 h-5" />
          </div>
          <p className="font-noto-sans text-[15px] leading-[26px] text-text-secondary m-0 truncate w-full">
            Review trial details and connect with research teams.
          </p>
        </div>
      </div>
    </section>
  );
}
