export const FilesViewType = {
  GRID: 'GRID',
  LIST: 'LIST',
};

export const PATIENT_FILES_VIEW_TYPE = 'PATIENT_FILES_VIEW_TYPE';

export const ScanStatus = {
  CLEAN: 'CLEAN',
  INFECTED: 'INFECTED',
  IN_PROGRESS: 'IN_PROGRESS',
  ERROR: 'ERROR',
  UNSUPPORTED: 'UNSUPPORTED',
};

export const ScanStatusText = {
  CLEAN: 'Scanned',
  INFECTED: 'Quarantined',
  IN_PROGRESS: 'Scanning in progress',
  ERROR: 'Error in file scanning',
  UNSUPPORTED: 'Not Scanned',
};

export const UNSUPPORTED_WARNING_MESSAGE =
  'This file could not be scanned for malware since it may be password protected';
