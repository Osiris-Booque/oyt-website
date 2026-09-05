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

/** Scroll to a section by id, offset for the fixed 4rem header. */
function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY;
  window.scrollTo({ top, behavior: "smooth" });
}

export { scrollToHash, scrollToSection };

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
