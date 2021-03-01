import React from 'react';
import { bool, node, oneOf, string } from 'prop-types';
import { StyledMaterialTooltip, Container } from './styled';

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
      <Container>{children}</Container>
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
