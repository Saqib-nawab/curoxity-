'use client';
import Navbar from '../src/components/Navbar';
import Hero from '../src/components/Hero';
import FeaturedTrials from '../src/components/FeaturedTrials';
import HowItWorks from '../src/components/HowItWorks';
import BlogSection from '../src/components/BlogSection';
import CTASection from '../src/components/CTASection';
import Footer from '../src/components/Footer';

export default function HomePage() {
  return (
    <>
      <Navbar />
      <Hero />
      <FeaturedTrials />
      <BlogSection />
      <HowItWorks />
      <CTASection />
      <Footer />
    </>
  );
}
