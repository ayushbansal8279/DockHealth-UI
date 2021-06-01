import React, { useState, useMemo } from 'react';
import SelectorPopover from 'components/common/SelectorPopover/SelectorPopover';
import { setSearchValue } from 'actions/global-search-actions';
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

  const filteredOptions = useMemo(() => {
    // eslint-disable-next-line unicorn/prevent-abbreviations
    const filteredOpts = options.filter(item =>
      item.toLowerCase().includes(searchOption.toLowerCase()),
    );

    if (filteredOpts.length === 0 && searchOption !== '') return [searchOption];

    return filteredOpts;
  }, [options, searchOption]);

  const onSearchChange = event => {
    event.preventDefault();
    setSearchOption(event.target.value);
  };

  const renderHeader = () => (
    <StyledInput
      onChange={onSearchChange}
      value={searchOption}
      key="search"
      type="text"
      name="search"
      placeholder="Search or add custom"
    />
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
      {item}
    </PickerItem>
  );

  const onClosePopover = () => {
    onClose();
    setSearchValue('');
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
    />
  );
};

export default OnboardingQuestionsPicker;
