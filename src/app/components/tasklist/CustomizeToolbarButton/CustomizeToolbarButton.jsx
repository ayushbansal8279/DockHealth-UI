import React, { useState, useRef, useMemo, useCallback } from 'react';
import { Box, List, ListItemText, MenuItem, Popover } from '@material-ui/core';
import CustomizeIcon from 'img/customize-icon';
import Checkbox from 'components/common/Checkbox/Checkbox';
import { useColumnsConfig } from 'context-api/ColumnsConfigContext';
import { userProfileSelector } from 'selectors/user-selectors';
import { useSelector } from 'react-redux';
import { TaskItemColumn } from 'helpers/task-helpers';
import { capitalize } from 'helpers/capitalize';
import { getCustomerTypeLabel } from 'helpers/customer-type-helper';
import { isEmpty } from 'ramda';
import {
  PlusIcon,
  PopoverContainer,
  CustomizeImg,
  CustomizeButton,
  Spacer,
} from './styled';
import { limitToConfigurableKeys } from './helpers';

const CustomizeToolbarButton = ({ onChange, openCustomFieldModal }) => {
  const [open, setOpen] = useState(false);
  const buttonReference = useRef(null);
  const userProfile = useSelector(userProfileSelector);
  const {
    columnsConfig,
    setColumnsConfig,
    customColumnsConfig,
    setCustomColumnsConfig,
  } = useColumnsConfig();

  const ColumnOptionNames = {
    [TaskItemColumn.ACTIVITY]: 'Details',
    [TaskItemColumn.ASSIGNED]: 'Assigned',
    [TaskItemColumn.WORKFLOW_STATUS]: 'Status',
    [TaskItemColumn.DUE_DATE]: 'Date',
    [TaskItemColumn.PATIENT]: capitalize(getCustomerTypeLabel(userProfile)),
  };

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

  const columnsConfigToDisplay = useMemo(() => {
    return limitToConfigurableKeys(Object.entries(columnsConfig));
  }, [columnsConfig]);

  return (
    <>
      <CustomizeButton ref={buttonReference} onClick={() => setOpen(!open)}>
        <CustomizeImg src={CustomizeIcon} alt="view type icon" />
        <Box mx={0.5} />
        Customize
      </CustomizeButton>
      <Popover
        anchorEl={buttonReference?.current}
        open={open}
        onClose={() => setOpen(false)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <PopoverContainer>
          <List>
            {Object.keys(columnsConfigToDisplay).map(columnKey => {
              const optionName = ColumnOptionNames[columnKey];
              const isChecked = columnsConfigToDisplay[columnKey];
              return (
                optionName && (
                  <MenuItem onClick={() => onClickCheckbox(columnKey)}>
                    <Checkbox isChecked={isChecked} />
                    <Box mx={0.5} />
                    <ListItemText>{optionName}</ListItemText>
                  </MenuItem>
                )
              );
            })}
          </List>
          {!isEmpty(customColumnsConfig) && (
            <>
              <Spacer />
              <List>
                {customColumnsConfig.map(column => {
                  const { name, isChecked = false } = column;
                  return (
                    name && (
                      <MenuItem
                        onClick={() => onClickCustomFieldsCheckbox(column)}
                      >
                        <Checkbox isChecked={isChecked} />
                        <Box mx={0.5} />
                        <ListItemText>{name}</ListItemText>
                      </MenuItem>
                    )
                  );
                })}
              </List>
            </>
          )}
          <Spacer />
          <List>
            <MenuItem onClick={openCustomFieldModal}>
              <PlusIcon>+</PlusIcon>
              <Box mx={0.5} />
              <ListItemText>Create custom column</ListItemText>
            </MenuItem>
          </List>
        </PopoverContainer>
      </Popover>
    </>
  );
};

export default CustomizeToolbarButton;
