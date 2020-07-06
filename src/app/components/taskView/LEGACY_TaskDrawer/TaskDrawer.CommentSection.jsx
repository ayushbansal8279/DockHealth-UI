import { ClickAwayListener } from '@material-ui/core';
import moment from 'moment';
import {
  ascend,
  descend,
  groupBy,
  groupWith,
  mapObjIndexed,
  prop,
  sortBy,
} from 'ramda';
import React from 'react';
import { useUnmount } from 'react-use';
import {
  addComment as addCommentAction,
  deleteComment as deleteCommentAction,
  updateComment as updateCommentAction,
} from 'actions/task-actions';
import { noop } from 'helpers/utility-functions';
import Loader, { LoaderSizes } from 'components/common/Loader/Loader';
import initializeTaskDrawerCommentSectionHooks from './TaskDrawer.CommentSection.Hooks';
import {
  AddCommentButtonContainer,
  CommentsContainer,
  CommentsDivider,
  CommentSectionInputField,
  CommentSectionInputFieldContainer,
  CommentSectionLabel,
  LoaderContainer,
  StyledSimpleBar,
} from './TaskDrawer.CommentSection.Styled';
import renderComment from './TaskDrawer.RenderComment';
import { FormSectionDivider } from './TaskDrawer.Styled';
import AlertMessages from '../alert/AlertMessages';

const getGroupedComments = ({ comments }) => {
  // const commentsSortedById = sortBy(prop('commentIdentifier'), comments);
  // const sortedComments = reverse(
  //   sortBy(comment => moment(comment.dateCreated).unix(), commentsSortedById),
  // );

  const sortedCommentsByIndex = sortBy(ascend(prop('sortIndex')), comments);

  const sortedComments = sortBy(
    descend(comment => moment(comment.dateCreated).unix()),
    sortedCommentsByIndex,
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
  unsetPublishingComment,
  commentContent,
  dispatch,
  scrollToTop,
}) => {
  try {
    setPublishingComment();

    let data;

    if (commentContent?.trim().length > 0) {
      const commentResponse = await addCommentAction(newTask, {
        comment: commentContent?.trim(),
      })(dispatch);

      data = commentResponse.data;

      dispatch(AlertActions.showGlobalAlert('Comment added successfully', 'success'));

      clearCommentContent();
    }

    scrollToTop();
    unsetPublishingComment();

    return data;
  } catch (error) {
    unsetPublishingComment();
    dispatch(AlertActions.showGlobalAlert('Error adding comment, please try again later', 'error'));
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
  } = initializeTaskDrawerCommentSectionHooks({ task });

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
    updateCommentAction(
      task,
      commentData,
    )(dispatch)
      .then(() => {
        dispatch(AlertActions.showGlobalAlert('Comment updated successfully', 'success'));
      })
      .catch(() => {
        dispatch(AlertActions.showGlobalAlert('Error updating comment, please try again later', 'error'));
      });
  };

  const deleteComment = (taskToRemove, comment) =>
    deleteCommentAction(taskToRemove, comment)(dispatch);

  return (
    <>
      {addingComment ? (
        <ClickAwayListener onClickAway={() => {}}>
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
              <LoaderContainer>
                <Loader size={LoaderSizes.small} />
              </LoaderContainer>
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
                renderComment({
                  currentUserId,
                  updateComment,
                  deleteComment,
                  task,
                  members,
                }),
              )}
            </StyledSimpleBar>
          </CommentsContainer>
          <FormSectionDivider condensed />
        </>
      )}
    </>
  );
};
