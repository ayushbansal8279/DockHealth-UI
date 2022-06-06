import moment from 'moment';
import { isEmpty } from 'ramda';
import { mixed, string, object } from 'yup';

const DATE_FORMAT = 'MM/DD/YYYY';
const REQUIRED_MESSAGE = 'This field is required';

export const GENDER_OPTIONS_BIRTH = [
  {
    value: 'male',
    label: 'Male',
  },
  {
    value: 'female',
    label: 'Female',
  },
  {
    value: 'decline',
    label: 'Decline to state',
  },
];

export function formatMetaDataOutput(outputData) {
  const metadata = outputData.patientMetaData;

  if (!metadata || isEmpty(metadata)) return outputData;

  // remove metadata with no values - only keep UUID keys
  const filteredMetaDataKeys = Object.keys(metadata).filter(
    key => key.length === 36,
  );
  const formattedMetadata = filteredMetaDataKeys.map(key => {
    if (Array.isArray(metadata[key]) && metadata[key].length > 0) {
      return {
        customFieldIdentifier: key,
        values: metadata[key],
      };
    }
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
        return true;
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
