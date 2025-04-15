export function formatMetaDataOutput(outputData, updatedField) {
  const metadata = outputData.taskMetaData;
  const filteredMetaDataKeys = Object.keys(metadata).filter(
    (key) => key.length === 36,
  );
  const updatedFieldKey = updatedField?.split('.')?.[1];

  const formattedMetadata = filteredMetaDataKeys.map((key) => {
    if (Array.isArray(metadata[key])) {
      return {
        customFieldIdentifier: key,
        values: metadata[key],
        ...(key === updatedFieldKey ? { isFieldUpdated: true } : {}),
      };
    }
    return {
      customFieldIdentifier: key,
      value: metadata[key],
      ...(key === updatedFieldKey ? { isFieldUpdated: true } : {}),
    };
  });

  return { ...outputData, taskMetaData: formattedMetadata };
}