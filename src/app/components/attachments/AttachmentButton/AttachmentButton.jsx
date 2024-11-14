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
import * as WorkflowActions from 'actions/workflow-actions';

const AttachmentButton = ({ attachment, onClick, onRemoveClick , renameAttachmentDispatch }) => {
  const { attachmentIdentifier, fileName, contentType } = attachment;
  const IconComponent = getIconFromContentType({ contentType });
  const dispatch = useDispatch();
  const [fileName1, setFileName] = useState(fileName);

  const renameTaskWorkflowAttachment = useCallback(
    (file) => {
      dispatch(
        openModal('PatientFolder', {
          title: 'Rename File',
          inputLabel: 'File Name',
          currentName: file.fileName,
          onChange: (newFileName) => {
            setFileName(newFileName);
            dispatch(
              WorkflowActions.updateWorkflowAttachment(
                file?.taskWorkflowIdentifier,
                file?.attachmentIdentifier,
                newFileName
              )
            )
          },
        })
      );
    },
    [dispatch]
  );

  const renameAttachment = useCallback(
    (file) => {
      dispatch(
        openModal('PatientFolder', {
          title: 'Rename File',
          inputLabel: 'File Name',
          currentName: file.fileName,
          onChange: (newFileName) => {
            setFileName(newFileName);
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
        onRemoveClick(attachmentIdentifier);
      }
    },
    [onRemoveClick]
  );

  const getFileOptions = useCallback(
    (attachment) => [
      ...(attachment.scanStatus && attachment.scanStatus !== 'IN_PROGRESS' 
        ? [{ name: 'Preview', onClick: () => {openAttachmentPreview(attachment)} }] 
        : []
      ),
      { name: 'Rename', 
        onClick: () => {
          if(attachment.taskIdentifier){
            renameAttachment(attachment)
          }else if(attachment.taskWorkflowIdentifier){
            renameTaskWorkflowAttachment(attachment)
          }
        }
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
    <Tooltip key={attachmentIdentifier} title={fileName1}>
      <Container
        download={fileName1}
        onClick={(event) => {
          event.stopPropagation();
          event.preventDefault();
          onClick(attachment);
        }}
      >
        <IconComponent color="inherit" fontSize="small" />
        <Spacing horizontal={2} />
        <OutfitTypography condensed variant="h4" weight="bold" noWrap>
          {fileName1}
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
