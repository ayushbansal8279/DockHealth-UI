import { AnimatePresence, motion } from 'framer-motion';
import times from 'ramda/es/times';
import React from 'react';
import { Link } from 'react-router';
import styled from 'styled-components';

import SafariFixGrid from '../../components/common/SafariFixGrid';
import SubscriptionPlanExtendedIcon from '../../img/subscription-plan-extended.svg';
import SubscriptionPlanStandardIcon from '../../img/subscription-plan-standard.svg';
import { H2, H3BoldWhite, H4, H5, H5Bold } from './SubscriptionsView.Styled';

const MONTHS_IN_YEAR = 12;
const PRICE_ROUNDING_MODIFIER = 100;
const FEATURE_ROW_REM_HEIGHT = 2;

const ContentHeaderGrid = styled(SafariFixGrid)`
  && {
    height: 5rem;
    min-height: 5rem;
  }
`;

const ContentFooterGrid = styled(SafariFixGrid)`
  && {
    height: 8.375rem;
    min-height: 8.375rem;
  }
`;

const PriceLabel = styled.span`
  font-size: 1.5rem;
  font-weight: 300;
  margin-left: 0.25rem;
`;

const BigPriceLabel = styled.span`
  font-size: 2.25rem;
  letter-spacing: -0.125rem;
`;

const PlanButton = styled.button`
  align-items: center;
  background-color: ${props => (props.chosen ? '#074a86' : '#ababb2')};
  border-radius: 0.25rem;
  cursor: pointer;
  display: flex;
  height: 2.5rem;
  justify-content: center;
  margin: 0.5rem 10%;
  transition: all 0.25s ease-out;
  width: 100%;
`;

const CardFeatureRowContainer = styled(motion.div)`
  width: 100%;
`;

const CardFeatureRow = styled.div`
  align-items: center;
  display: flex;
  min-height: ${FEATURE_ROW_REM_HEIGHT}rem;
  justify-content: center;
  width: 100%;

  &:nth-child(even) {
    background-color: #ededf0;
  }
`;

export const CardContactUsHeader = () => (
  <ContentHeaderGrid item xs={12} container justify="center" wrap="nowrap">
    <H2>Contact Us</H2>
  </ContentHeaderGrid>
);

export const CardContactUsFooter = () => {
  return (
    <ContentFooterGrid
      item
      xs={12}
      container
      alignItems="center"
      direction="column"
      justify="center"
    >
      <SafariFixGrid item xs={12} container justify="center">
        <H4>
          <a href="mailto:support@dock.health">support@dock.health</a>
        </H4>
      </SafariFixGrid>
      <SafariFixGrid item xs={12} container justify="center">
        <H4>(857) 302-0441</H4>
      </SafariFixGrid>
      <SafariFixGrid item xs={12} container justify="center">
        <H4>
          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
          <Link to="">Chat Now</Link>
        </H4>
      </SafariFixGrid>
    </ContentFooterGrid>
  );
};

export const CardStandardHeader = ({
  annualPayment,
  annualMonthlyPrice,
  monthlyPrice,
}) => {
  return (
    <ContentHeaderGrid container direction="column" wrap="nowrap">
      <SafariFixGrid
        item
        xs={12}
        container
        justify="center"
        alignItems="baseline"
      >
        <BigPriceLabel>{`$${
          annualPayment ? annualMonthlyPrice : monthlyPrice
        }`}</BigPriceLabel>
        <PriceLabel>/user</PriceLabel>
      </SafariFixGrid>
      <SafariFixGrid item xs={12} container justify="center">
        <H4>Per Month</H4>
      </SafariFixGrid>
    </ContentHeaderGrid>
  );
};

export const CardStandardFooter = ({
  annualPayment,
  annualMonthlyPrice,
  chosen,
}) => {
  const annualPrice =
    Math.floor(
      PRICE_ROUNDING_MODIFIER * Math.round(annualMonthlyPrice * MONTHS_IN_YEAR),
    ) / PRICE_ROUNDING_MODIFIER;

  return (
    <ContentFooterGrid container direction="column" justify="center">
      <SafariFixGrid item xs={12} container justify="center">
        <PlanButton chosen={chosen}>
          <H3BoldWhite>
            {chosen ? 'Plan Selected' : 'Buy This Plan'}
          </H3BoldWhite>
        </PlanButton>
      </SafariFixGrid>
      <SafariFixGrid
        item
        xs={12}
        container
        alignItems="center"
        justify="center"
        direction="column"
      >
        {annualPayment ? (
          <>
            <H5>{`$${annualPrice}/user`}</H5>
            <H5>Billed annually</H5>
          </>
        ) : (
          <>
            <H5Bold>Save 25% by paying annually</H5Bold>
            <H5>{`= $${annualMonthlyPrice}/user per month`}</H5>
          </>
        )}
      </SafariFixGrid>
    </ContentFooterGrid>
  );
};

export const CardContentFeatures = ({
  cardType,
  featureListExpanded,
  subscriptionFeatures,
  featureRowReferences,
}) => {
  const featureRowsLength = subscriptionFeatures.length;

  const renderedFeatureRows = times(index => {
    const {
      subscriptionTypes,
      subscriptionTypeExtendedIn,
    } = subscriptionFeatures[index];
    const featureRowReference = featureRowReferences[index];

    const isExtendedFeature = cardType === subscriptionTypeExtendedIn;
    const isCurrentFeature =
      subscriptionTypes.includes(cardType) && !isExtendedFeature;

    return (
      <CardFeatureRow
        key={index}
        style={{
          height: featureRowReference.current?.offsetHeight ?? 0,
        }}
      >
        {isCurrentFeature && (
          <img src={SubscriptionPlanStandardIcon} alt="tick icon" />
        )}
        {isExtendedFeature && (
          <img src={SubscriptionPlanExtendedIcon} alt="tick icon" />
        )}
      </CardFeatureRow>
    );
  })(featureRowsLength);

  const animationContainerHeight = featureRowReferences.reduce(
    (accumulator, reference) =>
      accumulator + reference.current?.offsetHeight ?? 0,
    0,
  );

  const animationProperties = {
    variants: {
      hidden: { height: 0, opacity: 0 },
      visible: {
        height: animationContainerHeight,
        opacity: 1,
      },
    },
    initial: 'hidden',
    exit: 'hidden',
    animate: 'visible',
    transition: { ease: 'easeInOut', duration: 0.25 },
  };

  return (
    <AnimatePresence>
      {featureListExpanded && (
        <CardFeatureRowContainer {...animationProperties}>
          {renderedFeatureRows}
        </CardFeatureRowContainer>
      )}
    </AnimatePresence>
  );
};
