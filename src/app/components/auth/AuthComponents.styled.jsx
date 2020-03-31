import { ButtonBase, Grid, Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import { bool } from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import palette from '../../palette';

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

const NextButtonComponent = ({ active, classes, ...props }) => {
  const className = `${active ? classes.active : classes.inactive} ${
    classes.root
  }`;

  return <ButtonBase disabled={!active} className={className} {...props} />;
};

NextButtonComponent.propTypes = {
  active: bool.isRequired,
};

export const NextButton = withStyles({
  root: {
    borderRadius: 4,
    filter: 'brightness(1)',
    fontSize: '1.1em',
    fontWeight: 'bold',
    marginTop: '1.5rem',
    padding: '13px 0 14px',
    width: '100%',
  },
  active: {
    backgroundColor: palette.cyanBlue,
    color: palette.white,
    cursor: 'pointer',
    '&:hover, &:active, &:focus, &:focus-within': {
      color: palette.lightGrey,
    },
  },
  inactive: {
    backgroundColor: palette.cyanBlue,
    filter: 'brightness(1.2)',
  },
})(NextButtonComponent);

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
