import React from 'react';
import { Link } from '@mui/material';
import palette from '@/app/styles/palette';

const TaskItemRelationship = ({ customFieldValue, field }) => {
  const { name } = field;
  const { value, values, displayName, displayNames } = customFieldValue || {};

  const profileTypeIdentifier = field?.relatedProfileType?.identifier;

  const profiles = displayNames
    ? displayNames?.map((displayName, index) => ({
        displayName,
        value: values[index],
      }))
    : [{ displayName, value }];

  return (
    <>
      {profiles.map((profile) => (
        <Link
          to={`/core/custom-profiles/${profileTypeIdentifier}/${profile.value}`}
          sx={{
            color: palette.blueOcean,
            fontFamily: 'Outfit',
            textDecoration: 'none',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            '&:hover': {
              color: palette.brightBlue,
            },
          }}
        >
          {profile.displayName || ''}
        </Link>
      ))}
    </>
  );
};

export default TaskItemRelationship;
