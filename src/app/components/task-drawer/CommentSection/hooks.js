/* eslint-disable react-hooks/rules-of-hooks */
import { isEmpty } from 'ramda';
import { useEffect, useState, useCallback } from 'react';
import { openModal, closeModal } from 'modal/actions';
import { useSelector, useDispatch } from 'react-redux';
import { selectedTaskSelector } from 'selectors/task-drawer-selectors';
import { userProfileSelector } from 'selectors/user-selectors';

import { deleteComment, updateComment, addComment } from 'actions/task-actions';

const initializeCommentSectionHooks = () => {
  const currentUser = useSelector(userProfileSelector);
  const selectedTask = useSelector(selectedTaskSelector);

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
      confirm: () => boundRemoveComment(comment),
    };
    dispatch(openModal('DeleteComment', modalProps));
  };

  return {
    currentUser,
    comments,
    removeComment: openDeleteCommentConfirmationModal,
    updateComment: boundUpdateComment,
    addComment: boundAddComment,
  };
};

export default initializeCommentSectionHooks;
