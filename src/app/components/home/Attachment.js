import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0 10px;
  background: #ededf0;
  height: 24px;
  margin-top: 2px;
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

const Remove = styled.div`
  color: #aab8c4;
  font-size: 12px;
  font-weight: 500;
  margin-left: auto;
`;

const Attachment = ({
  id, name, size, remove,
}) => {
  const handleRemove = useCallback(() => {
    remove(id);
  }, [id]);

  return (
    <Container>
      <Name>{name}</Name>
      <Size>{`(${size}K)`}</Size>
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
