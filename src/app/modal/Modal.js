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
  const { modalProps, modalName, isOpen } = modal;
  const { closeModal } = restProps;

  const handleCloseModal = () => {
    closeModal();
    if (typeof modalProps.onClose === 'function') modalProps.onClose();
  };

  const ModalComponent = MODAL_MAP[modalName];
  if (!ModalComponent) return null;

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={handleCloseModal}
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
