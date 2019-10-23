import Grid from '@material-ui/core/Grid';
import React from 'react';
import styled from 'styled-components';

const TitleContainer = styled.div`
  align-items: center;
  background-color: #007cab;
  color: #000;
  display: flex;
  height: 88px;
  left: 100%;
  position: absolute;
  transition: top 0.2s ease-out;
  top: ${props => (props.open ? 0 : -88)}px;
  width: calc(100vw - 100%);
  z-index: 10;
`;

const Title = styled.div`
  color: #fff;
  font-size: 32px;
  padding-left: 2rem;
`;

export default ({ header }) => {
  const { show, title, rightComponents } = header;

  return (
    <TitleContainer open={show}>
      <Grid container>
        <Grid item xs={6}>
          <Title>{title}</Title>
        </Grid>
        {rightComponents}
      </Grid>
    </TitleContainer>
  );
};
