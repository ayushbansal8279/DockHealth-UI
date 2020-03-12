import React, { PureComponent } from 'react';
import { Link } from 'react-router';
import BooleanModal from '../modals/BooleanModal';

class ListsComponent extends PureComponent {
  componentWillUnmount() {
    const { taskLists = [] } = this.props;
    taskLists.forEach(({ taskListIdentifier }) => {
      removeRevealComponent(`#delete-task-${taskListIdentifier}`);
      removeRevealComponent(`#leave-task-${taskListIdentifier}`);
    });
  }

  render() {
    const {
      deleteList,
      editForm,
      leaveList,
      taskLists,
      currentUser,
    } = this.props;

    return (
      <span>
        {taskLists?.map(taskList => {
          const {
            numberOfHighPriorityTasks,
            numberOfTasks,
            numberOfUnreadTasks,
            taskListIdentifier,
            creator,
            role,
            listName,
            listDescription,
            adminIdentifiers,
          } = taskList;

          let isOwnerOrAdmin = role === 'ADMIN' || role === 'OWNER';
          // double check against admins list
          if (
            role === 'MEMBER' &&
            adminIdentifiers.includes(currentUser.userIdentifier)
          ) {
            isOwnerOrAdmin = true;
          }

          return (
            <div
              key={`taskList${taskListIdentifier}`}
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
                <Link to={`/tasks/${taskListIdentifier}`}>
                  <h6 className="" style={{ fontWeight: 'bold' }}>
                    {listName}
                  </h6>
                </Link>
                <h7 className="">{listDescription}</h7>
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
                  data-toggle={`more-options-task-id-${taskListIdentifier}`}
                >
                  <use xlinkHref="#icon-ellipses" />
                </svg>
                <div
                  className="small dropdown-pane"
                  id={`more-options-task-id-${taskListIdentifier}`}
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
                          <div data-open={`delete-list-${taskListIdentifier}`}>
                            Delete list
                          </div>
                        </li>
                      </>
                    ) : (
                      <li>
                        <div data-open={`leave-list-${taskListIdentifier}`}>
                          Leave list
                        </div>
                      </li>
                    )}
                  </ul>
                </div>
              </div>
              <BooleanModal
                uniqueModalId={`delete-list-${taskListIdentifier}`}
                message={`Are you sure you want to delete '${listName}'?`}
                handleConfirmation={deleteList}
                handleConfirmationArgs={taskListIdentifier}
                confirmBtnTxt="Delete"
              />
              <BooleanModal
                uniqueModalId={`leave-list-${taskListIdentifier}`}
                message={`Are you sure you want to leave '${listName}'?`}
                handleConfirmation={leaveList}
                handleConfirmationArgs={taskListIdentifier}
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
