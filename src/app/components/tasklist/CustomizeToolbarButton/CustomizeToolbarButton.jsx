import React, { useState, useRef, useMemo, useCallback } from 'react';
import { Box, Popover } from '@material-ui/core';
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
  SectionContainer,
  ListElement,
  TextElement,
  PlusIcon,
  PopoverContainer,
  CustomizeImg,
  CustomizeButton,
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
    [TaskItemColumn.ACTIVITY]: 'Comments, labels and attachments',
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
          <SectionContainer>
            {Object.keys(columnsConfigToDisplay).map(columnKey => {
              const optionName = ColumnOptionNames[columnKey];
              const isChecked = columnsConfigToDisplay[columnKey];
              return (
                optionName && (
                  <ListElement onClick={() => onClickCheckbox(columnKey)}>
                    <Checkbox isChecked={isChecked} />
                    <TextElement>{optionName}</TextElement>
                  </ListElement>
                )
              );
            })}
          </SectionContainer>
          {!isEmpty(customColumnsConfig) && (
            <SectionContainer>
              {customColumnsConfig.map(column => {
                const { name, isChecked = false } = column;
                return (
                  name && (
                    <ListElement
                      onClick={() => onClickCustomFieldsCheckbox(column)}
                    >
                      <Checkbox isChecked={isChecked} />
                      <TextElement>{name}</TextElement>
                    </ListElement>
                  )
                );
              })}
            </SectionContainer>
          )}
          <SectionContainer>
            <TextElement onClick={openCustomFieldModal}>
              <PlusIcon>+</PlusIcon> Create custom column
            </TextElement>
          </SectionContainer>
        </PopoverContainer>
      </Popover>
    </>
  );
};

export default CustomizeToolbarButton;
