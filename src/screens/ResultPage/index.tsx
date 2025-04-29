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
import { loadResultTexts, loadStrengthTexts, ResultText } from "../../utils/resultTextsLoader";

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
  29: { title: "粘り強さ", description: "短期的な批判や失敗に屈せず、長期的成功に向けて挑戦し続ける力" },
  30: { title: "ビジョン共有力", description: "組織が進むべき魅力的なビジョンを描き、メンバーと共有する力" },
  31: { title: "挑戦精神", description: "不確実性が高い状況でも新しいことに積極的に挑戦する姿勢" }
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
  const [resultTextsMap, setResultTextsMap] = useState<Record<string, ResultText>>({});
  const [strengthTextsMap, setStrengthTextsMap] = useState<Record<number, { title: string; description: string }>>({});

  useEffect(() => {
    // localStorage から診断結果データを取得
    const storedManagementScoreData = localStorage.getItem('managementScoreData');
    const storedPersonalityScoreData = localStorage.getItem('personalityScoreData');
    const storedAnswers = localStorage.getItem('diagnosticAnswers');

    if (storedManagementScoreData) {
      const parsedData = JSON.parse(storedManagementScoreData) as ManagementScoreData;
      setManagementScoreData(parsedData);
      
      // スコア計算（0-4点スケールを60-100点に変換）
      // 経営質問は10問で、各質問は0-4点
      // 0点（最低）の場合は60点、40点（最高）の場合は100点に線形変換
      const maxPossibleScore = parsedData.answeredCount * 4; // 各質問は4点満点
      let calculatedScore = 0;
      if (maxPossibleScore > 0) {
        calculatedScore = Math.round(60 + (parsedData.totalScore / maxPossibleScore) * 40);
      } else {
        // 回答がない場合は最低スコア（60点）を設定
        calculatedScore = 60;
      }
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

  useEffect(() => {
    // CSVデータの読み込み
    (async () => {
      const [resultMap, strengthMap] = await Promise.all([
        loadResultTexts(),
        loadStrengthTexts(),
      ]);
      setResultTextsMap(resultMap);
      setStrengthTextsMap(strengthMap);
    })();
  }, []);

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
    // CSVから取得したデータを使用
    const resultText = resultTextsMap[typePattern];
    if (resultText?.environment && resultText.environment.length > 0) {
      return resultText.environment;
    }
    
    // フォールバック
    switch(typePattern) {
      case 'AAAA':
        return [
          { title: "革新的な組織文化", description: "既存の枠組みにとらわれず、新しいアイデアが歓迎される環境" },
          { title: "裁量と自由度の高さ", description: "自分のビジョンを追求し、実験的な取り組みができる環境" },
          { title: "多様な視点との出会い", description: "異なる業界や専門性を持つ人々との交流がある環境" },
          { title: "変化の速い市場", description: "常に新しい課題があり、革新的なソリューションが求められる環境" }
        ];
      // ... 既存の条件分岐（フォールバック用）
      default:
        return [
          { title: "バランスのとれた組織", description: "多様な視点と手法が尊重され、状況に応じて柔軟に対応できる環境" },
          { title: "調和のとれたチーム", description: "異なる強みを持つメンバーが互いを補完し合える環境" },
          { title: "成長機会の豊富さ", description: "様々な経験を通じて、多面的なスキル開発ができる環境" },
          { title: "適応力を重視する文化", description: "変化を受け入れ、状況に応じて最適な対応ができる環境" }
        ];
    }
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
    // CSVから取得したデータを使用
    const resultText = resultTextsMap[typePattern];
    if (resultText?.resultSummary) {
      return resultText.resultSummary;
    }
    
    // フォールバック（CSVからデータが取得できない場合）
    switch(typePattern) {
      case 'AAAA':
        return "あなたは、創造力と直感力を備えた「イノベーター型リーダー」です。新しいアイデアを生み出し、それを情熱的に追求します。ビジョンを明確に示し、市場の新たな可能性を見出すことに長けています。常に一歩先を行く姿勢で、周囲に刺激と変革をもたらします。";
      // ... 既存の条件分岐（フォールバック用）
      default:
        return "あなたは、バランス感覚に優れたリーダーです。多面的な視点を持ち、状況に応じて柔軟に対応できる適応力があります。組織の成長と人の成長の両方を大切にする、調和のとれたリーダーシップを発揮します。";
    }
  };

  // タイプパターンに応じた「あなたを一言で表すと...」の説明文を取得する関数
  const getTypeDescription = (typePattern: string): string => {
    // CSVから取得したデータを使用
    const resultText = resultTextsMap[typePattern];
    if (resultText?.oneWord) {
      return resultText.oneWord;
    }
    
    // フォールバック
    switch(typePattern) {
      case 'AAAA':
        return "常に新しいアイデアを追求し、それを情熱的に実現に導くあなたは、組織に変革の風を吹き込む存在です。あなたのビジョンと行動力が、新たな地平を切り開くきっかけとなるでしょう。";
      // ... 既存の条件分岐（フォールバック用）
      default:
        return "経営の視座を持ちながら、現場の空気や感情にも鋭敏なあなたは、チームの温度を読み、風通しのいい空間をつくる存在。そんなあなたがいることで、組織に\"流れ\"が生まれ、変化が動き出します。";
    }
  };

  // タイプ分類に応じたキャリアパスの説明を取得する関数
  const getCareerPathDescription = (typePattern: string) => {
    // CSVから取得したデータを使用
    const resultText = resultTextsMap[typePattern];
    if (resultText?.careerPathSummary) {
      return resultText.careerPathSummary;
    }
    
    // フォールバック
    switch(typePattern) {
      case 'AAAA':
        return "あなたのキャリアパスは、革新的なビジネスモデルや製品を生み出す場面で最も輝きます。スタートアップの創業者やイノベーション部門のリーダー、新規事業開発などの役割が適しています。常に新しいアイデアを追求し、前例のない挑戦を楽しめる環境で力を発揮するでしょう。";
      // ... 既存の条件分岐（フォールバック用）
      default:
        return "あなたのキャリアパスは、バランス感覚と適応力を活かせる多様な選択肢があります。さまざまな視点を統合し、組織の調和を保ちながら成長を促進する役割に適性があるでしょう。自己の強みを活かしながら、柔軟に選択していくことが成功への鍵となります。";
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
    const managementQuestionIds = [1, 4, 8, 16, 19, 20, 26, 29, 30, 31];
    
    // 回答された経営質問のスコアを取得（5段階評価を維持）
    const questionScores = managementQuestionIds
      .filter(id => answers[id] !== undefined)
      .map(id => ({ id, score: answers[id] }))
      .sort((a, b) => b.score - a.score); // スコアが高い順にソート
    
    // スコアに基づいた基本的な強みセット
    let baseStrengths: { title: string, description: string }[] = [];
    
    // CSVから読み込んだ強みデータを使用
    if (score >= 80) {
      baseStrengths = [
        strengthTextsMap[100] || { title: "優れた戦略的思考", description: "長期的視点で組織の進むべき道を描く力" },
        strengthTextsMap[101] || { title: "ビジョン構築力", description: "組織全体を巻き込む明確なビジョンを描く力" }
      ];
    } else if (score >= 60) {
      baseStrengths = [
        strengthTextsMap[102] || { title: "関係構築力", description: "立場や背景の異なる人ともスムーズに信頼関係を築く力" },
        strengthTextsMap[103] || { title: "現場理解力", description: "抽象的な戦略を、具体的な現場感覚で捉える力" }
      ];
    } else if (score >= 40) {
      baseStrengths = [
        strengthTextsMap[104] || { title: "実行力", description: "指示された方針を確実に実行に移す能力" },
        strengthTextsMap[105] || { title: "分析力", description: "物事を論理的に分解して考えることができる" }
      ];
    } else {
      baseStrengths = [
        strengthTextsMap[106] || { title: "専門性", description: "特定の領域での深い知識と経験" },
        strengthTextsMap[107] || { title: "着実な姿勢", description: "地に足のついた堅実なアプローチ" }
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
        .map(item => {
          // CSVから読み込んだ強みデータを使用
          return strengthTextsMap[item.id] || managementStrengthsMapping[item.id];
        });
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
          <h2 className="text-xl md:text-2xl font-bold mb-6 md:mb-8">
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
            <p className="text-sm text-[#343C4B] mb-4 md:mb-6 whitespace-pre-line">
              {resultTextsMap[typeResult.typePattern]?.classificationSummary}
            </p>
            <TypeClassification 
              classificationType={typeResult.classificationType} 
              classificationSummary={resultTextsMap[typeResult.typePattern]?.classificationSummary}
            />
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
                {resultTextsMap[typeResult.typePattern]?.oneWordSummary || typeResult.typeDescription}
              </h4>
              <p className="text-sm text-[#343C4B] leading-relaxed whitespace-pre-line">
                {getTypeDescription(typeResult.typePattern)}
              </p>
            </div>
            <div className="mt-6">
              <h3 className="text-lg md:text-xl font-bold mb-4 md:mb-6">あなたの強み</h3>
              <EnvironmentPoints points={getEnvironmentPoints(typeResult.typePattern)} />
            </div>
          </div>

          <div className="w-full mb-8 md:mb-12">
            <h3 className="text-lg md:text-xl font-bold mb-6 md:mb-8">
              キャリアアドバイス
            </h3>
            <div className="flex flex-col md:flex-row items-start gap-6 md:gap-12">
              <div className="flex-1">
                <p className="text-sm text-[#343C4B] leading-relaxed whitespace-pre-line">
                  {getCareerPathDescription(typeResult.typePattern)}
                </p>
              </div>
              <div className="w-full md:w-[320px] flex-shrink-0 border border-gray-300 rounded-lg p-4 bg-gray-50">
                <img 
                  src="/careerup.png" 
                  alt="キャリアアップイメージ" 
                  className="w-full h-auto"
                />
              </div>
            </div>
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