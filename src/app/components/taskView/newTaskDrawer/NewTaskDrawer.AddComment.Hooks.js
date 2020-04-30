/* eslint-disable react-hooks/rules-of-hooks */
import { useSelector } from 'react-redux';
import { useState, useCallback } from 'react';

import useBoolean from 'hooks/useBoolean';

const initializeAddCommentHooks = ({ addComment }) => {
  const { currentUser, selectedTask } = useSelector(store => ({
    currentUser: store.userState.userProfile,
    selectedTask: store.taskState.selectedTask,
  }));

  const [commentContent, setCommentContent] = useState('');
  const [isAddingComment, setAddingComment, unsetAddingComment] = useBoolean(
    false,
  );

  const onCommentChange = useCallback(
    event => {
      if (!isAddingComment) {
        setCommentContent(event.target.value);
      }
    },
    [isAddingComment],
  );

  const onSubmit = useCallback(() => {
    setAddingComment();

    addComment(commentContent)
      .then(() => {
        unsetAddingComment();
        setCommentContent();
      })
      .catch(() => {
        unsetAddingComment();
      });
  }, [addComment, commentContent, setAddingComment, unsetAddingComment]);

  const onEnterPress = useCallback(
    event => {
      if (event.key === 'Enter' && !isAddingComment) {
        event.preventDefault();
        event.stopPropagation();

        onSubmit();
      }
    },
    [isAddingComment, onSubmit],
  );

  return {
    currentUser,
    selectedTask,
    commentContent,
    setCommentContent,
    onCommentChange,
    onEnterPress,
    isAddingComment,
  };
};

export default initializeAddCommentHooks;
