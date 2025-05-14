import React, { useMemo } from 'react';

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

  const displayNames = profileDisplayNames
    .flatMap(name => (Array.isArray(name) ? name : [name]))
    .filter(Boolean);

  const displayName = displayNames.join(', ') || '-';

  const tooltip = useMemo(() => (
    <div>
      <div><strong>name:</strong> {displayName}</div>
      <div><strong>type:</strong> {profileTypeName || '-'}</div>
    </div>
  ), [displayName, profileTypeName]);

  const profileUrl = `/core/custom-profiles/${profileTypeIdentifier}/${identifier}`;

  return (
    <StyledProfileLink to={profileUrl}>
      <Tooltip
        placement="top"
        title={tooltip}
      >
        <ProfileLabel>
          {displayName}
        </ProfileLabel>
      </Tooltip>
    </StyledProfileLink>
  );
};

export default TaskItemProfile;