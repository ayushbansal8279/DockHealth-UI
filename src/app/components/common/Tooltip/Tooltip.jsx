import React from 'react';
// import MuiTooltip from '@mui/material/Tooltip';
import { bool, node, oneOf, oneOfType, string } from 'prop-types';
import { MuiTooltip } from './styled';

const Tooltip = ({
  children,
  title,
  placement,
  arrow = true,
  open,
  onClose,
  child,
  childTitle,
  childPlacement,
  // hideTooltip = false,
}) => {
  return title ? (
    <MuiTooltip
      // enterDelay={hideTooltip ? 200 : 100}
      title={title}
      placement={placement}
      arrow={arrow}
      open={open}
      onClose={onClose}
      componentsProps={{
        tooltip: {
          sx: {
            color: 'black',
            backgroundColor: 'white',
            fontSize: '16px',
            boxShadow: '0px 0px 10px 0px rgba(0, 0, 0, 0.15)',
            borderRadius: '4px',
          },
        },
        arrow: {
          sx: {
            color: 'white',
          },
        },
      }}
    >
      {child ? (
        <MuiTooltip
          // enterDelay={hideTooltip ? 200 : 100}
          title={childTitle}
          placement={childPlacement}
          arrow={arrow}
          open={open}
          onClose={onClose}
          componentsProps={{
            tooltip: {
              sx: {
                color: 'black',
                backgroundColor: 'white',
                fontSize: '16px',
                boxShadow: '0px 0px 10px 0px rgba(0, 0, 0, 0.15)',
                borderRadius: '4px',
              },
            },
            arrow: {
              sx: {
                color: 'white',
              },
            },
          }}
        >
          {children}
        </MuiTooltip>
      ) : (
        children
      )}
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
