/* eslint-disable import/no-cycle */
/* eslint-disable sonarjs/cognitive-complexity */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Box } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';
// import { useBoolean } from 'hooks/useBoolean';
import { onPrint, onSearchChanged } from 'helpers/ga-event-helper';
import { createPatientDetailsListPath } from 'routing/helpers/paths';
import ToolbarSelect from 'components/tasklist/ToolbarSelect/ToolbarSelect';
import { currentListTasksStatusSelector } from 'selectors/patient-details-selectors';
import { isUserViewOnly } from 'helpers/user-helper';
import {
  getCurrentPatientTasks,
  setCurrentListTasksStatus,
  getPatientFilterOptions,
} from 'actions/patient-details-actions';
import { updateUserPageViewSetup } from 'actions/task-list-actions';
import {
  userProfileSelector,
  userSetupClientViewSelector,
  selectedUserOrganizationSelector,
} from 'selectors/user-selectors';
import Spacing from 'components/common/Spacing';
import { TaskOrigin } from 'helpers/task-helpers';
// import { printTaskPdf } from 'components/task-pdf/TaskPdfDocument';
import ViewTypeIcon from 'img/view-type-icon.svg';
import * as PatientDetailsActions from 'actions/patient-details-actions';
import compose from 'ramda/src/compose';
import equals from 'ramda/src/equals';
import ToolbarButton from '@/app/components/tasklist/list-toolbar-buttons/ToolbarButton/ToolbarButton';
import CustomizeToolbarButton from '@/app/components/tasklist/list-toolbar-buttons/CustomizeToolbarButton/CustomizeToolbarButton';
import TaskStatusToolbarSelect from '@/app/components/tasklist/list-toolbar-buttons/TaskStatusToolbarSelect/TaskStatusToolbarSelect';
import {
  ListsToolbarContainer,
  ListsTabsContainer,
  ListSelectionImg,
  GridContainer,
  GridItemFullView,
  GridItemSlimView,
} from './styled';
import { ListViewType, LIST_TYPE_OPTIONS } from '../helpers';
import HeaderSearch from '@/app/components/template/HeaderSearch/HeaderSearch';
import MegaFilter from '@/app/components/tasklist/list-toolbar-buttons/MegaFilter/MegaFilter';
// import { getPatientFilterOptions } from 'actions/patient-details-actions';

import {
  addQuickFilterOptionSelector,
  availableFiltersInInMegaFilterSelector,
  quickFiltersSelector,
  selectedFiltersInMegaFilterSelector,
  selectedQuickFilterSelector,
} from '@/app/selectors/mega-filter-selectors';
import { isFetchingPatientsListsSelector } from '@/app/selectors/patients-selectors';
import {
  createQuickFilter,
  deleteQuickFilter,
  getQuickFilters,
  selectQuickFilter,
  showAddQuickFilterOption,
  updateQuickFilter,
} from '@/app/actions/mega-filter-actions';
import { setPatientTaskSearch } from '@/app/sagas/patient-details-saga';
import FullViewIcon from '@/app/img/list/FullViewIcon';
import SlimViewIcon from '@/app/img/list/SlimViewIcon';

