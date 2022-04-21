import React from 'react';
import { HeaderCell, HeaderRow } from './styled';

const FileListHeader = () => {
  return (
    <HeaderRow>
      <HeaderCell>File name</HeaderCell>
      <HeaderCell>Created by</HeaderCell>
      <HeaderCell>Created on</HeaderCell>
    </HeaderRow>
  );
};

export default FileListHeader;
