import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useToggle } from 'react-use';
import useBoolean from 'hooks/useBoolean';

export default ({ task }) => {
  const taskIdentifier = task?.taskIdentifier;

  const currentUserProfile = useSelector(store => store.userState.userProfile);
  const members = useSelector(store =>
    !task?.taskList?.taskListIdentifier
      ? [store.userState.userProfile]
      : store.taskListState.tasklistmembers,
  );
  const currentUserId = currentUserProfile?.userIdentifier;

  const dispatch = useDispatch();
  const [addingComment, toggleAddingComment] = useToggle(false);
  const [addedComments, setAddedComments] = useState([]);
  const commentSectionInputFieldReference = useRef(null);
  const simpleBarReference = useRef(null);
  const [
    isPublishingComment,
    setPublishingComment,
    unsetPublishingComment,
  ] = useBoolean(false);

  const clearCommentContent = useCallback(() => {
    if (commentSectionInputFieldReference.current) {
      commentSectionInputFieldReference.current.textContent = '';
    }
  }, []);

  useEffect(() => {
    if (addingComment) {
      // eslint-disable-next-line no-unused-expressions
      commentSectionInputFieldReference.current?.focus();
    } else {
      clearCommentContent();
    }
  }, [addingComment, clearCommentContent]);

  const scrollToTop = useCallback(() => {
    const scrollElement = simpleBarReference.current?.getScrollElement();
    if (scrollElement) {
      scrollElement.scrollTop = 0;
    }
  }, []);

  useEffect(() => {
    setAddedComments([]);
  }, [taskIdentifier]);

  const addComment = useCallback(
    data => {
      setAddedComments([...addedComments, data]);
    },
    [addedComments],
  );

  return {
    currentUserProfile,
    members,
    currentUserId,
    dispatch,
    addingComment,
    toggleAddingComment,
    addedComments,
    setAddedComments,
    commentSectionInputFieldReference,
    isPublishingComment,
    setPublishingComment,
    unsetPublishingComment,
    clearCommentContent,
    scrollToTop,
    addComment,
    simpleBarReference,
  };
};
