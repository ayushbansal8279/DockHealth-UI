/* eslint-disable import/prefer-default-export */
import isEmpty from 'ramda/src/isEmpty';

export function formatMetaDataOutput(outputData) {
  const metadata = outputData.providerMetaData;

  if (!metadata || isEmpty(metadata)) return outputData;

  // remove metadata with no values - only keep UUID keys
  const filteredMetaDataKeys = Object.keys(metadata).filter(
    key => key.length === 36,
  );

  const formattedMetadata = filteredMetaDataKeys.map(key => {
    if (Array.isArray(metadata[key])) {
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

  return { ...outputData, providerMetaData: formattedMetadata };
}
