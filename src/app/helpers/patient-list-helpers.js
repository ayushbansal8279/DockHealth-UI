export const PatientsListType = {
  DEFAULT: 'DEFAULT',
  CUSTOM: 'ADHOC',
};

export const DefaultPatientsListType = {
  ARCHIVED_PATIENTS: 'ARCHIVED_PATIENTS',
  ALL_PATIENTS: 'ALL_PATIENTS',
  ACTIVE_PATIENTS: 'ACTIVE_PATIENTS',
};

export const DefaultPatientListUrl = {
  [DefaultPatientsListType.ALL_PATIENTS]: 'all',
  [DefaultPatientsListType.ARCHIVED_PATIENTS]: 'archived',
  [DefaultPatientsListType.ACTIVE_PATIENTS]: 'active',
};

export function getPatientListIdentifierByUrlParameter(urlParameter) {
  if (!urlParameter) return undefined;

  const defaultPatientListIdentifier = Object.entries(
    DefaultPatientListUrl,
  ).find(({ 1: value }) => value === urlParameter)?.[0];

  return defaultPatientListIdentifier ?? urlParameter;
}

export function getPatientsListFiltersStorageKey(patientsListIdentifier) {
  return `PATIENTS_LIST_${patientsListIdentifier}`;
}

export const PatientColumn = {
  MEMBER: 'patient',
  UNIQUE_ID: 'mrn',
  DOB: 'dob',
  AGE: 'age',
  GENDER_AT_BIRTH: 'gender',
  GENDER_IDENTITY: 'genderIdentity',
};
