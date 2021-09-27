import { bool, arrayOf, string, objectOf, func, shape } from 'prop-types';
import React, { useCallback } from 'react';
import { isEmpty } from 'ramda';
import { isUserGroup } from 'helpers/user-helper';
import UserAvatar from 'components/user/UserAvatar/UserAvatar';
import GroupAvatar from 'components/user/GroupAvatar/GroupAvatar';

const filterName = 'assignedTo';

const AvatarFilterMember = props => {
  const { onSelectFilters, selectedFilters, isSelected, member } = props;
  const { identifier } = member || {};

  const toggleSelect = useCallback(() => {
    if (!isEmpty(selectedFilters)) {
      if (isSelected) {
        const filteredWithoutTheSelectedOne = selectedFilters?.[
          filterName
        ]?.filter(userId => userId !== identifier);
        onSelectFilters({
          ...selectedFilters,
          [filterName]: [...filteredWithoutTheSelectedOne],
        });
      } else if (selectedFilters[filterName]) {
        onSelectFilters({
          ...selectedFilters,
          [filterName]: [...selectedFilters[filterName], identifier],
        });
      } else {
        onSelectFilters({
          ...selectedFilters,
          [filterName]: [identifier],
        });
      }
    } else {
      onSelectFilters({
        [filterName]: [identifier],
      });
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
