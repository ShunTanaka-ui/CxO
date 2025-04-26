import React from "react";
import { CheckCircle2 } from "lucide-react";

interface EnvironmentPoint {
  title: string;
  description: string;
}

interface EnvironmentPointsProps {
  points: EnvironmentPoint[];
}

export const EnvironmentPoints = ({ points }: EnvironmentPointsProps): JSX.Element => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
      {points.map((point, index) => (
        <div key={index} className="flex gap-3 md:gap-4">
          <div className="flex-shrink-0 mt-1">
            <CheckCircle2 className="w-4 md:w-5 h-4 md:h-5 text-[#2B7D3C]" />
          </div>
          <div>
            <h4 className="text-sm md:text-base font-bold text-[#343C4B] mb-1 md:mb-2">{point.title}</h4>
            <p className="text-xs md:text-sm text-[#343C4B] leading-relaxed whitespace-pre-line">{point.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};