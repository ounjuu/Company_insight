"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axiosInstance";

export default function CompanyList() {
  const [companies, setCompanies] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance
      .get("/companies")
      .then((res) => {
        setCompanies(res.data.companies);
      })
      .catch((err) => {
        console.error("회사 리스트 조회 오류:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-4">
      <p className="font-bold text-lg mb-2">전체 회사명 리스트</p>

      <ul className="list-disc ml-6">
        {companies.map((name, idx) => (
          <li key={idx} className="py-1">
            {name}
          </li>
        ))}
      </ul>
    </div>
  );
}
