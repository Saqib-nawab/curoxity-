'use client';

import React, { useState } from 'react';
import { useMessageContext } from '@/src/context/MessageContext';
import AuthForm from '@/src/components/auth/AuthForm';

const LoginModal: React.FC = () => {
  const { isLoginModalOpen, setLoginModalOpen } = useMessageContext();
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');

  if (!isLoginModalOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0f172a]/40 backdrop-blur-[2px] px-4 py-2 md:py-6">
      <div className="relative w-full max-w-[1040px] max-h-[98vh] bg-white rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.15)] overflow-hidden flex flex-col md:flex-row animate-fadeIn">
        <button
          onClick={() => setLoginModalOpen(false)}
          className="absolute top-6 right-6 z-20 w-8 h-8 rounded-full bg-[#F8FAFC] flex items-center justify-center text-slate-400 hover:bg-[#f1f5f9] hover:text-[#475569] transition-all"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div className="hidden md:flex w-[42%] bg-[#F8FAFC] relative flex-col justify-between p-12 border-r border-[#f1f5f9]">
          <div>
            <div className="flex items-center gap-3 mb-8">
              <img src="/navbarLogo.svg" alt="clinEvidence" className="h-7" />
            </div>
          </div>

          <div className="relative z-10 mt-auto mb-12">
            <h2
              className="font-outfit text-[56px] leading-[64px] mb-4 font-normal tracking-[-2.24px] bg-clip-text text-transparent"
              style={{ backgroundImage: 'linear-gradient(172.53deg, #7DC4F0 30%, #FFFFFF 100%)' }}
            >
              Continue Your Search
            </h2>
            <p className="font-noto-sans text-[20px] text-text-secondary max-w-[340px] leading-[32px]">
              Create a free account to keep exploring clinical trials and personalized matches.
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

        <div className="flex-1 px-6 py-8 md:p-12 flex flex-col items-center justify-center bg-white overflow-y-auto">
          <AuthForm
            mode={activeTab}
            onModeChange={setActiveTab}
            isModal
            onSuccess={() => setLoginModalOpen(false)}
          />
        </div>
      </div>
    </div>
  );
};

export default LoginModal;