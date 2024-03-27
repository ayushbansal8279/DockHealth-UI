import React from 'react';
import { Typography } from '@mui/material';
import Button from 'components/common/Button/Button';
import Spacing from 'components/common/Spacing';
import DeleteIcon from '@mui/icons-material/Delete';
import spacing from 'styles/spacing';
import {
  ModalWrapper,
  ModalIconContainer,
  ModalDescriptionContainer,
  ButtonsContainer,
  FlexButtonWrapper,
} from './styled';

interface Props {
  closeModal: VoidFunction;
  confirm: VoidFunction;
}

export default function DeleteOrganizationModal({
  closeModal,
  confirm,
}: Props) {
  return (
    <ModalWrapper>
      <ModalIconContainer>
        <DeleteIcon fontSize="large" color="error" sx={{ mb: spacing.large }} />
        <Typography color="textSecondary" variant="h2">
          DELETE ORGANIZATION
        </Typography>
      </ModalIconContainer>
      <ModalDescriptionContainer>
        <Typography variant="body1">
          You’re about to delete this Organization and will lose all data
          related to this Organization.
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
            Cancel
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
            Delete
          </Button>
        </FlexButtonWrapper>
      </ButtonsContainer>
    </ModalWrapper>
  );
}
