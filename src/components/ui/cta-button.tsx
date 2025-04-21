import React from "react";
import { Button } from "./button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const CTAButton = (): JSX.Element => {
  const navigate = useNavigate();

  return (
    <Button
      onClick={() => navigate("/diagnostic")}
      className="w-[320px] h-[70px] bg-[#ff3232] hover:bg-[#e62e2e] text-white text-lg font-bold rounded-full flex items-center justify-center gap-2"
    >
      CXO診断を受ける
      <ArrowRight className="w-5 h-5" />
    </Button>
  );
};