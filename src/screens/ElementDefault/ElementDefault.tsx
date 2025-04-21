import React from "react";
import { BenefitsSection } from "./sections/BenefitsSection";
import { CallToActionSection } from "./sections/CallToActionSection";
import { FooterSection } from "./sections/FooterSection/FooterSection";
import { HeaderSection } from "./sections/HeaderSection";
import { ServicesSection } from "./sections/ServicesSection";
import { DebugMenu } from "../../components/DebugMenu";

export const ElementDefault = (): JSX.Element => {
  return (
    <main className="w-full bg-white">
      <div className="flex flex-col items-center">
        <HeaderSection />
        <BenefitsSection />
        <ServicesSection />
        <CallToActionSection />
        <FooterSection />
        <DebugMenu />
      </div>
    </main>
  );
};