import React from 'react';
import {Link} from 'react-router';

export default class TaskListRender extends React.Component {
  constructor(props) {
      super(props)
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
        <Link to="/addTaskList">
          <button className="button secondary button-small float-right">Create Task List</button>
        </Link>

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


/*
              <Link to={"/viewTaskListMembers/" + list.taskListId}>
                <button className="button small alert float-right">View Members</button>
              </Link>
              <Link to={"/updateTaskList/" + list.taskListId}>
                <button className="button small success float-right">Update</button>
              </Link>*/
