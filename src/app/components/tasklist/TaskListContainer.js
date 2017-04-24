import React from 'react'
//import PropTypes from 'prop-types';
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux';
import * as TaskListActions from '../../actions/tasklist-actions';
import TaskListRender from './TaskListRender';



class TaskListContainer extends React.Component {

    componentDidMount () {
      this.props.getTaskListForUser('1');
    }

    render(){
        return (
          <div>
            <TaskListRender taskList={this.props.taskList}/>
          </div>
        );
    }
}

function mapStateToProps(state) {
  //console.log(state.taskListState.tasklist);
  //console.log(state);
  return {taskList: state.taskListState.tasklist};
}

function mapDispatchToProps(dispatch) {
  return  bindActionCreators(TaskListActions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(TaskListContainer);
