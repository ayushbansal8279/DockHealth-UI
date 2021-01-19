/* eslint-disable sonarjs/cognitive-complexity */
import React, {
  useState,
  useMemo,
  useCallback,
  useEffect,
  useRef,
} from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { useHistory, useRouteMatch, Switch } from 'react-router-dom';
import Toolbar from 'components/taskView/Toolbar/NewToolbar';
import { TaskListTabName } from 'components/taskView/Toolbar/config';
import NewTaskDrawer from 'components/taskView/newTaskDrawer/NewTaskDrawer';
import { TaskDrawerFields } from 'components/taskView/newTaskDrawer/NewTaskDrawer.Utilities';
import BulkEditOptionsBar from 'components/tasklist/BulkEditOptionsBar/BulkEditOptionsBar';
import * as ModalActions from 'modal/actions';
import { PatientTasksSagaActions } from 'sagas/patient-tasks-saga';
import {
  patientTasksStateSelector,
  patientListHasTasksSelector,
  patientTaskSearchSelector,
} from 'selectors/patient-tasks-selectors';
import { patientDetailsSelector } from 'selectors/patient-selectors';
import { megaFilterSelector } from 'selectors/mega-filter-selectors';
import { userProfileSelector } from 'selectors/user-selectors';
import { organizationSelector } from 'selectors/organization-selectors';
import { checkIfTaskMatchesFilters } from 'helpers/filters-helpers';
import {
  onEnterPatientOpenTasksListView,
  onEnterPatientCompleteTasksListView,
} from 'routing/TemplateCoreSubscriptionPlan/PatientDetails';
import { RouteWrapper } from 'routing/components';
import PatientDetailsHeader from './PatientDetailsHeader/PatientDetailsHeader';

import { PatientListsContainer } from './styled';
import PatientListSkeletonLoader from './PatientListSkeletonLoader/PatientListSkeletonLoader';
import PatientToolbarSkeletonLoader from './PatientToolbarSkeletonLoader/PatientToolbarSkeletonLoader';

import PatientTasksListView from './PatientTasksListView';

const TABS = [
  {
    path: '/',
    RouteComponent: PatientTasksListView,
    onEnter: onEnterPatientOpenTasksListView,
    exact: true,
  },
  {
    path: '/complete',
    RouteComponent: PatientTasksListView,
    onEnter: onEnterPatientCompleteTasksListView,
  },
];

