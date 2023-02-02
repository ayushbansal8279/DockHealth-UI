/* eslint-disable sonarjs/cognitive-complexity */
import React, { useCallback } from 'react';
import OptionsMenu from 'components/common/OptionsMenu/OptionsMenu';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { isUserGuest, isUserViewOnly } from 'helpers/user-helper';
import {
  onTaskListDeleted,
  onTaskListInvitationRejected,
  onTaskListLeave,
  onPrint,
} from 'helpers/ga-event-helper';
import {
  currentTaskListIdentifierSelector,
  archivedTaskListsSelector,
} from 'selectors/task-list-selectors';
import { userProfileSelector } from 'selectors/user-selectors';
import { openModal, closeModal } from 'modal/actions';
import { hideSubMenu } from 'actions/template-actions';
import * as TaskListActions from 'actions/task-list-actions';
import palette from 'styles/palette';
import ColorPicker from 'components/common/ColorPicker/ColorPicker';
import { isMemberAdmin } from 'helpers/list-members-helper';

const ListOptionsMenu = (props) => {
  const { list, children, moreOptions } = props;
  const dispatch = useDispatch();
  const history = useHistory();
  const currentUser = useSelector(userProfileSelector);
  const archivedTaskLists = useSelector(archivedTaskListsSelector);
  const activeTaskListIdentifier = useSelector(
    currentTaskListIdentifierSelector,
  );
  const MASTER_ROLES = ['ADMIN', 'OWNER'];
  const PRIVILEGE_ROLES = [...MASTER_ROLES, 'MEMBER'];

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
          dispatch(
            TaskListActions.deleteTaskListById(targetList?.taskListIdentifier),
          );
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
            dispatch(TaskListActions.leaveList(taskListIdentifier));
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
    onPrint();
    window.print();
    // INFO: Here's an old print implementation, may be a day when this would need to be restored
    // const { listUsers: taskListMembers } = targetList || {};
    // return printTaskPdf({
    //   title: targetList?.listName,
    //   tasks,
    //   taskListMembers,
    //   isListNameVisible: false,
    //   isPatientVisible: true,
    // });
  }, []);

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
      dispatch(
        TaskListActions.archiveTaskListById(targetList?.taskListIdentifier),
      );
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

  const getMenuItems = useCallback(
    (targetList) => {
      if (
        MASTER_ROLES.includes(targetList?.role) &&
        isListArchived(targetList)
      ) {
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
        PRIVILEGE_ROLES.includes(targetList?.role) &&
        targetList?.listType !== 'INBOX'
      ) {
        if (!isUserGuest(currentUser) && !isUserViewOnly(currentUser)) {
          baseList = [
            ...baseList,
            {
              name: 'Invite to list',
              onClick: () => openInviteToListModal(targetList),
            },
          ];
        }

        if (
          MASTER_ROLES.includes(targetList?.role) &&
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

        if (MASTER_ROLES.includes(targetList?.role)) {
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
          MASTER_ROLES.includes(targetList?.role) &&
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
      return baseList;
    },
    [
      MASTER_ROLES,
      isListArchived,
      PRIVILEGE_ROLES,
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
    >
      {children}
    </OptionsMenu>
  );
};

export default ListOptionsMenu;
