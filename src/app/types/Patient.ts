import { PatientDto } from './swagger/models/PatientDto';
import { PatientImportProcessTrackingDto } from './swagger/models/PatientImportProcessTrackingDto';
import { PatientMetaDataDto } from './swagger/models/PatientMetaDataDto';

export type PatientMetaData = PatientMetaDataDto;

export interface Patient extends PatientDto {
  isSelected?: boolean; // frontend custom field to open drawer
  patientMetaData: PatientMetaData[];
}

export type ExtendedPatient = Patient & {
  [key: string]: any | string | undefined;
};

export type PatientImportProcessTracking = PatientImportProcessTrackingDto;
