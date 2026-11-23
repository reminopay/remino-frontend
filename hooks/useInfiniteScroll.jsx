import { useEffect, useState, useRef, useCallback } from "react";

export const useInfiniteScroll = (fetchDataFunc, hasMoreItems) => {
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const observer = useRef();

  const fetchItems = async () => {
    /**
     * execute the function for fetching data and handling the loading state
     * It does not take any parameters
     * @return {void}
     */
    setLoading(true);
    await fetchDataFunc(page);
    setLoading(false);
  };

  useEffect(() => {
    fetchItems();
  }, [page]);

  const lastElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMoreItems) {
          setPage((prevPage) => prevPage + 1); // Fetch next page
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMoreItems],
  );

  return { loading, lastElementRef };
};
