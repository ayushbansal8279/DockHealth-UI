/* eslint-disable no-param-reassign */
/* eslint-disable react-hooks/rules-of-hooks */
import { useCallback } from 'react';
import { openModal, closeModal } from 'modal/actions';
import CommentIcon from 'img/modals/comment.svg';
import { useSelector, useDispatch } from 'react-redux';
import { taskDrawerFocusFieldSelector } from 'selectors/task-drawer-selectors';
import { userProfileSelector } from 'selectors/user-selectors';
import { deleteComment, updateComment, addComment } from 'actions/task-actions';

const initializeCommentSectionHooks = (selectedTask) => {
  const currentUser = useSelector(userProfileSelector);
  const taskListIdentifier = selectedTask?.taskList?.taskListIdentifier;
  const taskDrawerFocusField = useSelector(taskDrawerFocusFieldSelector);
  const comments = selectedTask?.comments ?? [];

  const dispatch = useDispatch();

  const boundRemoveComment = useCallback(
    (comment) => {
      deleteComment(
        selectedTask,
        comment,
      )(dispatch).then(() => {
        dispatch(closeModal());
      });
    },
    [selectedTask, dispatch],
  );

  const boundUpdateComment = useCallback(
    (comment) => {
      updateComment(selectedTask, comment)(dispatch);
    },
    [dispatch, selectedTask],
  );

  const boundAddComment = useCallback(
    (comment) =>
      addComment(selectedTask, {
        comment,
        creator: currentUser,
      })(dispatch),
    [currentUser, dispatch, selectedTask],
  );

  const openDeleteCommentConfirmationModal = (comment) => {
    const modalProps = {
      title: 'Delete comment',
      description:
        'Are you sure you want to delete this comment? This action cannot be undone.',
      icon: CommentIcon,
      confirm: () => boundRemoveComment(comment),
    };
    dispatch(openModal('DeleteConfirmation', modalProps));
  };

  return {
    currentUser,
    comments,
    removeComment: openDeleteCommentConfirmationModal,
    updateComment: boundUpdateComment,
    addComment: boundAddComment,
    taskListIdentifier,
    taskDrawerFocusField,
  };
};

export default initializeCommentSectionHooks;
