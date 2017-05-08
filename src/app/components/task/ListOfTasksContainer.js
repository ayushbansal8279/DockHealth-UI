import React from 'react'
import PropTypes from 'prop-types';
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux';
import ListOfTasks from './ListOfTasks'
import * as TaskActions from '../../actions/task-actions'

class ListOfTasksContainer extends React.Component {

  componentDidMount () {
    console.log('logged in user === '+this.props.user)
    this.props.actions.getListTasksByUser('1', '1')
  }

  render () {
    return (<ListOfTasks tasks={this.props.tasks} deleteTask={this.props.actions.deleteTask}
            markComplete={this.props.actions.markComplete} updateTaskDescription={this.props.actions.updateTaskDescription}
            toggleTaskPriority={this.props.actions.toggleTaskPriority} 
            assignOrReassignTask={this.props.actions.assignOrReassignTask}
            addTaskComment={this.props.actions.addTaskComment}
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
    tasks: store.taskState.tasks,
    user: store.userState.user
  };
  
}

const mapDispatchToProps = function (dispatch) {  
  return {
    actions: bindActionCreators(TaskActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ListOfTasksContainer);
