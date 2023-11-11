import React, {Children, useEffect} from "react";
import "./style.scss";
import classNames from "classnames";
import Button from "../Buttons/Button.jsx";
import {disableBodyScroll, enableBodyScroll} from "body-scroll-lock";
import {createPortal} from "react-dom";

function Modal({ show, setShow, children, closeButtonLabel= "Fermer" }) {

  useEffect(() => {
    if (show) {
      disableBodyScroll(document)
    } else {
      enableBodyScroll(document)
    }
  }, [show]);

  return createPortal(
    <div className={classNames("modal-container", { show: show })}>
      <div className="modal">
        <div className="modal-content">{children}</div>
        <div className="modal-button">
          <Button label={closeButtonLabel} color="secondary" variant="solid" onClick={() => setShow(!show)} />
        </div>
      </div>
    </div>,
    document.body
  );
}

export default Modal;
