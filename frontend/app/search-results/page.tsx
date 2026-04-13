// app/search-results/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '../../src/components/Navbar';
import Footer from '../../src/components/Footer';
import SearchResultCard from '../../src/components/SearchResultCard';
import { type FilterCategory } from '../../src/components/FilterSidebar';
import AdvancedFiltersDrawer from '../../src/components/AdvancedFiltersDrawer';

interface BackendNamedValue {
  name?: string | null;
}

interface BackendLocation {
  country?: string | null;
  city?: string | null;
  name?: string | null;
}

interface PopulationAgeRange {
  min?: string | null;
  max?: string | null;
  unit?: string | null;
}

interface PopulationBreakdown {
  description?: string | null;
  gender?: string | null;
  age_range?: PopulationAgeRange[] | null;
}

interface TrialFields {
  primary_id?: string | null;
  full_title?: string | null;
  phase?: string | null;
  controlled?: string | null;
  allocation?: string | null;
  masking?: string | null;
  sponsors?: BackendNamedValue[] | null;
  investigational_Product?: (BackendNamedValue | string)[] | null;
  locations?: (BackendLocation | string)[] | string | null;
  date_of_end_trial?: string | null;
  date_of_start_trial?: string | null;
  population_breakdown?: PopulationBreakdown | null;
  adverse_events?: string | null;
}

interface CardSummary {
  chunks_summary?: string | null;
}

interface BackendCard {
  primary_id?: string | null;
  trial_fields?: TrialFields | null;
  summary?: CardSummary | null;
}

interface BackendQueryResponse {
  cards?: BackendCard[];
}

interface SearchTrialData {
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
}

const formatDate = (dateStr?: string | null) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) {
    return dateStr;
  }
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
};

const getNamedValues = (values?: (BackendNamedValue | string)[] | null) =>
  (values || [])
    .map((value) => {
      if (typeof value === 'string') return value;
      return value?.name || '';
    })
    .map(value => value.trim())
    .filter(Boolean);

const getLocationValues = (locations?: TrialFields['locations']) => {
  if (!locations) return [];
  if (typeof locations === 'string') {
    return locations.trim() ? [locations.trim()] : [];
  }
  return locations
    .map((location) => {
      if (typeof location === 'string') return location;
      return location?.country || location?.city || location?.name || '';
    })
    .map(value => value.trim())
    .filter(Boolean);
};

const buildPopulationLabel = (population?: PopulationBreakdown | null) => {
  if (!population) return undefined;
  if (population.description?.trim()) return population.description;
  if (population.gender?.trim()) return population.gender;
  const firstAgeRange = population.age_range?.[0];
  if (!firstAgeRange) return undefined;
  const min = firstAgeRange.min?.trim() || '';
  const max = firstAgeRange.max?.trim() || '';
  if (min && max) return `Ages ${min} - ${max}`;
  if (min) return `Age ${min}+`;
  if (max) return `Up to age ${max}`;
  return undefined;
};

const mapCardToTrial = (card: BackendCard, index: number): SearchTrialData => {
  const fields = card.trial_fields || {};
  const sponsors = getNamedValues(fields.sponsors);
  const treatmentList = getNamedValues(fields.investigational_Product);
  const locations = getLocationValues(fields.locations);
  const startDate = formatDate(fields.date_of_start_trial);
  const endDate = formatDate(fields.date_of_end_trial);
  const duration = [startDate, endDate].filter(Boolean).join(' - ');
  const adverseEvents = fields.adverse_events || undefined;

  return {
    id: card.primary_id || fields.primary_id || `trial-${index + 1}`,
    full_title: fields.full_title?.trim() || 'Untitled Trial',
    sponsor: sponsors.join(', ') || 'Unknown sponsor',
    matchPercentage: 85,
    phase: fields.phase?.trim() || 'Not specified',
    allocation: fields.allocation?.trim() || 'None',
    masking: fields.masking?.trim() || 'None',
    controlled: fields.controlled?.trim() || 'None',
    chunks_summary: card.summary?.chunks_summary?.trim() || 'No summary available.',
    treatment: treatmentList.join(', ') || undefined,
    population: buildPopulationLabel(fields.population_breakdown),
    location: locations.join(', ') || undefined,
    duration: duration || undefined,
    adverseEvents
  };
};

