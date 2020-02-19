import ButtonBase from '@material-ui/core/ButtonBase';
import styled from 'styled-components';
import withStyles from '@material-ui/core/styles/withStyles';
import React from 'react';

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

export const H4 = styled.h4`
  font-size: 0.875rem;
  margin: 0.1rem 0;
`;

export const H5 = styled.h5`
  font-size: 0.75rem;
  margin: 0.05rem 0;
`;

export const Title = styled(H1)`
  color: #fff;
  padding-left: 2rem;
`;

const Spacing = styled.div`
  width: 100%;
`;

export const Spacing1 = styled(Spacing)`
  height: 1rem;
`;

export const Spacing2 = styled(Spacing)`
  height: 2rem;
`;

export const SubscriptionPaymentViewOuterContainer = styled.div`
  background-color: #fff;
  display: flex;
  justify-content: center;
  left: 0;
  min-height: 100%;
  position: absolute;
  top: 0;
  width: 100%;
`;

export const SubscriptionPaymentViewContainer = styled.div`
  background-color: #fff;
  max-width: 1200px;
  padding: 3rem;
  width: 1200px;
`;

export const BillingButton = withStyles({
  root: {
    borderRadius: '0.25rem',
    height: '3rem',
    padding: '0.25rem 2.5rem',
    marginLeft: '1rem',
  },
  contained: {
    backgroundColor: '#074a86',
    color: '#fff',
  },
  outlined: {
    color: '#074a86',
  },
})(({ classes, variant, fullWidth, ...props }) => {
  const className = `${classes.root} ${classes[variant]}`.trim();

  return <ButtonBase className={className} {...props} />;
});

export const PricingGridContainer = styled.div`
  background-color: #f8f8f9;
  border: 0.0625rem solid #ededf0;
  border-radius: 0.25rem;
  display: grid;
  grid-column-gap: 1rem;
  grid-template-columns: 0.75fr auto 1fr;
  padding: 1rem;
`;

export const PricingItemDivider = styled.div`
  background-color: #dedee2;
  grid-column-start: 1;
  grid-column-end: 4;
  height: 0.0625rem;
  width: 100%;
`;

export const PricingItemVerticallyExpanded = styled.div`
  grid-row-start: 1;
  grid-row-end: 3;
`;
