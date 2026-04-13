const imgIcon4 = "/assets/49eae7506b2a71eaba08e41655f812409049e171.svg";
const imgIcon5 = "/assets/c4ac3b13be0fd74e5029767316cd2e4f9f594f19.svg";
const imgIcon7 = "/assets/67cc37e4b556976d43e857c2b97a39df72544123.svg";
const imgGroup4960 = "/assets/5f61a7171ea91bb6b0d4c07c8cdfd6db8a465a79.svg";
const imgSolarPhoneBold = "/assets/0d7871c97cb2c98b58007a3d29241c9189ba4a45.svg";

export default function LocationTab() {
  return (
    <div className="bg-[rgba(255,255,255,0.4)] border border-solid border-white flex flex-col gap-[24px] items-start p-4 md:p-[25px] relative rounded-[24px] w-full h-auto" data-name="Container">
      {/* Header */}
      <div className="relative w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">
          <div className="flex gap-[10px] items-center relative">
            <div className="bg-[rgba(255,255,255,0.4)] border-[0.471px] border-solid border-white flex items-center justify-center p-[8px] relative rounded-[12px] shadow-sm shrink-0 size-[48px]">
              <div className="flex items-center justify-center relative shrink-0 size-[24px]">
                <img alt="" className="absolute block max-w-none size-full" src={imgIcon4} />
              </div>
            </div>
            <div className="flex flex-col font-outfit font-bold justify-center relative shrink-0">
              <p className="font-outfit font-normal leading-[1.2] text-[20px] md:text-[24px] text-text-primary">Study Location</p>
            </div>
          </div>
          <div className="bg-[rgba(20,184,166,0.08)] flex gap-[8px] items-center px-[12px] py-[6px] relative rounded-[10px] self-start sm:self-center shrink-0">
            <div className="relative shrink-0 size-[16px]">
              <img alt="" className="absolute block max-w-none size-full" src={imgIcon5} />
            </div>
            <p className="font-noto-sans font-normal leading-[20px] text-[#14b8a6] text-[14px] whitespace-nowrap">
              Study Completed
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex lg:flex-row flex-col gap-[24px] items-start relative w-full h-auto">
        {/* Left Column: Map & Note */}
        <div className="flex flex-col gap-[24px] items-start relative lg:flex-1 w-full h-auto">
          {/* Map Container */}
          <div className="border-[1.6px] border-[rgba(138,163,239,0.15)] border-solid h-[300px] md:h-[403px] overflow-hidden relative rounded-[16px] w-full bg-[#f1f4fb]">
            <iframe
              title="Google Maps Location"
              width="100%"
              height="100%"
              style={{ border: 0, filter: "saturate(0.9) contrast(1.05) brightness(1.02)" }}
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3466.08865682662!2d-95.401135!3d29.706176!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8640c036573c9f2b%3A0xc3f5c5b3b3b3b3b3!2sMD+Anderson+Cancer+Center!5e0!3m2!1sen!2sus"
              allowFullScreen
              loading="lazy"
            ></iframe>
          </div>

          {/* Note Card */}
          <div className="bg-[rgba(244,89,84,0.1)] border border-solid border-white p-[20px] relative rounded-[16px] w-full">
            <p className="font-noto-sans font-normal leading-[1.6] text-[#2d3748] w-full text-[13px] md:text-[14px]">
              <span className="font-bold">Geographic Note: </span>
              <span className="text-[#4a5568]">
                This trial was conducted exclusively at MD Anderson Cancer Center in Houston, Texas. While your search specified Germany as a location preference, this U.S.-based trial matched due to its use of cisplatin in thoracic cancer treatment, which may provide relevant insights despite the geographic difference.
              </span>
            </p>
          </div>
        </div>

        {/* Right Column: Site Info & Stats */}
        <div className="flex flex-col gap-[16px] items-start relative shrink-0 w-full lg:w-[362px] h-auto">
          {/* Primary Site Info */}
          <div className="bg-[rgba(255,255,255,0.4)] border-[1.6px] border-solid border-white flex flex-col gap-[16px] p-[20px] relative rounded-[16px] w-full h-auto">
            <div className="flex gap-[12px] items-center w-full">
              <div className="bg-[#7DC4F0] flex items-center justify-center rounded-[12px] shrink-0 size-[40px]">
                <div className="relative size-[20px]">
                  <img alt="" className="absolute block max-w-none size-full" src={imgIcon7} />
                </div>
              </div>
              <div className="flex flex-1 items-center justify-between">
                <p className="font-noto-sans font-bold leading-[1.2] text-[#2d3748] text-[16px]">
                  Primary Site
                </p>
                <div className="bg-[#14b8a6] px-[8px] py-[2px] rounded-full">
                  <p className="font-noto-sans font-medium text-[11px] text-white whitespace-nowrap">
                    Active
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-[16px] w-full">
              <div className="flex flex-col gap-1">
                <p className="font-noto-sans font-normal text-[#4a5568] text-[11px] uppercase tracking-wider">
                  Facility Name
                </p>
                <p className="font-noto-sans font-medium text-[14px] text-[#2d3748] leading-[1.4]">
                  University of Texas MD Anderson Cancer Center
                </p>
              </div>
              <div className="flex flex-col gap-1">
                <p className="font-noto-sans font-normal text-[#4a5568] text-[11px] uppercase tracking-wider">
                  Location
                </p>
                <p className="font-noto-sans font-medium text-[14px] text-[#2d3748]">
                  Houston, Texas, United States
                </p>
              </div>
              <div className="pt-3 border-t border-[rgba(138,163,239,0.2)]">
                <a
                  href="https://maps.google.com"
                  target="_blank"
                  rel="noreferrer"
                  className="flex gap-2 items-center text-[#2d3748] hover:text-brand-primary transition-colors text-[14px] font-medium underline"
                >
                  <img alt="" className="size-[14px]" src={imgGroup4960} />
                  Open in Google Maps
                </a>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="bg-[rgba(255,255,255,0.4)] border-[1.6px] border-solid border-white flex flex-col gap-[16px] p-[20px] relative rounded-[16px] w-full">
            <div className="flex gap-[8px] items-center w-full">
              <img alt="" className="size-[20px]" src={imgSolarPhoneBold} />
              <p className="font-noto-sans font-bold text-[#2d3748] text-[14px]">
                Contact Information
              </p>
            </div>
            <div className="flex flex-col gap-[12px] w-full">
              <div className="flex flex-col gap-1">
                <p className="font-noto-sans font-normal text-[#4a5568] text-[11px] uppercase tracking-wider">
                  Sponsor
                </p>
                <p className="font-noto-sans font-medium text-[14px] text-[#2d3748]">
                  M.D. Anderson Cancer Center
                </p>
              </div>
              <div className="flex flex-col gap-1">
                <p className="font-noto-sans font-normal text-[#4a5568] text-[11px] uppercase tracking-wider">
                  Status
                </p>
                <p className="font-noto-sans font-semibold text-[14px] text-[#f45954]">
                  Enrollment Closed
                </p>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="flex gap-[16px] items-start w-full">
            <div className="border-[1.6px] border-solid border-white flex-1 flex flex-col gap-[4px] items-center justify-center p-[16px] md:p-[20px] rounded-[16px] bg-white/10" style={{ backgroundImage: "linear-gradient(149.231deg, rgba(138, 163, 239, 0.1) 0%, rgba(0, 0, 0, 0) 100%)" }}>
              <p className="font-outfit font-bold text-[#7DC4F0] text-[20px] md:text-[24px]">1</p>
              <p className="font-noto-sans font-normal text-[#4a5568] text-[12px] whitespace-nowrap">Total Sites</p>
            </div>
            <div className="border-[1.6px] border-solid border-white flex-1 flex flex-col gap-[4px] items-center justify-center p-[16px] md:p-[20px] rounded-[16px] bg-white/10" style={{ backgroundImage: "linear-gradient(149.231deg, rgba(138, 163, 239, 0.1) 0%, rgba(0, 0, 0, 0) 100%)" }}>
              <p className="font-outfit font-bold text-[#7DC4F0] text-[20px] md:text-[24px]">7</p>
              <p className="font-noto-sans font-normal text-[#4a5568] text-[12px] whitespace-nowrap">Enrolled</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
