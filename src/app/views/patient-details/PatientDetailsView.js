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
import BulkEditSection from 'components/tasklist/BulkEditSection/BulkEditSection';
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
  const [shouldResetBulkEditTasks, setShouldResetBulkEditTasks] = useState(
    false,
  );
  const previousSelectedFilters = useRef(selectedFilters);
  const previousSearchValue = useRef(null);

  const history = useHistory();
  const { params } = match;
  const { patientIdentifier } = params;
  const { path } = useRouteMatch();

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

  const handleSearchValueChange = value => {
    setSearchValue(value);
    setPatientTaskSearch(value);
  };

  const handleTaskUpdate = useCallback(
    updatedTask => {
      fetchPatientFilters();
      if (!checkIfTaskMatchesFilters(updatedTask, selectedFilters)) {
        refreshPatientTasks({ withLoader: false });
      }
    },
    [selectedFilters, refreshPatientTasks, fetchPatientFilters],
  );

  const refreshTab = useCallback(() => {
    fetchPatientFilters();
    refreshPatientTasks({ withLoader: true });
  }, [refreshPatientTasks, fetchPatientFilters]);

  useEffect(() => {
    if (
      previousSearchValue?.current !== searchValue ||
      Object.keys(previousSelectedFilters?.current).length !==
        Object.keys(selectedFilters).length ||
      (activeTab === TaskListTabName.COMPLETE && !shouldResetBulkEditTasks)
    ) {
      // eslint-disable-next-line react/no-did-update-set-state
      setShouldResetBulkEditTasks(true);
    }

    if (
      (searchValue === previousSearchValue?.current ||
        (Object.keys(previousSelectedFilters?.current).length === 0 &&
          Object.keys(selectedFilters).length !== 0) ||
        activeTab === TaskListTabName.OPEN) &&
      shouldResetBulkEditTasks
    ) {
      // eslint-disable-next-line react/no-did-update-set-state
      setShouldResetBulkEditTasks(false);
    }
  }, [
    searchValue,
    activeTab,
    previousSelectedFilters,
    selectedFilters,
    shouldResetBulkEditTasks,
  ]);

  useEffect(() => {
    previousSelectedFilters.current = selectedFilters;
  }, [selectedFilters]);

  useEffect(() => {
    previousSearchValue.current = searchValue;
  }, [searchValue]);

  return (
    <BulkEditSection
      shouldResetBulkEditTasks={shouldResetBulkEditTasks}
      refreshTasksOnBulkAction={refreshTab}
      inactiveBulkEdit={activeTab === TaskListTabName.COMPLETE}
      searchValue={searchValue}
    >
      <div>
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
                  isFetching ? PatientListSkeletonLoader : route.RouteComponent
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
      </div>
    </BulkEditSection>
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
