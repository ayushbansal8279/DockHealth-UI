import React, { useState, useRef, useCallback } from 'react';
import { func, arrayOf, string, objectOf, shape } from 'prop-types';
import AvatarFilterMember from 'components/user/AvatarFilterMember/AvatarFilterMember';
import Checkbox from 'components/common/Checkbox/Checkbox';
import Spacing from 'components/common/Spacing.tsx';
import { Box, ClickAwayListener } from '@material-ui/core';
import zIndex from 'styles/z-index';
import PopoverCard from 'components/common/PopoverCard/PopoverCard';
import {
  MemberRow,
  MemberName,
} from 'components/task/MultiAssignPopover/styled';
import {
  FilterOptionsCategory,
  isOptionSelected,
  selectFilterOption,
  unselectFilterOption,
} from 'helpers/filter-options-helpers';
import {
  ListContainer,
  ListContentSection,
  Arrow,
  StyledPopper,
  UserStatusLabel,
} from './styled';

const AdditionalMembersPopover = ({
  members,
  onSelectFilters,
  selectedFilters,
  children,
}) => {
  const elementReference = useRef();
  const [isOpen, setIsOpen] = useState(false);

  const toggleSelect = useCallback(
    (isSelected, { identifier }) => {
      if (isSelected) {
        onSelectFilters(
          unselectFilterOption(
            FilterOptionsCategory.ASSIGNED_TO,
            identifier,
            selectedFilters,
          ),
        );
      } else {
        onSelectFilters(
          selectFilterOption(
            FilterOptionsCategory.ASSIGNED_TO,
            identifier,
            selectedFilters,
          ),
        );
      }
    },
    [onSelectFilters, selectedFilters],
  );

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
                      const isSelected = isOptionSelected(
                        FilterOptionsCategory.ASSIGNED_TO,
                        member?.identifier,
                        selectedFilters,
                      );

                      return (
                        <MemberRow
                          key={member?.identifier}
                          isSelected={isSelected}
                          onClick={() => toggleSelect(isSelected, member)}
                        >
                          <Spacing horizontal={2} />
                          <Checkbox isChecked={isSelected} />
                          <Spacing horizontal={3} />
                          <AvatarFilterMember
                            member={member}
                            hideTooltip
                            isSelected={isSelected}
                          />
                          <Spacing horizontal={3} />
                          <MemberName>{member?.name}</MemberName>
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

AdditionalMembersPopover.propTypes = {
  members: arrayOf(
    shape({
      identifier: string,
      firstName: string,
      lastName: string,
      initials: string,
      profileThumbnailPictureHash: string,
    }),
  ).isRequired,
  onSelectFilters: func.isRequired,
  selectedFilters: objectOf(arrayOf(string)).isRequired,
};

export default AdditionalMembersPopover;
