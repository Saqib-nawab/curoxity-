

const imgImage = "./research1.svg";
const imgImage1 = "./research2.svg";
const imgImage2 = "./research3.svg";
const imgSolarArrowUpOutline = "./arrow-right.svg";
const imgArrowUpRight = "./arrow-upright.svg";
const imgSolarArrowUpBoldDuotone = "./arrow-right-white.svg";

export default function BlogSection() {
  const blogs = [
    {
      tag: "Breakthrough",
      tagColor: "bg-brand-primary",
      title: "New CAR-T Cell Therapy Shows 85% Response Rate",
      desc: "Recent trials demonstrate unprecedented success in treating resistant forms of leukemia using engineered immune cells, offering new hope for patients who have exhausted other options.",
      img: imgImage
    },
    {
      tag: "Innovation",
      tagColor: "bg-brand-secondary",
      title: "AI-Powered Drug Discovery Accelerates Rare Disease Research",
      desc: "Machine learning algorithms are identifying promising compounds for rare diseases in months rather than years, dramatically speeding up the path from lab to clinical trials.",
      img: imgImage1
    },
    {
      tag: "Patient Success",
      tagColor: "bg-[#f6ad55]",
      title: "How Clinical Trials Are Changing Lives: Real Stories",
      desc: "Hear from patients who found breakthrough treatments through clinical trials, and learn about the impact of participating in cutting-edge medical research.",
      img: imgImage2
    }
  ];

  return (
    <section className="w-full max-w-[1780px] mx-auto px-[70px] py-16 flex flex-col items-center gap-12 relative z-20">
      {/* Header */}
      <div className="flex flex-col items-center gap-6 w-full max-w-[800px] text-center">
        <div className="flex flex-col gap-4">
          <h2 className="font-outfit font-medium text-[40px] leading-[48px] text-text-primary tracking-[-0.4px]">
            Featured Research
          </h2>
          <p className="font-noto-sans text-[16px] leading-[28px] text-text-secondary">
            Stay informed about the latest breakthroughs in clinical research
          </p>
        </div>
        <button className="bg-brand-primary text-white flex items-center gap-3 pl-5 pr-[6px] py-[6px] rounded-[100px] font-noto-sans text-[15px] font-medium shadow-sm hover:opacity-90 transition-opacity">
          Read More
          <div className="bg-white rounded-full w-[34px] h-[34px] flex items-center justify-center text-brand-primary rotate-90">
            <img src={imgSolarArrowUpOutline} alt="arrow" className="w-[18px] h-[18px] -rotate-90" />
          </div>
        </button>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 w-full">
        {blogs.map((blog, idx) => (
          <div key={idx} className="bg-white/40 border border-white rounded-[24px] p-4 flex flex-col group cursor-pointer transition-all h-[476px]">
            <div className="relative w-full h-full rounded-[16px] overflow-hidden">
              {/* Background Image */}
              <img
                src={blog.img}
                alt={blog.title}
                className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80"></div>

              {/* Content over image */}
              <div className="absolute inset-0 flex flex-col justify-end p-2">
                <div className="rounded-[16px] p-5 flex flex-col gap-4 relative overflow-hidden transition-all group-hover:border-white/20">
                  {/* Badge/Tag */}
                  <div className="flex items-center">
                    <span className={`${blog.tagColor || 'bg-blue-500'} text-white px-3 py-1 rounded-full text-[12px] font-noto-sans font-medium`}>
                      {blog.tag}
                    </span>
                  </div>

                  {/* Title and Arrow */}
                  <div className="flex flex-col gap-3">
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="font-noto-sans text-[16px] leading-[28px] text-white font-medium line-clamp-2">
                        {blog.title}
                      </h3>
                      <img
                        src={imgArrowUpRight}
                        className="w-4 h-4 shrink-0 opacity-70 group-hover:opacity-100 transition-opacity"
                        alt="arrow"
                      />
                    </div>

                    {/* Description */}
                    <p className="font-noto-sans text-[14px] leading-[20px] text-white/90 line-clamp-3">
                      {blog.desc}
                    </p>
                  </div>

                  {/* Read Blog CTA */}
                  <div className="flex items-center pt-2">
                    <span className="font-noto-sans font-bold text-white text-[14px]">Read Blog</span>
                    <img
                      src={imgSolarArrowUpBoldDuotone}
                      className="w-6 h-6 ml-2"
                      alt="read"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
