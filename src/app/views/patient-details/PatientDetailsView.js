/* eslint-disable sonarjs/cognitive-complexity */
import React, { useState, useMemo, useCallback } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { hashHistory } from 'react-router';
import Toolbar from 'components/taskView/Toolbar/NewToolbar';
import { TaskListTabName } from 'components/taskView/Toolbar/config';
import NewTaskDrawer from 'components/taskView/newTaskDrawer/NewTaskDrawer';
import { TaskDrawerFields } from 'components/taskView/newTaskDrawer/NewTaskDrawer.Utilities';
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
import { checkIfTaskMatchesFilters } from 'helpers/filters-helpers';
import PatientDetailsHeader from './PatientDetailsHeader/PatientDetailsHeader';

import { PatientListsContainer } from './styled';
import PatientListSkeletonLoader from './PatientListSkeletonLoader/PatientListSkeletonLoader';
import PatientToolbarSkeletonLoader from './PatientToolbarSkeletonLoader/PatientToolbarSkeletonLoader';

const PatientDetailsView = ({
  children,
  routeParams: { patientIdentifier },
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
}) => {
  const { selectedFilters } = megaFilter;
  const [searchValue, setSearchValue] = useState(taskSearch);
  const navigateToTab = tabName => {
    hashHistory.push(
      `/patient/${patientIdentifier}${
        tabName === TaskListTabName.OPEN ? '' : `/${TaskListTabName.COMPLETE}`
      }`,
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
        refreshPatientTasks();
      }
    },
    [selectedFilters, refreshPatientTasks, fetchPatientFilters],
  );

  return (
    <>
      <PatientDetailsHeader patientDetails={patientDetails} />
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
      <>
        {isFetching ? (
          <PatientListSkeletonLoader />
        ) : (
          <PatientListsContainer>{children}</PatientListsContainer>
        )}
      </>
      <NewTaskDrawer
        modalActions={modalActions}
        onTaskUpdate={handleTaskUpdate}
        onTaskCreation={handleTaskUpdate}
        onTaskDelete={fetchPatientFilters}
        disabledFileds={[TaskDrawerFields.PATIENT]}
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
});

export default connect(mapStateToProps, mapDispatchToProps)(PatientDetailsView);
