import React, { PureComponent } from 'react';
import BooleanModal from '../modals/BooleanModal';

class PendingListsComponent extends PureComponent {
  componentWillUnmount() {
    if (this.props.taskLists) {
      this.props.taskLists.map((taskList, index) => {
        removeRevealComponent(`#leave-task-${taskList.taskListIdentifier}`);
      });
    }
  }

  acceptInvitationToTaskList = taskList => {
    this.props.acceptInviteToTaskList(taskList);
  };

  render() {
    const { taskLists } = this.props;
    return (
      <span>
        {taskLists && taskLists.length > 0 && (
          <div className="row">
            <div className="new-list-notification">
              {taskLists.length > 1
                ? 'Hooray! You have new lists.'
                : 'Hooray! You have a new list.'}
            </div>
          </div>
        )}
        {taskLists &&
          taskLists.map(taskList => {
            return (
              <div
                key={`pendingTaskList${taskList.taskListIdentifier}`}
                className="item row expanded align-middle"
              >
                <div className="columns shrink">
                  <span className="circle xxsmall transparent" />
                </div>
                <div className="columns">
                  <div className="row collapse">
                    <div className="new-list">New</div>
                  </div>
                  <a onClick={e => this.acceptInvitationToTaskList(taskList)}>
                    <h6>{taskList.listName}</h6>
                  </a>
                  <div>
                    <h7 className="">{taskList.listDescription}</h7>
                  </div>
                  <span className="details">{taskList.creator.userName}</span>

                  {/* <span className="item-details highlight">Invited</span> */}
                </div>

                {taskList.numberOfHighPriorityTasks > 0 && (
                  <div className="columns shrink">
                    <span
                      data-tooltip
                      aria-haspopup="true"
                      data-disable-hover="false"
                      tabIndex="2"
                      title={`${taskList.numberOfHighPriorityTasks} high priority tasks`}
                    >
                      <svg className="icon medium flag">
                        <use xlinkHref="#icon-flag" />
                      </svg>
                    </span>
                  </div>
                )}
                <div
                  data-tooltip
                  tabIndex="2"
                  title="tasks assigned to me"
                  className="columns shrink align-right"
                >
                  <h6>{taskList.numberOfTasks}</h6>
                </div>
                <div className="columns shrink more-options-wrapper">
                  <svg
                    className="icon ellipses medium"
                    data-toggle={`more-options-task-id-${taskList.taskListIdentifier}`}
                  >
                    <use xlinkHref="#icon-ellipses" />
                  </svg>
                  <div
                    className="small dropdown-pane"
                    id={`more-options-task-id-${taskList.taskListIdentifier}`}
                    data-dropdown
                    data-close-on-click="true"
                  >
                    <ul className="no-bullet">
                      <li>
                        <div
                          data-open={`leave-list-${taskList.taskListIdentifier}`}
                        >
                          Leave list
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
                <BooleanModal
                  uniqueModalId={`leave-list-${taskList.taskListIdentifier}`}
                  message={`Are you sure you want to leave '${taskList.listName}'?`}
                  handleConfirmation={this.props.rejectInviteToTaskList}
                  handleConfirmationArgs={taskList}
                  confirmBtnTxt="Leave"
                />
              </div>
            );
          })}
      </span>
    );
  }
}

export default PendingListsComponent;
