import React, {
  useState,
  useContext,
  useCallback,
  useMemo,
  useEffect,
} from 'react';
import Button from '@sendbird/uikit-react/ui/Button';
import { CreateChannelProvider } from '@sendbird/uikit-react/CreateChannel/context';
import * as OrganizationApi from 'api/organization-api';
import { ListContentSection } from 'components/task/MultiAssignPopover/styled';
import UserAvatar from 'components/user/UserAvatar/UserAvatar';
import GroupAvatar from 'components/user/GroupAvatar/GroupAvatar';
import Spacing from 'components/common/Spacing';
import { isUserGroup } from 'helpers/user-helper';
import ChannelSettingsContext from './ChannelSettingsContext';
import InviteUsersModal from './InviteUsersModal';
import {
  ListContainer,
  MemberName,
  MemberRow,
  MemberRowSkeletonLoader,
} from './styled';

const MemberList = ({ onError }) => {
  const [showInviteUsers, setShowInviteUsers] = useState(false);

  const { channel } = useContext(ChannelSettingsContext);
  const { members, myRole } = channel;
  const [organizationMembers, setOrganizationMembers] = useState([]);
  const [isFetchingMembers, setIsFetchingMembers] = useState(false);

  // const [filteredMembers,setFilteredMembers] = useState([]);

  const filteredMembers = useMemo(
    () =>
      organizationMembers?.filter(
        ({ identifier }) =>
          !!members.find(({ userId: id }) => id === identifier),
      ),
    [members, organizationMembers],
  );

  const isOperator = myRole === 'operator';

  const handleOptionClick = useCallback(() => {
    // add context menu in future updates
  }, []);

  useEffect(() => {
    (async () => {
      setIsFetchingMembers(true);
      setOrganizationMembers([]);
      try {
        const totalMembers = await OrganizationApi.getOrganizationUsersAndUserGroups();
        setOrganizationMembers(totalMembers);
      } catch (error) {
        if (typeof onError === 'function') onError(error);
      }
      setIsFetchingMembers(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderSelectOption = useCallback(
    (member, isSelected) => {
      // eslint-disable-next-line no-param-reassign
      member.identifier = member.userId;
      return (
        <MemberRow
          key={member?.userId}
          isSelected={isSelected}
          onClick={event => handleOptionClick(event, member)}
        >
          {/* <Checkbox isChecked={isSelected} /> */}
          <Spacing horizontal={3} />
          {isUserGroup(member) ? (
            <GroupAvatar group={member} hideTooltip />
          ) : (
            <UserAvatar user={member} hideTooltip />
          )}
          <Spacing horizontal={3} />
          <MemberName>{member.name}</MemberName>
        </MemberRow>
      );
    },
    [handleOptionClick],
  );

  return (
    <>
      <ListContainer>
        <ListContentSection>
          {!isFetchingMembers ? (
            filteredMembers?.map(member =>
              renderSelectOption(member, member.isSelected),
            )
          ) : (
            <>
              {new Array(4).fill().map((_, index) => (
                // eslint-disable-next-line react/no-array-index-key
                <MemberRowSkeletonLoader key={index} />
              ))}
            </>
          )}
        </ListContentSection>
      </ListContainer>
      {isOperator && (
        <Button
          type="SECONDARY"
          size="SMALL"
          onClick={() => setShowInviteUsers(true)}
        >
          Invite To Conversation
        </Button>
      )}
      {showInviteUsers && (
        <CreateChannelProvider channelUrl={channel.url}>
          <InviteUsersModal
            onSubmit={() => {
              setShowInviteUsers(false);
            }}
            onCancel={() => setShowInviteUsers(false)}
          />
        </CreateChannelProvider>
      )}
    </>
  );
};

export default MemberList;
