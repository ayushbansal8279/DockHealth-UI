import { ButtonBase, Grid } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { motion } from 'framer-motion';
import React from 'react';
import styled from 'styled-components';

export const H1 = styled.h1`
  font-size: 2.25rem;
  margin: 0.25rem 0;
`;

export const H1Bold = styled(H1)`
  font-weight: 600;
`;

export const H2 = styled.h2`
  font-size: 1.5rem;
  margin: 0.2rem 0;
`;

export const H3 = styled.h3`
  font-size: 1rem;
  margin: 0.15rem 0;
`;

export const H3Marginless = styled(H3)`
  margin: 0;
`;

export const H3BoldWhite = styled(H3)`
  color: #fff;
  font-weight: bold;
`;

export const H3Thin = styled(H3)`
  font-weight: 300;
`;

export const H3ThinMarginless = styled(H3Thin)`
  margin: 0;
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

export const SubscriptionsViewOuterContainer = styled.div`
  background-color: #fff;
  display: flex;
  position: absolute;
  min-height: 100%;
  justify-content: center;
  left: 0;
  top: 0;
  width: 100%;
`;

export const SubscriptionsViewContainer = styled(Grid)`
  && {
    background-color: #fff;
    padding: 3rem 2rem;
    max-width: 1200px;
  }
`;

export const BillingContainer = styled.div`
  align-items: center;
  background-color: #efeff0;
  flex-basis: auto;
  display: flex;
  height: 4.375rem;
  max-height: 4.375rem;
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
    fontSize: '1.125rem',
    height: '3rem',
    marginLeft: '0.5rem',
    padding: '0 1.5rem',
    transition: 'all 0.25s ease-out',
  },
  text: {
    color: '#000',
  },
  contained: {
    backgroundColor: '#074a86',
    color: '#fff',
  },
  containedDisabled: {
    backgroundColor: '#ababb2',
  },
  fullWidth: {
    marginLeft: 0,
    width: '100%',
  },
})(({ classes, variant, fullWidth, disabled, ...props }) => {
  const rootClassName = classes.root || '';
  const variantClassName = classes[variant] || '';
  const variantDisabledClassName = disabled
    ? `${classes[`${variant}Disabled`] ?? ''}`
    : '';
  const fullWidthClassName = fullWidth ? classes.fullWidth : '';

  const className = `${rootClassName} ${variantClassName} ${variantDisabledClassName} ${fullWidthClassName}`.trim();

  return <ButtonBase className={className} disabled={disabled} {...props} />;
});

export const PriceLabel = styled.span`
  font-size: 1.5rem;
  font-weight: 300;
  margin-left: 0.25rem;
`;

export const BigPriceLabel = styled.span`
  font-size: 2.25rem;
  letter-spacing: -0.125rem;
`;
