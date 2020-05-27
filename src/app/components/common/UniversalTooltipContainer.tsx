import { PopperProps } from '@material-ui/core';
import React, { useRef } from 'react';
import useBoolean from 'hooks/useBoolean';
import UniversalTooltip from './UniversalTooltip';

interface UniversalTooltipContainerProps extends PopperProps {
  label?: React.ReactNode;
}

const UniversalTooltipContainer = ({
  children,
  label,
  ...props
}: UniversalTooltipContainerProps) => {
  const [isTooltipShown, showTooltip, hideTooltip] = useBoolean(false);
  const popoverReference = useRef(null);

  return (
    <>
      {label !== '' && (
        <UniversalTooltip
          anchorEl={popoverReference.current}
          open={isTooltipShown}
          {...props}
        >
          {label}
        </UniversalTooltip>
      )}
      <div
        ref={popoverReference}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
      >
        {children}
      </div>
    </>
  );
};

export default UniversalTooltipContainer;
