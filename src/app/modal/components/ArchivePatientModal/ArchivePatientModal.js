import React from 'react';
import { useSelector } from 'react-redux';
import { Typography } from '@material-ui/core';
import Button from 'components/common/Button/Button';
import { MuiThemeProvider } from '@material-ui/core/styles';
import Spacing from 'components/common/Spacing';
import { getCustomerTypeLabel } from 'helpers/customer-type-helper';
import { capitalize } from 'helpers/capitalize';
import RedFolder from 'img/modals/red-folder';
import { userProfileSelector } from 'selectors/user-selectors';
import { redTheme } from '../../themes/red-theme';

import {
  ModalWrapper,
  ModalMainIcon,
  ModalIconContainer,
  ModalDescriptionContainer,
  ButtonsContainer,
  FlexButtonWrapper,
} from '../styled';

const ArchivePatientModal = ({ closeModal, confirm }) => {
  const currentUser = useSelector(userProfileSelector);
  const customerTypeLabel = getCustomerTypeLabel(currentUser);
  const customerTypeLabelCapitalized = capitalize(customerTypeLabel);

  return (
    <MuiThemeProvider theme={redTheme}>
      <ModalWrapper>
        <ModalIconContainer>
          <ModalMainIcon src={RedFolder} alt="red-folder" />
          <Typography color="textPrimary" variant="h2">
            Archive {customerTypeLabelCapitalized}
          </Typography>
        </ModalIconContainer>
        <ModalDescriptionContainer>
          <Typography variant="body1">
            Are you sure you want to archive this {customerTypeLabel}?
          </Typography>
        </ModalDescriptionContainer>
        <ButtonsContainer>
          <FlexButtonWrapper>
            <Button
              fullWidth
              variant="secondary-red"
              size="small"
              onClick={closeModal}
            >
              Do not archive
            </Button>
          </FlexButtonWrapper>
          <Spacing horizontal={4} />
          <FlexButtonWrapper>
            <Button
              fullWidth
              variant="primary-red"
              size="small"
              onClick={confirm}
            >
              Archive
            </Button>
          </FlexButtonWrapper>
        </ButtonsContainer>
      </ModalWrapper>
    </MuiThemeProvider>
  );
};

export default ArchivePatientModal;
