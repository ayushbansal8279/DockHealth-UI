import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { hashHistory } from 'react-router';
import Toolbar from 'components/taskView/Toolbar/NewToolbar';
import { TaskListTabName } from 'components/taskView/Toolbar/config';
import ViewLoader from 'components/common/ViewLoader/ViewLoader';
import NewTaskDrawer from 'components/taskView/newTaskDrawer/NewTaskDrawer';
import * as ModalActions from 'modal/actions';

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
  console.count('main view');
  const navigateToTab = tabName => {
    hashHistory.push(
      `/patient/${patientIdentifier}${
        tabName === TaskListTabName.OPEN ? '' : `/${TaskListTabName.COMPLETE}`
      }`,
    );
  };

  return (
    <>
      <div>PatientForm</div>
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

const mapStateToProps = store => ({
  patientTasks: store.patientTasks,
});

export default connect(mapStateToProps, mapDispatchToProps)(PatientDetailsView);
