"use client";

import { useTaskStore } from "@/store/taskStore";

const Header: React.FC = () => {
  const { selectedTask, setSelectedTask } = useTaskStore();

  return (
    <header>
      <div className="w-full h-[60px] px-[120px] bg-white flex items-center justify-between">
        {/* 로고 및 오른쪽 선택 버튼 */}
        <div className="border-b-[0.5px] border-gray-300 w-[1680px] h-[60px] flex items-center justify-between">
          {/* 로고 */}
          <div>
            <img src={"/Logo.png"} />
          </div>

          {/* 오른쪽 선택 버튼 */}
          <div className="flex items-center w-[201px] gap-[60px] h-full -translate-x-[15px]">
            <div
              className={`text-[14px] leading-[20px] font-semibold text-center whitespace-nowrap cursor-pointer ${
                selectedTask === "general" ? "text-black" : "text-gray-500"
              }`}
              onClick={() => setSelectedTask("general")}
            >
              일반 과제
            </div>
            <h1
              className={`text-[14px] leading-[20px] font-semibold text-center whitespace-nowrap cursor-pointer ${
                selectedTask === "industry" ? "text-black" : "text-gray-500"
              }`}
              onClick={() => setSelectedTask("industry")}
            >
              산업 전문화 과제
            </h1>
          </div>
        </div>
      </div>
      <div className="relative h-[240px] w-full">
        {/* 배너 이미지 */}
        <img src="/Banner.png" className="h-full w-full object-cover" />

        {/* 글씨 중앙 배치 */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-[16px] leading-[26px] font-semibold text-black [font-variant-numeric:tabular-nums]">
            PwC 삼일 Acceleration Center
          </div>

          {selectedTask === "general" && (
            <div className="text-[36px] leading-[44px] font-bold [font-variant-numeric:tabular-nums] font-pretendard mt-2">
              관심기업 관리 서비스
            </div>
          )}
          {selectedTask === "industry" && (
            <div className="text-[36px] leading-[44px] font-bold [font-variant-numeric:tabular-nums] font-pretendard mt-2">
              기업 재무제표 조회
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
