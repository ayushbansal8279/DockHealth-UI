import React from 'react';
import { Box } from '@material-ui/core';
import { Container, TasksText, CloseButton, CloseIcon } from './styled';

const BulkEditBar = props => {
  const { numberOfSelectedTasks, isDisabled, onClose, children } = props;
  return (
    <Container>
      <TasksText>
        {`${numberOfSelectedTasks} Task${
          numberOfSelectedTasks > 1 ? 's' : ''
        } Selected`}
      </TasksText>
      <Box display="flex" height="100%">
        {children}
        <CloseButton type="button" onClick={onClose} disabled={isDisabled}>
          <CloseIcon />
        </CloseButton>
      </Box>
    </Container>
  );
};

export default BulkEditBar;
