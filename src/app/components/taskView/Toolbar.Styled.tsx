import {
  Grid,
  IconButton,
  IconButtonProps,
  Typography,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import React from 'react';
import styled from 'styled-components';

const StyledSwitchContainer = withStyles({
  root: {
    border: '0.125rem solid #fdad00',
    height: '2rem',
    padding: '0.25rem',
    width: '2rem',
  },
})(IconButton);

const SwitchDash = styled.div`
  background-color: #00a2e5;
  border-radius: 0.125rem;
  height: 0.125rem;
  margin: 0.0625rem 0;
  width: 100%;
`;

interface SlimViewToggleProps extends IconButtonProps {
  slimView: boolean;
}

export const SlimViewToggle = ({ slimView, ...props }: SlimViewToggleProps) => (
  <StyledSwitchContainer {...props}>
    <Grid container direction="column" justify="center" alignItems="center">
      <SwitchDash />
      <SwitchDash />
      {!slimView && <SwitchDash />}
    </Grid>
  </StyledSwitchContainer>
);

export const ToolbarLabel = withStyles({
  root: {
    color: '#00A2E5',
    display: 'inline-block',
  },
})(Typography);
