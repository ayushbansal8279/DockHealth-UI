import React from 'react';
import moment from 'moment';
import {
  ModalWrapper,
  CloseIconButton,
  CloseIcon,
  ButtonsContainer,
} from '../styled';
import {
  WarningText,
  DataRetentionText,
  DataRetentionContainer,
  DataRetentionTitle,
} from './styled';
import { ModalTitle, ModalIntroText } from '../CancelSubscriptionModal/styled';
import { CancelButton, ConfirmButton } from '../ModalButton/ModalButtons';
import Spacing from '@/app/components/common/Spacing';

const CancelSubscriptionConfirmationModal = ({
  closeModal,
  nextBillingDate,
  subscriptionPlanName,
  onConfirmCancel,
}) => {
  const cancellationDate = moment(nextBillingDate).format('MM/DD/YYYY');
  const handleConfirmCancel = () => {
    if (onConfirmCancel) {
      onConfirmCancel();
    }
    closeModal();
  };

  return (
    <ModalWrapper width="540px">
      <CloseIconButton onClick={closeModal} size="small" color="secondary">
        <CloseIcon />
      </CloseIconButton>

      <ModalTitle>Are You Sure You Want To Cancel?</ModalTitle>
      <ModalIntroText>
        This action will cancel your subscription. You will retain access until
        the end of your billing period.
      </ModalIntroText>

      <WarningText>
        After {cancellationDate}, you will lose access to all{' '}
        {subscriptionPlanName || 'Basic'} features and your account will be
        downgraded.
      </WarningText>
      <DataRetentionContainer>
        <DataRetentionTitle>Data Retention:</DataRetentionTitle>
        <DataRetentionText>
          Your data will remain recoverable for 30 days after cancelation. After
          30 days, all data will be permanently deleted and cannot be recovered.
        </DataRetentionText>
      </DataRetentionContainer>

      <ButtonsContainer>
        <CancelButton style={{ width: '280px' }} onClick={closeModal}>
          Keep Subscription
        </CancelButton>
        <Spacing horizontal={4} />
        <ConfirmButton style={{ width: '280px' }} onClick={handleConfirmCancel}>
          Yes, Cancel Subscription
        </ConfirmButton>
      </ButtonsContainer>
    </ModalWrapper>
  );
};

export default CancelSubscriptionConfirmationModal;
