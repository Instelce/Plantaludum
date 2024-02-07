import "./SingleImage.scss";
import { ImageType } from "../../../../services/api/types/images";
import { HTMLAttributes, PropsWithChildren } from "react";
import classNames from "classnames";
import Image, {AsyncImage} from "../../../Atoms/Image/Image";

type SingleImageProps = {
  image: ImageType;
  size?: number;
  isClickable?: boolean;
} & PropsWithChildren &
  HTMLAttributes<HTMLDivElement>;

function Root({
  image,
  size = undefined,
  isClickable = false,
  children,
  onClick,
  ...props
}: SingleImageProps) {
  return (
    <div
      {...props}
      className={classNames(
        "single-image",
        { "is-clickable": isClickable },
        props.className,
      )}
      style={{ width: size ? `${size}rem` : "auto" }}
    >
      <div className="img-container" onClick={onClick}>
        <AsyncImage src={image.url} alt={`Par ${image.author}`} isAbsolute />
      </div>
      {children}
    </div>
  );
}

type PartsProps = {
  paddingHorizontal?: number;
  paddingVertical?: number;
} & PropsWithChildren &
  HTMLAttributes<HTMLDivElement>;

function Up({
  paddingHorizontal = 0,
  paddingVertical = 0,
  children,
  ...props
}: PartsProps) {
  return (
    <div
      {...props}
      className={classNames("up", props.className)}
      style={{ left: `${paddingHorizontal}rem`, top: `${paddingVertical}rem` }}
    >
      {children}
    </div>
  );
}

function Down({
  paddingHorizontal = 0,
  paddingVertical = 0,
  children,
  ...props
}: PartsProps) {
  return (
    <div
      {...props}
      className={classNames("down", props.className)}
      style={{
        left: `${paddingHorizontal}rem`,
        bottom: `${paddingVertical}rem`,
      }}
    >
      {children}
    </div>
  );
}

export default {
  Root: Root,
  Up: Up,
  Down: Down,
};
