import React from 'react'
import PropTypes from 'prop-types';
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux';
import ListOfTasks from './ListOfTasks'
import * as TaskActions from '../../actions/task-actions'
import * as TaskListActions from '../../actions/tasklist-actions'
import * as PatientActions from '../../actions/patient-actions'
import {mobileAnalyticsClient} from '../../api/analytics-api'
import BaseComponent from '../BaseComponent'

class ListOfTasksContainer extends BaseComponent {

  componentDidMount () {
    console.log('logged in user === '+this.props.user)

		mobileAnalyticsClient.recordEvent('VIEW_ACCESS', {
						'PageName': 'ListOfTasks'
		});
    if((!this.props.members || this.props.members.length==0)
        && this.props.taskListId){
      this.props.taskListActions.getMembersByTaskListId(this.props.taskListId, "ALL")
    }
    
  }

  componentWillUnmount(){
    closeAddForm()
  }

  render () {
    return (<ListOfTasks tasks={this.props.filteredTasks}
              deleteTask={this.props.actions.deleteTask}
              taskStatusGroup={this.props.status}
              markComplete={this.props.actions.markComplete}
              updateTaskDescription={this.props.actions.updateTaskDescription}
              toggleTaskPriority={this.props.actions.toggleTaskPriority}
              // assignOrReassignTask={this.props.actions.assignOrReassignTask}
              addTaskComment={this.props.actions.addTaskComment}
              addPatientToTask={this.props.patientActions.addPatientToTask}
              markAsUnread={this.props.actions.markAsUnread}
              members={this.props.members}
              setTaskEditingStatus={this.props.setTaskEditingStatus}
              listName={this.props.listName}
            />);
  }


}

//property validation
ListOfTasksContainer.propTypes = {
    // tasks: PropTypes.array.isRequired,
    actions: PropTypes.object.isRequired
}

const mapStateToProps = function (store, props) {
  // var listMembers = store.taskListState.tasklistmembers
  var listMembers = []
  var currentTaskListMembersDetails = store.taskListState.allTaskListMembers.filter(details => details.taskListId == props.taskListId)
  if(currentTaskListMembersDetails && currentTaskListMembersDetails.length>0){
    listMembers = currentTaskListMembersDetails[0].tasklistmembers
  }

  return {
    user: store.userState.user,
    members: listMembers,
  };

}


const mapDispatchToProps = function (dispatch) {
  return {
    actions: bindActionCreators(TaskActions, dispatch),
    taskListActions: bindActionCreators(TaskListActions, dispatch),
    patientActions: bindActionCreators(PatientActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ListOfTasksContainer);
