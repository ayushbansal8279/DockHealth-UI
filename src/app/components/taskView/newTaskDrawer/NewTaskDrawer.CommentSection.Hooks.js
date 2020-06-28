/* eslint-disable react-hooks/rules-of-hooks */
import { isEmpty } from 'ramda';
import { useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { deleteComment, updateComment, addComment } from 'actions/task-actions';
import { getGroupedComments } from './NewTaskDrawer.CommentSection.Utilities';

const initializeCommentSectionHooks = ({ modalActions }) => {
  const { selectedTask, taskContext, currentUser } = useSelector(store => ({
    selectedTask: store.taskState.selectedTask,
    taskContext: store.taskState.selectedTaskContext,
    currentUser: store.userState.userProfile,
    // taskListMembers: store.taskListState.tasklistmembers,
  }));

  // const [currentTaskListMemberData, setCurrentTaskListMemberData] = useState(
  //   null,
  // );
  const [groupedComments, setGroupedComments] = useState([]);

  const { comments = [], taskIdentifier: selectedTaskIdentifier } =
    selectedTask || {};

  useEffect(() => {
    if (isEmpty(comments)) {
      setGroupedComments([]);
      // setCurrentTaskListMemberData(null);
      return;
    }

    // setCurrentTaskListMemberData(
    //   taskListMembers?.find(
    //     ({ userIdentifier }) => currentUser?.userIdentifier === userIdentifier,
    //   ) ?? null,
    // );

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
        taskContext,
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
    [selectedTask, taskContext, dispatch, comments, modalActions],
  );

  const boundUpdateComment = useCallback(
    comment => {
      updateComment(selectedTask, comment, taskContext)(dispatch);
    },
    [dispatch, selectedTask, taskContext],
  );

  const boundAddComment = useCallback(
    comment =>
      addComment(
        selectedTask,
        {
          comment,
          creator: currentUser,
        },
        taskContext,
      )(dispatch).then(newComment => {
        const newGroupedComments = getGroupedComments({
          comments: [newComment.data, ...comments],
        });

        setGroupedComments(newGroupedComments);

        return newComment;
      }),
    [comments, currentUser, dispatch, selectedTask, taskContext],
  );

  const openDeleteCommentConfirmationModal = comment => {
    const modalProps = {
      confirm: () => boundRemoveComment(comment),
    };
    modalActions.openModal('DeleteComment', modalProps);
  };

  return {
    // currentTaskListMemberData,
    currentUser,
    groupedComments,
    removeComment: openDeleteCommentConfirmationModal,
    updateComment: boundUpdateComment,
    addComment: boundAddComment,
  };
};

export default initializeCommentSectionHooks;
