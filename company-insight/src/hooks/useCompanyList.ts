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
      return res.data.companies;
    },
  });
};

export default useCompanyList;
