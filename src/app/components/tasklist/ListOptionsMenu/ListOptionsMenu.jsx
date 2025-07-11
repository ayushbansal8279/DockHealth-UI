/* eslint-disable sonarjs/cognitive-complexity */
import React, { useCallback, useEffect } from 'react';
import OptionsMenu from 'components/common/OptionsMenu/OptionsMenu';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { isUserGuestOrDockLite, isUserViewOnly } from 'helpers/user-helper';
import {
  onTaskListDeleted,
  onTaskListInvitationRejected,
  onTaskListLeave,
  onPrint,
} from 'helpers/ga-event-helper';
import {
  currentTaskListIdentifierSelector,
  archivedTaskListsSelector,
  currentTaskListSelector,
  taskListsSelector,
} from 'selectors/task-list-selectors';
import { userProfileSelector } from 'selectors/user-selectors';
import { openModal, closeModal } from 'modal/actions';
import { hideSubMenu } from 'actions/template-actions';
import * as TaskListActions from 'actions/task-list-actions';
import * as WorkspaceTaskListActions from 'actions/workspace-actions';
import palette from 'styles/palette';
import ColorPicker from 'components/common/ColorPicker/ColorPicker';
import { isMemberAdmin } from 'helpers/list-members-helper';
import useSearchParams from '@/app/hooks/use-search-params';
import { downloadTaskListData } from '@/app/api/task-api';
import { getTaskListStatusStorageKey } from '@/app/helpers/tasklist-helpers';
import localStorageHelper from '@/app/helpers/local-storage-helper';
import sessionStorageHelper from '@/app/helpers/session-storage-helper';

const MASTER_ROLES = new Set(['ADMIN', 'OWNER']);
const PRIVILEGE_ROLES = new Set(['ADMIN', 'OWNER', 'MEMBER']);

