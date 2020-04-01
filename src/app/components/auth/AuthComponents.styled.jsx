import { Button, Grid, Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import React from 'react';
import { Link } from 'react-router';
import styled from 'styled-components';
import palette from '../../palette';
import { MontserratTypography } from '../../theme-montserrat';

const TypographyCustomComponent = ({
  classes,
  variant,
  isSmallScreen,
  ...props
}) => {
  const className = clsx(
    classes.root,
    isSmallScreen && classes.smallScreen,
    classes[variant],
  );

  return <Typography className={className} {...props} />;
};

export const TitleTypography = withStyles({
  root: {
    color: palette.greyBlue,
    width: '100%',
  },
  smallScreen: {
    fontSize: '2.25rem',
  },
  h2: {
    fontSize: '150%',
    fontWeight: 'bold',
    marginBottom: '0.5em',
  },
  h4: {
    fontSize: '100%',
    fontWeight: 'normal',
    lineHeight: '1.25',
  },
})(TypographyCustomComponent);

export const NextButton = styled(({ children, ...props }) => (
  <Button {...props}>
    <MontserratTypography variant="h4" weight="600" color="inherit">
      {children}
    </MontserratTypography>
  </Button>
))`
  && {
    background: linear-gradient(
      to top right,
      ${palette.brightBlue},
      ${palette.darkBlue}
    );
    border-radius: 0;
    color: ${palette.white};
    cursor: pointer;
    font-size: 1.25rem;
    filter: brightness(1);
    min-height: 3.125rem;
    position: relative;
    text-transform: uppercase;
    transition: all 0.25s ease-out;
    width: 100%;

    &::before {
      background: linear-gradient(
        to bottom left,
        ${palette.brightBlue},
        ${palette.darkBlue}
      );
      content: '';
      height: 100%;
      left: 0;
      opacity: 0;
      position: absolute;
      top: 0;
      transition: all 0.25s ease-out;
      width: 100%;
      z-index: -100;
    }

    &:hover, &:active, &:focus, &:focus-within: {
      filter: brightness(1.1);
    }

    &:hover {
      &::before {
        opacity: 1;
      }
    }
  }
`;

export const StyledLink = styled(Link)`
  color: ${palette.darkBlue};
  filter: brightness(1);
  text-decoration: underline;
  transition: all 0.25s ease-out;

  &:hover {
    color: ${palette.darkBlue};
    filter: brightness(1.25);
  }
`;

export const StyledLabel = styled.div`
  font-family: 'Open Sans', sans-serif;
  font-size: ${props => props.remFontSize || 1}rem;
  font-weight: ${props => (props.bold ? 600 : 'normal')};

  & > a {
    color: ${palette.cyanBlue};

    &:hover {
      color: ${palette.lighterCyanBlue};
    }
  }
`;

export const FieldItemContainer = styled.div`
  min-height: 10.5rem;
`;

export const BottomGridContainer = styled(Grid)`
  && {
    align-items: flex-start;
    display: flex;
    flex: 1;
    flex-flow: column wrap;
    justify-content: flex-end;
  }
`;

export const StyledForm = styled.form`
  display: flex;
  flex: 1;
  flex-direction: column;
  width: 100%;
`;

export const HeightDependentGrid = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  flex-basis: ${props => (100 * props.size) / 12}%;
  max-width: ${props => (100 * props.size) / 12}%;
`;

const Spacing = styled.div`
  width: 100%;
`;

export const Spacing1 = styled(Spacing)`
  height: 0.25rem;
`;

export const Spacing2 = styled(Spacing)`
  height: 0.5rem;
`;

export const Spacing3 = styled(Spacing)`
  height: 1rem;
`;

export const Spacing4 = styled(Spacing)`
  height: 2rem;
`;

export const Spacing5 = styled(Spacing)`
  height: 4rem;
`;
