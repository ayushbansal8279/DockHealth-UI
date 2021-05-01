import React, { useCallback } from 'react';
import { bindActionCreators } from 'redux';
import { connect, useSelector } from 'react-redux';
import * as TaskActions from 'actions/task-actions';
import * as ModalActions from 'modal/actions';
import * as AlertActions from 'alert/actions';
import AlertMessages from 'alert/AlertMessages';
import { userProfileSelector } from 'selectors/user-selectors';
import StandardTaskItem from '../StandardTaskItem/StandardTaskItem';

const StandardTaskItemContainer = ({
  currentUser,
  taskActions,
  modalActions,
  alertActions,
  onTaskChanged,
  onTaskCompletedStatusChanged,
  isBundleTask,
  ...restProps
}) => {
  const selectedTask = useSelector(store => store.taskState.selectedTask);

  const handleTaskUpdate = useCallback(
    (taskIdentifier, dataToUpdate) => {
      taskActions
        .partialUpdateTask(taskIdentifier, dataToUpdate)
        .then(() => {
          if (typeof onTaskChenged === 'function') onTaskChanged();
          alertActions.showGlobalAlert(AlertMessages.UPDATED);
        })
        .catch(() => {
          alertActions.showGlobalErrorAlert();
        });
    },
    [alertActions, onTaskChanged, taskActions],
  );

  const handleUpdateWorkflowStatus = useCallback(
    (task, workflowStatus) => {
      taskActions
        .updateWorkflowStatus(task, workflowStatus)
        .then(() => {
          if (typeof onTaskChenged === 'function') onTaskChanged();
          alertActions.showGlobalAlert(AlertMessages.UPDATED);
        })
        .catch(() => {
          alertActions.showGlobalErrorAlert();
        });
    },
    [alertActions, onTaskChanged, taskActions],
  );

  const handleUpdateDueDate = useCallback(
    (task, dueDate) => {
      taskActions
        .updateDueDate(task, dueDate, true)
        .then(() => {
          if (typeof onTaskChenged === 'function') onTaskChanged();
          alertActions.showGlobalAlert(AlertMessages.UPDATED);
        })
        .catch(() => {
          alertActions.showGlobalErrorAlert();
        });
    },
    [alertActions, onTaskChanged, taskActions],
  );

  const toggleCompleteTaskStatus = useCallback(
    task => {
      taskActions
        .toggleCompleteTask(task, currentUser, isBundleTask)
        .then(() => {
          if (typeof onTaskCompletedStatusChanged === 'function')
            onTaskCompletedStatusChanged();
        })
        .catch(() => {
          alertActions.showGlobalErrorAlert();
        });
    },
    [
      alertActions,
      currentUser,
      isBundleTask,
      onTaskCompletedStatusChanged,
      taskActions,
    ],
  );

  const handleToggleTaskCompletedStatus = useCallback(
    task => {
      const hasIncompletedSubtasks =
        task.subtasks?.length > 0
          ? task.subtasks.find(subtask => subtask.status === 'INCOMPLETE')
          : task.subTasksCount - task.subTasksCompletedCount > 0;

      if (task.status === 'INCOMPLETE' && hasIncompletedSubtasks) {
        const modalProps = {
          confirm: () => {
            modalActions.closeModal();
            toggleCompleteTaskStatus(task);
          },
        };
        modalActions.openModal('CompleteAllTasks', modalProps);
      } else {
        toggleCompleteTaskStatus(task);
      }
    },
    [modalActions, toggleCompleteTaskStatus],
  );

  return (
    <StandardTaskItem
      updateWorkflowStatus={handleUpdateWorkflowStatus}
      updateDueDate={handleUpdateDueDate}
      toggleCompleteTask={handleToggleTaskCompletedStatus}
      onTaskUpdate={handleTaskUpdate}
      selectedTask={selectedTask}
      isBundleTask={isBundleTask}
      {...restProps}
    />
  );
};

function mapStateToProps(state) {
  return { currentUser: userProfileSelector(state) };
}

function mapDispatchToProps(dispatch) {
  return {
    taskActions: bindActionCreators(TaskActions, dispatch),
    modalActions: bindActionCreators(ModalActions, dispatch),
    alertActions: bindActionCreators(AlertActions, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(StandardTaskItemContainer);
