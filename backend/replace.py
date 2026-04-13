import sys

def main():
    with open('src/pages/TrialDetailPage.tsx', 'r', encoding='utf-8') as f:
        lines = f.readlines()

    start_idx = -1
    end_idx = -1

    for i, line in enumerate(lines):
        if '              {/* Results & Efficacy */}' in line:
            start_idx = i
        if '              {/* Study Location */}' in line and start_idx != -1:
            end_idx = i
            break

    if start_idx == -1 or end_idx == -1:
        print("Could not find start or end markers.")
        sys.exit(1)

    new_content = """              {/* Results & Efficacy */}
              <section className="bg-white/40 backdrop-blur-md border border-white/80 flex flex-col gap-[24px] items-start pb-[1.6px] pt-[33.6px] px-[33.6px] relative rounded-[24px] shadow-sm w-full mt-2">
                <div className="flex items-center justify-between w-full">
                  <h2 className="font-display font-normal text-[24px] leading-[32px] text-text-primary">Results & Efficacy</h2>
                  <div className="bg-[rgba(20,184,166,0.08)] rounded-[10px] px-[12px] py-[6px] flex items-center gap-[8px]">
                    <svg className="w-4 h-4 text-[#14b8a6]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <span className="font-medium text-[#14b8a6] text-[14px]">Study Completed</span>
                  </div>
                </div>

                {/* Primary Endpoint */}
                <div className="border-[1.6px] border-[rgba(20,184,166,0.2)] rounded-[16px] p-[25.6px] w-full flex flex-col items-start gap-4 mt-2" style={{ backgroundImage: "linear-gradient(160.374deg, rgba(20, 184, 166, 0.05) 0%, rgba(0, 0, 0, 0) 100%)" }}>
                  <div className="flex gap-[16px] w-full flex-col md:flex-row">
                    <div className="w-[56px] h-[56px] rounded-[14px] flex items-center justify-center shrink-0" style={{ backgroundImage: "linear-gradient(135deg, rgba(20, 184, 166, 0.2) 0%, rgba(20, 184, 166, 0.05) 100%)" }}>
                      <svg className="w-7 h-7 text-[#14b8a6]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    </div>
                    <div className="flex flex-col w-full">
                      <div className="flex gap-[12px] items-center mb-1">
                        <h3 className="font-semibold text-text-primary text-[18px]">Primary Endpoint</h3>
                        <span className="bg-[#14b8a6] text-white text-[12px] font-medium px-[8px] py-[2px] rounded-[26843500px]">Primary</span>
                      </div>
                      <p className="font-bold text-[#14b8a6] text-[24px] mb-4">Maximum Tolerated Dose (MTD) of HITC</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 mt-2">
                        <div className="bg-white/60 border border-[rgba(20,184,166,0.2)] rounded-[10px] p-[16.8px] flex flex-col gap-1">
                          <span className="text-[#99a9c0] text-[12px] font-normal">Assessment Point 1</span>
                          <span className="font-semibold text-text-primary text-[14px]">30 min post-infusion</span>
                          <span className="text-[#4a5568] text-[12px] font-normal">Dose level change tracked</span>
                        </div>
                        <div className="bg-white/60 border border-[rgba(20,184,166,0.2)] rounded-[10px] p-[16.8px] flex flex-col gap-1">
                          <span className="text-[#99a9c0] text-[12px] font-normal">Assessment Point 2</span>
                          <span className="font-semibold text-text-primary text-[14px]">60 min post-infusion</span>
                          <span className="text-[#4a5568] text-[12px] font-normal">Dose level change tracked</span>
                        </div>
                        <div className="bg-white/60 border border-[rgba(20,184,166,0.2)] rounded-[10px] p-[16.8px] flex flex-col gap-1">
                          <span className="text-[#99a9c0] text-[12px] font-normal">Assessment Point 3</span>
                          <span className="font-semibold text-text-primary text-[14px]">24 hours post</span>
                          <span className="text-[#4a5568] text-[12px] font-normal">Safety monitoring</span>
                        </div>
                      </div>

                      <div className="bg-white border border-[rgba(20,184,166,0.15)] rounded-[10px] p-[16.8px]">
                        <p className="text-[#4a5568] text-[14px] leading-relaxed">
                          <span className="font-bold text-text-primary">Measurement:</span> The study evaluated dose-limiting toxicities at escalating cisplatin doses, starting at <span className="font-medium text-text-primary">120 mg/m²</span> with hyperthermic perfusion at <span className="font-medium text-text-primary">41°C (±0.5°C)</span> for 60 minutes. The goal was to identify the highest dose that could be safely administered without unacceptable toxicity.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Secondary Endpoint */}
                <div className="border-[1.6px] border-[rgba(138,163,239,0.2)] rounded-[16px] p-[25.6px] w-full flex flex-col items-start gap-4 mt-2" style={{ backgroundImage: "linear-gradient(161.572deg, rgba(138, 163, 239, 0.05) 0%, rgba(0, 0, 0, 0) 100%)" }}>
                  <div className="flex gap-[16px] w-full flex-col md:flex-row">
                    <div className="w-[56px] h-[56px] rounded-[14px] flex items-center justify-center shrink-0" style={{ backgroundImage: "linear-gradient(135deg, rgba(138, 163, 239, 0.2) 0%, rgba(138, 163, 239, 0.05) 100%)" }}>
                      <svg className="w-7 h-7 text-[#7DC4F0]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                    </div>
                    <div className="flex flex-col w-full">
                      <div className="flex gap-[12px] items-center mb-1">
                        <h3 className="font-semibold text-text-primary text-[18px]">Secondary Endpoint</h3>
                        <span className="bg-[#7DC4F0] text-white text-[12px] font-medium px-[8px] py-[2px] rounded-[26843500px]">Secondary</span>
                      </div>
                      <p className="font-bold text-[#7DC4F0] text-[24px] mb-4">Time to Relapse</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 mt-2">
                        <div className="bg-white/60 border border-[rgba(138,163,239,0.2)] rounded-[10px] p-[16.8px] flex flex-col gap-1">
                          <span className="text-[#99a9c0] text-[12px] font-normal">Primary Assessment</span>
                          <span className="font-semibold text-text-primary text-[14px]">3 months post-op</span>
                          <span className="text-[#4a5568] text-[12px] font-normal">CT scan + physical exam</span>
                        </div>
                        <div className="bg-white/60 border border-[rgba(138,163,239,0.2)] rounded-[10px] p-[16.8px] flex flex-col gap-1">
                          <span className="text-[#99a9c0] text-[12px] font-normal">Follow-up Assessment</span>
                          <span className="font-semibold text-text-primary text-[14px]">6 months post-op</span>
                          <span className="text-[#4a5568] text-[12px] font-normal">CT scan + physical exam</span>
                        </div>
                      </div>

                      <div className="bg-white border border-[rgba(138,163,239,0.15)] rounded-[10px] p-[16.8px]">
                        <p className="text-[#4a5568] text-[14px] leading-relaxed">
                          <span className="font-bold text-text-primary">Measurement:</span> Measurable disease was evaluated using CT imaging and physical examination at 3 and 6 months postoperatively to assess disease progression, recurrence, or relapse following cytoreductive surgery and HITC.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Outcome Data Availability */}
                <div className="bg-[#fafbfc] border border-[#e2e8f0] rounded-[14px] p-[24.8px] w-full mt-2">
                  <div className="flex flex-col gap-[12px]">
                    <h4 className="font-semibold text-text-primary text-[14px]">Outcome Data Availability</h4>
                    <p className="text-[14px] text-text-secondary leading-relaxed">
                      This trial was completed on August 25, 2020. While endpoint measurement protocols are documented, <span className="font-bold text-text-primary">numeric outcome values and statistical results are not available</span> in the current dataset. Full results may be published in peer-reviewed medical journals or available through the study sponsor.
                    </p>
                    <div className="flex flex-col md:flex-row gap-[16px] md:gap-[24px] pt-[16px] border-t border-[#e2e8f0] mt-2 w-full">
                      <div className="flex items-center gap-[8px]">
                        <div className="w-[8px] h-[8px] rounded-full bg-[#14b8a6]"></div>
                        <span className="text-[12px] text-[#4a5568]">MTD endpoint defined</span>
                      </div>
                      <div className="flex items-center gap-[8px]">
                        <div className="w-[8px] h-[8px] rounded-full bg-[#7DC4F0]"></div>
                        <span className="text-[12px] text-[#4a5568]">Relapse tracking completed</span>
                      </div>
                      <div className="flex items-center gap-[8px]">
                        <div className="w-[8px] h-[8px] rounded-full bg-[#e2e8f0]"></div>
                        <span className="text-[12px] text-[#99a9c0]">Numeric results pending publication</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Endpoint Assessment Timeline */}
                <div className="border-[0.8px] border-[rgba(138,163,239,0.15)] rounded-[14px] p-[24.8px] w-full mt-2 flex flex-col gap-[24px]" style={{ backgroundImage: "linear-gradient(90deg, rgba(138, 163, 239, 0.05) 0%, rgba(20, 184, 166, 0.05) 100%)" }}>
                  <h4 className="font-semibold text-text-primary text-[14px]">Endpoint Assessment Timeline</h4>
                  <div className="relative w-full overflow-x-auto pb-4">
                    {/* Timeline Line Context */}
                    <div className="absolute top-[24px] left-[24px] right-[24px] h-[3px] rounded-full" style={{ backgroundImage: "linear-gradient(90deg, rgb(138, 163, 239) 0%, rgb(20, 184, 166) 50%, rgb(138, 163, 239) 100%)" }}></div>
                    <div className="flex justify-between relative min-w-[700px] z-10 px-0">
                      
                      <div className="flex flex-col items-center">
                        <div className="w-[48px] h-[48px] rounded-full bg-[#7DC4F0] border-[4px] border-white shadow-md flex items-center justify-center text-white font-bold text-[12px] mb-2 z-10 transition-transform hover:scale-110">T0</div>
                        <span className="font-semibold text-text-primary text-[12px]">Surgery</span>
                        <span className="text-text-muted text-[12px]">Day 0</span>
                      </div>
                      
                      <div className="flex flex-col items-center">
                        <div className="w-[48px] h-[48px] rounded-full bg-[#14b8a6] border-[4px] border-white shadow-md flex items-center justify-center text-white font-bold text-[12px] mb-2 z-10 transition-transform hover:scale-110">30m</div>
                        <span className="font-semibold text-text-primary text-[12px]">Check 1</span>
                        <span className="text-text-muted text-[12px]">30 min</span>
                      </div>

                      <div className="flex flex-col items-center">
                        <div className="w-[48px] h-[48px] rounded-full bg-[#14b8a6] border-[4px] border-white shadow-md flex items-center justify-center text-white font-bold text-[12px] mb-2 z-10 transition-transform hover:scale-110">60m</div>
                        <span className="font-semibold text-text-primary text-[12px]">Check 2</span>
                        <span className="text-text-muted text-[12px]">60 min</span>
                      </div>

                      <div className="flex flex-col items-center">
                        <div className="w-[48px] h-[48px] rounded-full bg-[#14b8a6] border-[4px] border-white shadow-md flex items-center justify-center text-white font-bold text-[12px] mb-2 z-10 transition-transform hover:scale-110">24h</div>
                        <span className="font-semibold text-text-primary text-[12px]">Check 3</span>
                        <span className="text-text-muted text-[12px]">24 hours</span>
                      </div>

                      <div className="flex flex-col items-center">
                        <div className="w-[48px] h-[48px] rounded-full bg-[#7DC4F0] border-[4px] border-white shadow-md flex items-center justify-center text-white font-bold text-[12px] mb-2 z-10 transition-transform hover:scale-110">3m</div>
                        <span className="font-semibold text-text-primary text-[12px]">CT Scan</span>
                        <span className="text-text-muted text-[12px]">3 months</span>
                      </div>

                      <div className="flex flex-col items-center">
                        <div className="w-[48px] h-[48px] rounded-full bg-[#7DC4F0] border-[4px] border-white shadow-md flex items-center justify-center text-white font-bold text-[12px] mb-2 z-10 transition-transform hover:scale-110">6m</div>
                        <span className="font-semibold text-text-primary text-[12px]">CT Scan</span>
                        <span className="text-text-muted text-[12px]">6 months</span>
                      </div>

                    </div>
                  </div>
                </div>

              </section>
"""

    lines = lines[:start_idx] + [new_content + "\n"] + lines[end_idx:]

    with open('src/pages/TrialDetailPage.tsx', 'w', encoding='utf-8') as f:
        f.writelines(lines)
    
    print(f"Successfully replaced code. Start: {start_idx}, End: {end_idx}")

if __name__ == "__main__":
    main()
