import React, { useCallback, useState } from 'react';
import Spacing from 'components/common/Spacing';
import { OutfitTypography } from 'styles/theme';

import Tooltip from 'components/common/Tooltip/Tooltip';
import { Container, RemoveAttachmentButtonContainer } from './styled';
import { getIconFromContentType } from './helpers';
import OptionsMenu from 'components/common/OptionsMenu/OptionsMenu';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { renameTaskAttachment } from '@/app/actions/task-actions';
import { openModal } from '@/app/modal/actions';
import { useDispatch } from 'react-redux';
import { updateWorkflowAttachment } from '@/app/actions/workflow-actions';

const AttachmentButton = ({ attachment, onClick, onRemoveClick , renameAttachmentDispatch }) => {
  const { attachmentIdentifier, fileName, contentType } = attachment;
  const IconComponent = getIconFromContentType({ contentType });
  const dispatch = useDispatch();
  const [renderedName, setRenderedName] = useState(fileName);

  const renameAttachment = useCallback(
    (file) => {
      dispatch(
        openModal('PatientFolder', {
          title: 'Rename File',
          inputLabel: 'File Name',
          currentName: file.fileName,
          onChange: (newFileName) => {
            setRenderedName(newFileName);
            if(file.taskIdentifier)
            {
              renameAttachmentDispatch({
                type: 'RENAME_ATTACHMENT',
                attachmentIdentifier: file?.attachmentIdentifier,
                newFileName: newFileName,
              });
              dispatch(
                renameTaskAttachment(
                  file?.taskIdentifier,
                  file?.attachmentIdentifier,
                  newFileName
                )
              )
            } else if(file.taskWorkflowIdentifier)
            {
              dispatch(
                updateWorkflowAttachment(
                  file?.taskWorkflowIdentifier,
                  file?.attachmentIdentifier,
                  newFileName
                )
              )
            }            
          },
        })
      );
    },
    [dispatch]
  );
  
  const openAttachmentPreview = useCallback(() => {
    onClick(attachment);
  }, [onClick, attachment]);
  

  const removeAttachmentHandler = useCallback(
    (attachmentIdentifier) => {
      if (onRemoveClick) {
        dispatch(openModal('DeleteConfirmation',{
          title: 'Delete Attachment',
          description: 'Are you sure you want to delete this attachment? This action cannot be undone.',
          confirm: () => { onRemoveClick(attachmentIdentifier); }
        }))
      }
    },
    [dispatch, onRemoveClick]
  );

  const getFileOptions = useCallback(
    (attachment) => [
      ...(attachment.scanStatus && attachment.scanStatus !== 'IN_PROGRESS' 
        ? [{ name: 'Preview', onClick: () => {openAttachmentPreview(attachment)} }] 
        : []
      ),
      { name: 'Rename', 
        onClick: () => {renameAttachment(attachment)}
      },
      {
        name: 'Delete',
        onClick: () => {removeAttachmentHandler(attachment?.attachmentIdentifier)},
      },
    ],
    [
      openAttachmentPreview,
      renameAttachment,
      removeAttachmentHandler,
    ],
  );
  
  return (
    <Tooltip key={attachmentIdentifier} title={renderedName}>
      <Container
        download={renderedName}
        onClick={(event) => {
          event.stopPropagation();
          event.preventDefault();
          onClick(attachment);
        }}
      >
        <IconComponent color="inherit" fontSize="small" />
        <Spacing horizontal={2} />
        <OutfitTypography condensed variant="h4" weight="bold" noWrap>
          {renderedName}
        </OutfitTypography>
        {typeof onRemoveClick === 'function' && (
          <RemoveAttachmentButtonContainer>
             <div onClick={(event) => event.stopPropagation()} >
             <OptionsMenu options={getFileOptions(attachment)}>
              <MoreVertIcon />
            </OptionsMenu>
           </div>
          </RemoveAttachmentButtonContainer>
        )}
      </Container>
    </Tooltip>
  );
};

export default AttachmentButton;
