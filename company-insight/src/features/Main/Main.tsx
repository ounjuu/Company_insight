// Main.tsx
"use client";

import { useState } from "react";
import { useTaskStore } from "@/store/taskStore";
import FavoriteCompanies from "@/components/FavoriteCompanies";
import { useFavoriteStore } from "@/store/favoriteStore";
import { Trash } from "lucide-react";
import axiosInstance from "@/lib/axiosInstance";
import { useQueryClient } from "@tanstack/react-query";

const Main: React.FC = () => {
  const { selectedTask } = useTaskStore();
  const { selectedIds } = useFavoriteStore();

  const email = process.env.NEXT_PUBLIC_USER_EMAIL || "";

  // ✅ 모달 상태를 Main에서 관리
  const [isCompanyListModalOpen, setIsCompanyListModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const queryClient = useQueryClient();

  const handleDelete = async () => {
    if (selectedIds.length === 0) return;

    try {
      await Promise.all(
        selectedIds.map((id) =>
          axiosInstance.delete(`/favorites/${id}`, { params: { email } })
        )
      );

      // 1️⃣ 모달 닫기
      setIsDeleteModalOpen(false);

      // 2️⃣ 선택 초기화
      selectedIds.splice(0, selectedIds.length);

      // 3️⃣ 테이블 갱신
      queryClient.invalidateQueries({ queryKey: ["favorites"] });

      // 4️⃣ 알림
      alert("선택한 관심기업이 삭제되었습니다.");
    } catch (err) {
      console.error(err);
      alert("삭제 실패");
    }
  };

  return (
    <div>
      <div className="h-[900px] w-full py-[60px] px-[120px]">
        <div>
          {selectedTask === "general" && (
            <div className="flex flex-col gap-6">
              <div className="flex justify-between items-center">
                <div className="flex flex-col gap-[4px]">
                  <div className="text-[28px] leading-[38px] font-semibold [font-variant-numeric:tabular-nums] font-pretendard mt-2">
                    관심기업 관리 서비스
                  </div>
                  <div className="font-noto font-normal text-[14px] leading-[100%] tracking-[0] text-gray-500">
                    관심 기업을 등록하고 삭제하며 관리하세요.
                  </div>
                </div>

                <div className="flex gap-4">
                  {/* 생성 버튼 클릭 시 모달 열기 */}
                  <button
                    className="flex items-center justify-center w-[147px] h-[38px] rounded-[4px] px-4 py-2 gap-2 bg-black text-white whitespace-nowrap"
                    onClick={() => setIsCompanyListModalOpen(true)}
                  >
                    <span className="text-lg font-bold">+</span>
                    관심기업 생성
                  </button>

                  <button
                    className="flex items-center justify-center w-[147px] h-[38px] rounded-[4px] px-4 py-2 gap-2 border border-[#3E3E3E] text-[#3E3E3E] whitespace-nowrap"
                    onClick={() => setIsDeleteModalOpen(true)}
                  >
                    <Trash className="w-4 h-4" />
                    관심기업 삭제
                  </button>
                </div>
              </div>

              <div className="w-full">
                {/* 모달 상태를 prop으로 내려줌 */}
                <FavoriteCompanies
                  isCompanyListModalOpen={isCompanyListModalOpen}
                  setIsCompanyListModalOpen={setIsCompanyListModalOpen}
                />
              </div>
            </div>
          )}

          {/* 삭제 확인 모달 */}
          {isDeleteModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded p-6 w-96">
                <h2 className="text-lg font-bold mb-2">삭제 확인</h2>
                <p className="mb-4">
                  총 {selectedIds.length}개 삭제하시겠습니까?
                  <br />
                  관심기업 삭제 시 복구할 수 없습니다. 정말 삭제하시겠습니까?
                </p>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setIsDeleteModalOpen(false)}
                    className="px-4 py-2 rounded border"
                  >
                    취소
                  </button>
                  <button
                    onClick={handleDelete}
                    className="px-4 py-2 rounded bg-red-600 text-white"
                  >
                    삭제
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 산업 관련 */}

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
