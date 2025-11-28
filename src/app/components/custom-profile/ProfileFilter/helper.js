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

    if (
      data.options.includes('DATE_SINGLE') ||
      data.options.includes('SINGLE_DATE')
    ) {
      customField.date = data.date || null;
    }

    if (data.options.includes('NUMBER_RANGE')) {
      customField.numberStart = data.numberStart ?? null;
      customField.numberEnd = data.numberEnd ?? null;
    }

    if (data.options.includes('SINGLE_NUMBER')) {
      customField.singleNumber = data.singleNumber ?? null;
    }

    payload.customFields.push(customField);
  }

  return payload;
}
