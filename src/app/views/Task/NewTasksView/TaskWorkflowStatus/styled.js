import styled from 'styled-components';
import { Popover } from '@material-ui/core';
import palette from 'styles/palette';
import spacing from 'styles/spacing';
import { fontSizes, fontWeights } from 'styles/font';
import { prop } from 'ramda';

export const StyledPopover = styled(Popover)`
  min-width: 230px;
`;

export const Box = styled.div`
  max-height: 260px;
  overflow-y: scroll;
`;

export const StatusBox = styled.div`
  display: flex;
  flex-direction: column;
  font-size: ${fontSizes.smallPlus};
  font-weight: ${fontWeights.regularPlus};
  border-bottom: 1px solid rgba(193, 204, 218, 0.25);
  padding: ${spacing.small} 0;
`;

export const StatusList = styled.div`
  display: flex;
  flex-direction: column;
`;

export const StatusLabelContainer = styled.div`
  align-items: center;
  color: ${palette.coolGrey1};
  cursor: pointer;
  display: grid;
  grid-gap: 0.75rem;
  grid-template-columns: 0.25rem 1fr;
  padding: 0.5rem 0.75rem;

  &:hover {
    background-color: ${palette.coolGrey4};

    && > * {
      font-weight: bold;
    }
  }
`;

export const StatusFlag = styled.div`
  background-color: ${prop('color')};
  height: 1.25rem;
  width: 0.25rem;
`;

export const StatusFlagContainer = styled.div`
  left: -0.25rem;
  position: absolute;
  top: calc(50% + 0.625rem);
  transform: translate(-100%, -50%);
`;
