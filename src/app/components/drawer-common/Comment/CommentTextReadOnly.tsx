import React, { useState } from 'react';
import { IComment } from '@/app/types/Comment';
import { traverseNodes, processMarkdownValue } from './helpers';
import { Button } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

interface Props {
  comment: IComment;
}

type SeeOption = 'more' | 'less';

export default function CommentTextReadOnly({ comment }: Props) {
  const [currentSeeOption, setCurrentSeeOption] = useState<SeeOption>('less');
  const { tokenizedComment, commentMentions } = comment;
  const showMoreLessOption = tokenizedComment.split('\n').length > 4;
  const firstFourLineComment = tokenizedComment
    .split('\n')
    .slice(0, 4)
    .join('\n');

  const handleSwitchSeeOption =
    (option: SeeOption) =>
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.stopPropagation();
      setCurrentSeeOption(option);
    };

  if (!showMoreLessOption) {
    return traverseNodes(
      processMarkdownValue(tokenizedComment),
      commentMentions,
    );
  }

  if (currentSeeOption === 'more') {
    return (
      <>
        {traverseNodes(processMarkdownValue(tokenizedComment), commentMentions)}
        <Button
          variant="text"
          startIcon={<ArrowUpwardIcon />}
          onClick={handleSwitchSeeOption('less')}
        >
          See Less
        </Button>
      </>
    );
  }

  // currentSeeOption === 'less'
  return (
    <>
      {traverseNodes(
        processMarkdownValue(firstFourLineComment),
        commentMentions,
      )}
      <Button
        variant="text"
        startIcon={<ArrowDownwardIcon />}
        onClick={handleSwitchSeeOption('more')}
      >
        See More
      </Button>
    </>
  );
}
