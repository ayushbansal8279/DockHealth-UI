import React from 'react';
import GenericHeader from 'components/template/GenericHeader/GenericHeader';
import { ListDescription } from './styled';

const ListSelectHeader = ({ taskList }) => {
  const { listName, listDescription } = taskList || {};

  return (
    <>
      <GenericHeader>
        {listName}
        <ListDescription>{listDescription}</ListDescription>
      </GenericHeader>
    </>
  );
};

export default ListSelectHeader;
