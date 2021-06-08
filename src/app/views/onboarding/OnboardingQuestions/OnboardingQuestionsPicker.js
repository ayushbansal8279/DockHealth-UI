import React, { useState, useMemo, useCallback } from 'react';
import SelectorPopover from 'components/common/SelectorPopover/SelectorPopover';
import Checkbox from 'components/common/Checkbox/Checkbox';
import Spacing from 'components/common/Spacing';
import { PickerItem, StyledInput } from './styled';

const OnboardingQuestionsPicker = ({
  questionReference,
  options,
  isOpen,
  onClose,
  onSelect,
  isSingleChoice,
  selectedOptions,
}) => {
  const [searchOption, setSearchOption] = useState('');

  const filteredAvailableOptions = useMemo(
    () =>
      options.filter(item =>
        item.toLowerCase().includes(searchOption.toLowerCase()),
      ),
    [options, searchOption],
  );

  const filteredOptions = useMemo(() => {
    if (filteredAvailableOptions.length === 0 && searchOption !== '')
      return [searchOption];

    return filteredAvailableOptions;
  }, [filteredAvailableOptions, searchOption]);

  const onSearchChange = event => {
    event.preventDefault();
    setSearchOption(event.target.value);
  };

  const renderHeader = useCallback(
    () => (
      <StyledInput
        onChange={onSearchChange}
        value={searchOption}
        key="search"
        type="text"
        placeholder="Search or add custom"
        autocomplete="false"
        onKeyDown={event => {
          if (event.key === 'Enter') {
            if (filteredAvailableOptions.length === 0 && searchOption !== '')
              onSelect(searchOption);

            if (filteredAvailableOptions.length !== 0 && searchOption !== '')
              onSelect(filteredAvailableOptions[0]);
          }
        }}
      />
    ),
    [filteredAvailableOptions, onSelect, searchOption],
  );

  const renderItem = item => (
    <PickerItem
      onClick={() => {
        onSelect(item);

        if (isSingleChoice) {
          onClose();
        }
      }}
    >
      <Checkbox
        isChecked={selectedOptions.includes(item)}
        isCircle={isSingleChoice}
        size={12}
      />
      <Spacing horizontal={3} />
      <span>{item}</span>
    </PickerItem>
  );

  const onClosePopover = () => {
    setSearchOption('');
    onClose();
  };

  return (
    <SelectorPopover
      anchorEl={questionReference?.current}
      anchorOrigin={{
        vertical: 'bottom',
      }}
      transformOrigin={{
        vertical: 'top',
      }}
      renderItem={renderItem}
      renderHeader={renderHeader}
      onClose={onClosePopover}
      open={isOpen}
      items={filteredOptions}
      listMaxHeight="400px"
      width="320px"
    />
  );
};

export default OnboardingQuestionsPicker;
