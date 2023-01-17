import React from 'react';
import { connect } from 'react-redux';
import ReactModal from 'react-modal';

import {
  openModal as openModalAction,
  closeModal as closeModalAction,
} from './actions';
import MODAL_MAP from './map';
import './styled.css';

const Modal = ({ modal, ...restProps }) => {
  const { modalProps = {}, modalName, isOpen } = modal;
  const { closeModal } = restProps;
  const { closeOnClickBackground = true } = modalProps;

  const handleCloseBackgroundModal = () => {
    if (closeOnClickBackground) closeModal();
    if (typeof modalProps?.onClose === 'function') modalProps.onClose();
  };

  const handleCloseModal = event => {
    closeModal(event);
    if (typeof modalProps?.onClose === 'function') modalProps.onClose(event);
  };

  const ModalComponent = MODAL_MAP[modalName];
  if (!ModalComponent) return null;

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={handleCloseBackgroundModal}
      overlayClassName="modal-overlay"
      className="modal-content"
      {...restProps}
    >
      <ModalComponent
        {...modalProps}
        {...restProps}
        closeModal={handleCloseModal}
      />
    </ReactModal>
  );
};

const mapStateToProps = store => ({
  modal: store.modal,
});

const mapDispatchToProps = {
  openModal: openModalAction,
  closeModal: closeModalAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(Modal);
