import { useState } from 'react';

const imgIcon4 = "/assets/49eae7506b2a71eaba08e41655f812409049e171.svg";

// Inline SVG components for icons not available as assets
function CheckCircleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 1.333A6.667 6.667 0 1 0 14.667 8 6.674 6.674 0 0 0 8 1.333Zm3.06 4.727-3.667 4a.667.667 0 0 1-.493.24h-.013a.667.667 0 0 1-.487-.213l-1.667-1.78a.667.667 0 1 1 .974-.913l1.167 1.247 3.18-3.467a.667.667 0 0 1 1.007.886Z" fill="#14b8a6" />
    </svg>
  );
}

function GoalIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="14" cy="14" r="12" stroke="#14b8a6" strokeWidth="2" />
      <circle cx="14" cy="14" r="7" stroke="#14b8a6" strokeWidth="2" />
      <circle cx="14" cy="14" r="2.5" fill="#14b8a6" />
    </svg>
  );
}

function GoalIcon2({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="14" cy="14" r="12" stroke="#7DC4F0" strokeWidth="2" />
      <circle cx="14" cy="14" r="7" stroke="#7DC4F0" strokeWidth="2" />
      <circle cx="14" cy="14" r="2.5" fill="#7DC4F0" />
    </svg>
  );
}

function DocumentIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6.667 2.5h4.655c.177 0 .346.07.471.196l3.678 3.678a.667.667 0 0 1 .196.471V15.833c0 .92-.746 1.667-1.667 1.667H6.667A1.667 1.667 0 0 1 5 15.833V4.167c0-.92.746-1.667 1.667-1.667Z" fill="#7DC4F0" />
      <path d="M8.333 10H11.667M8.333 12.5H11.667M8.333 7.5H9.167" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function EndpointIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="8" width="16" height="4" rx="2" fill="#7DC4F0" />
      <circle cx="5" cy="10" r="2.5" fill="#2d3748" />
      <circle cx="10" cy="10" r="2.5" fill="#14b8a6" />
      <circle cx="15" cy="10" r="2.5" fill="#7DC4F0" />
    </svg>
  );
}

const typeColors: Record<string, { bg: string; border: string; text: string }> = {
  primary: { bg: 'bg-[#5f7de8]', border: 'border-[#cdd8ff]', text: 'text-white' },
  secondary: { bg: 'bg-[#7c8db8]', border: 'border-[#afbee6]', text: 'text-white' },
  exploratory: { bg: 'bg-[#9fa8c3]', border: 'border-[#d4ddf7]', text: 'text-white' }
};

const timelineData = [
  {
    phase: "Screening",
    endpoints: [
      { name: "Informed Consent", type: "primary", description: "Obtain written informed consent from participant" },
      { name: "Eligibility Assessment", type: "primary", description: "Assess participant against inclusion/exclusion criteria" },
      { name: "Medical History", type: "primary", description: "Record relevant medical history and demographics" },
    ]
  },
  {
    phase: "Day 1",
    endpoints: [
      { name: "Baseline VTE Assessment", type: "primary", description: "Initial assessment of Venous Thromboembolism" },
      { name: "Randomization", type: "primary", description: "Assign participants to treatment groups" },
      { name: "Vital Signs Assessment", type: "secondary", description: "Monitor temperature, blood pressure, etc." },
      { name: "Laboratory Tests", type: "secondary", description: "Blood and urine analysis" }
    ]
  },
  {
    phase: "Week 2",
    endpoints: [
      { name: "Safety Assessment", type: "secondary", description: "Monitor for adverse events" },
      { name: "Medication Compliance", type: "secondary", description: "Verify treatment adherence" },
      { name: "Bleeding Events", type: "primary", description: "Track any bleeding complications" }
    ]
  },
  {
    phase: "Week 4",
    endpoints: [
      { name: "DVT Recurrence", type: "primary", description: "Check for Deep Vein Thrombosis recurrence" },
      { name: "Pulmonary Embolism", type: "primary", description: "Check for PE recurrence" },
      { name: "Quality of Life", type: "exploratory", description: "Patient-reported outcomes" },
      { name: "Coagulation Panel", type: "secondary", description: "Assess blood clotting parameters" }
    ]
  },
  {
    phase: "Week 8",
    endpoints: [
      { name: "Vital Signs", type: "secondary", description: "Routine monitoring" },
      { name: "Adverse Events", type: "secondary", description: "Check for side effects" },
      { name: "Thrombocytopenia Screen", type: "secondary", description: "Monitor platelet counts" }
    ]
  },
  {
    phase: "Week 12",
    endpoints: [
      { name: "Primary Efficacy Endpoint", type: "primary", description: "Main study outcome measurement" },
      { name: "DVT Assessment", type: "secondary", description: "Targeted ultrasound" },
      { name: "PE Assessment", type: "secondary", description: "CT angiography if needed" },
      { name: "Major Bleeding", type: "primary", description: "Safety endpoint evaluation" },
      { name: "Physical Function", type: "exploratory", description: "Mobility and activity levels" }
    ]
  },
  {
    phase: "Week 16",
    endpoints: [
      { name: "Safety Monitoring", type: "secondary", description: "Ongoing safety checks" },
      { name: "Laboratory Tests", type: "secondary", description: "Routine blood work" }
    ]
  },
  {
    phase: "Week 20",
    endpoints: [
      { name: "VTE Recurrence", type: "primary", description: "Monitoring for recurrence" },
      { name: "Bleeding Assessment", type: "secondary", description: "Safety check" },
      { name: "Treatment Satisfaction", type: "exploratory", description: "Survey data" }
    ]
  },
  {
    phase: "Week 24",
    endpoints: [
      { name: "End-of-Treatment Assessment", type: "primary", description: "Final treatment phase review" },
      { name: "Overall Mortality", type: "primary", description: "Survival status check" },
      { name: "Final DVT/PE Screen", type: "secondary", description: "Comprehensive imaging" },
      { name: "Other Thromboses", type: "secondary", description: "Non-DVT/PE events" },
      { name: "Final Quality of Life", type: "exploratory", description: "Final PRO data" }
    ]
  },
  {
    phase: "Week 28",
    endpoints: [
      { name: "Safety Follow-up", type: "secondary", description: "Post-treatment safety window" },
      { name: "Long-term Outcomes", type: "exploratory", description: "Extended observation" }
    ]
  }
];

