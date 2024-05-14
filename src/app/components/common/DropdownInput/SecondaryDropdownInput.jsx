import React from 'react';
import ArrowIcon from 'img/arrow.svg';
import { SelectArrowImg, StyledDropdownInput } from './styled';
import { generateSelectOptions } from './helpers';

const SecondaryDropdownInput = React.forwardRef(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (
    { options, width, height, sortDisabled = false, ...restProps },
    reference,
  ) => {
    return (
      <>
        <StyledDropdownInput
          ref={reference}
          width={width}
          height={height}
          InputProps={{
            endAdornment: <SelectArrowImg src={ArrowIcon} alt="arrow" />,
          }}
          {...restProps}
        >
          {generateSelectOptions(options, sortDisabled)}
        </StyledDropdownInput>
      </>
    );
  },
);

export default SecondaryDropdownInput;
