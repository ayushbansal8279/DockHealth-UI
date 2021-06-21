import React, { useState, useRef } from 'react';
import { func, arrayOf, string, objectOf, object } from 'prop-types';
import AvatarFilterMember from 'components/members/AvatarFilterMember/AvatarFilterMember';
import Checkbox from 'components/common/Checkbox/Checkbox';
import Spacing from 'components/common/Spacing';
import { Box, ClickAwayListener } from '@material-ui/core';
import zIndex from 'styles/z-index';
import PopoverCard from 'components/common/PopoverCard/PopoverCard';
import {
  ListContainer,
  MemberRow,
  MemberName,
  ListContentSection,
  Arrow,
  StyledPopper,
  UserStatusLabel,
} from './styled';

const filterName = 'assignedTo';

const MultiAssignMembersList = ({
  members,
  onSelectFilters,
  selectedFilters,
  children,
}) => {
  const elementReference = useRef();
  const [isOpen, setIsOpen] = useState(false);

  const toggleSelect = (isSelected, { userIdentifier }) => {
    if (isSelected) {
      const filteredWithoutTheSelectedOne = selectedFilters?.[
        filterName
      ]?.filter(userId => userId !== userIdentifier);
      onSelectFilters({
        ...selectedFilters,
        [filterName]: [...filteredWithoutTheSelectedOne],
      });
    } else {
      onSelectFilters({
        ...selectedFilters,
        [filterName]: [...selectedFilters[filterName], userIdentifier],
      });
    }
  };
  return (
    <>
      <div onClick={() => setIsOpen(true)} ref={elementReference}>
        {children}
      </div>
      {isOpen && (
        <ClickAwayListener onClickAway={() => setIsOpen(false)}>
          <StyledPopper
            style={{ zIndex: zIndex.taskPopover }}
            anchorEl={elementReference?.current}
            open
            onClose={() => setIsOpen(false)}
          >
            <Box>
              <PopoverCard>
                <Arrow />
                <ListContainer>
                  <ListContentSection>
                    {members?.map(member => {
                      const isSelected = selectedFilters?.assignedTo?.includes(
                        member?.userIdentifier,
                      );
                      return (
                        <MemberRow
                          key={member?.userIdentifier}
                          isSelected={isSelected}
                          onClick={() => toggleSelect(isSelected, member)}
                        >
                          <Spacing horizontal={2} />
                          <Checkbox isChecked={isSelected} />
                          <Spacing horizontal={3} />
                          <AvatarFilterMember
                            member={member}
                            showTooltip={false}
                            isSelected={isSelected}
                          />
                          <Spacing horizontal={3} />
                          <MemberName>{member?.userName}</MemberName>
                          <Spacing horizontal={3} />
                          <UserStatusLabel>
                            {member?.userStatusLabel}
                          </UserStatusLabel>
                        </MemberRow>
                      );
                    })}
                  </ListContentSection>
                </ListContainer>
              </PopoverCard>
            </Box>
          </StyledPopper>
        </ClickAwayListener>
      )}
    </>
  );
};

MultiAssignMembersList.propTypes = {
  members: arrayOf(object).isRequired,
  onSelectFilters: func.isRequired,
  selectedFilters: objectOf(arrayOf(string)).isRequired,
};

export default MultiAssignMembersList;
