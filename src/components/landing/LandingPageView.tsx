import React, { useState } from 'react';
import { LandingNavbar } from './LandingNavbar';
import { HeroSection } from './HeroSection';
import { AboutSection } from './AboutSection';
import { ProductOfferings } from './ProductOfferings';
import { CalculatorSection } from './CalculatorSection';
import { PhysicalCardBanner } from './PhysicalCardBanner';
import { TrustGovernance } from './TrustGovernance';
import { LandingFooter } from './LandingFooter';
import { MembershipApplicationModal } from './MembershipApplicationModal';

export const LandingPageView: React.FC = () => {
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white dark:bg-black text-slate-900 dark:text-white flex flex-col transition-colors duration-300">
      {/* Pristine Institutional Navbar without test toggles */}
      <LandingNavbar onOpenApplyModal={() => setIsApplyModalOpen(true)} />

      <main className="flex-1">
        <HeroSection onOpenApplyModal={() => setIsApplyModalOpen(true)} />
        <AboutSection onOpenApplyModal={() => setIsApplyModalOpen(true)} />
        <ProductOfferings />
        <CalculatorSection />
        <PhysicalCardBanner onOpenApplyModal={() => setIsApplyModalOpen(true)} />
        <TrustGovernance />
      </main>

      <LandingFooter onOpenApplyModal={() => setIsApplyModalOpen(true)} />

      {/* Prospective Member Registration Modal */}
      <MembershipApplicationModal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
      />
    </div>
  );
};
