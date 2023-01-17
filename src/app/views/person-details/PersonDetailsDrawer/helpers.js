import { string, object } from 'yup';

const REQUIRED_MESSAGE = 'This field is required';

export const validationSchema = object().shape({
  firstName: string().required(REQUIRED_MESSAGE),
  lastName: string().required(REQUIRED_MESSAGE),
  email: string()
    .nullable()
    .transform(value => (!value ? null : value))
    .email('This field requires a valid email address'),
  phoneWork: string().nullable(),
  phoneMobile: string().nullable(),
  role: string().nullable(),
  department: string().nullable(),
});
