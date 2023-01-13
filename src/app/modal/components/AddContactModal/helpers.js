import { yupResolver } from '@hookform/resolvers/yup';
import { capitalize } from 'helpers/capitalize';
import { CommunicationType } from 'helpers/task-helpers';
import { string, object } from 'yup';

// const stringContainsNumber = testedString => {
//   return /\d/.test(testedString);
// };

// eslint-disable-next-line import/prefer-default-export
export const mailValidationSchema = object({
  type: string().required(d => `${capitalize(d.path)} is required`),
  name: string().required(d => `${capitalize(d.path)} is required`),
  email: string()
    .email('Please provide valid email')
    .required(d => `${capitalize(d.path)} is required`),
  phone: string()
    .transform(value => value.replace(/\D/g, ''))
    .matches(/\d{10}/, {
      message: 'Please enter a valid phone number',
      excludeEmptyString: true,
    }),
  fax: string()
    .transform(value => value.replace(/\D/g, ''))
    .matches(/\d{10}/, {
      message: 'Please enter a valid fax number',
      excludeEmptyString: true,
    }),
  notes: string(),
});

export const faxValidationSchema = object({
  type: string().required(d => `${capitalize(d.path)} is required`),
  name: string().required(d => `${capitalize(d.path)} is required`),
  email: string().email('Please enter a valid email address'),
  phone: string()
    .transform(value => value.replace(/\D/g, ''))
    .matches(/\d{10}/, {
      message: 'Please enter a valid phone number',
      excludeEmptyString: true,
    }),
  fax: string()
    .transform(value => value.replace(/\D/g, ''))
    .matches(/\d{10}/, {
      message: 'Please enter a valid fax number',
      excludeEmptyString: true,
    }),
  notes: string(),
});
export const resolveSchema = type => {
  switch (type) {
    case CommunicationType.EMAIL:
      return yupResolver(mailValidationSchema);
    case CommunicationType.FAX:
      return yupResolver(faxValidationSchema);
    default:
      return null;
  }
};

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
