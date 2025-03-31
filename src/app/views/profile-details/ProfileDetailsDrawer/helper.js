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

export function processCustomFields(unmappedFields, allCustomFields) {
  return Object.keys(unmappedFields)
    .map((key) => {
      const customField = allCustomFields.find(
        (field) => field.identifier === key,
      );

      if (!customField) return null;

      if (
        customField.fieldType === 'RELATIONSHIP' ||
        customField.fieldType === 'MULTI_SELECT'
      ) {
        return {
          customFieldIdentifier: key,
          values: unmappedFields[key],
        };
      } else {
        return {
          customFieldIdentifier: key,
          value: unmappedFields[key],
        };
      }
    })
    .filter(Boolean);
}
