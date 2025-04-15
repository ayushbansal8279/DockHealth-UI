import moment from 'moment';
import isEmpty from 'ramda/src/isEmpty';
import { mixed, string, object } from 'yup';
import { isValidPhoneNumber } from 'react-phone-number-input';

const DATE_FORMAT = 'MM/DD/YYYY';
const REQUIRED_MESSAGE = 'This field is required';
const MASK_MESSAGE = 'Invalid phone number';

const isEqual = (a, b) => JSON.stringify(a) === JSON.stringify(b);

export function formatMetaDataOutput(outputData) {
  const metadata = outputData.patientMetaData;

  if (!metadata || isEmpty(metadata)) return outputData;

  const filteredMetaDataObj = Object.values(metadata).filter(
    (val) =>
      typeof val === "object" &&
      val !== null &&
      val.customFieldIdentifier &&
      (val.value !== undefined || val.values !== undefined)
  );

  // remove metadata with no values - only keep UUID keys
  const filteredMetaDataKeys = Object.keys(metadata).filter(
    (key) => key.length === 36,
  );

  const formattedMetadata = filteredMetaDataKeys.map((key) => {
    const match = filteredMetaDataObj.find(
      (m) => m.customFieldIdentifier === key
    );

    if (Array.isArray(metadata[key])) {
      const result = {
        customFieldIdentifier: key,
        values: metadata[key],
      };

      if (match && !isEqual(match.values, metadata[key])) {
        result.isFieldUpdated = true;
      }

      return result;
    }
    
    const result = {
      customFieldIdentifier: key,
      value: metadata[key],
    };

    if (match && match.value !== metadata[key]) {
      result.isFieldUpdated = true;
    }

    return result;
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
