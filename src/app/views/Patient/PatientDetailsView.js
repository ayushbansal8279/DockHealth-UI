import React, { useState } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { hashHistory } from 'react-router';
import Toolbar from 'components/taskView/Toolbar/NewToolbarContainer';
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
  },
  modalActions,
  megaFilter,
  hasTasks,
  patientTasksSagaActions,
  taskSearch,
}) => {
  const [searchValue, setSearchValue] = useState(taskSearch);
  const navigateToTab = tabName => {
    hashHistory.push(
      `/patient/${patientIdentifier}${
        tabName === TaskListTabName.OPEN ? '' : `/${TaskListTabName.COMPLETE}`
      }`,
    );
  };

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
      <ViewLoader isFetchingData={isFetching}>
        {(incompleteTasksCount > 0 || completeTasksCount > 0) && (
          <Toolbar
            onSelectTab={navigateToTab}
            selectedTab={activeTab}
            printData={{}}
            openTasksAmount={incompleteTasksCount}
            completedTasksAmount={completeTasksCount}
            onSearchChange={handleSearchValueChange}
            showNotifications={false}
            searchValue={searchValue}
            onSelectFilters={patientTasksFilterChange}
            showMembers={false}
            megaFilter={megaFilter}
            haveTasks={hasTasks}
          />
        )}
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
});

export default connect(mapStateToProps, mapDispatchToProps)(PatientDetailsView);
