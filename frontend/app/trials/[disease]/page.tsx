"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Navbar from "../../../src/components/Navbar";
import Footer from "../../../src/components/Footer";
import DiscoveryResultCard from "../../../src/components/DiscoveryResultCard";
import FilterSidebar, {
  type FilterCategory,
} from "../../../src/components/FilterSidebar";

export default function TrialsDiscoveryPage() {
  const params = useParams();
  const disease =
    typeof params?.disease === "string"
      ? params.disease
      : Array.isArray(params?.disease)
      ? params.disease[0]
      : "diabetes";

  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});
  const [selectedSort, setSelectedSort] = useState("Relevance");
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    "Sort By": true,
    "Trial Stage": true,
    Status: true,
    "Trial Type": true,
    "Sponsor Type": true,
  });

  const filterCategories: FilterCategory[] = [
    {
      id: "Trial Stage",
      name: "Trial Stage",
      options: ["Phase 0", "Phase I", "Phase II", "Phase III", "Phase IV"],
    },
    {
      id: "Status",
      name: "Status",
      options: ["Recruiting", "Active", "Completed"],
    },
    {
      id: "Trial Type",
      name: "Trial Type",
      options: [
        "Drug",
        "Behavorial",
        "Device-Based",
        "Genetic",
        "Combinational",
        "Dietary Supplements",
        "Biological",
        "Other",
      ],
    },
    {
      id: "Sponsor Type",
      name: "Sponsor Type",
      options: ["Industry", "University", "Hospital"],
    },
  ];

  const sortOptions = [
    "Relevance",
    "Highest Evidence",
    "Lowest Risk",
    "Newest Trials",
    "Lowest Adverse Events",
  ];

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const toggleFilter = (category: string, value: string) => {
    setSelectedFilters((prev) => {
      const current = prev[category] || [];
      const updated = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return { ...prev, [category]: updated };
    });
  };

  const clearFilters = () => setSelectedFilters({});

  const trials = [
    {
      id: "trial-1",
      title: "Dapagliflozin for Aortic Pressure Reduction in Type 2 Diabetes",
      sponsor: "Hellenic Society of Medical Education",
      phase: "Phase IV",
      isRandomized: true,
      isDoubleBlind: true,
      isPlaceboControlled: true,
      treatment: "Tirzepatide",
      treatmentDetails: "5-15 mg subcutaneous injection",
      population: "Adults with Type 2 Diabetes",
      populationDetails: "1,400 Participants",
      location: "United States",
      locationDetails: "Multiple sites (US, Europe, Asia)",
      duration: "Feb 2021 - Dec 2026",
      durationDetails: "Start Date to End Date",
      riskLevel: "Low",
      adverseEvents: "243 (42%)",
      seriousAdverseEvents: "299 (43.9%)",
      hbA1cReduction: "−2.1% to −2.4% vs −0.9% placebo",
      pValue: "<0.001",
    },
    {
      id: "trial-2",
      title: "Dapagliflozin for Aortic Pressure Reduction in Type 2 Diabetes",
      sponsor: "Hellenic Society of Medical Education",
      phase: "Phase IV",
      isRandomized: true,
      isDoubleBlind: true,
      isPlaceboControlled: true,
      treatment: "Tirzepatide",
      treatmentDetails: "5-15 mg subcutaneous injection",
      population: "Adults with Type 2 Diabetes",
      populationDetails: "1,400 Participants",
      location: "United States",
      locationDetails: "Multiple sites (US, Europe, Asia)",
      duration: "Feb 2021 - Dec 2026",
      durationDetails: "Start Date to End Date",
      riskLevel: "Low",
      adverseEvents: "243 (42%)",
      seriousAdverseEvents: "299 (43.9%)",
      hbA1cReduction: "−2.1% to −2.4% vs −0.9% placebo",
      pValue: "<0.001",
    },
  ];

  const conditions = [
    "Diabetes",
    "Obesity",
    "Breast Cancer",
    "Lung Cancer",
    "Colorectal Cancer",
    "Alzheimer’s",
    "Cardiovascular Disease",
    "Asthma",
    "Depression",
    "Arthritis",
  ];

  return (
    <div className="relative w-full min-h-screen bg-[#f1f4fb] flex flex-col">
      <Navbar />

      <div className="w-full flex-1 min-h-screen flex flex-col relative">
        <div className="absolute top-[20px] left-[20px] right-[20px] bottom-[20px] z-0 rounded-[24px] bg-white/30 border border-white pointer-events-none" />

        <main className="relative z-10 flex-1 flex flex-col w-full max-w-[1920px] mx-auto px-4 md:px-8 lg:px-12 pt-[120px] pb-[100px]">
          <div className="bg-white/40 border-2 border-white rounded-[24px] p-8 mb-6">
            <h1 className="font-outfit font-normal text-[24px] text-[#0f172a] mb-2">
              Explore Clinical Trials
            </h1>
            <p className="font-noto-sans text-[16px] text-[#64748b] max-w-2xl">
              Search, filter, or browse clinical trials across conditions,
              treatments, and research studies.
            </p>
          </div>

          <div className="bg-white/40 border-2 border-white rounded-[24px] p-6 mb-8 overflow-hidden">
            <h2 className="font-outfit text-[20px] text-[#0f172a] mb-6 font-normal">
              Browse by Condition
            </h2>

            <div className="flex overflow-x-auto gap-3 pb-2 no-scrollbar">
              {conditions.map((condition) => {
                const slug = condition
                  .toLowerCase()
                  .replace(/[^a-z0-9]+/g, "-")
                  .replace(/(^-|-$)/g, "");

                const isActive = disease === slug;

                return (
                  <Link
                    key={condition}
                    href={`/trials/${slug}`}
                    className={`shrink-0 px-5 py-2.5 rounded-[16px] font-noto-sans text-[14px] transition-all ${
                      isActive
                        ? "bg-brand-primary text-white shadow-sm border border-brand-primary"
                        : "bg-white/40 border border-slate-200 text-[#475569] hover:border-brand-primary/40"
                    }`}
                  >
                    {condition}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            <FilterSidebar
              categories={filterCategories}
              selectedFilters={selectedFilters}
              onFilterChange={toggleFilter}
              onClearAll={clearFilters}
              expandedSections={expandedSections}
              onSectionToggle={toggleSection}
              sortOptions={sortOptions}
              selectedSort={selectedSort}
              onSortChange={setSelectedSort}
            />

            <div className="flex-1">
              <div className="mb-6 flex items-center justify-between">
                <span className="font-noto-sans text-[16px] text-[#64748b]">
                  Showing <span className="text-[#0f172a] font-normal">2 of 134</span>{" "}
                  trials
                </span>
              </div>

              <div
                className="p-5 rounded-[24px] border-2 border-dashed border-white"
                style={{
                  background: "linear-gradient(135deg, #F1F3FB 0%, #F4F4F9 100%)",
                }}
              >
                <div className="space-y-6">
                  {trials.map((trial, index) => (
                    <DiscoveryResultCard key={index} trial={trial} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <div className="w-full bg-white mt-auto relative z-10">
        <Footer />
      </div>
    </div>
  );
}