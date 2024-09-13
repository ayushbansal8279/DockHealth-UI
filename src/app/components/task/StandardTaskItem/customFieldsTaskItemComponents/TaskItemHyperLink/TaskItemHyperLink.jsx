import React, { useCallback, useEffect, useState, useRef } from 'react';
import Tooltip from 'components/common/Tooltip/Tooltip';
import { HyperLinkInputInput } from './styled';
import { TextValue, AddPlaceholder } from './../TaskItemText/styled';
import { trunc } from 'helpers/utility-functions';
import { Box, IconButton, Link } from '@mui/material';
import EditPencil from '@/app/img/EditPencil';
import { DescriptionBox, DescriptionEditButton } from '../../../styled';
import palette from '@/app/styles/palette';

const TaskItemHyperLink = ({
  value: initialValue = '',
  onChange,
  readOnly = false,
  placeholder,
  field,
}) => {
  const [value, setValue] = useState(initialValue);
  const { name } = field;

  const inputReference = useRef(null);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const [isEditing, setEditing] = useState(false);

  useEffect(() => {
    if (isEditing) {
      inputReference.current?.focus();
    }
  }, [isEditing]);

  const handleClick = useCallback(
    (event) => {
      if (!readOnly) {
        setEditing(true);
      }
    },
    [readOnly, setEditing],
  );

  const handleOnChange = useCallback(
    (event) => {
      setValue(event.target.value);
      setEditing(true);
    },
    [setEditing],
  );

  const handleBlur = useCallback(
    (event) => {
      if (
        !readOnly &&
        initialValue !== event?.target?.value &&
        !!event?.target?.value
      ) {
        onChange(event?.target.value);
      }
      setEditing(false);
    },
    [onChange, readOnly, setEditing, initialValue],
  );

  const handleKeyDown = useCallback(
    (event) => {
      if (event.key === 'Enter') {
        inputReference.current?.blur();
        handleBlur();
      }
    },
    [handleBlur],
  );

  return (
    <>
      <DescriptionBox>
        <Box display="flex" flex={1}>
          {!isEditing && (
            <>
              <Link
                href={value?.startsWith('http') ? value : `//${value}`}
                target="_blank"
                sx={{
                  color: palette.blueOcean,
                  fontFamily: 'Outfit',
                  textDecoration: 'none',
                  '&:visited': {
                    color: palette.cyanBlue,
                  },
                  '&:hover': {
                    color: palette.brightBlue,
                  },
                }}
                disabled={readOnly}
              >
                {trunc(value, 15)}
              </Link>
              {!(value && value !== '') ? (
                <TextValue onClick={handleClick}>
                  <AddPlaceholder>+ Add {name}</AddPlaceholder>
                </TextValue>
              ) : (
                <DescriptionEditButton>
                  <IconButton
                    onClick={(event) => {
                      if (!readOnly) {
                        event.stopPropagation();
                        event.preventDefault();
                        setEditing(!isEditing);
                      }
                    }}
                  >
                    <Tooltip placement="top" title={`Edit ${name}`}>
                      <EditPencil />
                    </Tooltip>
                  </IconButton>
                </DescriptionEditButton>
              )}
            </>
          )}
        </Box>
        {isEditing && (
          <HyperLinkInputInput
            hiddenLabel
            readOnly={readOnly}
            placeholder={placeholder}
            value={value}
            onChange={handleOnChange}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            autoFocus
            ref={inputReference}
          />
        )}
      </DescriptionBox>
    </>
  );
};

export default TaskItemHyperLink;
