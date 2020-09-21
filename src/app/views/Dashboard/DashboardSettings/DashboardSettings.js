import React, { useRef, useState } from 'react';
import { Popover } from '@material-ui/core';
import { updateUserDashboardPrefs } from 'api/user-api';
import DashboardSettingsIcon from 'img/dashboard-settings-icon';
import {
  DashboardSettingsContainer,
  DashboardSettingsHeader,
  DashboardSettingsInputBox,
  DashboardSettingsInput,
  DashboardSettingsLabel,
  DashboardSettingsIcon as StyledDashboardSettingsIcon,
} from './styled';

const DashboardSettings = ({ setDynamicColumnType, dynamicColumnType }) => {
  const iconReference = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Popover
        style={{ zIndex: 2001 }}
        anchorEl={iconReference?.current}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <DashboardSettingsContainer>
          <DashboardSettingsHeader>
            Which column would you like to see?
          </DashboardSettingsHeader>
          <DashboardSettingsInputBox>
            <DashboardSettingsInput
              id="patient-radio"
              type="radio"
              checked={dynamicColumnType === 'PATIENT'}
              onClick={() => {
                setDynamicColumnType('PATIENT');
                updateUserDashboardPrefs('PATIENT');
                setIsOpen(false);
              }}
            />
            <DashboardSettingsLabel htmlFor="patient-radio">
              Patient
            </DashboardSettingsLabel>
          </DashboardSettingsInputBox>
          <DashboardSettingsInputBox>
            <DashboardSettingsInput
              id="due-date-radio"
              type="radio"
              checked={dynamicColumnType === 'DUE_DATE'}
              onClick={() => {
                setDynamicColumnType('DUE_DATE');
                updateUserDashboardPrefs('DUE_DATE');
                setIsOpen(false);
              }}
            />
            <DashboardSettingsLabel htmlFor="due-date-radio">
              Due Date
            </DashboardSettingsLabel>
          </DashboardSettingsInputBox>
          <DashboardSettingsInputBox>
            <DashboardSettingsInput
              id="status-radio"
              type="radio"
              checked={dynamicColumnType === 'STATUS'}
              onClick={() => {
                setDynamicColumnType('STATUS');
                updateUserDashboardPrefs('STATUS');
                setIsOpen(false);
              }}
            />
            <DashboardSettingsLabel htmlFor="status-radio">
              Status
            </DashboardSettingsLabel>
          </DashboardSettingsInputBox>
        </DashboardSettingsContainer>
      </Popover>
      <StyledDashboardSettingsIcon
        ref={iconReference}
        src={DashboardSettingsIcon}
        alt="settings"
        onClick={() => setIsOpen(!isOpen)}
      />
    </>
  );
};

export default DashboardSettings;
