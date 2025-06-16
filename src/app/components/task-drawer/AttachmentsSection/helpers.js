import memoizeWith from 'ramda/src/memoizeWith';
import identity from 'ramda/src/identity';

import { getTaskAttachment } from 'api/task-api';
import { Image, Movie, Description, Audiotrack } from '@mui/icons-material';

export const acceptedFileFormats = [
  'application/pdf',
  'application/zip',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'audio/*',
  'image/*',
  'video/*',
  'text/html',
  'text/plain',
  'text/xml',
  'text/csv',
].join(', ');

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
  CLEAN: 'Not Scanned',
  INFECTED: 'Quarantined',
  IN_PROGRESS: 'Scanning in progress',
  ERROR: 'Error in file scanning',
  UNSUPPORTED: 'Not Scanned',
};

export const UNSUPPORTED_WARNING_MESSAGE =
  'This file could not be scanned for malware since it may be password protected';
