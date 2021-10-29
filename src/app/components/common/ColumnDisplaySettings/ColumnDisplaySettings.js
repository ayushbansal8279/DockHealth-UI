import React, { useRef, useState, useMemo, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Popover } from '@material-ui/core';
import ColumnDisplayIcon from 'img/settings-icon';
import Checkbox from 'components/common/Checkbox/Checkbox';
import { TaskItemColumn, MAX_COLUMNS_TO_SHOW } from 'helpers/task-helpers';
import { getCustomerTypeLabel } from 'helpers/customer-type-helper';
import { userProfileSelector } from 'selectors/user-selectors';
import { capitalize } from 'helpers/capitalize';
import Tooltip from 'components/common/Tooltip/Tooltip';
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

  const disableUnchecked = useMemo(() => {
    const checkedStandardCount = Object.keys(columnsConfigToDisplay).reduce(
      (accumulator, key) =>
        columnsConfigToDisplay[key] ? accumulator + 1 : accumulator,
      0,
    );
    const checkedCustomCount = customColumnsConfig.filter(f => f.isChecked)
      ?.length;
    return checkedStandardCount + checkedCustomCount >= MAX_COLUMNS_TO_SHOW;
  }, [columnsConfigToDisplay, customColumnsConfig]);

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
            Which column would you like to see?
          </ColumnDisplayHeader>
          {Object.keys(columnsConfigToDisplay).map(columnKey => {
            const optionName = ColumnOptionNames[columnKey];
            const isChecked = columnsConfigToDisplay[columnKey];
            const isDisabled = disableUnchecked && !isChecked;
            return (
              optionName && (
                <Tooltip
                  key={columnKey}
                  title="Max 3 selected columns"
                  hideTooltip={!isDisabled}
                >
                  <div>
                    <ColumnDisplayOption
                      isDisabled={isDisabled}
                      onClick={() => {
                        return isDisabled ? null : onClickCheckbox(columnKey);
                      }}
                    >
                      <Checkbox isDisabled={isDisabled} isChecked={isChecked} />
                      <ColumnDisplayLabel>{optionName}</ColumnDisplayLabel>
                    </ColumnDisplayOption>
                  </div>
                </Tooltip>
              )
            );
          })}
          {customColumnsConfig.map(column => {
            const { name, isChecked = false, identifier } = column;
            const isDisabled = disableUnchecked && !isChecked;
            return (
              name && (
                <Tooltip
                  key={identifier}
                  title={`Max ${MAX_COLUMNS_TO_SHOW} selected columns`}
                  hideTooltip={!isDisabled}
                >
                  <div>
                    <ColumnDisplayOption
                      isDisabled={isDisabled}
                      onClick={() => {
                        return isDisabled
                          ? null
                          : onClickCustomFieldsCheckbox(column);
                      }}
                    >
                      <Checkbox isDisabled={isDisabled} isChecked={isChecked} />
                      <ColumnDisplayLabel>{name}</ColumnDisplayLabel>
                    </ColumnDisplayOption>
                  </div>
                </Tooltip>
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
