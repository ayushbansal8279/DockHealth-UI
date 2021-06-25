import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { activeUsersListSelector } from 'selectors/active-users-selector';
import { arrayOf, shape, string, func, objectOf } from 'prop-types';
import AdditionalMembersPopover from 'components/task/AdditionalMembersPopover/AdditionalMembersPopover';
import AdditionalMembersCounter from 'components/members/AdditionalMembersCounter/AdditionalMembersCounter';
import { getHiddenMembersWithStatusContent } from './helpers';

const AdditionalMembersCounterPopover = ({
  hiddenMembers,
  onSelectFilters,
  selectedFilters,
  ...restProps
}) => {
  const activeUsers = useSelector(activeUsersListSelector);
  const hiddenMembersWithStatus = useMemo(
    () => getHiddenMembersWithStatusContent(hiddenMembers, activeUsers),
    [hiddenMembers, activeUsers],
  );
  return (
    hiddenMembers?.length && (
      <>
        <AdditionalMembersPopover
          members={hiddenMembersWithStatus}
          selectedFilters={selectedFilters}
          onSelectFilters={onSelectFilters}
        >
          <AdditionalMembersCounter
            {...restProps}
            hiddenMembers={hiddenMembers}
            hideTooltip
          />
        </AdditionalMembersPopover>
      </>
    )
  );
};

AdditionalMembersCounterPopover.propTypes = {
  hiddenMembers: arrayOf(
    shape({
      userIdentifier: string,
      firstName: string,
      lastName: string,
      initials: string,
      profileThumbnailPictureHash: string,
    }),
  ).isRequired,
  onSelectFilters: func.isRequired,
  selectedFilters: objectOf(arrayOf(string)).isRequired,
};

export default AdditionalMembersCounterPopover;
