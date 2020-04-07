import { Grid } from '@material-ui/core';
import moment from 'moment';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { hashHistory } from 'react-router';
import { useMount } from 'react-use';
import styled from 'styled-components';
import { getBillingEstimate } from '../../../actions/organization-actions';
import Spacing from '../../../components/common/Spacing';
import palette from '../../../palette';
import { MontserratTypography } from '../../../theme-montserrat';
import { BILLING_FREQUENCY } from '../subscriptions/SubscriptionsView.Utilities';

const InformationContainer = styled.div`
  background-color: ${palette.coolGrey4};
  color: ${palette.midnightBlue};
  display: grid;
  font-size: 1rem;
  grid-gap: 0.5rem;
  grid-template-columns: 1fr auto;
  padding: 1rem;
  width: 100%;
`;

const InformationInnerContainer = styled.div`
  justify-content: flex-end;
  display: flex;
  flex-direction: column;
`;

const LinkContainer = styled.span`
  color: ${palette.darkBlue};
  cursor: pointer;
  text-decoration: underline;
`;

const ExpirationLabel = styled.span`
  color: ${palette.oPlusRed};
`;

const goToSubscriptions = () => {
  hashHistory.push('/subscriptions');
};

const BillingInformation = ({ setUpdatingBilling }) => {
  const { getValues } = useFormContext();

  const dispatch = useDispatch();

  const billingData = useSelector(store => store.organizationState.billingData);

  useMount(() => {
    getBillingEstimate({})(dispatch);
  });

  const values = getValues();

  const cardExpirationMoment = moment(values?.cardExpiration ?? null, 'm/YYYY');

  const expirationLabel = cardExpirationMoment.isValid()
    ? cardExpirationMoment.format('MM/YY')
    : values?.cardExpiration;

  const billingDateMoment = moment(billingData?.nextBillingDate ?? null);

  const billingDateLabel = billingDateMoment.isValid()
    ? billingDateMoment.format('MMMM D, YYYY')
    : 'N/A';

  const billingEstimateLabel =
    billingData?.subscriptionDetails?.billingFrequency ===
    BILLING_FREQUENCY.ANNUAL
      ? `$${billingData?.annualEstimate ?? 0}/yr`
      : `$${billingData?.monthlyEstimate ?? 0}/mo`;

  return (
    <InformationContainer>
      <InformationInnerContainer>
        <Grid container row="nowrap" direction="row" alignItems="baseline">
          <MontserratTypography variant="h3">
            Billing Information
          </MontserratTypography>
          <Spacing horizontal={3} />
          <MontserratTypography variant="h4">
            <LinkContainer onClick={setUpdatingBilling}>
              Update billing information
            </LinkContainer>
          </MontserratTypography>
        </Grid>
        <Spacing vertical={4} />
        <MontserratTypography variant="h4">
          This account is billed to
        </MontserratTypography>
        <Spacing vertical={3} />
        <MontserratTypography variant="h4">
          {values?.nameOnCard}
        </MontserratTypography>
        <Spacing vertical={3} />
        <MontserratTypography variant="h4">
          <span>{values?.cardNumber} </span>
          <ExpirationLabel>exp {expirationLabel}</ExpirationLabel>
        </MontserratTypography>
      </InformationInnerContainer>
      <InformationInnerContainer>
        <MontserratTypography variant="h4">
          Next payment due {billingDateLabel}
        </MontserratTypography>
        <Spacing vertical={3} />
        <MontserratTypography variant="h4">
          <span>{billingEstimateLabel}</span>
          <span> | </span>
          <span>{billingData?.activeUserCount ?? 0} users </span>
          <LinkContainer onClick={goToSubscriptions}>view users</LinkContainer>
        </MontserratTypography>
      </InformationInnerContainer>
    </InformationContainer>
  );
};

export default BillingInformation;
