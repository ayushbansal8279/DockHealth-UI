import { arrayOf, string, objectOf, func, shape } from 'prop-types';
import React, { useCallback } from 'react';
import { isUserGroup } from 'helpers/user-helper';
import UserAvatar from 'components/user/UserAvatar/UserAvatar';
import GroupAvatar from 'components/user/GroupAvatar/GroupAvatar';
import {
  FilterOptionsCategory,
  isOptionSelected,
  selectFilterOption,
  unselectFilterOption,
} from 'helpers/filter-options-helpers';

const AvatarFilterMember = props => {
  const { onSelectFilters, selectedFilters, member } = props;
  const { identifier } = member || {};

  const isSelected = isOptionSelected(
    FilterOptionsCategory.ASSIGNED_TO,
    member?.identifier,
    selectedFilters,
  );

  const toggleSelect = useCallback(() => {
    if (isSelected) {
      onSelectFilters(
        unselectFilterOption(
          FilterOptionsCategory.ASSIGNED_TO,
          identifier,
          selectedFilters,
        ),
      );
    } else {
      onSelectFilters(
        selectFilterOption(
          FilterOptionsCategory.ASSIGNED_TO,
          identifier,
          selectedFilters,
        ),
      );
    }
  }, [identifier, selectedFilters, isSelected, onSelectFilters]);

  return isUserGroup(member) ? (
    <GroupAvatar
      isSelected={isSelected}
      onClick={toggleSelect}
      {...props}
      group={member}
    />
  ) : (
    <UserAvatar
      isSelected={isSelected}
      onClick={toggleSelect}
      {...props}
      user={member}
    />
  );
};

AvatarFilterMember.propTypes = {
  member: shape({
    identifier: string,
    firstName: string,
    lastName: string,
    initials: string,
    profileThumbnailPictureHash: string,
  }),
  onSelectFilters: func.isRequired,
  selectedFilters: objectOf(arrayOf(string)).isRequired,
};

AvatarFilterMember.defaultProps = {
  member: null,
};

export default AvatarFilterMember;
