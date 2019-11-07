export const noop = () => {};

export const getPatientName = patientData => {
  const { withMrn = true, ...patient } = patientData || {};
  const { mrn, firstName, middleName, lastName } = patient || {};

  return `${lastName || ''}, ${firstName || ''} ${middleName ||
    ''} ${(withMrn && mrn) || ''}`
    .replace(/\s{2,}/g, '')
    .trim()
    .replace(/^,$|^,|,$/, '');
};

export const mergeRefs = refs => value => {
  refs.forEach(ref => {
    if (typeof ref === 'function') {
      ref(value);
    } else if (ref != null) {
      ref.current = value;
    }
  });
};
