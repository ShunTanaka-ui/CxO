import React from "react";

interface CircularProgressProps {
  value: number;
}

export const CircularProgress = ({ value }: CircularProgressProps): JSX.Element => {
  const radius = 80;
  const strokeWidth = 12;
  const normalizedRadius = radius - strokeWidth * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <div className="relative w-[120px] md:w-[160px] h-[120px] md:h-[160px] flex items-center justify-center">
      <svg height={radius * 2} width={radius * 2} className="absolute scale-75 md:scale-100">
        <circle
          stroke="#e5e7eb"
          fill="transparent"
          strokeWidth={strokeWidth}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
      </svg>
      
      <svg height={radius * 2} width={radius * 2} className="absolute transform -rotate-90 scale-75 md:scale-100">
        <circle
          stroke="#4caf50"
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference + ' ' + circumference}
          style={{ strokeDashoffset }}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
      </svg>
      
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl md:text-4xl font-bold text-[#343C4B]">{value}</div>
          <div className="text-xs md:text-sm text-[#343C4B]">点</div>
        </div>
      </div>
    </div>
  );
};