import React from 'react';
import { connect } from 'react-redux';
import TaskListDetailsDropdown from 'components/tasklist/TaskListDetailsDropdown/TaskListDetailsDropdown';

const PatientOpenTasksListView = ({ patientLists }) => {
  console.log('lists', patientLists);
  return patientLists.map(list => (
    <TaskListDetailsDropdown
      key={list.taskListIdentifier}
      listName={list.listName}
      tasks={list.tasks}
    />
  ));
};

const mapStateToProps = store => ({
  patientLists: store.patientTasks.lists,
});

export default connect(mapStateToProps)(PatientOpenTasksListView);
