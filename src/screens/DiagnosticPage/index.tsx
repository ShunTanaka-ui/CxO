import React, { useState, useRef, useEffect } from "react";
import { Progress } from "../../components/ui/progress";
import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group";
import { Button } from "../../components/ui/button";
import { ArrowRight } from "lucide-react";
import { FooterSection } from "../../components/FooterSection";
import { useNavigate } from "react-router-dom";
import { DebugMenu } from "../../components/DebugMenu";

interface Question {
  id: number;
  text: string;
  isManagementQuestion?: boolean; // 経営質問かどうかのフラグ
  personalityAxis?: 1 | 2 | 3 | 4; // パーソナリティ軸: 1-4
  personalityType?: 'A' | 'B';     // パーソナリティタイプ: A or B
}

interface PersonalityScoreData {
  axis1: { scoreA: number, scoreB: number, dominantType: 'A' | 'B', percentage: number };
  axis2: { scoreA: number, scoreB: number, dominantType: 'A' | 'B', percentage: number };
  axis3: { scoreA: number, scoreB: number, dominantType: 'A' | 'B', percentage: number };
  axis4: { scoreA: number, scoreB: number, dominantType: 'A' | 'B', percentage: number };
}

export const DiagnosticPage = (): JSX.Element => {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [currentFocus, setCurrentFocus] = useState<number | null>(null);
  const questionRefs = useRef<Record<number, HTMLDivElement | null>>({});

  const questions: Question[] = [
    {
      id: 1,
      text: "事業のピボット（方向転換）や不採算部門の整理など、組織の将来のために必要ならば、困難な意思決定も厭わない。",
      isManagementQuestion: true
    },
    {
      id: 2,
      text: "理屈やデータも大事だが、最終的には自分の直感や「これだ！」という感覚を信じて判断することが多い。",
      personalityAxis: 2,
      personalityType: 'A'
    },
    {
      id: 3,
      text: "既存の常識やルールにとらわれず、根本から違うやり方や発想を試してみたいと思うことが多い。",
      personalityAxis: 1,
      personalityType: 'A'
    },
    {
      id: 4,
      text: "急な市場の変化や予期せぬ事態に応じて、計画を大胆に変更し、迅速に行動を起こすことに抵抗がない。",
      isManagementQuestion: true
    },
    {
      id: 5,
      text: "チーム内に意見の対立が起きた際は、一方的に結論を出すのではなく、それぞれの立場や考えを理解し合う場を設けたい。",
      personalityAxis: 3,
      personalityType: 'B'
    },
    {
      id: 6,
      text: "メンバーを信頼し、仕事の進め方や判断をできるだけ任せることで、自主性や成長を促したい。",
      personalityAxis: 3,
      personalityType: 'B'
    },
    {
      id: 7,
      text: "チームで重要な意思決定をする際には、メンバー全員が納得できるよう、丁寧に意見を聞き、対話を重ねることを重視する。",
      personalityAxis: 3,
      personalityType: 'B'
    },
    {
      id: 8,
      text: "正解が誰にも分からず情報も不十分な状況下でも、強いプレッシャーの中でリーダーとして最終的な意思決定を下すことができる。",
      isManagementQuestion: true
    },
    {
      id: 9,
      text: "目標を達成するためには、具体的なステップに落とし込んだ計画を立て、それに沿って進捗を管理することが効果的だと思う。",
      personalityAxis: 2,
      personalityType: 'B'
    },
    {
      id: 10,
      text: "仕事においては、場当たり的な対応よりも、再現性のある仕組みや標準化されたプロセスを重視する。",
      personalityAxis: 1,
      personalityType: 'B'
    },
    {
      id: 11,
      text: "最終的な方針決定は、様々な意見を参考にしつつも、リーダーが責任を持って決めるべきだと考える。",
      personalityAxis: 3,
      personalityType: 'A'
    },
    {
      id: 12,
      text: "議論が停滞したり方向性が定まらなかったりする時は、自分が率先して意見を述べ、場をリードする役割を担うことが多い。",
      personalityAxis: 3,
      personalityType: 'A'
    },
    {
      id: 13,
      text: "事業をやるなら、業界のゲームチェンジを起こすような、大きな変化やインパクトを狙いたい。",
      personalityAxis: 1,
      personalityType: 'A'
    },
    {
      id: 14,
      text: "顧客が本当に求めていることは何かを探求し、プロダクトやサービスを通じてその期待に応えることに強い関心がある。",
      personalityAxis: 4,
      personalityType: 'A'
    },
    {
      id: 15,
      text: "行動に移る前に、潜在的なリスクを洗い出し、可能な限り事前に対応策を準備しておきたい。",
      personalityAxis: 2,
      personalityType: 'B'
    },
    {
      id: 16,
      text: "自身の役割や必要なスキルが変化し続けても、常に新しいことを学び、自己変革していくことに強い意欲を持っている。",
      isManagementQuestion: true
    },
    {
      id: 17,
      text: "情報が不十分で先行き不透明な状況でも、大胆に決断し、行動を起こすことを厭わない。",
      personalityAxis: 2,
      personalityType: 'A'
    },
    {
      id: 18,
      text: "世の中にまだない、全く新しい価値やサービスをゼロから生み出すことにワクワクする。",
      personalityAxis: 1,
      personalityType: 'A'
    },
    {
      id: 19,
      text: "混沌とした状況や多くの情報の中から、問題や事業機会の核心を素早く見抜き、進むべき方向を示すことができる。",
      isManagementQuestion: true
    },
    {
      id: 20,
      text: "会社の危機において、事業と従業員を守るためならば、最終的な責任者として個人的な犠牲を払う覚悟がある。",
      isManagementQuestion: true
    },
    {
      id: 21,
      text: "急成長も魅力的だが、事業の持続可能性や安定した収益基盤を築くことも同じくらい大切だと考える。",
      personalityAxis: 1,
      personalityType: 'B'
    },
    {
      id: 22,
      text: "チームを率いる上では、明確なビジョンや目標を掲げ、メンバーを力強く導いていくことが重要だ。",
      personalityAxis: 3,
      personalityType: 'A'
    },
    {
      id: 23,
      text: "事業の成功のためには、まず市場で勝ち抜くことが最重要であり、社内体制はその後に整備するものだと考える傾向がある。",
      personalityAxis: 4,
      personalityType: 'A'
    },
    {
      id: 24,
      text: "世の中のトレンドや競合の動向を常に把握し、自社の事業戦略にどう活かせるかを考えるのが好きだ。",
      personalityAxis: 4,
      personalityType: 'A'
    },
    {
      id: 25,
      text: "チームメンバーの育成やキャリア開発を支援し、個々の能力が最大限に発揮される組織づくりに関心がある。",
      personalityAxis: 4,
      personalityType: 'B'
    },
    {
      id: 26,
      text: "予期せぬトラブルや資金難といった危機的な状況に直面しても、冷静さを保ち、打開策を見つけるために粘り強く思考できる。",
      isManagementQuestion: true
    },
    {
      id: 27,
      text: "「良いかもしれない」と感じたら、完璧な計画を待つより、まず小さく試してみて手応えを見たい。",
      personalityAxis: 2,
      personalityType: 'A'
    },
    {
      id: 28,
      text: "新しい取り組みを始める前は、関連情報を広く集め、メリット・デメリットを比較検討する時間を十分に取りたい。",
      personalityAxis: 2,
      personalityType: 'B'
    },
    {
      id: 29,
      text: "自らの判断が短期的に批判されたり、失敗と見なされたりしても、長期的な成功を信じて粘り強く挑戦し続けることができる。",
      isManagementQuestion: true
    },
    {
      id: 30,
      text: "組織が進むべき魅力的なビジョンを描き、それをメンバーと共有し、実現に向けて情熱を注ぎたいと思う。",
      isManagementQuestion: true
    },
    {
      id: 31,
      text: "まだ市場に受け入れられるか分からない新しいアイデアや、達成困難に見える高い目標にも、積極的に挑戦したいと思う。",
      isManagementQuestion: true
    },
    {
      id: 32,
      text: "既にあるものをより良く改善したり、効率化したりするプロセスに、地道だが確かなやりがいを感じる。",
      personalityAxis: 1,
      personalityType: 'B'
    },
    {
      id: 33,
      text: "メンバーがいきいきと働き、互いに協力し合えるような、良い組織文化や職場環境を創り出すことに力を注ぎたい。",
      personalityAxis: 4,
      personalityType: 'B'
    },
    {
      id: 34,
      text: "事業の成功のためには、優秀な人材が定着し、チームとして機能する組織基盤を長期的な視点で築くことが不可欠だと考える。",
      personalityAxis: 4,
      personalityType: 'B'
    },
  ];

  const totalQuestions = questions.length;
  const answeredQuestions = Object.keys(answers).length;
  const progress = (answeredQuestions / totalQuestions) * 100;

  // 経営質問のスコアを計算する関数
  const calculateManagementScore = () => {
    const managementQuestions = questions.filter(q => q.isManagementQuestion);
    
    // 経営質問が10問あることを確認
    if (managementQuestions.length !== 10) {
      console.warn(`経営質問の数が10問ではありません。現在は${managementQuestions.length}問です。`);
    }
    
    // 各経営質問のスコアを合計（答えていない質問は0点として計算）
    let totalScore = 0;
    let answeredCount = 0;
    
    managementQuestions.forEach(question => {
      const answer = answers[question.id];
      if (answer !== undefined) {
        // 5段階評価（1-5）を10点満点に変換
        // 1 => 0点, 2 => 2.5点, 3 => 5点, 4 => 7.5点, 5 => 10点
        const score = (answer - 1) * 2.5;
        totalScore += score;
        answeredCount++;
      }
    });
    
    // 全ての経営質問に回答している場合は平均を返す
    // そうでない場合は未回答の質問を0点として扱う
    return {
      totalScore,
      averageScore: answeredCount > 0 ? totalScore / 10 : 0,
      answeredCount
    };
  };

  // パーソナリティ質問のスコアを計算する関数
  const calculatePersonalityScore = (): PersonalityScoreData => {
    // 各軸ごとの初期値を設定
    const initialAxisData = { scoreA: 0, scoreB: 0, dominantType: 'B' as 'A' | 'B', percentage: 50 };
    const result: PersonalityScoreData = {
      axis1: { ...initialAxisData },
      axis2: { ...initialAxisData },
      axis3: { ...initialAxisData },
      axis4: { ...initialAxisData }
    };
    
    // パーソナリティ質問の回答を集計
    questions.forEach(question => {
      // パーソナリティ軸と種類が設定されていない質問はスキップ
      if (!question.personalityAxis || !question.personalityType) return;
      
      const answer = answers[question.id];
      if (answer !== undefined) {
        // 5段階評価（1-5）を0-5点に変換
        // 1 => 0点, 2 => 1.25点, 3 => 2.5点, 4 => 3.75点, 5 => 5点
        const score = (answer - 1) * 1.25;
        
        // 軸ごとにスコアを集計
        const axisKey = `axis${question.personalityAxis}` as keyof PersonalityScoreData;
        const typeKey = `score${question.personalityType}` as 'scoreA' | 'scoreB';
        
        // @ts-ignore
        result[axisKey][typeKey] += score;
      }
    });
    
    // 各軸の優位タイプと強度を計算
    Object.keys(result).forEach(axisKey => {
      const axis = result[axisKey as keyof PersonalityScoreData];
      
      // 優位タイプを判定（スコアが同じ場合はBタイプを優先）
      axis.dominantType = axis.scoreA > axis.scoreB ? 'A' : 'B';
      
      // 優位タイプの強度をパーセンテージで計算
      const totalScore = axis.scoreA + axis.scoreB;
      if (totalScore > 0) {
        const dominantScore = axis.dominantType === 'A' ? axis.scoreA : axis.scoreB;
        axis.percentage = Math.round((dominantScore / totalScore) * 100);
        
        // パーセンテージが50%を下回る場合は50%に設定（常に優位側を表示）
        if (axis.percentage < 50) {
          axis.percentage = 50;
        }
      }
    });
    
    return result;
  };

  useEffect(() => {
    if (currentFocus !== null) {
      const nextUnansweredId = questions.find(
        (q) => !answers[q.id] && q.id > currentFocus
      )?.id;

      if (nextUnansweredId) {
        const nextElement = questionRefs.current[nextUnansweredId];
        if (nextElement) {
          setTimeout(() => {
            nextElement.scrollIntoView({
              behavior: "smooth",
              block: "center",
            });
          }, 300);
        }
      }
    }
  }, [answers, currentFocus, questions]);

  useEffect(() => {
    if (Object.keys(answers).length === 0 && questionRefs.current[1]) {
      questionRefs.current[1].scrollIntoView({
        behavior: "auto",
        block: "center",
      });
    }
  }, []);

  const handleAnswerSelect = (questionId: number, value: string) => {
    const numValue = parseInt(value, 10);
    setAnswers({
      ...answers,
      [questionId]: numValue,
    });
    setCurrentFocus(questionId);
  };

  const handleSubmit = () => {
    // 診断結果を計算し、結果ページに渡す
    const managementScoreData = calculateManagementScore();
    const personalityScoreData = calculatePersonalityScore();
    
    // localStorage経由で結果を保存
    localStorage.setItem('managementScoreData', JSON.stringify(managementScoreData));
    localStorage.setItem('personalityScoreData', JSON.stringify(personalityScoreData));
    localStorage.setItem('diagnosticAnswers', JSON.stringify(answers));
    
    navigate("/personal-info");
  };

  const allQuestionsAnswered = answeredQuestions === totalQuestions;

  const isQuestionAnswered = (questionId: number) => {
    return answers[questionId] !== undefined;
  };

  const isNextToAnswer = (questionId: number) => {
    if (isQuestionAnswered(questionId)) return false;
    if (Object.keys(answers).length === 0 && questionId === 1) return true;
    const previousQuestions = questions.filter(q => q.id < questionId);
    return previousQuestions.every(q => isQuestionAnswered(q.id)) && !isQuestionAnswered(questionId);
  };

  const getRadioButtonStyle = (value: number) => {
    if (value <= 2) {
      return "border-[#ff3232] hover:border-[#ff3232] text-[#ff3232]";
    } else if (value >= 4) {
      return "border-[#00a381] hover:border-[#00a381] text-[#00a381]";
    }
    return "border-gray-300 hover:border-gray-400 text-gray-400";
  };

  const getRadioButtonLabel = (value: number) => {
    switch (value) {
      case 1:
        return "全くそう思わない";
      case 2:
        return "そう思わない";
      case 3:
        return "どちらともいえない";
      case 4:
        return "そう思う";
      case 5:
        return "強くそう思う";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <main className="flex-1 flex flex-col items-center">
        <div className="w-full bg-[#F6F7FA] px-4 py-3 sm:py-4">
          <div className="w-full max-w-3xl mx-auto">
            <div className="text-center mb-2 sm:mb-3">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-3 text-gray-800">
                <span className="text-[#ff3232]">CXO</span>
                <span>ポテンシャル診断</span>
              </h1>
              <p className="text-xs sm:text-sm md:text-base text-gray-600 mb-1">
                日頃の働き方や考え方についてお伺いします。
              </p>
              <p className="text-xs sm:text-sm md:text-base text-gray-600">
                各設問をじっくり読み込んだ上で最もあてはまるものをそれぞれ1つ選択してください。
              </p>
            </div>
          </div>
        </div>

        <div className="sticky top-0 z-10 w-full bg-[#F6F7FA] shadow-sm">
          <div className="w-full max-w-3xl mx-auto px-4 py-2 sm:py-3">
            <div className="flex justify-between text-xs sm:text-sm text-gray-500 mb-1.5">
              <span>{answeredQuestions}/{totalQuestions}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-1.5 sm:h-2" />
          </div>
        </div>

        <div className="w-full max-w-3xl mx-auto px-4 py-6 sm:py-8">
          <div className="divide-y divide-gray-200">
            {questions.map((question) => (
              <div 
                key={question.id} 
                ref={(el) => (questionRefs.current[question.id] = el)}
                className={`bg-white py-5 sm:py-6 md:py-8 transition-opacity duration-300 ${
                  isQuestionAnswered(question.id) && !isNextToAnswer(question.id + 1) 
                    ? "opacity-40" 
                    : "opacity-100"
                }`}
              >
                <h2 className="text-base sm:text-lg md:text-xl text-center mb-8 sm:mb-10 text-gray-800">
                  {question.text}
                </h2>

                <div className="flex flex-col items-center">
                  <RadioGroup 
                    className="flex flex-col w-full max-w-md gap-3"
                    value={answers[question.id]?.toString() || ""}
                    onValueChange={(value) => handleAnswerSelect(question.id, value)}
                  >
                    <div className="grid grid-cols-5 gap-2 w-full mb-2">
                      {[1, 2, 3, 4, 5].map((value) => (
                        <div key={value} className="flex flex-col items-center">
                          <RadioGroupItem 
                            value={value.toString()} 
                            id={`option-${question.id}-${value}`}
                            className={`${getRadioButtonStyle(value)} mb-1.5`}
                          />
                          <label 
                            htmlFor={`option-${question.id}-${value}`}
                            className="text-xs text-center cursor-pointer"
                          >
                            {getRadioButtonLabel(value)}
                          </label>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-8 sm:mt-10">
            <Button
              onClick={handleSubmit}
              className="w-[320px] h-[70px] bg-[#ff3232] hover:bg-[#e62e2e] text-white text-lg font-bold rounded-full flex items-center justify-center gap-2"
              disabled={!allQuestionsAnswered}
            >
              診断結果を見る
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </main>

      <FooterSection />
      <DebugMenu />
    </div>
  );
};