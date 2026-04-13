const imgBackgroundImage = "./about-bg.svg";
const imgSolarArrowUpOutline = "./arrow-right.svg";

export default function CTASection() {
  return (
    <section className="w-full max-w-[1780px] mx-auto px-[70px] py-16 relative z-20">
      <div className="bg-brand-primary/10 border border-white rounded-[24px] p-4 relative overflow-hidden h-[517px] flex items-center justify-center">
        {/* Background Image Container */}
        <div className="absolute inset-4 rounded-[16px] overflow-hidden">
          <img src={imgBackgroundImage} alt="about bg" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60"></div>
        </div>

        {/* Content Content Overlay */}
        <div className="relative z-10 flex flex-col items-center gap-12 w-full max-w-[922px]">
          <h2 className="font-outfit font-medium text-[56px] leading-[64px] text-white tracking-[-0.56px] text-center shadow-sm drop-shadow-lg">
            About clinEvidence
          </h2>
          <div className="bg-white/10 backdrop-blur-md rounded-[24px] p-8 border border-white/20 transition-all hover:bg-white/15">
            <p className="font-noto-sans text-[16px] leading-[28px] text-white text-center">
              clinEvidence is a Clinical Intelligence Navigator that empowers patients to discover and connect with clinical trials worldwide. Using advanced AI technology, we simplify the complex process of finding trials that match your unique medical profile, bringing hope and innovative treatment options to those who need them most.
            </p>
          </div>
          <button className="bg-brand-primary text-white flex items-center gap-3 pl-5 pr-[6px] py-[6px] rounded-[100px] font-noto-sans text-[15px] font-medium shadow-sm hover:opacity-90 transition-opacity">
            Learn More About Us
            <div className="bg-white rounded-full w-[34px] h-[34px] flex items-center justify-center text-brand-primary rotate-90">
              <img src={imgSolarArrowUpOutline} alt="arrow" className="w-[18px] h-[18px] -rotate-90" />
            </div>
          </button>
        </div>
      </div>
    </section>
  );
}
