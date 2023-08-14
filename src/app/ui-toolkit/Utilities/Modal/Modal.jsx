import ReactDOM from 'react-dom';
import React from 'react';
import { noop } from 'ui-toolkit/utilities';
import * as Sc from './styled';

export default function Modal({
  open = false,
  onClose = noop,
  onClickAway = noop,
  children,
}) {
  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget) {
      onClickAway(event);
      onClose(event);
    } else {
      event.stopPropagation();
    }
  };

  if (open) {
    return ReactDOM.createPortal(
      <Sc.Backdrop
        data-component="[ui-toolkit/Modal]"
        onClick={handleBackdropClick}
      >
        {children}
      </Sc.Backdrop>,
      document.body,
    );
  }
  return null;
}
