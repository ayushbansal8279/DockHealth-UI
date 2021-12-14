import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from 'react';
import Highlighter from 'react-highlight-words';
import * as OrganizationApi from 'api/organization-api';
import { arrayOf, func, oneOfType, shape, string } from 'prop-types';
import debounce from 'lodash.debounce';
import UserAvatar from 'components/user/UserAvatar/UserAvatar';
import MagnifierIcon from 'img/magnifier';
import Checkbox from 'components/common/Checkbox/Checkbox';
import Spacing from 'components/common/Spacing';
import { pluck } from 'ramda';
import { useSelector } from 'react-redux';
import { userProfileSelector } from 'selectors/user-selectors';
import AssignMemberIcon from 'components/user/AssignMemberIcon/AssingMemberIcon';
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
  UnassignedIcon,
  MemberRowSkeletonLoader,
  highlightStyle,
  CheckboxSpacing,
  NoRecordsText,
} from './styled';
import { collectJoinedListMembers } from './helpers';

const UNASSIGNED_KEY = 'UNASSIGNED';
const ASSIGN_ALL_KEY = 'ASSIGN_ALL';

const MultiAssignMembersList = ({
  taskListIdentifiers,
  selectedMembers: savedSelectedMembers,
  onSelect,
  onError,
  enableLazyLoading: enabled,
  // eslint-disable-next-line sonarjs/cognitive-complexity
}) => {
  const { emrIntegrationEnabled } = useSelector(organizationSelector);
  const currentUser = useSelector(userProfileSelector);
  const [membersOptions, setMembersOptions] = useState([]);
  const [selectedMembersIdentifiers, setSelectedMembersIdentifiers] = useState(
    [],
  );
  const [, setSelectedMembers] = useState([]);
  const [isFetchingMembers, setIsFetchingMembers] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const enableLazyLoading = emrIntegrationEnabled && enabled;
  const isValueSendable = searchValue?.trim()?.length > 2;

  const filteredMembers = useMemo(
    () =>
      enableLazyLoading
        ? membersOptions
        : membersOptions?.filter(({ name, identifier }) => {
            const isSelected = selectedMembersIdentifiers.includes(identifier);
            return (
              !isSelected &&
              name.toLowerCase().startsWith(searchValue.toLowerCase()) &&
              identifier !== currentUser?.identifier
            );
          }),
    [
      enableLazyLoading,
      membersOptions,
      selectedMembersIdentifiers,
      searchValue,
      currentUser,
    ],
  );

  const filteredSelectedMembers = useMemo(
    () =>
      savedSelectedMembers?.filter(
        ({ identifier }) => identifier !== currentUser?.identifier,
      ),
    [savedSelectedMembers, currentUser],
  );

  const currentUserMember = useMemo(
    () =>
      membersOptions?.find(
        ({ identifier }) => identifier === currentUser?.identifier,
      ) || currentUser,
    [membersOptions, currentUser],
  );

  const inputReference = useRef(null);

  const selectMembersWithDebounce = useCallback(
    debounce(selection => {
      onSelect(selection.map(s => ({ ...s, userIdentifier: s.identifier })));
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
  }, [
    enableLazyLoading,
    onError,
    searchValue,
    isValueSendable,
    taskListIdentifiers,
  ]);

  useEffect(() => {
    (async () => {
      setSelectedMembersIdentifiers(
        savedSelectedMembers?.length > 0
          ? pluck('identifier', savedSelectedMembers)
          : [],
      );
      if (enableLazyLoading) {
        setSelectedMembers(
          savedSelectedMembers?.length > 0 ? savedSelectedMembers : [],
        );
      }
    })();
  }, [enableLazyLoading, savedSelectedMembers]);

  useEffect(() => {
    (async () => {
      if (!enableLazyLoading) {
        setIsFetchingMembers(true);
        setMembersOptions([]);
        try {
          const includeTaskListIdentifers = Array.isArray(taskListIdentifiers)
            ? taskListIdentifiers
            : [taskListIdentifiers];
          if (taskListIdentifiers?.length > 0) {
            const joinedMembers = await collectJoinedListMembers(
              includeTaskListIdentifers,
            );
            setMembersOptions(joinedMembers);
          } else {
            const organizationMembers = await OrganizationApi.getOrganizationUsersAndUserGroups();
            setMembersOptions(organizationMembers);
          }
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
      if (enableLazyLoading) {
        setSelectedMembers(previousSelection => {
          let membersToReturn;
          if (selectedOption === UNASSIGNED_KEY) {
            membersToReturn = [];
          } else if (
            previousSelection.find(
              ({ identifier }) => selectedOption?.identifier === identifier,
            )
          ) {
            membersToReturn = previousSelection.filter(
              ({ identifier }) => identifier !== selectedOption?.identifier,
            );
          } else {
            membersToReturn = [...previousSelection, selectedOption];
          }
          selectMembersWithDebounce(membersToReturn);
          return membersToReturn;
        });
      } else {
        setSelectedMembersIdentifiers(previousSelection => {
          let membersToReturn;
          if (selectedOption === ASSIGN_ALL_KEY) {
            membersToReturn = membersOptions;
          } else if (selectedOption === UNASSIGNED_KEY) {
            membersToReturn = [];
          } else if (previousSelection.includes(selectedOption?.identifier)) {
            const newlySelectedMembersIdentifiers = previousSelection.filter(
              id => id !== selectedOption?.identifier,
            );
            membersToReturn = membersOptions.filter(({ identifier }) =>
              newlySelectedMembersIdentifiers.includes(identifier),
            );
          } else {
            const newlySelectedMembersIdentifiers = [
              ...previousSelection,
              selectedOption?.identifier,
            ];
            membersToReturn = membersOptions.filter(({ identifier }) =>
              newlySelectedMembersIdentifiers.includes(identifier),
            );
          }
          selectMembersWithDebounce(membersToReturn);
          return pluck('identifier', membersToReturn);
        });
      }
    },
    [enableLazyLoading, membersOptions, selectMembersWithDebounce],
  );

  const displayUnassignedOption = 'unassigned'.includes(
    searchValue.toLowerCase(),
  );
  const displayAssignAllOption =
    'assign all'.includes(searchValue.toLowerCase()) && !enableLazyLoading;

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

  const displayCurrentUser = useMemo(() => {
    if (enableLazyLoading) {
      return !isValueSendable;
    }
    return currentUserMember?.name
      ?.toLowerCase()
      .includes(searchValue.toLowerCase());
  }, [currentUserMember, enableLazyLoading, isValueSendable, searchValue]);

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
        {(displayAssignAllOption || displayUnassignedOption) && (
          <ListContentSection>
            {displayUnassignedOption && (
              <MemberRow
                key={UNASSIGNED_KEY}
                isSelected={selectedMembersIdentifiers?.length === 0}
                onClick={event => handleOptionClick(event, UNASSIGNED_KEY)}
              >
                <CheckboxSpacing />
                <Spacing horizontal={3} />
                <UnassignedIcon />
                <Spacing horizontal={3} />
                <MemberName>
                  <Highlighter
                    highlightStyle={highlightStyle}
                    searchWords={searchValue?.toLowerCase().split(/\s+/)}
                    autoEscape
                    textToHighlight="Unassigned"
                  />
                </MemberName>
              </MemberRow>
            )}
            {displayAssignAllOption && (
              <>
                {!isFetchingMembers ? (
                  <MemberRow
                    key={ASSIGN_ALL_KEY}
                    isSelected={
                      selectedMembersIdentifiers?.length ===
                      membersOptions?.length
                    }
                    onClick={event => handleOptionClick(event, ASSIGN_ALL_KEY)}
                  >
                    <CheckboxSpacing />
                    <Spacing horizontal={3} />
                    <AssignMemberIcon />
                    <Spacing horizontal={3} />
                    <MemberName>
                      <Highlighter
                        highlightStyle={highlightStyle}
                        searchWords={searchValue?.toLowerCase().split(/\s+/)}
                        autoEscape
                        textToHighlight="Assign All"
                      />
                      ({membersOptions.length})
                    </MemberName>
                  </MemberRow>
                ) : (
                  <MemberRowSkeletonLoader />
                )}
              </>
            )}
          </ListContentSection>
        )}
        {displayCurrentUser &&
          (function renderCurrentUserOption() {
            const isSelected = selectedMembersIdentifiers.includes(
              currentUserMember?.identifier,
            );
            return renderSelectOption(currentUserMember, isSelected);
          })()}
        {!isValueSendable && (
          <ListContentSection>
            {filteredSelectedMembers?.map(member => {
              return renderSelectOption(member, true);
            })}
          </ListContentSection>
        )}
        {displayUsersList && (
          <ListContentSection>
            {!isFetchingMembers ? (
              filteredMembers?.map(member => renderSelectOption(member, false))
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

MultiAssignMembersList.propTypes = {
  taskListIdentifiers: oneOfType([string, arrayOf(string)]).isRequired,
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

MultiAssignMembersList.defaultProps = {
  onError: null,
};

export default MultiAssignMembersList;
