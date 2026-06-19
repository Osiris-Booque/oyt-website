import { Link, useLocation } from "react-router-dom";
import { Heart, Menu, X, ArrowLeft } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { CTA_CONFIG } from "../../config/cta";
import { scrollToHash } from "../ScrollManager";

type NavItem = {
  label: string;
  to?: string;
  href?: string;
  isBack?: boolean;
};

type HeaderProps = {
  style?: string;
  navItems?: NavItem[];
  cta?: string;
  hideCurrentPage?: boolean;
};

export default function Header({
  style = "frosted",
  navItems = [],
  cta = "default",
  hideCurrentPage = true,
}: HeaderProps) {

  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isFrosted = style === "frosted";

  useEffect(() => {
    if (!isFrosted) return;
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [isFrosted]);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname, location.hash]);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  const isLanding = isFrosted && location.pathname === '/';

  const navBg = isLanding
    ? scrolled
      ? 'bg-slate-900/70 backdrop-blur-md border-white/10'
      : 'bg-slate-900 border-transparent'
    : isFrosted
      ? scrolled
        ? 'bg-body/90 backdrop-blur-md border-sage-border shadow-soft'
        : 'bg-body border-transparent'
      : 'bg-body border-sage-border';

  const textColor = isLanding
    ? 'text-white/80 hover:text-white'
    : 'text-slate-600 hover:text-sage-600';

  const logoText = isLanding ? 'text-white' : 'text-slate-900';
  const logoIcon = isLanding ? 'text-sage-400' : 'text-sage-600';

  const hamburgerColor = isLanding ? 'text-white' : 'text-slate-700';

  const filteredNavItems = navItems.filter((link) => {
    if (hideCurrentPage && link.to && location.pathname === link.to) return false;
    return true;
  });

  const renderNavLink = (link: NavItem, mobile = false) => {
    const isActive = link.to ? location.pathname === link.to : false;

    const baseClass = mobile
      ? `block py-3 text-base font-medium transition-colors ${isActive ? 'text-sage-600' : 'text-slate-700 hover:text-sage-600'}`
      : isActive
        ? `text-sm font-semibold transition-colors duration-300 ${isLanding ? 'text-white underline underline-offset-4 decoration-white/40' : 'text-sage-700 underline underline-offset-4 decoration-sage-300'}`
        : `text-sm font-medium transition-colors duration-300 ${textColor}`;

    const backClass = mobile
      ? "flex items-center gap-1.5 py-3 text-base font-medium text-slate-500 hover:text-sage-600 transition-colors"
      : `flex items-center gap-1.5 text-sm font-medium transition-colors duration-300 ${isLanding ? 'text-white/60 hover:text-white' : 'text-slate-400 hover:text-sage-600'}`;

    if (link.href) {
      const isCrossPage = link.href.startsWith("/");
      return (
        
          key={link.label}
          href={link.href}
          onClick={(e) => {
            e.preventDefault();
            if (mobile) closeMobile();
            if (isCrossPage) {
              window.location.href = link.href!;
            } else {
              scrollToHash(link.href!);
              window.history.pushState(null, "", link.href);
            }
          }}
          className={link.isBack ? backClass : baseClass}
        >
          {link.isBack && <ArrowLeft className="w-3.5 h-3.5 shrink-0" />}
          {link.label}
        </a>
      );
    }

    if (link.to) {
      if (link.isBack) {
        return (
          <Link
            key={link.label}
            to={link.to}
            onClick={mobile ? closeMobile : undefined}
            className={backClass}
          >
            <ArrowLeft className="w-3.5 h-3.5 shrink-0" />
            {link.label}
          </Link>
        );
      }

      return (
        <Link
          key={link.label}
          to={link.to}
          onClick={mobile ? closeMobile : undefined}
          className={baseClass}
        >
          {isActive && !mobile && <span className="sr-only">(current page)</span>}
          {link.label}
        </Link>
      );
    }

    return null;
  };

  return (
    <>
      <nav className={`sticky top-0 z-50 border-b transition-all duration-300 ${navBg}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

          <Link
            to="/"
            onClick={(e) => {
              if (location.pathname === "/") {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
                window.history.pushState(null, "", "/");
              }
            }}
            className="flex items-center gap-2"
          >
            <Heart className={`w-6 h-6 ${logoIcon} transition-colors duration-300`} />
            <span className={`text-lg font-bold ${logoText} transition-colors duration-300`}>
              OSIRIS YOGA THERAPY
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {filteredNavItems.map((link) => renderNavLink(link))}

            {cta !== "none" && CTA_CONFIG[cta] && (
              CTA_CONFIG[cta].href ? (
                <a
                  href={CTA_CONFIG[cta].href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 bg-sage-600 text-white rounded-full text-sm font-semibold hover:bg-sage-500 transition-colors"
                >
                  {CTA_CONFIG[cta].label}
                </a>
              ) : (
                <Link
                  to={CTA_CONFIG[cta].to!}
                  className="px-5 py-2.5 bg-sage-600 text-white rounded-full text-sm font-semibold hover:bg-sage-500 transition-colors"
                >
                  {CTA_CONFIG[cta].label}
                </Link>
              )
            )}
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={`md:hidden p-2 -mr-2 ${hamburgerColor} transition-colors`}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

        </div>
      </nav>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={closeMobile} />
          <div className="absolute top-16 left-0 right-0 bg-white border-b border-stone-200 shadow-xl max-h-[calc(100vh-4rem)] overflow-y-auto animate-fade-in">
            <div className="px-6 py-4 space-y-1">
              {filteredNavItems.map((link) => renderNavLink(link, true))}

              {cta !== "none" && CTA_CONFIG[cta] && (
                <div className="pt-4 mt-2 border-t border-stone-200">
                  {CTA_CONFIG[cta].href ? (
                    <a
                      href={CTA_CONFIG[cta].href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={closeMobile}
                      className="block w-full text-center px-5 py-3 bg-sage-600 text-white rounded-lg text-sm font-semibold hover:bg-sage-500 transition-colors"
                    >
                      {CTA_CONFIG[cta].label}
                    </a>
                  ) : (
                    <Link
                      to={CTA_CONFIG[cta].to!}
                      onClick={closeMobile}
                      className="block w-full text-center px-5 py-3 bg-sage-600 text-white rounded-lg text-sm font-semibold hover:bg-sage-500 transition-colors"
                    >
                      {CTA_CONFIG[cta].label}
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
