import React, { useEffect, useRef } from 'react';
import { StyledDashboardTab, NewTasksIndicator } from './styled';

const DashboardTab = ({
  label,
  setHighlightPosition,
  isSelected,
  onClick,
  showNewIndicator,
}) => {
  const labelReference = useRef(null);

  useEffect(() => {
    if (isSelected) {
      setHighlightPosition({
        width: labelReference?.current?.offsetWidth,
        left:
          label === 'My Tasks'
            ? labelReference?.current?.offsetLeft
            : labelReference?.current?.offsetLeft + 15,
      });
    }
  }, [labelReference, setHighlightPosition, isSelected]);

  return (
    <StyledDashboardTab
      ref={labelReference}
      onClick={onClick}
      isSelected={isSelected}
    >
      {showNewIndicator && <NewTasksIndicator />}
      {label}
    </StyledDashboardTab>
  );
};

export default DashboardTab;
