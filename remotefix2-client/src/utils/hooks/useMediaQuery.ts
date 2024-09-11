import { useEffect, useState } from "react";

const useMediaQuery = (query: string): boolean => {
  const [queryMatches, setQueryMatches] = useState<boolean>(false);

  useEffect(() => {
    const updateMatch = (event: MediaQueryListEvent) => {
      setQueryMatches(event.matches);
    };

    const mediaQueryList = window.matchMedia(query);
    setQueryMatches(mediaQueryList.matches);
    
    mediaQueryList.addEventListener("change", updateMatch);

    return () => {
      mediaQueryList.removeEventListener("change", updateMatch);
    };
  }, [query]);

  return queryMatches;
};

export default useMediaQuery;