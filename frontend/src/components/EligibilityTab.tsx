
import { useState } from 'react';
const imgIcon4 = "/assets/49eae7506b2a71eaba08e41655f812409049e171.svg";
const imgIcon5 = "/assets/ef4ccec2d40341e89b807a05f090e35f4c95fe18.svg";
const imgIcon6 = "/assets/1440f9cc71f9c92cb658d8ab91e6cf6a2f780995.svg";
const imgIcon7 = "/assets/fb8ba6661aaeffc380843d8b784bbeb5c14784c8.svg";
const imgIcon8 = "/assets/897218684f531244d0f69f41d31d7f8642eb4b6a.svg";
const imgIcon9 = "/assets/3f0b489247522ef4e15c7bff7b475985e2cc52ee.svg";
const imgIcon10 = "/assets/3ea5996744f68b359cc2db5c44de0d81274478ed.svg";

export default function EligibilityTab() {
  const [inclusionOpen, setInclusionOpen] = useState(true);
  const [exclusionOpen, setExclusionOpen] = useState(true);
  const exclusionCriteria = [
    {
      id: "01",
      title: "Concomitant cardiopulmonary disease that would increase surgical risk",
      subtitle: "Heart or lung conditions incompatible with surgery",
      badge: "High Risk",
    },
    {
      id: "02",
      title: "Prior failure of hemi-thoracic platinum-based therapy",
      subtitle: "Previous platinum treatment in same location must not have failed",
      badge: "High Risk",
    },
    {
      id: "03",
      title: "Pregnancy or lactation",
      subtitle: "Must not be pregnant or breastfeeding",
      badge: "High Risk",
    },
    {
      id: "04",
      title: "Diagnosis of lymphoma",
      subtitle: "Lymphoma patients are excluded from this study",
      badge: null,
    }
  ];

  const inclusionCriteria = [
    {
      id: "01",
      title: "Age 3 to 21 years at the time of enrollment",
      subtitle: "Pediatric and adolescent population",
      badge: null,
    },
    {
      id: "02",
      title: "Histologically or genetically proven unilateral primary or metastatic active pleural malignancy",
      subtitle: "Must have confirmed diagnosis",
      badge: "Critical",
    },
    {
      id: "03",
      title: "Thoracic disease confined to one hemi-thoracic cavity",
      subtitle: "Unilateral involvement only",
      badge: "Critical",
    },
    {
      id: "04",
      title: "Extrathoracic disease controlled or absent",
      subtitle: "No active disease outside thorax",
      badge: "Critical",
    },
    {
      id: "05",
      title: "Expected survival of at least 8 weeks",
      subtitle: "Minimum life expectancy required",
      badge: null,
    },
    {
      id: "06",
      title: "Adequate renal function (GFR ≥ 60 mL/min/1.73m²)",
      subtitle: "GFR = Glomerular Filtration Rate",
      badge: "Critical",
    },
    {
      id: "07",
      title: "Adequate blood counts (ANC > 750/μL, Platelets > 75,000/μL)",
      subtitle: "ANC = Absolute Neutrophil Count",
      badge: "Critical",
    },
    {
      id: "08",
      title: "Adequate liver function (Total Bilirubin < 2x ULN, SGPT < 3x ULN)",
      subtitle: "SGPT = Serum Glutamic Pyruvic Transaminase, ULN = Upper Limit of Normal",
      badge: "Critical",
    },
    {
      id: "09",
      title: "Recovery from prior therapy toxicities to grade ≤ 2",
      subtitle: "Previous treatment side effects must be resolved",
      badge: null,
    },
    {
      id: "10",
      title: "At least 14 days since last chemotherapy, radiotherapy, or investigational agent",
      subtitle: "Washout period required",
      badge: null,
    }
  ];

  return (
    <div className="bg-[rgba(255,255,255,0.4)] border border-solid border-white content-stretch flex flex-col gap-[24px] items-start p-[16px] md:p-[25px] relative rounded-[24px] w-full min-w-0" data-name="Container">
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
            <p className="font-outfit font-normal leading-[32px] text-[20px] md:text-[24px] text-text-primary">Eligibility Criteria</p>
          </div>
        </div>
      </div>
      <div className="relative shrink-0 w-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid gap-[24px] grid grid-cols-1 lg:grid-cols-2 relative w-full">

          {/* Inclusion Criteria Column */}
          <div className="bg-[rgba(20,184,166,0.03)] border-[0.8px] border-[rgba(20,184,166,0.15)] border-solid content-stretch flex flex-col items-start overflow-clip p-[0.8px] relative rounded-[16px] shrink-0 w-full" data-name="Container">
            <div
              className="bg-[rgba(20,184,166,0.08)] content-stretch flex h-[68px] items-center justify-between px-[20px] relative shrink-0 w-full cursor-pointer select-none"
              data-name="Header"
              onClick={() => setInclusionOpen(!inclusionOpen)}
            >
              <div className="flex-[1_0_0] h-[28px] min-h-px min-w-px relative">
                <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center relative size-full">
                  <div className="relative shrink-0">
                    <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center relative">
                      <div className="relative shrink-0 size-[20px]">
                        <img alt="" className="absolute block max-w-none size-full" src={imgIcon8} />
                      </div>
                      <p className="font-noto-sans font-bold leading-[28px] relative shrink-0 text-text-primary text-[14px] md:text-[16px] whitespace-nowrap">
                        Inclusion Criteria
                      </p>
                    </div>
                  </div>
                  <div className="bg-[#14b8a6] relative rounded-[26843500px] shrink-0 size-[24px]">
                    <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center px-[8px] py-[4px] relative size-full">
                      <p className="font-noto-sans font-medium leading-[16px] relative shrink-0 text-[12px] text-center text-white tracking-[0.36px] whitespace-nowrap">
                        10
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className={`relative shrink-0 size-[20px] transition-transform duration-200 ${inclusionOpen ? 'rotate-0' : 'rotate-180'}`}>
                <img alt="" className="absolute block max-w-none size-full" src={imgIcon9} />
              </div>
            </div>
            {inclusionOpen && (
              <div className="content-stretch flex flex-col gap-[12px] items-start p-[20px] relative shrink-0 w-full">
                {inclusionCriteria.map((item, index) => (
                  <div key={index} className="content-stretch flex gap-[12px] items-start md:items-start py-[8px] relative rounded-[10px] shrink-0 w-full">
                    <div className="bg-[#14b8a6] content-stretch flex items-center justify-center px-[8px] py-[4px] relative rounded-[26843500px] shrink-0 size-[24px]">
                      <p className="font-noto-sans font-medium leading-[16px] relative shrink-0 text-[12px] text-center text-white tracking-[0.36px] whitespace-nowrap">
                        {item.id}
                      </p>
                    </div>
                    <div className="content-stretch flex flex-[1_0_0] flex-col font-noto-sans font-normal gap-[8px] items-start min-h-px min-w-px relative">
                      <p className="leading-[20px] relative shrink-0 text-[#2d3748] text-[14px] w-full">
                        {item.title}
                      </p>
                      <p className="leading-[16px] relative shrink-0 text-[#99a9c0] text-[12px] w-full">
                        {item.subtitle}
                      </p>
                    </div>
                    {item.badge && (
                      <div className="content-stretch flex gap-[6px] items-center relative shrink-0">
                        <div className="relative shrink-0 size-[12px]">
                          <img alt="" className="absolute block max-w-none size-full" src={imgIcon10} />
                        </div>
                        <p className="font-noto-sans font-normal leading-[16px] relative shrink-0 text-[#14b8a6] text-[12px] whitespace-nowrap">
                          {item.badge}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Exclusion Criteria Column */}
          <div className="bg-[rgba(244,89,84,0.03)] border-[0.8px] border-[rgba(244,89,84,0.15)] border-solid content-stretch flex flex-col items-start overflow-clip p-[0.8px] relative rounded-[16px] shrink-0 w-full" data-name="Container">
            <div
              className="bg-[rgba(244,89,84,0.08)] content-stretch flex h-[68px] items-center justify-between px-[20px] relative shrink-0 w-full cursor-pointer select-none"
              data-name="Header"
              onClick={() => setExclusionOpen(!exclusionOpen)}
            >
              <div className="flex-[1_0_0] h-[28px] min-h-px min-w-px relative">
                <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center relative size-full">
                  <div className="relative shrink-0">
                    <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center relative">
                      <div className="relative shrink-0 size-[20px]">
                        <img alt="" className="absolute block max-w-none size-full" src={imgIcon5} />
                      </div>
                      <p className="font-noto-sans font-bold leading-[28px] relative shrink-0 text-text-primary text-[14px] md:text-[16px] whitespace-nowrap">
                        Exclusion Criteria
                      </p>
                    </div>
                  </div>
                  <div className="bg-[#f45954] relative rounded-[26843500px] shrink-0 size-[24px]">
                    <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center px-[8px] py-[4px] relative size-full">
                      <p className="font-noto-sans font-medium leading-[16px] relative shrink-0 text-[12px] text-center text-white tracking-[0.36px] whitespace-nowrap">
                        04
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className={`relative shrink-0 size-[20px] transition-transform duration-200 ${exclusionOpen ? 'rotate-0' : 'rotate-180'}`}>
                <img alt="" className="absolute block max-w-none size-full" src={imgIcon6} />
              </div>
            </div>
            {exclusionOpen && (
              <div className="content-stretch flex flex-col gap-[12px] items-start p-[20px] relative shrink-0 w-full">
                {exclusionCriteria.map((item, index) => (
                  <div key={index} className="content-stretch flex gap-[12px] items-start md:items-start py-[8px] relative rounded-[10px] shrink-0 w-full">
                    <div className="bg-[#f45954] content-stretch flex items-center justify-center px-[8px] py-[4px] relative rounded-[26843500px] shrink-0 size-[24px]">
                      <p className="font-noto-sans font-medium leading-[16px] relative shrink-0 text-[12px] text-center text-white tracking-[0.36px] whitespace-nowrap">
                        {item.id}
                      </p>
                    </div>
                    <div className="content-stretch flex flex-[1_0_0] flex-col font-noto-sans font-normal gap-[8px] items-start min-h-px min-w-px relative">
                      <p className="leading-[20px] relative shrink-0 text-[#2d3748] text-[14px] w-full">
                        {item.title}
                      </p>
                      <p className="leading-[16px] relative shrink-0 text-[#99a9c0] text-[12px] w-full">
                        {item.subtitle}
                      </p>
                    </div>
                    {item.badge && (
                      <div className="content-stretch flex gap-[6px] items-center relative shrink-0">
                        <div className="relative shrink-0 size-[12px]">
                          <img alt="" className="absolute block max-w-none size-full" src={imgIcon7} />
                        </div>
                        <p className="font-noto-sans font-normal leading-[16px] relative shrink-0 text-[#f45954] text-[12px] whitespace-nowrap">
                          {item.badge}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
