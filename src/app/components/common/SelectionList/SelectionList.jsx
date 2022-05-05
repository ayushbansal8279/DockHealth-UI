import { arrayOf, func, shape, string } from 'prop-types';
import React from 'react';
import palette from 'styles/palette';
import { ListWrapper } from './styled';

const SelectionList = props => {
  const { selectedId, list, onSelect, onParentChange } = props;

  return (
    <ListWrapper>
      {list?.map(({ id, name }) => (
        <p>
          <span
            style={{
              color:
                selectedId === id ? palette.brightBlue : palette.mediumGrey,
            }}
            onClick={() => onSelect(id)}
          >
            {name}
          </span>
          <span onClick={() => onParentChange(id)}>Go</span>
        </p>
      )) ?? 'List is empty'}
    </ListWrapper>
  );
};

SelectionList.propTypes = {
  selectedId: string,
  list: arrayOf(
    shape({
      id: string.isRequired,
      name: string.isRequired,
    }),
  ),
  onSelect: func.isRequired,
  onParentChange: func.isRequired,
};

SelectionList.defaultProps = {
  selectedId: null,
  list: null,
};

export default SelectionList;
