import Collapse from '@material-ui/core/Collapse';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import isEmpty from 'ramda/es/isEmpty';
import times from 'ramda/es/times';
import React, { useCallback, useEffect, useState } from 'react';
import { IntercomAPI } from 'react-intercom';
import { useMount, useWindowSize, useCss } from 'react-use';
import styled from 'styled-components';
import SafariFixGrid from '../../../../components/common/SafariFixGrid';
import SubscriptionPlanExtendedIcon from '../../../../img/subscription-plan-extended.svg';
import SubscriptionPlanStandardIcon from '../../../../img/subscription-plan-standard.svg';
import {
  BigPriceLabel,
  H2,
  H3BoldWhite,
  H4,
  H5,
  H5Bold,
  PriceLabel,
} from '../SubscriptionsView.Styled';

const MONTHS_IN_YEAR = 12;
const PRICE_ROUNDING_MODIFIER = 100;
const FEATURE_ROW_REM_HEIGHT = 2;

const ORDER_STYLE_PADDING = '0.25rem 1.25rem';
const FLEX_POSITION = {
  START: 'flex-start',
  CENTER: 'center',
  END: 'flex-end',
};

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

const PlanButton = styled.button`
  align-items: center;
  background-color: ${props => (props.chosen ? '#074a86' : '#ababb2')};
  border-radius: 0.25rem;
  cursor: pointer;
  display: flex;
  min-height: 2.5rem;
  justify-content: center;
  margin: 0.5rem 0;
  transition: all 0.25s ease-out;
  width: 100%;
`;

const CardFeatureRowContainer = styled.div`
  ${props => props.isSmallScreen && 'padding: 0 1.5rem;'}
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

const CardFeaturesSmallContainer = styled.div`
  padding: 0.5rem;
  width: 100%;
`;

const IncludedFeatureRow = styled.div`
  align-items: center;
  color: #000;
  display: flex;
  font-size: 0.875rem;
  padding: 0.25rem;
`;

const NotIncludedFeatureRow = styled(IncludedFeatureRow)`
  color: #ababb2;
`;

const IncludedFeatureHeader = styled(IncludedFeatureRow)`
  font-weight: 600;
`;

const ChatNowLabel = styled.div`
  cursor: pointer;
  transition: all 0.25s ease;

  &:hover {
    color: #0ca1c7;
  }
