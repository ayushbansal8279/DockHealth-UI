import React from 'react'
import {connect} from 'react-redux'
import TaskList from './TaskList'
import * as TaskApi from '../../api/task-api'
import store from '../../store'

const TaskListContainer = React.createClass({

  componentDidMount: function () {
    TaskApi.getTasks()
  },

  render: function () {
    return (<TaskList tasks={this.props.tasks} deleteTask={TaskApi.deleteTask}/>);
  }

});

const mapStateToProps = function (store) {
  return {tasks: store.taskState.tasks};
};

export default connect(mapStateToProps)(TaskListContainer);
