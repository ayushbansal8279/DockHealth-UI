import React, { useEffect, useRef, useState } from 'react';
import { StyledDashboardTab, NewTasksIndicator } from './styled';
import { DashboardTabHighlight } from '../DashboardToolbar/styled';

const DashboardTab = ({ label, isSelected, onClick, showNewIndicator }) => {
  const labelReference = useRef(null);
  const [highlightPosition, setHighlightPosition] = useState({
    width: 0,
    left: 0,
  });

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
    <>
      <StyledDashboardTab
        ref={labelReference}
        onClick={onClick}
        isSelected={isSelected}
      >
        {showNewIndicator && <NewTasksIndicator />}
        {label}
      </StyledDashboardTab>
      <DashboardTabHighlight {...highlightPosition} />
    </>
  );
};

export default DashboardTab;