const PatientDetailsView = ({
  match,
  patientTasks: {
    isFetching,
    activeTab,
    incompleteTasksCount,
    completeTasksCount,
    lists,
  },
  modalActions,
  megaFilter,
  hasTasks,
  patientTasksSagaActions,
  taskSearch,
  patientDetails,
  organization,
}) => {
  const { selectedFilters } = megaFilter;
  const [searchValue, setSearchValue] = useState(taskSearch);
  const [bulkEditTasks, setBulkEditTasks] = useState([]);
  const previousSelectedFilters = useRef();

  useEffect(() => {
    previousSelectedFilters.current = selectedFilters;
  }, [selectedFilters]);

  const history = useHistory();
  const { params } = match;
  const { patientIdentifier } = params;
  const { path } = useRouteMatch();

  const onSelectBulkEditTask = useCallback(
    taskIdentifier => setBulkEditTasks([...bulkEditTasks, taskIdentifier]),
    [bulkEditTasks],
  );

  const onUnselectBulkEditTask = useCallback(
    taskIdentifier =>
      setBulkEditTasks(
        bulkEditTasks?.filter(
          bulkTaskIdentifier => bulkTaskIdentifier !== taskIdentifier,
        ),
      ),
    [bulkEditTasks],
  );

  const getTaskIsSelectedInBulkEdit = useCallback(
    taskIdentifier => bulkEditTasks?.includes(taskIdentifier),
    [bulkEditTasks],
  );

  const onClickBulkEditTask = useCallback(
    taskIdentifier =>
      getTaskIsSelectedInBulkEdit(taskIdentifier)
        ? onUnselectBulkEditTask(taskIdentifier)
        : onSelectBulkEditTask(taskIdentifier),
    [getTaskIsSelectedInBulkEdit, onUnselectBulkEditTask, onSelectBulkEditTask],
  );

  const bulkEditTaskActions = useMemo(
    () => ({
      getTaskIsSelectedInBulkEdit,
      onClickBulkEditTask,
      onUnselectBulkEditTask,
    }),
    [getTaskIsSelectedInBulkEdit, onClickBulkEditTask, onUnselectBulkEditTask],
  );

  const navigateToTab = tabName => {
    history.push(
      tabName === TaskListTabName.OPEN
        ? `/core/patient/${patientIdentifier}/`
        : `/core/patient/${patientIdentifier}/${TaskListTabName.COMPLETE}`,
    );
  };

  const allMembers = useMemo(() => {
    const allListsMembers = [];
    if (lists) {
      lists.forEach(list => {
        const { listUsers } = list;
        const listMembers = listUsers;

        if (!listMembers) {
          return;
        }

        listMembers.forEach(member => {
          if (
            !allListsMembers.find(
              ({ userIdentifier }) => userIdentifier === member.userIdentifier,
            )
          ) {
            allListsMembers.push(member);
          }
        });
      });
    }
    return allListsMembers;
  }, [lists]);

  const {
    patientTasksFilterChange,
    setPatientTaskSearch,
    refreshPatientTasks,
    fetchPatientFilters,
  } = patientTasksSagaActions;

  useEffect(() => {
    if (
      (searchValue && searchValue !== '') ||
      activeTab === TaskListTabName.COMPLETE ||
      (Object.keys(previousSelectedFilters?.current).length === 0 &&
        Object.keys(selectedFilters).length !== 0)
    ) {
      setBulkEditTasks([]);
    }
  }, [searchValue, activeTab, previousSelectedFilters, selectedFilters]);

  const handleSearchValueChange = value => {
    setSearchValue(value);
    setPatientTaskSearch(value);
  };

  const handleTaskUpdate = useCallback(
    updatedTask => {
      fetchPatientFilters();
      if (!checkIfTaskMatchesFilters(updatedTask, selectedFilters)) {
        refreshPatientTasks();
      }
    },
    [selectedFilters, refreshPatientTasks, fetchPatientFilters],
  );

  return (
    <>
      <PatientDetailsHeader
        patientDetails={patientDetails}
        organization={organization}
      />
      {incompleteTasksCount > 0 || completeTasksCount > 0 ? (
        <Toolbar
          onSelectTab={navigateToTab}
          selectedTab={activeTab}
          printData={{
            completedTasks:
              activeTab === TaskListTabName.COMPLETE
                ? lists.flatMap(({ tasks }) => tasks)
                : [],
            openedTasks:
              activeTab === TaskListTabName.OPEN
                ? lists.flatMap(({ tasks }) => tasks)
                : [],
            taskListMembers: allMembers,
          }}
          openTasksAmount={incompleteTasksCount}
          completedTasksAmount={completeTasksCount}
          onSearchChange={handleSearchValueChange}
          showNotifications={false}
          searchValue={searchValue}
          onSelectFilters={patientTasksFilterChange}
          showMembers={false}
          megaFilter={megaFilter}
          haveTasks={hasTasks}
          patientColumnVisible={false}
          listNameColumnVisible
          pdfTitle={
            patientDetails
              ? `Patient: ${patientDetails.firstName} ${patientDetails.lastName}`
              : null
          }
        />
      ) : (
        <PatientToolbarSkeletonLoader />
      )}
      <PatientListsContainer>
        <Switch>
          {TABS?.map(route => (
            <RouteWrapper
              key={route.path}
              path={`${path}${route.path}`}
              RouteComponent={
                isFetching
                  ? PatientListSkeletonLoader
                  : props => {
                      const RouteCompoent = route.RouteComponent;
                      return (
                        <RouteCompoent
                          {...props}
                          bulkEditTaskActions={
                            activeTab === TaskListTabName.OPEN
                              ? bulkEditTaskActions
                              : null
                          }
                        />
                      );
                    }
              }
              onEnter={route.onEnter}
              exact={route.exact}
            />
          ))}
        </Switch>
      </PatientListsContainer>
      <NewTaskDrawer
        modalActions={modalActions}
        onTaskUpdate={handleTaskUpdate}
        onTaskCreation={handleTaskUpdate}
        onTaskDelete={fetchPatientFilters}
        disabledFileds={[TaskDrawerFields.PATIENT]}
      />
      <BulkEditOptionsBar
        selectedTasks={bulkEditTasks}
        onClose={() => setBulkEditTasks([])}
      />
    </>
  );
};

const mapDispatchToProps = dispatch => ({
  modalActions: bindActionCreators(ModalActions, dispatch),
  patientTasksSagaActions: bindActionCreators(
    PatientTasksSagaActions,
    dispatch,
  ),
});

const mapStateToProps = state => ({
  patientTasks: patientTasksStateSelector(state),
  megaFilter: megaFilterSelector(state),
  hasTasks: patientListHasTasksSelector(state),
  taskSearch: patientTaskSearchSelector(state),
  currentUser: userProfileSelector(state),
  patientDetails: patientDetailsSelector(state),
  organization: organizationSelector(state),
});

export default connect(mapStateToProps, mapDispatchToProps)(PatientDetailsView);
