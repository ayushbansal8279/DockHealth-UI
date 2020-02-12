import { object, string } from 'yup';

const REQUIRED_MESSAGE = 'This field is required';
const PHONE_MASK = /\([1-9]\d{2}\) \d{3}-\d{4}|^$/;
export const PHONE_MASK_ARRAY = [
  /[1-9]/,
  /\d/,
  /\d/,
  '-',
  /\d/,
  /\d/,
  /\d/,
  '-',
  /\d/,
  /\d/,
  /\d/,
  /\d/,
];
const MASK_MESSAGE =
  'Phone number has incorrect format (NNN) NNN-NNNN is required)';
const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_MIN_LENGTH_MESSAGE =
  'Password has to include at least 8 characters';
const PASSWORD_NUMBER_REQUIRED_MESSAGE =
  'Password has to include at least one number';
const PASSWORD_CAPITAL_LETTER_REQUIRED_MESSAGE =
  'Password has to include at least one capital letter';

export const matchEmptyNumber = value =>
  value.replace(/_/g, '').replace(/^-+$/, '');

const phoneNumberMatcher = () =>
  string()
    // eslint-disable-next-line func-names
    .transform(function(value) {
      return this.isType(value) && matchEmptyNumber(value);
    })
    .matches(PHONE_MASK, MASK_MESSAGE);

export default object().shape({
  firstName: string().required(REQUIRED_MESSAGE),
  lastName: string().required(REQUIRED_MESSAGE),
  title: string().required(REQUIRED_MESSAGE),
  email: string().required(REQUIRED_MESSAGE),
  accountPhoneNumber: phoneNumberMatcher().required(REQUIRED_MESSAGE),
  password: string()
    .matches(/[A-Z]/, PASSWORD_CAPITAL_LETTER_REQUIRED_MESSAGE)
    .matches(/[1-9]/, PASSWORD_NUMBER_REQUIRED_MESSAGE)
    .min(PASSWORD_MIN_LENGTH, PASSWORD_MIN_LENGTH_MESSAGE)
    .required(REQUIRED_MESSAGE),
});
