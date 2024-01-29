import React, { useEffect } from "react";
import "./Modal.scss";
import classNames from "classnames";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
import { createPortal } from "react-dom";

type ModalProps = {
  show: boolean;
  children: React.ReactNode;
};

function Modal({ show, children }: ModalProps) {
  useEffect(() => {
    if (show) {
      disableBodyScroll(document.querySelector(".container") as HTMLElement);
    } else {
      enableBodyScroll(document.querySelector(".container") as HTMLElement);
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
