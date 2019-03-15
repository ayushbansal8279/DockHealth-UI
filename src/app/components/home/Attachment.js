import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import ButtonBase from '@material-ui/core/ButtonBase';

const Container = styled.div`
  && {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    background: #ededf0;
    height: 24px;
    margin-top: 2px;
  }
`;

const Name = styled.div`
  color: #00a0c9;
  font-size: 12px;
`;

const Size = styled.div`
  font-size: 12px;
  color: #1d1d1d;
  font-weight: 500;
  margin-left: 20px;
`;

const Open = styled(ButtonBase)`
  && {
    height: 100%;
    flex: 1;
    padding: 0 10px;
    justify-content: flex-start;
  }
`;

const Remove = styled(ButtonBase)`
&& {
  height: 100%;
  width: 26px;
  color: #aab8c4;
  font-size: 12px;
  font-weight: 500;
  margin-left: auto;
}
`;

const Attachment = ({
  id, name, size, remove,
}) => {
  const handleOpen = useCallback((e) => {
    e.stopPropagation();
    console.log('DOWNLOAD');
  });

  const handleRemove = useCallback((e) => {
    e.stopPropagation();
    console.log('REMOVE');
    // remove(id);
  }, [id]);

  return (
    <Container>
      <Open onClick={handleOpen}>
        <Name>{name}</Name>
        <Size>{`(${size}K)`}</Size>
      </Open>
      <Remove onClick={handleRemove}>✕</Remove>
    </Container>);
};

Attachment.propTypes = {
  attachment: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    size: PropTypes.number,
  }).isRequired,
};

export default Attachment;
