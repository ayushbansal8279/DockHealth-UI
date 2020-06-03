import React from 'react';
import Loader from 'components/common/Loader/Loader';
import Member from 'components/members/Member';

import initializeAddCommentHooks from './NewTaskDrawer.AddComment.Hooks';
import {
  AddCommentContainer,
  AddCommentInput,
  AddCommentLoaderContainer,
} from './NewTaskDrawer.AddComment.Styled';

const AddComment = ({ addComment, parentFormSubmit }) => {
  const {
    currentUser,
    commentContent,
    onCommentChange,
    onEnterPress,
    onCommentFocus,
    isAddingComment,
  } = initializeAddCommentHooks({ addComment, parentFormSubmit });

  return (
    <AddCommentContainer>
      <Member member={currentUser} size={40} />
      <AddCommentInput
        onChange={onCommentChange}
        onKeyDown={onEnterPress}
        onFocus={onCommentFocus}
        value={commentContent}
        placeholder="Leave a comment"
      />
      {isAddingComment && (
        <AddCommentLoaderContainer>
          <Loader size={24} />
        </AddCommentLoaderContainer>
      )}
    </AddCommentContainer>
  );
};

export default AddComment;
