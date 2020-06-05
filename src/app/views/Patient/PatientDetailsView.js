import React from 'react';
import { connect } from 'react-redux';
import { hashHistory } from 'react-router';
import Toolbar from 'components/taskView/Toolbar/NewToolbar';
import { TaskListTabName } from 'components/taskView/Toolbar/config';

const PatientDetailsView = ({
  children,
  routeParams: { patientIdentifier },
  patientLists: { activeTab },
  ...rest
}) => {
  console.log('props', rest);

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
        openTasksAmount={2}
        completedTasksAmount={3}
        onSearchChange={() => {}}
        showNotifications={() => {}}
        searchValue={null}
        onSelectFilters={() => {}}
        showMembers={false}
      />
      {children}
    </>
  );
};

const mapStateToProps = store => ({
  patientLists: store.patientLists,
});

export default connect(mapStateToProps)(PatientDetailsView);
