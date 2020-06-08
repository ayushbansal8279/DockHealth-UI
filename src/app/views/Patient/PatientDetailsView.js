import React from 'react';
import { connect } from 'react-redux';
import { hashHistory } from 'react-router';
import Toolbar from 'components/taskView/Toolbar/NewToolbar';
import { TaskListTabName } from 'components/taskView/Toolbar/config';
import ViewLoader from 'components/common/ViewLoader/ViewLoader';

import { PatientListsContainer } from './styled';

const PatientDetailsView = ({
  children,
  routeParams: { patientIdentifier },
  patientTasks: { isFetching, activeTab },
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
        openTasksAmount={0}
        completedTasksAmount={0}
        onSearchChange={() => {}}
        showNotifications={() => {}}
        searchValue={null}
        onSelectFilters={() => {}}
        showMembers={false}
      />
      <ViewLoader isFetchingData={isFetching}>
        <PatientListsContainer>{children}</PatientListsContainer>
      </ViewLoader>
    </>
  );
};

const mapStateToProps = store => ({
  patientTasks: store.patientTasks,
});

export default connect(mapStateToProps)(PatientDetailsView);
