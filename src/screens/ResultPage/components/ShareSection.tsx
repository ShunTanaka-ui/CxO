import React from "react";

export const ShareSection = (): JSX.Element => {
  return (
    <div className="w-full bg-[#F6F7FA] py-8 md:py-12">
      <div className="max-w-[800px] mx-auto px-4">
        <h2 className="text-xl md:text-2xl font-bold text-center mb-3 md:mb-4">診断結果をシェアする</h2>
        <p className="text-xs md:text-sm text-gray-600 text-center mb-6 md:mb-8">
          このページに表示されている診断結果まで公開されます。氏名や会員IDなどの情報は公開されません。
        </p>
        <div className="flex flex-col md:flex-row justify-center gap-3 md:gap-4">
          <button className="flex items-center justify-center gap-2 px-6 md:px-8 py-3 bg-[#1DA1F2] text-white rounded-full hover:bg-[#1a91da] transition-colors text-sm md:text-base">
            <img src="/twitter.svg" alt="Twitter" className="w-4 md:w-5 h-4 md:h-5" />
            <span>ツイートする</span>
          </button>
          <button className="flex items-center justify-center gap-2 px-6 md:px-8 py-3 bg-[#1877F2] text-white rounded-full hover:bg-[#166fe5] transition-colors text-sm md:text-base">
            <img src="/facebook.svg" alt="Facebook" className="w-4 md:w-5 h-4 md:h-5" />
            <span>Facebookに投稿する</span>
          </button>
          <button className="flex items-center justify-center gap-2 px-6 md:px-8 py-3 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors text-sm md:text-base">
            <img src="/link.svg" alt="Link" className="w-4 md:w-5 h-4 md:h-5" />
            <span>リンクをコピーする</span>
          </button>
        </div>
      </div>
    </div>
  );
};