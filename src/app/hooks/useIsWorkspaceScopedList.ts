import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { workspaceSelector, workspaceTaskListsSelector } from '../selectors/workspace-selectors';

export function useIsWorkspaceScopedList() {
  const { taskListIdentifier } = useParams();
  const currentWorkspaceTaskLists = useSelector(workspaceTaskListsSelector);
  const currentWorkspace = useSelector(workspaceSelector);

  const isWorkspaceScopedList = currentWorkspaceTaskLists.some(
    (list) => list.taskListIdentifier === taskListIdentifier
  );

  return {
    isWorkspaceScopedList,
    currentWorkspace,
    taskListIdentifier,
    workspaceIdentifier: isWorkspaceScopedList
      ? currentWorkspace?.workspaceIdentifier
      : null,
  };
}