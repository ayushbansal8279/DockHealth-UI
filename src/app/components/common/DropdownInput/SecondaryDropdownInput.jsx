import React from 'react';
import ArrowIcon from 'img/arrow.svg';
import DropdownInput from './DropdownInput';
import {
  SelectArrowImg,
  StyledDropdownInput
} from './styled';
import { generateSelectOptions } from './helpers';

const SecondaryDropdownInput = React.forwardRef(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ({ options, width, sortEnabled = false, ...restProps }, reference) => {

    return (
      <>
        <StyledDropdownInput
          ref={reference}
          width={width}
          InputProps={{
            endAdornment: <SelectArrowImg src={ArrowIcon} alt="arrow" />,
          }}
          {...restProps}
        >
          {generateSelectOptions(options, sortEnabled)}
        </StyledDropdownInput>
      </>
    );
  },
);

export default SecondaryDropdownInput;
