import React from 'react';
import {
  traverseNodes,
  getCommentDetails,
  processMarkdownValue,
} from 'components/drawer-common/Comment/helpers';
import {
  CommentContainer,
  CommentText,
  CommentTextReadonly,
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
            <CommentTextReadonly>
              {traverseNodes(
                processMarkdownValue(tokenizedComment),
                commentMentions,
              )}
            </CommentTextReadonly>
          </CommentText>
          <CommentDetails>{commentDetails}</CommentDetails>
        </CommentContent>
      </CommentContainer>
    </CommentWrapper>
  );
}
