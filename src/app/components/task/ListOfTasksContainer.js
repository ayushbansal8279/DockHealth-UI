import React from 'react'
import PropTypes from 'prop-types';
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux';
import ListOfTasks from './ListOfTasks'
import * as TaskActions from '../../actions/task-actions'
import * as PatientActions from '../../actions/patient-actions'
import {mobileAnalyticsClient} from '../../api/analytics-api'
import BaseComponent from '../BaseComponent'

class ListOfTasksContainer extends BaseComponent {

  componentDidMount () {
    console.log('logged in user === '+this.props.user)

		mobileAnalyticsClient.recordEvent('VIEW_ACCESS', {
						'PageName': 'ListOfTasks'
		});
    // if(this.props.taskListId){
    //   this.props.actions.getListTasks(this.props.taskListId)
    // }else{
    //   this.props.actions.getInboxTasks()
    // }
  }

  render () {
    return (<ListOfTasks tasks={this.props.filteredTasks} deleteTask={this.props.actions.deleteTask} listName={this.props.status}
            markComplete={this.props.actions.markComplete} updateTaskDescription={this.props.actions.updateTaskDescription}
            toggleTaskPriority={this.props.actions.toggleTaskPriority}
            assignOrReassignTask={this.props.actions.assignOrReassignTask}
            addTaskComment={this.props.actions.addTaskComment}
            addPatientToTask={this.props.patientActions.addPatientToTask}
            markAsUnread={this.props.actions.markAsUnread}
            members={this.props.members}
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
