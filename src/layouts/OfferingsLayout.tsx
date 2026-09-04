import { Outlet, useLocation } from "react-router-dom";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { HEADER_CONFIG } from "../config/header";

const PRIVATE_SESSION_PATHS = [
  "/offerings/personal/the-body",
  "/offerings/personal/the-mind",
  "/offerings/personal/the-soul",
];

export default function OfferingsLayout() {

  const location = useLocation();
  const path = location.pathname;

  let headerConfig = HEADER_CONFIG.offeringsHub;

  if (path.startsWith("/offerings/personal")) {
    headerConfig = HEADER_CONFIG.personalHub;
  }

  if (path === "/offerings/personal/faq") {
    headerConfig = HEADER_CONFIG.personalFAQ;
  }

  if (path.startsWith("/offerings/team")) {
    headerConfig = HEADER_CONFIG.teamHub;
  }

  if (path.startsWith("/offerings/flow-series")) {
    headerConfig = HEADER_CONFIG.flowSeries;
  }

  if (PRIVATE_SESSION_PATHS.includes(path)) {
    headerConfig = HEADER_CONFIG.privateSession;
  }

  if (path === "/contact") {
    headerConfig = HEADER_CONFIG.contact;
  }

  const isCheckout = path.startsWith("/checkout");

  return (
    <div className="min-h-screen flex flex-col">

      {!isCheckout && <Header {...headerConfig} />}

      <main className="flex-grow bg-stone-50">
        <Outlet />
      </main>

      {!isCheckout && <Footer />}

    </div>
  );
}