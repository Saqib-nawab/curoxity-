const imgFrame2121454130 = "/footer-logo.svg";
const imgIcon = "/email.svg"
const imgIcon1 = "/phone.svg"
const imgFrame2121454131 = "/footer-logo-massive.svg"

export default function Footer() {
  return (
    <footer className="w-full bg-brand-primary relative overflow-hidden pt-12 flex flex-col items-center">
      <div className="w-full max-w-[1780px] mx-auto px-[70px] relative z-10 flex flex-col gap-9 pb-12">
        {/* Top Section */}
        <div className="flex flex-wrap lg:flex-nowrap justify-between items-start gap-12 w-full pt-4">

          {/* Logo & Contact col */}
          <div className="flex flex-col gap-4 max-w-[300px]">
            <img src={imgFrame2121454130} alt="clinEvidence" className="w-[120px] h-auto object-contain" />
            <p className="font-noto-sans text-[14px] leading-[22.75px] text-white/60">
              Helping patients make confident decisions about clinical trials.
            </p>
            <div className="flex flex-col gap-3 mt-2">
              <a href="mailto:support@victreat.com" className="flex items-center gap-2 text-[14px] text-white/70 hover:text-white transition-colors font-noto-sans">
                <img src={imgIcon} alt="email" className="w-4 h-4" />
                support@victreat.com
              </a>
              <a href="tel:1-800-555-1234" className="flex items-center gap-2 text-[14px] text-white/70 hover:text-white transition-colors font-noto-sans">
                <img src={imgIcon1} alt="phone" className="w-4 h-4" />
                1-800-555-1234
              </a>
            </div>
          </div>

          {/* Links Grid */}
          <div className="flex flex-wrap gap-20">
            {/* Product */}
            <div className="flex flex-col gap-4">
              <h4 className="font-noto-sans font-semibold text-[16px] leading-[24px] text-white">Product</h4>
              <ul className="flex flex-col gap-3">
                <li><a href="#" className="font-noto-sans text-[14px] text-white/60 hover:text-white transition-colors">Search</a></li>
                <li><a href="#" className="font-noto-sans text-[14px] text-white/60 hover:text-white transition-colors">Trials</a></li>
                <li><a href="#" className="font-noto-sans text-[14px] text-white/60 hover:text-white transition-colors">How it Works</a></li>
              </ul>
            </div>

            {/* Legal */}
            <div className="flex flex-col gap-4">
              <h4 className="font-noto-sans font-semibold text-[16px] leading-[24px] text-white">Legal</h4>
              <ul className="flex flex-col gap-3">
                <li><a href="#" className="font-noto-sans text-[14px] text-white/60 hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="font-noto-sans text-[14px] text-white/60 hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="font-noto-sans text-[14px] text-white/60 hover:text-white transition-colors">Data Security</a></li>
              </ul>
            </div>

            {/* Support */}
            <div className="flex flex-col gap-4">
              <h4 className="font-noto-sans font-semibold text-[16px] leading-[24px] text-white">Support</h4>
              <ul className="flex flex-col gap-3">
                <li><a href="#" className="font-noto-sans text-[14px] text-white/60 hover:text-white transition-colors">FAQ</a></li>
                <li><a href="#" className="font-noto-sans text-[14px] text-white/60 hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="font-noto-sans text-[14px] text-white/60 hover:text-white transition-colors">Resources</a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-[1px] bg-white/10 mt-8 mb-2"></div>

        {/* Bottom Section */}
        <div className="flex flex-wrap justify-between items-center gap-4">
          <p className="font-noto-sans text-[14px] text-white/50">
            © 2026 clinEvidence. All rights reserved.
          </p>
          <p className="font-noto-sans text-[14px] text-white/50">
            Not medical advice. Consult your healthcare provider.
          </p>
        </div>
      </div>

      {/* Huge Bottom Logo */}
      <div className="w-full flex items-end justify-center pointer-events-none overflow-hidden leading-none">
        <img
          src={imgFrame2121454131}
          alt="clinEvidence Logo Background"
          className="w-full min-w-[100vw] p-[40px]"
        />
      </div>
    </footer>
  );
}
