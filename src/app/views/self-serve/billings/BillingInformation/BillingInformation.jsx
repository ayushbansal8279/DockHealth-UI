import { Grid } from '@mui/material';
import moment from 'moment';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useMount } from 'react-use';
import styled from 'styled-components';
import { getBillingEstimate } from 'actions/organization-actions';
import Spacing from 'components/common/Spacing';
import CardAmexIcon from 'img/cards/american-express.png';
import CardDiscoverIcon from 'img/cards/discover.png';
import CardMastercardIcon from 'img/cards/mastercard.png';
import CardVisaIcon from 'img/cards/visa.png';
import palette from 'styles/palette';
import { MontserratTypography } from 'styles/theme-montserrat';
import { BillingFrequency } from 'helpers/subscription-helper';
import {
  billingDetailsSelector,
  currentSubscriptionPlanSelector,
} from 'selectors/organization-selectors';

const CARD_EXPIRATION_WARNING_DAYS = 15;

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

const CardBrandIconImage = styled.img`
  background-color: ${palette.white};
  border-radius: 0.25rem;
  border: 0.5px solid ${palette.midnightBlue};
  cursor: default;
  object-fit: contain;
  width: 2.25rem;
`;

const ExpirationLabel = styled.span`
  color: ${(props) =>
    props.futureExpirationWarning ? palette.oPlusRed : palette.lightGrey};
`;

const goToUsersView = (history) => {
  history.push('/users');
};

const getCardBrandIconSource = ({ cardBrand }) => {
  switch (cardBrand?.toLowerCase()) {
    case 'american express':
      return CardAmexIcon;
    case 'discover':
      return CardDiscoverIcon;
    case 'mastercard':
      return CardMastercardIcon;
    case 'visa':
      return CardVisaIcon;
    default:
      return null;
  }
};

const BillingInformation = ({ setUpdatingBilling }) => {
  const { getValues } = useFormContext();

  const dispatch = useDispatch();
  const history = useHistory();

  const billingDetails = useSelector(billingDetailsSelector);
  const currentSubscriptionPlan = useSelector(currentSubscriptionPlanSelector);

  useMount(() => {
    getBillingEstimate({})(dispatch);
  });

  const cardBrandIcon = getCardBrandIconSource({
    cardBrand: billingDetails?.cardBrand,
  });

  const values = getValues();

  const cardExpirationMoment = moment(
    values?.cardExpiration ?? null,
    'MM/YYYY',
  );

  const expirationLabel = cardExpirationMoment.isValid()
    ? cardExpirationMoment.format('MM/YY')
    : values?.cardExpiration;

  const futureExpirationMoment = moment()
    .startOf('day')
    .add(CARD_EXPIRATION_WARNING_DAYS, 'days');

  const futureExpirationWarning =
    !!futureExpirationMoment.isSameOrAfter(cardExpirationMoment);

  const billingDateMoment = moment(
    currentSubscriptionPlan?.nextBillingDate ?? null,
  );

  const billingDateLabel = billingDateMoment.isValid()
    ? billingDateMoment.format('MMMM D, YYYY')
    : 'N/A';

  const billingEstimateLabel =
    currentSubscriptionPlan?.subscriptionDetails?.billingFrequency ===
    BillingFrequency.ANNUAL
      ? `$${currentSubscriptionPlan?.annualEstimate ?? 0}/yr`
      : `$${currentSubscriptionPlan?.monthlyEstimate ?? 0}/mo`;

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
        <Spacing vertical={1} />
        <MontserratTypography variant="h4">
          {values?.nameOnCard}
        </MontserratTypography>
        <Spacing vertical={3} />
        <Spacing vertical={1} />
        <MontserratTypography variant="h4">
          <Grid container alignItems="center" wrap="nowrap">
            {cardBrandIcon && (
              <>
                <CardBrandIconImage src={cardBrandIcon} />
                <Spacing horizontal={3} />
              </>
            )}
            <span>{values?.cardNumber} </span>
            <Spacing horizontal={3} />
            <ExpirationLabel futureExpirationWarning={futureExpirationWarning}>
              exp {expirationLabel}
            </ExpirationLabel>
          </Grid>
        </MontserratTypography>
      </InformationInnerContainer>
      <InformationInnerContainer>
        <MontserratTypography variant="h4">
          Plan:{' '}
          {currentSubscriptionPlan?.subscriptionDetails?.subscriptionPlanName}
        </MontserratTypography>
        <MontserratTypography variant="h4">
          Next payment due {billingDateLabel}
        </MontserratTypography>
        <Spacing vertical={3} />
        <Spacing vertical={1} />
        <MontserratTypography variant="h4">
          <span>{billingEstimateLabel}</span>
          <span> | </span>
          <span>
            {currentSubscriptionPlan?.activeDockLiteUserCount > 0
              ? `(${
                  currentSubscriptionPlan?.activeUserCount ?? 0
                } standard user, ${
                  currentSubscriptionPlan?.activeDockLiteUserCount
                } Dock Lite user) `
              : `(${currentSubscriptionPlan?.activeUserCount ?? 0} user) `}
          </span>
          <LinkContainer onClick={() => goToUsersView(history)}>
            view users
          </LinkContainer>
        </MontserratTypography>
      </InformationInnerContainer>
    </InformationContainer>
  );
};

export default BillingInformation;
