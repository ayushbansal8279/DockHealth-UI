import Grid from '@material-ui/core/Grid';
import {
  arrayOf,
  bool,
  func,
  number,
  object,
  oneOf,
  shape,
  string,
  symbol,
} from 'prop-types';
import React from 'react';
import styled from 'styled-components';

import SafariFixGrid from '../../../components/common/SafariFixGrid';
import SubscriptionPlanTick from '../../../img/subscription-plan-tick.svg';
import {
  CardContactUsFooter,
  CardContactUsHeader,
  CardContentFeatures,
  CardStandardFooter,
  CardStandardHeader,
} from './SubscriptionsView.PlanCard.Components';
import { H2, H4 } from './SubscriptionsView.Styled';

export const CARD_TYPES = {
  STANDARD: Symbol('STANDARD'),
  PREMIUM: Symbol('PREMIUM'),
  ENTERPRISE: Symbol('ENTERPRISE'),
};

const CardGrid = styled(Grid)`
  && {
    border: 0.0625rem solid #ededf0;
    border-radius: 0.25rem;
    box-shadow: ${props =>
      props.chosen ? '0 0.25rem 0.25rem rgba(0, 0, 0, 0.25)' : 'none'};
    cursor: pointer;
    margin: 0 0.125rem;
    min-height: 16.25rem;
    transition: all 0.25s ease-out;
  }
`;

const CardHeader = styled.div`
  align-items: center;
  background-color: ${({
    chosen,
    inactiveBackgroundColor,
    activeBackgroundColor,
  }) => (chosen ? activeBackgroundColor : inactiveBackgroundColor)};
  border-color: ${({
    chosen,
    inactiveBackgroundColor,
    activeBackgroundColor,
  }) => (chosen ? activeBackgroundColor : inactiveBackgroundColor)};
  border-radius: 0.25rem 0.25rem 0 0;
  border-style: solid;
  border-width: 0.0625rem;
  color: ${({ chosen, inactiveColor, activeColor }) =>
    chosen ? activeColor : inactiveColor};
  display: flex;
  height: 4.8125rem;
  justify-content: center;
  padding-top: 0.75rem;
  position: relative;
  transition: all 0.25s ease-out;
  width: 100%;
`;

const RecommendedLabel = styled.div`
  align-items: center;
  background-color: #fdb42b;
  border-radius: 0.25rem 0.25rem 0 0;
  color: #fff;
  display: flex;
  height: 1.375rem;
  justify-content: center;
  left: -0.0625rem;
  position: absolute;
  text-transform: uppercase;
  top: -0.0625rem;
  width: calc(100% + 0.125rem);
  z-index: 1;
`;

const CardHeaderTick = styled.div`
  align-items: center;
  background-color: #074a86;
  border: 0.1875rem solid #fff;
  border-radius: 50%;
  display: flex;
  height: 2.125rem;
  justify-content: center;
  left: 50%;
  position: absolute;
  top: -1.0625rem;
  transform: translateX(-50%) scale(${props => (props.chosen ? 1 : 0)});
  transition: all 0.25s ease-out;
  width: 2.125rem;
  z-index: 2;
`;

const CardContent = styled(SafariFixGrid)`
  && {
    padding: 0.25rem 0rem;
  }
`;

const getCardContentComponents = ({ cardType }) => {
  switch (cardType) {
    case CARD_TYPES.STANDARD:
    case CARD_TYPES.PREMIUM:
      return {
        ContentHeader: CardStandardHeader,
        ContentFeatures: CardContentFeatures,
        ContentFooter: CardStandardFooter,
      };
    case CARD_TYPES.ENTERPRISE:
      return {
        ContentHeader: CardContactUsHeader,
        ContentFeatures: CardContentFeatures,
        ContentFooter: CardContactUsFooter,
      };
    default:
      return {
        ContentHeader: null,
        ContentFeatures: null,
        ContentFooter: null,
      };
  }
};

const SubscriptionsViewPlanCard = ({
  chosen,
  inactiveBackgroundColor,
  inactiveColor,
  activeBackgroundColor,
  activeColor,
  planLabel,
  onClick,
  annualPayment,
  annualMonthlyPrice,
  monthlyPrice,
  cardType,
  featureListExpanded,
  featureRowReferences,
  subscriptionFeatures,
  recommended,
}) => {
  const {
    ContentHeader,
    ContentFeatures,
    ContentFooter,
  } = getCardContentComponents({ cardType });

  return (
    <CardGrid onClick={onClick} chosen={chosen} item sm={12} md={3}>
      <CardHeader
        chosen={chosen}
        inactiveBackgroundColor={inactiveBackgroundColor}
        inactiveColor={inactiveColor}
        activeBackgroundColor={activeBackgroundColor}
        activeColor={activeColor}
      >
        {recommended && (
          <RecommendedLabel>
            <H4>recommended</H4>
          </RecommendedLabel>
        )}
        <CardHeaderTick chosen={chosen}>
          <img alt="tick" src={SubscriptionPlanTick} />
        </CardHeaderTick>
        <H2>{planLabel}</H2>
      </CardHeader>
      <CardContent container alignItems="center" direction="column">
        {ContentHeader && (
          <ContentHeader
            annualPayment={annualPayment}
            annualMonthlyPrice={annualMonthlyPrice}
            cardType={cardType}
            chosen={chosen}
            monthlyPrice={monthlyPrice}
            featureListExpanded={featureListExpanded}
            featureRowReferences={featureRowReferences}
            subscriptionFeatures={subscriptionFeatures}
            recommended={recommended}
          />
        )}
        {ContentFeatures && (
          <ContentFeatures
            annualPayment={annualPayment}
            annualMonthlyPrice={annualMonthlyPrice}
            cardType={cardType}
            chosen={chosen}
            monthlyPrice={monthlyPrice}
            featureListExpanded={featureListExpanded}
            featureRowReferences={featureRowReferences}
            subscriptionFeatures={subscriptionFeatures}
            recommended={recommended}
          />
        )}
        {ContentFooter && (
          <ContentFooter
            annualPayment={annualPayment}
            annualMonthlyPrice={annualMonthlyPrice}
            cardType={cardType}
            chosen={chosen}
            monthlyPrice={monthlyPrice}
            featureListExpanded={featureListExpanded}
            featureRowReferences={featureRowReferences}
            subscriptionFeatures={subscriptionFeatures}
            recommended={recommended}
          />
        )}
      </CardContent>
    </CardGrid>
  );
};

SubscriptionsViewPlanCard.propTypes = {
  chosen: bool.isRequired,
  inactiveColor: string,
  inactiveBackgroundColor: string.isRequired,
  activeColor: string,
  activeBackgroundColor: string,
  planLabel: string.isRequired,
  onClick: func,
  annualPayment: bool.isRequired,
  annualMonthlyPrice: number,
  monthlyPrice: number,
  cardType: oneOf(Object.values(CARD_TYPES)).isRequired,
  recommended: bool,
  featureListExpanded: bool.isRequired,
  featureRowReferences: arrayOf(object),
  subscriptionFeatures: arrayOf(
    shape({
      key: string,
      label: string,
      subscriptionTypes: arrayOf(symbol),
      subscriptionTypeExtendedIn: symbol,
    }),
  ),
};

SubscriptionsViewPlanCard.defaultProps = {
  inactiveColor: '#303538',
  activeColor: '#fff',
  activeBackgroundColor: '#074A86',
  onClick: () => {},
  annualMonthlyPrice: 0,
  monthlyPrice: 0,
  featureRowReferences: [],
  subscriptionFeatures: [],
  recommended: false,
};

export default SubscriptionsViewPlanCard;
