import "./Image.scss"
import {ImgHTMLAttributes, RefObject, useState} from "react";
import {InView} from "react-intersection-observer";
import classNames from "classnames";
import {Fade} from "transitions-kit";

type AsyncImageProps = {
  isAbsolute?: boolean
} & ImgHTMLAttributes<HTMLImageElement>

export function AsyncImage({isAbsolute, ...imageProps}: AsyncImageProps) {
  return (
    <InView triggerOnce>
      {({ref, inView}) => (
        <div ref={ref} className={classNames("async-image", {absolute: isAbsolute})}>
          <Image inView={inView} {...imageProps} />
        </div>
      )}
    </InView>
  )
}

type ImageProps = {
    inView: boolean;
} & ImgHTMLAttributes<HTMLImageElement>

function Image({inView, ...props}: ImageProps) {
    const [status, setStatus] = useState("loading")
  return (
    <>
      <Fade appear={false} in={status === "loading"} unmountOnExit>
        <div className="img-loading"></div>
      </Fade>
        {inView && (
          <Fade in={status === "loaded"}>
            <img {...props} onLoad={() => setStatus("loaded")}
                 onError={() => setStatus("error")}/>
          </Fade>
        )}
      <Fade appear={false} in={status === "error"} unmountOnExit>
        <div>Erreur lors du chargement</div>
      </Fade>
    </>
  )
}

export default Image;