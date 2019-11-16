import ButtonBase from '@material-ui/core/ButtonBase';
import Grid from '@material-ui/core/Grid';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import { bool } from 'prop-types';
import React from 'react';
import styled from 'styled-components';

export const TitleTypography = styled(Typography)`
  && {
    color: #2e3a43;
    width: 100%;
  }
`;

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
    fontFamily: '"Open Sans", sans-serif',
    fontSize: '1.1em',
    fontWeight: 'bold',
    marginTop: '1.5rem',
    padding: '13px 0 14px',
    width: '100%',
  },
  active: {
    backgroundColor: '#007cab',
    color: '#fff',
    cursor: 'pointer',
  },
  inactive: {
    backgroundColor: '#125375',
    color: '#ffffff80',
  },
})(NextButtonComponent);

export const StyledLabel = styled.div`
  font-family: 'Open Sans', sans-serif;
  font-size: 1rem;
  font-weight: ${props => (props.bold ? 600 : 'normal')};

  & > a {
    color: #007cab;

    &:hover {
      color: #0ca1c7;
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
  width: '100%';
`;

export const HeightDependentGrid = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-basis: ${props => (100 * props.sm) / 12}%;
  max-width: ${props => (100 * props.sm) / 12}%;

  @media screen and (min-width: 959.95px) and (min-height: 845.95px) {
    flex-basis: ${props => (100 * props.md) / 12}%;
    max-width: ${props => (100 * props.md) / 12}%;
  }
`;
