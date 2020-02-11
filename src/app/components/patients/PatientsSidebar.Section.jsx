import React, { useState } from 'react';
import styled from 'styled-components';
import Collapse from '@material-ui/core/Collapse';
import CollapseIcon from '../../img/collapse.svg';
import {
  PatientsSidebarSectionContainer,
  PatientsSidebarSectionHeader,
  PatientsSidebarSectionHeading,
  StyledButton,
} from './PatientsSidebar.Styled';

const StyledCollapse = styled(Collapse)`
  && {
    width: 100%;
  }
`;

export default ({
  heading,
  children,
  hideCollapse = false,
  style,
  headingStyle,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const toggleIsCollapsed = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <PatientsSidebarSectionContainer style={style}>
      <PatientsSidebarSectionHeader>
        <PatientsSidebarSectionHeading style={headingStyle}>
          {heading}
        </PatientsSidebarSectionHeading>
        {!hideCollapse && (
          <StyledButton isCollapsed={isCollapsed} onClick={toggleIsCollapsed}>
            <img src={CollapseIcon} alt="Collapse Details" />
          </StyledButton>
        )}
      </PatientsSidebarSectionHeader>
      <StyledCollapse in={!isCollapsed}>{children}</StyledCollapse>
    </PatientsSidebarSectionContainer>
  );
};
