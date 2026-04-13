
const imgIcon4 = "/assets/49eae7506b2a71eaba08e41655f812409049e171.svg";
const imgSolarCalendarBold = "/assets/b3c1d34a755345b9259a5581f34ef80d70466788.svg";
const imgFluentPeople12Filled1 = "/assets/3a16fa3f9a406977949ee98545a9cdf1a4ae1996.svg";
const imgStreamlineUltimateGenderHeteroBold = "/assets/484ab9ca44896440f74916694a22fa7f5680c400.svg";

export default function PopulationTab() {
  return (
    <div className="bg-[rgba(255,255,255,0.4)] border border-solid border-white content-stretch flex flex-col gap-[24px] items-start w-full min-w-0 p-[25px] relative rounded-[24px]" data-name="Container">
      {/* Section Header */}
      <div className="relative shrink-0">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[10px] items-center justify-center relative">
          <div className="bg-[rgba(255,255,255,0.4)] border-[0.471px] border-solid border-white content-stretch flex items-center justify-center p-[8px] relative rounded-[12px] shadow-[-33.882px_60.235px_19.294px_0px_rgba(138,163,239,0),-21.647px_38.588px_17.882px_0px_rgba(138,163,239,0.01),-12.235px_21.647px_15.059px_0px_rgba(138,163,239,0.03),-5.176px_9.412px_10.824px_0px_rgba(138,163,239,0.05),-1.412px_2.353px_6.118px_0px_rgba(138,163,239,0.06)] shrink-0 size-[48px]">
            <div className="content-stretch flex items-center justify-center px-[4px] relative shrink-0 size-[32px]">
              <div className="relative shrink-0 size-[24px]">
                <img alt="" className="absolute block max-w-none size-full" src={imgIcon4} />
              </div>
            </div>
          </div>
          <div className="flex flex-col font-outfit font-bold justify-center leading-[0] relative shrink-0 text-text-primary text-[0px] whitespace-nowrap">
            <p className="font-outfit font-normal leading-[32px] text-[20px] md:text-[24px]">{`Population & Participant Profile`}</p>
          </div>
        </div>
      </div>

      {/* Three Stat Cards Row */}
      <div className="relative shrink-0 w-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col lg:flex-row gap-[12px] items-stretch relative w-full">
          {/* Age Range Card */}
          <div className="border-[1.6px] border-solid border-white content-stretch flex flex-col gap-[12px] items-start min-h-px min-w-px p-[20px] relative rounded-[16px] w-full lg:flex-[1_0_0]" style={{ backgroundImage: "linear-gradient(152.006deg, rgba(138, 163, 239, 0.1) 0%, rgba(0, 0, 0, 0) 100%)" }}>
            <div className="content-stretch flex gap-[12px] items-center relative shrink-0 w-full">
              <div className="relative rounded-[16px] shrink-0 size-[48px]" style={{ backgroundImage: "linear-gradient(135deg, rgba(138, 163, 239, 0.2) 0%, rgba(138, 163, 239, 0.05) 100%)" }}>
                <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center px-[12px] relative size-full">
                  <div className="relative shrink-0 size-[24px]">
                    <img alt="" className="absolute block max-w-none size-full" src={imgSolarCalendarBold} />
                  </div>
                </div>
              </div>
              <div className="flex-[1_0_0] min-h-px min-w-px relative">
                <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col font-normal gap-[8px] items-start relative w-full">
                  <p className="font-noto-sans leading-[20px] relative shrink-0 text-text-muted text-[14px] w-full">
                    Age Range
                  </p>
                  <p className="font-outfit leading-[32px] relative shrink-0 text-text-primary text-[24px] w-full">
                    3–21 years
                  </p>
                </div>
              </div>
            </div>
            <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
              <div className="content-stretch flex font-noto-sans font-normal h-[20px] items-start justify-between leading-[20px] relative shrink-0 text-[14px] w-full whitespace-nowrap">
                <p className="relative shrink-0 text-text-secondary">
                  Minimum Age
                </p>
                <p className="relative shrink-0 text-text-primary">
                  3 years
                </p>
              </div>
              <div className="content-stretch flex font-noto-sans font-normal h-[20px] items-start justify-between leading-[20px] relative shrink-0 text-[14px] w-full whitespace-nowrap">
                <p className="relative shrink-0 text-text-secondary">
                  Maximum Age
                </p>
                <p className="relative shrink-0 text-text-primary">
                  21 years
                </p>
              </div>
              <div className="border-brand-primary/20 border-solid border-t-[0.8px] content-stretch flex flex-col items-start pt-[8.8px] relative shrink-0 w-full">
                <div className="content-stretch flex items-start relative shrink-0 w-full">
                  <p className="flex-[1_0_0] font-noto-sans font-normal leading-[16px] min-h-px min-w-px relative text-text-muted text-[12px]">{`Pediatric & Adolescent`}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sample Size Card */}
          <div className="border-[1.6px] border-solid border-white content-stretch flex flex-col gap-[12px] items-start min-h-px min-w-px p-[20px] relative rounded-[16px] w-full lg:flex-[1_0_0]" style={{ backgroundImage: "linear-gradient(152.006deg, rgba(138, 163, 239, 0.1) 0%, rgba(0, 0, 0, 0) 100%)" }}>
            <div className="content-stretch flex gap-[12px] items-center relative shrink-0 w-full">
              <div className="relative rounded-[16px] shrink-0 size-[48px]" style={{ backgroundImage: "linear-gradient(135deg, rgba(138, 163, 239, 0.2) 0%, rgba(138, 163, 239, 0.05) 100%)" }}>
                <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center px-[12px] relative size-full">
                  <div className="relative shrink-0 size-[24px]">
                    <img alt="" className="absolute block max-w-none size-full" src={imgFluentPeople12Filled1} />
                  </div>
                </div>
              </div>
              <div className="flex-[1_0_0] min-h-px min-w-px relative">
                <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col font-normal gap-[8px] items-start relative w-full">
                  <p className="font-noto-sans leading-[20px] relative shrink-0 text-text-muted text-[14px] w-full">
                    Sample Size
                  </p>
                  <p className="font-outfit leading-[32px] relative shrink-0 text-text-primary text-[24px] w-full">
                    7 participants
                  </p>
                </div>
              </div>
            </div>
            <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
              <div className="content-stretch flex font-noto-sans font-normal h-[20px] items-start justify-between leading-[20px] relative shrink-0 text-[14px] w-full whitespace-nowrap">
                <p className="relative shrink-0 text-text-secondary">
                  Estimated
                </p>
                <p className="relative shrink-0 text-text-primary">
                  7
                </p>
              </div>
              <div className="content-stretch flex font-noto-sans font-normal h-[20px] items-start justify-between leading-[20px] relative shrink-0 text-[14px] w-full whitespace-nowrap">
                <p className="relative shrink-0 text-text-secondary">
                  Actual Enrolled
                </p>
                <p className="relative shrink-0 text-text-primary">
                  7
                </p>
              </div>
              <div className="border-brand-primary/20 border-solid border-t-[0.8px] content-stretch flex flex-col items-start pt-[8.8px] relative shrink-0 w-full">
                <div className="content-stretch flex items-start relative shrink-0 w-full">
                  <p className="flex-[1_0_0] font-noto-sans font-normal leading-[16px] min-h-px min-w-px relative text-text-muted text-[12px]">
                    Phase I dose-finding study
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Eligibility / All Genders Card */}
          <div className="border-[1.6px] border-solid border-white content-stretch flex flex-col gap-[12px] items-start min-h-px min-w-px p-[20px] relative rounded-[16px] w-full lg:flex-[1_0_0]" style={{ backgroundImage: "linear-gradient(135deg, rgba(138, 163, 239, 0.1) 0%, rgba(0, 0, 0, 0) 100%)" }}>
            <div className="content-stretch flex gap-[12px] items-center relative shrink-0 w-full">
              <div className="relative rounded-[16px] shrink-0 size-[48px]" style={{ backgroundImage: "linear-gradient(135deg, rgba(138, 163, 239, 0.2) 0%, rgba(138, 163, 239, 0.05) 100%)" }}>
                <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center px-[12px] relative size-full">
                  <div className="relative shrink-0 size-[24px]">
                    <img alt="" className="absolute block max-w-none size-full" src={imgStreamlineUltimateGenderHeteroBold} />
                  </div>
                </div>
              </div>
              <div className="flex-[1_0_0] min-h-px min-w-px relative">
                <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col font-normal gap-[8px] items-start relative w-full">
                  <p className="font-noto-sans leading-[20px] relative shrink-0 text-text-muted text-[14px] w-full">
                    Eligibility
                  </p>
                  <p className="font-outfit leading-[32px] relative shrink-0 text-text-primary text-[24px] w-full">
                    All Genders
                  </p>
                </div>
              </div>
            </div>
            <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
              <div className="content-stretch flex font-noto-sans font-normal h-[20px] items-start justify-between leading-[20px] relative shrink-0 text-[14px] w-full whitespace-nowrap">
                <p className="relative shrink-0 text-text-secondary">
                  Gender
                </p>
                <p className="relative shrink-0 text-text-primary">
                  All
                </p>
              </div>
              <div className="content-stretch flex font-noto-sans font-normal h-[20px] items-start justify-between leading-[20px] relative shrink-0 text-[14px] w-full whitespace-nowrap">
                <p className="relative shrink-0 text-text-secondary">
                  Healthy Volunteers
                </p>
                <p className="relative shrink-0 text-[#f45954]">
                  No
                </p>
              </div>
              <div className="border-brand-primary/20 border-solid border-t-[0.8px] content-stretch flex flex-col items-start pt-[8.8px] relative shrink-0 w-full">
                <div className="content-stretch flex items-start relative shrink-0 w-full">
                  <p className="flex-[1_0_0] font-noto-sans font-normal leading-[16px] min-h-px min-w-px relative text-text-muted text-[12px]">
                    Active malignancy required
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Population Description */}
      <div className="bg-[rgba(255,255,255,0.4)] border border-solid border-white relative rounded-[16px] shrink-0 w-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start p-[20px] relative w-full">
          <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full">
            <p className="font-noto-sans font-bold leading-[20px] relative shrink-0 text-text-primary text-[14px] w-full">
              Population Description
            </p>
            <p className="font-noto-sans font-normal leading-[28px] relative shrink-0 text-text-secondary text-[16px] w-full">
              This Phase I study targeted a pediatric and adolescent population (ages 3-21 years) with unilateral pleural malignancy. The small sample size of 7 participants is intentional and appropriate for a Phase I dose-finding study, where the primary goal is to establish the Maximum Tolerated Dose (MTD) rather than demonstrate efficacy. The study enrolled patients of all genders who had active disease requiring treatment, with no healthy volunteers included. This focused population allowed for careful monitoring of safety and tolerability of escalating cisplatin doses in a vulnerable age group.
            </p>
          </div>
        </div>
      </div>

      {/* Summary Circles Row */}
      <div className="relative shrink-0 w-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-wrap gap-[12px] items-center relative w-full">
          {/* Total Enrolled */}
          <div className="border-[1.6px] border-solid border-white content-stretch flex flex-[1_0_0] flex-col gap-[24px] items-center justify-center min-h-px min-w-[100px] p-[20px] relative rounded-[16px]" style={{ backgroundImage: "linear-gradient(150.581deg, rgba(138, 163, 239, 0.1) 0%, rgba(0, 0, 0, 0) 100%)" }}>
            <div className="bg-brand-primary content-stretch flex items-center justify-center relative rounded-[26843500px] shrink-0 size-[40px]">
              <p className="font-noto-sans font-normal leading-[20px] relative shrink-0 text-[14px] text-center text-white whitespace-nowrap">
                7
              </p>
            </div>
            <p className="font-noto-sans font-normal leading-[16px] relative shrink-0 text-text-secondary text-[12px] whitespace-nowrap">
              Total Enrolled
            </p>
          </div>

          {/* Gender Ratio */}
          <div className="border-[1.6px] border-solid border-white content-stretch flex flex-[1_0_0] flex-col gap-[24px] items-center justify-center min-h-px min-w-[100px] p-[20px] relative rounded-[16px]" style={{ backgroundImage: "linear-gradient(150.581deg, rgba(138, 163, 239, 0.1) 0%, rgba(0, 0, 0, 0) 100%)" }}>
            <div className="bg-[#5c88da] content-stretch flex items-center justify-center relative rounded-[26843500px] shrink-0 size-[40px]">
              <p className="font-noto-sans font-normal leading-[20px] relative shrink-0 text-[14px] text-center text-white whitespace-nowrap">
                1:1
              </p>
            </div>
            <p className="font-noto-sans font-normal leading-[16px] relative shrink-0 text-text-secondary text-[12px] whitespace-nowrap">
              Gender Ratio
            </p>
          </div>

          {/* Age Years */}
          <div className="border-[1.6px] border-solid border-white content-stretch flex flex-[1_0_0] flex-col gap-[24px] items-center justify-center min-h-px min-w-[100px] p-[20px] relative rounded-[16px]" style={{ backgroundImage: "linear-gradient(150.581deg, rgba(138, 163, 239, 0.1) 0%, rgba(0, 0, 0, 0) 100%)" }}>
            <div className="bg-[#b4c6f7] content-stretch flex items-center justify-center relative rounded-[26843500px] shrink-0 size-[40px]">
              <p className="font-noto-sans font-normal leading-[20px] relative shrink-0 text-[14px] text-center text-white whitespace-nowrap">
                3-21
              </p>
            </div>
            <p className="font-noto-sans font-normal leading-[16px] relative shrink-0 text-text-secondary text-[12px] whitespace-nowrap">
              Age Years
            </p>
          </div>

          {/* Healthy Vol. */}
          <div className="border-[1.6px] border-solid border-white content-stretch flex flex-[1_0_0] flex-col gap-[24px] items-center justify-center min-h-px min-w-[100px] p-[20px] relative rounded-[16px]" style={{ backgroundImage: "linear-gradient(150.581deg, rgba(138, 163, 239, 0.1) 0%, rgba(0, 0, 0, 0) 100%)" }}>
            <div className="bg-brand-primary content-stretch flex items-center justify-center relative rounded-[26843500px] shrink-0 size-[40px]">
              <p className="font-noto-sans font-normal leading-[20px] relative shrink-0 text-[14px] text-center text-white whitespace-nowrap">
                0
              </p>
            </div>
            <p className="font-noto-sans font-normal leading-[16px] relative shrink-0 text-text-secondary text-[12px] whitespace-nowrap">
              Healthy Vol.
            </p>
          </div>

          {/* Completion */}
          {/* <div className="border-[1.6px] border-solid border-white content-stretch flex flex-[1_0_0] flex-col gap-[24px] items-center justify-center min-h-px min-w-[100px] p-[20px] relative rounded-[16px]" style={{ backgroundImage: "linear-gradient(150.581deg, rgba(138, 163, 239, 0.1) 0%, rgba(0, 0, 0, 0) 100%)" }}>
            <div className="bg-[#5c88da] content-stretch flex items-center justify-center relative rounded-[26843500px] shrink-0 size-[40px]">
              <p className="font-noto-sans font-normal leading-[20px] relative shrink-0 text-[14px] text-center text-white whitespace-nowrap">
                100%
              </p>
            </div>
            <p className="font-noto-sans font-normal leading-[16px] relative shrink-0 text-text-secondary text-[12px] whitespace-nowrap">
              Completion
            </p>
          </div> */}
        </div>
      </div>
    </div>
  );
}
