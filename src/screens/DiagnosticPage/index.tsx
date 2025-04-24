import React, { useState, useRef, useEffect } from "react";
import { Progress } from "../../components/ui/progress";
import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group";
import { Button } from "../../components/ui/button";
import { ArrowRight } from "lucide-react";
import { FooterSection } from "../../components/FooterSection";
import { useNavigate } from "react-router-dom";
import { DebugMenu } from "../../components/DebugMenu";
import { Question, loadQuestions } from "../../utils/questionsLoader";

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
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // 質問データをCSVから読み込む
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const loadedQuestions = await loadQuestions();
        if (loadedQuestions.length > 0) {
          setQuestions(loadedQuestions);
          console.log(`${loadedQuestions.length}件の質問データを読み込みました`);
        } else {
          console.error('質問データの読み込みに失敗しました');
          // フォールバックとしてデモデータを使用
          setQuestions(getDemoQuestions());
        }
      } catch (error) {
        console.error('質問データの読み込み中にエラーが発生しました', error);
        setQuestions(getDemoQuestions());
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  // フォールバック用のデモ質問データ
  const getDemoQuestions = (): Question[] => {
    return [
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
      // デモデータは最小限にとどめる（必要に応じて追加）
    ];
  };

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