import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import palette from 'styles/palette';
import { activeUsersListSelector } from 'selectors/active-users-selector';
import { arrayOf, bool, number, shape, string } from 'prop-types';
import Tooltip from 'components/common/Tooltip/Tooltip';
import { Container, Text } from './styled';
import { getHiddenMembersTooltipContent } from './helpers';

const AdditionalMembersCounter = ({
  hiddenMembers,
  size,
  hideTooltip,
  color,
}) => {
  const activeUsers = useSelector(activeUsersListSelector);
  const tooltipContent = useMemo(
    () =>
      !hideTooltip
        ? getHiddenMembersTooltipContent(hiddenMembers, activeUsers)
        : '',
    [hideTooltip, hiddenMembers, activeUsers],
  );

  return hiddenMembers?.length ? (
    <Tooltip title={tooltipContent}>
      <Container color={color} size={size}>
        <Text color={color} size={size}>
          {hiddenMembers?.length < 100 && `+`}
          {hiddenMembers?.length}
        </Text>
      </Container>
    </Tooltip>
  ) : null;
};

AdditionalMembersCounter.propTypes = {
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
  hideTooltip: bool,
  color: string,
};

AdditionalMembersCounter.defaultProps = {
  size: 30,
  hideTooltip: false,
  color: palette.coolGrey1,
};

export default AdditionalMembersCounter;
