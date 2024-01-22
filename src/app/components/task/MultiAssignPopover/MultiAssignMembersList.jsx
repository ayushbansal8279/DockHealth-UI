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
import MagnifierIcon from 'img/magnifier.svg';
import Checkbox from 'components/common/Checkbox/Checkbox';
import Spacing from 'components/common/Spacing';
import { useSelector } from 'react-redux';
import {
  userProfileSelector,
  selectedUserOrganizationSelector,
} from 'selectors/user-selectors';
import AssignMemberIcon from 'components/user/AssignMemberIcon/AssingMemberIcon';
import { isUserGroup } from 'helpers/user-helper';
import GroupAvatar from 'components/user/GroupAvatar/GroupAvatar';
import { getUsersByName } from 'api/user-api';
import { organizationSelector } from 'selectors/organization-selectors';
import Button from 'components/common/v2/Button/Button';
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
  StyledYouBadge,
} from './styled';
import { collectJoinedListMembers } from './helpers';

const UNASSIGNED_KEY = 'UNASSIGNED';
const ASSIGN_ALL_KEY = 'ASSIGN_ALL';

const YouBadge = () => {
  return <StyledYouBadge>You</StyledYouBadge>;
};

const MultiAssignMembersList = ({
  taskListIdentifiers,
  selectedMembers: savedSelectedMembers,
  onSelect,
  onError,
  enableLazyLoading: enabled,
  additionalMembers,
  // eslint-disable-next-line sonarjs/cognitive-complexity
}) => {
  const { emrIntegrationEnabled } = useSelector(organizationSelector);
  const currentUser = useSelector(userProfileSelector);
  const currentOrganization = useSelector(selectedUserOrganizationSelector);
  const [membersOptions, setMembersOptions] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [isFetchingMembers, setIsFetchingMembers] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const enableLazyLoading = emrIntegrationEnabled && enabled;
  const isValueSendable = searchValue?.trim()?.length > 2;
  const memberAssignAllEnabledItem =
    currentOrganization?.themeSettings?.find(
      ({ name }) => name === 'member.assignall.enabled',
    ) || {};
  const memberAssignAllEnabled = memberAssignAllEnabledItem?.value !== 'false';

  const filteredMembers = useMemo(
    () =>
      enableLazyLoading
        ? membersOptions.map((user) => {
            const { identifier } = user;
            const isSelected = !!selectedMembers.some(
              ({ identifier: id }) => id === identifier,
            );
            return { ...user, isSelected };
          })
        : membersOptions?.filter(({ name, identifier }) => {
            const isSelected = !!selectedMembers.some(
              ({ identifier: id }) => id === identifier,
            );
            return (
              !isSelected &&
              name.toLowerCase().startsWith(searchValue.toLowerCase()) &&
              identifier !== currentUser?.identifier
            );
          }),
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
    setSelectedMembers([...savedSelectedMembers]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const currentUserMember = useMemo(
    () =>
      membersOptions?.find(
        ({ identifier }) => identifier === currentUser?.identifier,
      ) || currentUser,
    [membersOptions, currentUser],
  );

  const inputReference = useRef(null);

  const selectMembersWithDebounce = useCallback(
    debounce((selection) => {
      onSelect(selection.map((s) => ({ ...s, userIdentifier: s.identifier })));
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
          setMembersOptions(
            additionalMembers ? members.concat(additionalMembers) : members,
          );
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
    additionalMembers,
  ]);

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
            setMembersOptions(
              additionalMembers
                ? joinedMembers.concat(additionalMembers)
                : joinedMembers,
            );
          } else {
            const organizationMembers =
              await OrganizationApi.getOrganizationUsersAndUserGroups();
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
      // selectMembersWithDebounce(membersToReturn);
      setSelectedMembers(membersToReturn);
    },
    [membersOptions, selectMembersWithDebounce, selectedMembers],
  );

  const handleOptionSendClick = () => {
    selectMembersWithDebounce(selectedMembers);
  };

  const displayUnassignedOption = 'unassigned'.includes(
    searchValue.toLowerCase(),
  );
  const displayAssignAllOption =
    memberAssignAllEnabled &&
    'assign all'.includes(searchValue.toLowerCase()) &&
    !enableLazyLoading;

  const displayUsersList = useMemo(() => {
    if (enableLazyLoading) return isValueSendable;
    return filteredMembers.length > 0 || isFetchingMembers;
  }, [
    enableLazyLoading,
    filteredMembers.length,
    isFetchingMembers,
    isValueSendable,
  ]);

  const renderSelectOption = useCallback(
    (member, isSelected, extra) => {
      return (
        <MemberRow
          key={member?.identifier}
          isSelected={isSelected}
          onClick={(event) => handleOptionClick(event, member)}
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
          {extra}
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
          onChange={(event) => setSearchValue(event.target.value)}
        />
      </InputBox>
      <ListContainer>
        {(displayAssignAllOption || displayUnassignedOption) && (
          <ListContentSection>
            {displayCurrentUser &&
              (function renderCurrentUserOption() {
                const isSelected = !!selectedMembers.some(
                  ({ identifier }) =>
                    identifier === currentUserMember?.identifier,
                );
                return renderSelectOption(
                  currentUserMember,
                  isSelected,
                  <YouBadge />,
                );
              })()}
            {displayUnassignedOption && (
              <MemberRow
                key={UNASSIGNED_KEY}
                isSelected={selectedMembers?.length === 0}
                onClick={(event) => handleOptionClick(event, UNASSIGNED_KEY)}
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
            {displayAssignAllOption && membersOptions?.length > 0 && (
              <>
                {isFetchingMembers ? (
                  <MemberRowSkeletonLoader />
                ) : (
                  <MemberRow
                    key={ASSIGN_ALL_KEY}
                    isSelected={
                      selectedMembers?.length === membersOptions?.length
                    }
                    onClick={(event) =>
                      handleOptionClick(event, ASSIGN_ALL_KEY)
                    }
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
                      &nbsp;({+membersOptions.length})
                    </MemberName>
                  </MemberRow>
                )}
              </>
            )}
          </ListContentSection>
        )}
        {!isValueSendable && filteredSelectedMembers.length > 0 && (
          <ListContentSection>
            {filteredSelectedMembers?.map((member) => {
              return renderSelectOption(member, true);
            })}
          </ListContentSection>
        )}
        {displayUsersList && (
          <ListContentSection>
            {isFetchingMembers ? (
              <>
                {Array.from({ length: 4 })
                  .fill()
                  .map((_, index) => (
                    // eslint-disable-next-line react/no-array-index-key
                    <MemberRowSkeletonLoader key={index} />
                  ))}
              </>
            ) : (
              filteredMembers?.map((member) =>
                renderSelectOption(member, member.isSelected),
              )
            )}
          </ListContentSection>
        )}
        {isValueSendable &&
          !isFetchingMembers &&
          filteredMembers.length === 0 && (
            <NoRecordsText>No users found</NoRecordsText>
          )}
        <div style={{ padding: '16px' }}>
          <Button variant="primary-red" onClick={handleOptionSendClick}>
            Apply
          </Button>
        </div>
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
  additionalMembers: arrayOf(
    shape({
      identifier: string,
      firstName: string,
      lastName: string,
      initials: string,
      profileThumbnailPictureHash: string,
    }),
  ),
};

MultiAssignMembersList.defaultProps = {
  onError: null,
};

export default MultiAssignMembersList;
