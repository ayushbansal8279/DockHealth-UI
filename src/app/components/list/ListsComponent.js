import React from 'react'
import BaseComponent from '../BaseComponent'
import AddListForm from './AddListForm'
import { Link } from 'react-router'
// PARENT: TaskListView

class ListsComponent extends BaseComponent{

  render(){
    const taskList = this.props.taskList
    return(
      <span>
        {this.props.taskLists.map(taskList => {
          return(
            <div key={"taskList" + taskList.taskListId} className="item row expanded align-middle">
              <div className="columns shrink">
                <span className="circle xxsmall blue-bg" data-tooltip aria-haspopup="true" data-disable-hover="false" tabIndex="2" title="2 new tasks"></span>
              </div>
                <div className="columns">
                  <Link to={"/tasks/"+taskList.listName+"/"+taskList.taskListId}><h6 className="">{taskList.listName}</h6></Link>
                  <span className="details">{taskList.creator.userName}</span>
                </div>
              <div className="columns shrink">
                <span data-tooltip aria-haspopup="true" data-disable-hover="false" tabIndex="2" title="3 high priority tasks"><svg className="icon medium flag"><use xlinkHref="#icon-flag"></use></svg></span>
              </div>
              <div className="columns shrink align-right">
                <h6 className="">{taskList.numberOfTasks}</h6>
              </div>
              <div className="columns shrink more-options-wrapper">
                <svg className="icon ellipses medium" data-toggle={"more-options-task-id-" + taskList.taskListId}><use xlinkHref="#icon-ellipses"></use></svg>
                <div className="small dropdown-pane" id={"more-options-task-id-" + taskList.taskListId} data-dropdown data-close-on-click="true">
                  <ul className="no-bullet">
                    {/* if owner */}
                    <li><div onClick={(e) => this.props.deleteList(taskList.taskListId)}>Delete list</div></li>
                    <li><div onClick={(e) => this.props.editForm(taskList)}>Edit</div></li>
                    {/* if owner */}
                    <li>Leave list</li>
                  </ul>
                </div>
              </div>
            </div>
          )
        })}
      </span>
    )
  }
}

export default ListsComponent
