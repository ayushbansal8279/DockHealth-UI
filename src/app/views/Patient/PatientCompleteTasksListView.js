import React from 'react';
import { connect } from 'react-redux';
import TaskListDetailsDropdown from 'components/tasklist/TaskListDetailsDropdown/TaskListDetailsDropdown';

const PatientCompleteTasksListView = ({ patientTasks: { lists } }) => {
  return lists.map(list => (
    <TaskListDetailsDropdown key={list.taskListIdentifier} list={list} />
  ));
};

const mapStateToProps = store => ({
  patientTasks: store.patientTasks,
});

export default connect(mapStateToProps)(PatientCompleteTasksListView);
