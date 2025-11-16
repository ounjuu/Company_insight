// components/Modal/DetailModal.tsx
"use client";

import { useState, useEffect } from "react";
import axiosInstance from "@/lib/axiosInstance";
import { Edit } from "lucide-react";

type DetailModalProps = {
  companyId: number;
  email: string;
  onClose: () => void;
  onUpdated: () => void; // 부모 테이블 갱신
};

export default function DetailModal({
  companyId,
  email,
  onClose,
  onUpdated,
}: DetailModalProps) {
  const [data, setData] = useState<{
    company_name: string;
    memo: string;
  } | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [memo, setMemo] = useState("");

  // 상세 정보 GET
  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await axiosInstance.get(`/favorites/${companyId}`, {
          params: { email },
        });
        setData(res.data);
        setMemo(res.data.memo);
      } catch (err) {
        console.error(err);
        alert("상세 정보 불러오기 실패");
      }
    };
    fetchDetail();
  }, [companyId, email]);

  const handleSave = async () => {
    try {
      await axiosInstance.put(
        `/favorites/${companyId}`,
        { memo },
        { params: { email } }
      );
      setData((prev) => prev && { ...prev, memo }); // 화면 즉시 업데이트
      onUpdated(); // 테이블 갱신
      setIsEditing(false);
      alert("수정 성공");
    } catch (err) {
      console.error(err);
      alert("수정 실패");
    }
  };

  if (!data) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end"
      onClick={onClose}
    >
      <div
        className="bg-white w-1/2 h-full relative flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 모달 헤더 */}
        <h2 className="text-2xl font-bold h-[60px] px-[20px] border-b border-gray-300 flex items-center justify-center">
          {data.company_name}
        </h2>

        {/* 모달 본문 */}
        <div className="flex-1 p-4 flex flex-col">
          {!isEditing ? (
            <>
              <textarea
                readOnly
                className="w-full flex-1 border rounded p-2 resize-none bg-gray-50"
                value={data.memo}
              />
              <div className="flex justify-end mt-2 whitespace-nowrap">
                <button
                  className="px-4 py-2 bg-black text-white rounded flex justify-center items-center"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit className="w-4 h-4 pr-1" />
                  수정하기
                </button>
              </div>
            </>
          ) : (
            <>
              <textarea
                className="w-full flex-1 border rounded p-2 resize-none focus:outline-none focus:ring-2 focus:ring-gray-500 text-base"
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
              />
              <div className="flex justify-end gap-2 mt-2">
                <button
                  className="px-4 py-2 border rounded"
                  onClick={() => {
                    setMemo(data.memo);
                    setIsEditing(false);
                  }}
                >
                  취소하기
                </button>
                <button
                  className="px-4 py-2 bg-black text-white rounded"
                  onClick={handleSave}
                >
                  저장하기
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
