import React, { useRef, useState, useMemo, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Popover } from '@material-ui/core';
import ColumnDisplayIcon from 'img/settings-icon';
import Checkbox from 'components/common/Checkbox/Checkbox';
import { TaskItemColumn } from 'helpers/task-helpers';
import { getCustomerTypeLabel } from 'helpers/customer-type-helper';
import { userProfileSelector } from 'selectors/user-selectors';
import { capitalize } from 'helpers/capitalize';
import { useColumnsConfig } from 'context-api/ColumnsConfigContext';
import {
  ColumnDisplayContainer,
  ColumnDisplayHeader,
  ColumnDisplayOption,
  ColumnDisplayLabel,
  ColumnDisplayIcon as StyledColumnDisplayIcon,
} from './styled';
import { limitToConfigurableKeys } from './helpers';

const ColumnDisplaySettings = ({ onChange }) => {
  const {
    columnsConfig,
    setColumnsConfig,
    customColumnsConfig,
    setCustomColumnsConfig,
  } = useColumnsConfig();
  const userProfile = useSelector(userProfileSelector);
  const iconReference = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  const ColumnOptionNames = {
    [TaskItemColumn.ACTIVITY]: 'Comments, labels and attachments',
    [TaskItemColumn.ASSIGNED]: 'Assigned',
    [TaskItemColumn.WORKFLOW_STATUS]: 'Status',
    [TaskItemColumn.DUE_DATE]: 'Date',
    [TaskItemColumn.PATIENT]: capitalize(getCustomerTypeLabel(userProfile)),
  };

  const columnsConfigToDisplay = useMemo(() => {
    return limitToConfigurableKeys(Object.entries(columnsConfig));
  }, [columnsConfig]);

  const onClickCheckbox = useCallback(
    columnKey => {
      const newSetup = {
        ...columnsConfig,
        [columnKey]: !columnsConfig[columnKey],
      };

      setColumnsConfig(newSetup);
      const newConfigurableSetup = limitToConfigurableKeys(
        Object.entries(newSetup),
      );
      if (typeof onChange === 'function') onChange(newConfigurableSetup);
    },
    [columnsConfig, onChange, setColumnsConfig],
  );

  const onClickCustomFieldsCheckbox = useCallback(
    column => {
      const { identifier } = column;
      const newSetup = customColumnsConfig.map(f => {
        if (f.identifier === identifier) {
          return { ...f, isChecked: !f.isChecked };
        }
        return f;
      });
      setCustomColumnsConfig(newSetup);
      if (typeof onChange === 'function')
        onChange(newSetup, { isCustomColumn: true });
    },
    [customColumnsConfig, onChange, setCustomColumnsConfig],
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
        <ColumnDisplayContainer>
          <ColumnDisplayHeader>
            Which columns would you like to see?
          </ColumnDisplayHeader>
          {Object.keys(columnsConfigToDisplay).map(columnKey => {
            const optionName = ColumnOptionNames[columnKey];
            const isChecked = columnsConfigToDisplay[columnKey];
            return (
              optionName && (
                <ColumnDisplayOption onClick={() => onClickCheckbox(columnKey)}>
                  <Checkbox isChecked={isChecked} />
                  <ColumnDisplayLabel>{optionName}</ColumnDisplayLabel>
                </ColumnDisplayOption>
              )
            );
          })}
          {customColumnsConfig.map(column => {
            const { name, isChecked = false } = column;
            return (
              name && (
                <ColumnDisplayOption
                  onClick={() => onClickCustomFieldsCheckbox(column)}
                >
                  <Checkbox isChecked={isChecked} />
                  <ColumnDisplayLabel>{name}</ColumnDisplayLabel>
                </ColumnDisplayOption>
              )
            );
          })}
        </ColumnDisplayContainer>
      </Popover>
      <StyledColumnDisplayIcon
        ref={iconReference}
        src={ColumnDisplayIcon}
        alt="settings"
        onClick={() => setIsOpen(!isOpen)}
      />
    </>
  );
};

export default ColumnDisplaySettings;
