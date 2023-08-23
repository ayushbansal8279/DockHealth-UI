import React from 'react';
// import MuiTooltip from '@mui/material/Tooltip';
import { bool, node, oneOf, oneOfType, string } from 'prop-types';
import { MuiTooltip } from './styled';

const Tooltip = ({
  children,
  title,
  placement,
  arrow = true,
  // hideTooltip = false,
}) => {
  return title ? (
    <MuiTooltip
      // enterDelay={hideTooltip ? 200 : 100}
      title={title}
      placement={placement}
      arrow={arrow}
    >
      {children}
    </MuiTooltip>
  ) : (
    children
  );
};

Tooltip.propTypes = {
  children: node.isRequired,
  title: oneOfType([string, node]),
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
  title: null,
  placement: 'bottom',
  arrow: true,
  hideTooltip: false,
};

export default Tooltip;
