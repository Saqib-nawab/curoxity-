'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMessageContext } from '../context/MessageContext';

const imgHero1 = "/Hero-bg-1.png";
const imgHero2 = "/Hero-bg-2.png";
const imgLogoHero = "./Logo Container.svg";
const imgVector = "./bolt.svg";
const imgGroup = "./search.svg";
const imgSolarArrowUpBoldDuotone = "./arrow_up.svg";

export default function Hero() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const { messageCount, decrementMessages, setLoginModalOpen, isLimitMessageVisible } = useMessageContext();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (messageCount === 0) return;
    const trimmedQuery = searchQuery.trim();
    if (trimmedQuery) {
      decrementMessages();
      router.push(`/search-results?q=${encodeURIComponent(trimmedQuery)}`);
    }
  };

  const isLimitReached = messageCount === 0;

  return (
    <div className="relative w-full min-h-[100svh] p-[20px] flex flex-col items-center overflow-hidden">
      {/* Background Image Container with 20px inset */}
      <div className="absolute inset-0 z-0 m-[20px] rounded-[40px] overflow-hidden bg-[#F1F4FB]/30 border border-white">
        <img alt="background layer 1" className="absolute inset-0 object-cover w-full h-full object-center -z-20 opacity-50" src={imgHero1} />
        <img alt="background layer 2" className="absolute inset-0 object-cover w-full h-full object-center -z-10 opacity-50" src={imgHero2} />
      </div>


      {/* Main Content */}
      <main className="relative z-10 flex-1 flex flex-col  items-center w-full max-w-[1240px] mx-auto gap-8 px-0 md:px-4 mt-16 md:mt-32">
        {/* Hero Text */}
        <div className="flex flex-col items-center gap-4 mb-6 px-4 md:px-0">
          <div className="h-[50px] w-[48px] md:h-[70px] md:w-[68px] mb-1 shrink-0">
            <img alt="logo icon" className="w-full h-full object-contain" src={imgLogoHero} />
          </div>
          <h1 className="font-outfit font-regular text-[24px] md:text-[32px] xl:text-[40px] leading-[1.15] text-text-primary tracking-[-1px] text-center whitespace-normal md:whitespace-nowrap px-2">
            Discover Clinical Trials Backed by Real Evidence
          </h1>
          <p className="font-noto-sans text-[16px] md:text-[18px] xl:text-[20px] leading-[26px] md:leading-[32px] text-text-primary text-center max-w-[800px]">
            Search global clinical research and find trials you may qualify for in seconds.
          </p>
        </div>

        {/* Search & Filter Component */}
        <div className="flex flex-col items-center gap-3 w-full flex-shrink-0 min-h-0">
          {/* Free Messages Badge */}
          <div className="flex items-center gap-3 mb-1">
            <div className="flex items-center gap-2">
              <div className="w-[14px] h-[20px] pb-1">
                <img alt="bolt" src={imgVector} className="w-full h-full object-contain" />
              </div>
              <span className="font-noto-sans text-[16px] text-text-primary font-medium">{messageCount} / 10 free messages</span>
            </div>

            {messageCount > 0 && messageCount <= 3 && (
              <button
                onClick={() => setLoginModalOpen(true)}
                className="flex items-center gap-[8px] px-[12px] py-[4px] rounded-[100px] border-none text-[#f3f3f3] hover:opacity-90 transition-all font-noto-sans text-[14px] font-normal leading-[20px] shadow-sm ml-1"
                style={{ backgroundImage: "linear-gradient(93.14deg, #5C88DA 17.08%, #45B680 161.04%)" }}
              >
                <span>Login</span>
                <div className="rotate-90 flex items-center justify-center">
                  <img src="/arrow-right-white.svg" className="w-[13px] h-[16px] -rotate-90" alt="" />
                </div>
              </button>
            )}
          </div>
        </div>

        {/* Search Bar Container with Glow */}
        <div className="relative w-[calc(100vw-60px)] md:w-full max-w-[896px]">
          {/* Subtle Outer Glow */}
          {/* <div className="absolute -inset-1 bg-gradient-to-r from-brand-primary/40 via-brand-secondary/10 to-brand-primary/40 rounded-[28px] blur-xl opacity-60 pointer-events-none" /> */}

          <div
            className={`relative w-full backdrop-blur-lg rounded-[24px] shadow-sm overflow-hidden ${isLimitReached ? 'cursor-not-allowed' : ''}`}
            style={{
              background: 'linear-gradient(#F8FAFD, #F8FAFD) padding-box, linear-gradient(135deg, #7DC4F0, #4C87AB) border-box',
              border: '2px solid transparent'
            }}
          >
            <form onSubmit={handleSearch} className={`bg-[#FBFCFD] border border-white rounded-[22px] rounded-b-none h-[60px] md:h-[64px] flex items-center px-3 md:px-5 gap-3 md:gap-4 overflow-x-auto no-scrollbar ${isLimitReached ? 'pointer-events-none opacity-60' : ''}`}>
              {/* Search Icon */}
              <div className="w-[34px] h-[34px] md:w-[38px] md:h-[38px] bg-white/40 border border-[#cbd5e1] rounded-xl flex items-center justify-center shrink-0">
                <img src={imgGroup} className="w-4 h-4 md:w-5 md:h-5 opacity-70" alt="search" />
              </div>

              {/* Input */}
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={messageCount > 0 ? "Find clinical trials for your condition..." : "Daily Messages Limit Reached"}
                maxLength={500}
                disabled={isLimitReached}
                className="flex-1 bg-transparent border-none outline-none font-noto-sans text-[14px] md:text-[16px] text-text-primary placeholder:text-text-muted/80 min-w-[250px]"
              />

              {/* Up Arrow Button */}
              <button
                type="submit"
                disabled={isLimitReached}
                className="w-[34px] h-[34px] md:w-[38px] md:h-[38px] bg-white/40 border border-[#cbd5e1] rounded-xl flex items-center justify-center shrink-0 hover:bg-white/60 transition-colors"
              >
                <img src={messageCount > 0 ? imgSolarArrowUpBoldDuotone : "/rate-limit.svg"} className="w-4 h-4 md:w-5 md:h-5 opacity-70" alt="submit" />
              </button>
            </form>

            {/* Filters */}
            <div className={`px-3 md:px-5 py-3 flex flex-row overflow-x-auto no-scrollbar gap-2 md:gap-3 ${isLimitReached ? 'pointer-events-none opacity-60' : ''}`}>
              <button
                disabled={isLimitReached}
                onClick={() => router.push(`/conversation?q=${encodeURIComponent('Phase 3 diabetes trials in Germany')}`)}
                className="bg-white/40 backdrop-blur-md border-[1.6px] border-[#5c88da]/20 px-4 py-1.5 md:px-5 md:py-2 rounded-full font-noto-sans text-[12px] md:text-[14px] text-text-secondary hover:bg-white/60 hover:text-text-primary transition-colors font-medium whitespace-nowrap"
              >
                Phase 3 diabetes trials in Germany
              </button>
              <button
                disabled={isLimitReached}
                onClick={() => router.push(`/conversation?q=${encodeURIComponent('Type 2 diabetes trials')}`)}
                className="bg-white/40 backdrop-blur-md border-[1.6px] border-[#5c88da]/20 px-4 py-1.5 md:px-5 md:py-2 rounded-full font-noto-sans text-[12px] md:text-[14px] text-text-secondary hover:bg-white/60 hover:text-text-primary transition-colors font-medium whitespace-nowrap"
              >
                Type 2 diabetes trials
              </button>
              <button
                disabled={isLimitReached}
                onClick={() => router.push(`/conversation?q=${encodeURIComponent('GLP-1 receptor agonist trials')}`)}
                className="bg-white/40 backdrop-blur-md border-[1.6px] border-[#5c88da]/20 px-4 py-1.5 md:px-5 md:py-2 rounded-full font-noto-sans text-[12px] md:text-[14px] text-text-secondary hover:bg-white/60 hover:text-text-primary transition-colors font-medium whitespace-nowrap"
              >
                GLP-1 receptor agonist trials
              </button>
            </div>
          </div>

          {isLimitReached && isLimitMessageVisible && (
            <div className="mt-3 text-center">
              <span className="font-noto-sans text-[14px] text-red-500 font-medium">
                You have reached your daily messages limit. The limit resets at midnight.
              </span>
            </div>
          )}
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-text-secondary">
          <span className="font-noto-sans text-[14px]">Scroll to Explore</span>
          <svg width="20" height="30" viewBox="0 0 24 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="1" y="1" width="22" height="34" rx="11" stroke="currentColor" strokeWidth="1.5" />
            <path d="M12 8V14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
      </main>
    </div>
  );
}
