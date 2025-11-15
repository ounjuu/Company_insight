// src/pages/api/dart.ts
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { corpName, year, reportCode, fsCode } = req.query;

  const KEY = process.env.NEXT_PUBLIC_DART_API_KEY;
  if (!KEY) return res.status(500).json({ error: "DART API key is not set" });

  const url = `https://opendart.fss.or.kr/api/fnlttSinglAcntAll.json?crtfc_key=${KEY}&corp_name=${corpName}&bsns_year=${year}&reprt_code=${reportCode}&fs_div=${fsCode}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to fetch from DART API", details: err });
  }
}
