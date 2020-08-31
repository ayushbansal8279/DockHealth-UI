import React from 'react';
import { Typography } from '@material-ui/core';
import Button from 'components/common/Button/Button';
import { MuiThemeProvider } from '@material-ui/core/styles';
import Spacing from 'components/common/Spacing';
import Folder from 'img/modals/folder';
import { redTheme } from '../../themes/red-theme';

import {
  ModalWrapper,
  ModalMainIcon,
  ModalIconContainer,
  ModalDescriptionContainer,
  ButtonsContainer,
  FixedWidthButtonWrapper,
} from '../styled';

const DeleteGroupModal = ({ closeModal, confirm }) => {
  return (
    <MuiThemeProvider theme={redTheme}>
      <ModalWrapper>
        <ModalIconContainer>
          <ModalMainIcon src={Folder} alt="Task Group" />
          <Typography color="textPrimary" variant="h2">
            DELETE GROUP
          </Typography>
        </ModalIconContainer>
        <ModalDescriptionContainer>
          <Typography variant="body1">
            Are you sure you want to delete this group? If you delete this group
            and there are tasks within the group, the tasks will not be deleted.
          </Typography>
        </ModalDescriptionContainer>
        <ButtonsContainer>
          <FixedWidthButtonWrapper width={160}>
            <Button
              fullWidth
              color="red"
              size="small"
              variant="outlined"
              type="button"
              onClick={closeModal}
            >
              Do not delete
            </Button>
          </FixedWidthButtonWrapper>
          <Spacing horizontal={4} />
          <FixedWidthButtonWrapper width={88}>
            <Button
              fullWidth
              color="red"
              size="small"
              variant="contained"
              type="button"
              onClick={confirm}
            >
              Yes
            </Button>
          </FixedWidthButtonWrapper>
        </ButtonsContainer>
      </ModalWrapper>
    </MuiThemeProvider>
  );
};

export default DeleteGroupModal;
