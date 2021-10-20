import React, { useRef, useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { Popover } from '@material-ui/core';
import DashboardSettingsIcon from 'img/settings-icon';
import Checkbox from 'components/common/Checkbox/Checkbox';
import { TaskItemColumn } from 'helpers/task-helpers';
import { updateCurrentUserPreferences } from 'actions/user-actions';
import {
  DashboardSettingsContainer,
  DashboardSettingsHeader,
  DashboardSettingsOption,
  DashboardSettingsLabel,
  DashboardSettingsIcon as StyledDashboardSettingsIcon,
} from './styled';

const ColumnOptionNames = {
  [TaskItemColumn.ACTIVITY]: 'Comments, labels and attachments',
  [TaskItemColumn.ASSIGNED]: 'Assigned',
  [TaskItemColumn.WORKFLOW_STATUS]: 'Status',
};

const DashboardSettings = ({ columnsConfig, setColumnsConfig }) => {
  const iconReference = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();

  const onClickChecbkox = useCallback(
    columnKey => {
      setColumnsConfig(previousConfig => {
        const newConfig = {
          ...previousConfig,
          [columnKey]: !previousConfig[columnKey],
        };

        dispatch(
          updateCurrentUserPreferences({
            displayColumns: Object.entries(newConfig).reduce(
              (accumulator, [key, value]) =>
                value ? [...accumulator, key] : accumulator,
              [],
            ),
          }),
        );

        return newConfig;
      });
    },
    [dispatch, setColumnsConfig],
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
          {Object.keys(columnsConfig).map(columnKey => {
            const optionName = ColumnOptionNames[columnKey];
            return (
              optionName && (
                <DashboardSettingsOption key={columnKey}>
                  <Checkbox
                    isChecked={columnsConfig[columnKey]}
                    onClick={() => {
                      onClickChecbkox(columnKey);
                    }}
                  />
                  <DashboardSettingsLabel>{optionName}</DashboardSettingsLabel>
                </DashboardSettingsOption>
              )
            );
          })}
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
