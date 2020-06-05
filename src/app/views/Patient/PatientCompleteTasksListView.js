import React from 'react';
import { connect } from 'react-redux';
import ListDropdown from 'components/lists/list-dropdown/list-dropdown';

const PatientCompleteTasksListView = ({ patientTasks: { lists } }) => {
  return lists.map(list => (
    <ListDropdown key={list.taskListIdentifier} list={list} />
  ));
};

const mapStateToProps = store => ({
  patientTasks: store.patientTasks,
});

export default connect(mapStateToProps)(PatientCompleteTasksListView);
