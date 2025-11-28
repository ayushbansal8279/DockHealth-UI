import {
  addTaskAttachment,
  renameTaskAttachment,
} from '@/app/actions/task-actions';
import { addWorkflowAttachment, updateWorkflowAttachment } from '@/app/actions/workflow-actions';
import {
  createPatientAttachment,
  updatePatientAttachment,
} from '@/app/actions/patient-details-actions';
import {
  createProfileAttachment,
  updateProfileAttachment,
} from '@/app/actions/profile-actions';
import { FileContext } from '@/app/helpers/task-helpers';

const saveEditedAttachment = (
  dispatch,
  context,
  file,
  fileName,
  contextIdentifier,
  hideAttachmentPreview,
  attachment,
) => {
  if (!contextIdentifier) {
    console.error('No contextIdentifier provided for saving edited attachment');
    return;
  }
  const renamedFileName = fileName.replace(/(\.[\w\d_-]+)$/i, '_original$1');

  const onAttachmentFileInputChange = () => {
    hideAttachmentPreview();
  };

  const setCurrentlyUploadedAttachment = () => null;

  switch (context) {
    case FileContext.TASK:
      dispatch(addTaskAttachment(contextIdentifier, file, {}));
      dispatch(
        renameTaskAttachment(
          attachment?.taskIdentifier,
          attachment?.attachmentIdentifier,
          renamedFileName,
        ),
      );
      hideAttachmentPreview();
      break;

    case FileContext.WORKFLOW:
      dispatch(addWorkflowAttachment(contextIdentifier, file, {}));
      dispatch(
        updateWorkflowAttachment(
          attachment?.taskWorkflowIdentifier,
          attachment?.attachmentIdentifier,
          renamedFileName,
        ),
      );
      hideAttachmentPreview();
      break;

    case FileContext.PATIENT:
      dispatch(
        createPatientAttachment(
          contextIdentifier,
          '',
          file,
          {},
          setCurrentlyUploadedAttachment,
          onAttachmentFileInputChange,
        ),
      );
      dispatch(
        updatePatientAttachment(attachment, {
          fileName: renamedFileName,
        }),
      );
      break;

    case FileContext.OBJECT:
      dispatch(
        createProfileAttachment(
          contextIdentifier,
          '',
          file,
          {},
          setCurrentlyUploadedAttachment,
          onAttachmentFileInputChange,
        ),
      );
      dispatch(
        updateProfileAttachment(attachment, {
          fileName: renamedFileName,
        }),
      );
      break;

    default:
      console.error('Unknown context for saving edited attachment:', context);
      break;
  }
};

export default saveEditedAttachment;