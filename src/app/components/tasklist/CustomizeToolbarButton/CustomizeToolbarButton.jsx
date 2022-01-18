import React, { useState, useRef, useMemo, useCallback } from 'react';
import { Box, List, ListItemText, MenuItem, Popover } from '@material-ui/core';
import CustomizeIcon from 'img/customize-icon';
import Checkbox from 'components/common/Checkbox/Checkbox';
import { useColumnsConfig } from 'context-api/ColumnsConfigContext';
import {
  userProfileSelector,
  userHasTaskCustomFieldsFeatureSelector,
} from 'selectors/user-selectors';
import { useSelector } from 'react-redux';
import { TaskItemColumn } from 'helpers/task-helpers';
import { capitalize } from 'helpers/capitalize';
import { getCustomerTypeLabel } from 'helpers/customer-type-helper';
import { isEmpty } from 'ramda';

import UpgradePlan from 'components/common/UpgradePlan/UpgradePlan';
import {
  PlusIcon,
  PopoverContainer,
  CustomizeImg,
  Spacer,
  UpgradePlanContainer,
} from './styled';
import { limitToConfigurableKeys } from './helpers';
import ToolbarButton from '../ToolbarButton/ToolbarButton';

const CustomizeToolbarButton = ({
  onChange,
  openCustomFieldModal,
  additionalOptions,
  showCustomColumnCreate = true,
}) => {
  const [open, setOpen] = useState(false);
  const buttonReference = useRef(null);
  const userProfile = useSelector(userProfileSelector);
  const userHasTaskCustomFieldsFeature = useSelector(
    userHasTaskCustomFieldsFeatureSelector,
  );
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
      <ToolbarButton
        ref={buttonReference}
        icon={<CustomizeImg src={CustomizeIcon} alt="view type icon" />}
        onClick={() => setOpen(!open)}
      >
        Customize
      </ToolbarButton>
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
          <Box display="flex" justifyContent="space-between" mt={1}>
            <Box mx={0.5} />
            <ListItemText>
              <b>Default Columns</b>
            </ListItemText>
          </Box>
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
          {userHasTaskCustomFieldsFeature && !isEmpty(customColumnsConfig) && (
            <>
              <Spacer />
              <Box display="flex" justifyContent="space-between" mt={1}>
                <Box mx={0.5} />
                <ListItemText>
                  <b>Custom Columns</b>
                </ListItemText>
              </Box>
              <List>
                {customColumnsConfig.map(column => {
                  const { name, isChecked = false } = column;
                  return (
                    name && (
                      <MenuItem
                        key={column.identifier}
                        onClick={() => onClickCustomFieldsCheckbox(column)}
                      >
                        <Checkbox isChecked={isChecked} />
                        <Box mx={0.5} />
                        <ListItemText>{name}</ListItemText>
                      </MenuItem>
                    )
                  );
                })}
                {showCustomColumnCreate && (
                  <MenuItem onClick={openCustomFieldModal}>
                    <PlusIcon>+</PlusIcon>
                    <Box mx={0.5} />
                    <ListItemText>Edit Custom Columns</ListItemText>
                  </MenuItem>
                )}
              </List>
            </>
          )}
          {additionalOptions && additionalOptions.length > 0 && (
            <>
              <Spacer />
              <Box display="flex" justifyContent="space-between" mt={1}>
                <Box mx={0.5} />
                <ListItemText>
                  <b>Display Options</b>
                </ListItemText>
              </Box>
              <List>
                {additionalOptions.map(option => {
                  const {
                    name,
                    checked = false,
                    disabled,
                    key,
                    onClick,
                  } = option;
                  return (
                    name && (
                      <MenuItem
                        key={key}
                        onClick={() => {
                          if (typeof onClick === 'function' && !disabled)
                            onClick(key);
                        }}
                      >
                        <Checkbox isDisabled={disabled} isChecked={checked} />
                        <Box mx={0.5} />
                        <ListItemText>{name}</ListItemText>
                      </MenuItem>
                    )
                  );
                })}
              </List>
            </>
          )}
          {!userHasTaskCustomFieldsFeature && (
            <UpgradePlanContainer>
              <UpgradePlan
                title="Custom fields"
                description="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
              />
            </UpgradePlanContainer>
          )}
        </PopoverContainer>
      </Popover>
    </>
  );
};

export default CustomizeToolbarButton;
