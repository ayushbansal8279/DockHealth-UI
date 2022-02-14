/* eslint-disable react-hooks/rules-of-hooks */
import { useEffect, useState, useCallback, useMemo } from 'react';
import { isEmpty } from 'ramda';
import { openModal, closeModal } from 'modal/actions';
import CommentIcon from 'img/modals/comment';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectedTaskSelector,
  taskDrawerFocusFieldSelector,
} from 'selectors/task-drawer-selectors';
import { userProfileSelector } from 'selectors/user-selectors';
import { checkIfTemplateTask } from 'helpers/task-helpers';
import { deleteComment, updateComment, addComment } from 'actions/task-actions';

const initializeCommentSectionHooks = () => {
  const currentUser = useSelector(userProfileSelector);
  const selectedTask = useSelector(selectedTaskSelector);
  const taskListIdentifier = selectedTask?.taskList?.taskListIdentifier;
  const taskDrawerFocusField = useSelector(taskDrawerFocusFieldSelector);
  const isTemplateTask = useMemo(() => checkIfTemplateTask(selectedTask), [
    selectedTask,
  ]);
  const [commentsList, setCommentsList] = useState([]);

  const { comments = [], taskIdentifier: selectedTaskIdentifier } =
    selectedTask || {};

  useEffect(() => {
    if (isEmpty(comments)) {
      setCommentsList([]);
      return;
    }

    setCommentsList(commentsList);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTaskIdentifier]);

  const dispatch = useDispatch();

  const boundRemoveComment = useCallback(
    comment => {
      deleteComment(
        selectedTask,
        comment,
      )(dispatch).then(() => {
        const newComments = selectedTask.comments.filter(
          ({ commentIdentifier }) =>
            commentIdentifier !== comment.commentIdentifier,
        );

        selectedTask.comments = selectedTask.comments.filter(
          ({ commentIdentifier }) =>
            commentIdentifier !== comment.commentIdentifier,
        );

        setCommentsList(newComments);
        dispatch(closeModal());
      });
    },
    [selectedTask, dispatch],
  );

  const boundUpdateComment = useCallback(
    comment => {
      updateComment(selectedTask, comment)(dispatch);
    },
    [dispatch, selectedTask],
  );

  const boundAddComment = useCallback(
    comment =>
      addComment(selectedTask, {
        comment,
        creator: currentUser,
      })(dispatch).then(newComment => {
        const newComments = [newComment.data, ...selectedTask.comments];
        selectedTask.comments = [newComment.data, ...selectedTask.comments];

        setCommentsList(newComments);

        return newComment;
      }),
    [currentUser, dispatch, selectedTask],
  );

  const openDeleteCommentConfirmationModal = comment => {
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
    isTemplateTask,
    taskDrawerFocusField,
  };
};

export default initializeCommentSectionHooks;
