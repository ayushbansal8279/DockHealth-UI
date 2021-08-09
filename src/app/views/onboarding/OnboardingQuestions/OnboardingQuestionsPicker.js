import React, { useState, useMemo, useCallback, useEffect } from 'react';
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
  topOffset = 0,
  useGlobalPosition = false,
  // eslint-disable-next-line sonarjs/cognitive-complexity
}) => {
  const [searchOption, setSearchOption] = useState('');

  const [popoverPosition, setPopoverPosition] = useState({
    vertical: 0,
    horizontal: 0,
  });

  useEffect(() => {
    if (useGlobalPosition) {
      const { offsetLeft, offsetTop } = questionReference?.current;
      setPopoverPosition({
        horizontal: offsetLeft,
        vertical: offsetTop + topOffset,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

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
      anchorEl={!useGlobalPosition && questionReference?.current}
      anchorPosition={useGlobalPosition && popoverPosition}
      transformOrigin={!useGlobalPosition && { vertical: 'top' }}
      anchorOrigin={
        useGlobalPosition ? popoverPosition : { vertical: 'bottom' }
      }
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
