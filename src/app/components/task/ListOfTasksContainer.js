import React from 'react'
import PropTypes from 'prop-types';
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux';
import ListOfTasks from './ListOfTasks'
import * as TaskActions from '../../actions/task-actions'
import * as PatientActions from '../../actions/patient-actions'

class ListOfTasksContainer extends React.Component {

  componentDidMount () {
    console.log('logged in user === '+this.props.user)
    this.props.actions.getListTasksByUser(this.props.taskListId, this.props.status)
  }

  render () {
    return (<ListOfTasks tasks={this.props.status == "INCOMPLETE" ? this.props.tasks : this.props.completedTasks} deleteTask={this.props.actions.deleteTask}
            markComplete={this.props.actions.markComplete} updateTaskDescription={this.props.actions.updateTaskDescription}
            toggleTaskPriority={this.props.actions.toggleTaskPriority}
            assignOrReassignTask={this.props.actions.assignOrReassignTask}
            addTaskComment={this.props.actions.addTaskComment}
            addPatientToTask={this.props.patientActions.addPatientToTask}
            />);
  }


}

//property validation
ListOfTasksContainer.propTypes = {
    tasks: PropTypes.array.isRequired,
    actions: PropTypes.object.isRequired
}

const mapStateToProps = function (store) {
  return {
    tasks: store.taskState.tasks, // actions (binded below) set states for tasks which are then returned here
    completedTasks: store.taskState.completedTasks, // actions (binded below) set states for tasks which are then returned here
    user: store.userState.user
  };

}

const mapDispatchToProps = function (dispatch) {
  return {
    actions: bindActionCreators(TaskActions, dispatch),
    patientActions: bindActionCreators(PatientActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ListOfTasksContainer);
