/* eslint-disable import/prefer-default-export */
export function formatMetaDataOutput(outputData) {
  const metadata = outputData.taskMetaData;

  const formattedMetadata = Object.keys(metadata).map(key => {
    return {
      customFieldIdentifier: key,
      value: metadata[key],
    };
  });

  return { ...outputData, taskMetaData: formattedMetadata };
}
