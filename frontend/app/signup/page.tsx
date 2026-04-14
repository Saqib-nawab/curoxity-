import Navbar from '@/src/components/Navbar';
import Footer from '@/src/components/Footer';
import AuthForm from '@/src/components/auth/AuthForm';

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-[#f1f4fb] flex flex-col">
      <Navbar />

      <main className="flex-1 px-4 pt-[120px] pb-[80px]">
        <div className="max-w-[1200px] mx-auto">
          <div className="rounded-[32px] bg-white/60 border border-white shadow-sm overflow-hidden flex flex-col md:flex-row">
            <div className="hidden md:flex md:w-[42%] bg-[#F8FAFC] relative flex-col justify-between p-12 border-r border-[#f1f5f9]">
              <div className="flex items-center gap-3 mb-8">
                <img src="/navbarLogo.svg" alt="clinEvidence" className="h-7" />
              </div>

              <div className="relative z-10 mt-auto mb-12">
                <h2
                  className="font-outfit text-[56px] leading-[64px] mb-4 font-normal tracking-[-2.24px] bg-clip-text text-transparent"
                  style={{ backgroundImage: 'linear-gradient(172.53deg, #7DC4F0 30%, #FFFFFF 100%)' }}
                >
                  Join Curexity
                </h2>
                <p className="font-noto-sans text-[20px] text-text-secondary max-w-[340px] leading-[32px]">
                  Create a free account to save your progress and keep exploring trial matches.
                </p>
              </div>

              <div className="absolute bottom-0 right-0 w-full h-1/2 opacity-[0.03] pointer-events-none">
                <img
                  src="/Logo Container.svg"
                  alt=""
                  className="w-full h-full object-contain object-right-bottom scale-[1.8] translate-x-1/4 translate-y-1/4"
                />
              </div>
            </div>

            <div className="flex-1 p-6 md:p-12 flex items-center justify-center">
              <AuthForm mode="signup" redirectTo="/" />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}