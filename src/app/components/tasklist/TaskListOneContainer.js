import React from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux';
import * as TaskListActions from '../../actions/tasklist-actions';
import TaskListOneRenderContainer from './TaskListOneRenderContainer';



class TaskListOneContainer extends React.Component {

    componentDidMount () {
      this.props.getTaskListById(this.props.taskListId);
    }

    render(){
        return (
          <div>
            <TaskListOneRenderContainer taskListOne={this.props.taskListOne}/>
          </div>
        );
    }
}

function mapStateToProps(state) {
  //console.log(state.taskListState.tasklist);
  //console.log(state);
  return {taskListOne: state.taskListState.tasklistone};
}

function mapDispatchToProps(dispatch) {
  return  bindActionCreators(TaskListActions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(TaskListOneContainer);
