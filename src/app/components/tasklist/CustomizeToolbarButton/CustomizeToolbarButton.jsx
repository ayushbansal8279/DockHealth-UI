/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable no-underscore-dangle */
import React, { useState, useRef, useMemo, useCallback } from 'react';
import {
  Box,
  List,
  ListItemText,
  MenuItem,
  Popover,
  Tabs,
  Tab,
} from '@mui/material';
import CustomizeIcon from 'img/customize-icon.svg';
import Checkbox from 'components/common/Checkbox/Checkbox';
import { useTaskListColumnsConfig } from 'context-api/columns-config-context';
import {
  userProfileSelector,
  userHasTaskCustomFieldsFeatureSelector,
  userHasPatientCustomFieldsFeatureSelector,
  selectedUserOrganizationSelector,
} from 'selectors/user-selectors';
import {
  getCustomerUniqueIDShortLabel,
  getCustomerTypeLabel,
} from 'helpers/customer-type-helper';
import { useSelector } from 'react-redux';
import { TaskItemColumn, PatientTaskItemColumn } from 'helpers/task-helpers';
import { capitalize } from 'helpers/capitalize';
import UpgradePlan from 'components/common/UpgradePlan/UpgradePlan';
import UpgradePlanPopup from 'components/common/UpgradePlanPopup/UpgradePlanPopup';
import CustomFieldsIcon from 'img/premium/custom-fields.svg';
import {
  CUSTOM_FIELD_TYPES,
  sortAlphabetical,
} from 'helpers/custom-fields-helpers';
import sort from 'ramda/src/sort';
import {
  PlusIcon,
  PopoverContainer,
  CustomizeImg,
  Spacer,
  UpgradePlanContainer,
  UpgradePlanPopupHeader,
} from './styled';
import { limitToConfigurableKeys } from './helpers';
import ToolbarButton from '../ToolbarButton/ToolbarButton';

