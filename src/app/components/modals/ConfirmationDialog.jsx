import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import React from 'react';
import styled from 'styled-components';

import NoOverflowDialog from '../common/NoOverflowDialog';

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

export default ({
  isOpen,
  close,
  confirm,
  title,
  message,
  confirmButtonTitle,
}) => (
  <NoOverflowDialog
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
        <StyledTitle id="alert-dialog-title">{title}</StyledTitle>
      </Grid>
      <Grid item xs={12}>
        <StyledContent>{message}</StyledContent>
      </Grid>
      <Grid item xs={12}>
        <StyledContent>Would you like to proceed?</StyledContent>
      </Grid>
      <Grid item xs={12} container justify="center">
        <Button onClick={confirm} variant="contained">
          {confirmButtonTitle}
        </Button>
      </Grid>
    </StyledDialogGrid>
  </NoOverflowDialog>
);
