import { boolean, object, string } from 'yup';

const REQUIRED_MESSAGE = 'This field is required';
const PHONE_MASK = /[1-9]\d{2}-\d{3}-\d{4}|^$/;
const MASK_MESSAGE =
  'Phone number has incorrect format (NNN-NNN-NNNN is required)';

export const matchEmptyNumber = value =>
  value.replace(/_/g, '').replace(/^-+$/, '');

export default object().shape({
  firstName: string().required(REQUIRED_MESSAGE),
  lastName: string().required(REQUIRED_MESSAGE),
  title: string().required(REQUIRED_MESSAGE),
  specialty: string().nullable(),
  subspecialty: string().nullable(),
  department: string().nullable(),
  workPhoneNumber: string()
    // eslint-disable-next-line func-names
    .transform(function(value) {
      return this.isType(value) && matchEmptyNumber(value);
    })
    .matches(PHONE_MASK, MASK_MESSAGE)
    .notRequired(),
  emailNotificationsEnabled: boolean(),
  pushNotificationsEnabled: boolean(),
});
