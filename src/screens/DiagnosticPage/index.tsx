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
      text: "定期的に新しい友人を作ることを心掛けていますね。",
    },
    {
      id: 2,
      text: "単純明快なアイデアよりも、複雑で斬新なアイデアのほうがワクワクする。",
    },
    {
      id: 3,
      text: "通常、事実に基づいた論拠よりも、感情的に響くものに説得力を感じるほうですね。",
    },
    {
      id: 4,
      text: "生活と仕事のスペースは清潔で整理整頓されている。",
    },
    {
      id: 5,
      text: "大きなプレッシャーがあっても通常、冷静でいられる。",
    },
    {
      id: 6,
      text: "人脈を広げたり、見知らぬ人に自分を売り込んだりすることは、とても大事なことだと感じる。",
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