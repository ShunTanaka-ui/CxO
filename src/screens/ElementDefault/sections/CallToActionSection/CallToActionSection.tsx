import React from "react";
import { Card, CardContent } from "../../../../components/ui/card";
import { CTAButton } from "../../../../components/ui/cta-button";

export const CallToActionSection = (): JSX.Element => {
  return (
    <section className="py-12 md:py-16 w-full bg-[#f6f7fa]">
      <Card className="border-none shadow-none max-w-4xl mx-auto px-4 md:px-0">
        <CardContent className="flex flex-col items-center gap-8 md:gap-10 p-0">
          <h2 className="text-[#343c4b] text-[20px] md:text-[24px] font-bold tracking-[1px] leading-[30px] md:leading-[36px] text-center [font-family:'Noto_Sans_JP',Helvetica]">
            CXO診断を受けてCXOの扉を開きましょう
          </h2>

          <CTAButton />
        </CardContent>
      </Card>
    </section>
  );
};