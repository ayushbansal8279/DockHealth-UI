/* eslint-disable import/prefer-default-export */
import styled from 'styled-components';
import { Button } from '@material-ui/core';
import spacing from 'styles/spacing';
import { fontWeights } from 'styles/font';

export const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

export const Row = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;

  & > * {
    flex: 1;
  }
`;

export const StyledButton = styled(Button)`
  && {
    font-weight: ${fontWeights.light};
    width: 100%;
    margin: ${spacing.huge} ${spacing.smallPlus} ${spacing.large};
  }
`;
