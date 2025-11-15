// components/Modal/DetailModal.tsx
"use client";

import { useState, useEffect } from "react";
import axiosInstance from "@/lib/axiosInstance";

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
      alert("수정 완료");
      setIsEditing(false);
      onUpdated();
    } catch (err) {
      console.error(err);
      alert("수정 실패");
    }
  };

  if (!data) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
      <div className="bg-white w-1/2 h-full p-6 overflow-y-auto relative">
        <button
          className="absolute top-4 right-4 text-gray-500 text-xl font-bold"
          onClick={onClose}
        >
          ×
        </button>

        <h2 className="text-2xl font-bold mb-4">{data.company_name}</h2>

        {!isEditing ? (
          <div>
            <p className="whitespace-pre-line mb-4">{data.memo}</p>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded"
              onClick={() => setIsEditing(true)}
            >
              수정하기
            </button>
          </div>
        ) : (
          <div>
            <textarea
              className="w-full border rounded p-2 mb-4 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={6}
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
            />
            <div className="flex gap-2">
              <button
                className="px-4 py-2 border rounded"
                onClick={() => {
                  setMemo(data.memo); // 원래 값 복원
                  setIsEditing(false);
                }}
              >
                취소
              </button>
              <button
                className="px-4 py-2 bg-green-600 text-white rounded"
                onClick={handleSave}
              >
                저장
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
