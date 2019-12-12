import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import moment from 'moment';
import groupBy from 'ramda/es/groupBy';
import groupWith from 'ramda/es/groupWith';
import mapObjIndexed from 'ramda/es/mapObjIndexed';
import prop from 'ramda/es/prop';
import reverse from 'ramda/es/reverse';
import sortBy from 'ramda/es/sortBy';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SimpleBar from 'simplebar-react';
import styled from 'styled-components';

import {
  addTaskComment,
  updateComment as updateCommentAction,
} from '../../actions/task-actions';
import useBoolean from '../../hooks/useBoolean';
import CubesLoader from '../common/CubesLoader';
import renderComment from './NewTaskDrawer.RenderComment';
import { FormSectionDivider } from './NewTaskDrawer.Styled';

const CommentSectionLabel = styled.div`
  align-items: center;
  display: flex;
  color: #2e3a43;
  cursor: text;
  flex: 1;
  font-size: 0.875rem;
  height: 2.25rem;
  padding: 0 1.5rem;
`;

const CommentSectionInputField = styled.div`
  border: 0;
  color: #2e3a43;
  flex: 1;
  font-size: 0.875rem;
  height: 100%;
  outline: none;
  padding: 0.5rem 2rem 0.5rem 1.5rem;
  word-break: break-all;

  &:empty ::after {
    color: #dedee2;
    content: '+ add a comment';
  }
`;

const CommentsDivider = styled.div`
  background-color: #ddf2f7;
  height: 2px;
  width: 100%;
`;

const CommentsContainer = styled.div`
  align-content: flex-start;
  display: flex;
  flex-flow: column wrap;
  padding: 1.25rem 2.5rem;
  width: 100%;
`;

const CommentSectionInputFieldContainer = styled.div`
  display: flex;
  flex-flow: row nowrap;
  min-height: 2.25rem;
  position: relative;
  width: 100%;
`;

const CubesLoaderContainer = styled.div`
  height: 1rem;
  position: absolute;
  right: 0.75rem;
  top: 1.125rem;
  transform: translateY(-50%);
  width: 3.125rem;
`;

const AddCommentButtonContainer = styled.div`
  align-items: center;
  background-color: #d9036b;
  border-radius: 0.25rem;
  color: #fff;
  cursor: pointer;
  display: flex;
  height: 2.25rem;
  font-size: 2rem;
  justify-content: center;
  line-height: 1;
  width: 2.125rem;
  z-index: 1;
`;

const StyledSimpleBar = styled(SimpleBar)`
  max-height: 22.8125rem;
  overflow-y: auto;
  width: 100%;

  & .simplebar-scrollbar::before,
  & .simplebar-scrollbar.simplebar-visible::before {
    background-color: #c8c8ce;
    opacity: ${props => (props.visible ? 1 : 0)};
  }

  & .simplebar-track.simplebar-vertical {
    background-color: #ededf0;
    border-radius: 0.5rem;
  }
`;

const getGroupedComments = ({ comments }) => {
  const commentsSortedById = sortBy(prop('commentId'), comments);

  const sortedComments = reverse(
    sortBy(comment => moment(comment.dateCreated).unix(), commentsSortedById),
  );

  const datedComments = groupBy(
    comment => moment(comment.dateCreated).format('YYYY-MM-DD'),
    sortedComments,
  );

  return mapObjIndexed(
    groupWith(
      (comment1, comment2) =>
        comment1.creator.userId === comment2.creator.userId,
    ),
    datedComments,
  );
};

const addTaskPromise = async ({
  task: newTask,
  setPublishingComment,
  clearCommentContent,
  addComment,
  unsetPublishingComment,
  commentContent,
  dispatch,
  scrollToTop,
}) => {
  try {
    setPublishingComment();

    const { data } = await addTaskComment(newTask, {
      comment: commentContent.trim(),
    })(dispatch);

    clearCommentContent();

    toggleAlert('Comment added successfully', 'success');

    addComment(data);

    scrollToTop();
  } catch {
    toggleAlert('Error adding comment, please try again later', 'error');
  } finally {
    unsetPublishingComment();
  }
};

