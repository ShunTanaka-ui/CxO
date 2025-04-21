import React, { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { FooterSection } from "../../components/FooterSection";
import { DebugMenu } from "../../components/DebugMenu";
import { useNavigate } from "react-router-dom";

export const PersonalInfoPage = (): JSX.Element => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    company: "",
    age: "30代",
    name: "",
    email: "",
  });
  
  // 診断データが存在するか確認
  useEffect(() => {
    const managementScoreData = localStorage.getItem('managementScoreData');
    const diagnosticAnswers = localStorage.getItem('diagnosticAnswers');
    
    // 診断データがない場合は診断ページにリダイレクト
    if (!managementScoreData || !diagnosticAnswers) {
      console.warn('診断データが見つかりません。診断ページにリダイレクトします。');
      // 本番ではコメントアウトを外す
      // navigate('/diagnostic');
    }
  }, [navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("送信されたデータ:", formData);
    
    // ユーザー情報をlocalStorageに保存
    localStorage.setItem('userInfo', JSON.stringify(formData));
    
    // 結果ページに遷移
    navigate("/result");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const ageOptions = ["20代", "30代", "40代", "50代", "60代以上"];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <main className="flex-1 flex flex-col items-center px-4 py-8 md:py-16">
        <div className="w-full max-w-[600px] flex flex-col items-center">
          <div className="w-12 h-12 md:w-16 md:h-16 mb-4">
            <img src="/info.png" alt="情報アイコン" className="w-full h-full" />
          </div>

          <h1 className="text-center mb-4 md:mb-6">
            <div className="text-[#343C4B] text-base md:text-lg font-bold">下記をご記入いただくことで、</div>
            <div className="text-[#343C4B] text-base md:text-lg font-bold">診断結果が表示されます</div>
          </h1>

          <form onSubmit={handleSubmit} className="w-full max-w-[492px] mt-4 md:mt-8 space-y-4 md:space-y-6">
            <div className="space-y-2">
              <label className="block">
                <span className="text-[#343C4B] text-sm md:text-base">
                  会社名
                  <span className="text-[#FF3232] ml-1">※必須</span>
                </span>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="会社名を入力してください"
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 md:px-4 py-2 md:py-3 text-sm md:text-base placeholder:text-gray-400 focus:border-[#FF3232] focus:outline-none"
                  required
                />
              </label>
            </div>

            <div className="space-y-2">
              <label className="block">
                <span className="text-[#343C4B] text-sm md:text-base">
                  年代
                  <span className="text-[#FF3232] ml-1">※必須</span>
                </span>
                <select
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 md:px-4 py-2 md:py-3 text-sm md:text-base focus:border-[#FF3232] focus:outline-none appearance-none bg-[url('/arrow-down.svg')] bg-no-repeat bg-[center_right_1rem]"
                  required
                >
                  {ageOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </label>
            </div>

            <div className="space-y-2">
              <label className="block">
                <span className="text-[#343C4B] text-sm md:text-base">お名前</span>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="お名前を入力してください"
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 md:px-4 py-2 md:py-3 text-sm md:text-base placeholder:text-gray-400 focus:border-[#FF3232] focus:outline-none"
                />
              </label>
            </div>

            <div className="space-y-2">
              <label className="block">
                <span className="text-[#343C4B] text-sm md:text-base">
                  メールアドレス
                  <span className="text-[#FF3232] ml-1">※必須</span>
                </span>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="メールアドレスを入力してください"
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 md:px-4 py-2 md:py-3 text-sm md:text-base placeholder:text-gray-400 focus:border-[#FF3232] focus:outline-none"
                  required
                />
              </label>
            </div>

            <div className="pt-4 md:pt-6">
              <Button
                type="submit"
                className="w-full md:w-[320px] h-[60px] md:h-[70px] bg-[#ff3232] hover:bg-[#e62e2e] text-white text-base md:text-lg font-bold rounded-full mx-auto block"
              >
                結果を見る
              </Button>
            </div>
          </form>
        </div>
      </main>

      <FooterSection />
      <DebugMenu />
    </div>
  );
};