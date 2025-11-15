import { NextResponse } from "next/server";
import axios from "axios";
import { parseStringPromise } from "xml2js";

const DART_API_KEY = process.env.NEXT_PUBLIC_DART_API_KEY;

export async function GET() {
  try {
    const url = `https://opendart.fss.or.kr/api/corpCode.xml?crtfc_key=${DART_API_KEY}`;
    const res = await axios.get(url, { responseType: "text" });
    const xml = res.data;

    // 서버 콘솔에서 확인
    console.log(xml.slice(0, 500), "xml sample");

    const json = await parseStringPromise(xml, { explicitArray: false });
    const items = Array.isArray(json.result.list.item)
      ? json.result.list.item
      : [json.result.list.item];

    const companies = items.map((i: any) => ({
      corp_name: i.corp_name,
      corp_code: i.corp_code,
    }));

    // 서버 콘솔 sample
    console.log(companies.slice(0, 5), "parsed companies sample");

    return NextResponse.json({ companies });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ companies: [] });
  }
}
