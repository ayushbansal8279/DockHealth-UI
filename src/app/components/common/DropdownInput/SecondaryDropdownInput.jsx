import React from 'react';
import ArrowIcon from 'img/arrow';
import DropdownInput from './DropdownInput';
import {
  SelectArrowImg,
  useSecondaryTypeInputStyles,
  useSecondaryTypeTextFieldStyles,
} from './styled';
import { generateSelectOptions } from './helpers';

const SecondaryDropdownInput = React.forwardRef(
  ({ options, width, sortEnabled = false, ...restProps }, reference) => {
    const secondaryTypeInputClasses = useSecondaryTypeInputStyles();
    const secondaryTypeTextFieldClasses = useSecondaryTypeTextFieldStyles({
      width,
    });
    return (
      <>
        <DropdownInput
          ref={reference}
          InputProps={{
            endAdornment: <SelectArrowImg src={ArrowIcon} alt="arrow" />,
            classes: secondaryTypeInputClasses,
          }}
          textFieldClasses={secondaryTypeTextFieldClasses}
          {...restProps}
        >
          {generateSelectOptions(options, sortEnabled)}
        </DropdownInput>
      </>
    );
  },
);

export default SecondaryDropdownInput;