const publishComment = ({
  commentSectionInputFieldReference,
  task,
  setPublishingComment,
  addComment,
  clearCommentContent,
  unsetPublishingComment,
  dispatch,
  scrollToTop,
  addDeferredCommentToQueue,
  setAddedComments,
  currentUserProfile,
}) => {
  const commentContent = commentSectionInputFieldReference.current?.textContent;

  if (commentContent?.trim().length === 0) {
    return;
  }

  if (task) {
    addTaskPromise({
      task,
      setPublishingComment,
      clearCommentContent,
      addComment,
      unsetPublishingComment,
      commentContent,
      dispatch,
      scrollToTop,
    });
  } else {
    addDeferredCommentToQueue({
      promise: addTaskPromise,
      clearMethod: async () => setAddedComments([]),
      addComment,
    });
    addComment({
      comment: commentContent.trim(),
      creator: currentUserProfile,
      dateCreated: moment().format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
    });
    scrollToTop();
    clearCommentContent();
  }
};

export default ({ addDeferredCommentToQueue, task }) => {
  const currentUserProfile = useSelector(store => store.userState.userProfile);
  const currentUserId = currentUserProfile?.userId;

  const dispatch = useDispatch();
  const addingCommentsMethods = useBoolean(false);
  const addingComment = addingCommentsMethods[0];
  const toggleAddingComment = addingCommentsMethods[3];
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

  const taskId = task?.taskId;

  useEffect(() => {
    if (addingComment) {
      // eslint-disable-next-line no-unused-expressions
      commentSectionInputFieldReference.current?.focus();
    } else {
      clearCommentContent();
    }
  }, [addingComment, clearCommentContent]);

  const comments = (task?.comments ?? []).concat(addedComments);
  const commentsEmpty = comments.length === 0;

  const groupedComments = getGroupedComments({ comments, task });

  const scrollToTop = useCallback(() => {
    const scrollElement = simpleBarReference.current?.getScrollElement();
    if (scrollElement) {
      scrollElement.scrollTop = 0;
    }
  }, []);

  useEffect(() => {
    setAddedComments([]);
  }, [taskId]);

  const addComment = useCallback(
    data => {
      setAddedComments([...addedComments, data]);
    },
    [addedComments],
  );

  const handlePublishComment = event => {
    event.preventDefault();
    event.stopPropagation();

    publishComment({
      commentSectionInputFieldReference,
      task,
      setPublishingComment,
      addComment,
      clearCommentContent,
      unsetPublishingComment,
      dispatch,
      scrollToTop,
      addDeferredCommentToQueue,
      setAddedComments,
      currentUserProfile,
    });
  };

  const updateComment = commentData => {
    updateCommentAction(task, commentData)(dispatch)
      .then(() => {
        toggleAlert('Comment updated successfully', 'success');
      })
      .catch(() => {
        toggleAlert('Error updating comment, please try again later', 'error');
      });
  };

  return (
    <>
      {addingComment ? (
        <ClickAwayListener onClickAway={toggleAddingComment}>
          <CommentSectionInputFieldContainer>
            <CommentSectionInputField
              ref={commentSectionInputFieldReference}
              contentEditable
              onKeyPress={event => {
                if (event.key === 'Enter' && !isPublishingComment) {
                  handlePublishComment(event);
                }
              }}
            />
            <AddCommentButtonContainer
              onBlur={event => {
                event.preventDefault();
                event.stopPropagation();
              }}
              onClick={handlePublishComment}
            >
              +
            </AddCommentButtonContainer>
            {isPublishingComment && (
              <CubesLoaderContainer>
                <CubesLoader size={16} />
              </CubesLoaderContainer>
            )}
          </CommentSectionInputFieldContainer>
        </ClickAwayListener>
      ) : (
        <CommentSectionLabel onClick={toggleAddingComment}>
          + add a comment
        </CommentSectionLabel>
      )}
      <CommentsDivider />
      {!commentsEmpty && (
        <>
          <CommentsContainer>
            <StyledSimpleBar ref={simpleBarReference} visible>
              {Object.entries(groupedComments).map(
                renderComment({ currentUserId, updateComment }),
              )}
            </StyledSimpleBar>
          </CommentsContainer>
          <FormSectionDivider condensed />
        </>
      )}
    </>
  );
};
