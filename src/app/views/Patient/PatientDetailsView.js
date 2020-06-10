import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { hashHistory } from 'react-router';
import Toolbar from 'components/taskView/Toolbar/NewToolbarContainer';
import { TaskListTabName } from 'components/taskView/Toolbar/config';
import ViewLoader from 'components/common/ViewLoader/ViewLoader';
import NewTaskDrawer from 'components/taskView/newTaskDrawer/NewTaskDrawer';
import * as ModalActions from 'modal/actions';
import { patientTasksStateSelector } from 'selectors/patient-tasks-selectors';
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
}) => {
  const navigateToTab = tabName => {
    hashHistory.push(
      `/patient/${patientIdentifier}${
        tabName === TaskListTabName.OPEN ? '' : `/${TaskListTabName.COMPLETE}`
      }`,
    );
  };

  return (
    <>
      <PatientDetailsHeader />
      <Toolbar
        onSelectTab={navigateToTab}
        selectedTab={activeTab}
        printData={{}}
        openTasksAmount={incompleteTasksCount}
        completedTasksAmount={completeTasksCount}
        onSearchChange={() => {}}
        showNotifications={false}
        searchValue={null}
        onSelectFilters={() => {}}
        showMembers={false}
        megaFilter={{}}
      />
      <ViewLoader isFetchingData={isFetching}>
        <PatientListsContainer>{children}</PatientListsContainer>
        <NewTaskDrawer modalActions={modalActions} />
      </ViewLoader>
    </>
  );
};

const mapDispatchToProps = dispatch => ({
  modalActions: bindActionCreators(ModalActions, dispatch),
});

const mapStateToProps = state => ({
  patientTasks: patientTasksStateSelector(state),
});

export default connect(mapStateToProps, mapDispatchToProps)(PatientDetailsView);
