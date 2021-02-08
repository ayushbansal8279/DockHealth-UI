import { memoizeWith, identity } from 'ramda';

import { getTaskAttachment } from 'api/task-api';
import { Image, Movie, Description, Audiotrack } from '@material-ui/icons';

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
  attachmentIdentifier =>
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
