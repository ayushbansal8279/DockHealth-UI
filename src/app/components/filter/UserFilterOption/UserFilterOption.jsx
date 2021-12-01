import React from 'react';
import FilterOption from 'components/filter/FilterOption/FilterOption';
import GroupAvatar from 'components/user/GroupAvatar/GroupAvatar';
import UserAvatar from 'components/user/UserAvatar/UserAvatar';
import { isUserGroup } from 'helpers/user-helper';
import UnassignedIcon from 'img/UnassignedIcon';

const UserFilterOption = ({
  id,
  label,
  count,
  selected,
  onClick,
  reference,
}) => (
  <FilterOption
    id={id}
    label={label}
    count={count}
    selected={selected}
    onClick={onClick}
    startAdornment={
      id === 'UNASSIGNED' ? (
        <UnassignedIcon size={25} />
      ) : (
        <>
          {isUserGroup(reference) ? (
            <GroupAvatar group={reference} size={25} />
          ) : (
            <UserAvatar user={reference} size={25} />
          )}
        </>
      )
    }
  />
);

export default UserFilterOption;
