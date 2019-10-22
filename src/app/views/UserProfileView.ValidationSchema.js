import { boolean, object, string } from 'yup';

const REQUIRED_MESSAGE = 'This field is required';

export default object().shape({
  firstName: string().required(REQUIRED_MESSAGE),
  lastName: string().required(REQUIRED_MESSAGE),
  title: string().required(REQUIRED_MESSAGE),
  specialty: string().nullable(),
  subspecialty: string().nullable(),
  department: string().nullable(),
  accountPhoneNumber: string().nullable(),
  workPhoneNumber: string().nullable(),
  emailNotificationsEnabled: boolean(),
  pushNotificationsEnabled: boolean(),
});
