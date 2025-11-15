// src/hooks/useCompanyList.ts
import axiosInstance from "@/lib/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export type Company = {
  corp_name: string;
  corp_code: string;
};

const useCompanyList = () => {
  return useQuery<Company[]>({
    queryKey: ["companies"],
    queryFn: async () => {
      const res = await axiosInstance.get("/companies");
      console.log("companies from API:", res.data.companies); // 여기서 배열 확인
      return res.data.companies; // [{corp_name, corp_code}, ...] 형태
    },
  });
};

export default useCompanyList;
