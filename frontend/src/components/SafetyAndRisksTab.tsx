import { useState } from 'react';

const imgIcon4 = "/assets/49eae7506b2a71eaba08e41655f812409049e171.svg";
const imgIcon5 = "/assets/e456f982193c51484ec448b812194f7a9c868e3f.svg";
const imgAcademiconsOpenData = "/assets/5138028b9814c713e93211fcaa5eb82580d373f3.svg";
const imgIcon6 = "/assets/e977a1bfd347ddfc1bf2a30e54c9c9aa2f445f13.svg";
const imgIcon7 = "/assets/47b88011d5a20ef0844c2318ced96591cd5fdf86.svg";
const imgIconTotalAEs = "/assets/759755ab7ae6fc011c4d425cd1cee48e669e10f5.svg";
const imgIconSeriousAEs = "/assets/icon-warning-serious.svg";
const imgIconBleeding = "/assets/icon-major-bleeding.svg";
const imgIconDeaths = "/assets/icon-total-deaths.svg";
const imgIconComparison = "/assets/icon-treatment-comparison.svg";
const imgIconChart = "/assets/icon-ae-comparison.svg";

export default function SafetyAndRisksTab() {
  const [isPopulated, setIsPopulated] = useState(true);

  return (
    <div className="bg-[rgba(255,255,255,0.4)] border border-solid border-white content-stretch flex flex-col gap-[24px] items-start min-w-0 p-[16px] md:p-[25px] relative rounded-[24px] w-full" data-name="Container">
      <div className="relative shrink-0 w-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid flex flex-col sm:flex-row sm:items-center sm:justify-between gap-[16px] w-full">

          {/* Left side */}
          <div className="flex gap-[10px] items-center shrink-0">
            <div className="bg-[rgba(255,255,255,0.4)] border-[0.471px] border-solid border-white flex items-center justify-center p-[8px] rounded-[12px] shadow-[-33.882px_60.235px_19.294px_0px_rgba(138,163,239,0),-21.647px_38.588px_17.882px_0px_rgba(138,163,239,0.01),-12.235px_21.647px_15.059px_0px_rgba(138,163,239,0.03),-5.176px_9.412px_10.824px_0px_rgba(138,163,239,0.05),-1.412px_2.353px_6.118px_0px_rgba(138,163,239,0.06)] shrink-0 size-[48px]">
              <div className="flex items-center justify-center px-[4px] size-[32px]">
                <div className="relative size-[24px]">
                  <img alt="" className="absolute block size-full" src={imgIcon4} />
                </div>
              </div>
            </div>

            <p className="font-outfit font-normal leading-[32px] text-[20px] md:text-[24px] text-[#2d3748]">
              Adverse Events & Safety
            </p>
          </div>

          {/* Badge & Toggle */}
          <div className="flex items-center gap-[12px]">
            {/* Toggle */}
            <div className="flex items-center gap-2 bg-white/60 p-1 rounded-full border border-white/50">
              <button
                onClick={() => setIsPopulated(true)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${isPopulated ? 'bg-brand-primary text-white shadow' : 'text-text-secondary hover:text-text-primary'}`}
              >
                Populated
              </button>
              <button
                onClick={() => setIsPopulated(false)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${!isPopulated ? 'bg-brand-primary text-white shadow' : 'text-text-secondary hover:text-text-primary'}`}
              >
                Empty
              </button>
            </div>

            <div className="bg-[rgba(244,89,84,0.08)] flex gap-[8px] items-center px-[12px] py-[4px] rounded-[10px] w-fit">
              <div className="relative size-[16px]">
                <img alt="" className="absolute block size-full" src={imgIcon5} />
              </div>
              <p className="font-noto-sans font-normal leading-[20px] text-[#f45954] text-[14px]">
                Safety Data
              </p>
            </div>
          </div>
        </div>
      </div>

      {isPopulated ? (
        <div className="flex flex-col gap-6 w-full fade-in">
          {/* Populated State Container */}
          <div className="border-2 border-dashed border-white rounded-[16px] w-full p-[20px] lg:p-[24px] flex flex-col gap-[24px]" style={{ backgroundImage: "linear-gradient(132.626deg, rgba(99, 102, 241, 0.03) 0%, rgba(244, 89, 84, 0.02) 100%)" }}>

            {/* 4 Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[16px] w-full">
              {/* Card 1 */}
              <div className="border-[1.6px] border-white rounded-[16px] p-[20px] flex flex-col gap-[12px]" style={{ backgroundImage: "linear-gradient(149deg, rgba(125, 196, 240, 0.1) 0%, rgba(0,0,0,0) 100%)" }}>
                <div className="flex items-center gap-[8px]">
                  <div className="bg-[#7dc4f0]/10 p-[6px] rounded-[8px]">
                    <div className="relative size-[16px] flex items-center justify-center">
                      <img alt="" className="block w-full h-full object-contain" src={imgIconTotalAEs} />
                    </div>
                  </div>
                  <span className="text-[#99a9c0] text-[12px] font-noto-sans whitespace-nowrap">Total Adverse Events</span>
                </div>
                <div className="text-[24px] font-outfit text-[#2d3748]">86.5%</div>
                <div className="text-[#4a5568] text-[12px] font-noto-sans">Average across both groups</div>
              </div>

              {/* Card 2 */}
              <div className="border-[1.6px] border-white rounded-[16px] p-[20px] flex flex-col gap-[12px]" style={{ backgroundImage: "linear-gradient(149deg, rgba(244, 89, 84, 0.1) 0%, rgba(0,0,0,0) 100%)" }}>
                <div className="flex items-center gap-[8px]">
                  <div className="bg-[#f45954]/10 p-[6px] rounded-[8px]">
                    <div className="relative size-[16px] flex items-center justify-center">
                      <img alt="" className="block w-full h-full object-contain" src={imgIconSeriousAEs} />
                    </div>
                  </div>
                  <span className="text-[#99a9c0] text-[12px] font-noto-sans whitespace-nowrap">Serious AEs</span>
                </div>
                <div className="text-[24px] font-outfit text-[#2d3748]">416</div>
                <div className="text-[#4a5568] text-[12px] font-noto-sans">416 subjects affected</div>
              </div>

              {/* Card 3 */}
              <div className="border-[1.6px] border-white rounded-[16px] p-[20px] flex flex-col gap-[12px]" style={{ backgroundImage: "linear-gradient(149deg, rgba(255, 152, 0, 0.1) 0%, rgba(0,0,0,0) 100%)" }}>
                <div className="flex items-center gap-[8px]">
                  <div className="bg-orange-500/10 p-[6px] rounded-[8px]">
                    <div className="relative size-[16px] flex items-center justify-center">
                      <img alt="" className="block w-full h-full object-contain" src={imgIconBleeding} />
                    </div>
                  </div>
                  <span className="text-[#99a9c0] text-[12px] font-noto-sans whitespace-nowrap">Major Bleeding</span>
                </div>
                <div className="text-[24px] font-outfit text-[#2d3748]">2.5%</div>
                <div className="text-[#4a5568] text-[12px] font-noto-sans">Average incidence</div>
              </div>

              {/* Card 4 */}
              <div className="border-[1.6px] border-white rounded-[16px] p-[20px] flex flex-col gap-[12px]" style={{ backgroundImage: "linear-gradient(149deg, rgba(74, 85, 104, 0.1) 0%, rgba(0,0,0,0) 100%)" }}>
                <div className="flex items-center gap-[8px]">
                  <div className="bg-[#4a5568]/10 p-[6px] rounded-[8px]">
                    <div className="relative size-[16px] flex items-center justify-center">
                      <img alt="" className="block w-full h-full object-contain" src={imgIconDeaths} />
                    </div>
                  </div>
                  <span className="text-[#99a9c0] text-[12px] font-noto-sans whitespace-nowrap">Total Deaths</span>
                </div>
                <div className="text-[24px] font-outfit text-[#2d3748]">306</div>
                <div className="text-[#4a5568] text-[12px] font-noto-sans">All causes</div>
              </div>
            </div>

            {/* Treatment Group Comparison */}
            <div className="bg-white/40 border border-white rounded-[16px] p-[20px] flex flex-col gap-[20px] w-full">
              <div className="flex items-center gap-[12px] w-full">
                <div className="bg-brand-primary/10 p-[6px] rounded-[8px] shrink-0">
                  <div className="relative size-[20px] flex items-center justify-center">
                    <img alt="" className="block w-full h-full object-contain" src={imgIconComparison} />
                  </div>
                </div>
                <h3 className="font-bold text-[16px] text-[#2d3748] font-noto-sans flex-1">Treatment Group Comparison</h3>
              </div>

              <div className="flex flex-col md:flex-row gap-[16px] w-full items-start">
                {/* Protocol 1: INNOHEP */}
                <div className="bg-white/40 border-[1.6px] border-white p-[20px] rounded-[16px] w-full flex-1 flex flex-col gap-[16px]">
                  <div className="bg-[#5f7de8]/10 px-[12px] py-[4px] rounded-full w-fit">
                    <span className="text-[#5f7de8] font-medium text-[12px] tracking-[0.36px]">INNOHEP®</span>
                  </div>

                  <div className="flex flex-col text-[14px]">
                    <div className="flex justify-between py-[12px] border-b border-[#e2e8f0]">
                      <span className="text-[#4a5568]">Total Exposed</span>
                      <span className="font-bold text-[#2d3748]">449</span>
                    </div>
                    <div className="flex justify-between py-[12px] border-b border-[#e2e8f0]">
                      <span className="text-[#4a5568]">Serious AEs</span>
                      <span className="font-bold text-[#2d3748]">221 (49.22%)</span>
                    </div>
                    <div className="flex justify-between py-[12px] border-b border-[#e2e8f0]">
                      <span className="text-[#4a5568]">Non-Serious AEs</span>
                      <span className="font-bold text-[#2d3748]">358 (79.73%)</span>
                    </div>
                    <div className="flex justify-between py-[12px] border-b border-[#e2e8f0]">
                      <span className="text-[#4a5568]">Overall Bleeding</span>
                      <span className="font-bold text-[#2d3748]">25.4%</span>
                    </div>
                    <div className="flex justify-between py-[12px] border-b border-[#e2e8f0]">
                      <span className="text-[#4a5568]">Major Bleeding</span>
                      <span className="font-bold text-[#2d3748]">2.7%</span>
                    </div>
                    <div className="flex justify-between pt-[12px]">
                      <span className="text-[#4a5568]">Deaths (All Causes)</span>
                      <span className="font-bold text-[#f45954]">159</span>
                    </div>
                  </div>
                </div>

                {/* Protocol 2: WARFARIN */}
                <div className="bg-white/40 border-[1.6px] border-white p-[20px] rounded-[16px] w-full flex-1 flex flex-col gap-[16px]">
                  <div className="bg-[#4796c7]/10 px-[12px] py-[4px] rounded-full w-fit">
                    <span className="text-[#4796c7] font-medium text-[12px] tracking-[0.36px]">WARFARIN</span>
                  </div>

                  <div className="flex flex-col text-[14px]">
                    <div className="flex justify-between py-[12px] border-b border-[#e2e8f0]">
                      <span className="text-[#4a5568]">Total Exposed</span>
                      <span className="font-bold text-[#2d3748]">451</span>
                    </div>
                    <div className="flex justify-between py-[12px] border-b border-[#e2e8f0]">
                      <span className="text-[#4a5568]">Serious AEs</span>
                      <span className="font-bold text-[#2d3748]">195 (43.24%)</span>
                    </div>
                    <div className="flex justify-between py-[12px] border-b border-[#e2e8f0]">
                      <span className="text-[#4a5568]">Non-Serious AEs</span>
                      <span className="font-bold text-[#2d3748]">364 (80.71%)</span>
                    </div>
                    <div className="flex justify-between py-[12px] border-b border-[#e2e8f0]">
                      <span className="text-[#4a5568]">Overall Bleeding</span>
                      <span className="font-bold text-[#2d3748]">24.4%</span>
                    </div>
                    <div className="flex justify-between py-[12px] border-b border-[#e2e8f0]">
                      <span className="text-[#4a5568]">Major Bleeding</span>
                      <span className="font-bold text-[#2d3748]">2.4%</span>
                    </div>
                    <div className="flex justify-between pt-[12px]">
                      <span className="text-[#4a5568]">Deaths (All Causes)</span>
                      <span className="font-bold text-[#f45954]">147</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bar Chart Section */}
            <div className="bg-white/40 border border-white rounded-[16px] p-[20px] flex flex-col gap-[20px] w-full">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-[16px] w-full">
                <div className="flex items-center gap-[12px]">
                  <div className="bg-brand-primary/10 p-[6px] rounded-[8px] shrink-0">
                    <div className="relative size-[20px] flex items-center justify-center">
                      <img alt="" className="block w-full h-full object-contain" src={imgIconChart} />
                    </div>
                  </div>
                  <h3 className="font-bold text-[16px] text-[#2d3748]">Adverse Event Comparison</h3>
                </div>

                {/* Legend */}
                <div className="flex items-center gap-[16px]">
                  <div className="flex items-center gap-2">
                    <div className="w-[12px] h-[12px] rounded-sm bg-[#7dc4f0]"></div>
                    <span className="text-[12px] text-[#4a5568]">Innohep</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-[12px] h-[12px] rounded-sm bg-[#4796c7]"></div>
                    <span className="text-[12px] text-[#4a5568]">Warfarin</span>
                  </div>
                </div>
              </div>

              {/* Chart Container */}
              <div className="relative w-full h-[250px] mt-4 pl-[40px] pr-[10px] pb-[30px] pt-[10px]">
                {/* Y Axis Grid */}
                <div className="absolute inset-0 pl-[40px] pr-[10px] pb-[30px] pt-[10px] flex flex-col justify-between pointer-events-none">
                  {[100, 75, 50, 25, 0].map((val) => (
                    <div key={val} className="w-full h-px border-b border-dashed border-[#e2e8f0] relative">
                      <span className="absolute -left-[30px] -top-[8px] text-[11px] text-[#a0aec0]">{val}</span>
                    </div>
                  ))}
                  <span className="absolute -left-[14px] top-1/2 -rotate-90 origin-center text-[10px] text-[#a0aec0] -translate-x-1/2 font-medium tracking-wide">Percentage (%)</span>
                </div>

                {/* Bars Area */}
                <div className="relative w-full h-full flex items-end justify-around pl-4">
                  {/* Category 1 */}
                  <div className="flex flex-col items-center gap-2 h-full justify-end w-[20%]">
                    <div className="flex items-end gap-1 w-full justify-center h-full">
                      <div className="w-[40%] bg-[#7dc4f0] rounded-t-[4px] relative transition-all duration-300 hover:opacity-80 group/bar" style={{ height: '49.22%' }}>
                        <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-[#2d3748] text-white text-[10px] py-[2px] px-[6px] rounded opacity-0 group-hover/bar:opacity-100 transition-opacity pointer-events-none z-10 whitespace-nowrap shadow-md">
                          49.22%
                        </div>
                      </div>
                      <div className="w-[40%] bg-[#4796c7] rounded-t-[4px] relative transition-all duration-300 hover:opacity-80 group/bar" style={{ height: '43.24%' }}>
                        <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-[#2d3748] text-white text-[10px] py-[2px] px-[6px] rounded opacity-0 group-hover/bar:opacity-100 transition-opacity pointer-events-none z-10 whitespace-nowrap shadow-md">
                          43.24%
                        </div>
                      </div>
                    </div>
                    <span className="text-[11px] text-[#4a5568] whitespace-nowrap absolute -bottom-[20px]">Serious AEs</span>
                  </div>

                  {/* Category 2 */}
                  <div className="flex flex-col items-center gap-2 h-full justify-end w-[20%]">
                    <div className="flex items-end gap-1 w-full justify-center h-full">
                      <div className="w-[40%] bg-[#7dc4f0] rounded-t-[4px] relative transition-all duration-300 hover:opacity-80 group/bar" style={{ height: '79.73%' }}>
                        <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-[#2d3748] text-white text-[10px] py-[2px] px-[6px] rounded opacity-0 group-hover/bar:opacity-100 transition-opacity pointer-events-none z-10 whitespace-nowrap shadow-md">
                          79.73%
                        </div>
                      </div>
                      <div className="w-[40%] bg-[#4796c7] rounded-t-[4px] relative transition-all duration-300 hover:opacity-80 group/bar" style={{ height: '80.71%' }}>
                        <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-[#2d3748] text-white text-[10px] py-[2px] px-[6px] rounded opacity-0 group-hover/bar:opacity-100 transition-opacity pointer-events-none z-10 whitespace-nowrap shadow-md">
                          80.71%
                        </div>
                      </div>
                    </div>
                    <span className="text-[11px] text-[#4a5568] whitespace-nowrap absolute -bottom-[20px]">Non-Serious AEs</span>
                  </div>

                  {/* Category 3 */}
                  <div className="flex flex-col items-center gap-2 h-full justify-end w-[20%]">
                    <div className="flex items-end gap-1 w-full justify-center h-full">
                      <div className="w-[40%] bg-[#7dc4f0] rounded-t-[4px] relative transition-all duration-300 hover:opacity-80 group/bar" style={{ height: '25.4%' }}>
                        <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-[#2d3748] text-white text-[10px] py-[2px] px-[6px] rounded opacity-0 group-hover/bar:opacity-100 transition-opacity pointer-events-none z-10 whitespace-nowrap shadow-md">
                          25.4%
                        </div>
                      </div>
                      <div className="w-[40%] bg-[#4796c7] rounded-t-[4px] relative transition-all duration-300 hover:opacity-80 group/bar" style={{ height: '24.4%' }}>
                        <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-[#2d3748] text-white text-[10px] py-[2px] px-[6px] rounded opacity-0 group-hover/bar:opacity-100 transition-opacity pointer-events-none z-10 whitespace-nowrap shadow-md">
                          24.4%
                        </div>
                      </div>
                    </div>
                    <span className="text-[11px] text-[#4a5568] whitespace-nowrap absolute -bottom-[20px]">Overall Bleeding</span>
                  </div>

                  {/* Category 4 */}
                  <div className="flex flex-col items-center gap-2 h-full justify-end w-[20%]">
                    <div className="flex items-end gap-1 w-full justify-center h-full">
                      <div className="w-[40%] bg-[#7dc4f0] rounded-t-[4px] relative transition-all duration-300 hover:opacity-80 group/bar" style={{ height: '2.7%' }}>
                        <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-[#2d3748] text-white text-[10px] py-[2px] px-[6px] rounded opacity-0 group-hover/bar:opacity-100 transition-opacity pointer-events-none z-10 whitespace-nowrap shadow-md">
                          2.7%
                        </div>
                      </div>
                      <div className="w-[40%] bg-[#4796c7] rounded-t-[4px] relative transition-all duration-300 hover:opacity-80 group/bar" style={{ height: '2.4%' }}>
                        <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-[#2d3748] text-white text-[10px] py-[2px] px-[6px] rounded opacity-0 group-hover/bar:opacity-100 transition-opacity pointer-events-none z-10 whitespace-nowrap shadow-md">
                          2.4%
                        </div>
                      </div>
                    </div>
                    <span className="text-[11px] text-[#4a5568] whitespace-nowrap absolute -bottom-[20px]">Major Bleeding</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Key Findings List */}
            <div className="bg-white/40 border border-white rounded-[16px] p-[20px] flex flex-col gap-[20px] w-full">
              <div className="flex items-center gap-[12px] w-full">
                <div className="bg-brand-primary/10 p-[6px] rounded-[8px] shrink-0">
                  <div className="w-[20px] h-[20px] relative flex items-center justify-center">
                    <img src={imgIcon7} alt="" className="block w-full h-full object-contain" />
                  </div>
                </div>
                <h3 className="font-bold text-[16px] text-[#2d3748] flex-1">Key Findings</h3>
              </div>

              <ul className="flex flex-col gap-[8px] pl-[2px]">
                <li className="flex items-start gap-[8px] text-[14px] text-[#4a5568]">
                  <span className="text-[#7dc4f0] mt-[2px]">&bull;</span>
                  <span>Adverse event monitoring was conducted systematically using MedDRA version 16.0 classification</span>
                </li>
                <li className="flex items-start gap-[8px] text-[14px] text-[#4a5568]">
                  <span className="text-[#7dc4f0] mt-[2px]">&bull;</span>
                  <span>Both treatment groups showed similar overall adverse event profiles with no statistically significant differences in major bleeding events</span>
                </li>
                <li className="flex items-start gap-[8px] text-[14px] text-[#4a5568]">
                  <span className="text-[#7dc4f0] mt-[2px]">&bull;</span>
                  <span>Safety data collection period: from first dose of study medication up to 30 days following the last administration</span>
                </li>
                <li className="flex items-start gap-[8px] text-[14px] text-[#4a5568]">
                  <span className="text-[#7dc4f0] mt-[2px]">&bull;</span>
                  <span>No confirmed cases of heparin-induced thrombocytopenia (HIT) were reported in either treatment group</span>
                </li>
              </ul>
            </div>

          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-[24px] w-full fade-in">
          {/* Empty State Originally Existing content */}
          <div className="border-2 border-dashed border-white relative rounded-[16px] shrink-0 w-full" style={{ backgroundImage: "linear-gradient(150.483deg, rgba(99, 102, 241, 0.03) 0%, rgba(244, 89, 84, 0.02) 100%)" }}>
            <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center justify-center lg:px-[150px] py-[48px] relative w-full">
              <div className="content-stretch flex flex-col gap-[23px] items-center relative w-full max-w-full px-[20px] lg:px-0">
                <div className="content-stretch flex items-center justify-center px-[12px] relative rounded-[24px] shrink-0 size-[76px]" style={{ backgroundImage: "linear-gradient(135deg, rgba(138, 163, 239, 0.2) 0%, rgba(138, 163, 239, 0.05) 100%)" }}>
                  <div className="relative shrink-0 size-[38px]">
                    <img alt="" className="absolute block max-w-none size-full" src={imgAcademiconsOpenData} />
                  </div>
                </div>
                <div className="h-[28px] relative shrink-0 w-full lg:w-[672px]">
                  <p className="absolute font-outfit font-normal leading-[32px] w-full text-[#2d3748] text-[24px] text-center top-[-1.2px] whitespace-nowrap">
                    Adverse Event Data Not Available
                  </p>
                </div>
                <p className="font-noto-sans font-normal leading-[28px] relative shrink-0 text-[#4a5568] text-[16px] text-center w-full">
                  Structured adverse event records were not provided in the available dataset for this trial. While safety monitoring was conducted during the study, detailed adverse event counts, severity distributions, and common event frequencies are not accessible through the current data source.
                </p>
                <div className="bg-[rgba(255,255,255,0.4)] border-[1.6px] border-solid border-white content-stretch flex flex-col items-start p-[20px] relative rounded-[16px] shrink-0 w-full lg:w-[632px]">
                  <div className="content-stretch flex gap-[12px] items-start relative shrink-0 w-full">
                    <div className="relative shrink-0 size-[20px]">
                      <img alt="" className="absolute block max-w-none size-full" src={imgIcon6} />
                    </div>
                    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-start min-h-px min-w-px relative">
                      <p className="font-noto-sans font-normal leading-[20px] relative shrink-0 text-[#2d3748] text-[14px] whitespace-nowrap">
                        What This Means
                      </p>
                      <div className="content-stretch flex flex-col gap-[6px] items-start relative shrink-0 w-full">
                        <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full">
                          <div className="h-[20px] relative shrink-0 w-[5.688px]">
                            <p className="absolute font-inter font-normal leading-[20px] left-0 not-italic text-[#7DC4F0] text-[14px] top-[-0.2px] whitespace-nowrap">
                              •
                            </p>
                          </div>
                          <p className="flex-[1_0_0] font-noto-sans font-normal leading-[20px] min-h-px min-w-px relative text-[#4a5568] text-[14px]">
                            The study was monitored for safety as required by regulatory standards
                          </p>
                        </div>
                        <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full">
                          <div className="h-[20px] relative shrink-0 w-[5.688px]">
                            <p className="absolute font-inter font-normal leading-[20px] left-0 not-italic text-[#7DC4F0] text-[14px] top-[-0.2px] whitespace-nowrap">
                              •
                            </p>
                          </div>
                          <p className="flex-[1_0_0] font-noto-sans font-normal leading-[20px] min-h-px min-w-px relative text-[#4a5568] text-[14px]">
                            Adverse event data may be available in the full clinical study report or published papers
                          </p>
                        </div>
                        <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full">
                          <div className="h-[20px] relative shrink-0 w-[5.688px]">
                            <p className="absolute font-inter font-normal leading-[20px] left-0 not-italic text-[#7DC4F0] text-[14px] top-[-0.2px] whitespace-nowrap">
                              •
                            </p>
                          </div>
                          <p className="flex-[1_0_0] font-noto-sans font-normal leading-[20px] min-h-px min-w-px relative text-[#4a5568] text-[14px]">
                            Contact the study sponsor or search medical literature for detailed safety information
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col lg:flex-row gap-[16px] lg:gap-[0px] w-full lg:w-[672px] lg:h-[113.563px] opacity-40 relative shrink-0 items-center justify-between">
                  {/* Box 1 */}
                  <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex flex-col gap-[4px] h-[113.563px] items-start pb-[0.8px] pt-[20.8px] px-[20.8px] rounded-[16px] w-full lg:w-[213.325px]">
                    <div className="content-stretch flex h-[15.988px] items-start relative shrink-0 w-full">
                      <p className="flex-[1_0_0] font-noto-sans font-normal leading-[16px] min-h-px min-w-px relative text-[#99a9c0] text-[12px] text-center">
                        Total Events
                      </p>
                    </div>
                    <div className="content-stretch flex h-[31.988px] items-start relative shrink-0 w-full">
                      <p className="flex-[1_0_0] font-inter font-bold leading-[32px] min-h-px min-w-px not-italic relative text-[#2d3748] text-[24px] text-center">
                        —
                      </p>
                    </div>
                    <div className="content-stretch flex h-[15.988px] items-start relative shrink-0 w-full">
                      <p className="flex-[1_0_0] font-noto-sans font-normal leading-[16px] min-h-px min-w-px relative text-[#99a9c0] text-[12px] text-center">
                        Not reported
                      </p>
                    </div>
                  </div>
                  {/* Box 2 */}
                  <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex flex-col gap-[4px] h-[113.563px] items-start pb-[0.8px] pt-[20.8px] px-[20.8px] rounded-[16px] w-full lg:w-[213.338px]">
                    <div className="content-stretch flex h-[15.988px] items-start relative shrink-0 w-full">
                      <p className="flex-[1_0_0] font-noto-sans font-normal leading-[16px] min-h-px min-w-px relative text-[#99a9c0] text-[12px] text-center">
                        Serious AEs
                      </p>
                    </div>
                    <div className="content-stretch flex h-[31.988px] items-start relative shrink-0 w-full">
                      <p className="flex-[1_0_0] font-inter font-bold leading-[32px] min-h-px min-w-px not-italic relative text-[#2d3748] text-[24px] text-center">
                        —
                      </p>
                    </div>
                    <div className="content-stretch flex h-[15.988px] items-start relative shrink-0 w-full">
                      <p className="flex-[1_0_0] font-noto-sans font-normal leading-[16px] min-h-px min-w-px relative text-[#99a9c0] text-[12px] text-center">
                        Not reported
                      </p>
                    </div>
                  </div>
                  {/* Box 3 */}
                  <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex flex-col gap-[4px] h-[113.563px] items-start pb-[0.8px] pt-[20.8px] px-[20.8px] rounded-[16px] w-full lg:w-[213.325px]">
                    <div className="content-stretch flex h-[15.988px] items-start relative shrink-0 w-full">
                      <p className="flex-[1_0_0] font-noto-sans font-normal leading-[16px] min-h-px min-w-px relative text-[#99a9c0] text-[12px] text-center">
                        Grade 3+ Events
                      </p>
                    </div>
                    <div className="content-stretch flex h-[31.988px] items-start relative shrink-0 w-full">
                      <p className="flex-[1_0_0] font-inter font-bold leading-[32px] min-h-px min-w-px not-italic relative text-[#2d3748] text-[24px] text-center">
                        —
                      </p>
                    </div>
                    <div className="content-stretch flex h-[15.988px] items-start relative shrink-0 w-full">
                      <p className="flex-[1_0_0] font-noto-sans font-normal leading-[16px] min-h-px min-w-px relative text-[#99a9c0] text-[12px] text-center">
                        Not reported
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-[rgba(255,255,255,0.4)] border border-solid border-white rounded-[16px] w-full p-[20px]">
            <div className="flex flex-col gap-[20px] w-full">
              <div className="flex items-center gap-[12px] w-full">
                <div className="bg-brand-primary/10 p-[6px] rounded-[8px] shrink-0">
                  <div className="relative size-[20px] flex items-center justify-center">
                    <img alt="" className="block w-full h-full object-contain" src={imgIcon7} />
                  </div>
                </div>
                <p className="font-noto-sans font-bold leading-[20px] text-[#2d3748] text-[16px] flex-1">
                  Important Safety Context
                </p>
              </div>
              <p className="font-noto-sans font-normal leading-[28px] text-[#4a5568] text-[16px] w-full">
                As a Phase I trial, the primary objective was to establish the Maximum Tolerated Dose (MTD) of hyperthermic cisplatin. Safety monitoring was intensive, with dose-limiting toxicities (DLTs) carefully tracked at 30 minutes, 60 minutes, and 24 hours post-infusion. The study design included dose escalation protocols to ensure participant safety while identifying optimal dosing parameters.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
