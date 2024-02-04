import "./SingleImage.scss"
import {ImageType} from "../../../../services/api/types/images";
import {PropsWithChildren} from "react";
import classNames from "classnames";

type SingleImageProps = {
  image: ImageType,
  isClickable?: boolean
} & PropsWithChildren

function Root({image, isClickable = false, children}: SingleImageProps) {
  return (
    <div className={classNames("single-image", {"is-clickable": isClickable})}>
      <div className="img-container">
        <img src={image.url} alt={`Par ${image.author}`}/>
      </div>
      {children}
    </div>
  )
}

function Up({children}: PropsWithChildren) {
    return (
      <div className="up">
        {children}
      </div>
    )
}

function Down({children}: PropsWithChildren) {
    return (
      <div className="down">
          {children}
      </div>
    )
}

export default {
    Root: Root,
    Up: Up,
    Down: Down
};