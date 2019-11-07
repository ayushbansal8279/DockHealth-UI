import { object, string } from 'yup';

const REQUIRED_MESSAGE = 'This field is required';
const DATE_MASK = /[0-2]\d\/[0-2]\d\/\d{4}/;
const DATE_MASK_MESSAGE =
  'Birthday has incorrect format (MM/DD/YYYY is required)';
const PHONE_MASK = /[1-9]\d{2}-\d{3}-\d{4}|^$/;
const PHONE_MASK_MESSAGE =
  'Phone number has incorrect format (NNN-NNN-NNNN is required)';

export const matchEmptyNumber = value =>
  value.replace(/_/g, '').replace(/^-+$/, '');

export const matchEmptyDate = value =>
  value.replace(/_/g, '').replace(/^-\/$/, '');

export const addPatientValidationSchema = object().shape({
  firstName: string().required(REQUIRED_MESSAGE),
  middleName: string().notRequired(),
  lastName: string().required(REQUIRED_MESSAGE),
  mrn: string().notRequired(),
  dob: string()
    // eslint-disable-next-line func-names
    .transform(function(value) {
      return this.isType(value) && matchEmptyDate(value);
    })
    .matches(DATE_MASK, DATE_MASK_MESSAGE),
  gender: string().notRequired(),
  phoneHome: string()
    // eslint-disable-next-line func-names
    .transform(function(value) {
      return this.isType(value) && matchEmptyNumber(value);
    })
    .matches(PHONE_MASK, PHONE_MASK_MESSAGE)
    .notRequired(),
  phoneMobile: string()
    // eslint-disable-next-line func-names
    .transform(function(value) {
      return this.isType(value) && matchEmptyNumber(value);
    })
    .matches(PHONE_MASK, PHONE_MASK_MESSAGE)
    .notRequired(),
  email: string()
    .email()
    .notRequired(),
  notes: string().notRequired(),
});

export const inviteValidationSchema = object().shape({
  firstName: string().required(REQUIRED_MESSAGE),
  lastName: string().required(REQUIRED_MESSAGE),
  email: string()
    .email()
    .required(REQUIRED_MESSAGE),
});
