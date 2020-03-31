import {
  Grid,
  IconButton,
  IconButtonProps,
  Typography,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import React from 'react';
import styled from 'styled-components';
import palette from '../../palette';

const StyledSwitchContainer = withStyles({
  root: {
    border: `0.125rem solid ${palette.coolGrey1}`,
    height: '2rem',
    padding: '0.25rem',
    width: '2rem',
  },
})(IconButton);

const SwitchDash = styled.div`
  background-color: ${palette.oPlusRed};
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
    color: palette.coolGrey1,
    display: 'inline-block',
  },
})(Typography);

export const ToolbarAvatarContainer = styled.div`
  align-items: center;
  border: 0.125rem solid ${palette.white};
  border-radius: 100%;
  display: flex;
  height: 100%;
  justify-content: center;
  overflow: hidden;
  width: 100%;
`;

export const MoreMembersButtonContainer = styled.div`
  align-items: center;
  border: 0.125rem solid ${palette.brightBlue};
  border-radius: 2.5rem;
  color: ${palette.brightBlue};
  display: flex;
  font-size: 0.875rem;
  font-weight: 300;
  height: 2.5rem;
  justify-content: center;
  line-height: 1;
  min-height: 2.5rem;
  min-width: 2.5rem;
  padding: 0;
  width: 2.5rem;
`;
