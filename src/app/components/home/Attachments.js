import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import ButtonBase from '@material-ui/core/ButtonBase';
import Attachment from './Attachment';

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

const Attachments = ({ taskId, attachments }) => {
  const handleUpload = useCallback(() => { console.log('NYI'); });

  return (
    <React.Fragment>
      <AddAttachment>Add an attachment</AddAttachment>
      {attachments.map(attachment => <Attachment {...attachment} key={attachment.id} />)}
    </React.Fragment>
  );
};

Attachments.propTypes = {
  taskId: PropTypes.number.isRequired,
  attachments: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    size: PropTypes.number,
  })),
};

Attachments.defaultProps = {
  attachments: [{
    id: 0,
    name: 'broken ankle.xray',
    size: 15,
  }],
};

export default Attachments;
