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

// 経営質問と対応する強みのマッピング
const managementStrengthsMapping: Record<number, { title: string, description: string }> = {
  1: { title: "決断力", description: "組織の将来のために困難な意思決定を厭わない姿勢" },
  4: { title: "柔軟性", description: "市場変化や予期せぬ事態に柔軟に対応し、迅速に行動を起こす能力" },
  8: { title: "リーダーシップ", description: "不確実性の高い状況下でも最終的な意思決定を下す力" },
  16: { title: "自己変革力", description: "常に新しいことを学び、自己を変革し続ける姿勢" },
  19: { title: "状況把握力", description: "混沌とした状況から本質を見抜き、進むべき方向を示す能力" },
  20: { title: "責任感", description: "最終的な責任者として個人的な犠牲も厭わない強い覚悟" },
  26: { title: "危機対応力", description: "危機的状況でも冷静さを保ち、打開策を見出す思考力" },
  29: { title: "粘り強さ", description: "短期的な批判や失敗に屈せず、長期的成功に向けて挑戦し続ける力" }
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
      console.log(`判定されたタイプ分類: ${typeResult.typePattern}, ${typeResult.classificationType}`); // デバッグ用ログ出力
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

  // タイプパターンに応じた活躍できる環境を取得する関数
  const getEnvironmentPoints = (typePattern: string): EnvironmentPoint[] => {
    switch(typePattern) {
      case 'AAAA':
        return [
          { title: "革新的な組織文化", description: "既存の枠組みにとらわれず、新しいアイデアが歓迎される環境" },
          { title: "裁量と自由度の高さ", description: "自分のビジョンを追求し、実験的な取り組みができる環境" },
          { title: "多様な視点との出会い", description: "異なる業界や専門性を持つ人々との交流がある環境" },
          { title: "変化の速い市場", description: "常に新しい課題があり、革新的なソリューションが求められる環境" }
        ];
      case 'AAAB':
        return [
          { title: "創造性を重視する組織", description: "アイデアの価値が認められ、それを形にするプロセスがある環境" },
          { title: "人材育成に投資する企業", description: "メンバーの成長とチームの一体感を大切にする文化がある環境" },
          { title: "ビジョン主導の組織", description: "明確な未来像があり、それに向かって革新を続ける環境" },
          { title: "コラボレーションの場", description: "異なる専門性を持つ人々が協力して新しい価値を生み出す環境" }
        ];
      case 'AABA':
        return [
          { title: "顧客中心の組織", description: "市場や顧客の声を大切にし、それに応える価値創造を重視する環境" },
          { title: "フラットな組織構造", description: "階層に関わらず意見交換ができ、アイデアが尊重される環境" },
          { title: "敏捷性のある組織", description: "状況の変化に素早く対応し、柔軟な意思決定ができる環境" },
          { title: "対話を重視する文化", description: "オープンなコミュニケーションと建設的なフィードバックがある環境" }
        ];
      case 'AABB':
        return [
          { title: "共創型の組織文化", description: "メンバー全員の力を活かし、新しい価値を生み出す環境" },
          { title: "心理的安全性の高いチーム", description: "失敗を恐れず挑戦でき、互いに支え合える環境" },
          { title: "目的志向の組織", description: "社会的意義のある目標に向かって、革新的な取り組みができる環境" },
          { title: "多様性を重視する組織", description: "異なる視点や経験が尊重され、それが創造の源泉となる環境" }
        ];
      case 'BBAA':
        return [
          { title: "戦略重視の組織", description: "データと市場分析に基づく意思決定を重視する環境" },
          { title: "成果志向の文化", description: "明確な目標設定と効率的な実行が評価される環境" },
          { title: "成長産業・市場", description: "拡大フェーズにあり、戦略的な意思決定で成長を加速できる環境" },
          { title: "構造化されたプロセス", description: "効率と効果を最大化するための仕組みがある環境" }
        ];
      case 'BBAB':
        return [
          { title: "長期的視点の組織", description: "短期的な利益だけでなく、持続的な成長を重視する環境" },
          { title: "ビジョンと実行のバランス", description: "明確な方向性と着実な実行計画が調和している環境" },
          { title: "組織文化を大切にする企業", description: "価値観の共有と組織の一体感を重視する環境" },
          { title: "安定と革新のバランス", description: "堅実な基盤の上に、計画的な変革を推進できる環境" }
        ];
      case 'BBBA':
        return [
          { title: "対話と分析のバランス", description: "データ分析と人間的な対話の両方を重視する環境" },
          { title: "人材重視の組織", description: "人材の多様性と専門性を活かした意思決定ができる環境" },
          { title: "顧客との強い関係性", description: "顧客ニーズに深く寄り添い、信頼関係を構築できる環境" },
          { title: "計画的な変化管理", description: "変革を恐れず、しかし慎重にプロセスを進められる環境" }
        ];
      case 'BBBB':
        return [
          { title: "価値観を共有する組織", description: "明確な企業理念と文化が浸透し、長期的な視点で行動できる環境" },
          { title: "チームワークを重視する文化", description: "個人の成果よりも、チーム全体の成功が評価される環境" },
          { title: "人材育成に力を入れる企業", description: "長期的な人材開発と信頼関係構築を重視する環境" },
          { title: "持続可能な成長モデル", description: "急激な変化よりも、着実で持続的な発展を目指す環境" }
        ];
      case 'ABAA':
        return [
          { title: "戦略的イノベーション", description: "分析と創造のバランスがとれた、計画的な革新を推進する環境" },
          { title: "市場主導の組織", description: "顧客や市場の声を重視し、それに応える価値創造ができる環境" },
          { title: "構造化された創造プロセス", description: "アイデア創出から実装までの明確なプロセスがある環境" },
          { title: "データ活用の文化", description: "直感だけでなく、データに基づいた意思決定を重視する環境" }
        ];
      case 'ABAB':
        return [
          { title: "長期ビジョンを持つ組織", description: "5年、10年先を見据えた戦略と組織設計ができる環境" },
          { title: "文化と戦略の一体化", description: "企業文化と事業戦略が密接に連携している環境" },
          { title: "計画的な変革", description: "ビジョン実現に向けた段階的で着実な変革を推進できる環境" },
          { title: "持続可能なイノベーション", description: "短期的な成果と長期的な変革のバランスがとれた環境" }
        ];
      case 'ABBA':
        return [
          { title: "協調的な革新環境", description: "チームの知恵を集め、データに基づいた革新ができる環境" },
          { title: "顧客との共創", description: "顧客との対話から新たな価値を生み出すプロセスがある環境" },
          { title: "計画的なリスクテイク", description: "慎重な分析の上で、適切なリスクを取れる文化がある環境" },
          { title: "多様な専門性の融合", description: "異なる専門知識や経験が尊重され、統合される環境" }
        ];
      case 'ABBB':
        return [
          { title: "人間中心の組織設計", description: "人材の強みを活かした組織構造と文化がある環境" },
          { title: "計画的な組織開発", description: "人と組織のポテンシャルを計画的に引き出す取り組みがある環境" },
          { title: "信頼関係に基づくリーダーシップ", description: "権威ではなく信頼に基づいて影響力を発揮できる環境" },
          { title: "目的と価値観の共有", description: "組織の存在意義と価値観が明確に共有されている環境" }
        ];
      case 'BAAA':
        return [
          { title: "アジャイルな組織", description: "素早い意思決定と実行が可能で、機会を逃さない環境" },
          { title: "成長市場・急拡大フェーズ", description: "迅速な行動と決断が成果につながる成長段階にある環境" },
          { title: "実験を奨励する文化", description: "試行錯誤が評価され、失敗から学ぶ姿勢が尊重される環境" },
          { title: "実践的イノベーション", description: "理論よりも実践を通じて、新しい価値を生み出せる環境" }
        ];
      case 'BAAB':
        return [
          { title: "行動重視の組織文化", description: "計画よりも行動を優先し、結果を出せる人材が評価される環境" },
          { title: "変革期の組織", description: "大きな変化の中で、リーダーシップを発揮できる機会がある環境" },
          { title: "チーム育成の機会", description: "メンバーの成長を促しながら、変革を推進できる環境" },
          { title: "ビジョン実現への情熱", description: "組織全体が共通の目標に向かって情熱的に取り組む環境" }
        ];
      case 'BABA':
        return [
          { title: "現場主義の組織", description: "現場の声と顧客のフィードバックを重視する文化がある環境" },
          { title: "フラットでスピーディな組織", description: "階層にとらわれず、迅速な意思決定と行動ができる環境" },
          { title: "顧客接点の多い業務", description: "市場や顧客との直接的な対話から、改善を推進できる環境" },
          { title: "改善志向の強い文化", description: "常に現状を見直し、より良い方法を模索する姿勢がある環境" }
        ];
      case 'BABB':
        return [
          { title: "人材育成型リーダーシップ", description: "メンバーの成長をサポートしながら成果を出せる環境" },
          { title: "実践的なチームビルディング", description: "日々の業務を通じて、チームの結束を強められる環境" },
          { title: "現場での意思決定権限", description: "現場レベルで適切な判断と行動ができる裁量がある環境" },
          { title: "価値観を共有するコミュニティ", description: "共通の目的と価値観を持ったチームで活躍できる環境" }
        ];
      default:
        return [
          { title: "バランスのとれた組織", description: "多様な視点と手法が尊重され、状況に応じて柔軟に対応できる環境" },
          { title: "調和のとれたチーム", description: "異なる強みを持つメンバーが互いを補完し合える環境" },
          { title: "成長機会の豊富さ", description: "様々な経験を通じて、多面的なスキル開発ができる環境" },
          { title: "適応力を重視する文化", description: "変化を受け入れ、状況に応じて最適な対応ができる環境" }
        ];
    }
  };

  // タイプパターンに応じた「あなたを一言で表すと...」の説明文を取得する関数
  const getTypeDescription = (typePattern: string): string => {
    switch(typePattern) {
      case 'AAAA':
        return "常に新しいアイデアを追求し、それを情熱的に実現に導くあなたは、組織に変革の風を吹き込む存在です。あなたのビジョンと行動力が、新たな地平を切り開くきっかけとなるでしょう。";
      case 'AAAB':
        return "革新性と調和を両立させるあなたは、新しい価値を創造しながらも、人と組織の成長を大切にします。あなたの存在が、創造的でありながら一体感のある組織文化を育みます。";
      case 'AABA':
        return "市場の声に敏感に反応し、チームと共に新しい価値を生み出すあなたは、変化する環境の中で組織を導く力を持っています。あなたの柔軟性と共感力が、イノベーションの源となります。";
      case 'AABB':
        return "チームの力を活かして新しい価値を創造するあなたは、人と組織の可能性を最大限に引き出します。あなたがいることで、調和のとれた革新的な環境が生まれるでしょう。";
      case 'BBAA':
        return "分析力と戦略的思考を持ち、市場を見据えた決断を下すあなたは、組織の成長を確実に導く存在です。あなたの冷静な判断力と実行力が、ビジネスの拡大と成功をもたらします。";
      case 'BBAB':
        return "ビジョンと計画を組み合わせ、組織の未来を設計するあなたは、持続的な成長の基盤を築く存在です。あなたの長期的視点と組織への理解が、安定と発展の両立を可能にします。";
      case 'BBBA':
        return "分析的思考とコミュニケーション能力を兼ね備え、市場の変化に対応するあなたは、組織の羅針盤となる存在です。あなたの計画性と柔軟性が、環境変化の中での安定した進化を支えます。";
      case 'BBBB':
        return "組織の文化と安定を重視し、人材の力を育むあなたは、持続可能な成長の礎を築く存在です。あなたの着実なアプローチと人間関係構築力が、長期的な成功と一体感を生み出します。";
      case 'ABAA':
        return "創造性と論理的思考を持ち、市場機会を的確に捉えるあなたは、イノベーションに戦略をもたらす存在です。あなたの分析力と創造力が、組織に新たな事業機会をもたらします。";
      case 'ABAB':
        return "ビジョンと計画性を併せ持ち、組織の未来図を描くあなたは、長期的視点での変革を導く存在です。あなたの思考の深さと包括的な視点が、組織の持続的な進化を実現します。";
      case 'ABBA':
        return "計画性とチーム志向を持ち、市場を見据えた革新を追求するあなたは、組織の知恵を結集する存在です。あなたの慎重さと挑戦心が、持続可能なイノベーションを生み出します。";
      case 'ABBB':
        return "分析力と人間関係構築能力を持ち、組織の潜在力を引き出すあなたは、人と組織を育てる建築家です。あなたの計画的アプローチと人間理解が、強固な組織基盤を築きます。";
      case 'BAAA':
        return "行動力と革新性を持ち、市場機会に素早く対応するあなたは、組織に活力とスピード感をもたらす存在です。あなたの即断即決と創造性が、ビジネスの急成長を実現します。";
      case 'BAAB':
        return "実行力と情熱を持ち、組織変革を推進するあなたは、ビジョンを現実に変える原動力です。あなたの行動力とチーム育成への関心が、組織の変革と成長を加速させます。";
      case 'BABA':
        return "現場感覚と市場志向を持ち、迅速な改善を進めるあなたは、組織と市場をつなぐ懸け橋です。あなたの実践的アプローチと対話力が、顧客価値の向上と組織の進化を導きます。";
      case 'BABB':
        return "行動力と人材重視の姿勢を持ち、チームの力で成果を出すあなたは、組織の現場力を高める存在です。あなたの実践的リーダーシップと人間理解が、強いチームと文化を育みます。";
      default:
        return "経営の視座を持ちながら、現場の空気や感情にも鋭敏なあなたは、チームの温度を読み、風通しのいい空間をつくる存在。そんなあなたがいることで、組織に\"流れ\"が生まれ、変化が動き出します。";
    }
  };

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

  // スコアと質問の回答に基づいた強みを取得する関数
  const getStrengths = (score: number, answers: Record<number, number> = {}) => {
    // 経営質問のIDリスト
    const managementQuestionIds = [1, 4, 8, 16, 19, 20, 26, 29];
    
    // 回答された経営質問のスコアを取得（5段階評価を維持）
    const questionScores = managementQuestionIds
      .filter(id => answers[id] !== undefined)
      .map(id => ({ id, score: answers[id] }))
      .sort((a, b) => b.score - a.score); // スコアが高い順にソート
    
    // スコアに基づいた基本的な強みセット
    let baseStrengths: { title: string, description: string }[] = [];
    
    if (score >= 80) {
      baseStrengths = [
        { title: "優れた戦略的思考", description: "長期的視点で組織の進むべき道を描く力" },
        { title: "ビジョン構築力", description: "組織全体を巻き込む明確なビジョンを描く力" }
      ];
    } else if (score >= 60) {
      baseStrengths = [
        { title: "関係構築力", description: "立場や背景の異なる人ともスムーズに信頼関係を築く力" },
        { title: "現場理解力", description: "抽象的な戦略を、具体的な現場感覚で捉える力" }
      ];
    } else if (score >= 40) {
      baseStrengths = [
        { title: "実行力", description: "指示された方針を確実に実行に移す能力" },
        { title: "分析力", description: "物事を論理的に分解して考えることができる" }
      ];
    } else {
      baseStrengths = [
        { title: "専門性", description: "特定の領域での深い知識と経験" },
        { title: "着実な姿勢", description: "地に足のついた堅実なアプローチ" }
      ];
    }
    
    // 回答から強みを追加
    let strengthsFromAnswers: { title: string, description: string }[] = [];
    
    // 回答がある場合、上位3つの質問から強みを抽出
    if (questionScores.length > 0) {
      // スコアが4以上（「そう思う」以上）の質問から強みを抽出
      strengthsFromAnswers = questionScores
        .filter(item => item.score >= 4)
        .slice(0, 3) // 上位3つまで
        .map(item => managementStrengthsMapping[item.id]);
    }
    
    // 必要な強みの数を取得（足りない場合はbaseStrengthsから補完）
    const requiredCount = 3;
    let result: { title: string, description: string }[] = [...strengthsFromAnswers];
    
    // 3つに満たない場合、baseStrengthsから足りない分を追加
    if (result.length < requiredCount) {
      // すでに含まれていないbaseStrengthsを追加
      const titlesToExclude = result.map(s => s.title);
      const additionalStrengths = baseStrengths
        .filter(s => !titlesToExclude.includes(s.title))
        .slice(0, requiredCount - result.length);
      
      result = [...result, ...additionalStrengths];
    }
    
    return result.slice(0, requiredCount);
  };

  // タイプ分類に応じた背景色と画像を取得する関数
  const getTopSectionStyles = (classificationType: '類似型' | '調和型' | '真逆型') => {
    console.log(`現在のタイプ分類: ${classificationType}`); // デバッグ用ログ出力
    switch(classificationType) {
      case '類似型':
        return { bgColor: 'bg-[#F6F4E0]', image: '/ruiji_top.png' };
      case '真逆型':
        return { bgColor: 'bg-[#FBE8E8]', image: '/magyaku_top.png' };
      case '調和型':
      default:
        return { bgColor: 'bg-[#ebf6f1]', image: '/chowa_top.png' };
    }
  };

  // タイプ分類に応じた診断結果サマリーを取得する関数
  const getResultSummary = (typePattern: string) => {
    switch(typePattern) {
      case 'AAAA':
        return "あなたは、創造力と直感力を備えた「イノベーター型リーダー」です。新しいアイデアを生み出し、それを情熱的に追求します。ビジョンを明確に示し、市場の新たな可能性を見出すことに長けています。常に一歩先を行く姿勢で、周囲に刺激と変革をもたらします。";
      case 'AAAB':
        return "あなたは、「ビジョナリー・ビルダー」タイプのリーダーです。革新的なアイデアとチーム文化の両方を大切にします。新しい価値を創造しながらも、組織の調和と一体感を重視する姿勢があります。未来志向の思考と人間関係の構築のバランスが取れています。";
      case 'AABA':
        return "あなたは、「フレキシブル・イノベーター」タイプです。創造性豊かな発想と、メンバーの意見を尊重する姿勢を併せ持っています。市場ニーズを敏感に察知し、チームと共に迅速に対応する能力に優れています。共感力と革新性を兼ね備えたリーダーシップを発揮します。";
      case 'AABB':
        return "あなたは、「共創型イノベーター」タイプです。新しい価値の創造とチーム力の両方を重視します。メンバーを尊重し、その力を結集して革新的なプロジェクトを成功に導く能力があります。調和のとれたチーム環境の中で、着実に新しいものを生み出していきます。";
      case 'BBAA':
        return "あなたは、「戦略的実行者」タイプです。緻密な計画と市場感覚を武器に、効率的なビジネス成長を実現します。現実的な視点とビジョン提示力を兼ね備え、組織を確実に目標へと導きます。冷静な判断と市場への洞察が強みです。";
      case 'BBAB':
        return "あなたは、「組織アーキテクト」タイプです。計画性と論理的思考を軸に、ビジョンとチーム文化を調和させる力があります。地に足のついた現実主義とビジョン提示力で、組織を安定的に成長させる能力に優れています。堅実さと未来志向のバランスが取れています。";
      case 'BBBA':
        return "あなたは、「共感型ストラテジスト」タイプです。分析力と人間関係構築の両方に長けています。データと論理に基づいた計画を立てながらも、メンバーとの対話を重視し、市場の変化に柔軟に対応します。信頼される指導者として組織をナビゲートします。";
      case 'BBBB':
        return "あなたは、「文化的基盤構築者」タイプです。安定と持続性を重視し、堅実な組織づくりに貢献します。チームの調和と組織文化を大切にしながら、地道な積み重ねで成果を出していく姿勢があります。信頼関係と計画性を基盤に、着実に前進します。";
      case 'ABAA':
        return "あなたは、「戦略的イノベーター」タイプです。計画的思考と創造性を兼ね備え、市場機会を的確に捉えます。新しい価値を論理的に構築し、ビジョンを市場に実装する能力に優れています。分析と創造のバランスが取れたリーダーシップを発揮します。";
      case 'ABAB':
        return "あなたは、「未来志向の設計者」タイプです。ビジョンと計画力を武器に、組織の文化と未来を設計します。論理的思考で道筋を立てながら、組織全体のビジョンを明確に示す力があります。長期的視点と文化的価値観のバランスが取れています。";
      case 'ABBA':
        return "あなたは、「対話型チャレンジャー」タイプです。計画性とメンバー尊重の姿勢を持ち、市場を見据えた革新を推進します。チームの知恵を集め、データに基づいた判断で、新たな挑戦に導く能力があります。慎重さと挑戦心のバランスが取れています。";
      case 'ABBB':
        return "あなたは、「共創型アーキテクト」タイプです。分析力と人間関係構築に優れ、組織文化を大切にします。メンバーの力を活かしながら、計画的に組織を発展させる能力があります。人と組織のポテンシャルを最大化するリーダーシップを発揮します。";
      case 'BAAA':
        return "あなたは、「実践的グロースハッカー」タイプです。行動力と市場感覚に優れ、機会を素早く捉えて事業を拡大します。現場主義と革新性を兼ね備え、新しいチャンスに即座に対応する能力があります。スピード感と創造性のバランスが取れたリーダーシップを発揮します。";
      case 'BAAB':
        return "あなたは、「行動派リーダー」タイプです。即断即決の行動力とビジョン実現への情熱があります。組織の文化を尊重しながらも、迅速に変革を進める推進力を持っています。実行力とチーム育成のバランスが取れたリーダーシップを発揮します。";
      case 'BABA':
        return "あなたは、「現場主義の改革者」タイプです。行動力とメンバーとの対話を重視し、市場の声に敏感に反応します。現場の知恵を集め、迅速な改善を進める能力に優れています。スピード感と共感力を兼ね備えたリーダーシップが特徴です。";
      case 'BABB':
        return "あなたは、「伴走型リーダー」タイプです。行動力とチーム尊重の姿勢を持ち、組織の成長をサポートします。メンバーの力を引き出しながら、確実に組織を発展させる能力があります。実践的な行動とチーム文化の両方を大切にするバランス感覚が強みです。";
      default:
        return "あなたは、バランス感覚に優れたリーダーです。多面的な視点を持ち、状況に応じて柔軟に対応できる適応力があります。組織の成長と人の成長の両方を大切にする、調和のとれたリーダーシップを発揮します。";
    }
  };

  // タイプ分類に応じたキャリアパスの説明を取得する関数
  const getCareerPathDescription = (typePattern: string) => {
    switch(typePattern) {
      case 'AAAA':
        return "あなたのキャリアパスは、革新的なビジネスモデルや製品を生み出す場面で最も輝きます。スタートアップの創業者やイノベーション部門のリーダー、新規事業開発などの役割が適しています。常に新しいアイデアを追求し、前例のない挑戦を楽しめる環境で力を発揮するでしょう。";
      case 'AAAB':
        return "あなたのキャリアパスは、革新と人材育成の両方を担う役割で最大限に活かされます。クリエイティブ部門のリーダーやプロダクトマネージャー、組織変革のコンサルタントなど、人の成長と新しい価値創出の両方に携われる仕事に向いています。";
      case 'AABA':
        return "あなたのキャリアパスは、顧客や市場と直接関わりながら新しい価値を創造する分野で活きるでしょう。マーケティングディレクターや顧客体験責任者、市場開発マネージャーなど、市場と対話しながら革新を生み出す役割に適性があります。";
      case 'AABB':
        return "あなたのキャリアパスは、チームの力を活かして新しい価値を生み出す領域で開花します。プロジェクトマネージャーやイノベーションファシリテーター、クリエイティブディレクターなど、共創の場でリーダーシップを発揮できる役割が向いています。";
      case 'BBAA':
        return "あなたのキャリアパスは、事業戦略と市場分析を組み合わせた役割で輝きます。事業開発マネージャーやビジネスストラテジスト、マーケットアナリストなど、データと市場感覚を両立させた判断が求められる分野に適性があります。";
      case 'BBAB':
        return "あなたのキャリアパスは、組織の仕組みづくりとビジョン実現の両面で活きるでしょう。COOや組織開発マネージャー、システム設計者など、長期的視点で組織を構築する役割に向いています。";
      case 'BBBA':
        return "あなたのキャリアパスは、データと人間関係の両方を扱う領域で最適です。人事戦略担当や組織コンサルタント、チェンジマネージャーなど、分析的思考と対人スキルの両方が求められる仕事に適性があります。";
      case 'BBBB':
        return "あなたのキャリアパスは、組織の安定と文化構築に関わる分野で確立されるでしょう。人事部門や企業文化担当、チームビルディングスペシャリストなど、人と組織の持続的成長をサポートする役割に向いています。";
      case 'ABAA':
        return "あなたのキャリアパスは、戦略立案と新規事業の両方に関わる役割で活きます。戦略的事業開発や新規事業責任者、マーケット分析と事業創造を組み合わせた役割など、計画性と創造性の両方が求められる分野に適性があります。";
      case 'ABAB':
        return "あなたのキャリアパスは、長期的なビジョンと組織設計を結びつける領域で成功するでしょう。経営企画やビジョナリープランナー、組織アーキテクトなど、未来設計と現実的な実装のバランスが求められる役割に向いています。";
      case 'ABBA':
        return "あなたのキャリアパスは、チームと市場の両方を理解した上での革新的プロジェクトで輝きます。商品開発マネージャーやサービス改革担当、顧客中心型プロジェクトリーダーなど、多様な視点を統合する役割に適性があります。";
      case 'ABBB':
        return "あなたのキャリアパスは、人材育成と組織変革の分野で最大限に活かされます。人材開発責任者や組織文化コンサルタント、チーム育成スペシャリストなど、分析的視点で人の成長をサポートする役割に向いています。";
      case 'BAAA':
        return "あなたのキャリアパスは、スピード感のある市場開拓や事業拡大の局面で最も輝きます。営業ディレクターやビジネスデベロップメント責任者、拡大フェーズのスタートアップ幹部など、行動力と市場感覚を組み合わせた役割に適性があります。";
      case 'BAAB':
        return "あなたのキャリアパスは、変革と組織開発を両立させる領域で成功するでしょう。組織変革リーダーや事業再生マネージャー、企業文化変革担当など、スピード感ある実行と人材育成の両方が求められる役割に向いています。";
      case 'BABA':
        return "あなたのキャリアパスは、現場と顧客の声を活かした改善・改革の分野で活きます。カスタマーサクセスリーダーや現場改革担当、顧客体験向上プロジェクトなど、現場主義と市場志向を組み合わせた役割に適性があります。";
      case 'BABB':
        return "あなたのキャリアパスは、チームの成長と業績向上を両立させる領域で開花します。チームリーダーやチェンジエージェント、組織開発ファシリテーターなど、人の成長と実績を同時に追求できる役割に向いています。";
      default:
        return "あなたのキャリアパスは、バランス感覚と適応力を活かせる多様な選択肢があります。さまざまな視点を統合し、組織の調和を保ちながら成長を促進する役割に適性があるでしょう。自己の強みを活かしながら、柔軟に選択していくことが成功への鍵となります。";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-xl">結果を読み込んでいます...</div>
      </div>
    );
  }

  // タイプ分類に応じたスタイルを取得
  const topSectionStyles = getTopSectionStyles(typeResult.classificationType);
  console.log('適用するスタイル:', topSectionStyles); // デバッグ用ログ出力

  return (
    <div className="min-h-screen bg-white">
      <div className={`${topSectionStyles.bgColor} w-full`}>
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
            </div>
          </div>
          <img 
            src={topSectionStyles.image}
            alt={`${typeResult.classificationType}イラスト`}
            className="w-[280px] md:w-[320px] h-auto md:h-[213px] flex-shrink-0" 
            onError={(e) => {
              console.error(`画像の読み込みエラー: ${topSectionStyles.image}`);
              e.currentTarget.src = '/chowa_top.png'; // フォールバック画像
            }}
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
            {getResultSummary(typeResult.typePattern)}
          </div>

          <div className="w-full mb-8 md:mb-12">
            <h3 className="text-lg md:text-xl font-bold mb-4 md:mb-6">CxO適正スコア</h3>
            <div className="flex flex-col md:flex-row gap-8 md:gap-12">
              <CircularProgress value={score} />
              <div className="flex-1">
                <p className="text-sm mb-4">あなたのCxO適正スコアは{score}点で、特に以下の強みが見られます：</p>
                <ul className="space-y-4">
                  {getStrengths(score, answers).map((strength, index) => (
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
                {getTypeDescription(typeResult.typePattern)}
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
                  {getCareerPathDescription(typeResult.typePattern)}
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
            <h3 className="text-lg md:text-xl font-bold mb-4 md:mb-6">あなたの活躍できる環境</h3>
            <EnvironmentPoints points={getEnvironmentPoints(typeResult.typePattern)} />
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