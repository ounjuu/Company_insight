"use client";

interface HeaderProps {
  title?: string;
}

const Header: React.FC<HeaderProps> = ({ title = "Company Insight" }) => {
  return (
    <header className="">
      <div className="w-full h-[60px] px-[120px] bg-white flex items-center justify-between">
        {/* 로고 및 오른쪽 선택 버튼 */}
        <div className="border-b-[0.5px] border-gray-300 w-[1680px] h-[60px] flex items-center justify-between">
          {/* 로고 */}
          <div>
            <img src={"/Logo.png"} />
          </div>

          {/* 오른쪽 선택 버튼 */}
          <div className="flex items-center w-[201px] gap-[60px] h-full -translate-x-[15px]">
            <div className="text-[14px] leading-[20px] font-semibold text-center whitespace-nowrap">
              일반 과제
            </div>
            <h1 className="text-[14px] leading-[20px] font-semibold text-center whitespace-nowrap">
              산업 전문화 과제
            </h1>
          </div>
        </div>
      </div>
      <div className="h-[240px]">
        <img src="/Banner.png" className="h-full" />
        <div>PwC 삼일 Acceleration Center</div>
        <div>관심기업 관리 서비스</div>
        <div>기업 재무제표 조회</div>
      </div>
    </header>
  );
};

export default Header;
