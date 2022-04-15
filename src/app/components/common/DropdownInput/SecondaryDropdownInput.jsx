import React from 'react';
import ArrowIcon from 'img/arrow';
import DropdownInput from './DropdownInput';
import {
  SelectArrowImg,
  useSecondaryTypeInputStyles,
  useSecondaryTypeTextFieldStyles,
} from './styled';
import { generateSelectOptions, generateAddOption } from './helpers';

const SecondaryDropdownInput = React.forwardRef(
  ({ options, width, showCreateOption, ...restProps }, reference) => {
    const secondaryTypeInputClasses = useSecondaryTypeInputStyles();
    const secondaryTypeTextFieldClasses = useSecondaryTypeTextFieldStyles({
      width,
    });
    console.log(showCreateOption, 'showCreateOption');
    const optionsData = showCreateOption
      ? [
        ...options,
        {
          value: 'Add new',
          label: 'Add new',
        },
      ]
      : options;
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
          {generateSelectOptions(optionsData)}
        </DropdownInput>
        <span>XDXDXD</span>
      </>
    );
  },
);

export default SecondaryDropdownInput;
