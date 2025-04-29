import React from "react";
import { Button } from "../../../components/ui/button";
import { ArrowRight } from "lucide-react";

interface PointItem {
  id: number;
  title: string;
  description: string;
  imagePath: string;
}

export const CxoPassRegistration = (): JSX.Element => {
  const points: PointItem[] = [
    {
      id: 1,
      title: "プロが今だけ無料カウセリング",
      description: "自分では気づけない可能性を、第三者の視点で引き出します",
      imagePath: "/point1.png"
    },
    {
      id: 2,
      title: "あなたにあった企業からオファー",
      description: "あなたの個性を理解する企業と、納得感ある出会いが生まれます",
      imagePath: "/point2.png"
    },
    {
      id: 3,
      title: "副業からCXOにチャレンジ",
      description: "経営の入り口として、副業でCxO的役割に挑戦する道もあります",
      imagePath: "/point3.png"
    }
  ];

  return (
    <div className="w-full mb-8 md:mb-12 bg-white">
      <div className="w-full">
        <h3 className="text-lg md:text-xl font-bold mb-4 md:mb-6">
          <span className="text-[#343C4B]">本当にCxOキャリアを考えるあなたは</span>
          <span className="text-[#FF3232]">CxOPass</span>
          <span className="text-[#343C4B]">に登録</span>
        </h3>

        <div className="space-y-4 md:space-y-6 mb-6 md:mb-8">
          {points.map((point) => (
            <div key={point.id} className="flex items-center gap-4 md:gap-6">
              <div className="flex-shrink-0 relative">
                <img src={point.imagePath} alt={point.title} className="w-[38px] h-[47px]" />
              </div>
              <div className="flex-1">
                <h3 className="text-base md:text-lg font-bold text-[#343C4B] mb-1 md:mb-2">{point.title}</h3>
                <p className="text-xs md:text-sm text-[#343C4B]">{point.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center">
          <Button
            className="w-full md:w-[320px] h-[60px] md:h-[70px] bg-[#ff3232] hover:bg-[#e62e2e] text-white text-base md:text-lg font-bold rounded-full flex items-center justify-center gap-2"
          >
            CxO-Passに登録する
            <ArrowRight className="w-4 md:w-5 h-4 md:h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};