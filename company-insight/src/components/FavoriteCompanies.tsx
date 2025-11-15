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

const email = "test@example.com"; // 임의 이메일

export default function FavoriteCompanies() {
  const queryClient = useQueryClient();
  const { selectedCompany, setSelectedCompany, selectedIds, toggleSelectedId } =
    useFavoriteStore();
  const [page, setPage] = useState(1);

  // 1️⃣ 전체 회사명 가져오기
  const {
    data: companiesData,
    isLoading: isCompaniesLoading,
    error: companiesError,
  } = useQuery<CompaniesResponse, Error>({
    queryKey: ["companies"],
    queryFn: async () => {
      const res = await axiosInstance.get("/companies");
      return res.data;
    },
  });

  // 2️⃣ 관심기업 목록 가져오기 (페이지네이션)
  const {
    data: favoritesData,
    isLoading: isFavoritesLoading,
    error: favoritesError,
  } = useQuery<FavoritesResponse, Error>({
    queryKey: ["favorites", page],
    queryFn: async () => {
      const res = await axiosInstance.get("/favorites", {
        params: { email, page },
      });
      return res.data;
    },
  });

  // 3️⃣ 관심기업 삭제
  const handleDelete = async (id: number) => {
    await axiosInstance.delete(`/favorites/${id}`, { data: { email } });
    queryClient.invalidateQueries({ queryKey: ["favorites"] });
  };

  if (isCompaniesLoading || isFavoritesLoading) return <div>Loading...</div>;
  if (companiesError || favoritesError) return <div>Error!</div>;

  return (
    <div>
      {/* 상단 메뉴 */}
      <div className="flex gap-4 mb-4 items-center">
        <select
          className="border p-2 rounded"
          value={selectedCompany}
          onChange={(e) => setSelectedCompany(e.target.value)}
        >
          <option value="">전체 회사</option>
          {companiesData?.companies.map((name, index) => (
            <option key={`${name}-${index}`} value={name}>
              {name}
            </option>
          ))}
        </select>
      </div>

      {/* 목록 테이블 */}
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
                    selectedIds.forEach((id) => toggleSelectedId(id)); // 전체 해제
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
          {favoritesData?.items
            .filter((f) =>
              selectedCompany ? f.company_name === selectedCompany : true
            )
            .map((item) => (
              <tr key={item.id} className="border-t">
                <td className="p-2 text-center">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(item.id)}
                    onChange={() => toggleSelectedId(item.id)}
                  />
                </td>
                <td className="p-2">{item.company_name}</td>
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

      {/* 페이지네이션 */}
      <div className="mt-4 flex gap-2">
        <button
          disabled={page === 1}
          onClick={() => setPage((prev) => prev - 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          이전
        </button>
        <span className="px-3 py-1 border rounded">
          페이지 {page} / {favoritesData?.total_pages || 1}
        </span>
        <button
          disabled={page === favoritesData?.total_pages}
          onClick={() => setPage((prev) => prev + 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          다음
        </button>
      </div>
    </div>
  );
}
