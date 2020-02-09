import React, { PureComponent } from 'react';
import { Link } from 'react-router';

import BooleanModal from '../modals/BooleanModal';

class ListsComponent extends PureComponent {
  componentWillUnmount() {
    const { taskLists = [] } = this.props;
    taskLists.forEach(({ taskListId }) => {
      removeRevealComponent(`#delete-task-${taskListId}`);
      removeRevealComponent(`#leave-task-${taskListId}`);
    });
  }

  render() {
    const { deleteList, editForm, leaveList, taskLists } = this.props;

    return (
      <span>
        {taskLists?.map(taskList => {
          const {
            numberOfHighPriorityTasks,
            numberOfTasks,
            numberOfUnreadTasks,
            taskListId,
            creator,
            role,
            listName,
          } = taskList;

          const isOwnerOrAdmin = role === 'ADMIN' || role === 'OWNER';

          return (
            <div
              key={`taskList${taskListId}`}
              className="item row expanded align-middle"
            >
              <div className="columns shrink">
                {numberOfUnreadTasks > 0 ? (
                  <span
                    className="circle xxsmall blue-bg"
                    data-tooltip
                    aria-haspopup="true"
                    data-disable-hover="false"
                    title={`${numberOfUnreadTasks} new tasks`}
                  />
                ) : (
                  <span className="circle xxsmall transparent" />
                )}
              </div>
              <div className="columns">
                <Link to={`/tasks/${taskListId}`}>
                  <h6 className="">{listName}</h6>
                </Link>
                <span className="details">{creator.userName}</span>
              </div>
              {numberOfHighPriorityTasks > 0 && (
                <div className="columns shrink">
                  <span
                    data-tooltip
                    aria-haspopup="true"
                    data-disable-hover="false"
                    title={`${numberOfHighPriorityTasks} high priority tasks`}
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
                <h6>{numberOfTasks}</h6>
              </div>
              <div className="columns shrink more-options-wrapper">
                <svg
                  className="icon ellipses medium"
                  data-toggle={`more-options-task-id-${taskListId}`}
                >
                  <use xlinkHref="#icon-ellipses" />
                </svg>
                <div
                  className="small dropdown-pane"
                  id={`more-options-task-id-${taskListId}`}
                  data-dropdown
                  data-close-on-click="true"
                >
                  <ul className="no-bullet">
                    {isOwnerOrAdmin ? (
                      <>
                        <li>
                          <div onClick={() => editForm(taskList)}>Edit</div>
                        </li>
                        <li>
                          <div data-open={`delete-list-${taskListId}`}>
                            Delete list
                          </div>
                        </li>
                      </>
                    ) : (
                      <li>
                        <div data-open={`leave-list-${taskListId}`}>
                          Leave list
                        </div>
                      </li>
                    )}
                  </ul>
                </div>
              </div>
              <BooleanModal
                uniqueModalId={`delete-list-${taskListId}`}
                message={`Are you sure you want to delete '${listName}'?`}
                handleConfirmation={deleteList}
                handleConfirmationArgs={taskListId}
                confirmBtnTxt="Delete"
              />
              <BooleanModal
                uniqueModalId={`leave-list-${taskListId}`}
                message={`Are you sure you want to leave '${listName}'?`}
                handleConfirmation={leaveList}
                handleConfirmationArgs={taskListId}
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
