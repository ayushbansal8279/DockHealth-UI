import React from 'react';
import { useSelector } from 'react-redux';
import { Typography } from '@mui/material';
import Button from 'components/common/Button/Button';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import Spacing from 'components/common/Spacing';
import { getCustomerTypeLabel } from 'helpers/customer-type-helper';
import DownArrow from 'img/modals/down-arrow.svg';
import { userProfileSelector } from 'selectors/user-selectors';
import { redTheme } from '../../themes/red-theme';

import {
  ModalWrapper,
  ModalMainIcon,
  ModalIconContainer,
  ModalDescriptionContainer,
  ButtonsContainer,
  FlexButtonWrapper,
  FixedWidthButtonWrapper,
} from '../styled';

const InterruptEditModal = ({ closeModal, confirm, profileTypeName = null }) => {
  const currentUser = useSelector(userProfileSelector);
  const customerTypeLabel = getCustomerTypeLabel(currentUser);

  return (
    <MuiThemeProvider theme={redTheme}>
      <ModalWrapper>
        <ModalIconContainer>
          <ModalMainIcon src={DownArrow} alt="Task" />
          <Typography variant="body1">
            YOU HAVE UNSAVED CHANGES TO THE {profileTypeName ?? customerTypeLabel.toUpperCase()}
            &apos;S PROFILE
          </Typography>
        </ModalIconContainer>
        <ModalDescriptionContainer />
        <ButtonsContainer>
          <FlexButtonWrapper>
            <Button
              fullWidth
              variant="secondary-red"
              size="small"
              onClick={closeModal}
            >
              DON’T SAVE
            </Button>
          </FlexButtonWrapper>
          <Spacing horizontal={4} />
          <FixedWidthButtonWrapper width={231}>
            <Button
              fullWidth
              variant="primary-red"
              size="small"
              onClick={confirm}
            >
              SAVE CHANGES
            </Button>
          </FixedWidthButtonWrapper>
        </ButtonsContainer>
      </ModalWrapper>
    </MuiThemeProvider>
  );
};

export default InterruptEditModal;
