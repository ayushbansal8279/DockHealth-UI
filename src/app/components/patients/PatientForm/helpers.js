import moment from 'moment';
import isEmpty from 'ramda/src/isEmpty';
import { mixed, string, object } from 'yup';
import { isValidPhoneNumber } from 'react-phone-number-input';

const DATE_FORMAT = 'MM/DD/YYYY';
const REQUIRED_MESSAGE = 'This field is required';
const MASK_MESSAGE = 'Invalid phone number';

export function formatMetaDataOutput(outputData) {
  const metadata = outputData.patientMetaData;

  if (!metadata || isEmpty(metadata)) return outputData;

  // remove metadata with no values - only keep UUID keys
  const filteredMetaDataKeys = Object.keys(metadata).filter(
    (key) => key.length === 36,
  );

  const formattedMetadata = filteredMetaDataKeys.map((key) =>
    Array.isArray(metadata[key])
      ? {
          customFieldIdentifier: key,
          values: metadata[key],
        }
      : {
          customFieldIdentifier: key,
          value: metadata[key],
        }
  );  

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
    .transform((newValue) => {
      const dobMoment = moment(newValue);

      if (!newValue) {
        return null;
      }

      if (dobMoment.isValid()) {
        return dobMoment.format(DATE_FORMAT);
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
    .test(
      'pastDate',
      `Date of birth is in the future`,
      function pastDate(value) {
        if (moment(value, DATE_FORMAT).isAfter(moment())) {
          this.createError();
          return false;
        }
        return true;
      },
    ),
  email: string()
    .nullable()
    .transform((value) => value || null)
    .email('This field requires a valid email address'),
  phoneHome: string()
    .nullable()
    .test('phoneHome', MASK_MESSAGE, function (value) {
      if (value === undefined || value === '') return true;
      return isValidPhoneNumber(String(value));
    }),
  phoneMobile: string()
    .nullable()
    .test('phoneMobile', MASK_MESSAGE, function (value) {
      if (value === undefined || value === '') return true;
      return isValidPhoneNumber(String(value));
    }),
});

export const validateAndSetError = (
  name,
  newValue,
  validate,
  setError,
  clearErrors,
) => {
  if (validate) {
    const result = validate(newValue);

    if (typeof result === 'string') {
      const errorObj = {
        type: 'validate',
        message: result,
        ref: {
          name: name,
          value: newValue,
        },
      };
      setTimeout(() => {
        setError(name, errorObj);
      }, 100);
      return false;
    } else {
      clearErrors(name);
      return true;
    }
  }
  return true;
};

