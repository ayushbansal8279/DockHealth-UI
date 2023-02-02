import { ButtonBase } from '@mui/material';
import clsx from 'clsx';
import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import palette from 'styles/palette';

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
  color: ${palette.white};
  padding-left: 2rem;
`;

const Spacing = styled.div`
  width: 100%;
`;

export const Spacing1 = styled(Spacing)`
  height: 1rem;
`;

export const SubscriptionPaymentViewContainer = styled.div`
  margin: 0 auto;
  max-width: 1200px;
  padding: 3rem;
  width: 1200px;

  && * {
    font-family: 'Montserrat', sans-serif;
  }
`;

const InnerBillingButton = ({ classes, variant, fullWidth, ...props }) => {
  const className = clsx(
    classes.root,
    classes[variant],
    fullWidth && classes.fullWidth,
  );

  return <ButtonBase className={className} {...props} />;
};

export const BillingButton = styled(InnerBillingButton)`
  &&& {
    &.MuiButtonBase-root {
      border-radius: 0.25rem;
      height: 3rem;
      padding: 0.25rem 2.5rem;
      margin-left: 1rem;
    }

    &.MuiButtonBase-contained {
      background-color: ${palette.darkBlue};
      color: ${palette.white};
    }

    &.MuiButtonBase-outlined {
      color: ${palette.darkBlue};
    }

    &.MuiButtonBase-fullWidth {
      width: 100%;
    }
  }
`;

export const PricingGridContainer = styled.div`
  background-color: ${palette.coolGrey4};
  border: 0.0625rem solid ${palette.unknownGrey4};
  border-radius: 0.25rem;
  display: grid;
  grid-column-gap: 1rem;
  grid-template-columns: 0.75fr auto 1fr;
  padding: 2rem;
`;

export const PricingItemDivider = styled.div`
  background-color: ${palette.unknownGrey6};
  grid-column-start: 1;
  grid-column-end: 4;
  height: 0.0625rem;
  width: 100%;
`;

export const PricingItemVerticallyExpanded = styled.div`
  grid-row-start: 1;
  grid-row-end: 4;
`;

export const Anchor = styled.a`
  color: ${palette.cyanBlue};
  filter: brightness(1);
  transition: all 0.25s ease-out;

  &:hover {
    color: ${palette.cyanBlue};
    filter: brightness(1.35);
  }
`;

export const StyledLink = styled(Link)`
  color: ${palette.cyanBlue};
  filter: brightness(1);
  transition: all 0.25s ease-out;

  &:hover {
    color: ${palette.cyanBlue};
    filter: brightness(1.35);
  }
`;

export const DarkBlueTextContainer = styled.div`
  color: ${palette.darkBlue};
`;
