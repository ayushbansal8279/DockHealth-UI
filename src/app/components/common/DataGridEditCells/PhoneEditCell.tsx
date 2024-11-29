import React, { useRef, useState } from 'react';
import {
  useGridApiContext,
  GridRenderEditCellParams,
} from '@mui/x-data-grid-premium';
import PhoneNumberInput from '../PhoneNumberInput/PhoneNumberInput';
import { isValidPhoneNumber } from '@/app/helpers/validation-helper';
import InputPopover from '../InputPopover/InputPopover';
import { Box, ClickAwayListener, Typography } from '@mui/material';
import { ErrorText } from './styled';
import { phoneLabelStyles } from './helpers';

type Params = GridRenderEditCellParams<Record<string, any>, string | null>;

export const preProcessPhoneEditCellProps = (params: Params) => {
  const error =
    !params.props.value || isValidPhoneNumber(params.props.value)
      ? ''
      : 'Invalid Phone Number';
  return { ...params.props, error };
};

export default function PhoneEditCell({ id, field, value, error }: Params) {
  const inputReference = useRef({});
  const apiRef = useGridApiContext();
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const handleChange = (newPhone: string) => {
    apiRef.current.setEditCellValue({
      id,
      field,
      value: newPhone,
    });
  };

  const openPopover = () => {
    setIsPopoverOpen(true);
  }

  const closePopover = () => {
    setIsPopoverOpen(false);
  }

  const isValueEmpty = !value;

  return (
    <ClickAwayListener onClickAway={closePopover}>
      <Box>
        <Box ref={inputReference} onClick={openPopover}>
          <Typography sx={phoneLabelStyles(isValueEmpty)}>
            {isValueEmpty ? 'Add number' : value}
          </Typography>
        </Box>
        {error && !isPopoverOpen && <ErrorText>{error}</ErrorText>}
        <InputPopover
          anchorElement={inputReference}
          isPopoverOpen={isPopoverOpen}
          onClose={closePopover}
          popupStyle={{ width: '200px' }}
        >
          <PhoneNumberInput
            inputRef={inputReference}
            value={value || ''}
            error={error}
            onChange={handleChange}
          />
        </InputPopover>
      </Box>
    </ClickAwayListener>
  );
}
