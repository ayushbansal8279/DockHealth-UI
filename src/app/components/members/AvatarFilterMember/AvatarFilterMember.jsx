import { bool, array, string, objectOf, func, shape } from 'prop-types';
import React from 'react';
import { isEmpty } from 'ramda';
import Member from 'components/members/Member/Member';

const filterName = 'assignedTo';

const AvatarFilterMember = React.forwardRef(
  ({ onSelectFilters, selectedFilters, ...props }) => {
    const { userIdentifier } = props.member || {};

    const toggleSelect = () => {
      if (!isEmpty(selectedFilters)) {
        if (props.isSelected) {
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
    };
    return <Member onClickAvatar={toggleSelect} {...props} />;
  },
);

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
  selectedFilters: objectOf(array).isRequired,
};

AvatarFilterMember.defaultProps = {
  member: null,
  isSelected: false,
};

export default AvatarFilterMember;
