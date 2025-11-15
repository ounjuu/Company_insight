// src/api/dartCompanies.ts
import axios from "axios";
import { parseStringPromise } from "xml2js";

const DART_API_KEY = process.env.NEXT_PUBLIC_DART_API_KEY;

export const fetchCompanyCode = async (corp_name: string) => {
  const url = `https://opendart.fss.or.kr/api/corpCode.xml?crtfc_key=${DART_API_KEY}`;
  const res = await axios.get(url, { responseType: "text" }); // XML 그대로 받아오기
  const xml = res.data;

  const json = await parseStringPromise(xml, { explicitArray: false });
  // json 구조: json.result.list.item -> 배열 또는 객체

  const items = Array.isArray(json.result.list.item)
    ? json.result.list.item
    : [json.result.list.item];

  // 회사명과 일치하는 corp_code 찾기
  const target = items.find((i: any) => i.corp_name === corp_name);

  if (!target)
    throw new Error(`${corp_name}에 대한 corp_code를 찾을 수 없습니다.`);

  return target.corp_code; // corp_code 반환
};
