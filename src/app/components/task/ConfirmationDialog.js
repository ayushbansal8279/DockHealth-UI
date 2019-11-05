import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import Grid from '@material-ui/core/Grid';
import React from 'react';
import styled from 'styled-components';
import { withStyles } from '@material-ui/core';

const StyledDialogGrid = styled(Grid)`
  && {
    overflow: hidden;
    padding: 32px 24px;
    position: relative;
  }
`;

const StyledTitle = styled.div`
  && {
    color: #4a4a4a;
    font-size: 30px;
    text-align: center;
  }
`;

const StyledContent = styled.div`
  && {
    color: #4a4a4a;
    font-size: 20px;
    text-align: center;
  }
`;

const StyledCloseButton = styled.button`
  && {
    color: #ababb2;
    cursor: pointer;
    font-size: 42px;
    line-height: 42px;
    height: 42px;
    position: absolute;
    right: 20px;
    top: 20px;
    width: 42px;
  }
`;

const StyledCompleteButton = withStyles({
  root: {
    backgroundColor: '#007cab',
    borderRadius: 4,
    boxShadow: 'none',
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    textTransform: 'none',
    height: 50,
    marginTop: 8,
    padding: '6px 24px',
    transition: 'filter 0.15s linear',
    '&:hover': {
      backgroundColor: '#007cab',
      filter: 'brightness(1.25)',
    },
  },
})(Button);

export default ({ isOpen, close, confirm }) => (
  <Dialog
    open={isOpen}
    onClose={close}
    aria-labelledby="alert-dialog-title"
    aria-describedby="alert-dialog-description"
    maxWidth="sm"
    fullWidth
  >
    <StyledDialogGrid container spacing={24}>
      <StyledCloseButton onClick={close}>&times;</StyledCloseButton>
      <Grid item xs={12}>
        <StyledTitle id="alert-dialog-title">
          A subtask is incomplete
        </StyledTitle>
      </Grid>
      <Grid item xs={12}>
        <StyledContent>
          You’re about to complete a primary task which has a subtask that is
          incomplete. Marking the primary task as complete will also complete
          all subtasks.
        </StyledContent>
      </Grid>
      <Grid item xs={12}>
        <StyledContent>Would you like to proceed?</StyledContent>
      </Grid>
      <Grid item xs={12} container justify="center">
        <StyledCompleteButton onClick={confirm} variant="contained" autoFocus>
          Yes, complete all
        </StyledCompleteButton>
      </Grid>
    </StyledDialogGrid>
  </Dialog>
);
