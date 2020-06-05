import React from 'react';
import { connect } from 'react-redux';

const PatientOpenTasksListView = ({ patientTasks: { lists } }) => {
  console.log('lists', lists);
  return <div>Open</div>;
};

const mapStateToProps = store => ({
  patientTasks: store.patientTasks,
});

export default connect(mapStateToProps)(PatientOpenTasksListView);
