import { bool, arrayOf, string, objectOf, func, shape } from 'prop-types';
import React, { useCallback } from 'react';
import { isUserGroup } from 'helpers/user-helper';
import UserAvatar from 'components/user/UserAvatar/UserAvatar';
import GroupAvatar from 'components/user/GroupAvatar/GroupAvatar';
import {
  FilterOptionsCategory,
  selectFilterOption,
  unselectFilterOption,
} from 'helpers/filter-options-helpers';

const AvatarFilterMember = props => {
  const { onSelectFilters, selectedFilters, isSelected, member } = props;
  const { identifier } = member || {};

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
    <GroupAvatar onClick={toggleSelect} {...props} group={member} />
  ) : (
    <UserAvatar onClick={toggleSelect} {...props} user={member} />
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
  isSelected: bool,
  onSelectFilters: func.isRequired,
  selectedFilters: objectOf(arrayOf(string)).isRequired,
};

AvatarFilterMember.defaultProps = {
  member: null,
  isSelected: false,
};

export default AvatarFilterMember;
