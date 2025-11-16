"use client";

import { useState } from "react";
import axiosInstance from "@/lib/axiosInstance";

type FavoriteCompanyModalProps = {
  isOpen: boolean;
  onClose: () => void;
  companies: string[];
  email: string;
  onAdded: () => void;
  favorites: string[]; // 이미 등록된 관심기업 리스트 추가
};

export default function FavoriteCompanyModal({
  isOpen,
  onClose,
  companies,
  email,
  onAdded,
  favorites,
}: FavoriteCompanyModalProps) {
  const [searchText, setSearchText] = useState("");
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [memo, setMemo] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !companies) return null;

  const filteredCompanies = companies.filter((name) =>
    name.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleAddFavorite = async () => {
    if (!selectedCompany) return; // 회사 선택 안 됐으면 아무것도 안 함
    if (!memo.trim()) {
      // textarea가 비어있으면
      alert("메모를 입력해주세요.");
      return;
    }

    // ✅ 이미 등록된 회사인지 체크
    if (favorites.includes(selectedCompany)) {
      return alert("이미 등록된 회사입니다.");
    }

    setIsSubmitting(true);

    try {
      await axiosInstance.post("/favorites", {
        email,
        company_name: selectedCompany,
        memo,
      });
      setMemo("");
      setSelectedCompany(null);
      setSearchText("");
      onAdded(); // 부모에서 관심기업 테이블 갱신
      onClose();
    } catch (err) {
      console.error(err);
      alert("관심기업 등록 실패");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-[640px] min-h-[530px] overflow-y-auto rounded">
        <div className="flex items-center justify-between h-[56px] w-full border-b border-gray-200 gap-[10px py-[8px] px-[20px]">
          <h2 className="text-lg font-bold">관심 기업 생성</h2>
          <button className="text-gray-500 font-bold text-xl" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="px-[20px] py-[16px] flex flex-col gap-[8px]">
          <div className="text-[16px] leading-[24px] font-normal tracking-normal font-pretendard h-[24px] flex items-center">
            기업 검색
          </div>
          {/* 검색 input */}
          <input
            type="text"
            placeholder="기업명을 입력하세요"
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value);
              setSelectedCompany(null); // 입력 시작하면 선택 초기화
            }}
            className="w-full border rounded px-3 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-black-500"
          />

          {/* 드롭다운: searchText가 있고 selectedCompany와 다를 때만 표시 */}
          {searchText && !selectedCompany && (
            <ul className="h-[230px] overflow-y-auto mb-2">
              {filteredCompanies.length > 0 ? (
                filteredCompanies.map((name, idx) => (
                  <li
                    key={name + idx}
                    className="p-2 rounded cursor-pointer hover:bg-gray-100"
                    onClick={() => {
                      setSelectedCompany(name);
                      setSearchText(name); // 선택한 회사명을 input에 넣음
                    }}
                  >
                    {name}
                  </li>
                ))
              ) : (
                <li className="p-2 text-gray-400">검색 결과가 없습니다.</li>
              )}
            </ul>
          )}

          {/* memo textarea: 기업 선택 시에만 표시 */}
          {selectedCompany && (
            <div>
              <textarea
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                className="w-full border rounded px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 h-[282px]"
                rows={4}
              />
            </div>
          )}
        </div>

        {/* 저장 버튼 */}
        <div className="w-full flex justify-end p-[20px]">
          <button
            onClick={handleAddFavorite}
            disabled={!selectedCompany || isSubmitting}
            className={`px-3 py-2 rounded bg-black text-white ${
              (!selectedCompany || isSubmitting) &&
              "opacity-50 cursor-not-allowed"
            }`}
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
}
