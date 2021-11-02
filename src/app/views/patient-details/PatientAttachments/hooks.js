/* eslint-disable react-hooks/rules-of-hooks */
import { useState, useCallback, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useDropzone } from 'react-dropzone';
import { memoizeWith, identity, isEmpty } from 'ramda';
import {
  patientSelector,
  patientDocumentsSelector,
} from 'selectors/patient-details-selectors';
import {
  fetchPatientAttachments,
  addPatientAttachment,
  removePatientAttachment,
} from 'sagas/patient-details-saga';
import { getPatientAttachment } from 'api/patient-attachment-api';
import { useBoolean } from 'hooks/useBoolean';

export const getMemoPatientAttachment = memoizeWith(
  identity,
  attachmentIdentifier =>
    attachmentIdentifier
      ? getPatientAttachment(attachmentIdentifier)
      : Promise.reject(),
);

const initializeAttachmentsSectionHooks = () => {
  const dispatch = useDispatch();
  const patient = useSelector(patientSelector);
  //  dispatch(fetchPatientAttachments(patient?.patientIdentifier));
  const patientIdentifier = patient?.patientIdentifier;

  useEffect(() => {
    if (patientIdentifier) {
      dispatch(fetchPatientAttachments(patientIdentifier));
    }
  }, [dispatch, patientIdentifier]);

  const attachmentFileInputReference = useRef(null);
  const attachments = useSelector(patientDocumentsSelector) || [];

  const [attachmentsSources, setAttachmentSources] = useState([]);
  const [
    attachmentsLoading,
    setAttachmentsLoading,
    unsetAttachmentsLoading,
  ] = useBoolean(false);

  const [
    currentlyUploadedAttachment,
    setCurrentlyUploadedAttachment,
  ] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [
    isAttachmentPreviewOpen,
    showAttachmentPreview,
    hideAttachmentPreview,
  ] = useBoolean(false);
  const [previewedAttachment, setPreviewedAttachment] = useState(null);

  const onAttachmentFileInputChange = useCallback(
    files => {
      if (files && !isEmpty(files)) {
        const [newAttachment, ...restAttachments] = files;

        setCurrentlyUploadedAttachment(newAttachment);
        setUploadProgress(0);

        dispatch(
          addPatientAttachment(
            patient?.patientIdentifier,
            newAttachment,
            {
              onUploadProgress: ({ loaded, total }) => {
                setUploadProgress(Math.round((loaded * 100) / total));
              },
            },
            setCurrentlyUploadedAttachment,
            onAttachmentFileInputChange,
            restAttachments,
          ),
        );
      }
    },
    [dispatch, patient],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onAttachmentFileInputChange,
  });

  const loadAttachmentsContent = useCallback(
    ({ attachmentsToReload }) => {
      setAttachmentsLoading();

      Promise.all(
        attachmentsToReload.map(
          async ({ attachmentIdentifier, fileName, contentType }) => {
            const { data } = await getMemoPatientAttachment(
              attachmentIdentifier,
            );

            const fileSource = await new Promise((resolve, reject) => {
              const reader = new FileReader();

              reader.onloadend = () => {
                // replace base64 type with content type from server
                resolve(
                  reader.result.replace(
                    /data:[^;]+;base64/,
                    `data:${contentType};base64`,
                  ),
                );
              };

              reader.addEventListener('error', reject);

              reader.readAsDataURL(data);
            });

            return {
              attachmentIdentifier,
              fileName,
              fileSource,
              contentType,
            };
          },
        ),
      ).then(downloadedAttachments => {
        unsetAttachmentsLoading();
        setAttachmentSources(downloadedAttachments);
      });
    },
    [setAttachmentsLoading, unsetAttachmentsLoading],
  );

  const boundRemovePatientAttachment = useCallback(
    ({ attachmentIdentifier }) => {
      dispatch(
        removePatientAttachment(patientIdentifier, attachmentIdentifier),
      );
    },
    [dispatch, patientIdentifier],
  );

  const openAttachmentPreview = useCallback(
    attachment => {
      setPreviewedAttachment(attachment);
      loadAttachmentsContent({
        attachmentsToReload: [attachment],
      });
      showAttachmentPreview();
    },
    [loadAttachmentsContent, showAttachmentPreview],
  );

  return {
    attachmentsSources,
    currentPatientAttachments: attachments,
    attachmentsLoading,
    removePatientAttachment: boundRemovePatientAttachment,
    attachmentFileInputReference,
    uploadProgress,
    currentlyUploadedAttachment,
    openAttachmentPreview,
    isAttachmentPreviewOpen,
    hideAttachmentPreview,
    previewedAttachment,
    dropzone: {
      getRootProps,
      getInputProps,
      isDragActive,
    },
  };
};

export default initializeAttachmentsSectionHooks;
