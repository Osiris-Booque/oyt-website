import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

function scrollToHash(hash: string) {
  const element = document.querySelector(hash);
  if (!element) return;

  element.scrollIntoView({ behavior: "smooth", block: "start" });
}

export { scrollToHash };

export default function ScrollManager() {
  const { pathname, hash } = useLocation();

  useLayoutEffect(() => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }

    if (hash) {
      scrollToHash(hash);
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }
  }, [pathname, hash]);

  return null;
}