// src/api/dartCompanies.ts
import axios from "axios";
import { parseStringPromise } from "xml2js";

const DART_API_KEY = process.env.NEXT_PUBLIC_DART_API_KEY;

export const fetchCompanyCode = async (corp_name: string) => {
  const res = await axios.get(`/api/dartCompanyCode?corp_name=${corp_name}`);
  return res.data.corp_code;
};
