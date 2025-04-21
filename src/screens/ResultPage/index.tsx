import React from "react";
import { Button } from "../../components/ui/button";
import { FooterSection } from "../../components/FooterSection";
import { DebugMenu } from "../../components/DebugMenu";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { PersonalityScoreBar } from "./components/PersonalityScoreBar";
import { CircularProgress } from "./components/CircularProgress";
import { TypeClassification } from "./components/TypeClassification";
import { EnvironmentPoints } from "./components/EnvironmentPoints";
import { CxoPassRegistration } from "./components/CxoPassRegistration";
import { ShareSection } from "./components/ShareSection";

interface PersonalityScore {
  leftLabel: string;
  rightLabel: string;
  percentage: number;
  color: string;
  type: string;
  description: string;
}

interface EnvironmentPoint {
  title: string;
  description: string;
}

export const ResultPage = (): JSX.Element => {
  const score = 73;

  const personalityScores: PersonalityScore[] = [
    {
      leftLabel: "創造型",
      rightLabel: "拡大型",
      percentage: 72,
      color: "bg-[#4298B4]",
      type: "拡大型",
      description: "考え抜いたうえで一歩を踏み出すタイプ"
    },
    {
      leftLabel: "行動型",
      rightLabel: "計画型",
      percentage: 53,
      color: "bg-[#E4AE3A]",
      type: "計画型",
      description: "考え抜いたうえで一歩を踏み出すタイプ"
    },
    {
      leftLabel: "ビジョン型",
      rightLabel: "尊重型",
      percentage: 65,
      color: "bg-[#33A474]",
      type: "尊重型",
      description: "考え抜いたうえで一歩を踏み出すタイプ"
    },
    {
      leftLabel: "市場型",
      rightLabel: "チーム型",
      percentage: 58,
      color: "bg-[#F25E62]",
      type: "チーム型",
      description: "考え抜いたうえで一歩を踏み出すタイプ"
    }
  ];

  const environmentPoints: EnvironmentPoint[] = [
    {
      title: "カリスマ的リーダー",
      description: "生まれ持った魅力と洞察力のおかげで、他の人はあなたの指揮に従いたいと思うでしょう。"
    },
    {
      title: "明確なビジョンを持って計画を立てる",
      description: "全体像を把握するのが得意なので、革新的な戦略を生み出せます。"
    },
    {
      title: "相手に共感しながらコミュニケーションを図る",
      description: "同僚や顧客のニーズを理解して対応することに長けています。"
    },
    {
      title: "人間本位",
      description: "関係者全員にとって利益となる解決策を見つける才能があります。"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-[#ebf6f1] w-full">
        <div className="max-w-[800px] mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-10">
          <div>
            <div className="text-[#343C4B] text-base font-bold mb-2">
              あなたのCxO適正スコア
            </div>
            <div className="flex items-center gap-2 mb-4">
              <div className="text-6xl font-bold text-[#343C4B]">{score}</div>
              <div className="text-3xl text-[#343C4B]">点</div>
            </div>
            <div className="text-[#343C4B] text-sm leading-relaxed">
              経営に必要な6つの視点から分析した結果、現場とCxOの立ち位置を理解し、チームをまとめるスキルが高く評価されました。
              <br /><br />
              あなたは、組織の中で調和を保ちながら、チームメンバーの力を最大限に引き出すことができる素質を持っています。
            </div>
          </div>
          <img 
            src="/chowa_top.png" 
            alt="ミーティングイラスト" 
            className="w-[280px] md:w-[320px] h-auto md:h-[213px] flex-shrink-0" 
          />
        </div>
      </div>

      <div className="max-w-[800px] mx-auto px-4 py-8 md:py-12">
        <section className="mb-12 md:mb-16">
          <h2 className="flex items-center gap-2 text-xl md:text-2xl font-bold mb-6 md:mb-8">
            <span className="w-8 h-8 border border-black rounded-full flex items-center justify-center">1</span>
            診断結果
          </h2>

          <div className="text-sm text-[#343C4B] leading-relaxed mb-8 md:mb-12">
            あなたは、「現場型のリーダー」経験に基づく現場の目線を、そのまっすぐ真ん中にとらえ、経営とチームの橋渡し役になれるタイプです。調和リーダーとして期待されるスタイル。時には共感を示しながら、時には冷静に判断を下し、人が集まってくる――そんな"つなぎ役"となる今後つくりのタイプです。
          </div>

          <div className="w-full mb-8 md:mb-12">
            <h3 className="text-lg md:text-xl font-bold mb-4 md:mb-6">CxO適正スコア</h3>
            <div className="flex flex-col md:flex-row gap-8 md:gap-12">
              <CircularProgress value={score} />
              <div className="flex-1">
                <p className="text-sm mb-4">CxOとしての資質は+2の傾向であり、特に以下の強みが見られます：</p>
                <ul className="space-y-4">
                  <li className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <img src="/Check.svg" alt="check" className="w-4 h-4" />
                      <span className="font-bold">関係構築力</span>
                    </div>
                    <div className="text-sm text-gray-600 ml-6">立場や背景の異なる人ともスムーズに信頼関係を築く力</div>
                  </li>
                  <li className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <img src="/Check.svg" alt="check" className="w-4 h-4" />
                      <span className="font-bold">現場理解力</span>
                    </div>
                    <div className="text-sm text-gray-600 ml-6">抽象的な戦略を、具体的な現場感覚で捉える力</div>
                  </li>
                  <li className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <img src="/Check.svg" alt="check" className="w-4 h-4" />
                      <span className="font-bold">共創型スタンス</span>
                    </div>
                    <div className="text-sm text-gray-600 ml-6">他者とともに形をつくる、柔軟な巻き込み力</div>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="w-full mb-8 md:mb-12">
            <h3 className="text-lg md:text-xl font-bold mb-4 md:mb-6">あなたのタイプ分類：調和型</h3>
            <p className="text-sm text-[#343C4B] mb-4 md:mb-6">
              あなたは、異なる個性や意見を尊重しながら、全体を整えていく"調整型CxO"。多様性を推進する現代の組織には欠かせない存在です。
            </p>
            <TypeClassification />
          </div>

          <div className="w-full mb-8 md:mb-12">
            <h3 className="text-lg md:text-xl font-bold mb-6 md:mb-8">パーソナリティ傾向スコア</h3>
            <div className="bg-[#F8F9FC] rounded-lg p-4 md:p-8 w-full">
              {personalityScores.map((score, index) => (
                <PersonalityScoreBar key={index} score={score} />
              ))}
            </div>
          </div>

          <div className="w-full mb-8 md:mb-12">
            <h3 className="text-lg md:text-xl font-bold mb-4 md:mb-6">あなたを一言で表すと...</h3>
            <div>
              <h4 className="text-base md:text-lg font-bold text-[#2B7D3C] mb-3 md:mb-4">
                人と事業の真ん中で、"空気を変える人"
              </h4>
              <p className="text-sm text-[#343C4B] leading-relaxed">
                経営の視座を持ちながら、現場の空気や感情にも鋭敏なあなたは、チームの温度を読み、風通しのいい空間をつくる存在。そんなあなたがいることで、組織に"流れ"が生まれ、変化が動き出します。
              </p>
            </div>
          </div>

          <div className="w-full mb-8 md:mb-12">
            <h2 className="flex items-center gap-2 text-xl md:text-2xl font-bold mb-6 md:mb-8">
              <span className="w-8 h-8 border border-black rounded-full flex items-center justify-center">2</span>
              あなたのキャリアパス
            </h2>
            <div className="flex flex-col md:flex-row items-start gap-6 md:gap-12">
              <div className="flex-1">
                <p className="text-sm text-[#343C4B] leading-relaxed">
                  あなたのキャリアパスは、他者の人生に有意義な変化をもたらしたいという根強い欲求に突き動かされている可能性が高いでしょう。あなたは人をインスパイアし、導き、成長させる役割が得意なので、教師やカウンセラー、メンターとしての道も向いています。
                </p>
              </div>
              <div className="w-full md:w-[320px] flex-shrink-0">
                <img 
                  src="/careerup.png" 
                  alt="キャリアアップイメージ" 
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>

          <div className="w-full mb-8 md:mb-12">
            <h2 className="flex items-center gap-2 text-xl md:text-2xl font-bold mb-6 md:mb-8">
              <span className="w-8 h-8 border border-black rounded-full flex items-center justify-center">3</span>
              あなたの活躍できる環境
            </h2>
            <EnvironmentPoints points={environmentPoints} />
          </div>

          <CxoPassRegistration />
        </section>
      </div>

      <ShareSection />
      <FooterSection />
      <DebugMenu />
    </div>
  );
};