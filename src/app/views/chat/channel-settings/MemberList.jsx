import React, { useEffect, useState, useCallback, useContext } from 'react';

import Button from '@sendbird/uikit-react/ui/Button';
import IconButton from '@sendbird/uikit-react/ui/IconButton';
import Icon from '@sendbird/uikit-react/ui/Icon';
import ContextMenu from '@sendbird/uikit-react/ui/ContextMenu';

import UserListItem from '@sendbird/uikit-react/ui/UserListItem';

import useSendbirdStateContext from '@sendbird/uikit-react/useSendbirdStateContext';
import ChannelSettingsContext from './ChannelSettingsContext';
import { LocalizationContext } from '../channel/ChannelLocalizationContext';
import uuidv4 from './uuid';
import InviteUsers from '../add-channel/CustomInviteUsers';
import InviteUsersModal from './InviteUsersModal';
// import InviteUsersModal from './InviteUsersModal';

// import MembersModal from './MembersModal';
// import InviteUsers from './InviteUsersModal';

const MemberList = () => {
  const [members, setMembers] = useState([]);
  const [hasNext, setHasNext] = useState(false);
  const [showAllMembers, setShowAllMembers] = useState(false);
  const [showInviteUsers, setShowInviteUsers] = useState(false);

  const state = useSendbirdStateContext();
  const { channel, setChannelUpdateId } = useContext(ChannelSettingsContext);
  const { stringSet } = useContext(LocalizationContext);

  const sdk = state?.stores?.sdkStore?.sdk;
  const userId = state?.config?.userId;

  useEffect(() => {
    if (!channel) {
      setMembers([]);
      return;
    }

    const memberUserListQuery = channel?.createMemberListQuery({ limit: 10 });
    memberUserListQuery.next().then(returnedMembers => {
      setMembers(returnedMembers);
      setHasNext(memberUserListQuery.hasNext);
    });
  }, [channel]);

  const refreshList = useCallback(() => {
    if (!channel) {
      setMembers([]);
      return;
    }
    const memberUserListQuery = channel?.createMemberListQuery({ limit: 10 });
    memberUserListQuery.next().then(returnedMembers => {
      setMembers(returnedMembers);
      setHasNext(memberUserListQuery.hasNext);
      setChannelUpdateId(uuidv4());
    });
  }, [channel, setChannelUpdateId]);

  return (
    <>
      {/* {members.map(member => (
        <UserListItem
          key={member.userId}
          user={member}
          currentUser={sdk.currentUser.userId}
          action={
            userId !== member.userId
              ? ({ actionRef, parentRef }) => (
                  <ContextMenu
                    menuTrigger={toggleDropdown => (
                      <IconButton
                        className="sendbird-user-message__more__menu"
                        width="32px"
                        height="32px"
                        onClick={toggleDropdown}
                      >
                        <Icon
                          width="24px"
                          height="24px"
                          type="MORE"
                          fillColor="CONTENT_INVERSE"
                        />
                      </IconButton>
                    )}
                    // menuItems={closeDropdown => (
                    //   <MenuItems
                    //         parentContainRef={parentRef}
                    //         parentRef={actionRef} // for catching location(x, y) of MenuItems
                    //         closeDropdown={closeDropdown}
                    //         openLeft
                    //     >
                    //         <MenuItem
                    //         onClick={() => {
                    //             if ((member.role !== 'operator')) {
                    //             channel?.addOperators([member.userId]).then(() => {
                    //                 refreshList();
                    //                 closeDropdown();
                    //             });
                    //             } else {
                    //             channel?.removeOperators([member.userId]).then(() => {
                    //                 refreshList();
                    //                 closeDropdown();
                    //             });
                    //             }
                    //         }}
                    //         >
                    //         {
                    //             member.role !== 'operator'
                    //             ? stringSet.CHANNEL_SETTING__MODERATION__REGISTER_AS_OPERATOR
                    //             : stringSet.CHANNEL_SETTING__MODERATION__UNREGISTER_OPERATOR
                    //         }
                    //         </MenuItem>
                    //         {
                    //         // No muted members in broadcast channel
                    //         !channel?.isBroadcast && (
                    //             <MenuItem
                    //             onClick={() => {
                    //                 if (member.isMuted) {
                    //                 channel?.unmuteUser(member).then(() => {
                    //                     refreshList();
                    //                     closeDropdown();
                    //                 })
                    //                 } else {
                    //                 channel?.muteUser(member).then(() => {
                    //                     refreshList();
                    //                     closeDropdown();
                    //                 });
                    //                 }
                    //             }}
                    //             >
                    //             {
                    //                 member.isMuted
                    //                 ? stringSet.CHANNEL_SETTING__MODERATION__UNMUTE
                    //                 : stringSet.CHANNEL_SETTING__MODERATION__MUTE
                    //             }
                    //             </MenuItem>
                    //         )
                    //         }
                    //         <MenuItem
                    //         onClick={() => {
                    //             channel?.banUser(member, -1, '').then(() => {
                    //             refreshList();
                    //             closeDropdown();
                    //             });
                    //         }}
                    //         >
                    //         {stringSet.CHANNEL_SETTING__MODERATION__BAN}
                    //         </MenuItem>
                    //     </MenuItems>
                    //     )}
                  />
                )
              : null
          }
        />
      ))} */}
      {/* <div className="sendbird-channel-settings-accordion__footer">
        {hasNext && (
          <Button
            type="SECONDARY"
            size="SMALL"
            onClick={() => setShowAllMembers(true)}
          >
            {stringSet.CHANNEL_SETTING__MEMBERS__SEE_ALL_MEMBERS}
          </Button>
        )}
        <Button
          type="SECONDARY"
          size="SMALL"
          onClick={() => setShowInviteUsers(true)}
        >
          {stringSet.CHANNEL_SETTING__MEMBERS__INVITE_MEMBER}
        </Button>
      </div> */}
      {/* {showAllMembers && (
        <MembersModal
          onCancel={() => {
            setShowAllMembers(false);
            refreshList();
          }}
        />
      )} */}
      <Button
        type="SECONDARY"
        size="SMALL"
        onClick={() => setShowInviteUsers(true)}
      >
        Invite To Conversation
      </Button>
      {showInviteUsers && (
        <InviteUsersModal
          onSubmit={() => {
            setShowInviteUsers(false);
            refreshList();
          }}
          onCancel={() => setShowInviteUsers(false)}
        />
      )}
    </>
  );
};

export default MemberList;
