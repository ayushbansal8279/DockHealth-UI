import { capitalize } from 'helpers/capitalize';
import { string, object } from 'yup';

// eslint-disable-next-line import/prefer-default-export
export const validationSchema = object({
  type: string().required(d => `${capitalize(d.path)} is required`),
  name: string().required(d => `${capitalize(d.path)} is required`),
  email: string()
    .email('Please provide valid email')
    .required(d => `${capitalize(d.path)} is required`),
  phone: string().required(d => `${capitalize(d.path)} is required`),
  fax: string()
    .test(
      'valid-fax',
      d => `${capitalize(d.path)} is not valid`,
      value => value === null || !value?.includes('_'),
    )
    .required(d => `${capitalize(d.path)} is required`),
  notes: string(),
});

export const mapToDTO = data => {
  const { email, phone, type, name, fax } = data;
  return {
    email,
    type,
    mobilePhoneNumber: phone,
    faxPhoneNumber: fax,
    name,
  };
};

export const typeOptions = [
  {
    value: 'ORGANIZATION',
    label: `Organization`,
  },
  {
    value: 'INDIVIDUAL',
    label: `Individual`,
  },
];
