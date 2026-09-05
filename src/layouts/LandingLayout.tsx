import { Outlet } from "react-router-dom";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { HEADER_CONFIG } from "../config/header";

export default function landing() {

  const headerConfig = HEADER_CONFIG.landing;

  return (
    <div className="min-h-screen flex flex-col">

      <Header {...headerConfig} />

      <main className="flex-grow bg-stone-50">
        <Outlet />
      </main>

      <Footer />

    </div>
  );
}