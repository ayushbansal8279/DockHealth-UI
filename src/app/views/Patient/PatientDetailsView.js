import React, { useState, useMemo } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { hashHistory } from 'react-router';
import Toolbar from 'components/taskView/Toolbar/NewToolbar';
import { TaskListTabName } from 'components/taskView/Toolbar/config';
import ViewLoader from 'components/common/ViewLoader/ViewLoader';
import NewTaskDrawer from 'components/taskView/newTaskDrawer/NewTaskDrawer';
import * as ModalActions from 'modal/actions';
import { PatientTasksSagaActions } from 'sagas/patient-tasks';
import {
  patientTasksStateSelector,
  patientListHasTasksSelector,
  patientTaskSearchSelector,
} from 'selectors/patient-tasks-selectors';
import { megaFilterSelector } from 'selectors/mega-filter-selectors';
import { userProfileSelector } from 'selectors/user-selectors';
import PatientDetailsHeader from './PatientDetailsHeader/PatientDetailsHeader';

import { PatientListsContainer } from './styled';

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
  currentUser,
}) => {
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
    lists.forEach(list => {
      const { adminUsers, memberUsers } = list;
      const listMembers = [currentUser].concat(adminUsers).concat(memberUsers);

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
    return allListsMembers;
  }, [lists, currentUser]);

  const {
    patientTasksFilterChange,
    setPatientTaskSearch,
  } = patientTasksSagaActions;

  const handleSearchValueChange = value => {
    setSearchValue(value);
    setPatientTaskSearch(value);
  };

  return (
    <>
      <PatientDetailsHeader />
      {(incompleteTasksCount > 0 || completeTasksCount > 0) && (
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
        />
      )}
      <ViewLoader isFetchingData={isFetching}>
        <PatientListsContainer>{children}</PatientListsContainer>
        <NewTaskDrawer modalActions={modalActions} />
      </ViewLoader>
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
});

export default connect(mapStateToProps, mapDispatchToProps)(PatientDetailsView);
