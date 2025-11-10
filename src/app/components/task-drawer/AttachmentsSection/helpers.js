import memoizeWith from 'ramda/src/memoizeWith';
import identity from 'ramda/src/identity';

import { getTaskAttachment } from 'api/task-api';
import { Image, Movie, Description, Audiotrack } from '@mui/icons-material';

export const acceptedFileTypes = {
  'image/png': ['.png'],
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/jpg': ['.jpg'],
  'image/heic': ['.heic'],
  'image/tiff': ['.tiff'],
  'application/pdf': ['.pdf'],
  'text/plain': ['.txt'],
  'text/csv': ['.csv'],
  'application/vnd.ms-excel': ['.xls'],
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': [
    '.xlsx',
  ],
  'application/vnd.ms-excel.sheet.macroEnabled.12': ['.xlsm'],
  'application/vnd.ms-excel.sheet.binary.macroEnabled.12': ['.xlsb'],
  'application/msword': ['.doc'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [
    '.docx',
  ],
  'application/vnd.ms-powerpoint': ['.ppt'],
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': [
    '.pptx',
  ],
  'application/vnd.apple.numbers': ['.numbers'],
  'application/vnd.apple.pages': ['.pages'],
};

export const allowedExtensions = [
  '.png',
  '.jpg',
  '.jpeg',
  '.heic',
  '.tiff',
  '.pdf',
  '.txt',
  '.csv',
  '.xlsx',
  '.xlsm',
  '.xlsb',
  '.xls',
  '.doc',
  '.docx',
  '.ppt',
  '.pptx',
  '.numbers',
  '.pages',
];

export const isValidFileType = (file) => {
  if (!file) return false;

  if (file.type) {
    const mimeTypeKeys = Object.keys(acceptedFileTypes);
    if (mimeTypeKeys.includes(file.type)) {
      return true;
    }
  }

  const fileName = file.name || '';
  const fileExtension = fileName
    .substring(fileName.lastIndexOf('.'))
    .toLowerCase();
  return allowedExtensions.includes(fileExtension);
};

export const errorMessage = `Invalid file type.`;

export const getMemoTaskAttachment = memoizeWith(
  identity,
  (attachmentIdentifier) =>
    attachmentIdentifier
      ? getTaskAttachment(attachmentIdentifier)
      : Promise.reject(),
);

export const getIconFromContentType = ({ contentType }) => {
  if (contentType.startsWith('image/')) {
    return Image;
  }

  if (contentType.startsWith('video/')) {
    return Movie;
  }

  if (contentType.startsWith('audio/')) {
    return Audiotrack;
  }

  return Description;
};

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
