import React from 'react';
import ViewTrialButton from './ViewTrialButton';

interface DiscoveryResultCardProps {
  trial: {
    id: string;
    title: string;
    sponsor: string;
    phase: string;
    isRandomized: boolean;
    isDoubleBlind: boolean;
    isPlaceboControlled: boolean;
    treatment: string;
    treatmentDetails: string;
    population: string;
    populationDetails: string;
    location: string;
    locationDetails: string;
    duration: string;
    durationDetails: string;
    riskLevel: string;
    adverseEvents: string;
    seriousAdverseEvents: string;
    hbA1cReduction: string;
    pValue: string;
  };
}

const DiscoveryResultCard: React.FC<DiscoveryResultCardProps> = ({ trial }) => {

  return (
    <div className="bg-white/40 backdrop-blur-md border-2 border-white p-[26px] rounded-[16px] w-full transition-all">
      {/* Header Section */}
      <div className="flex justify-between items-start mb-6">
        <div className="flex-1">
          <h3 className="font-outfit font-normal text-[20px] leading-tight mb-2">
            {trial.title}
          </h3>
          <div className="flex items-center gap-2 text-text-secondary">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 1.33334L1.33334 4L8 6.66668L14.6667 4L8 1.33334Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M1.33334 12L8 14.6667L14.6667 12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M1.33334 8L8 10.6667L14.6667 8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="font-noto-sans text-[14px]">{trial.sponsor}</span>
          </div>
        </div>
        <button className="p-2 hover:bg-white/20 rounded-full transition-colors">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 16V12M12 8H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="#7DC4F0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {/* Tags Section */}
      <div className="flex flex-wrap gap-2 mb-6">
        <div className="bg-white/40 border border-white px-3 py-2 rounded-[10px] flex items-center gap-2">
          <img src="/phase.svg" alt="Phase" className="w-4 h-4" />
          <span className="font-noto-sans text-[12px] text-brand-primary">{trial.phase}</span>
        </div>
        {trial.isRandomized && (
          <div className="bg-white/40 border border-white px-3 py-2 rounded-[10px] flex items-center gap-2">
            <img src="/randomized.svg" alt="Randomized" className="w-4 h-4" />
            <span className="font-noto-sans text-[12px] text-brand-primary">Randomized</span>
          </div>
        )}
        {trial.isDoubleBlind && (
          <div className="bg-white/40 border border-white px-3 py-2 rounded-[10px] flex items-center gap-2">
            <img src="/masking.svg" alt="Blinded" className="w-4 h-4" />
            <span className="font-noto-sans text-[12px] text-brand-primary">Double-Blind</span>
          </div>
        )}
        {trial.isPlaceboControlled && (
          <div className="bg-white/40 border border-white px-3 py-2 rounded-[10px] flex items-center gap-2">
            <img src="/placebo.svg" alt="Placebo" className="w-4 h-4" />
            <span className="font-noto-sans text-[12px] text-brand-primary">Placebo-Controlled</span>
          </div>
        )}
      </div>

      {/* Detail Grid */}
      <div className="bg-white/40 grid grid-cols-4 gap-4 p-5 rounded-[16px] mb-6 border-2 border-white"
      // style={{ background: "radial-gradient(297.79% 119.9% at 100.9% 26.67%, rgba(138, 163, 239, 0.10) 0%, rgba(138, 163, 239, 0.00) 100%), rgba(255, 255, 255, 0.50)" }}>
      >

        {/* Treatment */}
        <div className="flex gap-3">
          <div className="w-8 h-8 rounded-full border border-white p-0.5 shrink-0 bg-white/40">
            <div className="w-full h-full rounded-full bg-brand-primary/10 flex items-center justify-center">
              <img src="/drug.svg" alt="Treatment" className="w-4 h-4 opacity-80" />
            </div>
          </div>
          <div>
            <p className="text-[12px] text-text-secondary mb-1">Treatment</p>
            <p className="text-[14px] text-text-secondary font-outfit mb-1">{trial.treatment}</p>
            <p className="text-[12px] text-text-secondary leading-tight">{trial.treatmentDetails}</p>
          </div>
        </div>

        {/* Population */}
        <div className="flex gap-3">
          <div className="w-8 h-8 rounded-full border border-white p-0.5 shrink-0 bg-white/50">
            <div className="w-full h-full rounded-full bg-brand-primary/10 flex items-center justify-center">
              <img src="/population.svg" alt="Population" className="w-4 h-4 opacity-80" />
            </div>
          </div>
          <div>
            <p className="text-[12px] text-text-secondary mb-1">Population</p>
            <p className="text-[14px] text-text-secondary font-outfit mb-1">{trial.population}</p>
            <p className="text-[12px] text-text-secondary leading-tight">{trial.populationDetails}</p>
          </div>
        </div>

        {/* Location */}
        <div className="flex gap-3">
          <div className="w-8 h-8 rounded-full border border-white p-0.5 shrink-0 bg-white/50">
            <div className="w-full h-full rounded-full bg-brand-primary/10 flex items-center justify-center">
              <img src="/location.svg" alt="Location" className="w-4 h-4 opacity-80" />
            </div>
          </div>
          <div>
            <p className="text-[12px] text-text-secondary mb-1">Location</p>
            <p className="text-[14px] text-text-secondary font-outfit mb-1">{trial.location}</p>
            <p className="text-[12px] text-text-secondary leading-tight">{trial.locationDetails}</p>
          </div>
        </div>

        {/* Duration */}
        <div className="flex gap-3">
          <div className="w-8 h-8 rounded-full border border-white p-0.5 shrink-0 bg-white/50">
            <div className="w-full h-full rounded-full bg-brand-primary/10 flex items-center justify-center">
              <img src="/calendar.svg" alt="Duration" className="w-4 h-4 opacity-80" />
            </div>
          </div>
          <div>
            <p className="text-[12px] text-text-secondary mb-1">Duration</p>
            <p className="text-[14px] text-text-secondary font-outfit mb-1">{trial.duration}</p>
            <p className="text-[12px] text-text-secondary leading-tight">{trial.durationDetails}</p>
          </div>
        </div>
      </div>

      {/* Adverse & Results Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">

        {/* Adverse Events (formerly Results) */}
        <div className="bg-[#F6AD55]/5 border border-[#F6AD55]/20 p-5 rounded-[16px]">
          <p className="text-[#F6AD55] text-[12px] font-noto-sans font-bold mb-3">
            Adverse Events
          </p>
          <div className="flex items-center gap-3">
            <span className="text-[14px] text-text-primary font-medium">{trial.adverseEvents}</span>
          </div>
        </div>
        {/* Serious Adverse Events / Risk */}
        <div className="bg-[#f45954]/5 border border-[#f45954]/20 p-5 rounded-[16px]">
          <p className="text-[#f45954] text-[12px] font-noto-sans font-bold mb-3">
            Serious Adverse Events / Risk
          </p>
          <div className="flex items-center gap-3">
            <span className="text-[14px] text-text-primary font-medium">{trial.seriousAdverseEvents}</span>
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <div className="flex justify-between items-center pt-4 border-t border-brand-primary/10">
        <div className="flex gap-6">
          <label className="flex items-center gap-2 cursor-pointer group">
            <div className="w-5 h-5 border-2 border-brand-primary/20 rounded flex items-center justify-center group-hover:border-brand-primary transition-colors">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-0 group-hover:opacity-100 transition-opacity">
                <path d="M2.5 6L4.5 8L9.5 3" stroke="#7DC4F0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="text-[14px] text-text-secondary">Compare</span>
          </label>
          <button className="flex items-center gap-2 text-text-secondary hover:text-brand-primary transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 21L10.55 19.705C5.4 15.03 2 11.995 2 8.25C2 5.175 4.425 2.75 7.5 2.75C9.24 2.75 10.91 3.56 12 4.845C13.09 3.56 14.76 2.75 17.5 2.75C20.575 2.75 23 5.175 23 8.25C23 11.995 19.6 15.03 14.45 19.71L12 21Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="text-[14px]">Save</span>
          </button>
        </div>

        <ViewTrialButton trialId={trial.id} />
      </div>
    </div>
  );
};

export default DiscoveryResultCard;
