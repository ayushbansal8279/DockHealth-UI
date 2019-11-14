import React, { PureComponent } from 'react';
import { Link } from 'react-router';

import BooleanModal from '../modals/BooleanModal';

class ListsComponent extends PureComponent {
  componentWillUnmount() {
    if (this.props.taskLists) {
      this.props.taskLists.map((taskList, index) => {
        removeRevealComponent(`#delete-task-${taskList.taskListId}`);
        removeRevealComponent(`#leave-task-${taskList.taskListId}`);
      });
    }
  }

  render() {
    const taskLists = this.props.taskLists;
    return (
      <span>
        {taskLists &&
          taskLists.map(taskList => {
            return (
              <div
                key={`taskList${taskList.taskListId}`}
                className="item row expanded align-middle"
              >
                <div className="columns shrink">
                  {taskList.numberOfUnreadTasks > 0 ? (
                    <span
                      className="circle xxsmall blue-bg"
                      data-tooltip
                      aria-haspopup="true"
                      data-disable-hover="false"
                      tabIndex="2"
                      title={`${taskList.numberOfUnreadTasks} new tasks`}
                    />
                  ) : (
                    <span className="circle xxsmall transparent" />
                  )}
                </div>
                <div className="columns">
                  <Link
                    to={`/tasks/${taskList.listName}/${taskList.taskListId}`}
                  >
                    <h6 className="">{taskList.listName}</h6>
                  </Link>
                  <span className="details">{taskList.creator.userName}</span>
                </div>
                {taskList.numberOfHighPriorityTasks > 0 && (
                  <div className="columns shrink">
                    <span
                      data-tooltip
                      aria-haspopup="true"
                      data-disable-hover="false"
                      title={`${
                        taskList.numberOfHighPriorityTasks
                      } high priority tasks`}
                    >
                      <svg className="icon medium flag">
                        <use xlinkHref="#icon-flag" />
                      </svg>
                    </span>
                  </div>
                )}
                <div
                  data-tooltip
                  title="tasks assigned to me"
                  className="columns shrink align-right"
                >
                  <h6>{taskList.numberOfTasks}</h6>
                </div>
                <div className="columns shrink more-options-wrapper">
                  <svg
                    className="icon ellipses medium"
                    data-toggle={`more-options-task-id-${taskList.taskListId}`}
                  >
                    <use xlinkHref="#icon-ellipses" />
                  </svg>
                  <div
                    className="small dropdown-pane"
                    id={`more-options-task-id-${taskList.taskListId}`}
                    data-dropdown
                    data-close-on-click="true"
                  >
                    <ul className="no-bullet">
                      {(taskList.role == 'OWNER' ||
                        taskList.role == 'ADMIN') && (
                        <li>
                          <div onClick={e => this.props.editForm(taskList)}>
                            Edit
                          </div>
                        </li>
                      )}
                      {(taskList.role == 'OWNER' ||
                        taskList.role == 'ADMIN') && (
                        <li>
                          <div data-open={`delete-list-${taskList.taskListId}`}>
                            Delete list
                          </div>
                        </li>
                      )}
                      {/* if not owner */}
                      {taskList.role != 'OWNER' && taskList.role != 'ADMIN' && (
                        <li>
                          <div data-open={`leave-list-${taskList.taskListId}`}>
                            Leave list
                          </div>
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
                <BooleanModal
                  uniqueModalId={`delete-list-${taskList.taskListId}`}
                  message={`Are you sure you want to delete '${
                    taskList.listName
                  }'?`}
                  handleConfirmation={this.props.deleteList}
                  handleConfirmationArgs={taskList.taskListId}
                  confirmBtnTxt="Delete"
                />
                <BooleanModal
                  uniqueModalId={`leave-list-${taskList.taskListId}`}
                  message={`Are you sure you want to leave '${
                    taskList.listName
                  }'?`}
                  handleConfirmation={this.props.leaveList}
                  handleConfirmationArgs={taskList.taskListId}
                  confirmBtnTxt="Leave"
                />
              </div>
            );
          })}
      </span>
    );
  }
}

export default ListsComponent;
