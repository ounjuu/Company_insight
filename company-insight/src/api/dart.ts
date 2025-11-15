// src/api/dart.ts
export const fetchFinancialStatement = async ({
  corpCode,
  year,
  reportCode,
  fsCode,
}: {
  corpCode: string;
  year: string;
  reportCode: string;
  fsCode: string;
}) => {
  const KEY = process.env.NEXT_PUBLIC_DART_API_KEY;
  if (!KEY)
    throw new Error("DART API key is not set in NEXT_PUBLIC_DART_API_KEY");

  const query = new URLSearchParams({
    crtfc_key: KEY,
    corp_code: corpCode,
    bsns_year: year,
    reprt_code: reportCode,
    fs_div: fsCode,
  });

  const res = await fetch(
    `https://opendart.fss.or.kr/api/fnlttSinglAcntAll.json?${query.toString()}`
  );

  if (!res.ok) throw new Error("Failed to fetch financial statement");

  const data = await res.json();
  console.log(data, "data?");
  if (data.status !== "000") {
    console.error(data);
    throw new Error(data.message || "Error from DART API");
  }

  return data.list;
};
