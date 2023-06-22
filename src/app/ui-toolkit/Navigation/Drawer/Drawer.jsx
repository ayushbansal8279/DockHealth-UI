import React from 'react';
import { noop } from 'ui-toolkit/utilities';
import Modal from 'ui-toolkit/Utilities/Modal/Modal';
import * as Sc from './styled';


export default function Drawer({
  open = false,
  onClose = noop,
  children
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
    >
      <Sc.Drawer
        data-component="[ui-toolkit/Drawer]"
      >
        {children}
      </Sc.Drawer>
    </Modal>
  );
}