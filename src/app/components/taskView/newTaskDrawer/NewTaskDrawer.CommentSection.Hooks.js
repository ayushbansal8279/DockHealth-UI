/* eslint-disable react-hooks/rules-of-hooks */
import { isEmpty } from 'ramda';
import { useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { deleteComment, updateComment, addComment } from 'actions/task-actions';
import { getGroupedComments } from './NewTaskDrawer.CommentSection.Utilities';

const initializeCommentSectionHooks = ({ modalActions }) => {
  const { selectedTask, currentUser } = useSelector(store => ({
    selectedTask: store.taskState.selectedTask,
    currentUser: store.userState.userProfile,
  }));

  const [groupedComments, setGroupedComments] = useState([]);

  const { comments = [], taskIdentifier: selectedTaskIdentifier } =
    selectedTask || {};

  useEffect(() => {
    if (isEmpty(comments)) {
      setGroupedComments([]);
      return;
    }

    const newGroupedComments = getGroupedComments({ comments });

    setGroupedComments(newGroupedComments);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTaskIdentifier]);

  const dispatch = useDispatch();

  const boundRemoveComment = useCallback(
    comment => {
      deleteComment(
        selectedTask,
        comment,
      )(dispatch).then(() => {
        const newGroupedComments = getGroupedComments({
          comments: comments.filter(
            ({ commentIdentifier }) =>
              commentIdentifier !== comment.commentIdentifier,
          ),
        });

        setGroupedComments(newGroupedComments);
        modalActions.closeModal();
      });
    },
    [selectedTask, dispatch, comments, modalActions],
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
        const newGroupedComments = getGroupedComments({
          comments: [newComment.data, ...comments],
        });

        setGroupedComments(newGroupedComments);

        return newComment;
      }),
    [comments, currentUser, dispatch, selectedTask],
  );

  const openDeleteCommentConfirmationModal = comment => {
    const modalProps = {
      confirm: () => boundRemoveComment(comment),
    };
    modalActions.openModal('DeleteComment', modalProps);
  };

  return {
    currentUser,
    groupedComments,
    removeComment: openDeleteCommentConfirmationModal,
    updateComment: boundUpdateComment,
    addComment: boundAddComment,
  };
};

export default initializeCommentSectionHooks;
