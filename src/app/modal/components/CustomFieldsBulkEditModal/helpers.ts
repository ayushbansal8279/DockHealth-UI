import isEmpty from 'ramda/src/isEmpty';

export type FormattedMetaDataForApi = Array<
  | {
      customFieldIdentifier: string;
      selectedOptionIdentifiers: any;
    }
  | {
      customFieldIdentifier: string;
      value: any;
    }
>;

export type FormattedMetaDataForState = Array<
  | {
      customFieldIdentifier: string;
      values: any;
    }
  | {
      customFieldIdentifier: string;
      value: any;
    }
>;

export const formatMetaDataForApi = (
  metaData: Record<string, any>,
): FormattedMetaDataForApi | null => {
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

/**
 * This is mainly used for task list bulk edit
 */
export const convertMetaDataApiToState = (
  metaData: FormattedMetaDataForApi,
): FormattedMetaDataForState | null => {
  if (isEmpty(metaData)) {
    return null;
  }

  return metaData.map((metaItem) => {
    if ('selectedOptionIdentifiers' in metaItem) {
      const { selectedOptionIdentifiers, ...rest } = metaItem;
      return {
        ...rest,
        values: selectedOptionIdentifiers,
      };
    }
    return metaItem;
  });
};
