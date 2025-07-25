import { takeLatest, call, put, takeEvery } from 'redux-saga/effects';
import { SagaIterator } from 'redux-saga';
import { showGlobalAlert, showGlobalErrorAlert } from '../alert/actions';
import AlertMessages from '../alert/AlertMessages';
import * as ActionTypes from 'actions/action-types';
import * as WorkspaceApi from '../api/workspace-api';
import * as TaskListApi from '../api/task-list-api';
import { ArchiveWorkspaceTaskListPayload, ChangeUserRolePayload, DeleteWorkspaceTaskListPayload, GetArchivedWorkspaceTaskListsPayload, GetWorkspaceTaskListsPayload, InvitePersonToWorkspacePayload, InviteUserToWorkspacePayload, LeaveWorkspaceTaskListPayload, RemoveUserFromWorkspacePayload, SaveWorkspaceTaskListPayload, TaskList } from '../types/workspace';
import { getWorkspaceUsers as getWorkspaceUsersAction } from '@/app/actions/workspace-actions'

function* handleSagaError(error: any, failureActionType: string) {
  yield put(showGlobalErrorAlert(error?.message));
  yield put({ type: failureActionType, error: error?.message });
}
interface GetWorkspaceProp {
  workspaceIdentifier: string;
}
function* getCurrentWorkspace({
  workspaceIdentifier,
}: GetWorkspaceProp): SagaIterator {
  try {
    const workspace = yield call(
      WorkspaceApi.getWorkspaceByIdentifier,
      workspaceIdentifier,
    );
    yield put({ type: ActionTypes.GET_SELECTED_WORKSPACE_SUCCESS, workspace });
  } catch {
    yield put(showGlobalErrorAlert());
    yield put({ type: ActionTypes.GET_SELECTED_WORKSPACE_FAILURE });
  }
}

interface GetWorkspaceUsersProp {
  workspaceIdentifier: string;
}

function* getWorkspaceUsers({ 
  workspaceIdentifier 
}: GetWorkspaceUsersProp): SagaIterator {
  try {
    const users = yield call(WorkspaceApi.getWorkspaceUsers, workspaceIdentifier);
    yield put({ type: ActionTypes.GET_WORKSPACE_USERS_SUCCESS, payload: users });
  } catch(error) {
    yield* handleSagaError(error, ActionTypes.GET_WORKSPACE_USERS_FAILURE);
  }
}

function* changeWorkspaceUserRole({ payload }: { payload: ChangeUserRolePayload }): SagaIterator {
  try {
    yield call(WorkspaceApi.changeWorkspaceUserRole, payload);
    yield put({ type: ActionTypes.CHANGE_WORKSPACE_USER_ROLE_SUCCESS, payload });
    yield put(showGlobalAlert(AlertMessages.WORKSPACE_USER_ROLE_CHANGED));
  } catch(error) {
    yield* handleSagaError(error, ActionTypes.CHANGE_WORKSPACE_USER_ROLE_FAILURE);
  }
}

function* inviteUserToWorkspace({ payload }: { payload: InviteUserToWorkspacePayload }): SagaIterator {
  const {
    userIdentifier,
    workspaceIdentifier,
    onDone
  } = payload;

  try {
    yield call(WorkspaceApi.inviteUserToWorkspace, {
      userIdentifier,
      workspaceIdentifier,
    });
    yield put(getWorkspaceUsersAction(workspaceIdentifier));
    yield put(showGlobalAlert(AlertMessages.USER_INVITED_TO_WORKSPACE));
  } catch(error) {
    yield* handleSagaError(error, ActionTypes.INVITE_USER_TO_WORKSPACE_FAILURE);
  } finally {
    if (onDone) {
      yield call(onDone);
    }
  }
}

