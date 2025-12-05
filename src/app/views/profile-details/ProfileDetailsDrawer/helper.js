import moment from 'moment';
import { GENDER_OPTIONS_BIRTH } from '@/app/types/gender';
import { UTC_DATE_ONLY } from '@/app/helpers/date-intent-helpers';

export function mapFieldsFromIdentifiers(mappings, data) {
  const mappedFields = {};
  const unmappedFields = {};

  Object.entries(data).forEach(([key, value]) => {
    if (value === undefined) return;

    const mapping = mappings.find((mapping) => mapping.identifier === key);

    if (mapping) {
      mappedFields[mapping.fieldName] = value;
    } else {
      unmappedFields[key] = value;
    }
  });

  return { mappedFields, unmappedFields };
}

export function processCustomFields(
  unmappedFields,
  allCustomFields,
  useCustomFieldIdentifier = false,
) {
  return Object.keys(unmappedFields)
    .map((key) => {
      const customField = allCustomFields.find(
        (field) => field.identifier === key,
      );

      if (!customField) return null;

      const identifierToUse =
        useCustomFieldIdentifier && customField.customFieldIdentifier
          ? customField.customFieldIdentifier
          : key;

      if (
        customField.fieldType === 'RELATIONSHIP' ||
        customField.fieldType === 'MULTI_SELECT'
      ) {
        return {
          customFieldIdentifier: identifierToUse,
          values: unmappedFields[key],
        };
      } else {
        return {
          customFieldIdentifier: identifierToUse,
          value: unmappedFields[key],
        };
      }
    })
    .filter(Boolean);
}

export function formatPatientName(patient) {
  return `${patient?.lastName}, ${patient?.firstName} ${
    patient?.middleName ?? ''
  }`;
}

export function formatProfileTitle(profileName) {
  return [
    `${profileName?.[1] ? profileName?.[1] + ',' : ''}`,
    profileName?.[0],
    profileName?.[2],
  ].join(' ');
}

export function enrichCategoryGroups(customGroups, customFields) {
  return customGroups.map((category) => {
    if (!category.fields) {
      return category;
    }

    const enrichedFields = category.fields.map((field) => {
      const matchingField = customFields?.find(
        (customField) => customField.identifier === field.fieldReferenceId,
      );

      return matchingField ? { ...field, ...matchingField } : field;
    });

    return { ...category, fields: enrichedFields };
  });
}

function getGenderOptions() {
  return GENDER_OPTIONS_BIRTH?.map((item) => {
    return {
      identifier: item?.value,
      name: item?.label,
    };
  });
}

function getGenderIdentityOptions(genderIdentity) {
  return genderIdentity?.map((item) => {
    return {
      identifier: item?.genderIdentityType,
      name: item?.description,
    };
  });
}

export function addFieldOptionsInDefaultCategory(
  processedGroups,
  GENDER_OPTIONS,
) {
  return processedGroups.map((category) => {
    if (category.name === 'Default Group') {
      const newFields = category?.fields?.map((field) => {
        let updatedField = { ...field };

        switch (field.name) {
          case 'Gender Identity':
            updatedField.options = getGenderIdentityOptions(GENDER_OPTIONS);
            break;
          case 'Sex at Birth':
            updatedField.options = getGenderOptions();
            break;
          default:
            break;
        }

        return updatedField;
      });

      return { ...category, fields: newFields };
    }
    return category;
  });
}

export function mapPatientFieldValues(defaultFields, patient) {
  const profileValue = patient?.patientMetaData || [];

  const mappedDefaultFields = defaultFields?.map(
    ({ fieldName, identifier }) => {
      let value = patient[fieldName] ?? '';
      if (fieldName === 'dob' && value) {
        value = moment(value).format(UTC_DATE_ONLY);
      }
      return {
        customFieldIdentifier: identifier,
        value: value,
      };
    },
  );

  const finalProfileValues = [...mappedDefaultFields, ...profileValue];
  return finalProfileValues;
}
