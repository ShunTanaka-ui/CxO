import React from "react";

interface PersonalityScore {
  leftLabel: string;
  rightLabel: string;
  percentage: number;
  color: string;
  type: string;
  description: string;
}

export const PersonalityScoreBar = ({ score }: { score: PersonalityScore }): JSX.Element => {
  return (
    <div className="mb-6 md:mb-8 last:mb-0">
      <div className="flex flex-col md:flex-row items-start gap-4 md:gap-8">
        <div className="w-full md:flex-1">
          <div className="w-full relative">
            <div 
              className="absolute whitespace-nowrap"
              style={{ left: `${score.percentage}%`, top: '-27px', transform: 'translateX(-50%)' }}
            >
              <span className={`text-xs md:text-sm font-bold ${score.color.replace('bg-', 'text-')}`}>
                {score.percentage}%{score.type}
              </span>
            </div>
            <div className="relative mt-8">
              <div className={`h-2 bg-gray-200 rounded-full`} />
              <div 
                className={`absolute top-0 h-2 ${score.color} rounded-full`}
                style={{ width: `${score.percentage}%` }}
              />
              <div 
                className="absolute"
                style={{ left: `calc(${score.percentage}% - 8px)`, top: '-6px' }}
              >
                <div className="w-4 h-4 rounded-full bg-white border-2" style={{ borderColor: score.color.replace('bg-[', '').replace(']', '') }} />
              </div>
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-[#343C4B] text-xs md:text-sm">{score.leftLabel}</span>
              <span className="text-[#343C4B] text-xs md:text-sm">{score.rightLabel}</span>
            </div>
          </div>
        </div>
        <div className="w-full md:w-[240px] md:flex-shrink-0">
          <div className={`text-xs md:text-sm font-bold mb-1 ${score.color.replace('bg-', 'text-')}`}>
            {score.type}型寄り
          </div>
          <span className="text-xs md:text-sm text-gray-600">{score.description}</span>
        </div>
      </div>
    </div>
  );
};