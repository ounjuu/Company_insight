import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { parseStringPromise } from "xml2js";
import AdmZip from "adm-zip";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { corp_name } = req.query;
  if (!corp_name) return res.status(400).json({ error: "corp_name required" });

  try {
    // DART API XML 다운로드
    const url = `https://opendart.fss.or.kr/api/corpCode.xml?crtfc_key=${process.env.NEXT_PUBLIC_DART_API_KEY}`;
    const response = await axios.get(url, { responseType: "arraybuffer" });

    // ZIP 압축 풀기
    const zip = new AdmZip(response.data);
    const zipEntries = zip.getEntries();

    const xmlEntry = zipEntries.find((e) => e.entryName.endsWith(".xml"));
    if (!xmlEntry)
      return res.status(500).json({ error: "XML not found in zip" });

    const xmlData = xmlEntry.getData().toString("utf-8");

    // XML → JSON
    const json = await parseStringPromise(xmlData, { explicitArray: false });

    // DART 구조: json.list가 바로 배열
    const rawItems = json.list;
    if (!rawItems) {
      console.error("No items found in XML JSON:", json);
      return res.status(500).json({ error: "No company items in XML" });
    }

    const items = Array.isArray(rawItems)
      ? rawItems.filter(Boolean)
      : [rawItems];

    const corpNameStr = Array.isArray(corp_name) ? corp_name[0] : corp_name;

    // 회사 찾기
    const target = items.find(
      (i: any) => i?.corp_name?.trim() === corpNameStr?.trim()
    );

    if (!target) {
      console.log(`Company not found: ${corpNameStr}`);
      return res.status(404).json({ error: "company not found" });
    }

    return res.status(200).json({ corp_code: target.corp_code });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}
