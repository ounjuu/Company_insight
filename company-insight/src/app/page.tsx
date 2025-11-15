import Header from "@/features/Header/Header";
import Main from "@/features/Main/Main";

export default function Home() {
  return (
    <div className="overflow-x-auto">
      <div className="w-full h-[1200px]">
        <Header />
        <Main />
      </div>
    </div>
  );
}
