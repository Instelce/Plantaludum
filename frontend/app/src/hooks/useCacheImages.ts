import { useEffect, useState } from "react";

function useCacheImages() {
  const [isLoading, setIsLoading] = useState(false);
  const [imagesArray, setImagesArray] = useState<string[] | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadImages = async () => {
      if (imagesArray && imagesArray.length > 0) {
        setIsLoading(true);

        try {
          await Promise.all(
            imagesArray.map((src: string) => {
              new Promise((resolve, reject) => {
                const image = new Image();

                image.src = src;
                image.onload = resolve;
                image.onerror = reject;
              });
            }),
          );
        } catch (error) {
          console.error("Error loading images: ", error);
        }
      }
    };

    loadImages();

    if (isMounted) {
      setIsLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [imagesArray]);

  return { isLoading: isLoading, setImagesArray: setImagesArray };
}

export default useCacheImages;