const SearchResultsPage: React.FC = () => {
  const searchParams = useSearchParams();
  const initialQuery = (searchParams?.get('q') || '').trim().slice(0, 500);
  const [refineQuery, setRefineQuery] = useState(initialQuery);
  const [trials, setTrials] = useState<SearchTrialData[]>([]);
  const [isLoadingTrials, setIsLoadingTrials] = useState(false);
  const [trialsError, setTrialsError] = useState<string | null>(null);
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    'Trial Stage': true,
    'Status': true,
    'Trial Type': true
  });

  const filterCategories: FilterCategory[] = [
    {
      id: 'Trial Stage',
      name: 'Trial Stage',
      options: ['Phase 0', 'Phase I', 'Phase II', 'Phase III', 'Phase IV']
    },
    {
      id: 'Status',
      name: 'Status',
      options: ['Recruiting', 'Active', 'Completed']
    },
    {
      id: 'Trial Type',
      name: 'Trial Type',
      options: ['Drug', 'Behavorial', 'Device-Based', 'Genetic', 'Biological']
    }
  ];

  const totalFiltersCount = Object.values(selectedFilters).flat().length;

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const toggleFilter = (category: string, value: string) => {
    setSelectedFilters(prev => {
      const current = prev[category] || [];
      const updated = current.includes(value)
        ? current.filter(v => v !== value)
        : [...current, value];
      return { ...prev, [category]: updated };
    });
  };

  const clearFilters = () => setSelectedFilters({});

  useEffect(() => {
    setRefineQuery(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    if (!initialQuery) {
      setTrials([]);
      setTrialsError('No search query provided.');
      return;
    }

    const controller = new AbortController();

    const fetchTrials = async () => {
      setIsLoadingTrials(true);
      setTrialsError(null);
      try {
        const response = await fetch('/api/userquery', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ query: initialQuery }),
          signal: controller.signal
        });

        if (!response.ok) {
          let errorMessage = `Failed to fetch trials (${response.status})`;
          try {
            const errorPayload = await response.json();
            if (typeof errorPayload?.detail === 'string' && errorPayload.detail.trim()) {
              errorMessage = errorPayload.detail;
            }
          } catch {
            // Keep default message if error payload is not JSON.
          }
          throw new Error(errorMessage);
        }

        const payload: BackendQueryResponse = await response.json();
        const cards = payload.cards || [];
        setTrials(cards.map(mapCardToTrial));
      } catch (error) {
        if (controller.signal.aborted) return;
        const message = error instanceof Error ? error.message : 'Failed to fetch trials.';
        setTrials([]);
        setTrialsError(message);
      } finally {
        if (!controller.signal.aborted) {
          setIsLoadingTrials(false);
        }
      }
    };

    fetchTrials();

    return () => {
      controller.abort();
    };
  }, [initialQuery]);

  return (
    <div className="min-h-screen bg-[#f1f4fb] flex flex-col relative overflow-hidden">
      <Navbar />

      <div className="w-full flex-1 flex flex-col relative">
        {/* Background container that stops before footer */}
        <div className="absolute top-[20px] left-[20px] right-[20px] bottom-[20px] z-0 rounded-[24px] bg-white/30 border border-white pointer-events-none"></div>

        <main className="relative z-10 flex-1 flex flex-col w-full max-w-[1920px] mx-auto px-4 md:px-8 lg:px-12 pt-[120px] pb-[100px]">
          {/* Banner Section */}
          <div className="bg-white/40 backdrop-blur-md border-2 border-white rounded-[24px] p-4 md:p-6 mb-6 flex flex-col gap-6">
            <div className='w-full'>
              <h1 className="w-full font-outfit font-normal text-[24px] text-text-primary mb-2">Trials ranked for you</h1>
              <p className="w-full font-noto-sans text-[16px] text-text-secondary">
                We ranked these studies based on your health info, location, safety comfort, and goals.
              </p>
            </div>

            {/* AI Refine Section */}
            <div
              className="w-full border-2 border-dashed border-white rounded-[24px] p-5 overflow-hidden"
              style={{ background: "linear-gradient(176.75deg, rgba(99, 102, 241, 0.03) 0%, rgba(244, 89, 84, 0.02) 100%)" }}
            >
              <div className="flex items-center gap-4">
                {/* AI Icon Container */}
                <div className="bg-white/40 border-[0.5px] border-white rounded-[12px] shadow-sm shrink-0 size-12 flex items-center justify-center">
                  <div className="size-6">
                    <img src="/ai-match.svg" alt="AI" className="w-full h-full object-contain opacity-80" />
                  </div>
                </div>

                {/* Input Bar */}
                <div className="flex-1 bg-white/40 border border-white rounded-[16px] px-4 py-2 flex items-center gap-3">
                  <input
                    type="text"
                    value={refineQuery}
                    onChange={(e) => setRefineQuery(e.target.value)}
                    placeholder="Refine with AI: Update symptoms, location, medications, or preferences..."
                    className="flex-1 bg-transparent border-none outline-none font-noto-sans text-[14px] text-text-primary placeholder:text-text-muted"
                  />
                  <button className="bg-white/10 border border-[#e2e8f0]/40 rounded-[12px] p-1.5 hover:bg-white/20 transition-all">
                    <img src="/arrow_up.svg" alt="Submit" className="size-5 opacity-60" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6 w-full">
            {/* Results Header Card */}
            <div className="bg-white/40 backdrop-blur-md border-2 border-white rounded-[24px] p-6 mb-0">
              <div className="flex flex-col gap-4">
                <h2 className="font-outfit font-normal text-[20px] text-text-primary px-1">
                  {isLoadingTrials ? 'Loading trials...' : `${trials.length} Trials Matched`}
                </h2>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  {/* Sort Controls */}
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <span className="font-noto-sans text-[16px] text-[#2d3748] whitespace-nowrap">Sort By</span>
                    <div className="flex flex-wrap gap-3">
                      {['Highest Evidence', 'Lowest Risk', 'Newest Trials', 'Lowest Adverse Events'].map((sort, idx) => (
                        <button
                          key={sort}
                          className={`px-4 py-2 rounded-[12px] text-[14px] font-normal transition-all duration-200 border ${idx === 0 ? 'bg-brand-primary text-white border-brand-primary' : 'bg-transparent text-[#4a5568] border-[#e2e8f0] hover:bg-white/50'}`}
                        >
                          {sort}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Filter Toggle Button */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsDrawerOpen(true)}
                      className={`flex items-center gap-2.5 px-[16px] py-[10px] rounded-[14px] border-2 transition-all font-noto-sans font-normal text-[16px]
                        ${totalFiltersCount > 0
                          ? 'border-brand-primary bg-brand-primary/5 text-brand-primary'
                          : 'border-[#e2e8f0] text-[#4a5568] hover:border-brand-primary/30'}`}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 6H21M6 12H18M10 18H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <span>Filters {totalFiltersCount > 0 && `(${totalFiltersCount.toString().padStart(2, '0')})`}</span>
                    </button>

                    {totalFiltersCount > 0 && (
                      <button
                        onClick={clearFilters}
                        className="p-2.5 hover:bg-red-50 hover:text-red-500 rounded-[12px] transition-colors text-gray-400"
                        title="Clear all filters"
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div
              className="p-5 rounded-[24px] border-2 border-dashed border-white"
              style={{ background: 'linear-gradient(135deg, #F1F3FB 0%, #F4F4F9 100%)' }}
            >
              {isLoadingTrials && (
                <div className="py-14 text-center font-noto-sans text-[15px] text-text-secondary">
                  Fetching trial matches for your query...
                </div>
              )}

              {!isLoadingTrials && trialsError && (
                <div className="py-14 text-center font-noto-sans text-[15px] text-red-500">
                  {trialsError}
                </div>
              )}

              {!isLoadingTrials && !trialsError && trials.length === 0 && (
                <div className="py-14 text-center font-noto-sans text-[15px] text-text-secondary">
                  No trials found for this query.
                </div>
              )}

              {!isLoadingTrials && !trialsError && trials.length > 0 && (
                <div className="space-y-6">
                  {trials.map((trial) => (
                    <SearchResultCard key={trial.id} trial={trial} />
                  ))}
                </div>
              )}
            </div>

            <div className="mt-12 flex justify-center">
              <button className="bg-white/60 border-2 border-white px-8 py-3 rounded-2xl font-outfit font-normal text-text-primary hover:bg-white/80 transition-all">
                Load more results
              </button>
            </div>
          </div>
        </main>
      </div>

      <Footer />

      <AdvancedFiltersDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        categories={filterCategories}
        selectedFilters={selectedFilters}
        onFilterChange={toggleFilter}
        onClearAll={clearFilters}
        onApply={() => {
          // Logic for applying filters
          console.log('Filters applied');
        }}
        expandedSections={expandedSections}
        onSectionToggle={toggleSection}
      />
    </div>
  );
};

export default SearchResultsPage;
