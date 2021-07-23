import React from 'react';
import MuiTooltip from '@material-ui/core/Tooltip';
import { bool, node, oneOf, oneOfType, string } from 'prop-types';
import { useTooltipStyles } from './styled';

const Tooltip = ({
  children,
  title,
  placement,
  arrow = true,
  hideTooltip = false,
}) => {
  const classes = useTooltipStyles({ hideTooltip: hideTooltip || !title });

  return (
    <MuiTooltip
      title={title}
      placement={placement}
      arrow={arrow}
      classes={classes}
      disablePortal
    >
      {children}
    </MuiTooltip>
  );
};

Tooltip.propTypes = {
  children: node.isRequired,
  title: oneOfType([string, node]).isRequired,
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
