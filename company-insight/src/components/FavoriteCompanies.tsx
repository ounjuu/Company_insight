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

  const handleDelete = async (id: number) => {
    await axiosInstance.delete(`/favorites/${id}`, { data: { email } });
    queryClient.invalidateQueries({ queryKey: ["favorites"] });
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
              <td className="p-2 text-center">
                <button onClick={() => handleDelete(item.id)}>
                  <Trash className="text-gray-300 w-[20px] h-[20px]" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

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
    </div>
  );
}
