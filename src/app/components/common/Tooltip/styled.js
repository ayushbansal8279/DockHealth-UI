import { makeStyles } from '@material-ui/core/styles';
import { fontSizes, fontWeights } from 'styles/font';
import spacing from 'styles/spacing';
import palette from 'styles/palette';
import zIndex from 'styles/z-index';

export const useTooltipStyles = makeStyles({
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
});
