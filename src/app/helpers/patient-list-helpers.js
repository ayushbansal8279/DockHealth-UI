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
  if (!urlParameter) return;

  const defaultPatientListIdentifier = Object.entries(
    DefaultPatientListUrl,
  ).find(({ 1: value }) => value === urlParameter)?.[0];

  return defaultPatientListIdentifier ?? urlParameter;
}

export function getPatientsListFiltersStorageKey(patientsListIdentifier) {
  return `PATIENTS_LIST_${patientsListIdentifier}`;
}

export const PatientColumn = {
  PATIENT: 'patient',
  UNIQUE_ID: 'mrn',
  DOB: 'dob',
  AGE: 'age',
  GENDER_AT_BIRTH: 'gender',
  GENDER_IDENTITY: 'genderIdentity',
  EMAIL: 'email',
  MOBILE: 'phoneMobile',
  HOME: 'phoneHome',
};

export const PatientHeaderColumn = {
  PATIENT: 'PATIENT',
  UNIQUE_ID: 'UNIQUE_ID',
  DOB: 'DOB',
  AGE: 'AGE',
  GENDER_AT_BIRTH: 'GENDER_AT_BIRTH',
  GENDER_IDENTITY: 'GENDER_IDENTITY',
  EMAIL: 'EMAIL',
  MOBILE: 'MOBILE',
  HOME: 'HOME',
};

export const PATIENT_BASE_COLUMN_CONFIG = {
  [PatientHeaderColumn.PATIENT]: true,
  [PatientHeaderColumn.UNIQUE_ID]: true,
  [PatientHeaderColumn.DOB]: true,
  [PatientHeaderColumn.AGE]: true,
  [PatientHeaderColumn.GENDER_AT_BIRTH]: true,
  [PatientHeaderColumn.GENDER_IDENTITY]: true,
  [PatientHeaderColumn.EMAIL]: true,
  [PatientHeaderColumn.MOBILE]: true,
  [PatientHeaderColumn.HOME]: true,
};
