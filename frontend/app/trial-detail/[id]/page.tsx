"use client";

const imgIcon2 = "/assets/85ac1d1ecd7ea6426cb843e264e8c535af14c821.svg";
const imgPhVirusBold = "/assets/901c79769bb305b73f709a76318fec9b7f55a788.svg";
const imgGroup = "/assets/ad93c92a2607e1532ba3508f49c9bc1fcb643ba9.svg";
const imgSolarHeartLinear = "/assets/e719496972141333077e54a56a79a5afc47788c4.svg";
const imgTeenyiconsGitCompareOutline =
  "/assets/455f90ff5f6766c20a903c82c509b1ccc16c0d79.svg";
const imgGroup1 = "/assets/39f8630ccdb4c555bf02f2457ad23bfc40991232.svg";
const imgGroup3 = "/assets/5132bfdacd6711adc82f16e8aa4d2d19ab149e2c.svg";
const imgFluentPeople12Regular =
  "/assets/fe148e278ea5109d0b1fd42293d2d884dce0d01a.svg";
const imgSiAlertLine = "/assets/57a2b4eac5457df8e95ab3be165b60dd19782bba.svg";
const imgFluentLocation12Regular =
  "/assets/8399a90b90f5e047e5cec26cbe95d3305e6575b1.svg";
const imgFa7RegularComments =
  "/assets/5b52f27b1e470eae02af4434e8969f36e9aa8974.svg";
const imgIcon4 = "/assets/49eae7506b2a71eaba08e41655f812409049e171.svg";
const imgIcon5 = "/assets/47b88011d5a20ef0844c2318ced96591cd5fdf86.svg";
const imgIcon6 = "/assets/897218684f531244d0f69f41d31d7f8642eb4b6a.svg";
const imgSolarCalendarBold = "/assets/b3c1d34a755345b9259a5581f34ef80d70466788.svg";
const imgFluentPeople12Filled1 =
  "/assets/3a16fa3f9a406977949ee98545a9cdf1a4ae1996.svg";
const imgGroup7 = "/assets/7e7460d52c306d7e91c31d1218daaabb5ad260e5.svg";
const imgRiChatAi3Fill = "/assets/26832e10946f3063456bf4e74985ad911ea48d29.svg";
const imgGroup8 = "/assets/6c429ec88fc3fd22abcf41f2ed0304586f72975a.svg";
const imgIconOverview = "/assets/0d34b48e597079fc72abdc36362a22f1415ef576.svg";
const imgIconResults = "/assets/e7c8faf429a47e7247bd971775a1c58d45134520.svg";

