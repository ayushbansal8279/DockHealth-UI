import { Grid, Hidden } from '@material-ui/core';
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
import { createBreakpoint, useToggle } from 'react-use';
import styled from 'styled-components';
import SafariFixGrid from '../../../../components/common/SafariFixGrid';
import CollapseInteractive from '../../../../img/collapse-interactive';
import { H4, H5 } from '../SubscriptionsView.Styled';
import {
  CardContactUsFooter,
  CardContactUsHeader,
  CardContentFeatures,
  CardStandardFooter,
  CardStandardHeader,
} from './SubscriptionsPlansView.PlanCard.Components';
import { H3, PlanLabel } from './SubscriptionsPlansView.Styled';

export const CARD_TYPES = {
  STANDARD: Symbol('STANDARD'),
  PREMIUM: Symbol('PREMIUM'),
  ENTERPRISE: Symbol('ENTERPRISE'),
};

const CardInnerContainer = styled(Grid)`
  && {
    border: 0.0625rem solid #ededf0;
    border-radius: 0.25rem;
    box-shadow: ${props =>
      props.chosen ? '0 0.25rem 0.25rem rgba(0, 0, 0, 0.25)' : 'none'};
    cursor: ${props => (props.selectable ? 'pointer' : 'default')};
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
  border-radius: ${props =>
    props.isFreeTrialLabelShown ? 0 : '0.25rem 0.25rem 0 0'};
  border-style: solid;
  border-width: 0.0625rem;
  color: ${({ chosen, inactiveColor, activeColor }) =>
    chosen ? activeColor : inactiveColor};
  display: flex;
  height: ${props => {
    if (props.isSmallScreen) {
      return props.isRecommended ? 2.875 : 1.875;
    }

    return 4.8125;
  }}rem;
  justify-content: ${props =>
    props.isSmallScreen ? 'space-between' : 'center'};
  padding: ${props =>
    props.isSmallScreen && !props.isRecommended
      ? '0.75rem 1.5rem'
      : '0.75rem 1.5rem 0'};
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
  height: ${props => (props.isSmallScreen ? 1 : 1.375)}rem;
  justify-content: center;
  left: -0.0625rem;
  position: absolute;
  text-transform: uppercase;
  top: -0.0625rem;
  width: calc(100% + 0.125rem);
  z-index: 1;
`;

const FreeTrialPlanLabel = styled.div`
  align-items: center;
  background-color: #feb52b;
  border-radius: 0.25rem 0.25rem 0 0;
  color: #213a56;
  display: flex;
  font-size: 0.875rem;
  height: 1.375rem;
  justify-content: center;
  left: -0.0625rem;
  position: absolute;
  right: -0.0625rem;
  top: -1.375rem;
`;

const RotatableCollapse = styled(CollapseInteractive)`
  object-fit: contain;
  transition: all 0.25s ease-out;
  transform: rotate(${props => (props.rotated ? 180 : 0)}deg);
  width: 0.75rem;
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

const useBreakpoint = createBreakpoint({ md: 960, lg: 1280 });

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
  isFreeTrialPlan,
  selectable,
  subscriptionPlanData,
}) => {
  const {
    ContentHeader,
    ContentFeatures,
    ContentFooter,
  } = getCardContentComponents({ cardType });

  const breakpoint = useBreakpoint();

  const [localFeatureListExpanded, toggleLocalFeatureListExpanded] = useToggle(
    subscriptionPlanData?.planIsTrial ?? false,
  );

  const isFreeTrialLabelShown = Boolean(
    isFreeTrialPlan && subscriptionPlanData?.planIsTrial,
  );

  const isSmallScreen = breakpoint === 'md';

  const currentFeatureListExpanded = isSmallScreen
    ? localFeatureListExpanded
    : featureListExpanded;

  const RecommendedLabelComponent = isSmallScreen ? H5 : H4;
  const LabelComponent = isSmallScreen ? H3 : PlanLabel;

  return (
    <Grid onClick={onClick} item sm={12} md={12} lg>
      <CardInnerContainer selectable={selectable} chosen={chosen}>
        <CardHeader
          chosen={chosen}
          inactiveBackgroundColor={inactiveBackgroundColor}
          inactiveColor={inactiveColor}
          activeBackgroundColor={activeBackgroundColor}
          activeColor={activeColor}
          breakpoint={breakpoint}
          onClick={isSmallScreen ? toggleLocalFeatureListExpanded : undefined}
          isSmallScreen={isSmallScreen}
          isRecommended={recommended}
          isFreeTrialLabelShown={isFreeTrialLabelShown}
        >
          {recommended && (
            <RecommendedLabel isSmallScreen={isSmallScreen}>
              <RecommendedLabelComponent>recommended</RecommendedLabelComponent>
            </RecommendedLabel>
          )}
          {isFreeTrialLabelShown && (
            // <FreeTrialPlanLabel isSmallScreen={isSmallScreen}>
            //   FREE 30 DAY TRIAL *
            // </FreeTrialPlanLabel>
            <FreeTrialPlanLabel isSmallScreen={isSmallScreen}>
              FREE FOR COVID-19 RESPONSE *
            </FreeTrialPlanLabel>
          )}
          <LabelComponent>{planLabel}</LabelComponent>
          <Hidden lgUp>
            <RotatableCollapse
              rotated={localFeatureListExpanded}
              color={chosen ? '#fff' : ''}
            />
          </Hidden>
        </CardHeader>
        <CardContent container alignItems="center" direction="row">
          {ContentHeader && (
            <ContentHeader
              annualPayment={annualPayment}
              annualMonthlyPrice={annualMonthlyPrice}
              cardType={cardType}
              chosen={chosen}
              monthlyPrice={monthlyPrice}
              featureListExpanded={currentFeatureListExpanded}
              featureRowReferences={featureRowReferences}
              subscriptionFeatures={subscriptionFeatures}
              recommended={recommended}
              breakpoint={breakpoint}
              subscriptionPlanData={subscriptionPlanData}
            />
          )}
          {ContentFeatures && (
            <ContentFeatures
              annualPayment={annualPayment}
              annualMonthlyPrice={annualMonthlyPrice}
              cardType={cardType}
              chosen={chosen}
              monthlyPrice={monthlyPrice}
              featureListExpanded={currentFeatureListExpanded}
              featureRowReferences={featureRowReferences}
              subscriptionFeatures={subscriptionFeatures}
              recommended={recommended}
              breakpoint={breakpoint}
              subscriptionPlanData={subscriptionPlanData}
            />
          )}
          {ContentFooter && (
            <ContentFooter
              annualPayment={annualPayment}
              annualMonthlyPrice={annualMonthlyPrice}
              cardType={cardType}
              chosen={chosen}
              monthlyPrice={monthlyPrice}
              featureListExpanded={currentFeatureListExpanded}
              featureRowReferences={featureRowReferences}
              subscriptionFeatures={subscriptionFeatures}
              recommended={recommended}
              breakpoint={breakpoint}
              subscriptionPlanData={subscriptionPlanData}
            />
          )}
        </CardContent>
      </CardInnerContainer>
    </Grid>
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
