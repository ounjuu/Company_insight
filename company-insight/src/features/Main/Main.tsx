"use client";

import { useTaskStore } from "@/store/taskStore";

const Main: React.FC = () => {
  const { selectedTask, setSelectedTask } = useTaskStore();

  return (
    <div>
      <div className="h-[900px] w-full py-[60px] px-[120px]">
        {/* 글씨 중앙 배치 */}
        <div>
          {selectedTask === "general" && (
            <div className="flex flex-col gap-[4px]">
              <div className="text-[28px] leading-[38px] font-semibold [font-variant-numeric:tabular-nums] font-pretendard mt-2">
                관심기업 관리 서비스
              </div>
              <div className="font-noto font-normal text-[14px] leading-[100%] tracking-[0] text-gray-500">
                관심 기업을 등록하고 삭제하며 관리하세요.
              </div>
            </div>
          )}
          {selectedTask === "industry" && (
            <div className="flex flex-col gap-[4px]">
              <div className="text-[28px] leading-[38px] font-semibold [font-variant-numeric:tabular-nums] font-pretendard mt-2">
                기업 재무제표 조회
              </div>
              <div className="font-noto font-normal text-[14px] leading-[100%] tracking-[0] text-gray-500">
                기업명과 보고서 옵션을 선택하여 제무제표를 조회해보세요.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Main;
