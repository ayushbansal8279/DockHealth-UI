import React from 'react';

import CubesLoader from 'components/common/CubesLoader';
import Member from 'components/members/Member';
import palette from 'styles/palette';

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
          <CubesLoader size={24} color={palette.coolGrey1} />
        </AddCommentLoaderContainer>
      )}
    </AddCommentContainer>
  );
};

export default AddComment;
