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
        left: labelReference?.current?.offsetLeft,
      });
    }
  }, [
    labelReference,
    setHighlightPosition,
    isSelected,
    showNewIndicator,
    label,
  ]);

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
