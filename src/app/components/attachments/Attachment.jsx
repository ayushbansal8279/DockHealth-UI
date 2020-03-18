import { ButtonBase } from '@material-ui/core';
import axios from 'axios';
import PropTypes from 'prop-types';
import React, { useCallback } from 'react';
import styled from 'styled-components';
import { noop } from '../../helpers/utility-functions';

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

const Attachment = ({ id, name, size, remove }) => {
  const handleOpen = useCallback(() => {
    axios({
      url: `${process.env.HEYDOC_SERVICES_BASE_URL}task/attachment/download/${id}`,
      method: 'GET',
      responseType: 'blob',
      headers: {
        Accept: 'application/octet-stream',
      },
    })
      .then(response => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', name);
        document.body.append(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
        return 'success';
      })
      .catch(noop);
  }, [id, name]);

  const handleRemove = useCallback(() => {
    remove(id);
  }, [id, remove]);

  return (
    <Container>
      <Open onClick={handleOpen}>
        <Name>{name}</Name>
        {size && <Size>{`(${Math.round(size / 1000)}K)`}</Size>}
      </Open>
      <Remove onClick={handleRemove}>✕</Remove>
    </Container>
  );
};

Attachment.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  size: PropTypes.number.isRequired,
  remove: PropTypes.func.isRequired,
};

export default Attachment;
