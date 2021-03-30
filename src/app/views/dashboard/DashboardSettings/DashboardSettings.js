import React, { useRef, useState, useCallback } from 'react';
import { Popover } from '@material-ui/core';
import { updateUserDashboardPrefs } from 'api/user-api';
import DashboardSettingsIcon from 'img/settings-icon';
import Checkbox from 'components/common/Checkbox/Checkbox';

import {
  DashboardSettingsContainer,
  DashboardSettingsHeader,
  DashboardSettingsOption,
  DashboardSettingsLabel,
  DashboardSettingsIcon as StyledDashboardSettingsIcon,
} from './styled';
import { DashboardColumnKey } from '../config';

const DashboardSettings = ({ setDynamicColumns, dynamicColumns }) => {
  const iconReference = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  const isCheckedCheckbox = useCallback(
    checkboxValue => dynamicColumns?.includes(checkboxValue),
    [dynamicColumns],
  );

  const onClickChecbkox = useCallback(
    checkboxValue => {
      if (isCheckedCheckbox(checkboxValue)) {
        const newDynamicColumns = dynamicColumns.filter(
          value => value !== checkboxValue,
        );
        setDynamicColumns(newDynamicColumns);
        updateUserDashboardPrefs({
          displayColumns: newDynamicColumns,
        });
      } else {
        const newDynamicColumns = [...dynamicColumns, checkboxValue];
        setDynamicColumns([...dynamicColumns, checkboxValue]);
        updateUserDashboardPrefs({
          displayColumns: newDynamicColumns,
        });
      }
    },
    [dynamicColumns, isCheckedCheckbox, setDynamicColumns],
  );

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
          <DashboardSettingsOption>
            <Checkbox
              isChecked={isCheckedCheckbox(DashboardColumnKey.WORKFLOW_STATUS)}
              onClick={() => {
                onClickChecbkox(DashboardColumnKey.WORKFLOW_STATUS);
              }}
            />
            <DashboardSettingsLabel>Status</DashboardSettingsLabel>
          </DashboardSettingsOption>
          <DashboardSettingsOption>
            <Checkbox
              id="dassigned-checkbox"
              isChecked={isCheckedCheckbox(DashboardColumnKey.ASSIGNED)}
              onClick={() => {
                onClickChecbkox(DashboardColumnKey.ASSIGNED);
              }}
            />
            <DashboardSettingsLabel>Assigned</DashboardSettingsLabel>
          </DashboardSettingsOption>
          <DashboardSettingsOption>
            <Checkbox
              isChecked={isCheckedCheckbox(DashboardColumnKey.ACTIVITY)}
              onClick={() => {
                onClickChecbkox(DashboardColumnKey.ACTIVITY);
              }}
            />
            <DashboardSettingsLabel>
              Comments, labels and attachments
            </DashboardSettingsLabel>
          </DashboardSettingsOption>
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
