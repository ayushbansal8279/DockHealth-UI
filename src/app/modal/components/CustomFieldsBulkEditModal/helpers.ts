import isEmpty from 'ramda/src/isEmpty';

export type FormattedMetaData = Array<
  | {
      customFieldIdentifier: string;
      selectedOptionIdentifiers: any;
    }
  | {
      customFieldIdentifier: string;
      value: any;
    }
>;

export const formatMetaData = (
  metaData: Record<string, any>,
): FormattedMetaData | null => {
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
