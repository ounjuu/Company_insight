// FavoriteCompanies.tsx
"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axiosInstance";
import { useFavoriteStore } from "@/store/favoriteStore";
import { Trash } from "lucide-react";

// 모달
import FavoriteCompanyModal from "./Modal/FavoriteCompanyModal";
import DetailModal from "./Modal/DetailModal";
import DeleteModal from "./Modal/DeleteModal";

type FavoriteItem = {
  id: number;
  company_name: string;
  created_at: string;
};

type FavoritesResponse = {
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
  items: FavoriteItem[];
};

type CompaniesResponse = {
  companies: string[];
};

type SelectedDetailCompany = {
  id: number;
  company_name: string;
};

// ✅ 모달 상태를 prop으로 받음
type FavoriteCompaniesProps = {
  isCompanyListModalOpen: boolean;
  setIsCompanyListModalOpen: (open: boolean) => void;
};

const email = process.env.NEXT_PUBLIC_USER_EMAIL || "";

export default function FavoriteCompanies({
  isCompanyListModalOpen,
  setIsCompanyListModalOpen,
}: FavoriteCompaniesProps) {
  const queryClient = useQueryClient();
  const { selectedCompany, setSelectedCompany, selectedIds, toggleSelectedId } =
    useFavoriteStore();
  const [page, setPage] = useState(1);

  const [selectedDetailCompany, setSelectedDetailCompany] =
    useState<SelectedDetailCompany | null>(null);

  const [searchText, setSearchText] = useState("");

  // 모달 상태
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);

  // 관심기업 추가 후 테이블 갱신
  const handleAdded = () => {
    queryClient.invalidateQueries({ queryKey: ["favorites"] });
  };

  // 전체 회사명 가져오기
  const { data: companiesData } = useQuery<CompaniesResponse, Error>({
    queryKey: ["companies"],
    queryFn: async () => {
      const res = await axiosInstance.get("/companies");
      return res.data;
    },
  });

  // 관심기업 목록 가져오기
  const { data: favoritesData } = useQuery<FavoritesResponse, Error>({
    queryKey: ["favorites", page],
    queryFn: async () => {
      const res = await axiosInstance.get("/favorites", {
        params: { email, page },
      });
      return res.data;
    },
  });

  // 페이지네이션 계산
  const getPageNumbers = () => {
    if (!favoritesData) return [];
    const total = favoritesData.total_pages;
    const maxVisible = 8; // 최대 표시 페이지 수
    const pages = [];

    if (total <= maxVisible) {
      for (let i = 1; i <= total; i++) pages.push(i);
    } else {
      const left = Math.min(page, total - maxVisible + 1);
      for (let i = left; i < left + maxVisible; i++) pages.push(i);
      if (pages[pages.length - 1] < total) pages.push("...");
      pages.push(total);
    }
    return pages;
  };

  return (
    <div>
      <table className="w-full border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 text-center">
              <input
                type="checkbox"
                checked={
                  favoritesData?.items.every((f) =>
                    selectedIds.includes(f.id)
                  ) && favoritesData?.items.length > 0
                }
                onChange={() => {
                  if (!favoritesData) return;
                  if (
                    favoritesData.items.every((f) => selectedIds.includes(f.id))
                  ) {
                    selectedIds.forEach((id) => toggleSelectedId(id));
                  } else {
                    favoritesData.items.forEach((f) => {
                      if (!selectedIds.includes(f.id)) toggleSelectedId(f.id);
                    });
                  }
                }}
              />
            </th>
            <th className="p-2 text-left">회사명</th>
            <th className="p-2 text-left">생성일자</th>
            <th className="p-2 text-center"></th>
          </tr>
        </thead>
        <tbody>
          {favoritesData?.items.map((item) => (
            <tr key={item.id} className="border-t">
              <td className="p-2 text-center">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(item.id)}
                  onChange={() => toggleSelectedId(item.id)}
                />
              </td>
              <td
                className="p-2 cursor-pointer text-blue-600"
                onClick={() =>
                  setSelectedDetailCompany({
                    id: item.id,
                    company_name: item.company_name,
                  })
                }
              >
                {item.company_name}
              </td>
              <td className="p-2">
                {new Date(item.created_at).toLocaleString("ko-KR", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })}
              </td>

              {/* 휴지통 아이콘 개별 삭제 버튼 */}
              <td className="p-2 text-center">
                <button
                  onClick={() => {
                    setDeleteTargetId(item.id); // 삭제 대상 설정
                    setIsDeleteModalOpen(true); // 모달 열기
                  }}
                >
                  <Trash className="text-gray-300 w-[20px] h-[20px]" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* DeleteModal 호출 부분 */}

      {isDeleteModalOpen && deleteTargetId !== null && (
        <DeleteModal
          count={deleteTargetId ? 1 : selectedIds.length} // 개별 삭제면 1, 다중 선택 삭제면 selectedIds.length
          onClose={() => {
            setIsDeleteModalOpen(false);
            setDeleteTargetId(null);
          }}
          onConfirm={async () => {
            try {
              if (deleteTargetId !== null) {
                // ✅ 개별 삭제
                await axiosInstance.delete(`/favorites/${deleteTargetId}`, {
                  params: { email },
                });
                // ✅ 선택 목록에서 제거
                toggleSelectedId(deleteTargetId);
              } else if (selectedIds.length > 0) {
                // ✅ 여러개 삭제
                await Promise.all(
                  selectedIds.map((id) =>
                    axiosInstance.delete(`/favorites/${id}`, {
                      params: { email },
                    })
                  )
                );
                // ✅ 삭제 후 선택 초기화
                selectedIds.splice(0, selectedIds.length);
              }

              queryClient.invalidateQueries({ queryKey: ["favorites", page] });
              setIsDeleteModalOpen(false);
              setDeleteTargetId(null);
              alert("삭제 성공");
            } catch (err) {
              console.error(err);
              alert("삭제 실패");
            }
          }}
        />
      )}
      {/* (전체 회사 목록) 관심 기업 생성 모달 */}
      {companiesData && (
        <FavoriteCompanyModal
          isOpen={isCompanyListModalOpen} // ✅ Main에서 내려준 prop 사용
          onClose={() => setIsCompanyListModalOpen(false)} // ✅ Main에서 내려준 setter 사용
          companies={companiesData.companies}
          email={email}
          onAdded={handleAdded}
        />
      )}
      {/* 회사 상세 모달 */}
      {selectedDetailCompany && (
        <DetailModal
          companyId={selectedDetailCompany.id} // 선택한 회사 id
          email={email}
          onClose={() => setSelectedDetailCompany(null)}
          onUpdated={() =>
            queryClient.invalidateQueries({ queryKey: ["favorites", page] })
          }
        />
      )}
      {/* 페이지네이션 */}
      {favoritesData && favoritesData.total_pages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          <button
            className="px-3 py-1 border rounded disabled:opacity-50"
            disabled={page === 1}
            onClick={() => setPage((prev) => prev - 1)}
          >
            &lt; 이전
          </button>

          {getPageNumbers().map((p, idx) =>
            p === "..." ? (
              <span key={idx} className="px-2 py-1">
                ...
              </span>
            ) : (
              <button
                key={p}
                className={`px-3 py-1 border rounded ${
                  p === page ? "bg-black text-white" : ""
                }`}
                onClick={() => setPage(Number(p))}
              >
                {p}
              </button>
            )
          )}

          <button
            className="px-3 py-1 border rounded disabled:opacity-50"
            disabled={page === favoritesData?.total_pages}
            onClick={() => setPage((prev) => prev + 1)}
          >
            다음 &gt;
          </button>
        </div>
      )}
    </div>
  );
}
