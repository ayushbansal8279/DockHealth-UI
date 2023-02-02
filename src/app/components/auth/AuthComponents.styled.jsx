import { Grid, Typography } from '@mui/material';
import clsx from 'clsx';
import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import palette from 'styles/palette';

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

export const TitleTypography = styled(TypographyCustomComponent)`
  &&& {
    &.MuiTypography-root {
      color: ${palette.greyBlue};
      width: '100%';
    }

    &.smallScreen {
      font-size: '2.25rem';
    }

    &.MuiTypography-h2 {
      font-size: '150%';
      font-weight: 'bold';
      margin-bottom: '0.5em';
    }

    &.MuiTypography-h4 {
      font-size: '100%';
      font-weight: 'normal';
      line-height: '1.25';
    }
  }
`;

export const StyledAnchorDiv = styled.div`
  color: ${palette.darkBlue};
  cursor: pointer;
  display: inline-block;
  filter: brightness(1);
  text-decoration: underline;
  transition: all 0.25s ease-out;

  &:hover {
    color: ${palette.darkBlue};
    filter: brightness(1.25);
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

export const StyledHyperLink = styled.a`
  color: ${palette.darkBlue};

  &:hover,
  &:active,
  &:focus {
    color: ${palette.darkBlue};
  }
`;

export const StyledLabel = styled.div`
  font-family: 'Open Sans', sans-serif;
  font-size: ${(props) => props.remFontSize || 1}rem;
  font-weight: ${(props) => (props.bold ? 600 : 'normal')};

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
  flex-basis: ${(props) => (100 * props.size) / 12}%;
  max-width: ${(props) => (100 * props.size) / 12}%;
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