`;

export const CardContactUsHeader = ({ breakpoint }) => {
  const isSmallScreen = breakpoint === 'md';

  const orderClassName = useCss({
    '&&': {
      order: 1,
      padding: ORDER_STYLE_PADDING,
    },
  });

  return (
    <ContentHeaderGrid
      item
      lg={12}
      md={6}
      sm={6}
      container
      className={orderClassName}
      justify={isSmallScreen ? FLEX_POSITION.START : FLEX_POSITION.CENTER}
      wrap="nowrap"
    >
      <H2>Contact Us</H2>
    </ContentHeaderGrid>
  );
};

export const CardContactUsFooter = ({ breakpoint }) => {
  const isSmallScreen = breakpoint === 'md';

  const orderClassName = useCss({
    '&&': {
      order: isSmallScreen ? 2 : 3,
      padding: ORDER_STYLE_PADDING,
    },
  });

  return (
    <ContentFooterGrid
      item
      lg={12}
      md={6}
      sm={6}
      container
      alignItems={isSmallScreen ? FLEX_POSITION.END : FLEX_POSITION.CENTER}
      direction="column"
      justify="center"
      className={orderClassName}
    >
      <SafariFixGrid
        item
        xs={12}
        container
        justify={isSmallScreen ? FLEX_POSITION.END : FLEX_POSITION.CENTER}
      >
        <H4>
          <a href="mailto:support@dock.health">support@dock.health</a>
        </H4>
      </SafariFixGrid>
      <SafariFixGrid
        item
        xs={12}
        container
        justify={isSmallScreen ? FLEX_POSITION.END : FLEX_POSITION.CENTER}
      >
        <H4>(857) 302-0441</H4>
      </SafariFixGrid>
      <SafariFixGrid
        item
        xs={12}
        container
        justify={isSmallScreen ? FLEX_POSITION.END : FLEX_POSITION.CENTER}
      >
        <H4>
          <div
            onClick={() => {
              IntercomAPI('show');
            }}
          >
            <ChatNowLabel>Chat Now</ChatNowLabel>
          </div>
        </H4>
      </SafariFixGrid>
    </ContentFooterGrid>
  );
};

export const CardStandardHeader = ({
  annualPayment,
  annualMonthlyPrice,
  monthlyPrice,
  breakpoint,
}) => {
  const isSmallScreen = breakpoint === 'md';

  const orderClassName = useCss({
    '&&': {
      order: 1,
      padding: ORDER_STYLE_PADDING,
    },
  });

  return (
    <ContentHeaderGrid
      item
      sm={6}
      md={6}
      lg={12}
      container
      direction="column"
      wrap="nowrap"
      className={orderClassName}
    >
      <SafariFixGrid
        item
        xs={12}
        container
        justify={isSmallScreen ? FLEX_POSITION.START : FLEX_POSITION.CENTER}
        alignItems="baseline"
      >
        <BigPriceLabel>{`$${
          annualPayment ? annualMonthlyPrice : monthlyPrice
        }`}</BigPriceLabel>
        <PriceLabel>/user</PriceLabel>
      </SafariFixGrid>
      <SafariFixGrid
        item
        xs={12}
        container
        justify={isSmallScreen ? FLEX_POSITION.START : FLEX_POSITION.CENTER}
      >
        <H4>Per Month</H4>
      </SafariFixGrid>
    </ContentHeaderGrid>
  );
};

export const CardStandardFooter = ({
  annualPayment,
  annualMonthlyPrice,
  chosen,
  breakpoint,
}) => {
  const annualPrice =
    Math.floor(
      PRICE_ROUNDING_MODIFIER * Math.round(annualMonthlyPrice * MONTHS_IN_YEAR),
    ) / PRICE_ROUNDING_MODIFIER;

  const isSmallScreen = breakpoint === 'md';

  const orderClassName = useCss({
    '&&': {
      order: isSmallScreen ? 2 : 3,
      padding: ORDER_STYLE_PADDING,
    },
  });

  return (
    <ContentFooterGrid
      item
      lg={12}
      md={6}
      sm={6}
      className={orderClassName}
      container
      direction="column"
      justify="center"
      alignItems={isSmallScreen ? FLEX_POSITION.END : FLEX_POSITION.CENTER}
    >
      <SafariFixGrid item lg={12} md={6} sm={6} container justify="center">
        <PlanButton chosen={chosen}>
          <H3BoldWhite>
            {chosen ? 'Plan Selected' : 'Select This Plan'}
          </H3BoldWhite>
        </PlanButton>
      </SafariFixGrid>
      <SafariFixGrid
        item
        lg={12}
        md={6}
        sm={6}
        container
        alignItems={isSmallScreen ? FLEX_POSITION.END : FLEX_POSITION.CENTER}
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
  breakpoint,
}) => {
  const featureRowsLength = subscriptionFeatures.length;

  const [renderedFeatureRows, setRenderedFeatureRows] = useState([]);
  const { width } = useWindowSize();

  const isSmallScreen = breakpoint === 'md';

  const orderClassName = useCss({
    '&&': {
      order: isSmallScreen ? 3 : 1,
    },
  });

  const resetRenderedFeatureRows = useCallback(() => {
    if (isSmallScreen) {
      const includedFeatures = [];
      const notIncludedFeatures = [];

      subscriptionFeatures.forEach(feature => {
        const { subscriptionTypes } = feature;
        const isCurrentFeature = subscriptionTypes.includes(cardType);

        if (isCurrentFeature) {
          includedFeatures.push({ ...feature });
        } else {
          notIncludedFeatures.push({ ...feature });
        }
      });

      setRenderedFeatureRows(
        <CardFeaturesSmallContainer>
          <Grid container>
            <Grid item md={6}>
              <Hidden smDown>
                {!isEmpty(includedFeatures) && (
                  <IncludedFeatureHeader>Included:</IncludedFeatureHeader>
                )}
              </Hidden>
            </Grid>
            <Grid item md={6}>
              <Hidden smDown>
                {!isEmpty(notIncludedFeatures) && (
                  <IncludedFeatureHeader>Not included:</IncludedFeatureHeader>
                )}
              </Hidden>
            </Grid>
            <Grid item md={6} sm={12}>
              {includedFeatures.map(({ label, key }) => (
                <IncludedFeatureRow key={key}>{label}</IncludedFeatureRow>
              ))}
            </Grid>
            <Grid item md={6} sm={12}>
              {notIncludedFeatures.map(({ label, key }) => (
                <NotIncludedFeatureRow key={key}>{label}</NotIncludedFeatureRow>
              ))}
            </Grid>
          </Grid>
        </CardFeaturesSmallContainer>,
      );
    } else {
      setRenderedFeatureRows(
        times(index => {
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
        })(featureRowsLength),
      );
    }
  }, [
    cardType,
    featureRowReferences,
    featureRowsLength,
    subscriptionFeatures,
    isSmallScreen,
  ]);

  useMount(() => {
    resetRenderedFeatureRows();
  });

  useEffect(() => {
    resetRenderedFeatureRows();
  }, [resetRenderedFeatureRows, width, breakpoint]);

  return (
    <CardFeatureRowContainer
      isSmallScreen={isSmallScreen}
      className={orderClassName}
    >
      <Collapse in={featureListExpanded}>{renderedFeatureRows}</Collapse>
    </CardFeatureRowContainer>
  );
};
