import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import palette from 'styles/palette';
import { activeUsersListSelector } from 'selectors/active-users-selector';
import {
  arrayOf,
  number,
  shape,
  string,
  func,
  objectOf,
  array,
} from 'prop-types';
import AdditionalMembersPopover from 'components/task/AdditionalMembersPopover';
import { Container, Text } from './styled';
import { getHiddenMembersWithStatusContent } from './helpers';

const AdditionalMembersCounterPopover = ({
  hiddenMembers,
  size,
  color,
  onSelectFilters,
  selectedFilters,
}) => {
  const activeUsers = useSelector(activeUsersListSelector);
  const hiddenMembersWithStatus = useMemo(
    () => getHiddenMembersWithStatusContent(hiddenMembers, activeUsers),
    [hiddenMembers, activeUsers],
  );
  return hiddenMembers?.length ? (
    <>
      <AdditionalMembersPopover
        members={hiddenMembersWithStatus}
        selectedFilters={selectedFilters}
        onSelectFilters={onSelectFilters}
      >
        <Container color={color} size={size}>
          <Text color={color} size={size}>
            {hiddenMembers?.length < 100 && `+`}
            {hiddenMembers?.length}
          </Text>
        </Container>
      </AdditionalMembersPopover>
    </>
  ) : null;
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
  size: number,
  color: string,
  onSelectFilters: func.isRequired,
  selectedFilters: objectOf(array).isRequired,
};

AdditionalMembersCounterPopover.defaultProps = {
  size: 30,
  color: palette.coolGrey1,
};

export default AdditionalMembersCounterPopover;
