import React, { useEffect, useRef } from 'react';
import { StyledDashboardTab } from './styled';

const DashboardTab = ({ label, setHighlightPosition, isSelected, onClick }) => {
  const labelReference = useRef(null);

  useEffect(() => {
    if (isSelected) {
      setHighlightPosition({
        width: labelReference?.current?.offsetWidth,
        left: labelReference?.current?.offsetLeft,
      });
    }
  }, [labelReference, setHighlightPosition, isSelected]);

  return (
    <StyledDashboardTab
      ref={labelReference}
      onClick={onClick}
      isSelected={isSelected}
    >
      {label}
    </StyledDashboardTab>
  );
};

export default DashboardTab;
