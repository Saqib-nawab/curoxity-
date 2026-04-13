import sys

def main():
    with open('src/pages/TrialDetailPage.tsx', 'r', encoding='utf-8') as f:
        lines = f.readlines()

    start_idx = -1
    end_idx = -1

    for i, line in enumerate(lines):
        if '              {/* Study Location */}' in line:
            start_idx = i
        if '              {/* Discussion & Expert Insights */}' in line and start_idx != -1:
            end_idx = i
            break

    if start_idx == -1 or end_idx == -1:
        print("Could not find start or end markers for Study Location.")
        sys.exit(1)

    new_content = """              {/* Study Location */}
              <section className="bg-white/40 backdrop-blur-md border border-white/80 rounded-[24px] p-[33.6px] shadow-sm w-full mt-2 flex flex-col gap-[24px]">
                <div className="flex items-center justify-between w-full">
                  <h2 className="font-display font-medium text-[24px] leading-[32px] text-text-primary">Study Location</h2>
                  <div className="bg-[rgba(138,163,239,0.08)] rounded-[10px] pl-[12px] pr-[16px] py-[6px] flex items-center gap-[8px]">
                    <svg className="w-4 h-4 text-[#7DC4F0]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.242-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    <span className="font-medium text-[#7DC4F0] text-[14px]">1 Site</span>
                  </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-[16px] w-full items-stretch">
                  <div className="flex flex-col gap-[16px] w-full lg:w-[308px] shrink-0">
                    <div className="border-[1.6px] border-[rgba(138,163,239,0.2)] rounded-[16px] pt-[21.6px] pb-[16px] px-[21.6px] flex flex-col gap-[16px]" style={{ backgroundImage: "linear-gradient(138.139deg, rgba(138, 163, 239, 0.08) 0%, rgba(0, 0, 0, 0) 100%)" }}>
                      <div className="flex gap-[12px] items-start w-full">
                        <div className="bg-[#7DC4F0] rounded-[10px] w-[40px] h-[40px] flex items-center justify-center shrink-0">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                        </div>
                        <div className="flex flex-col gap-[4px] w-full">
                          <div className="flex items-center gap-[8px]">
                            <h3 className="font-semibold text-text-primary text-[14px] leading-[20px]">Primary Site</h3>
                            <span className="bg-[#14b8a6] text-white text-[12px] leading-[16px] px-[8px] py-[2px] rounded-full">Active</span>
                          </div>
                          <span className="text-[#99a9c0] text-[12px] leading-[16px]">Site ID: 001</span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-[12px] w-full">
                        <div className="flex flex-col gap-[4px] w-full">
                          <span className="text-[#99a9c0] text-[12px] leading-[16px]">Facility Name</span>
                          <span className="font-semibold text-text-primary text-[14px] leading-[20px]">University of Texas MD Anderson Cancer Center</span>
                        </div>
                        <div className="flex flex-col w-full gap-0">
                          <span className="text-[#99a9c0] text-[12px] leading-[16px]">Location</span>
                          <span className="text-[#4a5568] text-[14px] leading-[20px]">Houston, Texas</span>
                          <span className="text-[#4a5568] text-[14px] leading-[20px]">United States</span>
                        </div>
                        <div className="border-t border-[rgba(138,163,239,0.2)] pt-[12.8px] w-full mt-1">
                          <button className="flex items-center gap-[8px] text-[#7DC4F0] font-medium text-[14px] leading-[20px] hover:underline cursor-pointer">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                            Open in Google Maps
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="bg-[#fafbfc] border border-[#e2e8f0] rounded-[14px] pt-[20.8px] pb-[16px] px-[20.8px] flex flex-col gap-[12px] w-full">
                      <div className="flex items-center gap-[8px]">
                        <svg className="w-4 h-4 text-[#2d3748]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                        <h4 className="font-semibold text-[#2d3748] text-[12px] leading-[16px]">Contact Information</h4>
                      </div>
                      <div className="flex flex-col gap-[8px] w-full mt-1">
                        <div className="flex flex-col w-full">
                          <span className="text-[#99a9c0] text-[12px] leading-[16px]">Sponsor</span>
                          <span className="text-[#4a5568] text-[14px] leading-[20px]">M.D. Anderson Cancer Center</span>
                        </div>
                        <div className="flex flex-col w-full transition-all">
                          <span className="text-[#99a9c0] text-[12px] leading-[16px]">Status</span>
                          <span className="text-[#f45954] font-medium text-[14px] leading-[20px]">Enrollment Closed</span>
                          <span className="text-[#99a9c0] text-[12px] leading-[16px] mt-1">Study completed Aug 2020</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-[8px] w-full">
                      <div className="bg-white border border-[#e2e8f0] rounded-[10px] flex flex-col items-center justify-center py-[12px]">
                        <span className="font-bold text-[#7DC4F0] text-[24px] leading-[32px]">1</span>
                        <span className="text-[#99a9c0] text-[12px] leading-[16px]">Total Sites</span>
                      </div>
                      <div className="bg-white border border-[#e2e8f0] rounded-[10px] flex flex-col items-center justify-center py-[12px]">
                        <span className="font-bold text-[#14b8a6] text-[24px] leading-[32px]">7</span>
                        <span className="text-[#99a9c0] text-[12px] leading-[16px]">Enrolled</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 border-[1.6px] border-[rgba(138,163,239,0.15)] rounded-[16px] overflow-hidden relative min-h-[400px] w-full" style={{ backgroundImage: "linear-gradient(147.995deg, rgb(232, 236, 249) 0%, rgb(241, 244, 251) 100%)" }}>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="relative">
                        <div className="w-12 h-12 rounded-full bg-[#7DC4F0] flex items-center justify-center shadow-lg relative z-10 shadow-[#7DC4F0]/40 border-4 border-white">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.242-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        </div>
                        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-[#7DC4F0] rotate-45 z-0"></div>
                        <div className="absolute top-[56px] left-1/2 transform -translate-x-1/2 whitespace-nowrap bg-white px-[16.8px] py-[8.8px] border border-[#e2e8f0] shadow-md rounded-[10px] text-[12px] font-semibold text-[#2d3748] z-20">
                          Houston, TX
                        </div>
                      </div>
                    </div>
                    <div className="absolute bottom-4 right-4 flex gap-[8px]">
                      <button className="w-[40px] h-[40px] rounded-[10px] bg-white shadow-md border border-[#e2e8f0] flex items-center justify-center text-[18px] font-bold text-[#4a5568] hover:bg-[#F8FAFC] transition-colors">+</button>
                      <button className="w-[40px] h-[40px] rounded-[10px] bg-white shadow-md border border-[#e2e8f0] flex items-center justify-center text-[18px] font-bold text-[#4a5568] hover:bg-[#F8FAFC] transition-colors">−</button>
                    </div>
                  </div>
                </div>

                <div className="bg-[rgba(138,163,239,0.05)] border-[0.8px] border-[rgba(138,163,239,0.15)] rounded-[14px] pt-[16.8px] pb-[16.8px] px-[16.8px] w-full">
                  <p className="text-[14px] leading-[20px] text-[#4a5568]">
                    <span className="font-bold text-[#2d3748]">Geographic Note:</span> This trial was conducted exclusively at MD Anderson Cancer Center in Houston, Texas. While your search specified Germany as a location preference, this U.S.-based trial matched due to its use of cisplatin in thoracic cancer treatment, which may provide relevant insights despite the geographic difference.
                  </p>
                </div>
              </section>
"""

    lines = lines[:start_idx] + [new_content + "\n\n"] + lines[end_idx:]

    with open('src/pages/TrialDetailPage.tsx', 'w', encoding='utf-8') as f:
        f.writelines(lines)
    
    print(f"Successfully replaced Study Location code. Start: {start_idx}, End: {end_idx}")

if __name__ == "__main__":
    main()
