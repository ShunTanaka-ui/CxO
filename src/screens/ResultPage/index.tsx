import React, { useEffect, useState } from "react";
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
import { useNavigate } from "react-router-dom";

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

interface ManagementScoreData {
  totalScore: number;
  averageScore: number;
  answeredCount: number;
}

interface PersonalityScoreData {
  axis1: { scoreA: number, scoreB: number, dominantType: 'A' | 'B', percentage: number };
  axis2: { scoreA: number, scoreB: number, dominantType: 'A' | 'B', percentage: number };
  axis3: { scoreA: number, scoreB: number, dominantType: 'A' | 'B', percentage: number };
  axis4: { scoreA: number, scoreB: number, dominantType: 'A' | 'B', percentage: number };
}

interface PersonalityTypeResult {
  typePattern: string;
  classificationType: '類似型' | '調和型' | '真逆型';
  typeDescription: string;
}

// パーソナリティタイプのマッピング
const personalityTypeMapping: Record<string, PersonalityTypeResult> = {
  'AAAA': {
    typePattern: 'AAAA',
    classificationType: '類似型',
    typeDescription: '未来を描き、市場を切り拓く、生粋のスタートアップ・リーダー'
  },
  'AAAB': {
    typePattern: 'AAAB',
    classificationType: '類似型',
    typeDescription: 'ビジョンと仲間を原動力に、新しい価値を創造する情熱家'
  },
  'AABA': {
    typePattern: 'AABA',
    classificationType: '類似型',
    typeDescription: 'メンバーと対話し、市場ニーズに応える、機動力ある挑戦者'
  },
  'AABB': {
    typePattern: 'AABB',
    classificationType: '調和型',
    typeDescription: 'チームの和を力に、ゼロからイチを生み出す、共感型イノベーター'
  },
  'BBAA': {
    typePattern: 'BBAA',
    classificationType: '調和型',
    typeDescription: '市場を見据え、戦略的に事業を成長させる、冷静な指揮官'
  },
  'BBAB': {
    typePattern: 'BBAB',
    classificationType: '真逆型',
    typeDescription: '組織とビジョンを着実に育て上げる、堅実な組織アーキテクト'
  },
  'BBBA': {
    typePattern: 'BBBA',
    classificationType: '真逆型',
    typeDescription: '緻密な計画と対話で、市場の変化に対応する、信頼のナビゲーター'
  },
  'BBBB': {
    typePattern: 'BBBB',
    classificationType: '真逆型',
    typeDescription: '人とプロセスを磨き、組織の持続的成長を築く、安定の守護者'
  },
  'ABAA': {
    typePattern: 'ABAA',
    classificationType: '類似型',
    typeDescription: '市場を見据え、緻密な戦略で新しい価値を実現する、戦略的創造者'
  },
  'ABAB': {
    typePattern: 'ABAB',
    classificationType: '調和型',
    typeDescription: 'ビジョン達成に向け、計画と組織力を融合させる、未来志向の設計者'
  },
  'ABBA': {
    typePattern: 'ABBA',
    classificationType: '調和型',
    typeDescription: '市場の声とメンバーの知恵を結集し、革新を生む、対話型チャレンジャー'
  },
  'ABBB': {
    typePattern: 'ABBB',
    classificationType: '真逆型',
    typeDescription: '人を活かし、計画的に新しい組織文化を創造する、共創型リーダー'
  },
  'BAAA': {
    typePattern: 'BAAA',
    classificationType: '類似型',
    typeDescription: '市場の変化を捉え、即断即決で事業を拡大する、実践的グロースハッカー'
  },
  'BAAB': {
    typePattern: 'BAAB',
    classificationType: '調和型',
    typeDescription: 'ビジョン達成のため、組織と行動力を両輪でドライブする、行動派リーダー'
  },
  'BABA': {
    typePattern: 'BABA',
    classificationType: '調和型',
    typeDescription: '市場の声に応え、メンバーと共に迅速に改善を進める、現場主義の改革者'
  },
  'BABB': {
    typePattern: 'BABB',
    classificationType: '真逆型',
    typeDescription: 'メンバーの力を引き出し、行動を通じて組織を着実に成長させる、伴走型リーダー'
  }
};

