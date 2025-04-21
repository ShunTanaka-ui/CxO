import React from "react";

interface TypeClassificationProps {
  classificationType: '類似型' | '調和型' | '真逆型';
}

export const TypeClassification = ({ classificationType }: TypeClassificationProps): JSX.Element => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className={`rounded-lg p-4 border relative ${classificationType === '真逆型' ? 'border-green-500' : ''}`}>
        {classificationType === '真逆型' && (
          <div className="absolute top-2 right-2">
            <img src="/Check.svg" alt="check" className="w-5 h-5" />
          </div>
        )}
        <h4 className="font-bold text-sm mb-2">
          真逆型{classificationType === '真逆型' ? '（あなた）' : ''}
        </h4>
        <img src="/magyaku.png" alt="真逆型" className="w-full rounded-lg mb-2" />
        <p className="text-xs text-[#343C4B]">
          自分とは考え方の異なる相手に刺激を受け、意かれる場面もあるが、衝突のリスクも
        </p>
      </div>
      <div className={`rounded-lg p-4 border relative ${classificationType === '類似型' ? 'border-green-500' : ''}`}>
        {classificationType === '類似型' && (
          <div className="absolute top-2 right-2">
            <img src="/Check.svg" alt="check" className="w-5 h-5" />
          </div>
        )}
        <h4 className="font-bold text-sm mb-2">
          類似型{classificationType === '類似型' ? '（あなた）' : ''}
        </h4>
        <img src="/ruiji.png" alt="類似型" className="w-full rounded-lg mb-2" />
        <p className="text-xs text-[#343C4B]">
          自分と価値観が近く、波長の合うメンバーと組むことで安定した成果を出せるタイプ
        </p>
      </div>
      <div className={`rounded-lg p-4 border relative ${classificationType === '調和型' ? 'border-green-500' : ''}`}>
        {classificationType === '調和型' && (
          <div className="absolute top-2 right-2">
            <img src="/Check.svg" alt="check" className="w-5 h-5" />
          </div>
        )}
        <h4 className="font-bold text-sm mb-2">
          調和型{classificationType === '調和型' ? '（あなた）' : ''}
        </h4>
        <img src="/chowa.png" alt="調和型" className="w-full rounded-lg mb-2" />
        <p className="text-xs text-[#343C4B]">
          多様な価値観や働き方を受け入れつつ、組織に"流れ"をつくることができるタイプ
        </p>
      </div>
    </div>
  );
};