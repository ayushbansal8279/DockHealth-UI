import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from 'react';
import Highlighter from 'react-highlight-words';
import { arrayOf, func, shape, string } from 'prop-types';
import debounce from 'lodash.debounce';
import UserAvatar from 'components/user/UserAvatar/UserAvatar';
import Checkbox from 'components/common/Checkbox/Checkbox';
import Spacing from 'components/common/Spacing';
import { useSelector } from 'react-redux';
import { userProfileSelector } from 'selectors/user-selectors';
import { isUserGroup } from 'helpers/user-helper';
import GroupAvatar from 'components/user/GroupAvatar/GroupAvatar';
import { organizationSelector } from 'selectors/organization-selectors';
import {
  ListContainer,
  MemberRow,
  MemberName,
  ListContentSection,
  MemberRowSkeletonLoader,
  highlightStyle,
  NoRecordsText,
  SectionHeader,
} from './styled';

const SharedMembersList = ({
  selectedMembers: savedSelectedMembers,
  onSelect,
  // onError,
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

  useEffect(() => {
    setSelectedMembers([...savedSelectedMembers]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [savedSelectedMembers]);

  const inputReference = useRef(null);

  const selectMembersWithDebounce = useCallback(
    debounce((selection) => {
      onSelect(selection.map((s) => ({ ...s, userIdentifier: s.identifier })));
      // eslint-disable-next-line no-unused-expressions
      inputReference.current?.focus();
    }, 300),
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
      if (!enableLazyLoading) {
        setIsFetchingMembers(true);
        setMembersOptions([]);
        setIsFetchingMembers(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleOptionClick = useCallback(
    (event, selectedOption) => {
      event.stopPropagation();
      // eslint-disable-next-line unicorn/prefer-array-some
      const membersToReturn = selectedMembers.find(
        ({ identifier }) => selectedOption?.identifier === identifier,
      )
        ? selectedMembers.filter(
            ({ identifier }) => identifier !== selectedOption?.identifier,
          )
        : [...selectedMembers, selectedOption];
      selectMembersWithDebounce(membersToReturn);
      setSelectedMembers(membersToReturn);
    },
    [selectMembersWithDebounce, selectedMembers],
  );

  const displayUsersList = useMemo(() => {
    return filteredMembers.length > 0 || isFetchingMembers;
  }, [filteredMembers.length, isFetchingMembers]);

  const renderSelectOption = useCallback(
    (member, isSelected) => {
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
        </MemberRow>
      );
    },
    [handleOptionClick, searchValue],
  );

  return (
    <>
      <ListContainer>
        <SectionHeader>Shared with</SectionHeader>
        <ListContentSection>
          {selectedMembers?.map((member) => {
            return renderSelectOption(member, true);
          })}
        </ListContentSection>
        {/* )} */}
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
        {selectedMembers?.length === 0 && <NoRecordsText>None</NoRecordsText>}
      </ListContainer>
    </>
  );
};

SharedMembersList.propTypes = {
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
  // onError: func,
};

SharedMembersList.defaultProps = {
  // onError: null,
};

export default SharedMembersList;
