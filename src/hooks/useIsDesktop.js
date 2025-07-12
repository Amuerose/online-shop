import { useState, useEffect } from "react";

export default function useIsDesktop(breakpoint = 1024) {
  const getIsDesktop = () =>
    typeof window !== "undefined" ? window.innerWidth >= breakpoint : false;

  const [isDesktop, setIsDesktop] = useState(getIsDesktop);

  useEffect(() => {
    const handleResize = () => {
      const current = getIsDesktop();
      setIsDesktop(prev => (prev !== current ? current : prev));
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);

    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
    };
  }, [breakpoint]);

  return isDesktop;
}