import {useEffect, useState} from "react";


function useCacheImages() {
  const [isLoading, setIsLoading] = useState(false)
  const [imagesArray, setImagesArray] = useState(null)

  const promises = imagesArray?.map(src => {
    return new Promise((resolve, reject) => {
      const img = new Image();

      img.src = src;
      img.onload = resolve();
      img.onerror = reject();
    })
  })

  useEffect(() => {
    console.log(imagesArray)
    if (imagesArray) {
      setIsLoading(() => true)

      Promise.all(promises)
        .then(() => {
          setIsLoading(() => false)
        })
    }
  }, [imagesArray]);

  return { isLoading: isLoading, setImagesArray: setImagesArray };
}

export default useCacheImages;