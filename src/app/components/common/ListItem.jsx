/* eslint-disable @typescript-eslint/no-unused-vars */
import { ButtonBase } from '@material-ui/core';
import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import palette, { opacify } from 'styles/palette';

const ItemContainer = styled(({ selected, ...otherProps }) => (
  <ButtonBase {...otherProps} />
))`
  && {
    display: block;
    height: 56px;
    width: 100%;
    padding: 0 8px;
    ${({ selected }) => selected && `background: ${palette.softCyan};`} :hover,
    :focus {
      ${({ selected }) =>
        !selected && `background: ${opacify(palette.black, 0.08)};`}
    }
  }
`;

ItemContainer.propTypes = {
  selected: PropTypes.bool,
};

ItemContainer.defaultProps = {
  selected: false,
};

const Item = styled.div`
  padding: 0 20px;
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
  border-bottom: 1px solid ${opacify(palette.black, 0.12)};
  font-size: 12px;
`;

const ListItem = ({ children, selected, onClick, id, style }) => (
  <ItemContainer
    selected={selected}
    onClick={onClick}
    id={id}
    as={onClick ? undefined : 'div'}
    style={style}
  >
    <Item>{children}</Item>
  </ItemContainer>
);

ListItem.propTypes = {
  children: PropTypes.node.isRequired,
  selected: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

ListItem.defaultProps = {
  selected: false,
  id: null,
};

export default ListItem;
