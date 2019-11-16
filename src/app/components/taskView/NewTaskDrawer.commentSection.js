import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import moment from 'moment';
import groupBy from 'ramda/es/groupBy';
import groupWith from 'ramda/es/groupWith';
import mapObjIndexed from 'ramda/es/mapObjIndexed';
import sortBy from 'ramda/es/sortBy';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SimpleBar from 'simplebar-react';
import styled from 'styled-components';

import { addTaskComment } from '../../actions/task-actions';
import useBoolean from '../../hooks/useBoolean';
import CubesLoader from '../common/CubesLoader';
import renderComment from './NewTaskDrawer.renderComment';

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
  padding: 3.625rem;
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
  const sortedComments = sortBy(
    comment => moment(comment.dateCreated).unix(),
    comments,
  );

  const datedComments = groupBy(
    comment => moment(comment.dateCreated).format('YYYY-MM-DD'),
    sortedComments,
  );

  const groupedComments = mapObjIndexed(
    groupWith(
      (comment1, comment2) =>
        comment1.creator.userId === comment2.creator.userId,
    ),
    datedComments,
  );

  return groupedComments;
};

export default ({ task }) => {
  const currentUserId = useSelector(
    store => store.userState.userProfile.userId,
  );
  const dispatch = useDispatch();
  const [addingComment, , , toggleAddingComment] = useBoolean(false);
  const [addedComments, setAddedComments] = useState([]);
  const commentSectionInputFieldRef = useRef(null);
  const simpleBarRef = useRef(null);
  const [
    isPublishingComment,
    setPublishingComment,
    unsetPublishingComment,
  ] = useBoolean(false);

  const clearCommentContent = useCallback(() => {
    if (commentSectionInputFieldRef.current) {
      commentSectionInputFieldRef.current.textContent = '';
    }
  }, []);

  useEffect(() => {
    if (addingComment) {
      // eslint-disable-next-line no-unused-expressions
      commentSectionInputFieldRef.current?.focus();
    } else {
      clearCommentContent();
    }
  }, [addingComment, clearCommentContent]);

  const comments = (task?.comments ?? []).concat(addedComments);
  const commentsEmpty = comments.length === 0;

  const groupedComments = getGroupedComments({ comments });

  const publishComment = async () => {
    const commentContent = commentSectionInputFieldRef.current?.textContent;

    if (commentContent?.trim().length === 0) {
      return;
    }

    try {
      setPublishingComment();

      const { data } = await addTaskComment(task, {
        comment: commentContent.trim(),
      })(dispatch);

      clearCommentContent();

      toggleAlert('Comment added successfully', 'success');

      setAddedComments([...addedComments, data]);

      const scrollElement = simpleBarRef.current?.getScrollElement();
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    } catch {
      toggleAlert('Error adding comment, please try again later', 'error');
    } finally {
      unsetPublishingComment();
    }
  };

  const handlePublishComment = event => {
    event.preventDefault();
    event.stopPropagation();

    publishComment();
  };

  return (
    <>
      {addingComment ? (
        <ClickAwayListener onClickAway={toggleAddingComment}>
          <CommentSectionInputFieldContainer>
            <CommentSectionInputField
              ref={commentSectionInputFieldRef}
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
      {!commentsEmpty && (
        <>
          <CommentsDivider />
          <CommentsContainer>
            <StyledSimpleBar ref={simpleBarRef} visible>
              {Object.entries(groupedComments).map(
                renderComment({ currentUserId }),
              )}
            </StyledSimpleBar>
          </CommentsContainer>
        </>
      )}
    </>
  );
};
