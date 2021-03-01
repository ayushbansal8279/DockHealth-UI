import React from 'react';
import MaterialTooltip from '@material-ui/core/Tooltip';
import { withStyles } from '@material-ui/core/styles';
import { fontSizes, fontWeights } from 'styles/font';
import spacing from 'styles/spacing';
import palette from 'styles/palette';
import { bool, node, oneOf, string } from 'prop-types';

const StyledMaterialTooltip = withStyles({
  popper: {
    opacity: ({ hideTooltip }) => (hideTooltip ? 0 : 1),
    transition: 'opacity .2s ease-out',
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

const Tooltip = ({
  children,
  title,
  placement,
  arrow = true,
  hideTooltip = false,
}) => {
  return (
    <StyledMaterialTooltip
      title={title}
      placement={placement}
      arrow={arrow}
      hideTooltip={hideTooltip || !title}
    >
      <div>{children}</div>
    </StyledMaterialTooltip>
  );
};

Tooltip.propTypes = {
  children: node.isRequired,
  title: string.isRequired,
  placement: oneOf([
    'bottom-end',
    'bottom-start',
    'bottom',
    'left-end',
    'left-start',
    'left',
    'right-end',
    'right-start',
    'right',
    'top-end',
    'top-start',
    'top',
  ]),
  arrow: bool,
  hideTooltip: bool,
};

Tooltip.defaultProps = {
  placement: 'bottom',
  arrow: true,
  hideTooltip: false,
};

export default Tooltip;
