"use client";

import { useTaskStore } from "@/store/taskStore";
import { useRouter } from "next/navigation"; // ✅ 추가

const Header: React.FC = () => {
  const { selectedTask, setSelectedTask } = useTaskStore();
  const router = useRouter(); // ✅ 라우터 사용

  // 탭 클릭 시 처리
  const handleSelect = (task: "general" | "industry") => {
    setSelectedTask(task);

    if (task === "general") {
      router.push("/"); // ✅ 홈(Main) 페이지로 이동
    } else if (task === "industry") {
      router.push("/industry"); // ✅ 산업 전문화 페이지 이동
    }
  };

  return (
    <header>
      <div className="w-full h-[60px] px-[120px] bg-white flex items-center justify-between">
        <div className="border-b-[0.5px] border-gray-300 w-[1680px] h-[60px] flex items-center justify-between">
          <div>
            <img src={"/Logo.png"} />
          </div>

          <div className="flex items-center w-[201px] gap-[60px] h-full -translate-x-[15px]">
            <div
              className={`text-[14px] leading-[20px] font-semibold text-center whitespace-nowrap cursor-pointer ${
                selectedTask === "general" ? "text-black" : "text-gray-500"
              }`}
              onClick={() => handleSelect("general")}
            >
              일반 과제
            </div>

            <h1
              className={`text-[14px] leading-[20px] font-semibold text-center whitespace-nowrap cursor-pointer ${
                selectedTask === "industry" ? "text-black" : "text-gray-500"
              }`}
              onClick={() => handleSelect("industry")}
            >
              산업 전문화 과제
            </h1>
          </div>
        </div>
      </div>

      <div className="relative h-[240px] w-full">
        <img src="/Banner.png" className="h-full w-full object-cover" />

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-[16px] leading-[26px] font-semibold text-black">
            PwC 삼일 Acceleration Center
          </div>

          {selectedTask === "general" && (
            <div className="text-[36px] leading-[44px] font-bold mt-2">
              관심기업 관리 서비스
            </div>
          )}
          {selectedTask === "industry" && (
            <div className="text-[36px] leading-[44px] font-bold mt-2">
              기업 재무제표 조회
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
