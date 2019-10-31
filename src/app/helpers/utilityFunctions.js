export const noop = () => {};

export const getPatientName = patient => {
  const { mrn, firstName, middleName, lastName } = patient || {};

  return `${lastName || ''}, ${firstName || ''} ${middleName || ''} ${mrn ||
    ''}`
    .replace(/\s{2,}/g, '')
    .trim()
    .replace(/^,$|^,|,$/, '');
};
