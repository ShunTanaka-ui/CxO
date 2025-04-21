import { CheckIcon } from "lucide-react";
import React from "react";
import { Card, CardContent } from "../../../../components/ui/card";
import { CTAButton } from "../../../../components/ui/cta-button";

export const HeaderSection = (): JSX.Element => {
  const featureList = [
    "スタートアップ経営に必要な素質・視点を5分でチェック",
    "自分の強みと、どんなポジションが合うかがわかる",
    "これからキャリアを伸ばしたい全てのビジネスパーソンに",
  ];

  return (
    <header className="flex flex-col w-full items-center pt-8 md:pt-12 pb-8 md:pb-12 px-4 md:px-0 relative bg-[#f5f7f9]">
      <div className="flex flex-col items-center gap-4 md:gap-6 relative w-full max-w-[600px]">
        <img
          className="w-full h-auto hidden md:block"
          alt="CxO-Pass Header"
          src="/Frame 6.png"
        />
        <img
          className="w-full h-auto md:hidden"
          alt="CxO-Pass Header Mobile"
          src="/Frame_SP.png"
        />

        <Card className="w-full md:w-auto border-none rounded-[15px] bg-white shadow-none">
          <CardContent className="p-4 md:p-5 space-y-[7px]">
            {featureList.map((feature, index) => (
              <div key={index} className="flex items-center gap-2">
                <CheckIcon className="w-5 md:w-6 h-[16px] md:h-[19.2px] text-[#343c4b] flex-shrink-0" />
                <div className="[font-family:'Noto_Sans_JP',Helvetica] font-medium text-[#343c4b] text-xs md:text-sm tracking-[0.50px] leading-[24px] md:leading-[30px]">
                  {feature}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <CTAButton />
      </div>
    </header>
  );
};