

import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = hash.replace("#", "");
      
      const scrollToElement = () => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
          return true;
        }
        return false;
      };

      // Try scrolling immediately
      if (!scrollToElement()) {
        let count = 0;
        const interval = setInterval(() => {
          count++;
          const success = scrollToElement();
          if (success || count >= 50) {
            clearInterval(interval);
          }
        }, 100);
        return () => clearInterval(interval);
      }
    } else {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "instant",
      });
    }
  }, [pathname, hash]);

  return null;
}