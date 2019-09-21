import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useDropzone } from 'react-dropzone';
import ButtonBase from '@material-ui/core/ButtonBase';
import Attachment from './Attachment';

const Container = styled.div`
  padding-right: 23px;
`;

const AddAttachment = styled(ButtonBase)`
  && {
    font-size: 14px;
    color: #aab8c3;
    padding: 8px;
    margin-left: -8px;
    border-radius: 4px;
    font-style: italic;
  }
`;

const Attachments = ({
  taskId, attachments, onAddAttachment, onRemoveAttachment
}) => {
  const onDrop = useCallback((files) => {
    console.log('ATTACHMENT UPLOAD', files);
    onAddAttachment(files)
  }, [taskId]);

  const handleRemove = useCallback((attachmentId) => {
    console.log('REMOVING ATTACHMENT');
    onRemoveAttachment(attachmentId)
  }, [taskId]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const {
    tabIndex, onClick, onKeyDown, onFocus, onBlur, ...rootProps
  } = getRootProps();
  const buttonProps = {
    tabIndex, onClick, onKeyDown, onFocus, onBlur,
  };

  return (
    <Container>
      <div isDragActive={isDragActive} {...rootProps}>
        <input {...getInputProps()} />
        <AddAttachment {...buttonProps}>{isDragActive ? 'Drop files here to add them as attachments' : 'Add an attachment'}</AddAttachment>
        {attachments.map(attachment => (
          <Attachment {...attachment} remove={handleRemove} key={attachment.attachmentId} id={attachment.attachmentId} name={attachment.fileName} size={attachment.fileSize}/>
        ))}
      </div>
    </Container>
  );
};

Attachments.propTypes = {
  taskId: PropTypes.number.isRequired,
  attachments: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    size: PropTypes.number,
  })),
  upload: PropTypes.func.isRequired,
  remove: PropTypes.func.isRequired,
};

Attachments.defaultProps = {
  attachments: [{
    id: 0,
    name: 'broken ankle.xray',
    size: 15,
  },
  {
    id: 1,
    name: 'broken ankle.xray',
    size: 15,
  }],
};

export default Attachments;
