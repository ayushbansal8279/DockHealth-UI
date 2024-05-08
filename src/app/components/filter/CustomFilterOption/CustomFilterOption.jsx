import React, { useCallback, useEffect, useRef, useState } from 'react';
import OptionsMenu from 'components/common/OptionsMenu/OptionsMenu';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import {
  CustomFilterOptionWrapper,
  OptionMenuContainer,
  QuickFilterTitle,
  QuickFilterTitleContainer,
} from './styled';

const CustomFilterOption = (props) => {
  const {
    identifier,
    label = '',
    onOptionClick,
    disabled = true,
    disableOptions = false,
    onDelete,
    autofocus,
    onBlur,
    editModeEnabled,
    setSavePopupOpen,
    selectedQuickFilter,
    setEditIdentifier,
    filter,
    filters,
    setCustomFinalFilter,
    setSelectedQuickFilter,
    onQuickFilterCreate,
    clearFilters,
    setSelectedCustomFilter,
    isPatientListPage,
    handleQuickFilterDuplicateForPatientList,
  } = props;
  const [value, setValue] = useState(label);
  const [isSelected, setSelected] = useState(false);
  const inputReference = useRef(null);

  useEffect(() => {
    setSelected(selectedQuickFilter === identifier);
  }, [selectedQuickFilter, identifier]);

  useEffect(() => {
    setValue(label);
  }, [label, identifier]);

  useEffect(() => {
    if (autofocus && inputReference?.current) {
      inputReference.current.focus();
    }
  }, [autofocus]);

  useEffect(() => {
    if (!disabled) {
      inputReference.current.focus();
    }
  }, [disabled]);

  const handleDelete = useCallback(
    (event) => {
      event.preventDefault();
      event.stopPropagation();
      onDelete(identifier);
    },
    [identifier, onDelete],
  );

  const handleEnableEditMode = () => {
    setSavePopupOpen(true);
    setEditIdentifier(identifier);

    let selectedOptions = filter.selectedOptions;

    if (
      isPatientListPage &&
      filter.patientSelectedOptions.customFields.length !== 0
    ) {
      selectedOptions = {};
      filter.patientSelectedOptions.customFields.forEach((element) => {
        selectedOptions[element.customFieldIdentifier] = {
          options: element.selectedOptionIdentifiers,
        };
      });
    }

    const data = {};
    for (const key in selectedOptions) {
      const users = filters
        .flatMap((item) => item.id === key && item.options)
        .filter((item) => typeof item !== 'boolean');
      data[key] = selectedOptions[key].options.map((item) =>
        users.find((user) => user.key === item),
      );
    }
    setCustomFinalFilter(data);
    setSelectedCustomFilter(data);
  };

  const handleDuplicate = () => {
    if (
      isPatientListPage &&
      filter.patientSelectedOptions.customFields.length !== 0
    ) {
      const selectedOptions = {};
      filter.patientSelectedOptions.customFields.forEach((element) => {
        selectedOptions[element.customFieldIdentifier] = {
          options: element.selectedOptionIdentifiers,
        };
      });
      console.log(selectedOptions);
      handleQuickFilterDuplicateForPatientList(
        'Copy of ' + filter.name,
        selectedOptions,
      );
    } else {
      onQuickFilterCreate('Copy of ' + filter.name, filter.selectedOptions);
    }
  };

  const OPTIONS = [
    { name: 'Edit', onClick: handleEnableEditMode },
    { name: 'Duplicate', onClick: handleDuplicate },
    { name: 'Delete', onClick: handleDelete },
  ];

  const handleOptionClick = useCallback(() => {
    onOptionClick(identifier);
    if (isSelected) {
      setSelected(false);
      setSelectedQuickFilter('');
      clearFilters();
    }
  }, [identifier, onOptionClick, isSelected]);

  const handleKeyPress = useCallback(
    (event) => {
      const { key } = event;

      switch (key) {
        case 'Enter': {
          onBlur(identifier, value);
          break;
        }
        case 'Escape': {
          break;
        }
        default: {
          break;
        }
      }
    },
    [identifier, onBlur, value],
  );

  return (
    <CustomFilterOptionWrapper
      selected={isSelected}
      editModeEnabled={editModeEnabled}
    >
      <QuickFilterTitleContainer>
        <QuickFilterTitle
          selected={isSelected}
          onClick={() => handleOptionClick()}
        >
          {value}
        </QuickFilterTitle>
        {/* <Input
        onKeyPress={handleKeyPress}
        inputRef={inputReference}
        readOnly={disabled}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        InputProps={{ disableUnderline: true }}
        onBlur={() => !disabled && onBlur(identifier, value)}
        onClick={() => handleOptionClick()}
      /> */}
        {/* <IconContainer>
        <Tooltip placement="top" title={'Rename'}>
          <img
            onClick={handleEnableEditMode}
            style={{
              width: '19px',
              margin: '2px 4px',
            }}
            src={RenameIcon}
            alt="close"
          />
        </Tooltip>
        <Tooltip placement="top" title={'Delete'}>
          <img
            onClick={handleDelete}
            style={{
              width: '19px',
              margin: '2px 4px',
            }}
            src={CloseIcon}
            alt="close"
            />
            </Tooltip>
      </IconContainer> */}
        <OptionMenuContainer>
          {!disableOptions && (
            <OptionsMenu color={'#8492a4'} options={OPTIONS}>
              <MoreVertIcon />
            </OptionsMenu>
          )}
        </OptionMenuContainer>
      </QuickFilterTitleContainer>
    </CustomFilterOptionWrapper>
  );
};

export default CustomFilterOption;
