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

export const DarkPopover = styled.div`
  display: block;
  top: 30px;
  left: 60px;
  padding: ${spacing.small};
  color: ${palette.white};
  background: ${palette.mediumGrey};
  z-index: 10;
  cursor: initial;
`;

export const LabelBig = styled.div`
  max-width: 850px;
  font-size: ${fontSizes.large};
  font-weight: ${fontWeights.regularPlus};
`;

export const LabelSmall = styled.div`
  max-width: 650px;
  font-size: ${fontSizes.smallPlus};
  font-weight: ${fontWeights.smallPlus};
`;

// export const DescriptionTooltip = styled.div`
//   display: ${({ isVisible }) => (isVisible ? 'block' : 'none')};
//   position: absolute;
//   top: 30px;
//   left: 60px;
//   max-width: 650px;
//   padding: ${spacing.small};
//   color: ${palette.white};
//   background: ${palette.mediumGrey};
//   z-index: 10;
//   font-size: ${fontSizes.smallPlus};
//   cursor: initial;
// `;
