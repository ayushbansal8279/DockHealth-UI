/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable no-underscore-dangle */
import React, { useState, useRef, useCallback } from 'react';
import { Box, List, ListItemText, MenuItem, Popover } from '@material-ui/core';
import CustomizeIcon from 'img/customize-icon';
import Checkbox from 'components/common/Checkbox/Checkbox';
import { usePatientListColumnsConfig } from 'context-api/patients-columns-config-context';
import {
  userHasPatientCustomFieldsFeatureSelector,
  userHasTaskCustomFieldsFeatureSelector,
  userProfileSelector,
} from 'selectors/user-selectors';
import { useSelector } from 'react-redux';
import { PatientHeaderColumn } from 'helpers/patient-list-helpers';
import UpgradePlan from 'components/common/UpgradePlan/UpgradePlan';
import UpgradePlanPopup from 'components/common/UpgradePlanPopup/UpgradePlanPopup';
import CustomFieldsIcon from 'img/premium/custom-fields';
import sort from 'ramda/src/sort';
import {
  CUSTOM_FIELD_TYPES,
  sortAlphabetical,
} from 'helpers/custom-fields-helpers';
import { getCustomerTypeLabel } from 'helpers/customer-type-helper';
import { capitalize } from 'helpers/capitalize';
import {
  PlusIcon,
  PopoverContainer,
  CustomizeImg,
  Spacer,
  UpgradePlanContainer,
  UpgradePlanPopupHeader,
} from './styled';
import ToolbarButton from '../../tasklist/ToolbarButton/ToolbarButton';

const CustomizeToolbarButton = ({
  additionalOptions,
  additionalOptionsTitle = 'Display Options',
  disableButton = false,
  iconColorFilterActive,
}) => {
  const [open, setOpen] = useState(false);
  const [openUpgradePopup, setOpenUpgradePopup] = useState(false);
  const buttonReference = useRef(null);
  const addColumnButtonReference = useRef(null);
  const userProfile = useSelector(userProfileSelector);
  const userHasTaskCustomFieldsFeature = useSelector(
    userHasTaskCustomFieldsFeatureSelector,
  );
  const { columns, setColumns } = usePatientListColumnsConfig();

  const ColumnOptionNames = {
    [PatientHeaderColumn.PATIENT]: 'Name',
    [PatientHeaderColumn.UNIQUE_ID]: 'Unique Identifier',
    [PatientHeaderColumn.DOB]: 'DOB',
    [PatientHeaderColumn.AGE]: 'Age',
    [PatientHeaderColumn.GENDER_AT_BIRTH]: 'Sex at birth',
    [PatientHeaderColumn.GENDER_IDENTITY]: 'Gender',
    [PatientHeaderColumn.EMAIL]: 'Email',
    [PatientHeaderColumn.MOBILE]: 'Mobile Phone',
    [PatientHeaderColumn.HOME]: 'Home Phone',
  };

  const customerTypeLabel = capitalize(getCustomerTypeLabel(userProfile));

  const onClickCheckbox = useCallback(
    column => {
      const newSetup = columns.map(c =>
        c.identifier === column.identifier
          ? { ...c, isChecked: !c.isChecked }
          : c,
      );

      setColumns(newSetup);
    },
    [columns, setColumns],
  );

  const renderElement = useCallback(
    (column, name) =>
      (name || column.name) && (
        <MenuItem
          key={column.identifier}
          onClick={() => onClickCheckbox(column)}
        >
          <Checkbox isChecked={column.isChecked} />
          <Box mx={0.5} />
          <ListItemText>{name || column.name}</ListItemText>
        </MenuItem>
      ),
    [onClickCheckbox],
  );

  return (
    <>
      <ToolbarButton
        ref={buttonReference}
        icon={
          <CustomizeImg
            src={CustomizeIcon}
            alt="view type icon"
            iconColorFilterActive={iconColorFilterActive}
          />
        }
        onClick={disableButton ? undefined : () => setOpen(!open)}
        disableButton={disableButton}
        tooltip={
          disableButton
            ? 'Customization is restricted by list admin'
            : 'Customize your list'
        }
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
            {sort(
              (a, b) =>
                ColumnOptionNames[a.identifier]?.localeCompare(
                  ColumnOptionNames[b.identifier],
                ),
              columns,
            ).map(column => {
              const optionName = ColumnOptionNames[column.identifier];
              return optionName && renderElement(column, optionName);
            })}
          </List>
          {additionalOptions && additionalOptions.length > 0 && (
            <>
              <Spacer />
              <Box display="flex" justifyContent="space-between" mt={1}>
                <Box mx={0.5} />
                <ListItemText>
                  <b>{additionalOptionsTitle}</b>
                </ListItemText>
              </Box>
              <List>
                {additionalOptions &&
                  additionalOptions?.map(option => {
                    const { name, checked = false, disabled, onClick } = option;
                    return (
                      name && (
                        <MenuItem
                          key={name}
                          onClick={() => {
                            if (typeof onClick === 'function' && !disabled)
                              onClick();
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
          {userHasPatientCustomFieldsFeatureSelector && columns?.length > 0 && (
            <>
              <Box display="flex" justifyContent="space-between" mt={1}>
                <Box mx={0.5} />
                <ListItemText>
                  <b>{customerTypeLabel} Custom Columns</b>
                </ListItemText>
              </Box>
              <List>
                {sortAlphabetical(
                  columns.filter(
                    c => c._customFieldType === CUSTOM_FIELD_TYPES.PATIENT,
                  ),
                ).map(column => renderElement(column))}
              </List>
            </>
          )}
          {!userHasTaskCustomFieldsFeature && (
            <UpgradePlanContainer>
              <UpgradePlan
                title="Custom Task Fields"
                description="Available with Dock Premium, custom task fields provide greater context and discoverable content."
                iconImage={
                  <img src={CustomFieldsIcon} alt="Custom Task Fields" />
                }
              />
            </UpgradePlanContainer>
          )}
        </PopoverContainer>
      </Popover>
      <UpgradePlanPopup
        header={
          <UpgradePlanPopupHeader>
            <PlusIcon>+</PlusIcon>
            <Box mx={0.5} />
            List columns
          </UpgradePlanPopupHeader>
        }
        transformOrigin={{
          vertical: -18,
          horizontal: 155,
        }}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'right',
        }}
        anchorEl={addColumnButtonReference.current}
        open={openUpgradePopup}
        onClose={() => setOpenUpgradePopup(false)}
        title="Add custom fields"
        description="Available with Dock Premium, custom task fields provide greater context and discoverable content."
        iconImage={<img src={CustomFieldsIcon} alt="Custom Task Fields" />}
      />
    </>
  );
};

export default CustomizeToolbarButton;
