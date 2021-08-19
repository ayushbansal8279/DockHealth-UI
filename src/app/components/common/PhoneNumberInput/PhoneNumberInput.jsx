import clsx from 'clsx';
import React from 'react';
import MUIPhoneNumberInput from 'material-ui-phone-number';
import { makeStyles } from '@material-ui/core/styles';
import Input from '../Input/Input';

const phoneCountryCodes = process.env.PHONE_COUNTRY_CODES.split(',');

export const usePhoneNumberStyles = makeStyles({
  dropdown: {
    zIndex: '6000 !important',
  },
  root: {
    '& .MuiButtonBase-root': {
      height: 30,
      minHeight: 30,
    },
    '& .MuiInputBase-root': {
      padding: '22px 12px 2px',
    },
    '& .MuiInputBase-input': {
      border: 'none',
      background: 'transparent',
      boxShadow: 'none',

      '&[readonly]': {
        cursor: 'initial',
      },
    },
    '& .Mui-focused input': {
      background: 'transparent',
      border: 'none',
      boxShadow: 'none',
    },
    '& .MuiInput-underline': {
      '&:after, &:before': {
        display: 'none',
      },
    },
  },
});

const browserLang = navigator?.language?.slice(0, 2).toLowerCase();
const defaultLang = phoneCountryCodes.includes(browserLang)
  ? browserLang
  : 'us';
const CustomPhoneNumberInput = ({ readOnly, inputRef, ...otherProps }) => {
  const classes = usePhoneNumberStyles();
  return (
    <MUIPhoneNumberInput
      ref={inputRef}
      {...otherProps}
      inputProps={{ readOnly }}
      disableDropdown={readOnly}
      defaultCountry={defaultLang}
      countryCodeEditable={false}
      disableAreaCodes
      onlyCountries={phoneCountryCodes}
      className={clsx({
        [otherProps.className]: otherProps.className,
        [classes.root]: true,
      })}
      dropdownClass={classes.dropdown}
    />
  );
};

const PhoneNumberInput = props => (
  <Input {...props} shrink customInputComponent={CustomPhoneNumberInput} />
);

export default PhoneNumberInput;
