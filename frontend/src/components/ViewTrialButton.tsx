import React from 'react';
import { useRouter } from 'next/navigation';

interface ViewTrialButtonProps {
  trialId: string;
}

const ViewTrialButton: React.FC<ViewTrialButtonProps> = ({ trialId }) => {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push(`/trial-detail/${trialId}`)}
      className="bg-brand-primary border border-solid border-white flex items-center gap-2 px-6 py-2 rounded-2xl hover:bg-brand-primary/90 transition-all shadow-sm group"
    >
      <span className="font-noto-sans font-normal text-white text-base leading-7 whitespace-nowrap">
        View Trial
      </span>
      <div className="flex items-center justify-center shrink-0 w-5 h-5">
        <svg className="w-5 h-5 rotate-90 text-white group-hover:translate-x-0.5 transition-transform" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path opacity="0.5" fillRule="evenodd" clipRule="evenodd" d="M10 17.2917C10.1658 17.2917 10.3247 17.2258 10.4419 17.1086C10.5592 16.9914 10.625 16.8324 10.625 16.6667V8.95833H9.375V16.6667C9.375 17.0117 9.655 17.2917 10 17.2917Z" fill="currentColor"/>
          <path d="M5 8.95833C4.87647 8.95822 4.75574 8.92151 4.65306 8.85283C4.55038 8.78414 4.47035 8.68657 4.42309 8.57244C4.37583 8.4583 4.36346 8.33272 4.38753 8.21155C4.4116 8.09039 4.47104 7.97907 4.55833 7.89167L9.55833 2.89167C9.67552 2.77462 9.83437 2.70888 10 2.70888C10.1656 2.70888 10.3245 2.77462 10.4417 2.89167L15.4417 7.89167C15.529 7.97907 15.5884 8.09039 15.6125 8.21155C15.6365 8.33272 15.6242 8.4583 15.5769 8.57244C15.5296 8.68657 15.4496 8.78414 15.3469 8.85283C15.2443 8.92151 15.1235 8.95822 15 8.95833H5Z" fill="currentColor"/>
        </svg>
      </div>
    </button>
  );
};

export default ViewTrialButton;
