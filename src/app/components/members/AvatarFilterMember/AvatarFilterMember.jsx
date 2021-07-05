import { bool, arrayOf, string, objectOf, func, shape } from 'prop-types';
import React, { useCallback } from 'react';
import { isEmpty } from 'ramda';
import Member from 'components/members/Member/Member';

const filterName = 'assignedTo';

const AvatarFilterMember = props => {
  const { onSelectFilters, selectedFilters, isSelected, member } = props;
  const { userIdentifier } = member || {};

  const toggleSelect = useCallback(() => {
    if (!isEmpty(selectedFilters)) {
      if (isSelected) {
        const filteredWithoutTheSelectedOne = selectedFilters?.[
          filterName
        ]?.filter(userId => userId !== userIdentifier);
        onSelectFilters({
          ...selectedFilters,
          [filterName]: [...filteredWithoutTheSelectedOne],
        });
      } else if (selectedFilters[filterName]) {
        onSelectFilters({
          ...selectedFilters,
          [filterName]: [...selectedFilters[filterName], userIdentifier],
        });
      } else {
        onSelectFilters({
          ...selectedFilters,
          [filterName]: [userIdentifier],
        });
      }
    } else {
      onSelectFilters({
        [filterName]: [userIdentifier],
      });
    }
  }, [userIdentifier, selectedFilters, isSelected, onSelectFilters]);
  return <Member onClickAvatar={toggleSelect} {...props} />;
};

AvatarFilterMember.propTypes = {
  member: shape({
    userIdentifier: string,
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
