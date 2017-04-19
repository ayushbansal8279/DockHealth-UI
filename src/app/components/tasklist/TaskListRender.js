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
              {list.listName}
              <Link to={"/updateTaskList/" + list.taskListId}>
                <button className="button small success float-right">Update</button>
              </Link>
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