export const ResultPage = (): JSX.Element => {
  const navigate = useNavigate();
  const [score, setScore] = useState<number>(0);
  const [managementScoreData, setManagementScoreData] = useState<ManagementScoreData | null>(null);
  const [personalityScoreData, setPersonalityScoreData] = useState<PersonalityScoreData | null>(null);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [personalityScores, setPersonalityScores] = useState<PersonalityScore[]>([]);
  // タイプ分類の結果を保持するステート
  const [typeResult, setTypeResult] = useState<PersonalityTypeResult>({
    typePattern: 'AABB',
    classificationType: '調和型',
    typeDescription: 'チームの和を力に、ゼロからイチを生み出す、共感型イノベーター'
  });

  useEffect(() => {
    // localStorage から診断結果データを取得
    const storedManagementScoreData = localStorage.getItem('managementScoreData');
    const storedPersonalityScoreData = localStorage.getItem('personalityScoreData');
    const storedAnswers = localStorage.getItem('diagnosticAnswers');

    if (storedManagementScoreData) {
      const parsedData = JSON.parse(storedManagementScoreData) as ManagementScoreData;
      setManagementScoreData(parsedData);
      
      // スコア計算（小数点以下四捨五入）
      const calculatedScore = Math.round(parsedData.totalScore);
      setScore(calculatedScore);
    } else {
      // データがない場合はデモデータを表示（本番では診断ページにリダイレクトすべき）
      console.warn('診断データが見つかりません。デモデータを表示します。');
      setScore(73);
    }

    if (storedPersonalityScoreData) {
      const parsedPersonalityData = JSON.parse(storedPersonalityScoreData) as PersonalityScoreData;
      setPersonalityScoreData(parsedPersonalityData);
      
      // パーソナリティスコアの生成
      const generatedScores = generatePersonalityScores(parsedPersonalityData);
      setPersonalityScores(generatedScores);
      
      // パーソナリティタイプの判定
      const typeResult = determinePersonalityType(parsedPersonalityData);
      setTypeResult(typeResult);
    } else {
      // デモデータを表示
      console.warn('パーソナリティデータが見つかりません。デモデータを表示します。');
      setPersonalityScores(demoPersonalityScores);
      // デモ用のタイプ分類
      setTypeResult({
        typePattern: 'AABB',
        classificationType: '調和型',
        typeDescription: 'チームの和を力に、ゼロからイチを生み出す、共感型イノベーター'
      });
    }

    if (storedAnswers) {
      setAnswers(JSON.parse(storedAnswers));
    }

    setLoading(false);
  }, [navigate]);

  // パーソナリティデータからタイプパターンを判定し、対応する分類とタイプ名を返す関数
  const determinePersonalityType = (data: PersonalityScoreData): PersonalityTypeResult => {
    // 各軸の優位タイプから4文字のタイプパターンを作成
    const typePattern = 
      data.axis1.dominantType + 
      data.axis2.dominantType + 
      data.axis3.dominantType + 
      data.axis4.dominantType;
    
    // マッピングテーブルから対応する結果を取得
    const result = personalityTypeMapping[typePattern];
    
    if (result) {
      return result;
    } else {
      // 万が一対応するパターンがない場合のフォールバック
      console.warn(`未知のタイプパターン: ${typePattern}`);
      return {
        typePattern,
        classificationType: '調和型',
        typeDescription: 'チームの和を力に、組織の成長に貢献する、バランス型リーダー'
      };
    }
  };

  // パーソナリティスコアデータをもとに表示用のPersonalityScoreを生成する関数
  const generatePersonalityScores = (data: PersonalityScoreData): PersonalityScore[] => {
    return [
      {
        leftLabel: "拡大・効率型",
        rightLabel: "創造・開拓型",
        percentage: data.axis1.dominantType === 'A' ? data.axis1.percentage : 100 - data.axis1.percentage,
        color: "bg-[#4298B4]",
        type: data.axis1.dominantType === 'A' ? "創造・開拓型" : "拡大・効率型",
        description: data.axis1.dominantType === 'A' 
          ? "新しい価値やサービスをゼロから生み出すことに強みを持つタイプ" 
          : "既存の事業や仕組みを成長させ、効率化することに強みを持つタイプ"
      },
      {
        leftLabel: "分析・計画型",
        rightLabel: "直感・行動型",
        percentage: data.axis2.dominantType === 'A' ? data.axis2.percentage : 100 - data.axis2.percentage,
        color: "bg-[#E4AE3A]",
        type: data.axis2.dominantType === 'A' ? "直感・行動型" : "分析・計画型",
        description: data.axis2.dominantType === 'A' 
          ? "直感を信じ、素早く行動を起こすことに強みを持つタイプ" 
          : "データと論理に基づいて慎重に計画を立てることを重視するタイプ"
      },
      {
        leftLabel: "メンバー尊重型",
        rightLabel: "ビジョン提示型",
        percentage: data.axis3.dominantType === 'A' ? data.axis3.percentage : 100 - data.axis3.percentage,
        color: "bg-[#33A474]",
        type: data.axis3.dominantType === 'A' ? "ビジョン提示型" : "メンバー尊重型",
        description: data.axis3.dominantType === 'A' 
          ? "明確なビジョンを掲げ、チームを導くことに強みを持つタイプ" 
          : "メンバーの意見を尊重し、チームの力を引き出すことを大切にするタイプ"
      },
      {
        leftLabel: "チーム・文化志向",
        rightLabel: "市場・顧客志向",
        percentage: data.axis4.dominantType === 'A' ? data.axis4.percentage : 100 - data.axis4.percentage,
        color: "bg-[#F25E62]",
        type: data.axis4.dominantType === 'A' ? "市場・顧客志向" : "チーム・文化志向",
        description: data.axis4.dominantType === 'A' 
          ? "市場や顧客のニーズを重視し、外部環境に焦点を当てるタイプ" 
          : "組織の文化や風土、チームの結束力を重視するタイプ"
      }
    ];
  };

  // デモ用のパーソナリティスコアデータ
  const demoPersonalityScores: PersonalityScore[] = [
    {
      leftLabel: "拡大・効率型",
      rightLabel: "創造・開拓型",
      percentage: 72,
      color: "bg-[#4298B4]",
      type: "拡大・効率型",
      description: "既存の事業や仕組みを成長させ、効率化することに強みを持つタイプ"
    },
    {
      leftLabel: "分析・計画型",
      rightLabel: "直感・行動型",
      percentage: 53,
      color: "bg-[#E4AE3A]",
      type: "分析・計画型",
      description: "データと論理に基づいて慎重に計画を立てることを重視するタイプ"
    },
    {
      leftLabel: "メンバー尊重型",
      rightLabel: "ビジョン提示型",
      percentage: 65,
      color: "bg-[#33A474]",
      type: "メンバー尊重型",
      description: "メンバーの意見を尊重し、チームの力を引き出すことを大切にするタイプ"
    },
    {
      leftLabel: "チーム・文化志向",
      rightLabel: "市場・顧客志向",
      percentage: 58,
      color: "bg-[#F25E62]",
      type: "チーム・文化志向",
      description: "組織の文化や風土、チームの結束力を重視するタイプ"
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

  // スコアに基づいたメッセージを取得する関数
  const getScoreMessage = (score: number) => {
    if (score >= 80) {
      return "経営者・CxOとしての高い適性があります。大局的視点と実行力のバランスが取れています。";
    } else if (score >= 60) {
      return "経営的視点を持ったリーダーとしての素質があります。組織の中で変革を起こす力があります。";
    } else if (score >= 40) {
      return "実務者としての強みに加え、リーダーシップの素質もあります。より高い視点で物事を捉える練習が必要です。";
    } else {
      return "特定の専門領域での活躍が期待できます。チームの一員として、組織に貢献する力があります。";
    }
  };

  // スコアに基づいた強みを取得する関数
  const getStrengths = (score: number) => {
    if (score >= 80) {
      return [
        { title: "優れた戦略的思考", description: "長期的視点で組織の進むべき道を描く力" },
        { title: "危機対応力", description: "不確実な状況下での意思決定と実行力" },
        { title: "ビジョン構築力", description: "組織全体を巻き込む明確なビジョンを描く力" }
      ];
    } else if (score >= 60) {
      return [
        { title: "関係構築力", description: "立場や背景の異なる人ともスムーズに信頼関係を築く力" },
        { title: "現場理解力", description: "抽象的な戦略を、具体的な現場感覚で捉える力" },
        { title: "共創型スタンス", description: "他者とともに形をつくる、柔軟な巻き込み力" }
      ];
    } else if (score >= 40) {
      return [
        { title: "実行力", description: "指示された方針を確実に実行に移す能力" },
        { title: "分析力", description: "物事を論理的に分解して考えることができる" },
        { title: "協調性", description: "チームメンバーとの円滑な協力関係を構築できる" }
      ];
    } else {
      return [
        { title: "専門性", description: "特定の領域での深い知識と経験" },
        { title: "細部への配慮", description: "細かな点にも注意を払う丁寧さ" },
        { title: "着実な姿勢", description: "地に足のついた堅実なアプローチ" }
      ];
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-xl">結果を読み込んでいます...</div>
      </div>
    );
  }

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
              {getScoreMessage(score)}
              <br /><br />
              {managementScoreData && (
                <span className="text-xs text-gray-600">
                  回答した経営質問：{managementScoreData.answeredCount}/10問
                </span>
              )}
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
                <p className="text-sm mb-4">あなたのCxO適正スコアは{score}点で、特に以下の強みが見られます：</p>
                <ul className="space-y-4">
                  {getStrengths(score).map((strength, index) => (
                    <li key={index} className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <img src="/Check.svg" alt="check" className="w-4 h-4" />
                        <span className="font-bold">{strength.title}</span>
                      </div>
                      <div className="text-sm text-gray-600 ml-6">{strength.description}</div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="w-full mb-8 md:mb-12">
            <h3 className="text-lg md:text-xl font-bold mb-4 md:mb-6">あなたのタイプ分類：{typeResult.classificationType}</h3>
            <p className="text-sm text-[#343C4B] mb-4 md:mb-6">
              あなたは、{typeResult.typePattern}タイプの「{typeResult.classificationType}」に分類されます。
              {typeResult.classificationType === '類似型' && '4つの軸において類似した特性を持ち、一貫した方向性で物事を捉えます。'}
              {typeResult.classificationType === '調和型' && '異なる個性や意見を尊重しながら、全体を整えていくバランス感覚を持っています。'}
              {typeResult.classificationType === '真逆型' && '対照的な特性をもつ人や考え方を理解し、多様な視点から物事を捉えます。'}
            </p>
            <TypeClassification classificationType={typeResult.classificationType} />
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
                {typeResult.typeDescription}
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