import React, { useCallback, useEffect, useRef, useState } from 'react';
import OptionsMenu from 'components/common/OptionsMenu/OptionsMenu';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Input from 'components/common/Input/Input';
import { CustomFilterOptionWrapper, IconContainer } from './styled';
import CloseIcon from 'img/close_cross.svg';
import RenameIcon from 'img/rename.png';
import Tooltip from 'components/common/Tooltip/Tooltip';

const CustomFilterOption = (props) => {
  const {
    identifier,
    label = '',
    selected = false,
    onOptionClick,
    disabled = true,
    onEditMode,
    disableOptions = false,
    onDelete,
    autofocus,
    onBlur,
    editModeEnabled,
    setSavePopupOpen,
    setQuickFilterIdentifier,
    selectedQuickFilter,
    setSelectedQuickFilter,
    setFinalFilter,
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
    setQuickFilterIdentifier(identifier);
  };

  const OPTIONS = [
    { name: 'Delete', onClick: handleDelete },
    { name: 'Edit', onClick: handleEnableEditMode },
  ];

  const handleOptionClick = useCallback(() => {
    if (disabled) {
      onOptionClick(identifier);
    }
  }, [disabled, identifier, onOptionClick]);

  const onClick = () => {
    if (isSelected) {
      setSelectedQuickFilter('');
      setSelected(false);
      setFinalFilter({});
      setQuickFilterIdentifier('')
    }
  };

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
      onClick={() => {
        handleOptionClick(), onClick();
      }}
      editModeEnabled={editModeEnabled}
    >
      <Input
        onKeyPress={handleKeyPress}
        inputRef={inputReference}
        readOnly={disabled}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        InputProps={{ disableUnderline: true }}
        onBlur={() => !disabled && onBlur(identifier, value)}
      />
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
      {!disableOptions && (
        <OptionsMenu color={'#8492a4'} options={OPTIONS}>
          <MoreVertIcon />
        </OptionsMenu>
      )}
    </CustomFilterOptionWrapper>
  );
};

export default CustomFilterOption;
