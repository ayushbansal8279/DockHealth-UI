import React from 'react';

import Tooltip from '@/app/components/common/Tooltip/Tooltip';
import { ProfileLabel, StyledProfileLink } from './styled';

const TaskItemProfile = ({ task }) => {
  const profile = task?.customProfiles?.[0];

  if (!profile) return null;

  const {
    profileDisplayNames = [],
    profileTypeIdentifier,
    profileTypeName,
    identifier
  } = profile;

  const flatNames = profileDisplayNames.flatMap(name =>
    Array.isArray(name) ? name : [name]
  );

  const displayNames = flatNames.filter(Boolean);
  const displayName = displayNames[0] || '-';
  const tooltip = `${displayNames.join(', ')}${profileTypeName ? ` (${profileTypeName})` : ''}`;

  const profileUrl = `/core/custom-profiles/${profileTypeIdentifier}/${identifier}`;

  return (
    <StyledProfileLink to={profileUrl}>
      <Tooltip
        placement="top"
        title={tooltip}
      >
        <ProfileLabel>
          {displayName} ({profileTypeName})
        </ProfileLabel>
      </Tooltip>
    </StyledProfileLink>
  );
};

export default TaskItemProfile;