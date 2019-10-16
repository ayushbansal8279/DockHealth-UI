import ButtonBase from '@material-ui/core/ButtonBase';
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
  const className = `${active ? classes.active : classes.inactive} ${classes.root}`;

  return <ButtonBase disabled={!active} className={className} {...props} />;
};

NextButtonComponent.propTypes = {
  active: bool.isRequired,
};

export const NextButton = withStyles({
  root: {
    borderRadius: 4,
    fontFamily: '"Open Sans", sans-serif',
    fontSize: 20,
    fontWeight: 'bold',
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
  ${props => props.marginTop && 'margin-top: 2em'};
`;
