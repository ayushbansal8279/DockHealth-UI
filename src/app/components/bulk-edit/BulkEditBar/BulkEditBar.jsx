import React from 'react';
import { Container, TasksText, CloseButton, CloseIcon } from './styled';

const BulkEditBar = (props) => {
  const {
    numberOfSelectedItems,
    onClose,
    children,
    patientView,
    isDisabled,
    includedWorkflow,
  } = props;
  return (
    <Container>
      <TasksText>
        {`${numberOfSelectedItems} ${
          patientView ? `Patient` : `Task${includedWorkflow ? '/Workflow' : ''}`
        }${numberOfSelectedItems > 1 ? 's' : ''} Selected`}
      </TasksText>
      {children}
      <CloseButton type="button" onClick={onClose} isDisabled={isDisabled}>
        <CloseIcon />
      </CloseButton>
    </Container>
  );
};

export default BulkEditBar;
