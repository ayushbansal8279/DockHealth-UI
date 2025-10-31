import { addTaskAttachment } from '@/app/actions/task-actions';
import { addWorkflowAttachment } from '@/app/actions/workflow-actions';
import { createPatientAttachment } from '@/app/actions/patient-details-actions';
import { createProfileAttachment } from '@/app/actions/profile-actions';
import { FileContext } from '@/app/helpers/task-helpers';

const saveEditedAttachment = (
  dispatch,
  context,
  file,
  fileName,
  contextIdentifier,
  hideAttachmentPreview,
) => {
  if (!contextIdentifier) {
    console.error('No contextIdentifier provided for saving edited attachment');
    return;
  }

  const onAttachmentFileInputChange = () => {
    hideAttachmentPreview();
  };

  const setCurrentlyUploadedAttachment = () => null;

  switch (context) {
    case FileContext.TASK:
      dispatch(addTaskAttachment(contextIdentifier, file, {}));
      hideAttachmentPreview();
      break;

    case FileContext.WORKFLOW:
      dispatch(addWorkflowAttachment(contextIdentifier, file, {}));
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
      
      break;

    default:
      console.error('Unknown context for saving edited attachment:', context);
      break;
  }
};

export default saveEditedAttachment;