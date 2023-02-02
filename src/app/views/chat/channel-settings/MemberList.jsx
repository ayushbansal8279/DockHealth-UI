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
import ChannelSettingsContext from './ChannelSettingsContext';
import InviteUsersModal from './InviteUsersModal';
import MemberListItem from './MemeberListItem';
import { ListContainer, MemberRowSkeletonLoader } from './styled';

const MemberList = ({ onError }) => {
  const [showInviteUsers, setShowInviteUsers] = useState(false);

  const { channel } = useContext(ChannelSettingsContext);
  const { members, myRole } = channel;
  const [organizationMembers, setOrganizationMembers] = useState([]);
  const [isFetchingMembers, setIsFetchingMembers] = useState(false);

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
    // add context menu in future updates\
  }, []);

  useEffect(() => {
    (async () => {
      setIsFetchingMembers(true);
      setOrganizationMembers([]);
      try {
        const totalMembers =
          await OrganizationApi.getOrganizationUsersAndUserGroups();
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
      member.identifier = member.userIdentifier;
      const channelMember = channel.members?.find(
        ({ userId }) => userId === member.userIdentifier,
      );
      return (
        <MemberListItem
          member={member}
          channelMember={channelMember}
          isSelected={isSelected}
          channel={channel}
          handleOptionClick={handleOptionClick}
        />
      );
    },
    [channel, handleOptionClick],
  );

  return (
    <>
      <ListContainer>
        <ListContentSection>
          {!isFetchingMembers ? (
            filteredMembers?.map((member) =>
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
