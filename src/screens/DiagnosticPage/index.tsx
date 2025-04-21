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
    },
    {
      id: 2,
      text: "理屈やデータも大事だが、最終的には自分の直感や「これだ！」という感覚を信じて判断することが多い。",
    },
    {
      id: 3,
      text: "既存の常識やルールにとらわれず、根本から違うやり方や発想を試してみたいと思うことが多い。",
    },
    {
      id: 4,
      text: "急な市場の変化や予期せぬ事態に応じて、計画を大胆に変更し、迅速に行動を起こすことに抵抗がない。",
    },
    {
      id: 5,
      text: "チーム内に意見の対立が起きた際は、一方的に結論を出すのではなく、それぞれの立場や考えを理解し合う場を設けたい。",
    },
    {
      id: 6,
      text: "メンバーを信頼し、仕事の進め方や判断をできるだけ任せることで、自主性や成長を促したい。",
    },
    {
      id: 7,
      text: "チームで重要な意思決定をする際には、メンバー全員が納得できるよう、丁寧に意見を聞き、対話を重ねることを重視する。",
    },
    {
      id: 8,
      text: "正解が誰にも分からず情報も不十分な状況下でも、強いプレッシャーの中でリーダーとして最終的な意思決定を下すことができる。",
    },
    {
      id: 9,
      text: "目標を達成するためには、具体的なステップに落とし込んだ計画を立て、それに沿って進捗を管理することが効果的だと思う。",
    },
    {
      id: 10,
      text: "仕事においては、場当たり的な対応よりも、再現性のある仕組みや標準化されたプロセスを重視する。",
    },
    {
      id: 11,
      text: "最終的な方針決定は、様々な意見を参考にしつつも、リーダーが責任を持って決めるべきだと考える。",
    },
    {
      id: 12,
      text: "議論が停滞したり方向性が定まらなかったりする時は、自分が率先して意見を述べ、場をリードする役割を担うことが多い。",
    },
    {
      id: 13,
      text: "事業をやるなら、業界のゲームチェンジを起こすような、大きな変化やインパクトを狙いたい。",
    },
    {
      id: 14,
      text: "顧客が本当に求めていることは何かを探求し、プロダクトやサービスを通じてその期待に応えることに強い関心がある。",
    },
    {
      id: 15,
      text: "行動に移る前に、潜在的なリスクを洗い出し、可能な限り事前に対応策を準備しておきたい。",
    },
    {
      id: 16,
      text: "自身の役割や必要なスキルが変化し続けても、常に新しいことを学び、自己変革していくことに強い意欲を持っている。",
    },
    {
      id: 17,
      text: "情報が不十分で先行き不透明な状況でも、大胆に決断し、行動を起こすことを厭わない。",
    },
    {
      id: 18,
      text: "世の中にまだない、全く新しい価値やサービスをゼロから生み出すことにワクワクする。",
    },
    {
      id: 19,
      text: "混沌とした状況や多くの情報の中から、問題や事業機会の核心を素早く見抜き、進むべき方向を示すことができる。",
    },
    {
      id: 20,
      text: "会社の危機において、事業と従業員を守るためならば、最終的な責任者として個人的な犠牲を払う覚悟がある。",
    },
    {
      id: 21,
      text: "急成長も魅力的だが、事業の持続可能性や安定した収益基盤を築くことも同じくらい大切だと考える。",
    },
    {
      id: 22,
      text: "チームを率いる上では、明確なビジョンや目標を掲げ、メンバーを力強く導いていくことが重要だ。",
    },
    {
      id: 23,
      text: "事業の成功のためには、まず市場で勝ち抜くことが最重要であり、社内体制はその後に整備するものだと考える傾向がある。",
    },
    {
      id: 24,
      text: "世の中のトレンドや競合の動向を常に把握し、自社の事業戦略にどう活かせるかを考えるのが好きだ。",
    },
    {
      id: 25,
      text: "チームメンバーの育成やキャリア開発を支援し、個々の能力が最大限に発揮される組織づくりに関心がある。",
    },
    {
      id: 26,
      text: "予期せぬトラブルや資金難といった危機的な状況に直面しても、冷静さを保ち、打開策を見つけるために粘り強く思考できる。",
    },
    {
      id: 27,
      text: "「良いかもしれない」と感じたら、完璧な計画を待つより、まず小さく試してみて手応えを見たい。",
    },
    {
      id: 28,
      text: "新しい取り組みを始める前は、関連情報を広く集め、メリット・デメリットを比較検討する時間を十分に取りたい。",
    },
    {
      id: 29,
      text: "自らの判断が短期的に批判されたり、失敗と見なされたりしても、長期的な成功を信じて粘り強く挑戦し続けることができる。",
    },
    {
      id: 30,
      text: "組織が進むべき魅力的なビジョンを描き、それをメンバーと共有し、実現に向けて情熱を注ぎたいと思う。",
    },
    {
      id: 31,
      text: "まだ市場に受け入れられるか分からない新しいアイデアや、達成困難に見える高い目標にも、積極的に挑戦したいと思う。",
    },
    {
      id: 32,
      text: "既にあるものをより良く改善したり、効率化したりするプロセスに、地道だが確かなやりがいを感じる。",
    },
    {
      id: 33,
      text: "メンバーがいきいきと働き、互いに協力し合えるような、良い組織文化や職場環境を創り出すことに力を注ぎたい。",
    },
    {
      id: 34,
      text: "事業の成功のためには、優秀な人材が定着し、チームとして機能する組織基盤を長期的な視点で築くことが不可欠だと考える。",
    },
  ];

  const totalQuestions = questions.length;
  const answeredQuestions = Object.keys(answers).length;
  const progress = (answeredQuestions / totalQuestions) * 100;

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
    if (value <= 3) {
      return "border-[#00a381] hover:border-[#00a381] text-[#00a381]";
    } else if (value >= 5) {
      return "border-[#ff3232] hover:border-[#ff3232] text-[#ff3232]";
    }
    return "border-gray-300 hover:border-gray-400 text-gray-400";
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
                  <div className="flex justify-between w-full max-w-md mb-3 sm:mb-4">
                    <span className="text-[#00a381] text-sm sm:text-base font-medium">賛成する</span>
                    <span className="text-[#ff3232] text-sm sm:text-base font-medium">反対する</span>
                  </div>

                  <RadioGroup 
                    className="flex justify-between w-full max-w-md"
                    value={answers[question.id]?.toString() || ""}
                    onValueChange={(value) => handleAnswerSelect(question.id, value)}
                  >
                    {[1, 2, 3, 4, 5, 6, 7].map((value) => (
                      <RadioGroupItem 
                        key={value} 
                        value={value.toString()} 
                        id={`option-${question.id}-${value}`}
                        className={getRadioButtonStyle(value)}
                      />
                    ))}
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