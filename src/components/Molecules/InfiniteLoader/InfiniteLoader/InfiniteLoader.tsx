import "./InfiniteLoader.scss";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";

type InfiniteLoaderProps = {
  message: string;
  hasNextPage: boolean;
  fetchNextPage: () => void;
};

function InfiniteLoader({
  message,
  hasNextPage,
  fetchNextPage,
}: InfiniteLoaderProps) {
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView]);

  if (hasNextPage) {
    return (
      <div className="infinite-loader" ref={ref}>
        <p>{message}</p>
      </div>
    );
  }

  return null;
}

export default InfiniteLoader;
