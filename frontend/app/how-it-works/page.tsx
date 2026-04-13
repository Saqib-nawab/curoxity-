import Navbar from '../../src/components/Navbar';
import HowItWorksHero from '../../src/components/HowItWorksHero';
import HowItWorks from '../../src/components/HowItWorks';
import ClinicalTrialInfo from '../../src/components/ClinicalTrialInfo';
import SafetySection from '../../src/components/SafetySection';
import Footer from '../../src/components/Footer';

export default function HowItWorksPage() {
  return (
    <>
      <Navbar />
      <HowItWorksHero />
      <HowItWorks />
      <ClinicalTrialInfo />
      <SafetySection />
      <Footer />
    </>
  );
}
