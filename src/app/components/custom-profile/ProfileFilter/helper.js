export function convertToPayload(filteredData) {
  const payload = {
    customFields: [],
  };

  for (const [customFieldIdentifier, data] of Object.entries(filteredData)) {
    const customField = {
      customFieldIdentifier,
      selectedOptionIdentifiers: data.options || [],
    };

    if (data.options.includes('DATE_RANGE')) {
      customField.dateStart = data.dateStart || null;
      customField.dateEnd = data.dateEnd || null;
      customField.dateOption = 'DATE_RANGE';
    }

    payload.customFields.push(customField);
  }

  return payload;
}
