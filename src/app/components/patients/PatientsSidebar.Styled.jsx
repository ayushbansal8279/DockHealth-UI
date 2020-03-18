import styled from 'styled-components';
import React from 'react';

import { ButtonBase, IconButton } from '@material-ui/core';
import { omit } from 'ramda';

export const PatientsSidebarContainer = styled.div`
  padding: 4px;
`;

export const PatientsSidebarHeader = styled.div`
  display: flex;
  position: relative;
  height: 67px;
  background: #2a4a70;
  box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.24), 0 0 4px 0 rgba(0, 0, 0, 0.12);
  color: #fff;
  font-size: 24px;
  font-weight: 600;
  padding: 15px 13.5px 19px 27px;
`;

export const PatientsSidebarName = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const PatientsSidebarSectionContainer = styled.div`
  border: solid 2px #ddf2f7;
  background: #fff;
  padding: 18px 27px 27px 24px;

  :not(:first-child) {
    margin-top: 4px;
  }
`;

export const PatientsSidebarSectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const PatientsSidebarSectionHeading = styled.div`
  font-size: 24px;
  font-weight: 600;
  color: #0ca1c7;
`;

export const PatientsSidebarField = styled.div`
  border-radius: 2px;
  background-color: rgba(243, 245, 246, 0.5);
  display: flex;
  justify-content: space-between;
  padding: 10px 22px 10px 14px;
  margin-top: 9px;
`;

export const PatientsSidebarSubsection = styled.div`
  border-top: solid 1px #a6dcea;
  margin-top: 22px;

  margin-left: -11px;
  margin-right: -11px;
  padding-left: 11px;
  padding-right: 11px;
`;

export const PatientsSidebarSubsectionHeading = styled.div`
  font-size: 14px;
  font-weight: bold;
  line-height: 36px;
  color: #0ca1c7;
`;

export const PatientsSidebarNoteDescription = styled.div`
  font-size: 14px;
  color: #303538;
`;

export const PatientsSidebarContact = styled.div`
  display: flex;
  padding: 8px;
  width: 278px;
  height: 81px;
  border-radius: 2px;
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.24), 0 0 2px 0 rgba(0, 0, 0, 0.12);
  border-style: solid;
  border-width: 0.5px;
  border-image-source: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0),
    rgba(0, 0, 0, 0) 80%,
    rgba(0, 0, 0, 0.02) 95%,
    rgba(0, 0, 0, 0.04)
  );
  border-image-slice: 1;
  background-image: #ffffff,
    linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0),
      rgba(0, 0, 0, 0) 80%,
      rgba(0, 0, 0, 0.02) 95%,
      rgba(0, 0, 0, 0.04)
    );
  background-origin: border-box;
  background-clip: content-box, border-box;
`;

export const PatientsSidebarContactNumber = styled.div`
  font-size: 16px;
  color: rgba(0, 0, 0, 0.87);
`;

export const PatientsSidebarContactCategory = styled.div`
  font-size: 14px;
  color: rgba(0, 0, 0, 0.54);
`;

export const PatientsSidebarCloseButton = styled(ButtonBase)`
  && {
    background: #ababb2;
    border-radius: 50%;
    color: #fff;
    font-size: 1.125rem;
    font-weight: bold;
    height: 2.25rem;
    margin-left: auto;
    min-height: 2.25rem;
    min-width: 2.25rem;
    width: 2.25rem;
  }
`;

export const StyledButton = styled(props => (
  <IconButton {...omit(['isCollapsed'], props)} />
))`
  && {
    height: 36px;
    width: 36px;
    padding: 0;
    ${({ isCollapsed }) => isCollapsed && 'transform: rotate(180deg);'}
  }
`;

export const PatientsSidebarValue = styled.div`
  font-weight: 600;
`;
