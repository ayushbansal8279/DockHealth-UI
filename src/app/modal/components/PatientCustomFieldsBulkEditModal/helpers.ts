import isEmpty from 'ramda/src/isEmpty';

export const formatMetaData = (metaData: Record<string, any>) => {
  if (isEmpty(metaData)) {
    return null;
  }

  // remove metadata with no values - only keep UUID keys
  const filteredMetaDataKeys = Object.keys(metaData).filter(
    (key) => key.length === 36,
  );

  const formattedMetaData = filteredMetaDataKeys.map((key) => {
    if (Array.isArray(metaData[key])) {
      return {
        customFieldIdentifier: key,
        selectedOptionIdentifiers: metaData[key],
      };
    }
    return {
      customFieldIdentifier: key,
      value: metaData[key],
    };
  });

  return formattedMetaData;
};
