/* eslint-disable sonarjs/cognitive-complexity */
import React, {
  useState,
  useMemo,
  useCallback,
  useEffect,
  useRef,
} from 'react';
import { bindActionCreators } from 'redux';
import { connect, useDispatch } from 'react-redux';
import { useHistory, useRouteMatch, Switch } from 'react-router-dom';
import * as PatientApi from 'api/patient-api';
import Toolbar from 'components/tasklist/Toolbar/Toolbar';
import { onSearchChanged } from 'helpers/ga-event-helper';
import { TaskListTabName } from 'helpers/tasklist-helpers';
import TaskDrawer from 'components/task-drawer/TaskDrawer/TaskDrawer';
import { DrawerFieldEnum } from 'helpers/task-drawer-helpers';
import BulkEditSection from 'components/tasklist/BulkEditSection/BulkEditSection';
import GroupedListSkeletonLoader from 'components/tasklist/GroupedListSkeletonLoader/GroupedListSkeletonLoader';
import GenericHeader from 'components/template/GenericHeader/GenericHeader';
import * as ModalActions from 'modal/actions';
import { PatientTasksSagaActions } from 'sagas/patient-tasks-saga';
import {
  patientTasksStateSelector,
  patientListHasTasksSelector,
  patientTaskSearchSelector,
} from 'selectors/patient-tasks-selectors';
import { setHeader } from 'actions/template-actions';
import { megaFilterSelector } from 'selectors/mega-filter-selectors';
import { userProfileSelector } from 'selectors/user-selectors';
import { organizationSelector } from 'selectors/organization-selectors';
import { checkIfTaskMatchesFilters } from 'helpers/filters-helpers';
import {
  onEnterPatientOpenTasksListView,
  onEnterPatientCompleteTasksListView,
} from 'routing/TemplateCoreSubscriptionPlan/PatientDetails';
import { RouteWrapper } from 'routing/components';
import { getCustomerTypeLabel } from 'helpers/customer-type-helper';
import { capitalize } from 'helpers/capitalize';
import debounce from 'lodash.debounce';
import PatientDetailsHeader from './PatientDetailsHeader/PatientDetailsHeader';

import { PatientListsContainer } from './styled';
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
  organization,
  currentUser,
}) => {
  const { selectedFilters } = megaFilter;
  const [searchValue, setSearchValue] = useState(taskSearch);
  const [patient, setPatient] = useState({});
  const [isLoadingPatient, setIsLoadingPatient] = useState(false);
  const previousSelectedFilters = useRef(selectedFilters);
  const previousSearchValue = useRef(null);

  const history = useHistory();
  const { params } = match;
  const { patientIdentifier } = params;
  const { path } = useRouteMatch();

  const fetchPatient = useCallback(
    () =>
      PatientApi.getPatientById(patientIdentifier)
        .then(fetchedPatient => {
          setPatient(fetchedPatient);
          return fetchedPatient;
        })
        .catch(() => {}),
    [patientIdentifier],
  );

  useEffect(() => {
    if (patientIdentifier) {
      setIsLoadingPatient(true);
      fetchPatient().then(() => {
        setIsLoadingPatient(false);
      });
    }
  }, [patientIdentifier, fetchPatient]);

  const dispatch = useDispatch();
  const customerTypeLabel = getCustomerTypeLabel(currentUser);
  const customerTypeLabelCapitalized = capitalize(customerTypeLabel);

  useEffect(() => {
    dispatch(
      setHeader({
        layout: [
          {
            key: 'patients-header',
            component: (
              <>
                <GenericHeader>{customerTypeLabelCapitalized}</GenericHeader>
              </>
            ),
          },
        ],
      }),
    );
  }, [dispatch, customerTypeLabelCapitalized]);

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

  const onSearchChangedWithDebouce = useCallback(
    debounce(value => {
      setPatientTaskSearch(value);
      onSearchChanged();
    }, 500),
    [setPatientTaskSearch, onSearchChanged],
  );

  const handleSearchValueChange = value => {
    setSearchValue(value);
    onSearchChangedWithDebouce(value);
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
    previousSelectedFilters.current = selectedFilters;
  }, [selectedFilters]);

  useEffect(() => {
    previousSearchValue.current = searchValue;
  }, [searchValue]);

  const openedTasks =
    activeTab === TaskListTabName.OPEN
      ? lists.flatMap(({ tasks }) => tasks)
      : [];

  const completedTasks =
    activeTab === TaskListTabName.COMPLETE
      ? lists.flatMap(({ tasks }) => tasks)
      : [];

  return (
    <BulkEditSection
      allTasks={openedTasks}
      refreshTasks={refreshTab}
      disabled={activeTab === TaskListTabName.COMPLETE}
      searchValue={searchValue}
    >
      <div>
        <PatientDetailsHeader
          patient={patient}
          isLoadingPatient={isLoadingPatient}
          organization={organization}
          setPatient={setPatient}
          refreshPatient={fetchPatient}
        />
        {incompleteTasksCount > 0 || completeTasksCount > 0 ? (
          <Toolbar
            onSelectTab={navigateToTab}
            selectedTab={activeTab}
            printData={{
              completedTasks,
              openedTasks,
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
              patient
                ? `Patient: ${patient.firstName} ${patient.lastName}`
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
                  isFetching ? GroupedListSkeletonLoader : route.RouteComponent
                }
                onEnter={route.onEnter}
                exact={route.exact}
              />
            ))}
          </Switch>
        </PatientListsContainer>
        <TaskDrawer
          modalActions={modalActions}
          onTaskUpdate={handleTaskUpdate}
          onTaskCreation={handleTaskUpdate}
          onTaskDelete={fetchPatientFilters}
          disabledFields={[DrawerFieldEnum.PATIENT]}
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
  organization: organizationSelector(state),
});

export default connect(mapStateToProps, mapDispatchToProps)(PatientDetailsView);
