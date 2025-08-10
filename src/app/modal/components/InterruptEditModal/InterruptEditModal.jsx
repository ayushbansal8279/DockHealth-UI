import React from 'react';
import { useSelector } from 'react-redux';
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
  ModalHeaderName,
} from '../styled';
import { CancelButton, ConfirmButton } from '../ModalButton/ModalButtons';

const InterruptEditModal = ({
  closeModal,
  confirm,
  profileTypeName = null,
}) => {
  const currentUser = useSelector(userProfileSelector);
  const customerTypeLabel = getCustomerTypeLabel(currentUser);

  return (
    <MuiThemeProvider theme={redTheme}>
      <ModalWrapper>
        <ModalIconContainer>
          <ModalMainIcon src={DownArrow} alt="Task" />
          <ModalHeaderName>
            You have unsaved changes to this{' '}
            {(profileTypeName ?? customerTypeLabel).toLowerCase()}
          </ModalHeaderName>
        </ModalIconContainer>
        <ModalDescriptionContainer />
        <ButtonsContainer>
          <CancelButton style={{ width: '180px' }} onClick={closeModal}>
            Don't Save
          </CancelButton>
          <Spacing horizontal={4} />
          <ConfirmButton style={{ width: '180px' }} onClick={confirm}>
            Save Changes
          </ConfirmButton>
        </ButtonsContainer>
      </ModalWrapper>
    </MuiThemeProvider>
  );
};

export default InterruptEditModal;
