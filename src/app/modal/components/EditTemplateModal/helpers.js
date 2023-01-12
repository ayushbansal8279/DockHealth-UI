import { capitalize } from 'helpers/capitalize';
import { string, object } from 'yup';

export const TEMPLATE_TYPES = {
  EMAIL: 'EMAIL',
  FAX: 'FAX',
  SMS: 'SMS',
  EMR_NOTE: 'EMR_NOTE',
  SECURE_MESSAGE: 'SECURE_MESSAGE',
};

export const TEMPLATE_TYPE_OPTIONS = [
  {
    label: 'Email',
    value: TEMPLATE_TYPES.EMAIL,
  },
  {
    label: 'FAX',
    value: TEMPLATE_TYPES.FAX,
  },
  {
    label: 'SMS',
    value: TEMPLATE_TYPES.SMS,
  },
  {
    label: 'Patient Secure Message',
    value: TEMPLATE_TYPES.SECURE_MESSAGE,
  },
  {
    label: 'EHR Note',
    value: TEMPLATE_TYPES.EMR_NOTE,
  },
];

export const validationSchema = object().shape({
  name: string().required(d => `${capitalize(d.path)} is required`),
  type: string().required(d => `${capitalize(d.path)} is required`),
  shortMessage: string(),
  details: string(),
});
