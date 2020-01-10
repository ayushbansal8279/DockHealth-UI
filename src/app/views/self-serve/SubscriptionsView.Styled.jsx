import React from 'react';
import styled from 'styled-components';
import ButtonBase from '@material-ui/core/ButtonBase';
import Grid from '@material-ui/core/Grid';
import { motion } from 'framer-motion';
import withStyles from '@material-ui/core/styles/withStyles';

export const H1 = styled.h1`
  font-size: 2.25rem;
  margin: 0.25rem 0;
`;

export const H2 = styled.h2`
  font-size: 1.5rem;
  margin: 0.2rem 0;
`;

export const H3 = styled.div`
  font-size: 1rem;
  margin: 0.15rem 0;
`;

export const H3BoldWhite = styled(H3)`
  color: #fff;
  font-weight: bold;
`;

export const H4 = styled.h4`
  font-size: 0.875rem;
  margin: 0.1rem 0;
`;

export const H4Bold = styled(H4)`
  font-weight: 600;
`;

export const H4Animated = styled(motion.h4)`
  font-size: 0.875rem;
  margin: 0.1rem 0;
`;

export const H5 = styled.h5`
  font-size: 0.75rem;
  margin: 0.05rem 0;
`;

export const H5Bold = styled(H5)`
  font-weight: bold;
`;

export const Title = styled(H1)`
  color: #fff;
  padding-left: 2rem;
`;

export const SubscriptionsViewContainer = styled(Grid)`
  && {
    background-color: #fff;
    padding: 2.625rem 4.625rem;
  }
`;

export const AnnualToggleContainer = styled(Grid)`
  && {
    background-color: #dedee2;
    border-radius: 0.25rem;
    cursor: pointer;
    height: 2.5rem;
    margin-top: 0.375rem;
    position: relative;
  }
`;

export const AnnualToggleLabel = styled(H4)`
  transition: all 0.25s ease;
  z-index: 2;
  ${props =>
    props.active
      ? 'color: #fff; font-weight: bold;'
      : 'color: #011845; font-weight: 600;'}
`;

export const AnnualToggleSwitch = styled.div`
  background: #074a86;
  box-shadow: 0px 0.25rem 0.25rem rgba(0, 0, 0, 0.25);
  border-radius: 0.25rem;
  height: 100%;
  left: ${props => (props.active ? 50 : 0)}%;
  position: absolute;
  transition: all 0.25s ease;
  width: 50%;
  z-index: 1;
`;

export const SubscriptionCardGrid = styled(Grid)`
  && {
    margin-top: 2rem;
  }
`;

export const FeatureListContainer = styled(Grid).attrs({
  item: true,
  xs: 3,
})`
  background-color: #011845;
  color: #fff;
`;

const FeatureHeaderElement = styled.div`
  display: flex;
  flex-flow: column wrap;
  justify-content: center;
  padding: 0 1rem;
`;

export const FeatureListHeader = styled(FeatureHeaderElement)`
  height: 4.8125rem;
  min-height: 4.8125rem;
`;

export const FeatureListContentHeader = styled(FeatureHeaderElement)`
  cursor: pointer;
  height: 5.25rem;
  min-height: 5.25rem;
`;

export const FeatureListChevronContainer = styled.img`
  align-items: center;
  display: inline-flex;
  justify-content: center;
  margin-left: 1.5rem;
  transition: all 0.25s ease-out;
  transform: rotate(${props => (props.rotated ? 180 : 0)}deg);
`;

export const FeatureRow = styled.div`
  align-items: center;
  box-sizing: border-box;
  display: flex;
  min-height: 2rem;
  padding: 0.125rem;
  padding-left: 1.6875rem;
  padding-right: 1.25rem;
  width: 100%;

  &:nth-child(even) {
    background-color: #1a2d56;
  }
`;

export const BillingContainer = styled.div`
  align-items: center;
  background-color: #efeff0;
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
  padding: 0.5rem 1.25rem;
  width: 100%;
`;

export const BillingLabel = styled.span`
  color: #2e3a43;
  font-size: 1.125rem;
`;

export const BillingPrice = styled.span`
  color: #2e3a43;
  font-size: 2.25rem;
  font-weight: bold;
`;

export const BottomButtonContainer = styled(Grid)`
  margin-top: 1rem;
`;

export const StyledButton = withStyles({
  root: {
    borderRadius: '0.25rem',
    fontSize: '0.875rem',
    height: '2.5rem',
    marginLeft: '0.5rem',
    padding: '0 1.5rem',
  },
  text: {
    color: '#000',
  },
  contained: {
    backgroundColor: '#fdb42b',
    color: '#565b5f',
  },
})(({ classes, variant, ...props }) => {
  const variantClassName = classes[variant] || '';
  const rootClassName = classes.root || '';

  const className = `${rootClassName} ${variantClassName}`.trim();

  return <ButtonBase className={className} {...props} />;
});

export const FeatureRowsContainer = styled(motion.div)``;
