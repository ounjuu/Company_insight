// FavoriteCompanies.tsx
"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axiosInstance";
import { useFavoriteStore } from "@/store/favoriteStore";
import { Trash } from "lucide-react";

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

// ✅ 모달 상태를 prop으로 받음
type FavoriteCompaniesProps = {
  isCompanyListModalOpen: boolean;
  setIsCompanyListModalOpen: (open: boolean) => void;
};

const email = "test@example.com";

export default function FavoriteCompanies({
  isCompanyListModalOpen,
  setIsCompanyListModalOpen,
}: FavoriteCompaniesProps) {
  const queryClient = useQueryClient();
  const { selectedCompany, setSelectedCompany, selectedIds, toggleSelectedId } =
    useFavoriteStore();
  const [page, setPage] = useState(1);
  const [selectedDetailCompany, setSelectedDetailCompany] = useState<
    string | null
  >(null);

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
                onClick={() => setSelectedDetailCompany(item.company_name)}
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

      {/* 전체 회사 목록 모달 */}
      {isCompanyListModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-96 max-h-[70vh] overflow-y-auto rounded p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">전체 회사</h2>
              <button
                className="text-gray-500 font-bold text-xl"
                onClick={() => setIsCompanyListModalOpen(false)}
              >
                ×
              </button>
            </div>
            <ul className="space-y-2">
              {companiesData?.companies.map((name, idx) => (
                <li
                  key={name + idx}
                  className="p-2 rounded cursor-pointer hover:bg-gray-100"
                  onClick={() => {
                    setSelectedCompany(name);
                    setIsCompanyListModalOpen(false);
                  }}
                >
                  {name}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* 회사 상세 모달 */}
      {selectedDetailCompany && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-96 rounded p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">
                {selectedDetailCompany} 상세
              </h2>
              <button
                className="text-gray-500 font-bold text-xl"
                onClick={() => setSelectedDetailCompany(null)}
              >
                ×
              </button>
            </div>
            <p>여기에 {selectedDetailCompany}에 대한 상세 정보를 표시합니다.</p>
          </div>
        </div>
      )}
    </div>
  );
}
