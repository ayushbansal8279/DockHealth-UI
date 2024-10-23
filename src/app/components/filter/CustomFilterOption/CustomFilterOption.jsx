import React, { useCallback, useEffect, useRef, useState } from 'react';
import OptionsMenu from 'components/common/OptionsMenu/OptionsMenu';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import palette from 'styles/palette';
import moment from 'moment';
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
    setSavePopupOpen,
    selectedQuickFilter,
    setSelectedQuickFilter,
    setEditIdentifier,
    filter,
    filters,
    setCustomFinalFilter,
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

    const selectedFilters = filter.selectedOptions;

    const data = {};
    if (selectedFilters && filters) {
      for (const key in selectedFilters) {
        if (key !== '') {
          const users = filters
            .flatMap((item) => item.id === key && item.options)
            .filter((item) => typeof item !== 'boolean');

          let options = selectedFilters[key].options.map((item) => {
            if (item.includes('DATE_RANGE')) {
              let aa = users.find((user) => user.key === item);
              aa = {
                ...aa,
                dateStart: moment(selectedFilters[key].dateStart).format(
                  'YYYY-MM-DD',
                ),
                dateEnd: moment(selectedFilters[key].dateEnd).format(
                  'YYYY-MM-DD',
                ),
              };
              return aa;
            }
            return users.find((user) => user.key === item);
          });
          data[key] = options;
        }
      }
    }

    setCustomFinalFilter(data);
    setSelectedCustomFilter(data);
  };

  const handleDuplicate = () => {
    if (
      isPatientListPage &&
      filter.patientSelectedOptions.customFields.length > 0
    ) {
      const selectedOptions = {};
      filter.patientSelectedOptions.customFields.forEach((element) => {
        selectedOptions[element.customFieldIdentifier] = {
          options: element.selectedOptionIdentifiers,
        };
      });
      handleQuickFilterDuplicateForPatientList(
        `Copy of ${filter.name}`,
        selectedOptions,
      );
    } else {
      onQuickFilterCreate(`Copy of ${filter.name}`, filter.selectedOptions);
    }
  };

  const OPTIONS = [
    { name: 'Edit', onClick: handleEnableEditMode },
    { name: 'Duplicate', onClick: handleDuplicate },
    { name: 'Delete', onClick: handleDelete },
  ];

  const handleOptionClick = useCallback(() => {
    if (isSelected) {
      clearFilters();
      setSelected(false);
      setSelectedQuickFilter('');
    } else {
      onOptionClick(identifier);
    }
  }, [
    isSelected,
    onOptionClick,
    identifier,
    clearFilters,
    setSelectedQuickFilter,
  ]);

  // const handleKeyPress = useCallback(
  //   (event) => {
  //     const { key } = event;

  //     switch (key) {
  //       case 'Enter': {
  //         onBlur(identifier, value);
  //         break;
  //       }
  //       case 'Escape': {
  //         break;
  //       }
  //       default: {
  //         break;
  //       }
  //     }
  //   },
  //   [identifier, onBlur, value],
  // );

  return (
    <CustomFilterOptionWrapper selected={isSelected}>
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
            <OptionsMenu color={palette.shadowBlue} options={OPTIONS}>
              <MoreVertIcon />
            </OptionsMenu>
          )}
        </OptionMenuContainer>
      </QuickFilterTitleContainer>
    </CustomFilterOptionWrapper>
  );
};

export default CustomFilterOption;
