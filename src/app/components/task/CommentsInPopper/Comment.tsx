import React from 'react';
import {
  traverseNodes,
  getCommentDetails,
  processMarkdownValue,
} from 'components/drawer-common/Comment/helpers';
import {
  CommentContainer,
  CommentText,
  CommentDetails,
  CommentContent,
  CommentWrapper,
  CommentMemberContainer,
} from 'components/drawer-common/Comment/styled';
import UserAvatar from 'components/user/UserAvatar/UserAvatar';
import { CommentDto } from '@/app/types/swagger/models/CommentDto';

interface Props {
  comment: CommentDto;
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
            {traverseNodes(
              processMarkdownValue(tokenizedComment),
              commentMentions,
            )}
          </CommentText>
          <CommentDetails>{commentDetails}</CommentDetails>
        </CommentContent>
      </CommentContainer>
    </CommentWrapper>
  );
}
