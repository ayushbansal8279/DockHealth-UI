import moment from 'moment';
import { mixed, string, object } from 'yup';

const DATE_FORMAT = 'MM/DD/YYYY';
const REQUIRED_MESSAGE = 'This field is required';
export const GENDER_OPTIONS = [
  {
    value: 'female',
    label: 'Female',
  },
  {
    value: 'male',
    label: 'Male',
  },
  {
    value: 'other',
    label: 'Other',
  },
];

export function formatMetaDataOutput(outputData) {
  const metadata = outputData.patientMetaData;

  const formattedMetadata = Object.keys(metadata).map(key => {
    return {
      customFieldIdentifier: key,
      value: metadata[key],
    };
  });

  return { ...outputData, patientMetaData: formattedMetadata };
}

export const validationSchema = object().shape({
  firstName: string().required(REQUIRED_MESSAGE),
  middleName: string().nullable(),
  lastName: string().required(REQUIRED_MESSAGE),
  mrn: string(),
  gender: string().nullable(),
  dob: mixed()
    .nullable()
    .transform(newValue => {
      const dobMoment = moment(newValue, DATE_FORMAT);

      if (!newValue) {
        return null;
      }

      if (
        newValue?.replace(/[/_-]/g, '')?.length <
        DATE_FORMAT.replace(/\//g, '').length
      ) {
        return new Error();
      }

      if (dobMoment.isValid()) {
        return newValue;
      }

      return new Error();
    })
    .test(
      'validDate',
      `This field requires date in ${DATE_FORMAT} format`,
      function validDate(value) {
        if (value instanceof Error) {
          this.createError();
          return false;
        }
        return value;
      },
    )
    .test('pastDate', `Date of birth is in the future`, function pastDate(
      value,
    ) {
      if (moment(value, DATE_FORMAT).isAfter(moment())) {
        this.createError();
        return false;
      }
      return true;
    }),
  email: string()
    .nullable()
    .transform(value => (!value ? null : value))
    .email('This field requires a valid email address'),
  phoneHome: string().nullable(),
  phoneMobile: string().nullable(),
});
