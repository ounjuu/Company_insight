"use client";

import { useState, useRef, useEffect } from "react";
import useCompanyList from "@/hooks/useCompanyList";
import { YEARS, REPORT_NAMES, FS_TYPES } from "@/constants/dartOptions";
import { fetchFinancialStatement } from "@/api/dart";
import { fetchCompanyCode } from "@/api/dartCompanies";

export default function DartPage() {
  const { data: companyList = [], isLoading } = useCompanyList();

  const [company, setCompany] = useState(""); // 선택된 corp_code
  const [companyName, setCompanyName] = useState(""); // input value
  const [filteredCompanies, setFilteredCompanies] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const [year, setYear] = useState("");
  const [report, setReport] = useState("");
  const [fsDiv, setFsDiv] = useState("");
  const [result, setResult] = useState<any>(null);

  const wrapperRef = useRef<HTMLDivElement>(null);

  // input 밖 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 회사명 입력 시 필터링
  const handleCompanyInput = (value: string) => {
    setCompanyName(value);
    setShowDropdown(true);

    const filtered = companyList
      .filter((c) => c.corp_name) // 존재 확인
      .filter((c) => c.corp_name.toLowerCase().includes(value.toLowerCase()));
    setFilteredCompanies(filtered);
  };

  const handleSelectCompany = (name: string) => {
    setCompanyName(name);
    setShowDropdown(false);
  };

  // 조회 버튼 클릭 시
  const handleSubmit = async () => {
    if (!companyName || !year || !report || !fsDiv) {
      alert("필수값을 모두 선택해주세요!");
      return;
    }

    try {
      // 회사명 → corp_code
      const corpCode = await fetchCompanyCode(companyName);

      const data = await fetchFinancialStatement({
        corpCode,
        year,
        reportCode: report,
        fsCode: fsDiv,
      });
      setResult(data);
    } catch (err: any) {
      console.error(err);
      alert(err.message);
    }
  };

  if (isLoading) return <p>회사 목록 불러오는 중...</p>;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* 기업명 */}
      <div ref={wrapperRef} className="relative">
        <label>기업명 (required)</label>
        <input
          className="border p-2 rounded w-full mt-1"
          placeholder="회사명 검색"
          value={companyName}
          onChange={(e) => handleCompanyInput(e.target.value)}
        />
        {showDropdown && filteredCompanies.length > 0 && (
          <ul className="absolute z-10 w-full max-h-48 overflow-y-auto border bg-white shadow-md mt-1 rounded">
            {filteredCompanies.map((name) => (
              <li
                key={name}
                className="p-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleSelectCompany(name)}
              >
                {name}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* 사업연도 */}
      <div>
        <label>사업연도 (required)</label>
        <select
          className="border p-2 rounded w-full mt-1"
          value={year}
          onChange={(e) => setYear(e.target.value)}
        >
          <option value="">선택하세요</option>
          {YEARS.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

      {/* 보고서명 */}
      <div>
        <label>보고서명 (required)</label>
        <select
          className="border p-2 rounded w-full mt-1"
          value={report}
          onChange={(e) => setReport(e.target.value)}
        >
          <option value="">선택하세요</option>
          {REPORT_NAMES.map((r) => (
            <option key={r.code} value={r.code}>
              {r.label}
            </option>
          ))}
        </select>
      </div>

      {/* 재무제표 */}
      <div>
        <label>재무제표 종류 (required)</label>
        <select
          className="border p-2 rounded w-full mt-1"
          value={fsDiv}
          onChange={(e) => setFsDiv(e.target.value)}
        >
          <option value="">선택하세요</option>
          {FS_TYPES.map((f) => (
            <option key={f.code} value={f.code}>
              {f.label}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white p-2 rounded w-full"
      >
        조회하기
      </button>

      {result && result.length > 0 ? (
        <table className="w-full mt-4 border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2">계정명</th>
              <th className="p-2">당기 금액</th>
              <th className="p-2">전기 금액</th>
            </tr>
          </thead>
          <tbody>
            {result.map((item: any, idx: number) => (
              <tr key={idx} className="border-t">
                <td className="p-2">{item.account_nm}</td>
                <td className="p-2">{item.thstrm_amount}</td>
                <td className="p-2">{item.frmtrm_amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        result && <p className="mt-4">데이터가 없습니다.</p>
      )}
    </div>
  );
}
