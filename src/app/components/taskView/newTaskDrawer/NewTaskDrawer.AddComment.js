import React, { useEffect, useRef } from 'react';
import Loader, { LoaderSizes } from 'components/common/Loader/Loader';
import Member from 'components/members/Member';

import initializeAddCommentHooks from './NewTaskDrawer.AddComment.Hooks';
import {
  AddCommentContainer,
  AddCommentInput,
  AddCommentLoaderContainer,
} from './NewTaskDrawer.AddComment.Styled';
import { FocusDrawerFieldEnum } from './NewTaskDrawer.Utilities';

const AddComment = ({ addComment, parentFormSubmit, taskDrawerFocusField }) => {
  const {
    currentUser,
    commentContent,
    onCommentChange,
    saveComment,
    onCommentFocus,
    isAddingComment,
  } = initializeAddCommentHooks({ addComment, parentFormSubmit });

  const addCommentReference = useRef();

  useEffect(() => {
    if (taskDrawerFocusField === FocusDrawerFieldEnum.COMMENT) {
      addCommentReference.current.focus();
      // eslint-disable-next-line no-unused-expressions
      addCommentReference.current?.scrollIntoView(true);
    }
  }, [taskDrawerFocusField]);

  return (
    <AddCommentContainer>
      <Member member={currentUser} size={40} />
      <AddCommentInput
        onChange={onCommentChange}
        onKeyDown={event =>
          event.key === 'Enter' && addCommentReference.current?.blur()
        }
        onBlur={saveComment}
        onFocus={onCommentFocus}
        value={commentContent}
        placeholder="Leave a comment and press enter on your keyboard to save"
        ref={addCommentReference}
      />
      {isAddingComment && (
        <AddCommentLoaderContainer>
          <Loader size={LoaderSizes.medium} />
        </AddCommentLoaderContainer>
      )}
    </AddCommentContainer>
  );
};

export default AddComment;
