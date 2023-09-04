import React, { useCallback, useEffect, useRef, useState } from 'react';
import OptionsMenu from 'components/common/OptionsMenu/OptionsMenu';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Input from 'components/common/Input/Input';
import { CustomFilterOptionWrapper } from './styled';

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
  } = props;
  const [value, setValue] = useState(label);
  const inputReference = useRef(null);

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

  const handleEnableEditMode = useCallback(
    (event) => {
      event.preventDefault();
      event.stopPropagation();
      onEditMode(identifier);
    },
    [identifier, onEditMode],
  );

  const OPTIONS = [
    { name: 'Delete', onClick: handleDelete },
    { name: 'Rename', onClick: handleEnableEditMode },
  ];

  const handleOptionClick = useCallback(() => {
    if (disabled) {
      onOptionClick(identifier);
    }
  }, [disabled, identifier, onOptionClick]);

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
      selected={selected}
      onClick={handleOptionClick}
      editModeEnabled={editModeEnabled}
    >
      <Input
        onKeyPress={handleKeyPress}
        inputRef={inputReference}
        readOnly={disabled}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        InputProps={{ disableUnderline: true }}
        onBlur={() => onBlur(identifier, value)}
      />
      {!disableOptions && (
        <OptionsMenu options={OPTIONS}>
          <MoreVertIcon />
        </OptionsMenu>
      )}
    </CustomFilterOptionWrapper>
  );
};

export default CustomFilterOption;
