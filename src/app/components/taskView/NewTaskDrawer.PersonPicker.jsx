import { props as getProps } from 'ramda';
import React, { useEffect, useState } from 'react';
import { useMount, useToggle } from 'react-use';
import SimpleBar from 'simplebar-react';
import styled from 'styled-components';
import useBoolean from '../../hooks/useBoolean';
import PersonPickerCrossIcon from '../../img/person-picker-cross.svg';
import SearchHeadsupIcon from '../../img/search-headsup.svg';

const PersonPickerContainer = styled.div`
  background-color: #f3f5f6;
  margin-top: 0.5rem;
  width: 100%;
`;

const PersonPickerTopSectionContainer = styled.div`
  align-items: center;
  display: flex;
  height: 3.5625rem;
  justify-content: space-between;
  padding: 0 1.125rem;
`;

const PersonPickerIconsContainer = styled.div`
  align-items: center;
  display: flex;

  > div {
    margin-left: 0.75rem;
  }
`;

const PersonPickerTopSectionLabel = styled.div`
  color: #303538;
  font-size: 1rem;
`;

const PersonPickerDivider = styled.div`
  height: 1px;
  background-color: #dedee2;
`;

const PersonPickerIconContainer = styled.div`
  cursor: pointer;
  height: ${props => props.size ?? '1.5rem'};
  width: ${props => props.size ?? '1.5rem'};

  > img {
    height: 100%;
    object-fit: contain;
    width: 100%;
  }

  ${props =>
    (props.startAdornment || props.endAdornment) &&
    `
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
  `}

  ${props => props.startAdornment && 'left: 0.5rem;'}

  ${props => props.endAdornment && 'right: 0.375rem;'}

  ${props => props.disallowClicking && 'pointer-events: none;'}
`;

const PersonPickerSearchFieldContainer = styled.div`
  height: 2.375rem;
  margin-right: 0.75rem;
  position: relative;
  width: 100%;
`;

const PersonPickerSearchField = styled.input`
  background-color: #fff;
  border: none;
  box-shadow: none;
  font-size: 0.875rem;
  height: 100%;
  padding-left: 2.5rem;
  padding-right: 1.875rem;
  outline: none;
  width: 100%;

  &::placeholder {
    color: #dedee2;
  }
`;

const StyledSimpleBar = styled(SimpleBar)`
  & .simplebar-scrollbar::before,
  & .simplebar-scrollbar.simplebar-visible::before {
    background-color: #c8c8ce;
    opacity: ${props => (props.visible ? 1 : 0)};
  }

  & .simplebar-track.simplebar-vertical {
    background-color: white;
    border-radius: 0.5rem;
    margin: 0.5rem 0.5rem 0.5rem 0;
  }
`;

const AddNewPersonLabel = styled.div`
  align-items: center;
  color: #0ca1c7;
  cursor: pointer;
  display: flex;
  font-size: 0.875rem;
  height: 2.8125rem;
  padding-left: 1.125rem;
  transition: all 0.25s ease-out;

  ${props =>
    props.button &&
    `
    &:hover {
      filter: brightness(1.25);
    }
  `}
`;

const AddingPersonFormContainer = styled.div`
  padding: 1rem;
`;

const SimpleBarComponent = ({
  filteredItems,
  renderItem,
  renderNoItems,
  maxPeopleRecordsVisible,
  maxPeopleContainerHeight,
}) => {
  const [simpleBarItemsVisible, setSimpleBarItemsVisible] = useBoolean(false);

  useEffect(setSimpleBarItemsVisible, []);

  return (
    <StyledSimpleBar
      visible={
        filteredItems.length > maxPeopleRecordsVisible ? 'true' : 'false'
      }
      style={{ maxHeight: maxPeopleContainerHeight }}
    >
      {simpleBarItemsVisible && (
        <>
          {renderNoItems()}
          {filteredItems.length > 0 && filteredItems.map(renderItem)}
        </>
      )}
    </StyledSimpleBar>
  );
};

export default ({
  showAddNewPersonLabel = false,
  addNewPersonLabel = '',
  addingNewPersonLabel = '',
  closePicker,
  items,
  itemFilterPropertyKeys,
  label,
  maxPeopleRecordsVisible,
  renderItem,
  renderNoItems,
  handlePersonSelect,
  personRecordHeightInRem,
  AddingPersonForm,
}) => {
  const [isSearching, toggleIsSearching] = useToggle(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [addingNewPerson, toggleAddingNewPerson] = useToggle(false);

  const maxPeopleContainerHeight = `${maxPeopleRecordsVisible *
    personRecordHeightInRem}rem`;

  const clearSearchTerm = () => {
    setSearchTerm('');
  };

  useMount(() => {
    toggleIsSearching(true);
  });

  const onClosePicker = () => {
    clearSearchTerm();
    closePicker();
  };

  const onSearchChange = event => {
    setSearchTerm(event.target?.value);
  };

  const filteredItems = items.filter(item => {
    const properties = getProps(itemFilterPropertyKeys, item);

    return properties.some(property =>
      property?.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  });

  const simpleBarComponentProps = {
    filteredItems,
    renderItem,
    renderNoItems,
    maxPeopleRecordsVisible,
    maxPeopleContainerHeight,
  };

  return (
    <PersonPickerContainer>
      {addingNewPerson ? (
        <>
          <PersonPickerTopSectionContainer>
            <PersonPickerTopSectionLabel>
              {addingNewPersonLabel}
            </PersonPickerTopSectionLabel>
          </PersonPickerTopSectionContainer>
          <PersonPickerDivider />
          <AddingPersonFormContainer>
            <AddingPersonForm
              closePicker={closePicker}
              handlePersonSelect={handlePersonSelect}
              toggleAddingNewPerson={toggleAddingNewPerson}
            />
          </AddingPersonFormContainer>
        </>
      ) : (
        <>
          <PersonPickerTopSectionContainer>
            {isSearching ? (
              <PersonPickerSearchFieldContainer>
                <PersonPickerSearchField
                  autoFocus
                  onChange={onSearchChange}
                  placeholder="Search"
                  value={searchTerm}
                />
                <PersonPickerIconContainer startAdornment disallowClicking>
                  <img src={SearchHeadsupIcon} alt="Search icon" />
                </PersonPickerIconContainer>
                <PersonPickerIconContainer
                  endAdornment
                  onClick={clearSearchTerm}
                  size="1rem"
                >
                  <img src={PersonPickerCrossIcon} alt="Cross icon" />
                </PersonPickerIconContainer>
              </PersonPickerSearchFieldContainer>
            ) : (
              <PersonPickerTopSectionLabel>{label}</PersonPickerTopSectionLabel>
            )}

            <PersonPickerIconsContainer>
              {!isSearching && (
                <PersonPickerIconContainer onClick={toggleIsSearching}>
                  <img src={SearchHeadsupIcon} alt="Search icon" />
                </PersonPickerIconContainer>
              )}
              <PersonPickerIconContainer onClick={onClosePicker}>
                <img src={PersonPickerCrossIcon} alt="Cross icon" />
              </PersonPickerIconContainer>
            </PersonPickerIconsContainer>
          </PersonPickerTopSectionContainer>

          <PersonPickerDivider />
          <SimpleBarComponent {...simpleBarComponentProps} />

          {showAddNewPersonLabel && (
            <>
              <PersonPickerDivider />
              <AddNewPersonLabel button onClick={toggleAddingNewPerson}>
                {addNewPersonLabel}
              </AddNewPersonLabel>
            </>
          )}
        </>
      )}
    </PersonPickerContainer>
  );
};
