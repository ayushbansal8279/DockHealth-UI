import MaterialTooltip from '@material-ui/core/Tooltip';
import styled from 'styled-components';
import { withStyles } from '@material-ui/core/styles';
import { fontSizes, fontWeights } from 'styles/font';
import spacing from 'styles/spacing';
import palette from 'styles/palette';
import zIndex from 'styles/z-index';

export const StyledMaterialTooltip = withStyles({
  popper: {
    opacity: ({ hideTooltip }) => (hideTooltip ? 0 : 1),
    transition: 'opacity .2s ease-out',
    zIndex: zIndex.tooltip,
  },
  tooltip: {
    borderRadius: 0,
    fontSize: fontSizes.smallPlus,
    fontWeight: fontWeights.light,
    padding: `${spacing.tiny} ${spacing.smallPlus}`,
    backgroundColor: palette.mediumGrey,
  },
  arrow: {
    color: palette.mediumGrey,
  },
})(MaterialTooltip);

export const Container = styled.div`
  display: inline-block;
  overflow: hidden;
`;