import { useState, useRef, useEffect } from "react";
import { useParams } from "next/navigation";
import TrialTimelineChart from "../../../src/components/TrialTimelineChart";
import PopulationDemographicsChart from "../../../src/components/PopulationDemographicsChart";
import Navbar from "../../../src/components/Navbar";
import Footer from "../../../src/components/Footer";
import EligibilityTab from "../../../src/components/EligibilityTab";
import PopulationTab from "../../../src/components/PopulationTab";
import ResultsTab from "../../../src/components/ResultsTab";
import DiscussionTab from "../../../src/components/DiscussionTab";
import LocationTab from "../../../src/components/LocationTab";
import SafetyAndRisksTab from "../../../src/components/SafetyAndRisksTab";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export default function TrialDetailsPage() {
  const params = useParams();
  const id =
    typeof params?.id === "string"
      ? params.id
      : Array.isArray(params?.id)
      ? params.id[0]
      : "";

  const [activeSection, setActiveSection] = useState("Overview");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Hello! I'm here to help you understand this clinical trial. You can ask me anything about eligibility, the treatment, results, or safety information. How can I assist you today?",
    },
  ]);
  const [chatInput, setChatInput] = useState("");
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const relatedQuestions = [
    "Explain the inclusion criteria",
    "Is this trial relevant to adult NSCLC?",
    "What does MTD mean?",
  ];

  const aiResponses: Record<string, string> = {
    "Explain the inclusion criteria":
      "This trial enrolls children and adolescents aged 3-21 years with unilateral pleural malignancy. Patients must have histologically confirmed disease and be candidates for cytoreductive surgery. Prior chemotherapy is allowed if completed at least 4 weeks before enrollment.",
    "Is this trial relevant to adult NSCLC?":
      "This trial specifically targets pediatric patients (ages 3-21) with pleural malignancy, not adult NSCLC. However, the HITC approach studied here may inform future adult lung cancer treatments.",
    "What does MTD mean?":
      "MTD stands for Maximum Tolerated Dose — the highest dose of a treatment that does not cause unacceptable side effects. This Phase I trial uses dose escalation of cisplatin during HITC to determine the MTD for pediatric patients.",
  };

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = { role: "user", content: text.trim() };
    const aiResponse: ChatMessage = {
      role: "assistant",
      content:
        aiResponses[text.trim()] ||
        `That's a great question about "${text.trim()}". Based on this trial's data, the study investigated cytoreductive surgery combined with hyperthermic intrathoracic pleural chemotherapy (HITC) using escalating doses of cisplatin. The trial enrolled 7 pediatric participants and has been completed. Feel free to ask anything else!`,
    };

    setChatMessages((prev) => [...prev, userMsg, aiResponse]);
    setChatInput("");
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const navItems = [
    { id: "Overview", icon: imgIconOverview, label: "Overview" },
    { id: "Eligibility", icon: imgGroup3, label: "Eligibility" },
    { id: "Population", icon: imgFluentPeople12Regular, label: "Population" },
    { id: "Safety & Risks", icon: imgSiAlertLine, label: "Safety & Risks" },
    { id: "Results", icon: imgIconResults, label: "Results" },
    { id: "Location", icon: imgFluentLocation12Regular, label: "Location" },
    { id: "Discussion", icon: imgFa7RegularComments, label: "Community Forum" },
  ];

  return (
    <div className="relative w-full min-h-screen bg-background-subtle flex flex-col">
      <Navbar />

      <div className="w-full flex-1 min-h-screen flex flex-col relative">
        {/* Background container that stops before footer */}
        <div className="absolute top-[20px] left-[20px] right-[20px] bottom-[20px] z-0 rounded-[24px] bg-white/30 border border-white pointer-events-none"></div>

        <main className="relative z-10 flex-1 flex flex-col w-full max-w-[1920px] mx-auto px-[28px] md:px-[36px] lg:px-12 pt-[120px] pb-[64px]">
          <div className="w-full flex flex-col gap-6" data-name="Main Section">
            <div className="flex flex-col gap-6 w-full items-start">
              <div className="w-full flex-col gap-[20px]">
                {/* Title Card */}
                <div className="bg-[#FFFFFF]/40 border border-white content-stretch flex flex-col gap-[16px] md:gap-[20px] items-start p-[20px] md:p-[28px] relative rounded-[24px] w-full">

                  {/* Top Row: Title + Action Circles */}
                  <div className="flex flex-col md:flex-row justify-between items-start w-full gap-[16px]">
                    <h1 className="font-outfit font-regular text-text-primary text-[16px] md:text-[20px] leading-[1.4] flex-1 pb-[4px]">
                      Study of Cytoreductive Surgery and Hyperthermic Intrathoracic Pleural Chemotherapy (HITC) With Escalating Doses for Children and Adolescents With Unilateral Pleural Malignancy
                    </h1>

                    <div className="flex flex-row gap-[12px] shrink-0 self-start">
                      <button className="border border-border-default border-solid rounded-[16px] flex items-center justify-center size-[40px] md:size-[44px] cursor-pointer hover:bg-gray-50 transition-colors">
                        <img alt="Share" className="size-[20px]" src={imgGroup1} />
                      </button>
                      <button className="border border-border-default border-solid rounded-[16px] flex items-center justify-center size-[40px] md:size-[44px] cursor-pointer hover:bg-gray-50 transition-colors">
                        <img alt="Save" className="size-[20px]" src={imgSolarHeartLinear} />
                      </button>
                    </div>
                  </div>

                  {/* Second Row: Metadata Layer */}
                  <div className="flex flex-row flex-wrap items-center gap-y-[12px] w-full pb-[4px]">
                    <div className="bg-[rgba(20,184,166,0.2)] flex items-center justify-center px-[10px] py-[4px] rounded-[26843500px] shrink-0 mr-[16px]">
                      <span className="font-noto-sans font-bold text-[#14b8a6] text-[11px] whitespace-nowrap tracking-wide uppercase">Completed</span>
                    </div>

                    <div className="hidden md:block w-[1px] h-[16px] bg-border-default mr-[16px]"></div>

                    <div className="flex items-center gap-[6px] mr-[16px]">
                      <img alt="Hospital" className="size-[16px]" src={imgIcon2} />
                      <span className="font-noto-sans text-text-secondary text-[13px] md:text-[14px] whitespace-nowrap">M.D. Anderson Cancer Center</span>
                    </div>

                    <div className="flex items-center gap-[6px] mr-[16px]">
                      <img alt="Condition" className="size-[16px]" src={imgPhVirusBold} />
                      <span className="font-noto-sans text-text-secondary text-[13px] md:text-[14px] whitespace-nowrap">Lung Cancer</span>
                    </div>

                    <div className="hidden md:block w-[1px] h-[16px] bg-border-default mr-[16px]"></div>

                    <div className="flex items-center gap-[6px] flex-wrap">
                      <span className="font-noto-sans text-text-secondary text-[13px] md:text-[14px]">Phase 1</span>
                      <span className="font-noto-sans text-text-secondary text-[13px] md:text-[14px] px-[2px]">&bull;</span>
                      <span className="font-noto-sans text-text-secondary text-[13px] md:text-[14px]">Cisplatin</span>
                      <span className="font-noto-sans text-text-secondary text-[13px] md:text-[14px] px-[2px]">&bull;</span>
                      <span className="font-noto-sans text-text-secondary text-[13px] md:text-[14px]">Houston, USA</span>
                      <span className="font-noto-sans text-text-secondary text-[13px] md:text-[14px] px-[2px]">&bull;</span>
                      <span className="font-noto-sans text-text-secondary text-[13px] md:text-[14px]">Sample size: 7</span>
                    </div>
                  </div>

                  {/* Third Row: Bottom Actions */}
                  <div className="flex flex-row flex-wrap gap-[12px] w-full pt-[4px]">
                    <button className="bg-[#f1f5f9] border border-transparent rounded-[16px] flex gap-[8px] items-center justify-center px-[20px] py-[8px] cursor-default opacity-80">
                      <img alt="Register" className="size-[16px] opacity-70" src={imgGroup} />
                      <span className="font-noto-sans font-medium text-[#94a3b8] text-[13px]">Register</span>
                    </button>
                    <button className="border border-border-default rounded-[16px] flex gap-[8px] items-center justify-center px-[20px] py-[8px] cursor-pointer hover:bg-gray-50 transition-colors">
                      <img alt="Compare" className="size-[16px]" src={imgTeenyiconsGitCompareOutline} />
                      <span className="font-noto-sans font-medium text-text-secondary text-[13px]">Compare</span>
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex flex-col lg:flex-row lg:gap-6 items-start relative shrink-0 w-full" data-node-id="376:351">
                <div className="flex-1 min-w-0 w-full flex flex-col gap-6">
                  <div className="border-2 border-dashed border-white content-stretch flex overflow-x-auto no-scrollbar gap-[4px] lg:gap-[8px] xl:justify-between items-start px-[8px] lg:px-[12px] relative shrink-0 w-full rounded-[24px] sticky top-[80px] z-20" data-node-id="376:75" style={{ backgroundImage: "linear-gradient(135.0deg, rgba(241, 242, 251) 0%, rgba(244, 243, 249) 100%)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}>
                    {navItems.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setActiveSection(item.id)}
                        className={`group content-stretch flex gap-[4px] lg:gap-[6px] items-center px-[6px] lg:px-[8px] xl:px-[10px] pb-[22.4px] pt-[20px] relative shrink-0 transition-colors border-b-[2.4px] cursor-pointer ${activeSection === item.id ? 'border-brand-primary text-brand-primary' : 'border-transparent text-text-secondary hover:text-text-primary hover:border-brand-primary/30'}`}
                        data-name="Button"
                      >
                        <div className="relative shrink-0 size-[14px] xl:size-[18px]">
                          <div 
                            className="w-full h-full bg-current transition-colors" 
                            style={{
                              maskImage: `url(${item.icon})`,
                              maskSize: 'contain',
                              maskRepeat: 'no-repeat',
                              maskPosition: 'center',
                              WebkitMaskImage: `url(${item.icon})`,
                              WebkitMaskSize: 'contain',
                              WebkitMaskRepeat: 'no-repeat',
                              WebkitMaskPosition: 'center',
                            }} 
                          />
                        </div>
                        <p className={`font-noto-sans leading-[28px] relative shrink-0 text-[10px] lg:text-[11px] xl:text-[13px] -tracking-[0.2px] text-center whitespace-nowrap transition-colors ${activeSection === item.id ? 'font-bold' : 'font-normal'}`}>
                          {item.label}
                        </p>
                      </button>
                    ))}
                  </div>
                  {activeSection === 'Overview' && (
                    <div className="bg-[rgba(255,255,255,0.4)] border border-solid border-white flex flex-col gap-6 items-center w-full min-w-0 overflow-visible p-[25px] relative rounded-[24px]" data-name="Container" data-node-id="359:182">
                      <div className="relative shrink-0 w-full" data-name="Container" data-node-id="359:183">
                        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[24px] items-start relative w-full">
                          <div className="content-stretch flex gap-[10px] items-center justify-center relative shrink-0" data-node-id="359:184">
                            <div className="bg-[rgba(255,255,255,0.4)] border-[0.471px] border-solid border-white content-stretch flex items-center justify-center p-[8px] relative rounded-[12px] shadow-[-33.882px_60.235px_19.294px_0px_rgba(138,163,239,0),-21.647px_38.588px_17.882px_0px_rgba(138,163,239,0.01),-12.235px_21.647px_15.059px_0px_rgba(138,163,239,0.03),-5.176px_9.412px_10.824px_0px_rgba(138,163,239,0.05),-1.412px_2.353px_6.118px_0px_rgba(138,163,239,0.06)] shrink-0 size-[48px]" data-node-id="359:185">
                              <div className="content-stretch flex items-center justify-center px-[4px] relative shrink-0 size-[32px]" data-name="Container" data-node-id="359:186">
                                <div className="relative shrink-0 size-[24px]" data-name="Icon" data-node-id="359:187">
                                  <img alt="" className="absolute block max-w-none size-full" src={imgIcon4} />
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col font-outfit font-bold justify-center leading-[0] relative shrink-0 text-text-primary text-[0px] whitespace-nowrap" data-node-id="359:189">
                              <p className="font-outfit font-normal leading-[32px] text-[24px]">Overview</p>
                            </div>
                          </div>
                          <div className="border border-solid border-white content-stretch flex flex-col font-noto-sans font-normal gap-[24px] items-center leading-[0] not-italic p-[21px] relative rounded-[24px] shrink-0 text-text-secondary text-[0px] w-full" data-name="Container" data-node-id="359:190" style={{ backgroundImage: "url('data:image/svg+xml;utf8,<svg viewBox=\\'0 0 1112 222\\' xmlns=\\'http://www.w3.org/2000/svg\\' preserveAspectRatio=\\'none\\'><rect x=\\'0\\' y=\\'0\\' height=\\'100%\\' width=\\'100%\\' fill=\\'url(%23grad)\\' opacity=\\'0.10000000149011612\\'/><defs><radialGradient id=\\'grad\\' gradientUnits=\\'userSpaceOnUse\\' cx=\\'0\\' cy=\\'0\\' r=\\'10\\' gradientTransform=\\'matrix(-112.2 14.379 -15.455 -66.037 1122 59.217)\\'><stop stop-color=\\'rgba(138,163,239,1)\\' offset=\\'0\\'/><stop stop-color=\\'rgba(138,163,239,0)\\' offset=\\'1\\'/></radialGradient></defs></svg>'), linear-gradient(90deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.4) 100%)" }}>
                            <p className="relative shrink-0 w-full" data-node-id="359:191">
                              <span className="font-noto-sans leading-[26px] text-[16px]" >{`This is a `}</span>
                              <span className="font-noto-sans font-bold leading-[26px] text-[16px]" >
                                Phase I completed study
                              </span>
                              <span className="font-noto-sans leading-[26px] text-[16px]" >{` of cytoreductive surgery plus hyperthermic intrathoracic pleural chemotherapy (HITC) conducted by M.D. Anderson Cancer Center. The trial studied `}</span>
                              <span className="font-noto-sans font-bold leading-[26px] text-[16px]" >
                                children and adolescents (ages 3-21)
                              </span>
                              <span className="font-noto-sans leading-[26px] text-[16px]" >{` with `}</span>
                              <span className="font-noto-sans font-bold leading-[26px] text-[16px]" >
                                unilateral pleural malignancy
                              </span>
                              <span className="font-noto-sans leading-[26px] text-[16px]" >
                                , with cisplatin as the key investigational drug.
                              </span>
                            </p>
                            <p className="relative shrink-0 w-full" data-node-id="359:192">
                              <span className="font-noto-sans leading-[26px] text-[16px]" >{`The primary goal was to determine the `}</span>
                              <span className="font-noto-sans font-bold leading-[26px] text-[16px]" >
                                Maximum Tolerated Dose (MTD)
                              </span>
                              <span className="font-noto-sans leading-[26px] text-[16px]" >{` of hyperthermic cisplatin and assess safety parameters. The study enrolled `}</span>
                              <span className="font-noto-sans font-bold leading-[26px] text-[16px]" >
                                7 participants
                              </span>
                              <span className="font-noto-sans leading-[26px] text-[16px]" >{` between August 20, 2014, and completion on August 25, 2020, conducted at MD Anderson Cancer Center in Houston, Texas.`}</span>
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-[rgba(255,255,255,0.4)] border border-solid border-white content-stretch flex flex-col items-start justify-center p-[20px] xl:p-[28px] relative rounded-[16px] w-full" data-name="Container" data-node-id="359:193">
                        <div className="content-stretch flex flex-col xl:flex-row gap-[24px] items-start relative shrink-0 w-full" data-name="Container" data-node-id="359:194">
                          <div className="relative shrink-0 size-[20px]" data-name="Icon" data-node-id="359:195">
                            <img alt="" className="absolute block max-w-none size-full" src={imgIcon5} />
                          </div>
                          <div className="content-stretch flex flex-1 flex-col gap-[12px] items-start min-h-px min-w-px relative" data-name="Container" data-node-id="359:199">
                            <p className="font-outfit font-bold leading-[20px] relative shrink-0 text-text-primary text-[15px] w-full" data-node-id="359:200">
                              Match Context
                            </p>
                            <p className="font-noto-sans font-normal leading-[1.6] relative shrink-0 text-text-secondary text-[14px] md:text-[15px] w-full" data-node-id="359:201">
                              <span className="leading-[26px] text-[15px]">Based on your search for </span>
                              <span className="leading-[26px] text-[15px]">
                                adult non-small-cell lung cancer trials in Germany using cisplatin
                              </span>
                              <span className="leading-[26px] text-[15px]">, this trial is </span>
                              <span className="leading-[26px] text-[15px] font-semibold">
                                not a direct match
                              </span>
                              <span className="leading-[26px] text-[15px]">. However, it's relevant because it uses </span>
                              <span className="leading-[26px] text-[15px] font-semibold">
                                cisplatin in a thoracic/pleural cancer context
                              </span>
                              <span className="leading-[26px] text-[15px]">
                                , which may provide insights into cisplatin-based treatment approaches for lung-related malignancies, though in a pediatric population and different geographic location.
                              </span>
                            </p>
                          </div>
                          <div className="gap-x-[12px] gap-y-[12px] grid grid-cols-1 sm:grid-cols-2 h-auto relative shrink-0 w-full xl:w-[446px]" data-name="Container" data-node-id="359:202">
                            <div className="border-[1.6px] border-solid border-white content-stretch flex flex-col gap-[12px] items-start p-[20px] relative rounded-[16px] self-stretch shrink-0" data-name="Container" data-node-id="359:203" style={{ backgroundImage: "linear-gradient(154.393deg, rgba(138, 163, 239, 0.1) 0%, rgba(0, 0, 0, 0) 100%)" }}>
                              <p className="font-noto-sans font-normal leading-[16px] relative shrink-0 text-text-secondary text-[13px] whitespace-nowrap" data-node-id="359:204">
                                Trial Relevance Score
                              </p>
                              <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-name="Container" data-node-id="359:205">
                                <p className="font-noto-sans font-normal leading-[20px] relative shrink-0 text-[#f6ad55] text-[15px] whitespace-nowrap font-medium" data-node-id="359:206">
                                  68%
                                </p>
                                <div className="bg-[rgba(255,152,0,0.2)] content-stretch flex flex-col h-[8px] items-start overflow-clip relative rounded-[26843500px] shrink-0 w-full" data-name="Primitive.div" data-node-id="359:207">
                                  <div className="bg-[#f6ad55] h-[8px] shrink-0 w-[68%] rounded-[26843500px]" data-name="Container" data-node-id="359:208" />
                                </div>
                              </div>
                            </div>
                            <div className="border-[1.6px] border-solid border-white content-stretch flex flex-col font-noto-sans font-normal gap-[12px] items-start p-[20px] relative rounded-[16px] self-stretch shrink-0" data-name="Container" data-node-id="359:209" style={{ backgroundImage: "linear-gradient(154.393deg, rgba(138, 163, 239, 0.1) 0%, rgba(0, 0, 0, 0) 100%)" }}>
                              <p className="leading-[16px] relative shrink-0 text-text-secondary text-[13px] whitespace-nowrap" data-node-id="359:210">
                                Eligibility Match
                              </p>
                              <p className="leading-[20px] min-w-full relative shrink-0 text-[#f45954] text-[15px] w-[min-content] font-medium" data-node-id="359:211">
                                Low
                              </p>
                            </div>
                            <div className="border-[1.6px] border-solid border-white content-stretch flex flex-col font-noto-sans font-normal gap-[12px] items-start p-[20px] relative rounded-[16px] self-stretch shrink-0" data-name="Container" data-node-id="359:212" style={{ backgroundImage: "linear-gradient(157.926deg, rgba(138, 163, 239, 0.1) 0%, rgba(0, 0, 0, 0) 100%)" }}>
                              <p className="leading-[16px] relative shrink-0 text-text-secondary text-[13px] whitespace-nowrap" data-node-id="359:213">
                                Location Match
                              </p>
                              <p className="leading-[20px] min-w-full relative shrink-0 text-text-primary text-[15px] w-[min-content] font-medium" data-node-id="359:214">
                                Not aligned
                              </p>
                            </div>
                            <div className="border-[1.6px] border-solid border-white content-stretch flex flex-col font-noto-sans font-normal gap-[12px] items-start p-[20px] relative rounded-[16px] self-stretch shrink-0" data-name="Container" data-node-id="359:215" style={{ backgroundImage: "linear-gradient(157.926deg, rgba(138, 163, 239, 0.1) 0%, rgba(0, 0, 0, 0) 100%)" }}>
                              <p className="leading-[16px] relative shrink-0 text-text-secondary text-[13px] whitespace-nowrap" data-node-id="359:216">
                                Trial Type
                              </p>
                              <p className="leading-[20px] min-w-full relative shrink-0 text-text-primary text-[15px] w-[min-content] font-medium" data-node-id="359:217">
                                Safety / Dose Escalation
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="bg-[rgba(255,255,255,0.4)] border border-solid border-white relative rounded-[16px] shrink-0 w-full" data-name="Container" data-node-id="359:218">
                        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start p-[20px] relative w-full">
                          <div className="content-stretch flex gap-[12px] items-start relative shrink-0 w-full" data-name="Container" data-node-id="359:219">
                            <div className="relative shrink-0 size-[20px]" data-name="Icon" data-node-id="359:220">
                              <img alt="" className="absolute block max-w-none size-full" src={imgIcon6} />
                            </div>
                            <div className="content-stretch flex flex-[1_0_0] flex-col gap-[12px] items-start min-h-px min-w-px relative" data-name="Container" data-node-id="359:223">
                              <p className="font-outfit font-bold leading-[20px] relative shrink-0 text-text-primary text-[14px] whitespace-nowrap" data-node-id="359:224" >
                                Why This Trial Matched
                              </p>
                              <div className="content-stretch flex flex-col lg:flex-row gap-[8px] items-start relative shrink-0 w-full" data-node-id="359:225">
                                <div className="bg-[rgba(255,255,255,0.4)] border-[1.6px] border-solid border-white content-stretch flex flex-1 gap-[12px] items-start min-h-px min-w-px p-[12px] relative rounded-[16px] w-full lg:w-auto" data-name="List Item" data-node-id="359:226">
                                  <div className="flex shrink-0 items-center justify-center p-1" data-name="Text" data-node-id="359:227">
                                    <p className="font-noto-sans font-bold text-[#14b8a6] text-[16px]" data-node-id="359:228">
                                      ✓
                                    </p>
                                  </div>
                                  <p className="flex-1 font-noto-sans font-normal leading-[1.5] relative text-text-secondary text-[14px]" data-node-id="359:229" >
                                    Cisplatin as the primary chemotherapy agent
                                  </p>
                                </div>
                                <div className="bg-[rgba(255,255,255,0.4)] border-[1.6px] border-solid border-white content-stretch flex flex-1 gap-[12px] items-start min-h-px min-w-px p-[12px] relative rounded-[16px] w-full lg:w-auto" data-name="List Item" data-node-id="359:230">
                                  <div className="flex shrink-0 items-center justify-center p-1" data-name="Text" data-node-id="359:231">
                                    <p className="font-noto-sans font-bold text-[#14b8a6] text-[16px]" data-node-id="359:232">
                                      ✓
                                    </p>
                                  </div>
                                  <p className="flex-1 font-noto-sans font-normal leading-[1.5] relative text-text-secondary text-[14px]" data-node-id="359:233" >
                                    Lung/pleural cancer treatment context
                                  </p>
                                </div>
                                <div className="bg-[rgba(255,255,255,0.4)] border-[1.6px] border-solid border-white content-stretch flex flex-1 gap-[12px] items-start min-h-px min-w-px p-[12px] relative rounded-[16px] w-full lg:w-auto" data-name="List Item" data-node-id="359:234">
                                  <div className="flex shrink-0 items-center justify-center p-1" data-name="Text" data-node-id="359:235">
                                    <p className="font-noto-sans font-bold text-[#14b8a6] text-[16px]" data-node-id="359:236">
                                      ✓
                                    </p>
                                  </div>
                                  <p className="flex-1 font-noto-sans font-normal leading-[1.5] relative text-text-secondary text-[14px]" data-node-id="359:237" >
                                    Cancer-related keywords in your search history
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="relative shrink-0 w-full" data-node-id="359:238">
                        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col lg:flex-row gap-[24px] items-stretch relative w-full">
                          <div className="bg-[rgba(255,255,255,0.4)] border border-solid border-white content-stretch flex flex-1 flex-col items-start min-h-px min-w-px p-[20px] relative rounded-[16px] overflow-hidden" data-name="Container" data-node-id="359:239">
                            <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full" data-node-id="359:240">
                              <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="Heading 3" data-node-id="359:241">
                                <div className="relative shrink-0 size-[20px]" data-name="solar:calendar-bold" data-node-id="359:242">
                                  <img alt="" className="absolute block max-w-none size-full" src={imgSolarCalendarBold} />
                                </div>
                                <p className="font-outfit font-bold leading-[28px] relative shrink-0 text-text-primary text-[14px] whitespace-nowrap" data-node-id="359:245" >
                                  Trial Timeline
                                </p>
                              </div>
                              <TrialTimelineChart />
                            </div>
                          </div>
                          <div className="bg-[rgba(255,255,255,0.4)] border border-solid border-white content-stretch flex flex-1 flex-col items-start min-h-px min-w-px p-[20px] relative rounded-[16px]" data-name="Container" data-node-id="359:316">
                            <div className="content-stretch flex flex-1 flex-col items-start justify-between relative w-full" data-node-id="359:317">
                              <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="Heading 3" data-node-id="359:318">
                                <div className="relative shrink-0 size-[20px]" data-name="fluent:people-12-filled" data-node-id="359:319">
                                  <img alt="" className="absolute block max-w-none size-full" src={imgFluentPeople12Filled1} />
                                </div>
                                <p className="font-outfit font-bold leading-[28px] relative shrink-0 text-text-primary text-[14px] whitespace-nowrap" data-node-id="359:321" >
                                  Population Demographics
                                </p>
                              </div>
                              <PopulationDemographicsChart />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="relative shrink-0 w-full" data-name="Container" data-node-id="359:348">
                        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-wrap font-noto-sans font-normal gap-[12px] items-center relative w-full">
                          <div className="border-[1.6px] border-solid border-white content-stretch flex flex-[1_0_0] flex-col gap-[12px] h-[117.2px] items-start min-h-px min-w-[200px] pb-[1.6px] pt-[17.6px] px-[17.6px] relative rounded-[16px]" data-name="Container" data-node-id="359:349" style={{ backgroundImage: "linear-gradient(156.458deg, rgba(138, 163, 239, 0.1) 0%, rgba(0, 0, 0, 0) 100%)" }}>
                            <p className="leading-[16px] relative shrink-0 text-text-secondary text-[12px] whitespace-nowrap" data-node-id="359:350" >
                              Primary Endpoint
                            </p>
                            <p className="leading-[28px] min-w-full relative shrink-0 text-text-primary text-[16px] w-[min-content]" data-node-id="359:351" >
                              MTD of HITC
                            </p>
                            <p className="leading-[16px] relative shrink-0 text-text-muted text-[12px] whitespace-nowrap" data-node-id="359:352" >
                              Maximum Tolerated Dose
                            </p>
                          </div>
                          <div className="border-[1.6px] border-solid border-white content-stretch flex flex-[1_0_0] flex-col gap-[12px] h-[117.2px] items-start min-h-px min-w-[200px] pb-[1.6px] pt-[17.6px] px-[17.6px] relative rounded-[16px]" data-name="Container" data-node-id="359:353" style={{ backgroundImage: "linear-gradient(156.458deg, rgba(138, 163, 239, 0.1) 0%, rgba(0, 0, 0, 0) 100%)" }}>
                            <p className="leading-[16px] relative shrink-0 text-text-secondary text-[12px] whitespace-nowrap" data-node-id="359:354" >
                              Cisplatin Dose
                            </p>
                            <p className="leading-[28px] min-w-full relative shrink-0 text-text-secondary text-[16px] w-[min-content]" data-node-id="359:355" >
                              120 mg/m²
                            </p>
                            <p className="leading-[16px] relative shrink-0 text-text-muted text-[12px] whitespace-nowrap" data-node-id="359:356" >
                              Starting dose
                            </p>
                          </div>
                          <div className="border-[1.6px] border-solid border-white content-stretch flex flex-[1_0_0] flex-col gap-[12px] h-[117.2px] items-start min-h-px min-w-[200px] pb-[1.6px] pt-[17.6px] px-[17.6px] relative rounded-[16px]" data-name="Container" data-node-id="359:357" style={{ backgroundImage: "linear-gradient(156.458deg, rgba(138, 163, 239, 0.1) 0%, rgba(0, 0, 0, 0) 100%)" }}>
                            <p className="leading-[16px] relative shrink-0 text-text-secondary text-[12px] whitespace-nowrap" data-node-id="359:358" >
                              Perfusion Time
                            </p>
                            <p className="leading-[28px] min-w-full relative shrink-0 text-text-secondary text-[16px] w-[min-content]" data-node-id="359:359" >
                              60 minutes
                            </p>
                            <p className="leading-[16px] relative shrink-0 text-text-muted text-[12px] whitespace-nowrap" data-node-id="359:360" >
                              At 41°C (±0.5°C)
                            </p>
                          </div>
                          <div className="border-[1.6px] border-solid border-white content-stretch flex flex-[1_0_0] flex-col gap-[12px] h-[117.2px] items-start min-h-px min-w-[200px] pb-[1.6px] pt-[17.6px] px-[17.6px] relative rounded-[16px]" data-name="Container" data-node-id="359:361" style={{ backgroundImage: "linear-gradient(156.458deg, rgba(138, 163, 239, 0.1) 0%, rgba(0, 0, 0, 0) 100%)" }}>
                            <p className="leading-[16px] relative shrink-0 text-text-secondary text-[12px] whitespace-nowrap" data-node-id="359:362" >
                              Secondary Endpoint
                            </p>
                            <p className="leading-[28px] min-w-full relative shrink-0 text-text-secondary text-[16px] w-[min-content]" data-node-id="359:363" >
                              Time to Relapse
                            </p>
                            <p className="leading-[16px] relative shrink-0 text-text-muted text-[12px] whitespace-nowrap" data-node-id="359:364" >
                              Assessed at 3 months
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  {activeSection === 'Eligibility' && (
                    <EligibilityTab />
                  )}
                  {activeSection === 'Population' && (
                    <PopulationTab />
                  )}
                  {activeSection === 'Safety & Risks' && (
                    <SafetyAndRisksTab />
                  )}
                  {activeSection === 'SafetyAndRisks' && (
                    <SafetyAndRisksTab />
                  )}
                  {activeSection === 'Results' && (
                    <ResultsTab />
                  )}
                  {activeSection === 'Location' && (
                    <LocationTab />
                  )}
                  {activeSection === 'Discussion' && (
                    <DiscussionTab />
                  )}
                </div>
                <div className="border-2 border-dashed border-white content-stretch flex flex-col h-[calc(100vh-140px)] lg:h-[calc(100vh-140px)] items-start justify-between overflow-clip rounded-[24px] shrink-0 sticky top-[80px] w-full lg:w-[400px] xl:w-[450px] mt-6 lg:mt-0" data-name="RightBar" data-node-id="376:286" style={{ backgroundImage: "linear-gradient(124.509deg, rgba(99, 102, 241, 0.03) 0%, rgba(244, 89, 84, 0.02) 100%)" }}>
                  {/* Header */}
                  <div className="bg-[rgba(255,255,255,0.4)] border border-solid border-white content-stretch flex flex-col items-start justify-center p-[24px] relative shrink-0 w-full rounded-tl-[24px] rounded-tr-[24px]">
                    <div className="content-stretch flex gap-[12px] items-center relative shrink-0">
                      <div className="bg-[rgba(255,255,255,0.4)] border-[0.471px] border-solid border-white content-stretch flex items-center justify-center p-[8px] relative rounded-[12px] shadow-[-33.882px_60.235px_19.294px_0px_rgba(138,163,239,0),-21.647px_38.588px_17.882px_0px_rgba(138,163,239,0.01),-12.235px_21.647px_15.059px_0px_rgba(138,163,239,0.03),-5.176px_9.412px_10.824px_0px_rgba(138,163,239,0.05),-1.412px_2.353px_6.118px_0px_rgba(138,163,239,0.06)] shrink-0 size-[48px]">
                        <div className="overflow-clip relative shrink-0 size-[24px]">
                          <div className="absolute inset-[4.17%_0_0.78%_8.33%]">
                            <img alt="" className="absolute block max-w-none size-full" src={imgGroup7} />
                          </div>
                        </div>
                      </div>
                      <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 whitespace-nowrap">
                        <p className="font-outfit font-normal text-[20px] md:text-[24px] text-text-primary">AI Assistant</p>
                      </div>
                    </div>
                  </div>

                  {/* Chat Messages Area */}
                  <div ref={chatContainerRef} className="flex-1 w-full overflow-y-auto px-[24px] py-[12px] flex flex-col gap-[12px]">
                    {chatMessages.map((msg, index) => (
                      <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} w-full`}>
                        {msg.role === 'user' ? (
                          <div className="max-w-[85%] bg-brand-primary rounded-[16px] rounded-br-[4px] p-[14px]">
                            <p className="font-noto-sans font-normal leading-[20px] text-[13px] md:text-[14px] text-white">{msg.content}</p>
                          </div>
                        ) : (
                          <div className="max-w-[90%] bg-[rgba(255,255,255,0.5)] border border-solid border-white rounded-[16px] rounded-bl-[4px] p-[14px]">
                            <div className="flex gap-[12px] items-start w-full">
                              <div className="shrink-0 mt-[2px]">
                                <div className="border-brand-primary border-[0.706px] border-solid flex items-center justify-center p-[3.529px] rounded-full shrink-0 size-[24px]" style={{ backgroundImage: "url('data:image/svg+xml;utf8,<svg viewBox=\"0 0 24 24\" xmlns=\"http://www.w3.org/2000/svg\" preserveAspectRatio=\"none\"><rect x=\"0\" y=\"0\" height=\"100%\" width=\"100%\" fill=\"url(%23grad)\" opacity=\"1\"/><defs><radialGradient id=\"grad\" gradientUnits=\"userSpaceOnUse\" cx=\"0\" cy=\"0\" r=\"10\" gradientTransform=\"matrix(7.3479e-17 1.2 -1.2 7.3479e-17 12 12)\"><stop stop-color=\"rgba(33,80,123,1)\" offset=\"0\"/><stop stop-color=\"rgba(23,55,84,1)\" offset=\"0.5\"/><stop stop-color=\"rgba(13,30,46,1)\" offset=\"1\"/></radialGradient></defs></svg>')" }}>
                                  <div className="relative shrink-0 size-[11.294px]">
                                    <img alt="" className="absolute block max-w-none size-full" src={imgRiChatAi3Fill} />
                                  </div>
                                </div>
                              </div>
                              <p className="font-noto-sans font-normal leading-[20px] text-[13px] md:text-[14px] text-text-primary flex-1">{msg.content}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}

                    {/* Related Questions - shown only when 1 message (the welcome) exists */}
                    {chatMessages.length <= 2 && (
                      <div className="flex flex-col gap-[10px] mt-2">
                        <p className="font-noto-sans font-normal leading-[20px] text-text-primary text-[13px] md:text-[14px] px-[8px]">
                          Related Questions
                        </p>
                        <div className="content-start flex flex-wrap gap-2 items-start w-full">
                          {relatedQuestions.map((q, i) => (
                            <button
                              key={i}
                              onClick={() => handleSendMessage(q)}
                              className="bg-[rgba(255,255,255,0.4)] border border-solid border-white px-[14px] py-[8px] rounded-[24px] cursor-pointer hover:bg-[rgba(255,255,255,0.7)] transition-colors"
                            >
                              <span className="font-noto-sans font-normal leading-[20px] text-text-secondary text-[12px] text-center whitespace-nowrap">{q}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Input Area */}
                  <div className="bg-[rgba(255,255,255,0.4)] border border-solid border-white content-stretch flex flex-col gap-[12px] items-center p-[20px] md:p-[24px] relative rounded-bl-[24px] rounded-br-[24px] shrink-0 w-full">
                    <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(chatInput); }} className="w-full">
                      <div className="bg-[rgba(255,255,255,0.5)] border border-solid border-white flex items-center rounded-[16px] w-full p-[6px] pl-[16px] gap-[8px]">
                        <input
                          type="text"
                          value={chatInput}
                          onChange={(e) => setChatInput(e.target.value)}
                          placeholder="Ask about eligibility, endpoints, or relevance..."
                          className="flex-1 bg-transparent border-none outline-none font-noto-sans font-normal leading-[20px] text-text-primary text-[12px] md:text-[13px] placeholder:text-text-muted"
                        />
                        <button
                          type="submit"
                          className="backdrop-blur-[1.353px] bg-brand-primary border-brand-primary border-[0.676px] border-solid flex items-center justify-center p-[8px] rounded-[12px] shrink-0 size-[36px] cursor-pointer hover:opacity-90 transition-opacity"
                        >
                          <div className="h-[12px] relative shrink-0 w-[11.999px]">
                            <div className="absolute inset-[-3.3%_-3.3%_-3.29%_-3.29%]">
                              <img alt="" className="block max-w-none size-full" src={imgGroup8} />
                            </div>
                          </div>
                        </button>
                      </div>
                    </form>
                  </div>
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