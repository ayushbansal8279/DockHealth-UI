export const PatientsListType = {
  DEFAULT: 'DEFAULT',
  CUSTOM: 'ADHOC',
};

export const DefaultPatientsListType = {
  ALL_PATIENTS: 'ALL_PATIENTS',
  ACTIVE_PATIENTS: 'ACTIVE_PATIENTS',
};

export const DefaultPatientListUrl = {
  [DefaultPatientsListType.ALL_PATIENTS]: 'all',
  [DefaultPatientsListType.ACTIVE_PATIENTS]: 'active',
};

export function getPatientListIdentifierByUrlParameter(urlParameter) {
  if (!urlParameter) return DefaultPatientsListType.ALL_PATIENTS;

  const defaultPatientListIdentifier = Object.entries(
    DefaultPatientListUrl,
  ).find(({ 1: value }) => value === urlParameter)?.[0];

  return defaultPatientListIdentifier ?? urlParameter;
}

export function getPatientsListFiltersStorageKey(patientsListIdentifier) {
  return `PATIENTS_LIST_${patientsListIdentifier}`;
}
