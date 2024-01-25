import prop from 'ramda/src/prop';
import styled from 'styled-components';
import { fontSizes, fontWeights } from 'styles/font';
import palette, { typography } from 'styles/palette';
import spacing from 'styles/spacing';
import { Popover } from '@mui/material';

export const StatusFlag = styled.div`
  background-color: ${prop('color')};
  height: 1.25rem;
  width: 0.25rem;
`;

export const StatusFieldContainer = styled.div`
  margin-left: 40px;
  width: 150px;
  display: flex;
`;

export const StatusFlagContainer = styled.div`
  margin-top: 2px;
  margin-right: 5px;
`;

export const StatusContainer = styled.div`
  display: flex;
  align-items: center;
  font-family: Outfit;
`;

export const Title = styled.div`
  margin-right: 40px;
  color: ${palette.coolGrey1};
  font-family: Outfit;
  font-size: ${fontSizes.smallPlus};
  font-weight: ${fontWeights.light};
  display: flex;
  align-items: center;
`;