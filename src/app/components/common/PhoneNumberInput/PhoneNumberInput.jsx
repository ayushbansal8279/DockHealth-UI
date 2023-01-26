/* eslint-disable sonarjs/no-duplicate-string */
import React from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
// import palette from 'styles/palette';
// import { makeStyles } from '@mui/styles';
import Input from '../Input/Input';

export const usePhoneNumberStyles = undefined;
// makeStyles({
//   dropdown: {
//     left: '-12px !important',
//     padding: '8px 0 !important',
//     zIndex: '6000 !important',
//     overflow: 'auto !important',
//     color: 'inherit !important',
//     '& .country': {
//       padding: '6px 16px !important',
//       color: 'inherit !important',
//       '&.highlight, &.active, &:hover': {
//         backgroundColor: `${palette.brightBlueWithAlpha} !important`,
//       },
//     },
//   },
//   container: {
//     margin: '22px 12 2px 12px',
//     fontSize: 'inherit !important',
//     fontWeight: 'inherit !important',
//     fontFamily: 'inherit !important',
//   },
//   button: {
//     background: 'transparent !important',
//     border: 'none !important',
//     borderRadius: '0 !important',
//     '& > .selected-flag': {
//       '&:active, &:hover, &:focus, &.open': {
//         backgroundColor: 'rgba(0, 0, 0, 0.04) !important',
//       },
//     },
//   },
//   input: {
//     width: '100% !important',
//     border: 'none !important',
//     borderRadius: '0 !important',
//     boxShadow: 'none !important',
//     background: 'transparent !important',
//     fontSize: 'inherit !important',
//     fontWeight: 'inherit !important',
//     fontFamily: 'inherit !important',
//     color: 'inherit !important',
//     '&[readonly], &:disabled': {
//       cursor: 'initial !important',
//     },
//   },
// });

const CustomPhoneNumberInput = ({ readOnly, inputRef, ...otherProps }) => {
  const phoneCountryCodes = import.meta.env.PHONE_COUNTRY_CODES.split(',');
  const browserLang = navigator?.language?.slice(0, 2).toLowerCase();
  const defaultLang = phoneCountryCodes.includes(browserLang)
    ? browserLang
    : 'us';
  const classes = usePhoneNumberStyles();
  return (
    <PhoneInput
      {...otherProps}
      ref={inputRef}
      inputProps={{ readOnly }}
      disableDropdown={readOnly}
      country={defaultLang}
      countryCodeEditable={false}
      onlyCountries={phoneCountryCodes}
      containerClass={classes.root}
      inputClass={classes.input}
      buttonClass={classes.button}
      dropdownClass={classes.dropdown}
    />
  );
};

const PhoneNumberInput = (props) => (
  <Input {...props} shrink customInputComponent={CustomPhoneNumberInput} />
);

export default PhoneNumberInput;