export default function ResultsTab() {
  const [textSize, setTextSize] = useState<'S' | 'M' | 'L'>('S');
  const [hoveredEndpoint, setHoveredEndpoint] = useState<{ name: string; type: string; description: string; phase: string } | null>(null);

  const getFontSizeClass = () => {
    switch (textSize) {
      case 'M': return 'text-[12px] leading-[16px]';
      case 'L': return 'text-[14px] leading-[20px]';
      default: return 'text-[10px] leading-[12px]';
    }
  };

  const getChipPadding = () => {
    switch (textSize) {
      case 'M': return 'p-[8px]';
      case 'L': return 'p-[10px]';
      default: return 'p-[9px]';
    }
  };

  return (
    <div className="bg-[rgba(255,255,255,0.4)] border border-solid border-white flex flex-col gap-[24px] items-start w-full min-w-0 p-[16px] md:p-[25px] relative rounded-[24px]" data-name="Container">

      {/* Section Header */}
      <div className="relative w-full">
        <div className="flex flex-wrap items-center justify-between w-full">
          <div className="flex gap-[10px] items-center">
            <div className="bg-[rgba(255,255,255,0.4)] border-[0.471px] border-solid border-white flex items-center justify-center p-[8px] rounded-[12px] shadow-[-33.882px_60.235px_19.294px_0px_rgba(138,163,239,0),-21.647px_38.588px_17.882px_0px_rgba(138,163,239,0.01),-12.235px_21.647px_15.059px_0px_rgba(138,163,239,0.03),-5.176px_9.412px_10.824px_0px_rgba(138,163,239,0.05),-1.412px_2.353px_6.118px_0px_rgba(138,163,239,0.06)] shrink-0 size-[48px]">
              <div className="flex items-center justify-center size-[32px]">
                <div className="size-[24px]">
                  <img alt="" className="block w-full h-full object-contain" src={imgIcon4} />
                </div>
              </div>
            </div>
            <p className="font-outfit font-normal leading-[32px] text-[20px] md:text-[24px] text-text-primary">Results & Efficacy</p>
          </div>
          <div className="bg-[rgba(20,184,166,0.08)] flex gap-[8px] items-center px-[12px] py-[4px] rounded-[10px]">
            <CheckCircleIcon className="size-[16px]" />
            <p className="font-noto-sans font-normal leading-[20px] text-[#14b8a6] text-[14px] whitespace-nowrap">
              Study Completed
            </p>
          </div>
        </div>
      </div>

      {/* MTD Primary Endpoint Card */}
      <div className="bg-[rgba(255,255,255,0.4)] border-[1.6px] border-solid border-white rounded-[16px] w-full p-[20px]">
        <div className="flex flex-col gap-[20px] w-full">
          {/* Header Row: Icon + Title + Badge */}
          <div className="flex items-center gap-[16px] w-full">
            <div className="relative rounded-[14px] shrink-0 size-[48px] flex items-center justify-center" style={{ backgroundImage: "linear-gradient(135deg, rgba(20, 184, 166, 0.2) 0%, rgba(20, 184, 166, 0.05) 100%)" }}>
              <GoalIcon className="size-[24px]" />
            </div>
            <div className="flex flex-wrap gap-[12px] md:gap-[16px] items-center flex-1">
              <p className="font-outfit font-normal leading-[32px] text-text-primary text-[20px] md:text-[24px]">
                Maximum Tolerated Dose (MTD) of HITC
              </p>
              <div className="bg-[#14b8a6] px-[8px] py-[4px] rounded-full">
                <p className="font-noto-sans font-medium leading-[16px] text-[12px] text-white whitespace-nowrap">
                  Primary Outcome
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row font-noto-sans font-normal gap-[16px] items-stretch w-full">
            <div className="border-[1.6px] border-solid border-white flex flex-col gap-[12px] items-start p-[20px] rounded-[16px] w-full md:flex-1" style={{ backgroundImage: "linear-gradient(166deg, rgba(138, 163, 239, 0.1) 0%, rgba(0, 0, 0, 0) 100%)" }}>
              <p className="leading-[16px] text-text-secondary text-[12px] whitespace-nowrap">Primary Assessment</p>
              <p className="leading-[28px] text-text-primary text-[16px]">3 months post-op</p>
              <p className="leading-[16px] text-text-muted text-[12px] whitespace-nowrap">CT scan + physical exam</p>
            </div>
            <div className="border-[1.6px] border-solid border-white flex flex-col gap-[12px] items-start p-[20px] rounded-[16px] w-full md:flex-1" style={{ backgroundImage: "linear-gradient(166deg, rgba(138, 163, 239, 0.1) 0%, rgba(0, 0, 0, 0) 100%)" }}>
              <p className="leading-[16px] text-text-secondary text-[12px] whitespace-nowrap">Follow-up Assessment</p>
              <p className="leading-[28px] text-text-primary text-[16px]">6 months post-op</p>
              <p className="leading-[16px] text-text-muted text-[12px] whitespace-nowrap">CT scan + physical exam</p>
            </div>
          </div>

          {/* Measurement Box */}
          <div className="bg-[rgba(255,255,255,0.4)] border-[1.6px] border-solid border-white flex flex-col gap-[12px] items-start p-[20px] rounded-[16px] w-full">
            <p className="font-noto-sans font-bold leading-[20px] text-text-primary text-[14px]">Measurement</p>
            <p className="font-noto-sans font-normal leading-[28px] text-text-primary text-[16px]">
              Measurable disease was evaluated using CT imaging and physical examination at 3 and 6 months postoperatively to assess disease progression, recurrence, or relapse following cytoreductive surgery and HITC.
            </p>
          </div>
        </div>
      </div>

      {/* Time to Relapse Secondary Endpoint Card */}
      <div className="bg-[rgba(255,255,255,0.4)] border-[1.6px] border-solid border-white rounded-[16px] w-full p-[20px]">
        <div className="flex flex-col gap-[20px] w-full">
          <div className="flex items-center gap-[16px] w-full">
            <div className="relative rounded-[14px] shrink-0 size-[48px] flex items-center justify-center" style={{ backgroundImage: "linear-gradient(135deg, rgba(125, 196, 240, 0.2) 0%, rgba(125, 196, 240, 0.05) 100%)" }}>
              <GoalIcon2 className="size-[24px]" />
            </div>
            <div className="flex flex-wrap gap-[12px] md:gap-[16px] items-center flex-1">
              <p className="font-outfit font-normal leading-[32px] text-text-primary text-[20px] md:text-[24px]">Time to Relapse</p>
              <div className="bg-[#7DC4F0] px-[8px] py-[4px] rounded-full">
                <p className="font-noto-sans font-medium leading-[16px] text-[12px] text-white whitespace-nowrap">Secondary Endpoint</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col md:flex-row font-noto-sans font-normal gap-[16px] items-stretch w-full">
            <div className="border-[1.6px] border-solid border-white flex flex-col gap-[12px] items-start p-[20px] rounded-[16px] w-full md:flex-1" style={{ backgroundImage: "linear-gradient(166deg, rgba(125, 196, 240, 0.1) 0%, rgba(0, 0, 0, 0) 100%)" }}>
              <p className="leading-[16px] text-text-secondary text-[12px] whitespace-nowrap">Relapse Tracking</p>
              <p className="leading-[28px] text-text-primary text-[16px]">60 months (5 years)</p>
              <p className="leading-[16px] text-text-muted text-[12px] whitespace-nowrap">Disease-free interval</p>
            </div>
          </div>
        </div>
      </div>

      {/* Outcome Data Availability */}
      <div className="bg-[rgba(255,255,255,0.4)] border border-solid border-white rounded-[16px] w-full p-[20px]">
        <div className="flex flex-col gap-[12px] w-full">
          <div className="flex items-center gap-[12px] w-full">
            <DocumentIcon className="shrink-0 size-[20px]" />
            <p className="font-noto-sans font-bold leading-[20px] text-text-primary text-[14px] flex-1">Outcome Data Availability</p>
          </div>
          <p className="font-noto-sans font-normal leading-[28px] text-text-secondary text-[16px]">
            This trial was completed on August 25, 2020. While endpoint measurement protocols are documented, numeric outcome values and statistical results are not available in the current dataset. Full results may be published in peer-reviewed medical journals or available through the study sponsor.
          </p>
          <div className="border-border-default border-solid border-t flex flex-wrap gap-[16px] items-center pt-[13px] w-full">
            <div className="flex gap-[8px] items-center">
              <div className="bg-[#14b8a6] rounded-full size-[8px]" />
              <p className="font-noto-sans font-normal leading-[20px] text-text-secondary text-[14px] whitespace-nowrap">MTD endpoint defined</p>
            </div>
            <div className="flex gap-[8px] items-center">
              <div className="bg-brand-primary rounded-full size-[8px]" />
              <p className="font-noto-sans font-normal leading-[20px] text-text-secondary text-[14px] whitespace-nowrap">Relapse tracking completed</p>
            </div>
            <div className="flex gap-[8px] items-center">
              <div className="bg-border-default rounded-full size-[8px]" />
              <p className="font-noto-sans font-normal leading-[20px] text-text-muted text-[14px] whitespace-nowrap">Numeric results pending publication</p>
            </div>
          </div>
        </div>
      </div>

      {/* Endpoint Assessment Timeline */}
      <div className="bg-[rgba(255,255,255,0.4)] border border-solid border-white content-stretch flex flex-col items-center p-[21px] relative rounded-[24px] w-full">
        <div className="relative shrink-0 w-full">
          <div className="flex flex-col gap-[12px] items-start relative w-full">
            <div className="flex gap-[12px] items-center relative shrink-0 w-full">
              <EndpointIcon className="shrink-0 size-[20px]" />
              <p className="font-noto-sans font-bold leading-[20px] relative shrink-0 text-[#2d3748] text-[14px] whitespace-nowrap">
                Endpoint Assessment Timeline
              </p>
            </div>
            
            <div className="bg-[rgba(255,255,255,0.4)] border border-solid border-white flex flex-col gap-[24px] items-start overflow-clip p-[16px] relative rounded-[16px] shrink-0 w-full">
              <div className="flex items-center justify-between relative shrink-0 w-full">
                {/* Legends */}
                <div className="flex gap-[12px] items-center relative shrink-0">
                  <div className="flex gap-[6px] h-[15px] items-center relative shrink-0">
                    <div className="bg-[#5f7de8] border border-[#cdd8ff] border-solid rounded-[4px] shrink-0 size-[12px]" />
                    <p className="font-noto-sans font-normal leading-[16px] text-[#45556c] text-[12px]">Primary</p>
                  </div>
                  <div className="flex gap-[6px] h-[15px] items-center relative shrink-0">
                    <div className="bg-[#7c8db8] border border-[#afbee6] border-solid rounded-[4px] shrink-0 size-[12px]" />
                    <p className="font-noto-sans font-normal leading-[16px] text-[#45556c] text-[12px]">Secondary</p>
                  </div>
                  <div className="flex gap-[6px] h-[15px] items-center relative shrink-0">
                    <div className="bg-[#9fa8c3] border border-[#d4ddf7] border-solid rounded-[4px] shrink-0 size-[12px]" />
                    <p className="font-noto-sans font-normal leading-[16px] text-[#45556c] text-[12px]">Exploratory</p>
                  </div>
                </div>

                {/* Size Toggle Buttons */}
                <div className="bg-[#f1f4fb] flex gap-[4px] items-start p-[4px] relative rounded-[10px] shrink-0">
                  {(['S', 'M', 'L'] as const).map((size) => (
                    <button
                      key={size}
                      onClick={() => setTextSize(size)}
                      className={`${textSize === size ? 'bg-white shadow-sm' : ''} h-[28px] relative rounded-[8px] shrink-0 px-[12px] py-[6px] transition-all`}
                    >
                      <p className={`font-noto-sans leading-[16px] text-[12px] text-center whitespace-nowrap ${textSize === size ? 'font-bold text-[#7dc4f0]' : 'font-normal text-[#4a5568]'}`}>
                        {size}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Timeline Horizontal Layout */}
              <div className={`relative w-full overflow-x-auto pt-2 pb-2 custom-scrollbar`}>
                <div className="flex gap-[8px] items-start relative pb-12 min-w-max">
                  {timelineData.map((phase, phaseIdx) => (
                    <div 
                      key={phaseIdx} 
                      className={`${textSize === 'S' ? 'flex-[0_0_120px]' : textSize === 'M' ? 'flex-[0_0_140px]' : 'flex-[0_0_180px]'} flex flex-col gap-[12px]`}
                    >
                      {/* Phase Header */}
                      <div className="border-[#e2e8f0] border-b-[0.8px] border-solid flex flex-col gap-[4px] pb-2">
                        <p className="font-noto-sans font-bold leading-[18px] text-[#2d3748] text-[12px] md:text-[13px]">
                          {phase.phase}
                        </p>
                        <p className="font-noto-sans font-normal leading-[14px] text-[#4a5568] text-[10px]">
                          {phase.endpoints.length} ep
                        </p>
                      </div>

                      {/* Chips List */}
                      <div className="flex flex-col gap-[4px]">
                        {phase.endpoints.map((endpoint, epIdx) => {
                          const colors = typeColors[endpoint.type];
                          return (
                            <div
                              key={epIdx}
                              className={`relative group ${colors.bg} border ${colors.border} rounded-[12px] shrink-0 w-full ${getChipPadding()} cursor-help transition-all transform hover:scale-[1.02] hover:shadow-lg z-10 hover:z-[110]`}
                              onMouseEnter={() => setHoveredEndpoint({ ...endpoint, phase: phase.phase })}
                              onMouseLeave={() => setHoveredEndpoint(null)}
                            >
                              <p className={`font-noto-sans font-normal ${getFontSizeClass()} ${colors.text}`}>
                                {endpoint.name}
                              </p>
                              
                              {/* Hover Tooltip Component */}
                              {hoveredEndpoint?.name === endpoint.name && hoveredEndpoint?.phase === phase.phase && (
                                <div 
                                  className={`absolute ${phaseIdx >= timelineData.length - 2 ? 'right-0' : 'left-0'} ${epIdx > phase.endpoints.length / 2 ? 'bottom-[calc(100%+8px)]' : 'top-[calc(100%+8px)]'} z-[100] w-[220px] bg-[#2d3748] border border-[#4f5467] p-[10px] rounded-[12px] shadow-2xl animate-fadeIn`}
                                >
                                  <p className="font-noto-sans font-bold text-[12px] text-white overflow-hidden text-ellipsis whitespace-nowrap mb-1">
                                    {endpoint.name}
                                  </p>
                                  <p className="font-noto-sans font-normal text-[11px] text-[#edf2f7] leading-[16px] mb-2">
                                    {endpoint.description}
                                  </p>
                                  <div className="flex items-center gap-[8px]">
                                    <div className={`${colors.bg} px-[6px] py-[3px] rounded-[6px]`}>
                                      <p className="font-noto-sans font-normal text-[10px] text-white capitalize">
                                        {endpoint.type}
                                      </p>
                                    </div>
                                    <p className="font-noto-sans font-normal text-[10px] text-[#99a9c0] capitalize">
                                      {phase.phase.toLowerCase()}
                                    </p>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Summary Stats Footer */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-[8px] w-full pt-4">
              {[
                { label: "Total Endpoints", value: "34", color: "text-[#0f172b]" },
                { label: "Primary", value: "11", color: "text-[#5f7de8]" },
                { label: "Secondary", value: "18", color: "text-[#7c8db8]" },
                { label: "Exploratory", value: "5", color: "text-[#9fa8c3]" },
              ].map((stat, i) => (
                <div key={i} className="border-[1.6px] border-solid border-white flex flex-col gap-[12px] items-start p-[16px] md:p-[20px] rounded-[16px]" style={{ backgroundImage: "linear-gradient(160deg, rgba(125, 196, 240, 0.1) 0%, rgba(0, 0, 0, 0) 100%)" }}>
                  <p className={`font-noto-sans font-bold text-[18px] ${stat.color}`}>{stat.value}</p>
                  <p className="font-noto-sans font-normal text-[12px] text-[#4a5568]">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
