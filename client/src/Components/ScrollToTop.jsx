// ScrollToTop.jsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to top when route changes
    window.scrollTo(0, 0);

    // Additional measures to prevent scroll restoration
    if (history.scrollRestoration) {
      history.scrollRestoration = "manual";
    }
  }, [pathname]);

  return null;
};

export default ScrollToTop;
