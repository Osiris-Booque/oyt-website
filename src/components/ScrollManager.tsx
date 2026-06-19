import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

function scrollToHash(hash: string, retries = 6, delay = 125) {
  const element = document.querySelector(hash);
  if (element) {
    element.scrollIntoView({ behavior: "smooth", block: "start" });
  } else if (retries > 0) {
    setTimeout(() => scrollToHash(hash, retries - 1, delay), delay);
  }
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
