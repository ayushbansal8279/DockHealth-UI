/* eslint-disable sonarjs/no-duplicate-string */
import React from 'react';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

import { styled } from '@mui/material/styles';
import Input from '../Input/Input';

const phoneCountryCodes = import.meta.env.VITE_PHONE_COUNTRY_CODES.split(',');
const browserLang = navigator?.language?.slice(0, 2).toLowerCase();
const defaultLang = phoneCountryCodes.includes(browserLang)
  ? browserLang
  : 'us';

const StyledPhoneInput = styled(PhoneInput)`
  display: flex;
  height: 30px;
  & input {
    color: inherit !important;
    &[readonly],
    &:disabled {
      cursor: initial !important;
    }
    background: transparent !important;
    border: none !important;
    box-shadow: none !important;
    margin-top: 15px;
  }
`;

const CustomPhoneNumberInput = ({ readOnly, inputRef, ...otherProps }) => {
  return (
    <StyledPhoneInput
      {...otherProps}
      international
      countryCallingCodeEditable={false}
      defaultCountry={defaultLang?.toUpperCase()}
      ref={inputRef}
      inputProps={{ readOnly }}
    />
  );
};

const PhoneNumberInput = (props) => (
  <Input
    {...props}
    shrink
    customInputComponent={CustomPhoneNumberInput}
    error={
      props?.error ??
      (props?.value
        ? isValidPhoneNumber(props?.value)
          ? undefined
          : 'Invalid phone number'
        : undefined)
    }
  />
);

export default PhoneNumberInput;
