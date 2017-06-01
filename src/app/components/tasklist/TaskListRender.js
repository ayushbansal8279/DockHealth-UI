import React from 'react';
import {Link} from 'react-router';
import * as TaskListActions from '../../actions/tasklist-actions';
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux';

class TaskListRender extends React.Component {
  constructor(props) {
      super(props)
      this.state = {
          deleteTaskListResult: ''
      };
  }

  onClick(taskListId) {
    this.props.deleteTaskListById(taskListId)
    .then((res)=>{
      this.setState({deleteTaskListResult: 'Task List deleted successfully!!'}); //this will cause render to be called
      this.props.getTaskListForUser();
      //hashHistory.push('/taskList')
    })
    .catch((error)=>{
      this.setState({deleteTaskListResult: error.message}); //this will cause render to be called
    })

  }

  renderList() {
     return this.props.taskList.map((list) =>{
        return(
          <tr key={list.taskListId}>
            <td>
              <span className="label">{list.listName}</span>

              <ul className="menu dropdown float-right" data-dropdown-menu data-disable-hover="true" data-click-open="true">
                <li className="align-right"><a href="#"><svg className="icon"><use xlinkHref="#icon-vertical-ellipsis"></use></svg></a>
                <ul className="menu">
                  <li><Link to={"/viewTaskListMembers/" + list.taskListId}>View Members</Link></li>
                  <li><Link to={"/updateTaskList/" + list.taskListId}>Update Name</Link></li>
                  <li><Link to={"/invitePersonToTaskList/" + list.taskListId}>Invite External Person</Link></li>
                  <li><Link to={"/inviteUsersToTaskList/" + list.taskListId}>Invite Existing Users</Link></li>
                  <li><Link to={"/updateUserRole/" + list.taskListId}>Update User Role</Link></li>
                  <li><Link onClick={this.onClick.bind(this,list.taskListId)}>Delete Task List</Link></li>
                  <li><Link to={"/viewTaskListAudits/" + list.taskListId}>View Activity Feed</Link></li>
                </ul>
                </li>
              </ul>

            </td>
          </tr>);
    })
  }

  render(){
    return(
      <div>

        <div className="row">
          <div className="small-12 columns">
          <h3>{this.state.deleteTaskListResult}</h3>
          </div>
        </div>

        <div>
          <Link to="/addTaskList">
            <button className="button secondary button-small float-right">Create Task List</button>
          </Link>
        </div>

          <table>
            <thead>
              <tr>
                <th width="200"><h3>Task List</h3></th>
              </tr>
            </thead>
            <tbody>
              {this.renderList()}
            </tbody>
          </table>
      </div>
    );
  }

}

function mapDispatchToProps(dispatch) {
  return  bindActionCreators(TaskListActions, dispatch)
}

export default connect(null, mapDispatchToProps)(TaskListRender);


/*
              <Link to={"/viewTaskListMembers/" + list.taskListId}>
                <button className="button small alert float-right">View Members</button>
              </Link>
              <Link to={"/updateTaskList/" + list.taskListId}>
                <button className="button small success float-right">Update</button>
              </Link>*/
