import React from "react";
import { Card, CardContent } from "../../../../components/ui/card";

interface ServiceCard {
  id: number;
  iconUrl: string;
  title: string;
  description: string;
}

export const ServicesSection = (): JSX.Element => {
  const serviceCards: ServiceCard[] = [
    {
      id: 1,
      iconUrl: "..//mask-group.png",
      title: "自分の強み・弱みが明確になる",
      description:
        "漠然とした「自分らしさ」が、言語化されて具体的なアクションにつながります。",
    },
    {
      id: 2,
      iconUrl: "..//mask-group-1.png",
      title: " 経営に必要な視点を理解できる",
      description:
        "CxOに求められる視点を知り、自分に足りない観点を把握できます。",
    },
    {
      id: 3,
      iconUrl: "..//mask-group-2.png",
      title: "キャリアの方向性に自信が持てる",
      description:
        "タイプ診断を通じて、自分に合った役割や進むべき道が見えてきます。",
    },
    {
      id: 4,
      iconUrl: "..//mask-group-3.png",
      title: " 自己理解が深まり選択に軸ができる",
      description:
        "価値観・判断基準の傾向を知ることで、ブレない選択がしやすくなります。",
    },
    {
      id: 5,
      iconUrl: "..//mask-group-4.png",
      title: "フィードバックを受ける力が高まる",
      description:
        "診断を通じて他者視点を受け入れる準備が整い、素直に学べる土台ができます。",
    },
    {
      id: 6,
      iconUrl: "..//mask-group-5.png",
      title: "チームでの立ち位置が見えてくる",
      description:
        "自分の特性から、チームにおける最適な役割や動き方が明確になります。",
    },
  ];

  return (
    <section className="w-full py-10 pb-20 bg-white flex flex-col items-center px-4 md:px-0">
      <h2 className="mb-10 [font-family:'Noto_Sans_JP',Helvetica] font-bold text-[20px] md:text-[24px] text-center tracking-[1.00px] leading-[30px] md:leading-[36px]">
        <span className="text-[#343c4b] tracking-[0.32px]">
          CXO診断で得られる
        </span>
        <span className="text-[#ff3232] tracking-[0.32px]">
          さまざまなメリット
        </span>
      </h2>

      <div className="max-w-[940px] flex flex-wrap gap-[30px_20px] justify-center">
        {serviceCards.map((card) => (
          <Card key={card.id} className="border-none shadow-none w-full md:w-auto">
            <CardContent className="p-0 flex items-start gap-[19px]">
              <div
                className="relative w-[46px] h-[46px] flex-shrink-0"
                style={{ background: `url(${card.iconUrl}) 50% 50% / cover` }}
              />
              <div className="flex flex-col items-start gap-[5px]">
                <h3 className="mt-[-1.00px] [font-family:'Noto_Sans_JP',Helvetica] font-bold text-[#343c4b] text-sm tracking-[-0.03px] leading-[26px]">
                  {card.title}
                </h3>
                <p className="w-full md:w-[235px] [font-family:'Noto_Sans_JP',Helvetica] font-medium text-[#51596a] text-xs tracking-[-0.05px] leading-5">
                  {card.description}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};