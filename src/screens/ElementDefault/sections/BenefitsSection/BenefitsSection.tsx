import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/card";

interface BenefitCard {
  id: number;
  title: string;
  bgColor: string;
  borderColor: string;
  content: {
    score?: string;
    unit?: string;
    type?: string;
    typeColor?: string;
    skills?: string[];
    traits?: Array<{
      left: string;
      right: string;
      percentage: string;
      color: string;
      textColor: string;
      position: string;
      result: string;
    }>;
    description: React.ReactNode;
  };
}

export const BenefitsSection = (): JSX.Element => {
  const benefitCards: BenefitCard[] = [
    {
      id: 1,
      title: "CXO適性スコア",
      bgColor: "bg-[#ecf4f7]",
      borderColor: "border-[#a6dcf0]",
      content: {
        score: "73",
        unit: "点",
        skills: ["関係構築力", "現場理解力", "共創型スタンス"],
        description: (
          <>
            <span className="font-bold tracking-[0.12px]">
              あなたの「経営視点」の伸びしろを数値化
            </span>
            <span className="font-medium tracking-[0.12px]">
              {" "}
              意思決定力・戦略思考・共創力など、CxOに求められる6つの視点をもとに、あなたの経営適性をスコア化します。
            </span>
          </>
        ),
      },
    },
    {
      id: 2,
      title: "CXOタイプ分類",
      bgColor: "bg-[#ebf6f1]",
      borderColor: "border-[#A7F0A9]",
      content: {
        type: "調和型CXO",
        typeColor: "text-[#397c3f]",
        description: (
          <>
            <span className="font-bold tracking-[0.12px]">
              どんなCxOスタイルがあなたに合うかわかる{" "}
            </span>
            <span className="tracking-[0.12px]">
              あなたの特性をもとに、真逆型・類似型・調和型の3タイプから親和性の高いタイプを判定します。
            </span>
          </>
        ),
      },
    },
    {
      id: 3,
      title: "パーソナリティ傾向",
      bgColor: "bg-[#f3eff5]",
      borderColor: "border-[#E5A7F0]",
      content: {
        traits: [
          {
            left: "行動型",
            right: "思考型",
            percentage: "72%",
            color: "bg-[#4298b4]",
            textColor: "text-[#4298b4]",
            position: "left-[114px]",
            result: "思考型寄り",
          },
          {
            left: "熟考型",
            right: "直感型",
            percentage: "53%",
            color: "bg-[#e4ae3a]",
            textColor: "text-[#e4ae3a]",
            position: "left-[94px]",
            result: "直感型寄り",
          },
        ],
        description: (
          <>
            <span className="font-bold tracking-[0.12px]">
              行動スタイル・価値観の特徴を言語化{" "}
            </span>
            <span className="tracking-[0.12px]">
              自己認識を深め、キャリア設計に活かせる「自分らしさ」のヒントを提供。あなたの強みと成長課題が見えてきます。
            </span>
          </>
        ),
      },
    },
  ];

  const renderCardImage = (cardId: number) => {
    const imageMap = {
      1: "3.png",
      2: "2.png",
      3: "1.png",
    };

    return (
      <img
        className="w-full h-full object-contain"
        alt={`CXO診断 画像 ${cardId}`}
        src={imageMap[cardId as keyof typeof imageMap]}
      />
    );
  };

  return (
    <section className="flex flex-col items-center gap-10 py-10 bg-white w-full px-4 md:px-0">
      <h2 className="text-[20px] md:text-[24px] leading-[30px] md:leading-[36px] text-center [font-family:'Noto_Sans_JP',Helvetica] font-bold">
        <span className="text-[#ff3232] tracking-[0.32px]">
          スタートアップ経営層
        </span>
        <span className="text-[#343c4b]">
          としてのキャリアを考えてみませんか？
        </span>
      </h2>

      <div className="flex flex-wrap justify-center gap-5">
        {benefitCards.map((card) => (
          <Card
            key={card.id}
            className={`w-full md:w-[300px] rounded-[8.27px] overflow-hidden ${card.borderColor} shadow-none`}
          >
            <CardHeader
              className={`px-0 py-[16.55px] ${card.bgColor} -mx-[15.91px] w-full md:w-[331.82px]`}
            >
              <CardTitle className="w-full h-[24.84px] text-[#343c4b] text-lg md:text-xl tracking-[-0.04px] leading-[24.8px] [font-family:'Noto_Sans_JP',Helvetica] font-bold text-center">
                {card.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="flex justify-center pt-[14.89px]">
                <div className="w-full md:w-[266.3px] h-[82.77px] bg-transparent rounded-[9px] overflow-hidden relative">
                  {renderCardImage(card.id)}
                </div>
              </div>

              <div className="flex items-center justify-center p-4 md:p-[16.55px] relative w-full">
                <p className="flex-1 mt-[-0.83px] [font-family:'Noto_Sans_JP',Helvetica] font-normal text-[#343c4b] text-xs tracking-[1.00px] leading-[19.9px]">
                  {card.content.description}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};