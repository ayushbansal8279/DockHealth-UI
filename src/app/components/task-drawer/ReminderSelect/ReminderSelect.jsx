import React, { useRef } from 'react';
import { string, shape, arrayOf, func, number } from 'prop-types';
import ArrowIcon from 'img/arrow';
import useBoolean from 'hooks/useBoolean';
import {
  ReminderSelectContainer,
  ReminderSelectInput,
  ArrowImg,
} from './styled';
import InputPopover from '../InputPopover/InputPopover';

const ReminderSelect = ({ value, onSelect, options, width }) => {
  const inputWrapperReference = useRef(null);
  const [isPopoverOpen, setIsPopoverOpen, unsetIsPopoverOpen] = useBoolean(
    false,
  );

  const valueLabel =
    options?.find(option => option.value === value)?.label || '--';

  return (
    <ReminderSelectContainer ref={inputWrapperReference}>
      <ReminderSelectInput
        width={width}
        value={valueLabel}
        readOnly
        onFocus={setIsPopoverOpen}
        onBlur={unsetIsPopoverOpen}
      />
      <ArrowImg src={ArrowIcon} alt="arrow" />
      {options?.length > 0 && (
        <InputPopover
          anchorElement={inputWrapperReference}
          isPopoverOpen={isPopoverOpen}
          closePopover={unsetIsPopoverOpen}
        >
          {options?.map(({ label, value: optionValue }) => (
            <div
              onMouseDown={() => {
                onSelect(optionValue);
                unsetIsPopoverOpen();
              }}
            >
              {label}
            </div>
          ))}
        </InputPopover>
      )}
    </ReminderSelectContainer>
  );
};

ReminderSelect.propTypes = {
  options: arrayOf(
    shape({
      label: string,
      value: string,
    }),
  ).isRequired,
  value: string.isRequired,
  onSelect: func.isRequired,
  width: number.isRequired,
};

export default ReminderSelect;
