import { Box } from '@mui/material';
import React from 'react';
import AddComment from './AddComment';
import palette from 'styles/palette';
import { IComment } from '@/app/types/Comment';
import { useSelector } from 'react-redux';
import { userProfileSelector } from '@/app/selectors/user-selectors';
import {
  SINGLE_TASK_RESTRICTIONS_OPTIONS,
  SINGLE_TASK_RESTRICTIONS_PROFILES,
} from '@/app/restrictions/task-restrictions';

const { DISABLED } = SINGLE_TASK_RESTRICTIONS_OPTIONS;

interface Props {
  autoFocus?: boolean;
  onAdd: (c: IComment) => void;
  onFocus?: VoidFunction;
  onBlur?: VoidFunction;
}

export default function StickyAddComment(props: Props) {
  const { orgUserRole } = useSelector(userProfileSelector);
  const restrictions = SINGLE_TASK_RESTRICTIONS_PROFILES[orgUserRole] ?? {};
  const addCommentDisabled = restrictions?.comments === DISABLED;

  if (addCommentDisabled) {
    return null;
  }

  return (
    <Box
      sx={{
        position: 'sticky',
        bottom: '0%',
        left: 0,
        px: 4,
        py: 1,
        backgroundColor: palette.blueGrey,
        borderTop: `1px solid ${palette.zinc}`,
        zIndex: 3,
      }}
    >
      <AddComment {...props} />
    </Box>
  );
}
