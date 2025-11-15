import Header from "@/features/Header/Header";
import IndustryMain from "@/features/IndustryMain/IndustryMain";

export default function Industry() {
  return (
    <div className="overflow-x-auto">
      <div className="w-full h-[1200px]">
        <Header />
        <IndustryMain />
      </div>
    </div>
  );
}
