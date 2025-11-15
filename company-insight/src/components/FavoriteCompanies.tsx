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
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 전체 회사명 가져오기
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

  // 관심기업 목록 가져오기
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

  const handleDelete = async (id: number) => {
    await axiosInstance.delete(`/favorites/${id}`, { data: { email } });
    queryClient.invalidateQueries({ queryKey: ["favorites"] });
  };

  if (isCompaniesLoading || isFavoritesLoading) return <div>Loading...</div>;
  if (companiesError || favoritesError) return <div>Error!</div>;

  return (
    <div>
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
                <td
                  className="p-2 cursor-pointer"
                  onClick={() => setIsModalOpen(true)}
                >
                  {item.company_name}
                </td>
                <td
                  className="p-2 cursor-pointer"
                  onClick={() => setIsModalOpen(true)}
                >
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
      <div className="mt-4 flex gap-2 w-full justify-center items-center">
        <button
          disabled={page === 1}
          onClick={() => setPage((prev) => prev - 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          &lt; 이전
        </button>

        {Array.from(
          { length: favoritesData?.total_pages || 1 },
          (_, i) => i + 1
        )
          .filter((p) => {
            if (favoritesData?.total_pages! <= 8) return true;
            if (p === 1 || p === favoritesData?.total_pages) return true;
            if (Math.abs(p - page) <= 2) return true;
            return false;
          })
          .map((p, idx, arr) => {
            if (idx > 0 && p - arr[idx - 1] > 1) {
              return (
                <span key={`dots-${p}`} className="px-2">
                  ...
                </span>
              );
            }

            return (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`px-3 py-1 border rounded ${
                  p === page ? "bg-black text-white" : ""
                }`}
              >
                {p}
              </button>
            );
          })}

        <button
          disabled={page === favoritesData?.total_pages}
          onClick={() => setPage((prev) => prev + 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          다음 &gt;
        </button>
      </div>

      {/* 전체 회사 모달 */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-96 max-h-[70vh] overflow-y-auto rounded p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">전체 회사</h2>
              <button
                className="text-gray-500 font-bold text-xl"
                onClick={() => setIsModalOpen(false)}
              >
                ×
              </button>
            </div>
            <ul className="space-y-2">
              {companiesData?.companies.map((name, idx) => (
                <li
                  key={name + idx}
                  className={`p-2 rounded cursor-pointer hover:bg-gray-100 ${
                    selectedCompany === name ? "bg-gray-200 font-semibold" : ""
                  }`}
                  onClick={() => {
                    setSelectedCompany(name);
                    setIsModalOpen(false);
                  }}
                >
                  {name}
                </li>
              ))}
            </ul>
            <button
              className="mt-4 w-full px-3 py-2 border rounded text-center"
              onClick={() => {
                setSelectedCompany("");
                setIsModalOpen(false);
              }}
            >
              전체 보기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
