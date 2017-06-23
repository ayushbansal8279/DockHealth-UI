import React from 'react'

class PendingListsComponent extends React.Component{
  render(){
    return(
      <span>
        {this.props.taskLists.map(taskList => {
          return(
            <div key={"pendingTaskList" + taskList.taskListId} className="item row expanded align-middle">
              <div className="columns shrink">
                <span className="circle xxsmall transparent"></span>
              </div>
              <div className="columns">
                <a href="index.html"><h6>{taskList.listName}</h6></a>
                <span className="details">{taskList.creator.userName}</span>
                <span className="item-details highlight">Pending</span>

              </div>
              <div className="columns shrink">
                <button className="button primary small split">
                  <span data-tooltip aria-haspopup="true" data-disable-hover="false" tabIndex="2" title="Accept invitation" className="button-left"><svg className="icon"><use xlinkHref="#icon-checkmark"></use></svg> Accept</span>
                  <span data-tooltip aria-haspopup="true" data-disable-hover="false" tabIndex="2" title="Decline invitation" className="button-right cancel-button"><svg className="icon"><use xlinkHref="#icon-close"></use></svg> Decline</span>
                </button>
              </div>
            </div>
          )
        })}
      </span>
    )
  }
}

export default PendingListsComponent