function* removeUserFromWorkspace({ payload }: { payload: RemoveUserFromWorkspacePayload }): SagaIterator {
  const {
    userIdentifier,
    workspaceIdentifier,
    refreshListUsersAndGroups,
  } = payload;

  try {
    yield call(WorkspaceApi.removeUserFromWorkspace, {
      workspaceIdentifier,
      userIdentifier,
    });

    yield put({
      type: ActionTypes.REMOVE_USER_FROM_WORKSPACE_SUCCESS,
      payload: { userIdentifier },
    });

    yield put(showGlobalAlert(AlertMessages.USER_REMOVED_FROM_WORKSPACE));

    if (refreshListUsersAndGroups) {
      yield call(refreshListUsersAndGroups);
    }
  } catch(error) {
    yield* handleSagaError(error, ActionTypes.REMOVE_USER_FROM_WORKSPACE_FAILURE);
  }
}

function* invitePersonToWorkspaceSaga({ payload }: { payload: InvitePersonToWorkspacePayload }) {
  const { workspaceIdentifier, data, onSuccess, onFailure } = payload;

  try {
    yield call(WorkspaceApi.invitePersonToWorkspace, workspaceIdentifier, data);
    yield put(showGlobalAlert(AlertMessages.PERSON_INVITED_TO_WORKSPACE));
    if (onSuccess) onSuccess();
  } catch (error) {
    yield* handleSagaError(error, ActionTypes.INVITE_PERSON_TO_WORKSPACE_FAILURE);
    if (onFailure) onFailure(error);
  }
}

// Workspace List

export function* getWorkspaceTaskListsSaga({ payload }: { payload: GetWorkspaceTaskListsPayload }) {
  const { workspaceIdentifier } = payload;

  try {
    yield put({ type: ActionTypes.GET_WORKSPACE_TASKLISTS_REQUEST });

    const taskLists = yield call(
      TaskListApi.getTaskListForUser,
      workspaceIdentifier
    );

    yield put({
      type: ActionTypes.GET_WORKSPACE_TASKLISTS_SUCCESS,
      payload: {
        taskLists,
        workspaceIdentifier,
      },
    });

  } catch (error) {
    yield put({ type: ActionTypes.GET_WORKSPACE_TASKLISTS_FAILURE });
    yield* handleSagaError(error, 'Failed to fetch workspace task lists');
  }
}

export function* getArchivedWorkspaceTaskListsSaga({ payload}: { payload: GetArchivedWorkspaceTaskListsPayload } ) {
  const { workspaceIdentifier } = payload;

  try {
    const taskLists = yield call(
      TaskListApi.getArchivedTaskListForUser,
      workspaceIdentifier
    );

    yield put({
      type: ActionTypes.GET_ARCHIVED_WORKSPACE_TASKLISTS_SUCCESS,
      payload: {
        taskLists,
        workspaceIdentifier,
      },
    });

  } catch (error) {
    yield put({ type: ActionTypes.GET_ARCHIVED_WORKSPACE_TASKLISTS_FAILURE });
    yield* handleSagaError(error, 'Failed to fetch archived workspace task lists');
  }
}

export function* saveWorkspaceTaskListSaga({ payload }: { payload: SaveWorkspaceTaskListPayload }) {
  const { formProps, onSuccess, onFailure } = payload;

  try {
    yield put({ type: ActionTypes.SAVE_WORKSPACE_TASKLIST_REQUEST });

    let response: TaskList;
    if (formProps.taskListIdentifier) {
      response = yield call(TaskListApi.updateTaskList, formProps);
      yield put({
        type: ActionTypes.UPDATE_WORKSPACE_TASKLIST_SUCCESS,
        payload: response,
      });
      yield put(showGlobalAlert('Task List updated successfully!'));
    } else {
      response = yield call(TaskListApi.addTaskList, formProps);
      yield put({
        type: ActionTypes.ADD_WORKSPACE_TASKLIST_SUCCESS,
        payload: { ...response, role: 'OWNER' },
      });
      yield put(showGlobalAlert('Task List created successfully!'));
    }

    if (onSuccess) yield call(onSuccess, response);
  } catch (error) {
    yield put({ type: ActionTypes.SAVE_WORKSPACE_TASKLIST_FAILURE });
    yield put(
      showGlobalAlert('Error in saving Task List details', 'error')
    );
    if (onFailure) yield call(onFailure, error);
    yield* handleSagaError(error);
  }
}

