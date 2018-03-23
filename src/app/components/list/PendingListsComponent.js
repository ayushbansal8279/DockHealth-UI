import React from 'react'
import BaseComponent from '../BaseComponent'
import BooleanModal from '../common/BooleanModal'

class PendingListsComponent extends BaseComponent{

  render(){
    const taskLists = this.props.taskLists
    return(
      <span>
        {taskLists.length > 0 &&
          <div className="row">
            <div className="new-list-notification">{taskLists.length > 1 ? 'Hooray! You have new lists.' : 'Hooray! You have a new list.'}</div>
          </div>
        }
        {taskLists && taskLists.map(taskList => {
          return(
            <div key={"pendingTaskList" + taskList.taskListId} className="item row expanded align-middle">
              <div className="columns shrink">
                <span className="circle xxsmall transparent"></span>
              </div>
              <div className="columns">
                <div className="row collapse">
                  <div className="new-list">New</div>
                </div>
                <a href="index.html" onClick={(e) => this.props.acceptInviteToTaskList(taskList)}><h6>{taskList.listName}</h6></a>
                <span className="details">{taskList.creator.userName}</span>

                {/* <span className="item-details highlight">Pending</span> */}

              </div>

              {taskList.numberOfHighPriorityTasks > 0 &&
                <div className="columns shrink">
                  <span data-tooltip aria-haspopup="true" data-disable-hover="false" tabIndex="2" title={taskList.numberOfHighPriorityTasks + " high priority tasks"}><svg className="icon medium flag"><use xlinkHref="#icon-flag"></use></svg></span>
                </div>
              }
              <div data-tooltip tabIndex="2" title="tasks assigned to me" className="columns shrink align-right">
                <h6>{taskList.numberOfTasks}</h6>
              </div>
              <div className="columns shrink more-options-wrapper">
                <svg className="icon ellipses medium" data-toggle={"more-options-task-id-" + taskList.taskListId}><use xlinkHref="#icon-ellipses"></use></svg>
                <div className="small dropdown-pane" id={"more-options-task-id-" + taskList.taskListId} data-dropdown data-close-on-click="true">
                  <ul className="no-bullet">
                    <li><div data-open={"leave-list-"+taskList.taskListId}>Leave list</div></li>
                  </ul>
                </div>
              </div>
            <BooleanModal
              uniqueModalId={"leave-list-"+taskList.taskListId}
              message={"Are you sure you want to leave '" + taskList.listName + "'?"}
              handleConfirmation={this.props.rejectInviteToTaskList}
              handleConfirmationArgs={taskList}
              confirmBtnTxt="Leave"
            />
              {/* <div className="columns shrink">
                <button className="button primary small split">
                  <span onClick={(e) => this.props.acceptInviteToTaskList(taskList)} data-tooltip aria-haspopup="true" data-disable-hover="false" tabIndex="2" title="Accept invitation" className="button-left"><svg className="icon"><use xlinkHref="#icon-checkmark"></use></svg> Accept</span>
                  <span onClick={(e) => this.props.rejectInviteToTaskList(taskList)} data-tooltip aria-haspopup="true" data-disable-hover="false" tabIndex="2" title="Decline invitation" className="button-right cancel-button"><svg className="icon"><use xlinkHref="#icon-close"></use></svg> Decline</span>
                </button>
              </div> */}
            </div>
          )
        })}
      </span>
    )
  }
}

export default PendingListsComponent
