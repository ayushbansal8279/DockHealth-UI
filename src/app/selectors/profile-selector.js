import { createSelector } from 'reselect';
import { ProfileAttachmentType } from '../helpers/profile-helpers';

export const ProfileStateSelector = (state) => state.profile;

export const profileSelector = createSelector(
  ProfileStateSelector,
  ({profile}) => profile,
)

export const currentProfileTypeIdentifierSelector = createSelector(
  ProfileStateSelector,
  ({ currentProfileTypeIdentifier }) => currentProfileTypeIdentifier,
);

export const currentProfileIdentifierSelector = createSelector(
  ProfileStateSelector,
  ({ currentProfileIdentifier }) => currentProfileIdentifier,
);

export const profileAttachmentsSelector = createSelector(
  ProfileStateSelector,
  ({ attachments }) =>
    attachments?.filter(({ type }) => type !== ProfileAttachmentType.FOLDER) ??
    null,
);

export const profileFoldersSelector = createSelector(
  ProfileStateSelector,
  ({ attachments }) =>
    attachments?.filter(({ type }) => type === ProfileAttachmentType.FOLDER) ??
    null,
);

export const profileTaskAttachmentSelector = createSelector(
  ProfileStateSelector,
  ({profileTaskAttachments}) => profileTaskAttachments
)