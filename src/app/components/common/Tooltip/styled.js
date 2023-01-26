import { fontSizes, fontWeights } from 'styles/font';
import spacing from 'styles/spacing';
import palette from 'styles/palette';
import zIndex from 'styles/z-index';
import Tooltip from '@mui/material/Tooltip';
import styled from 'styled-components';

export const MuiTooltip = styled(Tooltip)`
  &&& {
    .MuiTooltip-popper {
      opacity: ${({ hideTooltip }) => (hideTooltip ? 0 : 1)};
      transition: opacity 0.2s ease-out;
      z-index: ${zIndex.tooltip};
    }

    .MuiTooltip-tooltip {
      border-radius: 0;
      font-size: ${fontSizes.smallPlus};
      font-weight: ${fontWeights.light};
      padding: ${`${spacing.tiny} ${spacing.smallPlus}`};
      background-color: ${palette.mediumGrey};
    }

    .MuiTooltip-arrow {
      color: ${palette.mediumGrey};
    }
  }
`;
