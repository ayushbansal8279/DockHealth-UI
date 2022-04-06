import React from 'react';
import { Box } from '@material-ui/core';
import { Container, TasksText, CloseButton, CloseIcon } from './styled';

const BulkEditBar = props => {
  const {
    numberOfSelectedItems,
    onClose,
    children,
    patientView,
  } = props;
  return (
    <Container>
      <TasksText>
        {`${numberOfSelectedItems} ${patientView ? `Patient` : `Task`}${numberOfSelectedItems > 1 ? 's' : ''
          } Selected`}
      </TasksText>
      <Box display="flex" height="100%">
        {children}
        <CloseButton type="button" onClick={onClose} >
          <CloseIcon />
        </CloseButton>
      </Box>
    </Container>
  );
};

export default BulkEditBar;