const TaskListToolbar = (props) => {
  const { lists, patientViewType, handlePatientView, handleRemoveAllTasks } =
    props;
  // const tasksToPrint = currentList?.tasks ? currentList?.tasks : [];
  // const listUsers = currentList?.listUsers ? currentList?.listUsers : [];
  const {
    patientIdentifier,
    taskListIdentifier: taskListIdentifierParameter = ListViewType.ALL_TASKS,
  } = useParams();
  const history = useHistory();
  const dispatch = useDispatch();
  const tasksStatus = useSelector(currentListTasksStatusSelector);
  const viewSetup = useSelector(userSetupClientViewSelector);
  // const [closeMorePopover] = useBoolean(false);
  const isAllTasksView = taskListIdentifierParameter === ListViewType.ALL_TASKS;

  const listOptions = lists?.map(
    ({ taskListIdentifier, listName, tasks = [] }) => {
      const tasksCount =
        (tasks.length > 0 &&
          tasks?.reduce((counter, task) => {
            if (task?.itemType === 'BUNDLE') {
              const bundledTaskCount = task?.tasks?.reduce(
                (bundleTaskCounter, bundleTask) => {
                  return (
                    bundleTaskCounter + (bundleTask?.subTasksCount || 0) + 1
                  );
                },
                0,
              );
              return counter + bundledTaskCount;
            }
            return counter + (task?.subTasksCount || 0) + 1;
          }, 0)) ||
        0;

      return {
        secondaryLabel: tasksCount,
        value: taskListIdentifier,
        label: listName,
      };
    },
  );
  const [searchValue, setSearchValue] = useState('');
  const filters = useSelector(availableFiltersInInMegaFilterSelector);
  const selectedFilters = useSelector(selectedFiltersInMegaFilterSelector);
  const isFetchingLists = useSelector(isFetchingPatientsListsSelector);
  const quickFiltersList = useSelector(quickFiltersSelector);
  const addQuickFilterOption = useSelector(addQuickFilterOptionSelector);
  const selectedQuickFilter = useSelector(selectedQuickFilterSelector);

  const currentUser = useSelector(userProfileSelector);
  const currentOrganization = useSelector(selectedUserOrganizationSelector);
  const iconColorFilterActiveItem =
    currentOrganization?.themeSettings?.find(
      ({ name }) => name === 'icon.active.filter',
    ) || {};
  const iconColorActiveItem =
    currentOrganization?.themeSettings?.find(
      ({ name }) => name === 'icon.active.color',
    ) || {};
  const viewOnlyArchivedTasksEnabledItem =
    currentOrganization?.themeSettings?.find(
      ({ name }) => name === 'role.viewOnly.patient.view.archivedTasks.enabled',
    ) || {};
  const viewOnlyCustomizeEnabledItem =
    currentOrganization?.themeSettings?.find(
      ({ name }) => name === 'role.viewOnly.patient.view.customize.enabled',
    ) || {};
  const viewOnlyArchivedTasksEnabled = !(
    isUserViewOnly(currentUser) &&
    viewOnlyArchivedTasksEnabledItem?.value === 'false'
  );
  const viewOnlyCustomizeEnabled = !(
    isUserViewOnly(currentUser) &&
    viewOnlyCustomizeEnabledItem?.value === 'false'
  );

  const handleListChange = (event) => {
    history.push(
      createPatientDetailsListPath(
        patientIdentifier,
        event.target?.value || lists[0].taskListIdentifier,
      ),
    );
  };

  const handleListViewTypeChange = (event) => {
    history.push(
      createPatientDetailsListPath(
        patientIdentifier,
        event.target?.value === ListViewType.ALL_TASKS
          ? ListViewType.ALL_TASKS
          : lists[0].taskListIdentifier,
      ),
    );
  };

  const handleFilterSelect = compose(
    dispatch,
    PatientDetailsActions.changePatientTasksFilters,
  );

  const handleSelectQuickFilter = useCallback(
    (id, filtersSetup) => {
      dispatch(selectQuickFilter(id));
      dispatch(
        PatientDetailsActions.changePatientTasksFilters(filtersSetup, id),
      );
    },
    [dispatch],
  );

  const handleSaveAsQuickFilter = useCallback(
    () => dispatch(showAddQuickFilterOption()),
    [dispatch],
  );

  const wasChangedFilters = useMemo(
    () =>
      !equals(
        selectedFilters,
        quickFiltersList?.find(
          (f) => f.quickFilterIdentifier === selectedQuickFilter,
        )?.selectedOptions,
      ),
    [quickFiltersList, selectedFilters, selectedQuickFilter],
  );

  const handleQuickFilterCreate = useCallback(
    (name, scope) =>
      dispatch(
        createQuickFilter(name, { patientIdentifier }, selectedFilters, scope),
      ),
    [dispatch, patientIdentifier, selectedFilters],
  );

  const handleQuickFilterUpdate = useCallback(
    (quickFilterIdentifier, name, selectedFilterOptions, scope) =>
      dispatch(
        updateQuickFilter(
          quickFilterIdentifier,
          { name, selectedOptions: selectedFilterOptions },
          { patientIdentifier },
          scope,
        ),
      ),
    [dispatch, patientIdentifier],
  );

  const handleQuickFilterDelete = useCallback(
    (quickFilterIdentifier) =>
      dispatch(deleteQuickFilter(quickFilterIdentifier)),
    [dispatch],
  );

  const performSearch = useCallback(
    (value) => {
      dispatch(setPatientTaskSearch(value));
      onSearchChanged();
    },
    [setPatientTaskSearch, onSearchChanged],
  );

  const handleSearchValueChange = (newValue) => {
    setSearchValue(newValue);
    performSearch(newValue);
  };

  const OPTIONS = [
    {
      name: 'Show Workflow Details',
      onClick: () =>
        dispatch(
          updateUserPageViewSetup({
            SHOW_WORKFLOW_DETAILS: !viewSetup.SHOW_WORKFLOW_DETAILS,
          }),
        ),
      key: 'SHOW_WORKFLOW_DETAILS',
      checked: viewSetup.SHOW_WORKFLOW_DETAILS,
    },
    {
      name: 'Show Workflow Completed Tasks',
      onClick: () =>
        dispatch(
          updateUserPageViewSetup({
            SHOW_WORKFLOW_COMPLETED_TASKS:
              !viewSetup.SHOW_WORKFLOW_COMPLETED_TASKS,
          }),
        ),
      key: 'SHOW_COMPLETED_OR_UNCOMPLETED_WORKFLOW_DETAILS',
      checked: viewSetup.SHOW_WORKFLOW_COMPLETED_TASKS,
    },
  ];

  const handleChangeTasksStatus = useCallback(
    (status) => {
      dispatch(setCurrentListTasksStatus(status));
      dispatch(getCurrentPatientTasks(status));
    },
    [dispatch],
  );

  const onPrintClick = useCallback(() => {
    onPrint();
    window.print();
    // closeMorePopover();
    // const title = isAllTasksView
    //   ? 'All Tasks'
    //   : listOptions.find(
    //       (element) => element.value === taskListIdentifierParameter,
    //     )?.label;

    // return printTaskPdf({
    //   title,
    //   tasks: tasksToPrint,
    //   taskListMembers: listUsers,
    // });
  }, []);

  useEffect(() => {
    dispatch(getPatientFilterOptions(patientIdentifier));
    dispatch(getQuickFilters({ contextType: 'PATIENTS' }));
  }, [patientIdentifier]);

  return (
    <ListsToolbarContainer>
      <ListsTabsContainer>
        <Box display="flex" flex={1} justifyContent="flex-start">
          {viewOnlyCustomizeEnabled && (
            <CustomizeToolbarButton
              showCustomColumnCreate={false}
              additionalOptions={OPTIONS}
              iconColorFilterActive={iconColorFilterActiveItem?.value}
              {...props}
            />
          )}
          {/* <Spacing horizontal={3} /> */}
          {/* <ToolbarSelect
          options={LIST_TYPE_OPTIONS}
          value={
            isAllTasksView ? ListViewType.ALL_TASKS : ListViewType.LIST_VIEW
          }
          name="listType"
          onChange={handleListViewTypeChange}
          icon={
            <ListSelectionImg
            src={ViewTypeIcon}
            alt="list type icon"
              iconColorFilterActive={iconColorFilterActiveItem?.value}
              />
            }
            iconColorActive={iconColorActiveItem?.value}
            width={170}
          /> */}
          {/* <Box px={2} /> */}
          {taskListIdentifierParameter !== ListViewType.ALL_TASKS && (
            <ToolbarSelect
              options={listOptions}
              value={taskListIdentifierParameter}
              name="currentList"
              onChange={handleListChange}
              icon={
                <ListSelectionImg
                  src={ViewTypeIcon}
                  alt="list type icon"
                  iconColorFilterActive={iconColorFilterActiveItem?.value}
                />
              }
              iconColorActive={iconColorActiveItem?.value}
            />
          )}
          {viewOnlyArchivedTasksEnabled && (
            <>
              <Spacing horizontal={3} />
              <TaskStatusToolbarSelect
                value={tasksStatus}
                onChange={handleChangeTasksStatus}
                iconColorFilterActive={iconColorFilterActiveItem?.value}
                iconColorActive={iconColorActiveItem?.value}
                taskListIdentifier={patientIdentifier}
                origin={TaskOrigin.PATIENT}
              />
            </>
          )}
          <Spacing horizontal={3} />
          <MegaFilter
            filters={filters}
            selectedFilters={selectedFilters}
            onSelectFilters={handleFilterSelect}
            isFetching={isFetchingLists}
            onOpen={() => {
              dispatch(getPatientFilterOptions(patientIdentifier));
              dispatch(getQuickFilters({ contextType: 'PATIENTS' }));
            }}
            quickFiltersList={quickFiltersList}
            addQuickFilterOption={addQuickFilterOption}
            selectedQuickFilter={selectedQuickFilter}
            selectQuickFilter={handleSelectQuickFilter}
            onSaveAsNewClick={handleSaveAsQuickFilter}
            wasChangedFilters={wasChangedFilters}
            onQuickFilterCreate={handleQuickFilterCreate}
            onQuickFilterUpdate={handleQuickFilterUpdate}
            onQuickFilterDelete={handleQuickFilterDelete}
          />
          <Spacing horizontal={3} />
          <HeaderSearch
            value={searchValue}
            onChange={handleSearchValueChange}
            needEnterToSearch
          />
        </Box>
        <GridContainer columns={2}>
          <GridItemFullView
            active={patientViewType === 'FULL_VIEW'}
            onClick={() => {
              handlePatientView('FULL_VIEW');
              handleRemoveAllTasks();
            }}
          >
            <FullViewIcon />
          </GridItemFullView>
          <GridItemSlimView
            active={patientViewType === 'SLIM_VIEW'}
            onClick={() => {
              handlePatientView('SLIM_VIEW');
              handleRemoveAllTasks();
            }}
          >
            <SlimViewIcon />
          </GridItemSlimView>
        </GridContainer>
      </ListsTabsContainer>
      {/* {viewOnlyArchivedTasksEnabled && (
        <>
          <Spacing horizontal={4} />
          <TaskStatusToolbarSelect
            value={tasksStatus}
            onChange={handleChangeTasksStatus}
            iconColorFilterActive={iconColorFilterActiveItem?.value}
            iconColorActive={iconColorActiveItem?.value}
          />
        </>
      )} */}
      {/* {viewOnlyCustomizeEnabled && (
        <>
          <Spacing horizontal={3} />
          <CustomizeToolbarButton
            showCustomColumnCreate={false}
            additionalOptions={OPTIONS}
            iconColorFilterActive={iconColorFilterActiveItem?.value}
            {...props}
          />
          <Spacing horizontal={3} />
          <ToolbarButton onClick={onPrintClick}>Print</ToolbarButton>
        </>
      )} */}
    </ListsToolbarContainer>
  );
};

export default TaskListToolbar;
