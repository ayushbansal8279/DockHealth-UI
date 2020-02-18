import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import moment from 'moment';
import groupBy from 'ramda/es/groupBy';
import groupWith from 'ramda/es/groupWith';
import mapObjIndexed from 'ramda/es/mapObjIndexed';
import prop from 'ramda/es/prop';
import reverse from 'ramda/es/reverse';
import sortBy from 'ramda/es/sortBy';
import React from 'react';
import { useUnmount } from 'react-use';
import {
  addTaskComment,
  updateComment as updateCommentAction,
} from '../../actions/task-actions';
import CubesLoader from '../common/CubesLoader';
import initializeNewTaskDrawerCommentSectionHooks from './NewTaskDrawer.CommentSection.Hooks';
import {
  AddCommentButtonContainer,
  CommentsContainer,
  CommentsDivider,
  CommentSectionInputField,
  CommentSectionInputFieldContainer,
  CommentSectionLabel,
  CubesLoaderContainer,
  StyledSimpleBar,
} from './NewTaskDrawer.CommentSection.Styled';
import renderComment from './NewTaskDrawer.RenderComment';
import { FormSectionDivider } from './NewTaskDrawer.Styled';
import { noop } from '../../helpers/utility-functions';

const getGroupedComments = ({ comments }) => {
  const commentsSortedById = sortBy(prop('commentIdentifier'), comments);

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
        comment1.creator.userIdentifier === comment2.creator.userIdentifier,
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

    let data;

    if (commentContent?.trim().length > 0) {
      const commentResponse = await addTaskComment(newTask, {
        comment: commentContent?.trim(),
      })(dispatch);

      data = commentResponse.data;

      toggleAlert('Comment added successfully', 'success');

      addComment(data);
      clearCommentContent();
    }

    scrollToTop();
    unsetPublishingComment();

    return data;
  } catch (error) {
    unsetPublishingComment();
    toggleAlert('Error adding comment, please try again later', 'error');
    return null;
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
      promise: ({ ...promiseArguments }) =>
        addTaskPromise({
          task,
          setPublishingComment,
          clearCommentContent,
          addComment,
          unsetPublishingComment,
          commentContent,
          dispatch,
          scrollToTop,
          ...promiseArguments,
        }),
      clearMethod: async () => setAddedComments([]),
      addComment,
    });
    addComment({
      comment: commentContent?.trim(),
      creator: currentUserProfile,
      dateCreated: moment().format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
    });
    scrollToTop();
    clearCommentContent();
  }
};

export default ({ addDeferredCommentToQueue, task }) => {
  const {
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
  } = initializeNewTaskDrawerCommentSectionHooks({ task });

  const comments = (task?.comments ?? []).concat(addedComments);
  const commentsEmpty = comments.length === 0;

  const groupedComments = getGroupedComments({ comments, task });

  const handlePublishComment = (
    event = {
      preventDefault: noop,
      stopPropagation: noop,
    },
  ) => {
    /* eslint-disable no-unused-expressions */
    event?.preventDefault();
    event?.stopPropagation();
    /* eslint-enable no-unused-expressions */

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

  useUnmount(() => {
    if (!isPublishingComment) {
      handlePublishComment();
    }
  });

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
        <ClickAwayListener>
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
            <StyledSimpleBar ref={simpleBarReference} visible="true">
              {Object.entries(groupedComments).map(
                renderComment({ currentUserId, updateComment, task, members }),
              )}
            </StyledSimpleBar>
          </CommentsContainer>
          <FormSectionDivider condensed />
        </>
      )}
    </>
  );
};
