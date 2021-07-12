import { Typography, Popover } from '@material-ui/core';
import styled from 'styled-components';
import palette from 'styles/palette';

import spacing from 'styles/spacing';
import { fontWeights, fontSizes } from 'styles/font';

export const StyledTitle = styled(Typography)`
  && {
    align-items: center;
    cursor: pointer;
    display: flex;
    filter: brightness(1);
    flex-flow: row nowrap;
    transition: filter 0.25s ease-out;
    width: 50%;
    &:hover {
      filter: brightness(1.25);
    }
  }
`;

export const HeaderTitleContainer = styled.div`
  flex: 1;
  overflow: hidden;
`;

export const TitleContainer = styled.div`
  font-size: 1.5rem;
  max-width: 32rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const ListDescription = styled.div`
  font-size: 12px;
  font-weight: 400;
  margin-top: -2px;
`;

export const RolloverPopover = styled(Popover)`
  && {
    pointer-events: none;
    transform: translateX(-${spacing.small});
  }
`;

export const RolloverPopoverLabel = styled.label`
  padding: 0 ${spacing.regular};
  font-size: ${fontSizes.large};
  font-weight: ${fontWeights.regular};
  color: ${palette.brightBlue};
  display: block;
`;

export const RolloverPopoverDescription = styled.label`
  padding: 0 ${spacing.regular};
  font-size: ${fontSizes.smallPlus};
  font-weight: ${fontWeights.light};
  color: ${palette.brightBlue};
  display: block;
`;
