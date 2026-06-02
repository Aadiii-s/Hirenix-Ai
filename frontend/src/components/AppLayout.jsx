import MobileHeader from "./MobileHeader";
import Sidebar from "./Sidebar";

const AppLayout = ({ children, maxWidth = "max-w-7xl" }) => {
  return (
    <div className="h-screen overflow-hidden bg-slate-950 text-white lg:flex">
      <Sidebar />

      <div className="lg:hidden">
        <MobileHeader />
      </div>

      <main
        className="h-screen flex-1 overflow-y-auto px-6 py-6 lg:px-8
        [&::-webkit-scrollbar]:w-2
        [&::-webkit-scrollbar-track]:bg-slate-950
        [&::-webkit-scrollbar-thumb]:rounded-full
        [&::-webkit-scrollbar-thumb]:bg-gray-900
        hover:[&::-webkit-scrollbar-thumb]:bg-gray-700"
      >
        <div className={`mx-auto ${maxWidth}`}>{children}</div>
      </main>
    </div>
  );
};

export default AppLayout;