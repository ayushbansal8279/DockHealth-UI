import React from 'react';
import ConfirmationDialog from '../modals/ConfirmationDialog';

export default ({ isOpen, close, confirm }) => (
  <ConfirmationDialog 
    isOpen={isOpen}
    close={close}
    confirm={confirm}
    title="A subtask is incomplete"
    message="You're about to complete a primary task which has a subtask that is incomplete. Marking the primary task as complete will also complete all subtasks."
    confirmButtonTitle="Yes, complete all"
    />
);
