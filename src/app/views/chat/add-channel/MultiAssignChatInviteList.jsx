import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from 'react';
import Highlighter from 'react-highlight-words';
import * as OrganizationApi from 'api/organization-api';
import { arrayOf, func, shape, string } from 'prop-types';
import debounce from 'lodash.debounce';
import UserAvatar from 'components/user/UserAvatar/UserAvatar';
import MagnifierIcon from 'img/magnifier';
import Checkbox from 'components/common/Checkbox/Checkbox';
import Spacing from 'components/common/Spacing';
import { useSelector } from 'react-redux';
import { userProfileSelector } from 'selectors/user-selectors';
import { isUserGroup } from 'helpers/user-helper';
import GroupAvatar from 'components/user/GroupAvatar/GroupAvatar';
import { getUsersByName } from 'api/user-api';
import { organizationSelector } from 'selectors/organization-selectors';

import {
  Input,
  InputBox,
  ListContainer,
  MemberRow,
  MemberName,
  ListContentSection,
  MemberRowSkeletonLoader,
  highlightStyle,
  NoRecordsText,
} from './styled';

const UNASSIGNED_KEY = 'UNASSIGNED';
const ASSIGN_ALL_KEY = 'ASSIGN_ALL';

const MultiAssignChatInviteMembersList = ({
  selectedMembers: savedSelectedMembers,
  onSelect,
  onError,
  enableLazyLoading: enabled,
  // eslint-disable-next-line sonarjs/cognitive-complexity
}) => {
  const { emrIntegrationEnabled } = useSelector(organizationSelector);
  const currentUser = useSelector(userProfileSelector);
  const [membersOptions, setMembersOptions] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [isFetchingMembers, setIsFetchingMembers] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const enableLazyLoading = emrIntegrationEnabled && enabled;
  const isValueSendable = searchValue?.trim()?.length > 2;

  const filteredMembers = useMemo(
    () =>
      enableLazyLoading
        ? membersOptions.map(user => {
            const { identifier } = user;
            const isSelected = !!selectedMembers.find(
              ({ identifier: id }) => id === identifier,
            );
            return { ...user, isSelected };
          })
        : membersOptions?.filter(
            ({ name, identifier, itemType, userStatus }) => {
              const isSelected = !!selectedMembers.find(
                ({ identifier: id }) => id === identifier,
              );
              return (
                !isSelected &&
                name.toLowerCase().startsWith(searchValue.toLowerCase()) &&
                identifier !== currentUser?.identifier &&
                itemType === 'USER' &&
                userStatus === 'ACTIVE'
              );
            },
          ),
    [
      enableLazyLoading,
      membersOptions,
      selectedMembers,
      searchValue,
      currentUser,
    ],
  );

  const filteredSelectedMembers = useMemo(
    () =>
      selectedMembers?.filter(
        ({ identifier }) => identifier !== currentUser?.identifier,
      ),
    [selectedMembers, currentUser],
  );

  useEffect(() => {
    if (savedSelectedMembers.length > 0 && selectedMembers.length === 0) {
      const members = savedSelectedMembers.map(member => {
        return { identifier: member.userId, name: member.nickname };
      });
      setSelectedMembers([...members]);
    }
  }, [savedSelectedMembers, selectedMembers]);

  const inputReference = useRef(null);

  const selectMembersWithDebounce = useCallback(
    debounce(selection => {
      onSelect(selection.map(s => ({ ...s, userIdentifier: s.userId })));
      // eslint-disable-next-line no-unused-expressions
      inputReference.current?.focus();
    }, 700),
    [],
  );

  useEffect(() => {
    if (inputReference) {
      // eslint-disable-next-line no-unused-expressions
      inputReference?.current?.focus();
    }
  }, [inputReference]);

  useEffect(() => {
    (async () => {
      if (enableLazyLoading && isValueSendable) {
        setIsFetchingMembers(true);
        try {
          const members = await getUsersByName(searchValue);
          setMembersOptions(members);
        } catch (error) {
          if (typeof onError === 'function') onError(error);
        }
        setIsFetchingMembers(false);
      } else if (enableLazyLoading && searchValue?.trim()?.length < 3) {
        setIsFetchingMembers(false);
      }
    })();
  }, [enableLazyLoading, onError, searchValue, isValueSendable]);

  useEffect(() => {
    (async () => {
      if (!enableLazyLoading) {
        setIsFetchingMembers(true);
        setMembersOptions([]);
        try {
          const organizationMembers = await OrganizationApi.getOrganizationUsersAndUserGroups();
          setMembersOptions(organizationMembers);
        } catch (error) {
          if (typeof onError === 'function') onError(error);
        }
        setIsFetchingMembers(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleOptionClick = useCallback(
    (event, selectedOption) => {
      event.stopPropagation();
      let membersToReturn;
      if (selectedOption === ASSIGN_ALL_KEY) {
        membersToReturn = [...membersOptions];
      } else if (selectedOption === UNASSIGNED_KEY) {
        membersToReturn = [];
      } else if (
        selectedMembers.find(
          ({ identifier }) => selectedOption?.identifier === identifier,
        )
      ) {
        membersToReturn = selectedMembers.filter(
          ({ identifier }) => identifier !== selectedOption?.identifier,
        );
      } else {
        membersToReturn = [...selectedMembers, selectedOption];
      }
      selectMembersWithDebounce(membersToReturn);
      setSelectedMembers(membersToReturn);
    },
    [membersOptions, selectMembersWithDebounce, selectedMembers],
  );

  const displayUsersList = useMemo(() => {
    if (enableLazyLoading) return isValueSendable;
    return !!filteredMembers.length || isFetchingMembers;
  }, [
    enableLazyLoading,
    filteredMembers.length,
    isFetchingMembers,
    isValueSendable,
  ]);

  const renderSelectOption = useCallback(
    (member, isSelected) => {
      return (
        <MemberRow
          key={member?.identifier}
          isSelected={isSelected}
          onClick={event => handleOptionClick(event, member)}
        >
          <Checkbox isChecked={isSelected} />
          <Spacing horizontal={3} />
          {isUserGroup(member) ? (
            <GroupAvatar group={member} hideTooltip />
          ) : (
            <UserAvatar user={member} hideTooltip />
          )}
          <Spacing horizontal={3} />
          <MemberName>
            <Highlighter
              highlightStyle={highlightStyle}
              searchWords={searchValue?.toLowerCase().split(/\s+/)}
              autoEscape
              textToHighlight={member?.name}
            />
          </MemberName>
        </MemberRow>
      );
    },
    [handleOptionClick, searchValue],
  );

  return (
    <>
      <InputBox>
        <img src={MagnifierIcon} alt="magnifier" />
        <Input
          ref={inputReference}
          placeholder="Search"
          onChange={event => setSearchValue(event.target.value)}
        />
      </InputBox>
      <ListContainer>
        {filteredSelectedMembers?.length > 0 && (
          <ListContentSection>
            {filteredSelectedMembers?.map(member => {
              return renderSelectOption(member, true);
            })}
          </ListContentSection>
        )}
        {displayUsersList && (
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
        )}
        {isValueSendable && !isFetchingMembers && !filteredMembers.length && (
          <NoRecordsText>No users found</NoRecordsText>
        )}
      </ListContainer>
    </>
  );
};

MultiAssignChatInviteMembersList.propTypes = {
  selectedMembers: arrayOf(
    shape({
      identifier: string,
      firstName: string,
      lastName: string,
      initials: string,
      profileThumbnailPictureHash: string,
    }),
  ).isRequired,
  onSelect: func.isRequired,
  onError: func,
};

MultiAssignChatInviteMembersList.defaultProps = {
  onError: null,
};

export default MultiAssignChatInviteMembersList;
