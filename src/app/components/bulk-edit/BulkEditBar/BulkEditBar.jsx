import React from 'react';
import { Container, TasksText, CloseButton, CloseIcon } from './styled';

const BulkEditBar = (props) => {
  const {
    numberOfSelectedItems,
    onClose,
    children,
    viewType = 'task',
    isDisabled,
    includedWorkflow,
  } = props;

  const getLabel = () => {
    if (viewType === 'user') return 'User';
    if (viewType === 'patient') return 'Patient';
    if (viewType === 'task') return `Task${includedWorkflow ? '/Workflow' : ''}`;
    return '';
  };

  const pluralize = (word, count) => `${word}${count !== 1 ? 's' : ''}`;

  const label = getLabel();

  return (
    <Container>
      <TasksText>
        {`${numberOfSelectedItems} ${pluralize(label, numberOfSelectedItems)} Selected`}
      </TasksText>
      {children}
      <CloseButton type="button" onClick={onClose} isDisabled={isDisabled}>
        <CloseIcon />
      </CloseButton>
    </Container>
  );
};

export default BulkEditBar;
