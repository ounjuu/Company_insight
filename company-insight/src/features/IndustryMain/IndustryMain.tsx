// IndustryMain.tsx
"use client";

const IndustryMain: React.FC = () => {
  return (
    <div>
      <div className="h-[900px] w-full py-[60px] px-[120px]">
        {/* 산업 관련 */}
        <div className="flex flex-col gap-[4px]">
          <div className="text-[28px] leading-[38px] font-semibold [font-variant-numeric:tabular-nums] font-pretendard mt-2">
            기업 재무제표 조회
          </div>
          <div className="font-noto font-normal text-[14px] leading-[100%] tracking-[0] text-gray-500">
            기업명과 보고서 옵션을 선택하여 제무제표를 조회해보세요.
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndustryMain;
