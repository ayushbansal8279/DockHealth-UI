import React from 'react';
import { bool, node, oneOf, oneOfType, string } from 'prop-types';
import { MuiTooltip } from './styled';
import palette from '@/app/styles/palette';

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
}) => {
  return title ? (
    <MuiTooltip
      title={title}
      placement={placement}
      arrow={arrow}
      open={open}
      onClose={onClose}
      componentsProps={{
        tooltip: {
          sx: {
            color: 'black',
            backgroundColor: palette.whiteSmoke,
            fontSize: '14px',
            boxShadow: '0px 0px 10px 0px rgba(0, 0, 0, 0.15)',
            borderRadius: '4px',
          },
        },
        arrow: {
          sx: {
            color: palette.whiteSmoke,
          },
        },
      }}
    >
      {child ? (
        <MuiTooltip
          title={childTitle}
          placement={childPlacement}
          arrow={arrow}
          open={open}
          onClose={onClose}
          componentsProps={{
            tooltip: {
              sx: {
                color: 'black',
                backgroundColor: palette.whiteSmoke,
                fontSize: '14px',
                boxShadow: '0px 0px 10px 0px rgba(0, 0, 0, 0.15)',
                borderRadius: '4px',
              },
            },
            arrow: {
              sx: {
                color: palette.whiteSmoke,
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
};

Tooltip.defaultProps = {
  title: null,
  placement: 'bottom',
  arrow: true,
};

export default Tooltip;