export function* deleteWorkspaceTaskListSaga({ payload }: { payload: DeleteWorkspaceTaskListPayload }) {
  const { taskListIdentifier } = payload;

  try {
    yield call(TaskListApi.deleteTaskListById, taskListIdentifier);

    yield put({
      type: ActionTypes.DELETE_WORKSPACE_TASKLIST_SUCCESS,
      taskListIdentifier,
    });

    yield put(
      showGlobalAlert('Workspace task list deleted successfully!')
    );
  } catch (error) {
    yield put({ type: ActionTypes.DELETE_WORKSPACE_TASKLIST_FAILURE });

    yield put(
      showGlobalAlert('Error in deleting workspace task list', 'error')
    );

    yield* handleSagaError(error);
  }
}

export function* leaveWorkspaceTaskListSaga({ payload }: { payload: LeaveWorkspaceTaskListPayload }) {
  const { taskListIdentifier } = payload;

  try {
    yield call(TaskListApi.leaveList, taskListIdentifier);

    yield put({
      type: ActionTypes.LEAVE_WORKSPACE_TASKLIST_SUCCESS,
      taskListIdentifier,
    });
  } catch (error) {
    yield put({ type: ActionTypes.LEAVE_WORKSPACE_TASKLIST_FAILURE });
    yield* handleSagaError(error, 'Failed to leave workspace task list');
  }
}

export function* archiveWorkspaceTaskListSaga({ payload }: { payload: ArchiveWorkspaceTaskListPayload }) {
  const { taskListIdentifier } = payload;

  try {
    const response = yield call(TaskListApi.archiveTaskListById, taskListIdentifier, true);

    yield put({
      type: ActionTypes.ARCHIVE_WORKSPACE_TASKLIST_SUCCESS,
      payload: {
        response,
        taskListIdentifier,
      },
    });

    yield put(showGlobalAlert('Task List archived'));
  } catch (error) {
    yield put({ type: ActionTypes.ARCHIVE_WORKSPACE_TASKLIST_FAILURE });
    yield put(showGlobalAlert('Error in archiving Task List', 'error'));
  }
}

export default function* watchWorkspaces() {
  // @ts-ignore
  yield takeEvery(ActionTypes.GET_SELECTED_WORKSPACE, getCurrentWorkspace);
  yield takeEvery(ActionTypes.GET_WORKSPACE_USERS, getWorkspaceUsers);
  yield takeLatest(ActionTypes.CHANGE_WORKSPACE_USER_ROLE, changeWorkspaceUserRole);
  yield takeLatest(ActionTypes.INVITE_USER_TO_WORKSPACE, inviteUserToWorkspace);
  yield takeLatest(ActionTypes.REMOVE_USER_FROM_WORKSPACE, removeUserFromWorkspace);
  yield takeLatest(ActionTypes.INVITE_PERSON_TO_WORKSPACE, invitePersonToWorkspaceSaga);
  yield takeLatest(ActionTypes.GET_WORKSPACE_TASKLISTS, getWorkspaceTaskListsSaga);
  yield takeLatest(ActionTypes.SAVE_WORKSPACE_TASKLIST, saveWorkspaceTaskListSaga);
  yield takeLatest(ActionTypes.DELETE_WORKSPACE_TASKLIST, deleteWorkspaceTaskListSaga);
  yield takeLatest(ActionTypes.LEAVE_WORKSPACE_TASKLIST, leaveWorkspaceTaskListSaga);
  yield takeLatest(ActionTypes.ARCHIVE_WORKSPACE_TASKLIST, archiveWorkspaceTaskListSaga);
  yield takeLatest(ActionTypes.GET_ARCHIVED_WORKSPACE_TASKLISTS, getArchivedWorkspaceTaskListsSaga);
}