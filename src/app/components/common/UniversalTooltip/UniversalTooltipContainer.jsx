import React, { useRef } from 'react';
import useBoolean from 'hooks/useBoolean';
import UniversalTooltip from './UniversalTooltip';
import { ElementWrapper } from './styled';

const UniversalTooltipContainer = ({
  children,
  label,
  open,
  disabled,
  ...props
}) => {
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
