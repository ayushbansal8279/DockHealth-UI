import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FormControlLabel, Radio, RadioGroup, TextField } from '@mui/material';
import moment from 'moment';
import { openModal } from 'modal/actions';
import {
  ModalWrapper,
  CloseIconButton,
  CloseIcon,
  ButtonsContainer,
} from '../styled';
import {
  ModalTitle,
  ModalIntroText,
  InfoBox,
  InfoBoxText,
  ReasonsContainer,
  ReasonLabel,
  AdditionalFeedbackContainer,
  InfoBoxTextBold,
  AdditionalFeedbackLabel,
} from './styled';
import { CancelButton, ConfirmButton } from '../ModalButton/ModalButtons';
import Spacing from '@/app/components/common/Spacing';
import { fontWeights } from '@/app/styles/font';
import { userProfileSelector } from '@/app/selectors/user-selectors';
import { cancelSubscription } from '@/app/actions/organization-actions';
import { getSubscriptionEndInfo } from '@/app/helpers/subscription-helper';

const CANCELLATION_REASONS = [
  'Too expensive',
  'Not using Dock enough',
  'Found a better alternative',
  'Missing features I need',
  'Technical issues',
  'Other',
];

const CancelSubscriptionModal = ({
  closeModal,
  subscriptionDetails,
  nextBillingDate,
  subscriptionPlanName,
}) => {
  const dispatch = useDispatch();
  const [selectedReason, setSelectedReason] = useState('');
  const [additionalFeedback, setAdditionalFeedback] = useState('');
  const { organizationIdentifier } = useSelector(userProfileSelector);

  // Calculate days remaining and cancellation date
  const { daysRemaining } = getSubscriptionEndInfo(nextBillingDate);
  const cancellationDate = moment(nextBillingDate).format('MM/DD/YYYY');

  const handleConfirmCancel = useCallback(() => {
    dispatch(
      cancelSubscription(organizationIdentifier, {
        cancellationReason: selectedReason,
        cancellationDetails:
          selectedReason === 'Other' ? additionalFeedback : '',
        cancelImmediately: false,
      }),
    );
  }, [dispatch, organizationIdentifier, selectedReason, additionalFeedback]);

  const handleContinueCancel = () => {
    closeModal();
    dispatch(
      openModal('CancelSubscriptionConfirmation', {
        subscriptionDetails,
        nextBillingDate,
        subscriptionPlanName,
        cancellationReason: selectedReason,
        additionalFeedback:
          selectedReason === 'Other' ? additionalFeedback : '',
        onConfirmCancel: handleConfirmCancel,
      }),
    );
  };

  const showAdditionalFeedback = selectedReason === 'Other';

  return (
    <ModalWrapper width="540px">
      <CloseIconButton onClick={closeModal} size="small" color="secondary">
        <CloseIcon />
      </CloseIconButton>

      <ModalTitle>Cancel Your Subscription</ModalTitle>
      <ModalIntroText>
        We're sorry to see you go. Please let us know why you're canceling
      </ModalIntroText>

      <InfoBox>
        <InfoBoxText bold>
          You have {daysRemaining} days remaining on your{' '}
          {subscriptionPlanName || 'Subscription'}.
        </InfoBoxText>
        <InfoBoxText>
          Your subscription will remain active until{' '}
          <InfoBoxTextBold>{cancellationDate}</InfoBoxTextBold>.
        </InfoBoxText>
        <InfoBoxText>
          After the cancelation date listed above, your data will be recoverable
          for 30 days, then permanently deleted.
        </InfoBoxText>
      </InfoBox>

      <ReasonsContainer>
        <ReasonLabel>Why are you canceling</ReasonLabel>
        <RadioGroup
          value={selectedReason}
          onChange={(e) => setSelectedReason(e.target.value)}
        >
          {CANCELLATION_REASONS.map((reason) => (
            <FormControlLabel
              key={reason}
              value={reason}
              control={<Radio />}
              label={reason}
              sx={{
                '& .MuiFormControlLabel-label': {
                  fontSize: '18px',
                  fontWeight: fontWeights.light,
                  fontFamily: 'Outfit',
                  fontStyle: 'regular',
                },
              }}
            />
          ))}
        </RadioGroup>
      </ReasonsContainer>

      {showAdditionalFeedback && (
        <>
          <AdditionalFeedbackContainer>
            <AdditionalFeedbackLabel>
              Additional feedback
            </AdditionalFeedbackLabel>
            <TextField
              fullWidth
              multiline
              rows={2}
              placeholder="Tell us more about your experience..."
              value={additionalFeedback}
              onChange={(e) => setAdditionalFeedback(e.target.value)}
              variant="outlined"
            />
          </AdditionalFeedbackContainer>
        </>
      )}

      <ButtonsContainer>
        <CancelButton style={{ width: '280px' }} onClick={closeModal}>
          Keep Subscription
        </CancelButton>
        <Spacing horizontal={4} />
        <ConfirmButton
          style={{ width: '280px' }}
          onClick={handleContinueCancel}
          disabled={!selectedReason}
        >
          Continue to cancel
        </ConfirmButton>
      </ButtonsContainer>
    </ModalWrapper>
  );
};

export default CancelSubscriptionModal;
