import { PopperProps } from '@material-ui/core';
import React, { useRef } from 'react';
import styled from 'styled-components';
import useBoolean from 'hooks/useBoolean';
import UniversalTooltip from './UniversalTooltip';

interface UniversalTooltipContainerProps extends PopperProps {
  label?: React.ReactNode;
  disabled?: boolean;
}

const ElementWrapper: any = styled.div`
  display: inline-block;
`;

const UniversalTooltipContainer = ({
  children,
  label,
  open,
  disabled,
  ...props
}: UniversalTooltipContainerProps) => {
  const [isTooltipShown, showTooltip, hideTooltip] = useBoolean(false);
  const popoverReference = useRef(null);

  return (
    <>
      {label !== '' && (
        <UniversalTooltip
          anchorEl={popoverReference.current}
          open={disabled ? false : open || isTooltipShown}
          {...props}
        >
          {label}
        </UniversalTooltip>
      )}
      <ElementWrapper
        ref={popoverReference}
        onMouseEnter={label ? showTooltip : null}
        onMouseLeave={hideTooltip}
      >
        {children}
      </ElementWrapper>
    </>
  );
};

export default UniversalTooltipContainer;
