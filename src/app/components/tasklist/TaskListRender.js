import React from 'react'


export default class TaskListRender extends React.Component {
  constructor(props) {
      super(props)
  }

  renderList() {
     return this.props.taskList.map((list) =>{
        return(<tr key={list.taskListId}><td> {list.listName} </td></tr>);
    })
  }

  render(){
    return(
      <div>
        <a href="#" className="button success">Add List</a>
        <table>
          <thead>
            <tr>
              <th width="200">Task List</th>
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