const CustomizeToolbarButton = ({
  openCustomFieldModal,
  additionalOptions,
  showCustomColumnCreate = true,
  additionalOptionsTitle = 'Display Options',
  disableButton = false,
  iconColorFilterActive,
  isDashboard = false,
}) => {
  const [open, setOpen] = useState(false);
  const [openUpgradePopup, setOpenUpgradePopup] = useState(false);
  const buttonReference = useRef(null);
  const addColumnButtonReference = useRef(null);
  const userProfile = useSelector(userProfileSelector);
  const currentOrganization = useSelector(selectedUserOrganizationSelector);

  const userHasTaskCustomFieldsFeature = useSelector(
    userHasTaskCustomFieldsFeatureSelector,
  );
  const { columns, setColumns } = useTaskListColumnsConfig();

  const customerTypeLabel = capitalize(getCustomerTypeLabel(userProfile));

  const uniqueIdentifierLabel = getCustomerUniqueIDShortLabel(
    userProfile,
    currentOrganization,
  );

  const ColumnOptionNames = {
    [TaskItemColumn.COMMENTS]: 'Comments',
    [TaskItemColumn.LABELS]: 'Labels',
    [TaskItemColumn.FILES]: 'Files',
    [TaskItemColumn.SUBTASKS_COUNT]: 'Subtasks',
    [TaskItemColumn.ASSIGNED]: 'Assigned',
    [TaskItemColumn.SHARED]: 'Shared',
    [TaskItemColumn.WORKFLOW_STATUS]: 'Status',
    [TaskItemColumn.START_DATE]: 'Start date',
    [TaskItemColumn.DUE_DATE]: 'Due date',
    [TaskItemColumn.CREATED_DATE]: 'Created date',
    [TaskItemColumn.CREATED_BY]: 'Created by',
    [TaskItemColumn.COMPLETED_DATE]: 'Completed date',
    [TaskItemColumn.ELAPSED_TIME]: 'Elapsed time',
    [TaskItemColumn.COMPLETED_BY]: `Completed by`,
    [TaskItemColumn.ANCHOR_DATE]: 'Anchor date',
    [TaskItemColumn.LIST_NAME]: 'List name',
    [TaskItemColumn.TASK_DETAILS]: 'Details',
    [TaskItemColumn.PRIORITY]: 'Priority',
    [TaskItemColumn.PATIENT]: customerTypeLabel,
  };

  const PatientColumnOptionNames = {
    [PatientTaskItemColumn.GENDER]: 'Gender',
    [PatientTaskItemColumn.DOB]: 'DOB',
    [PatientTaskItemColumn.EMAIL]: 'Email',
    [PatientTaskItemColumn.MOBILE_PHONE]: 'Mobile Phone',
    [PatientTaskItemColumn.HOME_PHONE]: 'Home Phone',
    [PatientTaskItemColumn.MRN]: uniqueIdentifierLabel,
  };

  const [selectedTab, setSelectedTab] = useState(0);

  const onClickCheckbox = useCallback(
    (column) => {
      const newSetup = columns.map((c) =>
        c.identifier === column.identifier
          ? { ...c, isChecked: !c.isChecked }
          : c,
      );

      setColumns(newSetup);
    },
    [columns, setColumns],
  );

  const handleAddColumnClick = useCallback(() => {
    if (userHasTaskCustomFieldsFeature) {
      openCustomFieldModal();
    } else {
      setOpenUpgradePopup(true);
    }
  }, [openCustomFieldModal, userHasTaskCustomFieldsFeature]);

  const columnsConfigToDisplay = useMemo(() => {
    return limitToConfigurableKeys(
      columns.filter((c) => c._customFieldType === CUSTOM_FIELD_TYPES.REGULAR),
    );
  }, [columns]);

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

  const applyProps = useCallback((index) => {
    return {
      id: `full-width-tab-${index}`,
      'aria-controls': `full-width-tabpanel-${index}`,
    };
  }, []);

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
        style={{ height: 'auto' }}
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
          <Tabs
            value={selectedTab}
            onChange={(event, index) => setSelectedTab(index)}
            indicatorColor="secondary"
            textColor="inherit"
            variant="fullWidth"
            tabItemContainerStyle={{ position: 'fixed', top: '0' }}
          >
            <Tab
              label="Default"
              {...applyProps(0)}
              style={{ minWidth: '25%' }}
            />
            <Tab label="Task" {...applyProps(1)} style={{ minWidth: '25%' }} />
            <Tab
              label={customerTypeLabel}
              {...applyProps(2)}
              style={{ minWidth: '25%' }}
            />
            {isDashboard && (
              <Tab
                label={additionalOptionsTitle}
                {...applyProps(3)}
                style={{ minWidth: '25%' }}
              />
            )}
          </Tabs>
          <Box p={1} />
          {selectedTab === 0 && (
            <>
              <Box display="flex" justifyContent="space-between" mt={1}>
                <Box mx={0.5} />
                <ListItemText>
                  <b>Default Columns</b>
                </ListItemText>
              </Box>
              <List>
                {sort(
                  (a, b) =>
                    ColumnOptionNames[a?.identifier]?.localeCompare(
                      ColumnOptionNames[b?.identifier],
                    ),
                  columnsConfigToDisplay,
                ).map((column) => {
                  const optionName = ColumnOptionNames[column.identifier];
                  return optionName && renderElement(column, optionName);
                })}
              </List>
              <Spacer />
              {!isDashboard && (
                <>
                  <Box display="flex" justifyContent="space-between" mt={1}>
                    <Box mx={0.5} />
                    <ListItemText>
                      <b>{additionalOptionsTitle}</b>
                    </ListItemText>
                  </Box>
                  <List>
                    {additionalOptions &&
                      additionalOptions?.map((option) => {
                        const {
                          name,
                          checked = false,
                          disabled,
                          onClick,
                        } = option;
                        return (
                          name && (
                            <MenuItem
                              key={name}
                              onClick={() => {
                                if (typeof onClick === 'function' && !disabled)
                                  onClick();
                              }}
                            >
                              <Checkbox
                                isDisabled={disabled}
                                isChecked={checked}
                              />
                              <Box mx={0.5} />
                              <ListItemText>{name}</ListItemText>
                            </MenuItem>
                          )
                        );
                      })}
                  </List>
                </>
              )}
            </>
          )}
          {selectedTab === 1 && (
            <>
              {userHasTaskCustomFieldsFeature && (
                <>
                  <Spacer />
                  <Box display="flex" justifyContent="space-between" mt={1}>
                    <Box mx={0.5} />
                    <ListItemText>
                      <b>Task Custom Columns</b>
                    </ListItemText>
                  </Box>
                  <List>
                    {showCustomColumnCreate && (
                      <MenuItem
                        onClick={handleAddColumnClick}
                        ref={addColumnButtonReference}
                      >
                        <PlusIcon>+</PlusIcon>
                        <Box mx={0.5} />
                        <ListItemText>Create/Edit Custom Column</ListItemText>
                      </MenuItem>
                    )}
                    {sortAlphabetical(
                      columns.filter(
                        (c) =>
                          c._customFieldType === CUSTOM_FIELD_TYPES.TASK_LIST ||
                          c._customFieldType ===
                            CUSTOM_FIELD_TYPES.ORGANIZATION,
                      ),
                    ).map((column) => renderElement(column))}
                  </List>
                </>
              )}
            </>
          )}
          {selectedTab === 2 &&
            additionalOptions &&
            additionalOptions.length > 0 && (
              <>
                <Box display="flex" justifyContent="space-between" mt={1}>
                  <Box mx={0.5} />
                  <ListItemText>
                    <b>{customerTypeLabel} Default Columns</b>
                  </ListItemText>
                </Box>
                <List>
                  {sort(
                    (a, b) =>
                      PatientColumnOptionNames[a?.identifier]?.localeCompare(
                        PatientColumnOptionNames[b?.identifier],
                      ),
                    columnsConfigToDisplay,
                  ).map((column) => {
                    const optionName =
                      PatientColumnOptionNames[column.identifier];
                    return optionName && renderElement(column, optionName);
                  })}
                </List>
                {userHasPatientCustomFieldsFeatureSelector &&
                  columns?.length > 0 && (
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
                            (c) =>
                              c._customFieldType === CUSTOM_FIELD_TYPES.PATIENT,
                          ),
                        ).map((column) => renderElement(column))}
                      </List>
                    </>
                  )}
              </>
            )}
          {selectedTab === 3 && isDashboard && (
            <>
              <Box display="flex" justifyContent="space-between" mt={1}>
                <Box mx={0.5} />
                <ListItemText>
                  <b>{additionalOptionsTitle}</b>
                </ListItemText>
              </Box>
              <List>
                {additionalOptions &&
                  additionalOptions?.map((option) => {
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
