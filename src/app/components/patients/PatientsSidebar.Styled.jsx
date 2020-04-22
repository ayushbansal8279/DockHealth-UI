import { IconButton } from '@material-ui/core';
import { omit } from 'ramda';
import React from 'react';
import styled from 'styled-components';
import palette, { opacify } from 'styles/palette';
import { MontserratTypography } from 'styles/theme-montserrat';

export const PatientsSidebarContainer = styled.div`
  padding: 4px;
`;

export const PatientsSidebarHeader = styled.div`
  align-items: center;
  background-color: ${palette.midnightBlue};
  box-shadow: 0 4px 4px 0 ${opacify(palette.black, 0.24)},
    0 0 4px 0 ${opacify(palette.black, 0.12)};
  color: ${palette.white};
  display: flex;
  font-size: 1.5rem;
  font-weight: 600;
  height: 67px;
  padding: 0.25rem 1.5rem;
  position: relative;
`;

export const PatientsSidebarName = styled(MontserratTypography)`
  && {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

export const PatientsSidebarSectionContainer = styled.div`
  border: solid 2px ${palette.unknownGrey2};
  background: ${palette.white};
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
  color: ${palette.lighterCyanBlue};
`;

export const PatientsSidebarField = styled.div`
  border-radius: 2px;
  background-color: ${opacify(palette.lightGrey, 0.5)};
  display: flex;
  justify-content: space-between;
  padding: 10px 22px 10px 14px;
  margin-top: 9px;
`;

export const PatientsSidebarSubsection = styled.div`
  border-top: solid 1px ${palette.softCyan};
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
  color: ${palette.lighterCyanBlue};
`;

export const PatientsSidebarNoteDescription = styled.div`
  font-size: 14px;
  color: ${palette.unknownGrey1};
`;

export const PatientsSidebarContact = styled.div`
  display: flex;
  padding: 8px;
  width: 278px;
  height: 81px;
  border-radius: 2px;
  box-shadow: 0 2px 2px 0 ${opacify(palette.black, 0.24)},
    0 0 2px 0 ${opacify(palette.black, 0.12)};
  border-style: solid;
  border-width: 0.5px;
  border-image-source: linear-gradient(
    to bottom,
    ${opacify(palette.black, 0)},
    ${opacify(palette.black, 0)} 80%,
    ${opacify(palette.black, 0.02)} 95%,
    ${opacify(palette.black, 0.04)}
  );
  border-image-slice: 1;
  background-image: ${palette.white},
    linear-gradient(
      to bottom,
      ${opacify(palette.black, 0)},
      ${opacify(palette.black, 0)} 80%,
      ${opacify(palette.black, 0.02)} 95%,
      ${opacify(palette.black, 0.04)}
    );
  background-origin: border-box;
  background-clip: content-box, border-box;
`;

export const PatientsSidebarContactNumber = styled.div`
  font-size: 16px;
  color: ${opacify(palette.black, 0.87)};
`;

export const PatientsSidebarContactCategory = styled.div`
  font-size: 14px;
  color: ${opacify(palette.black, 0.54)};
`;

export const PatientsSidebarCloseButton = styled(IconButton)`
  && {
    color: ${palette.white};
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
