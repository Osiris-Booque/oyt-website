import { Outlet } from "react-router-dom";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { HEADER_CONFIG } from "../config/header";

export default function MarketingLayout() {
  return (
    <div className="min-h-screen flex flex-col">

      <Header {...HEADER_CONFIG.marketing} />

      <main className="flex-grow">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
