/* eslint-disable import/prefer-default-export */
import { capitalize } from 'helpers/capitalize';
import { string, object } from 'yup';

const getRequiredMessage = d => `${capitalize(d.path)} is required`;

export const validationSchema = object()
  .notRequired()
  .shape({
    type: string().required(getRequiredMessage),
    name: string().required(getRequiredMessage),
    email: string().email('Please enter a valid email address'),
    mobilePhoneNumber: string()
      .transform(value => value.replace(/\D/g, ''))
      .matches(/\d{10}/, {
        message: 'Please enter a valid phone number',
        excludeEmptyString: true,
      }),
    faxPhoneNumber: string()
      .transform(value => value.replace(/\D/g, ''))
      .matches(/\d{10}/, {
        message: 'Please enter a valid fax number',
        excludeEmptyString: true,
      }),
    notes: string(),
  });

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
