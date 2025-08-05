import React from 'react';
import { Link } from '@mui/material';
import palette from '@/app/styles/palette';
import Spacing from '@/app/components/common/Spacing';

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

  const profileLinkSx = {
    color: palette.blueOcean,
    fontFamily: 'Outfit',
    textDecoration: 'none',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    '&:hover': {
      color: palette.brightBlue,
    },
  };

  return (
    <>
      {profiles?.map((profile) => {
        if (profile?.displayName) {
          return (
            <>
              <Link
                key={profile.value}
                href={`/#/core/custom-objects/${profileTypeIdentifier}/${profile.value}`}
                sx={profileLinkSx}
              >
                {profile.displayName || ''}
              </Link>
              ,
              <Spacing horizontal={3} />
            </>
          );
        }
      })}
    </>
  );
};

export default TaskItemRelationship;
