import React, { useRef, useEffect } from 'react';
import Loader, { LoaderSizes } from 'components/common/Loader/Loader';
import Member from 'components/members/Member';

import initializeAddCommentHooks from './NewTaskDrawer.AddComment.Hooks';
import {
  AddCommentContainer,
  AddCommentInput,
  AddCommentLoaderContainer,
} from './NewTaskDrawer.AddComment.Styled';

const AddComment = ({ addComment, parentFormSubmit, taskDrawerFocusField }) => {
  const {
    currentUser,
    commentContent,
    onCommentChange,
    onEnterPress,
    onCommentFocus,
    isAddingComment,
  } = initializeAddCommentHooks({ addComment, parentFormSubmit });

  const addCommentReference = useRef();

  useEffect(() => {
    if (taskDrawerFocusField === 'comment') {
      addCommentReference.current.focus();
    }
  }, [taskDrawerFocusField]);

  return (
    <AddCommentContainer>
      <Member member={currentUser} size={40} />
      <AddCommentInput
        onChange={onCommentChange}
        onKeyDown={onEnterPress}
        onFocus={onCommentFocus}
        value={commentContent}
        placeholder="Leave a comment"
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
