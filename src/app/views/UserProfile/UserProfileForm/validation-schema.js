import { object, string } from 'yup';
import 'yup-phone';

const REQUIRED_MESSAGE = 'This field is required';
// const PHONE_MASK = /^(\+?\d{10,15})$/;
const MASK_MESSAGE = 'Phone number has incorrect format.';

export const matchEmptyNumber = (value) =>
  value.replace(/_/g, '').replace(/^-+$/, '');

export default object().shape({
  firstName: string().required(REQUIRED_MESSAGE),
  lastName: string().required(REQUIRED_MESSAGE),
  title: string().nullable(),
  specialty: string().nullable(),
  subspecialty: string().nullable(),
  department: string().nullable(),
  workPhoneNumber: string()
    .transform((value) => {
      if (!value || value.length <= 3) {
        return '';
      }
      return matchEmptyNumber(value);
    })
    // .phone(null, false, MASK_MESSAGE)
    // .matches(PHONE_MASK, MASK_MESSAGE)
    .notRequired(),
});
