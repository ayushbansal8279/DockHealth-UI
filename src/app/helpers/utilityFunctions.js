import curry from 'ramda/es/curry';

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
      // eslint-disable-next-line no-param-reassign
      ref.current = value;
    }
  });
};

export const isTaskArchivable = curry(
  (currentUserProfile, task) =>
    task?.status === 'COMPLETE' &&
    !task?.parentTaskId &&
    !task?.archivedByUser
);
