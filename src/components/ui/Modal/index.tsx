import React, { Children, useEffect } from "react";
import "./style.scss";
import classNames from "classnames";
import Button from "../Buttons/Button";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
import { createPortal } from "react-dom";

type ModalProps = {
  show: boolean;
  children: React.ReactNode;
}

function Modal({ show, children}: ModalProps) {
  useEffect(() => {
    if (show) {
      disableBodyScroll(document.querySelector(".container"));
    } else {
      enableBodyScroll(document.querySelector(".container"));
    }
  }, [show]);

  return createPortal(
    <div className={classNames("modal-container", { show: show })}>
      <div className="modal">
        <div className="modal-content">{children}</div>
      </div>
    </div>,
    document.body,
  );
}

export default Modal;
