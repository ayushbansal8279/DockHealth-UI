import React from 'react';
import ArrowIcon from 'img/arrow.svg';
import DropdownInput from './DropdownInput';
import {
  SelectArrowImg,
  // useSecondaryTypeInputStyles,
  // useSecondaryTypeTextFieldStyles,
} from './styled';
import { generateSelectOptions } from './helpers';

const SecondaryDropdownInput = React.forwardRef(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ({ options, width, sortEnabled = false, ...restProps }, reference) => {
    // const secondaryTypeInputClasses = useSecondaryTypeInputStyles();
    // const secondaryTypeTextFieldClasses = useSecondaryTypeTextFieldStyles({
    // width,
    // });

    return (
      <>
        <DropdownInput
          ref={reference}
          InputProps={{
            endAdornment: <SelectArrowImg src={ArrowIcon} alt="arrow" />,
            // classes: secondaryTypeInputClasses,
          }}
          // textFieldClasses={secondaryTypeTextFieldClasses}
          {...restProps}
        >
          {generateSelectOptions(options, sortEnabled)}
        </DropdownInput>
      </>
    );
  },
);

export default SecondaryDropdownInput;
