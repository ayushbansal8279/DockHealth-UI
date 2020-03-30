import { IconButton } from '@material-ui/core';
import { omit } from 'ramda';
import React from 'react';
import styled from 'styled-components';
import { MontserratTypography } from '../../theme-montserrat';

export const PatientsSidebarContainer = styled.div`
  padding: 4px;
`;

export const PatientsSidebarHeader = styled.div`
  align-items: center;
  display: flex;
  position: relative;
  height: 67px;
  background: #213a56;
  box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.24), 0 0 4px 0 rgba(0, 0, 0, 0.12);
  color: #fff;
  font-size: 24px;
  font-weight: 600;
  padding: 0.25rem 1.5rem;
`;

export const PatientsSidebarName = styled(MontserratTypography)`
  && {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

export const PatientsSidebarSectionContainer = styled.div`
  border: solid 2px #ddf2f7;
  background: #fff;
  padding: 1.5rem;

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

export const PatientsSidebarCloseButton = styled(IconButton)`
  && {
    color: #fff;
    font-size: 1.125rem;
    margin-left: auto;
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
