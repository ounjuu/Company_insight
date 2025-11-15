"use client";

import { useTaskStore } from "@/store/taskStore";

const Main: React.FC = () => {
  const { selectedTask, setSelectedTask } = useTaskStore();

  return (
    <div>
      <div className="h-[900px] w-full py-[60px] px-[120px]">
        {/* 글씨 중앙 배치 */}
        <div className="">
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
    </div>
  );
};

export default Main;
