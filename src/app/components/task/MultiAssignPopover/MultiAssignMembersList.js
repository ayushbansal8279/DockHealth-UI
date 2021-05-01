import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from 'react';
import Highlighter from 'react-highlight-words';
import * as PeopleApi from 'api/people-api';
import { arrayOf, func, oneOfType, shape, string } from 'prop-types';
import debounce from 'lodash.debounce';
import Member from 'components/members/Member/Member';
import MagnifierIcon from 'img/magnifier';
import Checkbox from 'components/common/Checkbox/Checkbox';
import Spacing from 'components/common/Spacing';
import { pluck } from 'ramda';
import { useSelector } from 'react-redux';
import { userProfileSelector } from 'selectors/user-selectors';
import AssignMemberIcon from 'components/members/AssignMemberIcon/AssingMemberIcon';
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
} from './styled';
import { collectJoinedListMembers } from './helpers';

const UNASSIGNED_KEY = 'UNASSIGNED';
const ASSIGN_ALL_KEY = 'ASSIGN_ALL';

const MultiAssignMembersList = ({
  taskListIdentifiers,
  selectedMembers: savedSelectedMembers,
  onSelect,
  onError,
  // eslint-disable-next-line sonarjs/cognitive-complexity
}) => {
  const currentUser = useSelector(userProfileSelector);
  const [membersOptions, setMembersOptions] = useState([]);
  const [selectedMembersIdentifiers, setSelectedMembersIdentifiers] = useState(
    [],
  );
  const [isFetchingMembers, setIsFetchingMembers] = useState(true);
  const [searchValue, setSearchValue] = useState('');

  const filteredMembers = useMemo(
    () =>
      membersOptions?.filter(
        ({ userName, userIdentifier }) =>
          userName.toLowerCase().startsWith(searchValue.toLowerCase()) &&
          userIdentifier !== currentUser?.userIdentifier,
      ),
    [searchValue, currentUser, membersOptions],
  );

  const currentUserMember = useMemo(
    () =>
      membersOptions?.find(
        ({ userIdentifier }) => userIdentifier === currentUser?.userIdentifier,
      ) || currentUser,
    [membersOptions, currentUser],
  );

  const inputReference = useRef(null);

  const selectMembersWithDebounce = useCallback(
    debounce(selection => {
      onSelect(selection);
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
      setIsFetchingMembers(true);
      setMembersOptions([]);
      setSelectedMembersIdentifiers(
        savedSelectedMembers?.length > 0
          ? pluck('userIdentifier', savedSelectedMembers)
          : [],
      );
      const includeTaskListIdentifers = Array.isArray(taskListIdentifiers)
        ? taskListIdentifiers
        : [taskListIdentifiers];
      try {
        if (taskListIdentifiers?.length > 0) {
          const joinedMembers = await collectJoinedListMembers(
            includeTaskListIdentifers,
          );
          setMembersOptions(joinedMembers);
        } else {
          const organizationMembers = await PeopleApi.findAllUsersByOrganizationId();
          setMembersOptions(organizationMembers);
        }
      } catch (error) {
        if (typeof onError === 'function') onError(error);
      }

      setIsFetchingMembers(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const handleOptionClick = (event, selectedOption) => {
    event.stopPropagation();

    setSelectedMembersIdentifiers(previousSelection => {
      let membersToReturn;
      if (selectedOption === ASSIGN_ALL_KEY) {
        membersToReturn = membersOptions;
      } else if (selectedOption === UNASSIGNED_KEY) {
        membersToReturn = [];
      } else if (previousSelection.includes(selectedOption?.userIdentifier)) {
        const newlySelectedMembersIdentifiers = previousSelection.filter(
          id => id !== selectedOption?.userIdentifier,
        );
        membersToReturn = membersOptions.filter(({ userIdentifier }) =>
          newlySelectedMembersIdentifiers.includes(userIdentifier),
        );
      } else {
        const newlySelectedMembersIdentifiers = [
          ...previousSelection,
          selectedOption?.userIdentifier,
        ];
        membersToReturn = membersOptions.filter(({ userIdentifier }) =>
          newlySelectedMembersIdentifiers.includes(userIdentifier),
        );
      }
      selectMembersWithDebounce(membersToReturn);
      return pluck('userIdentifier', membersToReturn);
    });
  };

  const displayUnassignedOption = 'unassigned'.includes(
    searchValue.toLowerCase(),
  );
  const displayAssignAllOption = 'assign all'.includes(
    searchValue.toLowerCase(),
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
                      />{' '}
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
        {currentUserMember?.userName
          ?.toLowerCase()
          .includes(searchValue.toLowerCase()) &&
          (function renderCurrentUserOption() {
            const isSelected = selectedMembersIdentifiers.includes(
              currentUserMember?.userIdentifier,
            );

            return (
              <ListContentSection>
                <MemberRow
                  key={currentUserMember?.userIdentifier}
                  isSelected={isSelected}
                  onClick={event => handleOptionClick(event, currentUserMember)}
                >
                  <Checkbox isChecked={isSelected} />
                  <Spacing horizontal={3} />
                  <Member member={currentUserMember} showTooltip={false} />
                  <Spacing horizontal={3} />
                  <MemberName>
                    <Highlighter
                      highlightStyle={highlightStyle}
                      searchWords={searchValue?.toLowerCase().split(/\s+/)}
                      autoEscape
                      textToHighlight={currentUserMember?.userName}
                    />
                  </MemberName>
                </MemberRow>
              </ListContentSection>
            );
          })()}
        <ListContentSection>
          {!isFetchingMembers ? (
            filteredMembers?.map(member => {
              const isSelected = selectedMembersIdentifiers.includes(
                member?.userIdentifier,
              );

              return (
                <MemberRow
                  key={member?.userIdentifier}
                  isSelected={isSelected}
                  onClick={event => handleOptionClick(event, member)}
                >
                  <Checkbox isChecked={isSelected} />
                  <Spacing horizontal={3} />
                  <Member member={member} showTooltip={false} />
                  <Spacing horizontal={3} />
                  <MemberName>
                    <Highlighter
                      highlightStyle={highlightStyle}
                      searchWords={searchValue?.toLowerCase().split(/\s+/)}
                      autoEscape
                      textToHighlight={member?.userName}
                    />
                  </MemberName>
                </MemberRow>
              );
            })
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
    </>
  );
};

MultiAssignMembersList.propTypes = {
  taskListIdentifiers: oneOfType([string, arrayOf(string)]).isRequired,
  selectedMembers: arrayOf(
    shape({
      userIdentifier: string,
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
