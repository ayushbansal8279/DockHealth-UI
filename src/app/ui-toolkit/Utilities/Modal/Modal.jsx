import ReactDOM from 'react-dom';
import React from 'react';
import { noop } from 'ui-toolkit/utilities';
import * as Sc from './styled';

export default function Modal({
  open = false,
  onClose = noop,
  children
}) {
  const handleClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose(event)
    } else {
      event.stopPropagation();
    }
  }

  if (open) {
    return ReactDOM.createPortal((
      <Sc.Backdrop
        data-component="[ui-toolkit/Modal]"
        onClick={handleClick}
      >
        {children}
      </Sc.Backdrop>
    ), document.body)
  } else {
    return null;
  }
}