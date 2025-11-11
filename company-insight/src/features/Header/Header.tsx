"use client";

interface HeaderProps {
  title?: string;
}

const Header: React.FC<HeaderProps> = ({ title = "Company Insight" }) => {
  return (
    <header className="w-[1920px] h-[60px] px-[120px] bg-white shadow-md flex items-center justify-between">
      {/* 로고 */}
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-red font-bold">
          일반 과제
        </div>
        <h1 className="text-xl font-semibold !text-red-200">
          산업 전문화 과제
        </h1>
      </div>
    </header>
  );
};

export default Header;
