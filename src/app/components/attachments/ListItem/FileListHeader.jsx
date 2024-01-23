import React from 'react';
import { HeaderCell, HeaderRow } from './styled';

const FileListHeader = ({ isFolder = false }) => {
  return (
    <HeaderRow>
      <HeaderCell>{isFolder ? 'Folder name' : 'File name'}</HeaderCell>
      <HeaderCell>{isFolder ? 'Created by' : 'Uploaded by'}</HeaderCell>
      <HeaderCell>Status</HeaderCell>
      <HeaderCell>{isFolder ? 'Created on' : 'Upload date'}</HeaderCell>
    </HeaderRow>
  );
};

export default FileListHeader;
