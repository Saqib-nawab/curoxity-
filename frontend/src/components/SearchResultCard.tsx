import React, { useState } from 'react';
import ViewTrialButton from './ViewTrialButton';

interface TrialData {
  id: string;
  full_title: string;
  sponsor: string;
  matchPercentage: number;
  phase: string;
  allocation: string;
  masking: string;
  controlled: string;
  chunks_summary: string;
  treatment?: string;
  population?: string;
  location?: string;
  duration?: string;
  adverseEvents?: string;
  seriousAdverseEvents?: string;
  results?: string;
}

interface SearchResultCardProps {
  trial: TrialData;
}

const SearchResultCard: React.FC<SearchResultCardProps> = ({ trial }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [rotated, setRotated] = useState(false);

  return (
    <div className="bg-white/40 backdrop-blur-md border-2 border-white p-[26px] rounded-[16px] w-full transition-all">
      {/* Top Section: Title & Match */}
      <div className="flex justify-between items-start gap-4 mb-6">
        <div className="flex-1">
          <h3 className="font-outfit font-normal text-[20px] leading-[32px] text-text-primary mb-2">
            {trial.full_title}
          </h3>
          <div className="flex items-center gap-2">
            <img src="/company.svg" alt="Company" className="w-4 h-4" />
            <span className="font-noto-sans text-[14px] text-text-secondary">{trial.sponsor}</span>
          </div>
        </div>

        <div className="flex gap-2 bg-white/40 border-2 border-white rounded-[16px] px-4 py-2 shrink-0">
          <div className="text-center">
            <div className="font-outfit font-bold text-[24px] leading-[32px] text-brand-secondary">
              {trial.matchPercentage}%
            </div>
            <div className="font-noto-sans font-normal text-[12px] leading-[16px] text-brand-secondary tracking-wider uppercase">
              Match
            </div>
          </div>
        </div>
      </div>

      {/* Tags Section */}
      <div className="flex flex-wrap gap-2 mb-6">
        <div className="bg-white/60 border border-white px-3 py-2 rounded-[10px] flex items-center gap-2">
          <img src="/phase.svg" alt="Phase" className="w-4 h-4" />
          <span className="font-noto-sans text-[12px] text-brand-primary">{trial.phase}</span>
        </div>
        {trial.allocation && trial.allocation !== 'None' && (
          <div className="bg-white/60 border border-white px-3 py-2 rounded-[10px] flex items-center gap-2">
            <img src="/randomized.svg" alt="Allocation" className="w-4 h-4" />
            <span className="font-noto-sans text-[12px] text-brand-primary">{trial.allocation}</span>
          </div>
        )}
        {trial.masking && trial.masking !== 'None' && (
          <div className="bg-white/60 border border-white px-3 py-2 rounded-[10px] flex items-center gap-2">
            <img src="/masking.svg" alt="Masking" className="w-4 h-4" />
            <span className="font-noto-sans text-[12px] text-brand-primary">{trial.masking}</span>
          </div>
        )}
        {trial.controlled && trial.controlled !== 'None' && (
          <div className="bg-white/60 border border-white px-3 py-2 rounded-[10px] flex items-center gap-2">
            <img src="/placebo.svg" alt="Controlled" className="w-4 h-4" />
            <span className="font-noto-sans text-[12px] text-brand-primary">{trial.controlled}</span>
          </div>
        )}
      </div>

      {/* Insight Section */}
      <div className="relative border-2 border-white p-5 rounded-[16px] mb-6 overflow-hidden" style={{ background: "radial-gradient(297.79% 119.9% at 100.9% 26.67%, rgba(138, 163, 239, 0.10) 0%, rgba(138, 163, 239, 0.00) 100%), rgba(255, 255, 255, 0.50)" }}>
        <div className="flex gap-4 items-start relative z-10">
          <div className="w-12 h-12 rounded-full border border-white p-1 shrink-0 bg-white/50">
            <div className="w-full h-full rounded-full bg-brand-primary/10 flex items-center justify-center">
              <img src="/trial-for-you.svg" alt="Insight" className="w-5 h-5 opacity-80" />
            </div>
          </div>
          <div>
            <h4 className="font-outfit font-normal text-[12px] leading-[16px] text-brand-primary uppercase mb-2">
              Why This Trial Is For You
            </h4>
            <p className="font-noto-sans text-[14px] leading-[20px] text-text-secondary">
              {trial.chunks_summary}
            </p>
          </div>
        </div>
      </div>

      {/* Expandable Section */}
      <div className="mb-4">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center justify-between w-full py-2 group"
        >
          <span className="font-outfit font-normal text-[14px] text-brand-primary">More Information</span>
          <svg
            onClick={() => setRotated(!rotated)}
            width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"
            className={`transition-transform duration-300 transition-transform duration-300 cursor-pointer ${rotated ? "rotate-180" : "rotate-0"}`}
          >
            <path d="M4 6L8 10L12 6" stroke="#2D3748" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {isExpanded && (
          <>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fadeIn">
              {trial.treatment && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full border border-white p-0.5 shrink-0 bg-white/50">
                    <div className="w-full h-full rounded-full bg-brand-primary/10 flex items-center justify-center">
                      <img src="/drug.svg" alt="step 1" className="w-3 h-3 opacity-80" />
                    </div>
                  </div>
                  <div>
                    <p className="text-[12px] text-text-muted mb-1">Treatment</p>
                    <p className="text-[14px] font-normal text-text-primary">{trial.treatment}</p>
                  </div>
                </div>
              )}
              {trial.population && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full border border-white p-0.5 shrink-0 bg-white/50">
                    <div className="w-full h-full rounded-full bg-brand-primary/10 flex items-center justify-center">
                      <img src="/population.svg" alt="step 1" className="w-3 h-3 opacity-80" />
                    </div>
                  </div>
                  <div>
                    <p className="text-[12px] text-text-muted mb-1">Population</p>
                    <p className="text-[14px] font-normal text-text-primary">{trial.population}</p>
                  </div>
                </div>
              )}
              {trial.location && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full border border-white p-0.5 shrink-0 bg-white/50">
                    <div className="w-full h-full rounded-full bg-brand-primary/10 flex items-center justify-center">
                      <img src="/location.svg" alt="step 1" className="w-3 h-3 opacity-80" />
                    </div>
                  </div>
                  <div>
                    <p className="text-[12px] text-text-muted mb-1">Location</p>
                    <p className="text-[14px] font-normal text-text-primary">{trial.location}</p>
                  </div>
                </div>
              )}
              {trial.duration && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full border border-white p-0.5 shrink-0 bg-white/50">
                    <div className="w-full h-full rounded-full bg-brand-primary/10 flex items-center justify-center">
                      <img src="/calendar.svg" alt="step 1" className="w-3 h-3 opacity-80" />
                    </div>
                  </div>
                  <div>
                    <p className="text-[12px] text-text-muted mb-1">Duration</p>
                    <p className="text-[14px] font-normal text-text-primary">{trial.duration}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Adverse Events Section */}
            {(trial.adverseEvents || trial.seriousAdverseEvents) && (
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#F6AD55]/5 border border-[#F6AD55]/20 p-5 rounded-[16px]">
                  <p className="text-[#F6AD55] text-[12px] font-noto-sans font-bold mb-3">
                    Adverse Events
                  </p>
                  <div className="flex items-center gap-3">
                    <span className="text-[14px] text-text-primary font-medium">{trial.adverseEvents || 'None reported'}</span>
                  </div>
                </div>

                <div className="bg-[#f45954]/5 border border-[#f45954]/20 p-5 rounded-[16px]">
                  <p className="text-[#f45954] text-[12px] font-noto-sans font-bold mb-3">
                    Serious Adverse Events / Risk
                  </p>
                  <div className="flex items-center gap-3">
                    <span className="text-[14px] text-text-primary font-medium">{trial.seriousAdverseEvents || 'N/A'}</span>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Action Footer */}
      <div className="border-t border-border-default pt-4 flex flex-wrap justify-between items-center gap-4">
        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input type="checkbox" className="hidden" />
            <div className="w-5 h-5 border-2 border-border-default rounded flex items-center justify-center group-hover:border-brand-primary transition-all">
              {/* Checkmark icon if needed */}
            </div>
            <span className="font-noto-sans text-[14px] text-text-secondary">Compare</span>
          </label>
          <button className="flex items-center gap-2 group">
            <img src="/email.svg" alt="Save" className="w-5 h-5 opacity-60 group-hover:opacity-100" />
            <span className="font-noto-sans text-[14px] text-text-secondary group-hover:text-brand-primary">Save</span>
          </button>
        </div>

        <ViewTrialButton trialId={trial.id} />
      </div>
    </div>
  );
};

export default SearchResultCard;
