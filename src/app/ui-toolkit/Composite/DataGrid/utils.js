export const getValues = (record) => {
  return record.fields.map(
    (field) =>
      field.values?.[0] ||
      field.values?.[0]?.value ||
      field.values?.[0]?.customFieldOption?.name,
  );
};
