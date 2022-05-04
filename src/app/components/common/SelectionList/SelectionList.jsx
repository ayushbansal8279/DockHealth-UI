import { arrayOf, func, shape, string } from 'prop-types';
import React from 'react';
import { ListWrapper } from './styled';

const SelectionList = props => {
  const { selectedListId, list, onSelect, onFolderChange } = props;
  console.log('selectedListId', selectedListId);
  console.log('list', list);
  console.log('onSelect', onSelect);
  console.log('onFolderChange', onFolderChange);

  return <ListWrapper>Selection list</ListWrapper>;
};

SelectionList.propTypes = {
  selectedListId: string,
  list: arrayOf(
    shape({
      id: string.isRequired,
      name: string.isRequired,
    }),
  ),
  onSelect: func.isRequired,
  onFolderChange: func.isRequired,
};

SelectionList.defaultProps = {
  selectedListId: null,
  list: null,
};

export default SelectionList;
