import React from 'react';
import { HeroSection } from './HeroSection';
import { ProductOfferings } from './ProductOfferings';
import { CalculatorSection } from './CalculatorSection';
import { PhysicalCardBanner } from './PhysicalCardBanner';
import { TrustGovernance } from './TrustGovernance';
import { LandingFooter } from './LandingFooter';

export const LandingPageView: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <main className="flex-1">
        <HeroSection />
        <ProductOfferings />
        <CalculatorSection />
        <PhysicalCardBanner />
        <TrustGovernance />
      </main>
      <LandingFooter />
    </div>
  );
};
