import React from 'react';
import { getCommentDetails } from 'components/drawer-common/Comment/helpers';
import CommentTextReadOnly from 'components/drawer-common/Comment/CommentTextReadOnly';
import {
  CommentContainer,
  CommentText,
  CommentDetails,
  CommentContent,
  CommentWrapper,
  CommentMemberContainer,
} from 'components/drawer-common/Comment/styled';
import UserAvatar from 'components/user/UserAvatar/UserAvatar';
import { IComment } from '@/app/types/Comment';

interface Props {
  comment: IComment;
  onClick: () => void;
}

export default function Comment({ comment, onClick }: Props) {
  const { creator, commentMentions, tokenizedComment } = comment;

  const commentDetails = getCommentDetails(comment);

  return (
    <CommentWrapper onClick={onClick} $showPointer>
      <CommentMemberContainer>
        <UserAvatar user={creator} size={35} />
      </CommentMemberContainer>
      <CommentContainer>
        <CommentContent>
          <CommentText>
            <CommentTextReadOnly comment={comment} />
          </CommentText>
          <CommentDetails>{commentDetails}</CommentDetails>
        </CommentContent>
      </CommentContainer>
    </CommentWrapper>
  );
}
