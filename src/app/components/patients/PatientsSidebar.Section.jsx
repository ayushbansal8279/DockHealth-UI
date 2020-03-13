import { ThemeProvider, Typography } from '@material-ui/core';
import Collapse from '@material-ui/core/Collapse';
import React, { useState } from 'react';
import styled from 'styled-components';
import CollapseIcon from '../../img/collapse.svg';
import themeMontserrat from '../../theme-montserrat';
import {
  PatientsSidebarSectionContainer,
  PatientsSidebarSectionHeader,
  StyledButton,
} from './PatientsSidebar.Styled';

const StyledCollapse = styled(Collapse)`
  && {
    width: 100%;
  }
`;

export default ({
  heading,
  headingVariant,
  children,
  hideCollapse = false,
  style,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const toggleIsCollapsed = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <PatientsSidebarSectionContainer style={style}>
      <PatientsSidebarSectionHeader>
        <ThemeProvider theme={themeMontserrat}>
          <Typography color="primary" variant={headingVariant ?? 'h3'}>
            {heading}
          </Typography>
        </ThemeProvider>
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