const ListOptionsMenu = (props) => {
  const searchParams = useSearchParams();
  const { list, children, moreOptions, onClose, open } = props;
  const dispatch = useDispatch();
  const history = useHistory();
  const currentUser = useSelector(userProfileSelector);
  const listDetails = useSelector(currentTaskListSelector);
  const { listName, taskListIdentifier } = listDetails || {};
  const archivedTaskLists = useSelector(archivedTaskListsSelector);
  const activeTaskListIdentifier = useSelector(
    currentTaskListIdentifierSelector,
  );
  const taskLists = useSelector(taskListsSelector);

  useEffect(() => {
    if (taskLists === null) {
      dispatch(TaskListActions.getTaskListForUser());
    }
  }, []);

  const currentUserMember = list?.listUsers?.find(
    (u) => u.identifier === currentUser?.identifier,
  );
  const isListAdmin = isMemberAdmin(currentUserMember);

  const openListEditModal = useCallback(
    (targetList) => {
      dispatch(openModal('ListForm', { list: targetList }));
      dispatch(hideSubMenu());
    },
    [dispatch],
  );

  const openInviteToListModal = useCallback(
    (targetList) => {
      dispatch(openModal('InviteToList', { list: targetList }));
      dispatch(hideSubMenu());
    },
    [dispatch],
  );

  const openDeleteConfirmationModal = useCallback(
    (targetList) => {
      const modalProps = {
        title: 'Delete list',
        description:
          'Are you sure you want to delete this list? This action cannot be undone.',
        confirm: () => {
          onTaskListDeleted();
          const deleteAction = props?.workspaceIdentifier
            ? WorkspaceTaskListActions.deleteWorkspaceTaskListById
            : TaskListActions.deleteTaskListById;

          dispatch(deleteAction(targetList?.taskListIdentifier));

          if (targetList?.taskListIdentifier === activeTaskListIdentifier) {
            history.push(`/`);
          }
          dispatch(closeModal());
        },
      };
      dispatch(openModal('DeleteConfirmation', modalProps));
      dispatch(hideSubMenu());
    },
    [activeTaskListIdentifier, dispatch, history],
  );

  const openLeaveListModal = useCallback(
    (targetList) => {
      const { status, taskListIdentifier } = targetList;

      const modalProps = {
        confirm: () => {
          if (status === 'PENDING') {
            onTaskListInvitationRejected();
            dispatch(TaskListActions.rejectInviteToTaskList(targetList));
          } else {
            onTaskListLeave();
            const leaveAction = props?.workspaceIdentifier
              ? WorkspaceTaskListActions.leaveWorkspaceTaskList
              : TaskListActions.leaveList;

            dispatch(leaveAction(taskListIdentifier));
          }
          dispatch(closeModal());
        },
      };

      dispatch(openModal('LeaveList', modalProps));
      dispatch(hideSubMenu());
    },
    [dispatch],
  );

  const onPrintClick = useCallback(() => {
    if (searchParams.print === 'true') {
      // if search params include 'print=true',
      // then the page is rendered without virtualized list,
      // so can print it
      onPrint();
      window.print();
    } else {
      // if not, open a new tab with 'print=true' search params
      const suffix =
        Object.keys(searchParams).length > 0 ? '&print=true' : '?print=true';
      const newUrl = window.location.href + suffix;
      window.open(newUrl, '_blank');
    }

    // INFO: Here's an old print implementation, may be a day when this would need to be restored
    // const { listUsers: taskListMembers } = targetList || {};
    // return printTaskPdf({
    //   title: targetList?.listName,
    //   tasks,
    //   taskListMembers,
    //   isListNameVisible: false,
    //   isPatientVisible: true,
    // });
  }, [searchParams]);

  // TODO: change to flag inside list object
  const isListArchived = useCallback(
    (targetList) => {
      return !!archivedTaskLists?.find(
        (taskList) =>
          taskList.taskListIdentifier === targetList.taskListIdentifier,
      );
    },
    [archivedTaskLists],
  );

  const handleArchiveList = useCallback(
    (targetList) => {
      const archiveAction = props?.workspaceIdentifier
        ? WorkspaceTaskListActions.archiveWorkspaceTaskList
        : TaskListActions.archiveTaskListById;

      dispatch(archiveAction(targetList?.taskListIdentifier));

      if (targetList?.taskListIdentifier === activeTaskListIdentifier)
        history.push(`/`);
    },
    [activeTaskListIdentifier, dispatch, history],
  );

  const handleUnarchiveList = useCallback(
    (targetList) => {
      dispatch(
        TaskListActions.unarchiveTaskListById(targetList?.taskListIdentifier),
      );
    },
    [dispatch],
  );

  const handleDownloadTaskListData = useCallback(async () => {
    const filename = `Dock ${listName}.csv`;
    let selectedTaskListStatus = localStorageHelper.getItem(
      getTaskListStatusStorageKey(taskListIdentifier),
    );
    if (!selectedTaskListStatus) {
      selectedTaskListStatus = 'ALL';
    }
    const { data } = await downloadTaskListData(
      taskListIdentifier,
      selectedTaskListStatus,
      filename,
    );
    const url = window.URL.createObjectURL(new Blob([data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.append(link);
    link.click();
  }, [taskListIdentifier, listName]);

  const getMenuItems = useCallback(
    (targetList) => {
      if (MASTER_ROLES.has(targetList?.role) && isListArchived(targetList)) {
        return [
          {
            name: 'Unarchive list',
            onClick: () => {
              handleUnarchiveList(targetList);
            },
          },
        ];
      }
      let baseList = [];
      if (
        targetList?.listType !== 'INBOX' &&
        targetList?.listType !== 'PUBLIC'
      ) {
        baseList = [
          ...baseList,
          {
            key: 'leave',
            name: 'Leave list',
            onClick: () => openLeaveListModal(targetList),
          },
        ];
      }

      if (
        PRIVILEGE_ROLES.has(targetList?.role) &&
        targetList?.listType !== 'INBOX'
      ) {
        if (
          !isUserGuestOrDockLite(currentUser) &&
          !isUserViewOnly(currentUser)
        ) {
          baseList = [
            ...baseList,
            {
              name: 'Invite to list',
              onClick: () => openInviteToListModal(targetList),
            },
          ];
        }

        if (
          MASTER_ROLES.has(targetList?.role) &&
          targetList?.listType !== 'INBOX'
        ) {
          baseList = [
            ...baseList,
            {
              name: 'Edit list',
              onClick: () => openListEditModal(targetList),
            },
          ];
        }

        if (MASTER_ROLES.has(targetList?.role)) {
          baseList = [
            ...baseList,
            {
              name: 'Archive list',
              onClick: () => {
                handleArchiveList(targetList);
              },
            },
          ];
        }
        if (
          MASTER_ROLES.has(targetList?.role) &&
          targetList?.listType !== 'INBOX'
        ) {
          baseList = [
            ...baseList,
            {
              name: 'Delete',
              onClick: () => {
                openDeleteConfirmationModal(targetList);
              },
              color: palette.oPlusRed,
            },
          ];
        }
      }
      if (moreOptions) {
        baseList = [
          ...baseList,
          {
            key: 'print',
            name: 'Print',
            onClick: () => onPrintClick(targetList),
          },
        ];
      }
      if (moreOptions) {
        baseList = [
          ...baseList,
          {
            key: 'export',
            name: 'Export To CSV',
            onClick: () => handleDownloadTaskListData(targetList),
          },
        ];
      }
      return baseList;
    },
    [
      isListArchived,
      handleUnarchiveList,
      openLeaveListModal,
      currentUser,
      moreOptions,
      openInviteToListModal,
      openListEditModal,
      handleArchiveList,
      openDeleteConfirmationModal,
      onPrintClick,
    ],
  );

  return (
    <OptionsMenu
      placement="bottom-start"
      options={getMenuItems(list)}
      footer={
        isListAdmin ? (
          <ColorPicker
            onChange={(event) =>
              dispatch(
                TaskListActions.saveTaskList({
                  taskListIdentifier: list.taskListIdentifier,
                  color: event.target.value,
                }),
              )
            }
            value={list.color}
            variant="circle"
          />
        ) : null
      }
      onClose={onClose}
      open={open}
    >
      {children}
    </OptionsMenu>
  );
};

export default ListOptionsMenu;
