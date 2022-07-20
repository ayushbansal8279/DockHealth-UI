/* eslint-disable import/prefer-default-export */
export function formatMetaDataOutput(outputData) {
  const metadata = outputData.taskMetaData;
  const filteredMetaDataKeys = Object.keys(metadata).filter(
    key => key.length === 36 && metadata[key],
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

  return { ...outputData, taskMetaData: formattedMetadata };
}
