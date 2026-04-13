import React, { useState } from 'react';
import { useMessageContext } from '../context/MessageContext';

const LoginModal: React.FC = () => {
  const { isLoginModalOpen, setLoginModalOpen } = useMessageContext();
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');

  if (!isLoginModalOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0f172a]/40 backdrop-blur-[2px] px-4 py-2 md:py-6">
      <div className="relative w-full max-w-[1040px] max-h-[98vh] bg-white rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.15)] overflow-hidden flex flex-col md:flex-row animate-in fade-in zoom-in duration-300">
        {/* Close Button */}
        <button
          onClick={() => setLoginModalOpen(false)}
          className="absolute top-6 right-6 z-20 w-8 h-8 rounded-full bg-[#F8FAFC] flex items-center justify-center text-slate-400 hover:bg-[#f1f5f9] hover:text-[#475569] transition-all"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        {/* Left Side - Branding */}
        <div className="hidden md:flex w-[42%] bg-[#F8FAFC] relative flex-col justify-between p-12 border-r border-[#f1f5f9]">
          <div>
            <div className="flex items-center gap-3 mb-8">
              <img src="/navbarLogo.svg" alt="clinEvidence" className="h-7" />
            </div>
          </div>

          <div className="relative z-10 mt-auto mb-12">
            <h2
              className="font-outfit text-[56px] leading-[64px] mb-4 font-normal tracking-[-2.24px] bg-clip-text text-transparent"
              style={{ backgroundImage: "linear-gradient(172.53deg, #7DC4F0 30%, #FFFFFF 100%)" }}
            >
              Continue Your Search
            </h2>
            <p className="font-noto-sans text-[20px] text-text-secondary max-w-[340px] leading-[32px]">
              Create a free account to keep exploring clinical trials and personalized matches.
            </p>
          </div>

          {/* Abstract background element - more subtle */}
          <div className="absolute bottom-0 right-0 w-full h-1/2 opacity-[0.03] pointer-events-none">
            <img src="/Logo Container.svg" alt="" className="w-full h-full object-contain object-right-bottom scale-[1.8] translate-x-1/4 translate-y-1/4" />
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="flex-1 px-6 py-8 md:p-12 flex flex-col items-center justify-center bg-white overflow-hidden">
          <div className="w-full max-w-[340px]">
            {/* Tabs */}
            <div className="flex bg-[#f1f5f9] p-1 rounded-[14px] mb-6 w-fit mx-auto px-1 border border-[#f1f5f9] shadow-sm">
              <button
                onClick={() => setActiveTab('login')}
                className={`px-8 py-1.5 rounded-[10px] text-[13px] font-semibold transition-all ${activeTab === 'login' ? 'bg-brand-primary text-white shadow-sm' : 'text-[#64748b] hover:text-[#475569]'}`}
              >
                Log in
              </button>
              <button
                onClick={() => setActiveTab('signup')}
                className={`px-8 py-1.5 rounded-[10px] text-[13px] font-semibold transition-all ${activeTab === 'signup' ? 'bg-brand-primary text-white shadow-sm' : 'text-[#64748b] hover:text-[#475569]'}`}
              >
                Sign up
              </button>
            </div>

            <div className="text-center mb-5">
              <h3 className="font-outfit text-[24px] text-[#0f172a] mb-1 font-normal">
                {activeTab === 'login' ? 'Welcome back' : 'Create an account'}
              </h3>
              <p className="font-noto-sans text-[14px] text-[#64748b]">
                {activeTab === 'login'
                  ? 'Log in to continue finding trials that match your needs.'
                  : 'Join clinEvidence to explore personalized clinical trials.'}
              </p>
            </div>

            <form className="space-y-3 mb-4">
              {activeTab === 'signup' && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                  <label className="block text-[13px] font-semibold text-[#334155] mb-2 ml-1">Full name</label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    className="w-full px-4 py-3 bg-[#F8FAFC] border border-border-default rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/10 focus:border-brand-primary transition-all font-noto-sans text-[15px] placeholder:text-slate-400"
                  />
                </div>
              )}
              <div>
                <label className="block text-[13px] font-semibold text-[#334155] mb-2 ml-1">Email address</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 bg-[#F8FAFC] border border-border-default rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/10 focus:border-brand-primary transition-all font-noto-sans text-[15px] placeholder:text-slate-400"
                />
              </div>
              <div>
                <div className="flex justify-between items-center mb-2 ml-1">
                  <label className="block text-[13px] font-semibold text-[#334155]">Password</label>
                  {activeTab === 'login' && (
                    <button type="button" className="text-[12px] text-brand-primary font-semibold hover:underline">Forgot password?</button>
                  )}
                </div>
                <div className="relative">
                  <input
                    type="password"
                    placeholder={activeTab === 'login' ? 'Enter your password' : 'Create a strong password'}
                    className="w-full px-4 py-3 bg-[#F8FAFC] border border-border-default rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/10 focus:border-brand-primary transition-all font-noto-sans text-[15px] placeholder:text-slate-400"
                  />
                  <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 py-1 ml-1">
                <input type="checkbox" id="remember" className="w-4 h-4 rounded border-[#cbd5e1] text-brand-primary focus:ring-brand-primary cursor-pointer" />
                <label htmlFor="remember" className="text-[13px] text-[#64748b] cursor-pointer">
                  {activeTab === 'login' ? 'Remember me' : 'I agree to the terms and privacy policy'}
                </label>
              </div>

              <button className="w-full py-3.5 bg-brand-primary hover:bg-brand-primary/90 text-white font-semibold rounded-xl transition-all shadow-lg shadow-brand-primary/20 mt-2">
                {activeTab === 'login' ? 'Log in' : 'Sign up'}
              </button>
            </form>

            <div className="relative mb-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#f1f5f9]"></div>
              </div>
              <div className="relative flex justify-center text-[10px] uppercase tracking-wider">
                <span className="bg-white px-3 text-[#94A3B8] font-bold">OR</span>
              </div>
            </div>

            <button className="w-full py-3 bg-white border border-border-default hover:bg-[#F8FAFC] text-[#475569] font-semibold rounded-xl transition-all flex items-center justify-center gap-2.5 text-[14px]">
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Continue with Google
            </button>

            <div className="mt-4 text-center text-[12px] text-[#64748b]">
              Don't have an account? <button
                onClick={() => setActiveTab('signup')}
                className="text-brand-primary font-bold hover:underline ml-1"
              >Sign up</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
