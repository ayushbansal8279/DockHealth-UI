import React from 'react';
import DeleteConfirmationModal from '../DeleteConfirmationModal/DeleteConfirmationModal';

const DeleteTaskConfirmationModal = (props) => {
  const { isSubtask, ...restProps } = props;

  const title = `Delete ${isSubtask ? 'SUB' : ''}task`;
  const description = `Are you sure you want to delete this ${
    isSubtask ? 'sub' : ''
  }task? This action cannot be undone.`;

  return (
    <DeleteConfirmationModal
      title={title}
      description={description}
      {...restProps}
    />
  );
};

export default DeleteTaskConfirmationModal;
