import React, {
  useState,
  useRef,
  useMemo,
  useCallback,
  useEffect,
} from 'react';
import {
  Box,
  List,
  ListItemText,
  MenuItem,
  Popover,
  Tabs,
  Tab,
  Switch,
} from '@mui/material';
import CustomizeIcon from 'img/customize-icon.svg';
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
import Search from 'components/task-view/Search/Search';
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
import {
  SearchContainer,
  HorizontalLine,
  HorizontalLineContainer,
} from '@/app/components/task-template/TaskTemplateApplicator/styled';

const CustomizeToolbarButton = ({
  openCustomFieldModal,
  additionalOptions,
  showCustomColumnCreate = true,
  additionalOptionsTitle = 'Display Options',
  disableButton = false,
  iconColorFilterActive,
  isDashboard = false,
  isPatientView = false,
  groupOptions,
}) => {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
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

  const handleSearch = useCallback(
    (searchPhrase) => {
      setSearchValue(searchPhrase);
    },
    [setSearchValue],
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
    [TaskItemColumn.ORG_NAME]: 'Organization name',
    [TaskItemColumn.TASK_DETAILS]: 'Details',
    [TaskItemColumn.PRIORITY]: 'Priority',
    [TaskItemColumn.PATIENT]: customerTypeLabel,
    [TaskItemColumn.PROFILE]: 'Object',
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

  useEffect(() => {
    setSearchValue('');
  }, [selectedTab, open]);

  const onClickCheckbox = useCallback(
    (column) => {
      let newSetup = columns.map((c) =>
        c.identifier === column.identifier
          ? { ...c, isChecked: !c.isChecked }
          : c,
      );

      if (isPatientView) {
        newSetup.filter((c) => c.identifier !== 'PATIENT');
        newSetup = [
          ...newSetup.slice(0, 1),
          {
            identifier: 'PATIENT',
            _customFieldType: 'REGULAR',
            isChecked: true,
            columnWidth: 192,
          },
          ...newSetup.slice(1),
        ];
      }

      setColumns(newSetup);
    },
    [columns, isPatientView, setColumns],
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
          <Switch checked={column.isChecked} />
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
        isOpen={open}
        active={open}
        style={{ height: 'auto' }}
        hasPopover
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
          >
            <Tab
              label="Default"
              {...applyProps(0)}
              style={{ minWidth: '75px' }}
            />
            <Tab label="Task" {...applyProps(1)} style={{ minWidth: '75px' }} />
            <Tab
              label={customerTypeLabel}
              {...applyProps(2)}
              style={{ minWidth: '75px' }}
            />
            {isDashboard && (
              <Tab
                label={additionalOptionsTitle}
                {...applyProps(3)}
                style={{ minWidth: '75px' }}
              />
            )}
          </Tabs>
          <Box p={1} />
          {selectedTab === 0 && (
            <>
              <SearchContainer>
                <Search
                  fullWidth
                  noBackground
                  value={searchValue}
                  onChange={(event) => handleSearch(event?.target?.value)}
                  placeholder="Search"
                  isWorkFlowSearch
                />
              </SearchContainer>
              <HorizontalLineContainer>
                <HorizontalLine />
              </HorizontalLineContainer>
              <Box display="flex" justifyContent="space-between" mt={1}>
                <Box mx={0.5} />
                <ListItemText>
                  <b>Default Columns</b>
                </ListItemText>
              </Box>
              <List>
                {(() => {
                  const sortedColumns = sort(
                    (a, b) =>
                      ColumnOptionNames[a.identifier]?.localeCompare(
                        ColumnOptionNames[b.identifier],
                      ),
                    columnsConfigToDisplay,
                  );
                  const filteredColumns = sortedColumns.filter((column) => {
                    const optionName = ColumnOptionNames[column.identifier];
                    return (
                      !searchValue ||
                      optionName
                        ?.toLowerCase()
                        ?.includes(searchValue?.toLowerCase())
                    );
                  });

                  return filteredColumns.length > 0 ? (
                    filteredColumns.map((column) => {
                      const optionName = ColumnOptionNames[column.identifier];
                      return optionName && renderElement(column, optionName);
                    })
                  ) : (
                    <div
                      style={{
                        textAlign: 'center',
                        marginTop: '20px',
                        marginBottom: '20px',
                      }}
                    >
                      No columns found
                    </div>
                  );
                })()}
              </List>
            </>
          )}
          {selectedTab === 1 && (
            <>
              {userHasTaskCustomFieldsFeature && (
                <>
                  <Spacer />
                  <SearchContainer>
                    <Search
                      fullWidth
                      noBackground
                      value={searchValue}
                      onChange={(event) => handleSearch(event?.target?.value)}
                      placeholder="Search"
                      isWorkFlowSearch
                    />
                  </SearchContainer>
                  <HorizontalLineContainer>
                    <HorizontalLine />
                  </HorizontalLineContainer>
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
                    {(() => {
                      const filteredColumns = sortAlphabetical(
                        columns.filter(
                          (c) =>
                            c._customFieldType ===
                              CUSTOM_FIELD_TYPES.TASK_LIST ||
                            c._customFieldType ===
                              CUSTOM_FIELD_TYPES.ORGANIZATION,
                        ),
                      ).filter(
                        (column) =>
                          !searchValue ||
                          column?.name
                            ?.toLowerCase()
                            ?.includes(searchValue?.toLowerCase()),
                      );

                      return filteredColumns.length > 0 ? (
                        filteredColumns.map((column) => renderElement(column))
                      ) : (
                        <div
                          style={{
                            textAlign: 'center',
                            marginTop: '20px',
                            marginBottom: '20px',
                          }}
                        >
                          No columns found
                        </div>
                      );
                    })()}
                  </List>
                </>
              )}
            </>
          )}
          {selectedTab === 2 &&
            additionalOptions &&
            additionalOptions.length > 0 && (
              <>
                <SearchContainer>
                  <Search
                    fullWidth
                    noBackground
                    value={searchValue}
                    onChange={(event) => handleSearch(event?.target?.value)}
                    placeholder="Search"
                    isWorkFlowSearch
                  />
                </SearchContainer>
                <HorizontalLineContainer>
                  <HorizontalLine />
                </HorizontalLineContainer>
                <Box display="flex" justifyContent="space-between" mt={1}>
                  <Box mx={0.5} />
                  <ListItemText>
                    <b>{customerTypeLabel} Default Columns</b>
                  </ListItemText>
                </Box>
                <List>
                  {(() => {
                    const sortedColumns = sort(
                      (a, b) =>
                        PatientColumnOptionNames[a.identifier]?.localeCompare(
                          PatientColumnOptionNames[b.identifier],
                        ),
                      columns,
                    );

                    const filteredColumns = sortedColumns.filter((column) => {
                      const optionName =
                        PatientColumnOptionNames[column.identifier];
                      return (
                        !searchValue ||
                        optionName
                          ?.toLowerCase()
                          ?.includes(searchValue?.toLowerCase())
                      );
                    });

                    return filteredColumns.length > 0 ? (
                      filteredColumns.map((column) => {
                        const optionName =
                          PatientColumnOptionNames[column.identifier];
                        return optionName && renderElement(column, optionName);
                      })
                    ) : (
                      <div
                        style={{
                          textAlign: 'center',
                          marginTop: '20px',
                          marginBottom: '20px',
                        }}
                      >
                        No columns found
                      </div>
                    );
                  })()}
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
                        {(() => {
                          const filteredColumns = sortAlphabetical(
                            columns.filter(
                              (c) =>
                                c._customFieldType ===
                                CUSTOM_FIELD_TYPES.PATIENT,
                            ),
                          ).filter(
                            (column) =>
                              !searchValue ||
                              column?.name
                                ?.toLowerCase()
                                ?.includes(searchValue?.toLowerCase()),
                          );

                          return filteredColumns.length > 0 ? (
                            filteredColumns.map((column) =>
                              renderElement(column),
                            )
                          ) : (
                            <div
                              style={{
                                textAlign: 'center',
                                marginTop: '20px',
                                marginBottom: '20px',
                              }}
                            >
                              No columns found
                            </div>
                          );
                        })()}
                      </List>
                    </>
                  )}
              </>
            )}
          {selectedTab === 3 && isDashboard && (
            <>
              <SearchContainer>
                <Search
                  fullWidth
                  noBackground
                  value={searchValue}
                  onChange={(event) => handleSearch(event?.target?.value)}
                  placeholder="Search"
                  isWorkFlowSearch
                />
              </SearchContainer>
              <HorizontalLineContainer>
                <HorizontalLine />
              </HorizontalLineContainer>
              <Box display="flex" justifyContent="space-between" mt={1}>
                <Box mx={0.5} />
                <ListItemText>
                  <b>{additionalOptionsTitle}</b>
                </ListItemText>
              </Box>
              <List>
                {(() => {
                  const filteredOptions = groupOptions
                    ? groupOptions.filter(
                        (option) =>
                          !searchValue ||
                          option.name
                            ?.toLowerCase()
                            ?.includes(searchValue?.toLowerCase()),
                      )
                    : [];

                  return filteredOptions.length > 0 ? (
                    filteredOptions.map((option) => {
                      const { name, key, checked, onClick } = option;
                      return (
                        name && (
                          <MenuItem
                            key={key}
                            onClick={() => {
                              if (typeof onClick === 'function') onClick();
                            }}
                          >
                            <Switch checked={checked} />
                            <Box mx={0.5} />
                            <ListItemText>{name}</ListItemText>
                          </MenuItem>
                        )
                      );
                    })
                  ) : (
                    <div
                      style={{
                        textAlign: 'center',
                        marginTop: '20px',
                        marginBottom: '20px',
                      }}
                    >
                      No groups found
                    </div>
                  );
                })()}
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
