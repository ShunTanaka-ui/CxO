import React from "react";
import { Separator } from "../../components/ui/separator";

export const FooterSection = (): JSX.Element => {
  const footerLinks = [
    { text: "サービスサイトトップ", hasSeparator: true },
    { text: "プライバシーポリシー", hasSeparator: true },
    { text: "会社概要", hasSeparator: false },
  ];

  return (
    <footer className="relative w-full bg-black border-t border-solid border-r-0 border-b-0 border-l-0 py-6 md:py-8">
      <div className="flex flex-col items-center justify-center gap-6 md:gap-8">
        <div className="w-[100px] h-[28px] bg-[url(/White_logo.png)] bg-contain bg-center bg-no-repeat" />

        <div className="flex flex-wrap justify-center items-center gap-y-2">
          {footerLinks.map((link, index) => (
            <React.Fragment key={index}>
              <div className="inline-flex items-center">
                <div className="[font-family:'Hiragino_Kaku_Gothic_ProN-W3',Helvetica] font-normal text-white text-[10px] md:text-xs leading-[18px] md:leading-[20.3px]">
                  {link.text}
                </div>
              </div>
              {link.hasSeparator && (
                <Separator
                  orientation="vertical"
                  className="h-4 md:h-5 mx-2 md:mx-3 bg-[#b9b9b9]"
                />
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="[font-family:'Helvetica_Neue-Regular',Helvetica] font-normal text-white text-[8px] md:text-[10px] text-center leading-[14px] md:leading-[16.9px]">
          Copyright © StartPass Co., Ltd. All rights reserved.
        </div>
      </div>
    </footer>
  );
};